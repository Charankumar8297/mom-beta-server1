const express = require('express');
const router = express.Router();
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require('../controllers/wishlistController');

// Route to add a product to the wishlist
router.post('/add', addToWishlist);

// Route to remove a product from the wishlist
router.post('/remove', removeFromWishlist);

// Route to get a user's wishlist
router.get('/:userId', getWishlist);

module.exports = router;
