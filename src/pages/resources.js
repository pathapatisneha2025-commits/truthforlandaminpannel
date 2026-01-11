import React, { useState, useEffect } from "react";

/* ================= STYLES ================= */
const baseStyles = {
  container: {
    padding: "50px",
    fontFamily: "Inter, sans-serif",
    backgroundColor: "#f9f8f3",
    minHeight: "100vh",
  },
  heading: { fontSize: "32px", fontWeight: "700", marginBottom: "25px" },
  form: {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "40px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    background: "#4a5d23",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  },
  tableContainer: {
    overflowX: "auto", // allows horizontal scroll on small screens
  },
  table: {
    width: "100%",
    minWidth: "600px", // ensures table doesn't shrink too much
    background: "#fff",
    borderCollapse: "collapse",
    borderRadius: "12px",
    overflow: "hidden",
  },
  th: { background: "#947a32", color: "#fff", padding: "12px", textAlign: "left" },
  td: { padding: "12px", borderBottom: "1px solid #eee", fontSize: "14px" },
  actionBtn: {
    padding: "6px 10px",
    marginRight: "6px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
  },
};

const RESOURCE_TYPES = ["Legal Document", "Guide", "Template", "Reference", "Checklist"];
const BASE_URL = "https://truthforlanddatabase.onrender.com/resources";

export default function AdminResourcesPanel() {
  const [resources, setResources] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ type: "", title: "", description: "", file: null });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ===== Fetch all resources =====
  const fetchResources = async () => {
    try {
      const res = await fetch(`${BASE_URL}/all`);
      if (!res.ok) throw new Error("Failed to fetch resources");
      const data = await res.json();
      setResources(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch resources");
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.type || !form.title || !form.description || (!form.file && !editingId)) {
      return alert("All fields are required");
    }

    const formData = new FormData();
    formData.append("type", form.type);
    formData.append("title", form.title);
    formData.append("description", form.description);
    if (form.file) formData.append("file", form.file);

    try {
      let res, data;
      if (editingId) {
        res = await fetch(`${BASE_URL}/update/${editingId}`, {
          method: "PUT",
          body: formData,
        });
        if (!res.ok) throw new Error("Failed to update resource");
        data = await res.json();
        setResources(resources.map((r) => (r.id === editingId ? data : r)));
        setEditingId(null);
      } else {
        res = await fetch(`${BASE_URL}/add`, {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Failed to add resource");
        data = await res.json();
        setResources([data, ...resources]);
      }
      setForm({ type: "", title: "", description: "", file: null });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleEdit = (res) => {
    setForm({ type: res.type, title: res.title, description: res.description, file: null });
    setEditingId(res.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resource?")) return;
    try {
      const res = await fetch(`${BASE_URL}/delete/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete resource");
      setResources(resources.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // ===== Responsive adjustments =====
  const responsiveContainer = {
    ...baseStyles.container,
    padding: windowWidth < 600 ? "20px 10px" : "50px",
  };
  const responsiveHeading = {
    ...baseStyles.heading,
    fontSize: windowWidth < 600 ? "24px" : "32px",
  };
  const responsiveForm = {
    ...baseStyles.form,
    padding: windowWidth < 600 ? "15px" : "25px",
  };
  const responsiveButton = {
    ...baseStyles.button,
    padding: windowWidth < 600 ? "8px 12px" : "10px 18px",
    fontSize: windowWidth < 600 ? "14px" : "16px",
  };
  const responsiveTd = {
    ...baseStyles.td,
    fontSize: windowWidth < 600 ? "12px" : "14px",
  };

  return (
    <div style={responsiveContainer}>
      <h1 style={responsiveHeading}>Resources Admin Panel</h1>

      <form style={responsiveForm} onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit Resource" : "Add New Resource"}</h3>

        <select name="type" value={form.type} onChange={handleChange} style={baseStyles.input} required>
          <option value="">Select Resource Type</option>
          {RESOURCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          style={baseStyles.input}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          style={baseStyles.input}
          required
        />

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          style={baseStyles.input}
          required={!editingId}
        />

        <button style={responsiveButton}>{editingId ? "Update Resource" : "Add Resource"}</button>
      </form>

      <div style={baseStyles.tableContainer}>
        <table style={baseStyles.table}>
          <thead>
            <tr>
              <th style={baseStyles.th}>Type</th>
              <th style={baseStyles.th}>Title</th>
              <th style={baseStyles.th}>Description</th>
              <th style={baseStyles.th}>File</th>
              <th style={baseStyles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.length === 0 && (
              <tr>
                <td colSpan="5" style={responsiveTd}>No resources added yet</td>
              </tr>
            )}
            {resources.map((res) => (
              <tr key={res.id}>
                <td style={responsiveTd}>{res.type}</td>
                <td style={responsiveTd}>{res.title}</td>
                <td style={responsiveTd}>{res.description}</td>
                <td style={responsiveTd}>
                  {res.file_url && (
                    <a
                      href={res.file_url}
                      download
                      style={{ color: "#4a5d23", textDecoration: "underline", cursor: "pointer", fontSize: windowWidth < 600 ? "12px" : "14px" }}
                    >
                      {res.file_url.split("/").pop()}
                    </a>
                  )}
                </td>
                <td style={responsiveTd}>
                  <button
                    style={{ ...baseStyles.actionBtn, background: "#e5e7eb" }}
                    onClick={() => handleEdit(res)}
                  >
                    ✏ Edit
                  </button>
                  <button
                    style={{ ...baseStyles.actionBtn, background: "#fee2e2" }}
                    onClick={() => handleDelete(res.id)}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
