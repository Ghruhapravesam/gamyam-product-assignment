const { useState, useEffect, useMemo } = React;

// ====== PRODUCT DATA ======
const initialProducts = [
  { id: 1, name: "Wireless Mouse", price: 799, category: "Electronics", stock: 25, description: "A smooth and responsive wireless mouse with ergonomic design." },
  { id: 2, name: "Bluetooth Headphones", price: 2499, category: "Electronics", stock: 10, description: "Noise-cancelling over-ear headphones with deep bass." },
  { id: 3, name: "Office Chair", price: 5499, category: "Furniture", stock: 5, description: "Ergonomic office chair with adjustable height and lumbar support." },
  { id: 4, name: "Coffee Mug", price: 299, category: "Kitchen", stock: 50, description: "Ceramic coffee mug with heat-resistant handle." },
  { id: 5, name: "Yoga Mat", price: 999, category: "Sports", stock: 18, description: "Eco-friendly yoga mat with non-slip surface." },
];

// ====== TABLE VIEW ======
function ProductListTable({ products, onEdit }) {
  return (
    <div className="table-responsive shadow-sm">
      <table className="table table-striped align-middle">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th className="text-end">Price</th>
            <th className="text-end">Stock</th>
            <th style={{ width: "100px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-3">No products found.</td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td className="text-end">₹{p.price}</td>
                <td className="text-end">{p.stock}</td>
                <td>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => onEdit(p)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ====== CARD VIEW ======
function ProductCardGrid({ products, onEdit }) {
  if (products.length === 0) {
    return <div className="text-center py-3 border rounded">No products found.</div>;
  }

  return (
    <div className="row g-3">
      {products.map((p) => (
        <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">{p.name}</h5>
              <p className="text-muted small">{p.category}</p>
              <p className="small flex-grow-1">{p.description}</p>
              <div className="d-flex justify-content-between align-items-center mt-auto">
                <div>
                  <strong>₹{p.price}</strong>
                  <div className="text-muted small">Stock: {p.stock}</div>
                </div>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => onEdit(p)}>
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ====== FORM ======
const emptyForm = { name: "", price: "", category: "", stock: "", description: "" };

function ProductForm({ initialProduct, onSave, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialProduct) {
      setForm({
        name: initialProduct.name,
        price: String(initialProduct.price),
        category: initialProduct.category,
        stock: String(initialProduct.stock),
        description: initialProduct.description,
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialProduct]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let e = {};
    if (!form.name) e.name = "Required";
    if (!form.price || isNaN(form.price)) e.price = "Enter valid price";
    if (!form.category) e.category = "Required";
    if (form.stock && isNaN(form.stock)) e.stock = "Enter valid stock";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label">Name</label>
          <input name="name" className="form-control" value={form.name} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Price</label>
          <input name="price" type="number" className="form-control" value={form.price} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Category</label>
          <input name="category" className="form-control" value={form.category} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Stock</label>
          <input name="stock" type="number" className="form-control" value={form.stock} onChange={handleChange} />
        </div>
        <div className="col-md-8">
          <label className="form-label">Description</label>
          <textarea name="description" className="form-control" value={form.description} onChange={handleChange}></textarea>
        </div>
      </div>

      <div className="mt-3 d-flex gap-2">
        <button className="btn btn-primary" type="submit">Save</button>
        <button className="btn btn-outline-secondary" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

// ====== PAGINATION ======
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="mt-3">
      <ul className="pagination justify-content-center">
        {pages.map((p) => (
          <li key={p} className={`page-item ${p === currentPage ? "active" : ""}`}>
            <button className="page-link" onClick={() => onPageChange(p)}>{p}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ====== MAIN APP ======
function App() {
  const [products, setProducts] = useState(initialProducts);
  const [viewType, setViewType] = useState("list");
  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);

  const ITEMS = 6;

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(s));
  }, [search, products]);

  const totalPages = Math.ceil(filtered.length / ITEMS);

  const paginated = filtered.slice((page - 1) * ITEMS, page * ITEMS);

  const handleSave = (data) => {
    if (editProduct) {
      setProducts(products.map((p) => (p.id === editProduct.id ? { ...p, ...data } : p)));
    } else {
      const newId = Math.max(...products.map((p) => p.id)) + 1;
      setProducts([{ id: newId, ...data }, ...products]);
    }
    setShowForm(false);
    setEditProduct(null);
  };

  return (
    <div className="container py-4">
      <h3 className="mb-3">Gamyam Product Management</h3>

      <div className="d-flex gap-2 mb-3">
        <button
          className={`btn btn-sm ${viewType === "list" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setViewType("list")}
        >
          List
        </button>
        <button
          className={`btn btn-sm ${viewType === "card" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setViewType("card")}
        >
          Card
        </button>

        <input
          className="form-control form-control-sm ms-auto"
          style={{ maxWidth: "200px" }}
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="btn btn-sm btn-success" onClick={() => setShowForm(true)}>
          + Add
        </button>
      </div>

      {showForm && (
        <div className="card mb-3 shadow-sm">
          <div className="card-body">
            <h5>{editProduct ? "Edit Product" : "Add Product"}</h5>
            <ProductForm
              initialProduct={editProduct}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditProduct(null);
              }}
            />
          </div>
        </div>
      )}

      {viewType === "list" ? (
        <ProductListTable products={paginated} onEdit={(p) => { setEditProduct(p); setShowForm(true); }} />
      ) : (
        <ProductCardGrid products={paginated} onEdit={(p) => { setEditProduct(p); setShowForm(true); }} />
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
