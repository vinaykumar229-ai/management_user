import React, { useEffect, useState } from "react";

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function UserForm({ onClose, onCreate, onUpdate, editingUser }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingUser) {
      setForm({
        firstName: editingUser.firstName || "",
        lastName: editingUser.lastName || "",
        email: editingUser.email || "",
        department: editingUser.department || "",
      });
    }
  }, [editingUser]);

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name required.";
    if (!form.lastName.trim()) e.lastName = "Last name required.";
    if (!form.email.trim()) e.email = "Email required.";
    else if (!emailRegex.test(form.email)) e.email = "Invalid email.";
    // department optional
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (editingUser) {
      onUpdate(editingUser.id, form);
    } else {
      onCreate(form);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <header className="modal-header">
          <h3>{editingUser ? "Edit User" : "Add User"}</h3>
          <button className="close" onClick={onClose}>✕</button>
        </header>

        <form className="form" onSubmit={handleSubmit}>
          <label>
            First Name
            <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            {errors.firstName && <small className="field-error">{errors.firstName}</small>}
          </label>

          <label>
            Last Name
            <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            {errors.lastName && <small className="field-error">{errors.lastName}</small>}
          </label>

          <label>
            Email
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            {errors.email && <small className="field-error">{errors.email}</small>}
          </label>

          <label>
            Department
            <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="e.g. Engineering" />
          </label>

          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary">{editingUser ? "Save" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
