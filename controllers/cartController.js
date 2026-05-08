import Cart from "../models/cart.js";

// GET cart
export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product"
  );

  res.json(cart || { items: [] });
};

// ADD to cart
export const addToCart = async (req, res) => {
  const { productId, size } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
    });
  }


cart.items = cart.items.reduce((acc, item) => {
  const match = acc.find(
    i =>
      i.product.toString() === item.product.toString() &&
      (i.size || "") === (item.size || "")
  );

  if (match) {
    match.quantity += item.quantity;
  } else {
    acc.push(item);
  }

  return acc;
}, []);



const existingItem = cart.items.find(
  item =>
    item.product.toString() === productId.toString() &&
    String(item.size) === String(size)
);

if (existingItem) {
  existingItem.quantity += 1;
} else {
  cart.items.push({
    product: productId,
    size,
    quantity: 1,
  });
}

await cart.save();

// 🔥 ALWAYS GET UPDATED ITEM
const updatedItem = cart.items.find(
  item =>
    item.product.toString() === productId.toString() &&
    String(item.size) === String(size)
);

return res.json({
  message: `${updatedItem.quantity} items added to cart 🛒`,
  cart,
});
};

// ✅ UPDATE cart item quantity
export const updateCartItem = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const item = cart.items.id(itemId);
  if (!item) return res.status(404).json({ message: "Item not found" });

  item.quantity = quantity;
  await cart.save();

  res.json(cart);
};

// REMOVE item
export const removeFromCart = async (req, res) => {
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter(item => item._id.toString() !== itemId);
  await cart.save();

  res.json({
  message: "Item removed from cart",
  cart,
});
};
