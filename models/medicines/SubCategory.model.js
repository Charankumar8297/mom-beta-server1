const mongoose = require('mongoose');
const { Schema } = mongoose;

const subCategorySchema = new Schema(
  {
    subcategory_name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
    },
    medicines: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine',
        required: false,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('SubCategory', subCategorySchema);