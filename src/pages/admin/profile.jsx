import { useNavigate } from "react-router-dom";
import React, { useState, useMemo, useEffect } from "react";
import { Camera, Mail, Phone, User, Edit, X, ArrowLeft } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



// Spinner shown while loading
const Spinner = () => (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black"></div>
  </div>
);

// --- FormField stays the same ---
const FormField = React.memo(
  ({
    label,
    name,
    value,
    icon,
    type = "text",
    isEditing,
    handleChange,
    required = false,
    pattern,
    placeholder,
  }) => {
    const memoizedIcon = useMemo(
      () => React.cloneElement(icon, { size: 16, className: "mr-2 text-[#3b2f2f]" }),
      [icon]
    );

    return (
      <div className="mb-4">
        <label
          htmlFor={name}
          className="text-sm font-medium text-[#3b2f2f] mb-1 flex items-center"
        >
          {memoizedIcon}
          {label}
        </label>
        {isEditing ? (
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={handleChange}
            required={required}
            pattern={pattern}
            title={name === "phone" ? "Phone number must contain only digits." : undefined}
            placeholder={placeholder}
            className="w-full px-4 py-2 border border-[#e6dccf] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d6c7b3] transition duration-200 bg-[#f5f1e6] text-[#2d2d2d]"
          />
        ) : (
          <div className="w-full px-4 py-2 bg-[#f5f1e6] rounded-lg text-[#2d2d2d] border border-[#e6dccf]">
            {value || "N/A"}
          </div>
        )}
      </div>
    );
  }
);

export default function App() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    profilePicture: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalProfile, setOriginalProfile] = useState(profile);
  const [activeMenu, setActiveMenu] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch admin profile from backend
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
const token = localStorage.getItem("token");

if (!token) {
  toast.error("Authentication token missing. Please login again.");
  navigate("/login");
  return;
}

