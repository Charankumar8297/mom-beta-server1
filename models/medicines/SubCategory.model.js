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
    },
    medicines: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('SubCategory', subCategorySchema);
