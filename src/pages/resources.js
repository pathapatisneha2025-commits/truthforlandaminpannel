import React, { useState, useEffect } from "react";
import axios from "axios";

/* ================= STYLES ================= */
const styles = {
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
  table: {
    width: "100%",
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

  // ===== Fetch all resources from backend =====
  const fetchResources = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/all`);
      setResources(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch resources");
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // ===== Handle form input changes =====
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, file });
  };

  // ===== Submit form =====
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
      if (editingId) {
        const res = await axios.put(`${BASE_URL}/update/${editingId}`, formData);
        setResources(resources.map((r) => (r.id === editingId ? res.data : r)));
        setEditingId(null);
      } else {
        const res = await axios.post(`${BASE_URL}/add`, formData);
        setResources([res.data, ...resources]);
      }

      setForm({ type: "", title: "", description: "", file: null });
    } catch (err) {
      console.error(err);
      alert("Failed to save resource");
    }
  };

  // ===== Edit resource =====
  const handleEdit = (res) => {
    setForm({ type: res.type, title: res.title, description: res.description, file: null });
    setEditingId(res.id);
  };

  // ===== Delete resource =====
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resource?")) return;
    try {
      await axios.delete(`${BASE_URL}/delete/${id}`);
      setResources(resources.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete resource");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Resources Admin Panel</h1>

      {/* ===== ADD / EDIT FORM ===== */}
      <form style={styles.form} onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit Resource" : "Add New Resource"}</h3>

        <select name="type" value={form.type} onChange={handleChange} style={styles.input} required>
          <option value="">Select Resource Type</option>
          {RESOURCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          style={styles.input}
          required={!editingId}
        />

        <button style={styles.button}>{editingId ? "Update Resource" : "Add Resource"}</button>
      </form>

      {/* ===== LIST TABLE ===== */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Title</th>
            <th style={styles.th}>Description</th> {/* Added Description */}
            <th style={styles.th}>File</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {resources.length === 0 && (
            <tr>
              <td colSpan="5" style={styles.td}>No resources added yet</td>
            </tr>
          )}
          {resources.map((res) => (
         <tr key={res.id}>
  <td style={styles.td}>{res.type}</td>
  <td style={styles.td}>{res.title}</td>
  <td style={styles.td}>{res.description}</td>
  <td style={styles.td}>
    {res.file_url && (
      <a
        href={res.file_url}
        download
        style={{ color: "#4a5d23", textDecoration: "underline", cursor: "pointer" }}
      >
        {res.file_url.split("/").pop()}
      </a>
    )}
  </td>
  <td style={styles.td}>
    <button
      style={{ ...styles.actionBtn, background: "#e5e7eb" }}
      onClick={() => handleEdit(res)}
    >
      ✏ Edit
    </button>
    <button
      style={{ ...styles.actionBtn, background: "#fee2e2" }}
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
  );
}
