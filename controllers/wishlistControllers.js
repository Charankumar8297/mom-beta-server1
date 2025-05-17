const Wishlist = require('../models/wishlist');
const mongoose = require("mongoose")

// Add a product to the wishlist
const addToWishlist = async (req, res) => {
  const {productId } = req.body;
  const userId  = req.userId

  try {
    let wishlist = await Wishlist.findOne({ userId });

    if (wishlist) {
     
      if (wishlist.products.includes(productId)) {
        return res.status(400).json({ message: 'Product already in wishlist.' });
      }
      wishlist.products.push(productId);
    } else {
     
      wishlist = new Wishlist({ userId, products: [productId] });
    }

    await wishlist.save();
    res.status(200).json({ message: 'Product added to wishlist.', wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

// Remove a product from the wishlist
const removeFromWishlist = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found.' });
    }

    wishlist.products = wishlist.products.filter(
      (prodId) => prodId.toString() !== productId
    );

    await wishlist.save();
    res.status(200).json({ message: 'Product removed from wishlist.', wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

// Get a user's wishlist
const getWishlist = async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }  
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const wishlist = await Wishlist.findOne({ userId: userObjectId }).populate('products');

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found.' });
    }

    res.status(200).json({ wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};

