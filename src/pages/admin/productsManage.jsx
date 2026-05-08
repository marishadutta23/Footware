import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Edit,
  Trash2,
  Plus,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
  User,
  TicketPercent,
  X,
  Save,
  Home,
} from "lucide-react";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  return (
    <div
      className={`bg-black text-white h-screen transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        {!collapsed && <h2 className="text-xl font-bold">Dashboard</h2>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-gray-800"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>
      <nav className="mt-6 space-y-2">
        <a
          href="/dashboard"
          className={`flex items-center gap-3 px-4 py-2 rounded ${
            location.pathname === "/dashboard"
              ? "bg-gray-900 text-indigo-400"
              : "text-gray-300 hover:text-indigo-400"
          }`}
        >
          <LayoutDashboard size={20} />
          {!collapsed && <span>Dashboard</span>}
        </a>
        <a
          href="/productsManage"
          className={`flex items-center gap-3 px-4 py-2 rounded ${
            location.pathname === "/productsManage"
              ? "bg-gray-900 text-indigo-400"
              : "text-gray-300 hover:text-indigo-400"
          }`}
        >
          <Package size={20} />
          {!collapsed && <span>Manage Products</span>}
        </a>
        <a
          href="/ordersManage"
          className={`flex items-center gap-3 px-4 py-2 rounded ${
            location.pathname === "/ordersManage"
              ? "bg-gray-900 text-indigo-400"
              : "text-gray-300 hover:text-indigo-400"
          }`}
        >
          <ShoppingCart size={20} />
          {!collapsed && <span>Orders</span>}
        </a>
        <a
          href="/customer"
          className={`flex items-center gap-3 px-4 py-2 rounded ${
            location.pathname === "/customer"
              ? "bg-gray-900 text-indigo-400"
              : "text-gray-300 hover:text-indigo-400"
          }`}
        >
          <User size={20} />
          {!collapsed && <span>Customers</span>}
        </a>
        <a
          href="/couponsManage"
          className={`flex items-center gap-3 px-4 py-2 rounded ${
            location.pathname === "/couponsManage"
              ? "bg-gray-900 text-indigo-400"
              : "text-gray-300 hover:text-indigo-400"
          }`}
        >
          <TicketPercent size={20} />
          {!collapsed && <span>Coupons</span>}
        </a>
        <a
          href="/reviewsManage"
          className={`flex items-center gap-3 px-4 py-2 rounded ${
            location.pathname === "/reviewsManage"
              ? "bg-gray-900 text-indigo-400"
              : "text-gray-300 hover:text-indigo-400"
          }`}
        >
          <Star size={20} />
          {!collapsed && <span>Reviews</span>}
        </a>
      </nav>
    </div>
  );
};

const ProductsManage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const handleHomeClick = () => {
  navigate("/home"); // or "/" if needed
};
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editedData, setEditedData] = useState({});

useEffect(() => {
  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();
    setProducts(data);
  };
  fetchProducts();
}, []);


const handleDelete = async (id) => {
  await fetch(`http://localhost:5000/api/products/${id}`, {
    method: "DELETE",
  });
  setProducts(products.filter((p) => p._id !== id));
};


const handleEdit = (product) => {
  setEditingProduct(product._id);
  setEditedData({ ...product });
};


const handleSave = async () => {
  const formData = new FormData();

  Object.keys(editedData).forEach((key) => {
    formData.append(key, editedData[key]);
  });

  const res = await fetch(
    `http://localhost:5000/api/products/${editingProduct}`,
    {
      method: "PUT",
      body: formData,
    }
  );

  const updatedProduct = await res.json();

  setProducts(products.map((p) =>
    p._id === editingProduct ? updatedProduct : p
  ));

  setEditingProduct(null);
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const getStatus = (stock) => {
    if (stock === 0) return <span className="text-red-600 font-medium">Out of Stock</span>;
    if (stock <= 50) return <span className="text-yellow-600 font-medium">Few Left</span>;
    return <span className="text-green-600 font-medium">Available</span>;
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-[#fdf6e3]">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 h-screen bg-[#fdf6e3] p-6 overflow-y-auto">
<div className="flex justify-between items-center mb-6">
  <h2 className="text-3xl font-bold text-black">Product Management</h2>

  <div className="flex items-center gap-4">
    {/* 🏠 Home Icon */}
    <Home
      onClick={handleHomeClick}
      title="Go to Home"
      className="w-7 h-7 cursor-pointer text-black hover:text-blue-500 transition"
    />

    {/* ➕ Add Product Button */}
    <button
      onClick={() => navigate("/addProducts")}
      className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 flex items-center gap-2"
    >
      <Plus size={18} /> Add New Product
    </button>
  </div>
</div>

        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="py-3 px-4 text-left">Image</th>
                <th className="py-3 px-4 text-left">Product Name</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    No products available. Add one now!
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {product.images && product.images.length > 0 ? (
                        <img
  src={product.images[0]}
  alt={product.name}
  className="w-12 h-12 object-cover rounded-md border"
/>
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-md text-gray-600 font-medium">
                          N/A
                        </div>
                      )}
                    </td>

                    {editingProduct === product._id ? (
                      <>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            name="name"
                            value={editedData.name}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 w-full"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="text"
                            name="sku"
                            value={editedData.sku}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 w-20 text-center"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="number"
                            name="price"
                            value={editedData.price}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 w-24 text-center"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="number"
                            name="stock"
                            value={editedData.stock}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 w-20 text-center"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">{getStatus(Number(editedData.stock))}</td>
                        <td className="py-3 px-4 flex gap-3 justify-center">
                          <button
                            onClick={handleSave}
                            className="text-green-600 hover:text-green-800 flex items-center gap-1"
                          >
                            <Save size={16} /> Save
                          </button>
                          <button
                            onClick={() => setEditingProduct(null)}
                            className="text-red-500 hover:text-red-700 flex items-center gap-1"
                          >
                            <X size={16} /> Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-4 font-medium">{product.name}</td>
                        <td className="py-3 px-4 text-center">{product.sku}</td>
                        <td className="py-3 px-4 text-center">₹{Number(product.price).toFixed(2)}</td>
                        <td className="py-3 px-4 text-center">{product.stock}</td>
                        <td className="py-3 px-4 text-center">{getStatus(product.stock)}</td>
                        <td className="py-3 px-4 flex gap-3 justify-center">
                          <button
  onClick={() => navigate(`/products/edit/${product._id}`)}
  className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
>
  <Edit size={16} /> Edit
</button>

                          <button
                            onClick={() => handleDelete(product._id)}
                            className="text-red-500 hover:text-red-700 flex items-center gap-1"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsManage;
