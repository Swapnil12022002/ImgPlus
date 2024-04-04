import mongoose from "mongoose";

const productSetSchema = new mongoose.Schema(
  {
    display_name: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ProductSet = mongoose.model("ProductSet", productSetSchema);
export default ProductSet;
