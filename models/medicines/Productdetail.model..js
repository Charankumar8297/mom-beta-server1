const mongoose = require('mongoose');

const MedicineSchema = mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    medicine_name: {
      type: String,
      required: [true, 'Please enter medicine name'],
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    prescriptionDrug: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: true,
    },
    use: {
      type: String,
      required: true,
    },
    ingredients: {
      type: String,
    },
    dose: {
      type: String,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    notFor: {
      type: String,
    },
    sideEffects: {
      type: String,
    },
    store: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    manufactureDate: {
      type: Date,
      required: true,
    },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
      },
    ],
  },
  { timestamps: true }
);

const Medicineindetail = mongoose.model('Medicine', MedicineSchema);

module.exports = Medicineindetail;  // Exporting the model as 'Medicineindetail'
