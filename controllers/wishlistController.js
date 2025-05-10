const Wishlist = require('../models/wishlistModel');

// Add a product to the wishlist
const addToWishlist = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    let wishlist = await Wishlist.findOne({ userId });

    if (wishlist) {
      // Check if product already exists in the wishlist
      if (wishlist.products.includes(productId)) {
        return res.status(400).json({ message: 'Product already in wishlist.' });
      }
      wishlist.products.push(productId);
    } else {
      // Create a new wishlist for the user
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
  const { userId } = req.params;

  try {
    const wishlist = await Wishlist.findOne({ userId }).populate('products');

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found.' });
    }

    res.status(200).json({ wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};
