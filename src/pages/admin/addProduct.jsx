import { useParams } from "react-router-dom";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Package,
  ShoppingCart,
  User,
  TicketPercent,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ collapsed, setCollapsed }) => {
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
        {[
          { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
          { path: "/productsManage", icon: <Package size={20} />, label: "Manage Products" },
          { path: "/ordersManage", icon: <ShoppingCart size={20} />, label: "Orders" },
          { path: "/customer", icon: <User size={20} />, label: "Customers" },
          { path: "/couponsManage", icon: <TicketPercent size={20} />, label: "Coupons" },
          { path: "/reviewsManage", icon: <Star size={20} />, label: "Reviews" },
        ].map((item, index) => (
          <a
            key={index}
            href={item.path}
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 text-indigo-400"
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default function AddProduct() {
  const { id } = useParams();

  const [collapsed, setCollapsed] = useState(false);
  const [formData, setFormData] = useState({
  name: "",
  sku: "",
  category: "men",
  type: "shoes",
  price: "",
  stock: "",
  status: "Available",
  images: [],
  sizes:[],
  details:[],
  brand: "",
  description: "",
});

  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

useEffect(() => {
  if (!id) return; // 🟢 ADD MODE → do nothing

  const fetchProduct = async () => {
    const res = await fetch(`https://footware-22xr.onrender.com/api/products/${id}`);
    const data = await res.json();

    setFormData({
      name: data.name,
      sku: data.sku,
      category: data.category,
      type: data.type,
      price: data.price,
      stock: data.stock,
      status: data.status || "Available",
      sizes: data.sizes || [],
      brand: data.brand || "",
      description: data.description || "",
      details: data.details || [],
      images: [], // ONLY for new uploads
    });
  };

  fetchProduct();
}, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.sizes.length) {
    alert("Please select at least one size");
    return;
  }

  const data = new FormData();
  data.append("name", formData.name);
  data.append("sku", formData.sku);
  data.append("category", formData.category);
  data.append("type", formData.type);
  data.append("price", formData.price);
  data.append("stock", formData.stock);
  data.append("brand", formData.brand);
  data.append("description", formData.description);
  data.append("sizes", JSON.stringify(formData.sizes));
  data.append("details", JSON.stringify(formData.details));
  data.append("status", formData.status);


  formData.images.forEach((img) => {
    data.append("images", img);
  });

  // ✅ DIFFERENT REQUEST FOR ADD vs EDIT
  const url = id
    ? `https://footware-22xr.onrender.com/api/products/${id}` // EDIT
    : `https://footware-22xr.onrender.com/api/products`;      // ADD

  const method = id ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    body: data,
  });

if (!res.ok) {
  const text = await res.text();
  console.error("SERVER ERROR RAW 👉", text);
  alert("Server error – check backend logs");
  return;
}



  setShowPopup(true);
};



  const handleOk = () => {
    navigate("/productsManage");
  };

const handleAddAgain = () => {
  setShowPopup(false);

  localStorage.removeItem("newProductData");

  setFormData({
    name: "",
    sku: "",
    category: "men",
    type: "shoes",
    price: "",
    stock: "",
    status: "Available",
    images: [],
    sizes: [],
    brand: "",
    description: "",
    details: [],
  });
};


  return (
    <div className="flex min-h-screen text-black bg-[#FFF6E9] relative">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 p-10">
        <div className="flex justify-between items-center mb-8">
         <h2 className="text-3xl font-bold">
  {id ? "Edit Product" : "Add New Product"}
</h2>

        </div>

<form
  onSubmit={handleSubmit}
  className="bg-white shadow-md rounded-2xl p-8 max-w-3xl"
>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Name */}
  <div>
    <label className="block text-sm font-medium mb-2">Name</label>
    <input
      type="text"
      name="name"
      value={formData.name}
      onChange={handleChange}
      required
      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400"
    />
  </div>

  {/* SKU */}
  <div>
    <label className="block text-sm font-medium mb-2">SKU</label>
    <input
      type="text"
      name="sku"
      value={formData.sku}
      onChange={handleChange}
      required
      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400"
    />
  </div>

  {/* ✅ CATEGORY (ADD HERE) */}
  <div>
    <label className="block text-sm font-medium mb-2">Category</label>
    <select
      name="category"
      value={formData.category}
      onChange={handleChange}
      required
      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400"
    >
      <option value="men">Men</option>
      <option value="women">Women</option>
      <option value="all">All</option>
    </select>
  </div>

  {/* ✅ TYPE (ADD HERE) */}
  <div>
    <label className="block text-sm font-medium mb-2">Type</label>
    <select
      name="type"
      value={formData.type}
      onChange={handleChange}
      required
      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400"
    >
      <option value="sneakers">Sneakers</option>
      <option value="heels">Heels</option>
      <option value="crocs">Crocs</option>
      <option value="shoes">Shoes</option>
      <option value="chappals">Chappals</option>
    </select>
  </div>

  {/* Price */}
  <div>
    <label className="block text-sm font-medium mb-2">Price</label>
    <input
      type="number"
      name="price"
      value={formData.price}
      onChange={handleChange}
      required
      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400"
    />
  </div>

  {/* Stock */}
  <div>
    <label className="block text-sm font-medium mb-2">Stock</label>
    <input
      type="number"
      name="stock"
      value={formData.stock}
      onChange={handleChange}
      required
      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400"
    />
  </div>

  {/* ✅ PRODUCT DESCRIPTION (ADD HERE) */}
<div className="md:col-span-2">
  <label className="block text-sm font-medium mb-2">
    Product Description
  </label>
  <textarea
    name="description"
    value={formData.description}
    onChange={handleChange}
    rows={4}
    placeholder="Enter product description..."
    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400"
    required
  />
</div>

  {/* Sizes */}
<div className="md:col-span-2">
  <label className="block text-sm font-medium mb-2">Available Sizes</label>
  <div className="flex flex-wrap gap-3">
    {[6, 7, 8, 9, 10, 11].map((size) => (
      <label
        key={size}
        className={`px-4 py-2 rounded-lg border cursor-pointer transition ${
          formData.sizes.includes(size)
            ? "bg-black text-white"
            : "bg-white"
        }`}
      >
        <input
          type="checkbox"
          value={size}
          checked={formData.sizes.includes(size)}
          onChange={(e) => {
            const val = Number(e.target.value);
            setFormData((prev) => ({
              ...prev,
              sizes: prev.sizes.includes(val)
                ? prev.sizes.filter((s) => s !== val)
                : [...prev.sizes, val],
            }));
          }}
          className="hidden"
        />
        {size}
      </label>
    ))}
  </div>
</div>


  {/* Status */}
  <div>
    <label className="block text-sm font-medium mb-2">Status</label>
    <select
      name="status"
      value={formData.status}
      onChange={handleChange}
      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400"
    >
      <option>Available</option>
      <option>Few Left</option>
      <option>Out of Stock</option>
    </select>
  </div>

  {/* Image */}
{/* Product Images */}
<div className="md:col-span-2">
  <label className="block text-sm font-medium mb-2">
    Upload Product Images
  </label>

  <input
    type="file"
    accept="image/*"
    multiple
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        images: Array.from(e.target.files),
      }))
    }
    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400"
  />

  {/* Image previews */}
  <div className="flex flex-wrap gap-3 mt-4">
    {formData.images?.map((img, i) => (
      <img
        key={i}
        src={URL.createObjectURL(img)}
        alt={`Preview ${i + 1}`}
        className="w-20 h-20 object-cover rounded-lg border"
      />
    ))}
  </div>
</div>
</div>


          <div className="mt-8 flex justify-end">
<button
  type="submit"
  className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
>
  {id ? "Update Product" : "Add Product"}
</button>

          </div>
        </form>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center w-80">
            <h3 className="text-lg font-semibold mb-4">Product Added Successfully!</h3>
            <div className="flex justify-around">
              <button
                onClick={handleOk}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                OK
              </button>
              <button
                onClick={handleAddAgain}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Add Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  }
