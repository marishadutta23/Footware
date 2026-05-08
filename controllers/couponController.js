import Coupon from "../models/coupon.js";

/**
 * GET all coupons (Admin)
 */
export const getCoupons = async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.status(200).json(coupons);
};

/**
 * CREATE coupon
 */
export const createCoupon = async (req, res) => {
     console.log("CREATE COUPON HIT");
  console.log("USER:", req.user);
  console.log("BODY:", req.body);

  const { code, discount, expiry } = req.body;

  const exists = await Coupon.findOne({ code });
  if (exists) {
    return res.status(400).json({ message: "Coupon already exists" });
  }

  const coupon = await Coupon.create({
    code,
    discount,
    expiry,
  });

  res.status(201).json(coupon);
};

/**
 * UPDATE coupon
 */
export const updateCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return res.status(404).json({ message: "Coupon not found" });
  }

  coupon.code = req.body.code || coupon.code;
  coupon.discount = req.body.discount || coupon.discount;
  coupon.expiry = req.body.expiry || coupon.expiry;

  await coupon.save();
  res.status(200).json(coupon);
};

/**
 * DELETE coupon
 */
export const deleteCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return res.status(404).json({ message: "Coupon not found" });
  }

  await coupon.deleteOne();
  res.status(200).json({ message: "Coupon deleted" });
};
/**
 * VALIDATE coupon (User)
 */
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Coupon code required" });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      expiry: { $gte: new Date() },
    });

    if (!coupon) {
      return res.status(400).json({ message: "Invalid or expired coupon" });
    }

    const alreadyUsed = coupon.usedBy?.some(
      id => id.toString() === req.user._id.toString()
    );

    if (alreadyUsed) {
      return res.status(400).json({
        message: "You have already used this coupon",
      });
    }

    // ✅ SAVE USER ID (MARK COUPON AS USED)
    coupon.usedBy.push(req.user._id);
    await coupon.save();

    res.status(200).json({
      code: coupon.code,
      discount: coupon.discount,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};