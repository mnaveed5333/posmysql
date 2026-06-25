"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories);
  };

  const openAdd = () => {
    setEditCat(null);
    setName("");
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditCat(cat);
    setName(cat.name);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error("Name is required!");

    const url = editCat ? `/api/categories/${editCat.id}` : "/api/categories";
    const method = editCat ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      toast.success(editCat ? "Category updated!" : "Category added!");
      setShowModal(false);
      fetchCategories();
    } else {
      toast.error("Something went wrong!");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Deleted!");
      fetchCategories();
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <button
          onClick={openAdd}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-semibold text-sm"
        >
          + Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl shadow p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-semibold text-gray-800">{cat.name}</p>
              <p className="text-xs text-gray-400">ID: {cat.id}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEdit(cat)}
                className="text-xs bg-blue-50 text-blue-500 hover:bg-blue-100 px-3 py-1 rounded-lg font-semibold"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="text-xs bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1 rounded-lg font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-gray-300 text-sm col-span-3 text-center py-10">
            No categories found
          </p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-xl">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {editCat ? "Edit Category" : "Add Category"}
            </h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name e.g. Burgers"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 border border-gray-200 rounded-xl text-gray-500 font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm"
              >
                {editCat ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}