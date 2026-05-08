import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Mail, Phone, User, Edit, X, ArrowLeft, Home, Heart, CheckCircle, AlertTriangle } from 'lucide-react';

// Default placeholder for the profile picture
const DEFAULT_PROFILE_PICTURE = "https://placehold.co/128x128/f5f1e6/3b2f2f?text=User";

// --- Message Toast Component (Replaces Alert) ---
const MessageToast = React.memo(({ message, type, onClose }) => {
  if (!message) return null;

  const typeClasses = type === 'success'
    ? 'bg-emerald-500 border-emerald-600'
    : 'bg-red-500 border-red-600';
  
  const Icon = type === 'success' ? CheckCircle : AlertTriangle;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`flex items-center p-4 rounded-xl shadow-2xl text-white transition-opacity duration-300 transform translate-y-0 ${typeClasses} border-b-4`}>
        <Icon size={20} className="mr-3 flex-shrink-0" />
        <span className="font-medium">{message}</span>
        <button 
          onClick={onClose} 
          className="ml-4 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
});

// --- FormField Component ---
const FormField = React.memo(({ label, name, value, icon, type = 'text', isEditing, handleChange, required = false, pattern, placeholder }) => {
  const memoizedIcon = useMemo(() => React.cloneElement(icon, { size: 16, className: 'mr-2 text-[#3b2f2f]' }), [icon]);

  return (
    <div className="mb-4">
      <label htmlFor={name} className="text-sm font-medium text-[#3b2f2f] mb-1 flex items-center">
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
          pattern={name === 'phone' ? '^[0-9]+$' : pattern} 
          title={name === 'phone' ? 'Phone number must contain only digits.' : undefined}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-[#e6dccf] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition duration-200 bg-[#f5f1e6] text-[#2d2d2d]"
        />
      ) : (
        <div className="w-full px-4 py-2 bg-[#f5f1e6] rounded-lg text-[#2d2d2d] border border-[#e6dccf]">
          {value || 'N/A'}
        </div>
      )}
    </div>
  );
});

// --- Main App Component ---
export default function App({ backPath = '/userHome' }) {
  const navigate = useNavigate();

  const initialData = {
    name: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    profilePicture: DEFAULT_PROFILE_PICTURE,
  };

  const [profile, setProfile] = useState(initialData);
  const [originalProfile, setOriginalProfile] = useState(initialData);
  const [activeMenu, setActiveMenu] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 4000);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

const [selectedFile, setSelectedFile] = useState(null);

const handlePictureChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setSelectedFile(file);

  const reader = new FileReader();
  reader.onloadend = () => {
    setProfile(p => ({ ...p, profilePicture: reader.result }));
  };
  reader.readAsDataURL(file);
};

const handleSave = async (e) => {
  console.log("SAVE CLICKED", profile);

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", profile.name);
    formData.append("phone", profile.phone);
    formData.append("address", profile.address);   // ✅ ADD
    formData.append("gender", profile.gender);

    // append image if selected
    if (selectedFile) {
      formData.append("profilePicture", selectedFile);
    }

    // 👇 THIS IS WHERE YOUR FETCH GOES
    const res = await fetch("https://footware-22xr.onrender.com/api/user/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Backend error:", data);
      return;
    }

    // update UI with backend data
  if (res.ok) {
  setProfile(prev => ({
    ...prev,
    name: data.fullName ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    address: data.address || "",
      gender: data.gender || "",
    profilePicture: data.profilePicture || DEFAULT_PROFILE_PICTURE,
  }));

  setOriginalProfile(prev => ({
    ...prev,
    name: data.fullName ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    address: data.address || "",
      gender: data.gender || "",
    profilePicture: data.profilePicture || DEFAULT_PROFILE_PICTURE,
  }));
}


setIsEditing(false);
    showToast("Profile updated successfully", "success");
  } catch (err) {
    console.error("Save profile failed:", err);
  }
};

  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
    showToast('Changes discarded.', 'error');
  };

  const handleGoBack = () => {
    if (backPath) navigate(backPath);
    else navigate(-1); // fallback if no path is provided
  };