const res = await fetch("https://footware-22xr.onrender.com/api/admin/profile", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

        const data = await res.json();
        if (res.ok) {
          setProfile({
  name: data.admin.fullName,
  email: data.admin.email,
  phone: data.admin.phone,
  profilePicture: data.admin.profilePicture,
});

setOriginalProfile({
  name: data.admin.fullName || "",
  email: data.admin.email || "",
  phone: data.admin.phone || "",
  profilePicture: data.admin.profilePicture || "",
});

          toast.success("Admin profile loaded successfully!");
        } else {
          toast.error(data.message || "Failed to load admin profile");
        }
      } catch (error) {
        toast.error("Error connecting to the backend.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handlePictureChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setSelectedFile(file); // 👈 STORE FILE

  // Preview only
  const reader = new FileReader();
  reader.onloadend = () => {
    setProfile((prev) => ({
      ...prev,
      profilePicture: reader.result,
    }));
  };
  reader.readAsDataURL(file);
};

const handleSave = async () => {
  try {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("fullName", profile.name);
    formData.append("email", profile.email);
    formData.append("phone", profile.phone);

    if (selectedFile) {
      formData.append("profilePicture", selectedFile);
    }

    const res = await fetch("https://footware-22xr.onrender.com/api/admin/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    console.log("PROFILE UPDATE RESPONSE:", res.status, data);

    if (!res.ok) {
      toast.error(data.message || "Profile update failed");
      return;
    }

    setProfile({
      name: data.admin.fullName,
      email: data.admin.email,
      phone: data.admin.phone,
      profilePicture: data.admin.profilePicture,
    });

    setOriginalProfile({
      name: data.admin.fullName,
      email: data.admin.email,
      phone: data.admin.phone,
      profilePicture: data.admin.profilePicture,
    });

    setIsEditing(false);
    setSelectedFile(null);
    toast.success("Profile updated successfully");
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
};


  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
    const fileInput = document.getElementById("profilePictureInput");
    if (fileInput) fileInput.value = "";
    toast.info("Changes canceled.");
  };

const handleGoBack = () => {
  navigate("/home");
};


  if (loading) return <Spinner />;

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-[#fdf6e3] to-[#f5f1e6] flex flex-col font-sans p-4 sm:p-8 overflow-hidden text-[#2d2d2d]">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex-1 w-full flex flex-col md:flex-row gap-8 h-full">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-[#fffaf0] rounded-xl shadow-lg p-6 flex flex-col items-start border border-[#e6dccf]">
          <div className="flex items-center space-x-3 mb-8 w-full">
            <User className="text-black" size={24} />
            <h2 className="text-xl font-semibold text-[#2d2d2d]">User Profile</h2>
          </div>
          <nav className="w-full">
            <button
              onClick={() => setActiveMenu("profile")}
              className={`flex items-center w-full px-4 py-3 rounded-lg font-medium transition duration-200 ${
                activeMenu === "profile"
                  ? "bg-black text-white shadow-md"
                  : "text-[#3b2f2f] hover:bg-[#f5f1e6] hover:text-black"
              }`}
            >
              <User size={20} className="mr-3" />
              Profile
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-[#fffaf0] rounded-xl shadow-lg p-6 sm:p-8 border border-[#e6dccf] h-full overflow-auto">
          <div className="flex justify-between items-center mb-6 border-b pb-4 border-[#e6dccf]">
            <div className="flex items-center gap-4">
              <button
                onClick={handleGoBack}
                className="flex items-center px-3 py-2 bg-[#070707] text-[#fcfafa] rounded-full shadow hover:bg-[#e6dccf] transition duration-200"
              >
                <ArrowLeft size={18} className="mr-1" />
                Back
              </button>
              <h1 className="text-2xl font-bold text-[#2d2d2d]">Profile Settings</h1>
            </div>

            <form
              id="profileForm"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-black text-white font-medium rounded-full shadow-md hover:bg-gray-800 transition duration-200"
                >
                  <Edit size={16} className="mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-emerald-600 text-white font-medium rounded-full shadow-md hover:bg-emerald-700 transition duration-200"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center px-4 py-2 bg-red-500 text-white font-medium rounded-full shadow-md hover:bg-red-600 transition duration-200"
                  >
                    <X size={16} className="mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Profile Picture */}
          <div className="flex flex-col items-center sm:flex-row sm:items-start mb-8 gap-6">
            <div className="relative group">
              <img
                src={
                  profile.profilePicture ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg group-hover:opacity-80 transition duration-300"
              />
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition duration-300">
                  <label
                    htmlFor="profilePictureInput"
                    className="cursor-pointer text-white"
                  >
                    <Camera size={24} />
                    <span className="sr-only">Change profile picture</span>
                  </label>
                  <input
                    type="file"
                    id="profilePictureInput"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePictureChange}
                  />
                </div>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-semibold text-[#2d2d2d] mt-4">
                {profile.name || "Set Your Name"}
              </h2>
              <p className="text-[#6b5e5e]">{profile.email || "No email set"}</p>
            </div>
          </div>

          {/* Profile Form Fields */}
          <div
            id="profileFormFields"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <FormField
              label="Full Name"
              name="name"
              value={profile.name}
              icon={<User />}
              isEditing={isEditing}
              handleChange={handleChange}
              required={true}
              placeholder="Please enter your full name"
            />
            <FormField
              label="Email Address"
              name="email"
              value={profile.email}
              icon={<Mail />}
              type="email"
              isEditing={isEditing}
              handleChange={handleChange}
              required={true}
              pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
              placeholder="Please enter your email address"
            />
            <FormField
              label="Phone Number"
              name="phone"
              value={profile.phone}
              icon={<Phone />}
              type="tel"
              isEditing={isEditing}
              handleChange={handleChange}
              required={true}
              pattern="\d*"
              placeholder="Please enter your phone number (digits only)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
