import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000/api/posts";

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState(null);

  // 🔹 READ
  const fetchPosts = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error("Fetch posts failed:", err));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 🔹 CREATE / UPDATE
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !body) return;

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, body })
    })
      .then(res => {
        if (!res.ok) throw new Error("Request failed");
        return res.json(); // always parse JSON
      })
      .then(() => {
        setTitle("");
        setBody("");
        setEditingId(null);
        fetchPosts();
      })
      .catch(err => console.error(err));
  };

  // 🔹 EDIT
  const handleEdit = (post) => {
    setTitle(post.title);
    setBody(post.body);
    setEditingId(post.id);
  };

  // 🔹 DELETE
  const handleDelete = (id) => {
    if (!confirm("Delete this post?")) return;

    fetch(`${API_URL}/${id}`, {
      method: "DELETE"
      // ✅ Do NOT include body
    })
      .then(res => {
        if (!res.ok) throw new Error("Delete failed");
        return res.json(); // parse Laravel JSON response
      })
      .then(() => fetchPosts())
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", maxWidth: "600px" }}>
      <h1>React + Laravel CRUD</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
        />
        <textarea
          placeholder="Body"
          value={body}
          onChange={e => setBody(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
        />
        <button type="submit">
          {editingId ? "Update Post" : "Add Post"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setTitle("");
              setBody("");
            }}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        )}
      </form>

      <hr />

      {/* POSTS */}
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map(post => (
          <div key={post.id} style={{ marginBottom: "20px" }}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <small>{new Date(post.created_at).toLocaleString()}</small>
            <br />
            <button onClick={() => handleEdit(post)}>Edit</button>
            <button
              onClick={() => handleDelete(post.id)}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default App;
