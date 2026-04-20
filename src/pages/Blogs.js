import React, { useState, useEffect } from "react";

/* ================= CONFIG ================= */
const BASE_URL = "https://truthforlanddatabase.onrender.com/blogs";

/* ================= STYLES ================= */
const baseStyles = {
  container: {
    padding: "50px",
    fontFamily: "Inter, sans-serif",
    backgroundColor: "#f9f8f3",
    minHeight: "100vh",
    boxSizing: "border-box",
  },
  heading: { fontSize: "32px", fontWeight: "700", marginBottom: "25px" },

  form: {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "40px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
    maxWidth: "100%",
    boxSizing: "border-box",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    boxSizing: "border-box",
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

  tableContainer: { overflowX: "auto" },

  table: {
    width: "100%",
    minWidth: "800px",
    background: "#fff",
    borderCollapse: "collapse",
    borderRadius: "12px",
    overflow: "hidden",
  },

  th: {
    background: "#947a32",
    color: "#fff",
    padding: "12px",
    textAlign: "left",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
  },

  previewImg: {
    width: "80px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "6px",
  },
};

/* ================= COMPONENT ================= */
export default function AdminBlogPanel() {
  const [blogs, setBlogs] = useState([]);
  const [editingId, setEditingId] = useState(null);

  /* ================= FORM STATE ================= */
  const [form, setForm] = useState({
    category: "",
    type: "",
    title: "",
    slug: "",
    date: "",
    read_time: "",
    image: null,

    mainDescription: "",

    contentSections: [
      {
        highlight: "",
        sectionTitle: "",
        paragraph: "",
      },
    ],

    content: "",
  });

  /* ================= FETCH BLOGS ================= */
  const fetchBlogs = async () => {
  try {
    const res = await fetch(`${BASE_URL}/all`);

    console.log("STATUS:", res.status);

    if (!res.ok) {
      const text = await res.text();
      console.log("RAW RESPONSE:", text);
      throw new Error(`HTTP Error: ${res.status}`);
    }

    const data = await res.json();
    console.log("DATA LOADED:", data);

    const normalized = data.map((b) => ({
      ...b,
      mainDescription: b.main_description || "",
      contentSections: b.content_sections
        ? typeof b.content_sections === "string"
          ? JSON.parse(b.content_sections)
          : b.content_sections
        : [],
    }));

    setBlogs(normalized);
  } catch (err) {
    console.error("REAL ERROR:", err);
    alert("Failed to load blogs: " + err.message);
  }
};

  useEffect(() => {
    fetchBlogs();
  }, []);

  /* ================= INPUT HANDLERS ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleMainDesc = (value) => {
    setForm({ ...form, mainDescription: value });
  };

  const handleContent = (value) => {
    setForm({ ...form, content: value });
  };

  /* ================= SECTION HANDLERS ================= */
  const handleSectionChange = (index, field, value) => {
    const updated = [...form.contentSections];
    updated[index][field] = value;
    setForm({ ...form, contentSections: updated });
  };

  const addSection = () => {
    setForm({
      ...form,
      contentSections: [
        ...form.contentSections,
        { highlight: "", sectionTitle: "", paragraph: "" },
      ],
    });
  };

  const removeSection = (index) => {
    const updated = form.contentSections.filter((_, i) => i !== index);
    setForm({ ...form, contentSections: updated });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (key === "contentSections") {
        formData.append(
          "contentSections",
          JSON.stringify(form.contentSections)
        );
      } else if (key !== "image") {
        formData.append(key, form[key]);
      }
    });

    if (form.image) {
      formData.append("image", form.image);
    }

    const url = editingId
      ? `${BASE_URL}/update/${editingId}`
      : `${BASE_URL}/add`;

    await fetch(url, {
      method: editingId ? "PUT" : "POST",
      body: formData,
    });

    alert(editingId ? "Updated" : "Added");

    setForm({
  category: "",
  type: "",
  title: "",
  slug: "",
  date: "",
  read_time: "",
  image: null,
  mainDescription: "",
  divider: "",   // ✅ RESET
  contentSections: [
    { highlight: "", sectionTitle: "", paragraph: "" },
  ],
  content: "",
});

    setEditingId(null);
    fetchBlogs();
  };

  /* ================= EDIT ================= */
