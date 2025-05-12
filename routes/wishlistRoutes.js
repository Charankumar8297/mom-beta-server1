const express = require('express');
const router = express.Router();
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require('../controllers/wishlistControllers');


router.post('/add', addToWishlist);


router.post('/remove', removeFromWishlist);


router.get('/:userId', getWishlist);

module.exports = router;