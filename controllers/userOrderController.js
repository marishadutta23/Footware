import Order from "../models/order.js";
import Coupon from "../models/coupon.js";

/**
 * User – checkout / create order
 */
export const checkoutOrder = async (req, res) => {
  try {
    console.log("CHECKOUT BODY 👉", req.body);

    const { products, cartTotal, appliedCouponCode } = req.body;
     console.log("PRODUCTS 👉", products);

    console.log("COUPON RECEIVED 👉", appliedCouponCode);

    if (!products || products.length === 0) {
      return res.status(400).json({
        message: "No products in order",
      });
    }

    // 🔥 Transform products → items (match schema)
const items = products.map((product) => ({
  product: product._id || product.id,
  name: product.title, // 👈 important
  image: product.image, // 👈 important
  quantity: product.quantity,
  price: product.price,
}));

    const order = await Order.create({
      user: req.user._id,
      items: items,
      totalAmount: cartTotal,
      status: "Processing",
    });

    // 🔥🔥🔥 ADD COUPON LOGIC HERE (AFTER ORDER CREATION)
    if (appliedCouponCode) {
      const coupon = await Coupon.findOne({
        code: appliedCouponCode,
      });

      if (coupon && !coupon.usedBy.includes(req.user._id)) {
        coupon.usedBy.push(req.user._id);
        await coupon.save();
      }
    }

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: order,
    });

  } catch (error) {
    console.error("CHECKOUT ERROR 👉", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/**
 * User – get own orders
 */
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
       // 🔥 VERY IMPORTANT
      .sort({ createdAt: -1 });

    return res.json(orders);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};