useEffect(() => {
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("https://footware-22xr.onrender.com/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

if (res.ok) {
  setProfile(prev => ({
  ...prev,
  name: data.fullName,
  email: data.email,
  phone: data.phone,
  address: data.address || "",     // ✅ ADD
    gender: data.gender || "",  
  profilePicture: data.profilePicture || DEFAULT_PROFILE_PICTURE,
}));

setOriginalProfile(prev => ({
  ...prev,
  name: data.fullName,
  email: data.email,
  phone: data.phone,
  address: data.address || "",
    gender: data.gender || "",
    profilePicture: data.profilePicture || DEFAULT_PROFILE_PICTURE,
}));

}

    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  fetchUserProfile();
}, []);


  return (
    <div className="h-screen w-screen bg-gradient-to-b from-[#fdf6e3] to-[#f5f1e6] flex flex-col font-sans p-4 sm:p-8 overflow-hidden text-[#2d2d2d]">
      <div className="flex-1 w-full flex flex-col md:flex-row gap-8 h-full">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-[#fffaf0] rounded-xl shadow-lg p-6 flex flex-col items-start border border-[#e6dccf] flex-shrink-0">
          <div className="flex items-center space-x-3 mb-8 w-full">
            <User className="text-black" size={24} />
            <h2 className="text-xl font-semibold text-[#2d2d2d]">User Profile</h2>
          </div>
          <nav className="w-full">
            <button
              onClick={() => setActiveMenu('profile')}
              className={`flex items-center w-full px-4 py-3 rounded-xl font-medium transition duration-200 ${
                activeMenu === 'profile'
                  ? 'bg-black text-white shadow-md'
                  : 'text-[#3b2f2f] hover:bg-[#f5f1e6] hover:text-black'
              }`}
            >
              <User size={20} className="mr-3" />
              Profile
            </button>
          </nav>
        </div>

        {/* Profile Section */}
        <div className="flex-1 bg-[#fffaf0] rounded-xl shadow-lg p-6 sm:p-8 border border-[#e6dccf] h-full overflow-y-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 border-[#e6dccf] sticky top-0 bg-[#fffaf0] z-10">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <button
                onClick={handleGoBack}
                className="flex items-center px-3 py-2 bg-[#070707] text-[#fcfafa] rounded-full shadow hover:opacity-80 transition duration-200"
              >
                <ArrowLeft size={18} className="mr-1" />
                Back
              </button>
              <h1 className="text-2xl font-bold text-[#2d2d2d]">Profile Settings</h1>
            </div>

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
                  type="button"
  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-emerald-600 text-white font-medium rounded-full shadow-md hover:bg-emerald-700 transition duration-200 transform hover:scale-[1.02]"
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
          </div>

          {/* Profile Header */}
          <div className="flex flex-col items-center sm:flex-row sm:items-start mb-8 gap-6">
            <div className="relative group flex-shrink-0">
              <img
                src={profile.profilePicture || DEFAULT_PROFILE_PICTURE}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg group-hover:opacity-80 transition duration-300"
              />
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition duration-300">
                  <label htmlFor="profilePictureInput" className="cursor-pointer text-white">
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
            <div className="text-center sm:text-left mt-4 sm:mt-0">
              <h2 className="text-3xl font-semibold text-[#2d2d2d]">{profile.name || 'Set Your Name'}</h2>
              <p className="text-[#6b5e5e]">{profile.email || 'No email set'}</p>
            </div>
          </div>

          {/* Form Fields */}
          <form id="profileFormFields" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Full Name" name="name" value={profile.name} icon={<User />} isEditing={isEditing} handleChange={handleChange} required placeholder="Please enter your full name" />
            <FormField label="Email Address" name="email" value={profile.email} icon={<Mail />} type="email" isEditing={isEditing} handleChange={handleChange} required pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$" placeholder="Please enter your email address" />
            <FormField label="Phone Number" name="phone" value={profile.phone} icon={<Phone />} type="tel" isEditing={isEditing} handleChange={handleChange} required pattern="[0-9]*" placeholder="Please enter your phone number (digits only)" />
            <FormField label="Address" name="address" value={profile.address} icon={<Home />} isEditing={isEditing} handleChange={handleChange} required placeholder="Enter your address" />

            <div className="mb-4">
              <label className="text-sm font-medium text-[#3b2f2f] mb-1 flex items-center">
                <Heart size={16} className="mr-2 text-[#3b2f2f]" />
                Gender
              </label>
              {isEditing ? (
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[#e6dccf] rounded-lg bg-[#f5f1e6] text-[#2d2d2d] focus:outline-none focus:ring-2 focus:ring-black transition duration-200"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              ) : (
                <div className="w-full px-4 py-2 bg-[#f5f1e6] rounded-lg text-[#2d2d2d] border border-[#e6dccf]">
                  {profile.gender || 'N/A'}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}