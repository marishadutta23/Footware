import User from "../models/User.js";
import Product from "../models/product.js";
import Order from "../models/order.js";import mongoose from "mongoose";

// ================================
// GET DASHBOARD STATS
// ================================
export const getDashboardStats = async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments();

    // New users today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayUsers = await User.countDocuments({
      createdAt: { $gte: today },
    });

    // Total products
    const totalProducts = await Product.countDocuments();

    // Mock sales value (replace with Order model later)
// 💰 TOTAL SALES
const totalSalesAgg = await Order.aggregate([
  { $group: { _id: null, total: { $sum: "$totalAmount" } } },
]);

const totalSales = totalSalesAgg[0]?.total || 0;

// 💰 TODAY SALES
const todaySalesAgg = await Order.aggregate([
  {
    $match: {
      createdAt: { $gte: today },
    },
  },
  {
    $group: {
      _id: null,
      total: { $sum: "$totalAmount" },
    },
  },
]);

const todaySales = todaySalesAgg[0]?.total || 0;

    res.status(200).json({
      success: true,
      stats: {
        todayMoney: todaySales,
        todayUsers,
        totalUsers,
        totalProducts,
        totalSales,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================================
// SALES OVERVIEW (MONTHLY)
// ================================
export const getSalesOverview = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { "_id": 1 },
      },
    ]);

    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const formatted = sales.map((item) => ({
      name: months[item._id - 1],
      sales: item.total,
    }));

    res.json({ success: true, sales: formatted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================================
// SALES BY COUNTRY
// ================================
export const getSalesByCountry = async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $group: {
          _id: "$userDetails.country",
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    const formatted = data.map((d) => ({
      country: d._id || "Unknown",
      sales: d.total,
    }));

    res.json({ success: true, countries: formatted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL ORDERS (Admin)
export const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "fullName email")
    .populate("items.product", "name image price")
    .sort({ createdAt: -1 });

  res.json(orders);
};


// UPDATE ORDER STATUS (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================================
// GET ALL CUSTOMERS (Admin)
// ================================
export const getAllCustomers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select(
      "username email phone createdAt"
    );

    const customers = await Promise.all(
      users.map(async (user) => {
        // ✅ Correct way: match by ObjectId
        const orders = await Order.find({ user: user._id });

        // ✅ Correct field name: totalAmount
        const totalSpent = orders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        );

        return {
          id: user._id,
          name: user.username,
          email: user.email,
          phone: user.phone,
          orders: orders.length,
          total: totalSpent,
        };
      })
    );

    res.status(200).json({
      success: true,
      customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
