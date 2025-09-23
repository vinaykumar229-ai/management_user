import React, { useState } from "react";

const FilterPopup = ({ users, setFilteredUsers }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: ""
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    const filtered = users.filter((u) => {
      const first = u.name.split(" ")[0]?.toLowerCase() || "";
      const last = u.name.split(" ")[1]?.toLowerCase() || "";
      const email = u.email.toLowerCase();
      const dept = u.company?.name?.toLowerCase() || "";

      return (
        (filters.firstName ? first.includes(filters.firstName.toLowerCase()) : true) &&
        (filters.lastName ? last.includes(filters.lastName.toLowerCase()) : true) &&
        (filters.email ? email.includes(filters.email.toLowerCase()) : true) &&
        (filters.department ? dept.includes(filters.department.toLowerCase()) : true)
      );
    });

    setFilteredUsers(filtered);
    setShowPopup(false);
  };

  const clearFilters = () => {
    setFilters({ firstName: "", lastName: "", email: "", department: "" });
    setFilteredUsers(users);
    setShowPopup(false);
  };

  return (
    <div className="filter-container">
      <button className="btn" onClick={() => setShowPopup(true)}>Filter</button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Filter Users</h3>

            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={filters.firstName}
              onChange={handleChange}
            />

            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={filters.lastName}
              onChange={handleChange}
            />

            <label>Email</label>
            <input
              type="text"
              name="email"
              value={filters.email}
              onChange={handleChange}
            />

            <label>Department</label>
            <input
              type="text"
              name="department"
              value={filters.department}
              onChange={handleChange}
            />

            <div className="popup-actions">
              <button className="btn apply" onClick={applyFilters}>Apply</button>
              <button className="btn clear" onClick={clearFilters}>Clear</button>
              <button className="btn cancel" onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPopup;
