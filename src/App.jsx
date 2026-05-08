//import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import Login from "./pages/Login";
//import Register from "./pages/Register";
//import Signup from './Signup'
import Home from './pages/home';
import Landing from './pages/landing';

import Login from './pages/auth/login';
import LogOut from './pages/auth/logout';

import ForgotPassword from './pages/auth/forgotPassword';
import Signup from './pages/auth/signup';
import ResetPassword from './pages/auth/resetPassword';

import Loading from './components/common/loadingSpiner';
import Error from './components/common/errorPage';

import Dashboard from "./pages/admin/dashboard";
import Products from "./pages/admin/productsManage";
import Coupon from "./pages/admin/couponManage";
import Orders from "./pages/admin/ordersManage";
import Customers from "./pages/admin/customerDetails";
import Review from "./pages/admin/reviews";
import Profile from "./pages/admin/profile";
import AddProducts from "./pages/admin/addProduct";
//import AdminProducts from './pages/admin/productsdetail2';
//import CartPage from './pages/admin/cart2';

import UserDash from "./pages/user/userDashboard";
import UserReview from "./pages/user/userReview";
import UserCoupon from "./pages/user/userCoupons";
import UserOrders from "./pages/user/userOrders";
import Wishlist from "./pages/user/userWishlist";
import UserProfile from "./pages/user/profile1";
import UserHome from "./pages/user/userHome";

import Cart from "./pages/user/cart";

import Product from './pages/user/productDetaills';
import ProductsPage from './pages/user/productsPage';

import Paymentmethod from './components/payment/paymentOptions';
import Payment from "./pages/user/payment";
import SuccessfulPayment from './components/payment/paymentSuccessful';
//import { BrowserRouter, Routes, Route } from 'react-router-dom';

//browserouter - the box where the url is shwing
//routes - the url itself
//route - anypart of the url having / (ex- localhost://3000/login , here /login is the route)

function App() {

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

    <BrowserRouter>
      <Routes>      
        <Route path="/" element={<Landing/>}></Route>
        <Route path="/home" element={<Home/>}></Route>

        <Route path="/register" element={<Signup/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/logout" element={<LogOut/>}></Route>

        <Route path="/forgotPassword" element={<ForgotPassword/>}></Route>
        <Route path="/reset-password/:token" element={<ResetPassword/>}></Route>

        <Route path="/loading" element={<Loading/>}></Route>
        <Route path="/error" element={<Error/>}></Route>

        <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path="/productsManage" element={<Products/>}></Route>
        <Route path="/couponsManage" element={<Coupon/>}></Route>
        <Route path="/ordersManage" element={<Orders/>}></Route>
        <Route path="/customer" element={<Customers/>}></Route>
        <Route path="/reviewsManage" element={<Review/>}></Route>
        <Route path="/profile" element={<Profile/>}></Route>
        <Route path="/addProducts" element={<AddProducts/>}></Route>
        
        
        <Route path="/products/edit/:id" element={<AddProducts />} />


        <Route path="/userDashboard" element={<UserDash/>}></Route>
        <Route path='/userReview' element={<UserReview/>}></Route>
        <Route path ='/userCoupons' element={<UserCoupon/>}></Route>
        <Route path='/userWishlist' element={<Wishlist/>}></Route>
        <Route path='/userOrders' element={<UserOrders/>}></Route>
        <Route path="/Profiles" element={<UserProfile/>}></Route>
        <Route path="/userHome" element={<UserHome/>}></Route>

        <Route path="/cart" element={<Cart/>}></Route>
        
        <Route path="/product/:id" element={<Product/>} />

        <Route path='/productsPage' element={<ProductsPage/>}></Route>

        <Route path='/payment' element={<Paymentmethod/>}></Route>
        <Route path="/paymentqr" element={<Payment />} />
        <Route path='/paymentSuccess' element={<SuccessfulPayment/>}></Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;

