const express = require('express');
const router = express.Router();
const userAuth = require('../middlewares/userAuth')
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require('../controllers/wishlistControllers');


router.post('/add',userAuth, addToWishlist);


router.delete('/remove',userAuth, removeFromWishlist);


router.get('/getwishlist',userAuth, getWishlist);

module.exports = router;