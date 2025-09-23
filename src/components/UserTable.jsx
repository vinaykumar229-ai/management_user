import React, { useEffect, useState, useMemo } from "react";
import {
  fetchUsers,
  createUser,
  updateUser,
  removeUser,
} from "../utils/api";
import UserForm from "./UserForm";
import FilterPopup from "./FilterPopup";
import Pagination from "./Pagination";

const DEFAULT_PAGE_SIZES = [10, 25, 50, 100];

export default function UserTable() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // UI state
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  // search/sort/filter/pagination
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState({ field: "id", dir: "asc" });
  const [filters, setFilters] = useState({ firstName: "", lastName: "", email: "", department: "" });
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchUsers();
      // Map API shape to our fields: id, firstName, lastName, email, department
      const mapped = res.data.map((u) => {
        const nameParts = (u.name || "").split(" ");
        return {
          id: u.id,
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          email: u.email || "",
          department: (u.company && u.company.name) || "N/A",
          raw: u,
        };
      });

      // JSONPlaceholder returns 10 users. For pagination demo we can replicate them into 40 by duplicating
      // to allow selecting larger page sizes. This is optional, but improves UX.
      const duplicates = [];
      for (let i = 0; i < 3; i++) {
        duplicates.push(...mapped.map((m) => ({ ...m, id: m.id + (i + 1) * 10 })));
      }
      const combined = [...mapped, ...duplicates]; // 40 users now
      setAllUsers(combined);
    } catch (err) {
      setError("Failed to load users. Check your network.");
    } finally {
      setLoading(false);
    }
  };

  // Derived list after search/filter/sort
  const processed = useMemo(() => {
    let list = [...allUsers];

    // simple query search across first/last/email/department
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (u) =>
          u.firstName.toLowerCase().includes(q) ||
          u.lastName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.department.toLowerCase().includes(q)
      );
    }

    // Filters from popup (exact or partial)
    if (filters.firstName) {
      list = list.filter((u) => u.firstName.toLowerCase().includes(filters.firstName.toLowerCase()));
    }
    if (filters.lastName) {
      list = list.filter((u) => u.lastName.toLowerCase().includes(filters.lastName.toLowerCase()));
    }
    if (filters.email) {
      list = list.filter((u) => u.email.toLowerCase().includes(filters.email.toLowerCase()));
    }
    if (filters.department) {
      list = list.filter((u) => u.department.toLowerCase().includes(filters.department.toLowerCase()));
    }

    // Sort
    const { field, dir } = sortBy;
    list.sort((a, b) => {
      let A = a[field];
      let B = b[field];
      if (typeof A === "string") A = A.toLowerCase();
      if (typeof B === "string") B = B.toLowerCase();
      if (A > B) return dir === "asc" ? 1 : -1;
      if (A < B) return dir === "asc" ? -1 : 1;
      return 0;
    });

    return list;
  }, [allUsers, query, sortBy, filters]);

  // Pagination
  const total = processed.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  const pageData = processed.slice((page - 1) * pageSize, page * pageSize);

  // Handlers
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await removeUser(id);
      setAllUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert("Delete failed — network error.");
    }
  };

  const handleCreate = async (payload) => {
    try {
      const res = await createUser(payload);
      // JSONPlaceholder returns a created object with id 11, etc. We'll integrate that into UI.
      const returned = res.data;
      // Create our view model
      const newUser = {
        id: returned.id || Math.max(...allUsers.map((u) => u.id)) + 1,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        department: payload.department || "N/A",
        raw: returned,
      };
      setAllUsers((prev) => [newUser, ...prev]);
      setShowForm(false);
    } catch {
      alert("Create failed — try again.");
    }
  };

  const handleUpdate = async (id, payload) => {
    try {
      await updateUser(id, payload);
      setAllUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...payload } : u)));
      setShowForm(false);
      setEditingUser(null);
    } catch {
      alert("Update failed — try again.");
    }
  };

  const toggleSort = (field) => {
    setSortBy((s) => {
      if (s.field === field) {
        return { field, dir: s.dir === "asc" ? "desc" : "asc" };
      }
      return { field, dir: "asc" };
    });
  };

  return (
    <section className="panel">
      <div className="panel-header">
        <div className="controls-left">
          <button className="btn primary" onClick={() => { setShowForm(true); setEditingUser(null); }}>
            + Add User
          </button>
          <button className="btn" onClick={() => setShowFilter(true)}>Filter</button>
        </div>

        <div className="controls-right">
          <input
            className="search"
            placeholder="Search by name, email or department..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <label className="inline">
            Per page:
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
              {DEFAULT_PAGE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="panel-body">
        {loading ? (
          <div className="center">Loading users...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            <div className="table-wrap">
              <table className="user-table">
                <thead>
                  <tr>
                    <th onClick={() => toggleSort("id")}>ID {sortBy.field === "id" ? (sortBy.dir === "asc" ? "▲" : "▼") : ""}</th>
                    <th onClick={() => toggleSort("firstName")}>First Name {sortBy.field === "firstName" ? (sortBy.dir === "asc" ? "▲" : "▼") : ""}</th>
                    <th onClick={() => toggleSort("lastName")}>Last Name {sortBy.field === "lastName" ? (sortBy.dir === "asc" ? "▲" : "▼") : ""}</th>
                    <th onClick={() => toggleSort("email")}>Email {sortBy.field === "email" ? (sortBy.dir === "asc" ? "▲" : "▼") : ""}</th>
                    <th onClick={() => toggleSort("department")}>Department {sortBy.field === "department" ? (sortBy.dir === "asc" ? "▲" : "▼") : ""}</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.length === 0 ? (
                    <tr><td colSpan="6" className="center">No users found.</td></tr>
                  ) : pageData.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.firstName}</td>
                      <td>{u.lastName}</td>
                      <td>{u.email}</td>
                      <td>{u.department}</td>
                      <td className="actions">
                        <button className="btn small" onClick={() => { setEditingUser(u); setShowForm(true); }}>Edit</button>
                        <button className="btn small danger" onClick={() => handleDelete(u.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              totalItems={total}
            />
          </>
        )}
      </div>

      {showForm && (
        <UserForm
          onClose={() => { setShowForm(false); setEditingUser(null); }}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          editingUser={editingUser}
        />
      )}

      {showFilter && (
        <FilterPopup
          initial={filters}
          onApply={(next) => { setFilters(next); setShowFilter(false); }}
          onClear={() => { setFilters({ firstName: "", lastName: "", email: "", department: "" }); setShowFilter(false); }}
          onClose={() => setShowFilter(false)}
        />
      )}
    </section>
  );
}