const handleEdit = (blog) => {
  setEditingId(blog.id);

  // ---------- safe parse sections ----------
  let sections = [];

  try {
    if (typeof blog.content_sections === "string") {
      sections = JSON.parse(blog.content_sections);
    } else if (Array.isArray(blog.content_sections)) {
      sections = blog.content_sections;
    } else {
      sections = [];
    }
  } catch (e) {
    sections = [];
  }

  // ---------- normalize sections ----------
  const normalizedSections =
    sections.length > 0
      ? sections.map((sec) => ({
          highlight: sec.highlight || "",
          sectionTitle: sec.sectionTitle || "",
          paragraph: sec.paragraph || "",
        }))
      : [{ highlight: "", sectionTitle: "", paragraph: "" }];

  // ---------- SET FORM (MATCHS BACKEND EXACTLY) ----------
 setForm({
  category: blog.category || "",
  type: blog.type || "",
  title: blog.title || "",
  slug: blog.slug || "",
  date: blog.date || "",
  read_time: blog.read_time || "",
  image: null,
  image_url: blog.image_url || "",
  mainDescription: blog.main_description || "",

  divider: blog.divider || "",   // ✅ NEW

  contentSections: normalizedSections,
  content: blog.content || "",
});
};

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;

    await fetch(`${BASE_URL}/delete/${id}`, {
      method: "DELETE",
    });

    fetchBlogs();
  };

  return (
    <div style={baseStyles.container}>
      <h1 style={baseStyles.heading}>Blogs Admin Panel</h1>

      {/* ================= FORM ================= */}
      <form style={baseStyles.form} onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit Blog" : "Add Blog"}</h3>

<input
  name="category"
  placeholder="Category"
  value={form.category}
  onChange={handleChange}
  style={baseStyles.input}
/>
<input
  name="type"
  placeholder="Type"
  value={form.type}
  onChange={handleChange}
  style={baseStyles.input}
/>
<input
  name="title"
  placeholder="Title"
  value={form.title}
  onChange={handleChange}
  style={baseStyles.input}
/>
<input
  name="slug"
  placeholder="Slug"
  value={form.slug}
  onChange={handleChange}
  style={baseStyles.input}
/>
<input
  name="date"
  placeholder="Date"
  value={form.date}
  onChange={handleChange}
  style={baseStyles.input}
/>
<input
  name="read_time"
  placeholder="Read Time"
  value={form.read_time}
  onChange={handleChange}
  style={baseStyles.input}
/>
        <input type="file" onChange={handleFile} style={baseStyles.input} />
        {form.image_url && !form.image && (
  <div style={{ marginBottom: "10px" }}>
    <p>Current Image:</p>
    <img
      src={form.image_url}
      alt="preview"
      style={{
        width: "120px",
        height: "80px",
        objectFit: "cover",
        borderRadius: "6px",
      }}
    />
  </div>
)}

        <textarea
          placeholder="Main Description"
          value={form.mainDescription}
          onChange={(e) => handleMainDesc(e.target.value)}
          style={baseStyles.input}
        />

        {/* <textarea
          placeholder="Content"
          value={form.content}
          onChange={(e) => handleContent(e.target.value)}
          style={baseStyles.input}
        /> */}

        <h4>Content Sections</h4>

        {form.contentSections.map((sec, i) => (
          <div key={i} style={{ marginBottom: "20px", border: "1px solid #ddd", padding: "10px" }}>
            <b>Section {i + 1}</b>

            <input
              placeholder="Highlight"
              value={sec.highlight}
              onChange={(e) => handleSectionChange(i, "highlight", e.target.value)}
              style={baseStyles.input}
            />

            <input
              placeholder="Section Title"
              value={sec.sectionTitle}
              onChange={(e) => handleSectionChange(i, "sectionTitle", e.target.value)}
              style={baseStyles.input}
            />

            <textarea
              placeholder="Paragraph"
              value={sec.paragraph}
              onChange={(e) => handleSectionChange(i, "paragraph", e.target.value)}
              style={baseStyles.input}
            />

            <button type="button" onClick={() => removeSection(i)}>
              Remove
            </button>
          </div>
        ))}

        <button type="button" onClick={addSection}>+ Add Section</button>

        <br /><br />
<textarea
  placeholder="Divider Text (optional)"
  value={form.divider}
  onChange={(e) =>
    setForm({ ...form, divider: e.target.value })
  }
  style={baseStyles.input}
/>
        <button type="submit" style={baseStyles.button}>
          {editingId ? "Update Blog" : "Add Blog"}
        </button>
      </form>

      {/* ================= TABLE ================= */}
      <div style={baseStyles.tableContainer}>
        <table style={baseStyles.table}>
          <thead>
            <tr>
              <th style={baseStyles.th}>Image</th>
              <th style={baseStyles.th}>ID</th>
              <th style={baseStyles.th}>Title</th>
              <th style={baseStyles.th}>Category</th>
              <th style={baseStyles.th}>Type</th>
              <th style={baseStyles.th}>Slug</th>
              <th style={baseStyles.th}>Date</th>
              <th style={baseStyles.th}>Read Time</th>
              <th style={baseStyles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {blogs.map((b) => (
              <tr key={b.id}>
                <td style={baseStyles.td}>
                  <img src={b.image_url} style={baseStyles.previewImg} />
                </td>

                <td style={baseStyles.td}>{b.id}</td>
                <td style={baseStyles.td}>{b.title}</td>
                <td style={baseStyles.td}>{b.category}</td>
                <td style={baseStyles.td}>{b.type}</td>
                <td style={baseStyles.td}>{b.slug}</td>
                <td style={baseStyles.td}>{b.date}</td>
                <td style={baseStyles.td}>{b.read_time}</td>

                <td style={baseStyles.td}>
                  <button onClick={() => handleEdit(b)}>✏ Edit</button>
                  <button onClick={() => handleDelete(b.id)}>🗑 Delete</button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}