import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    descript: { type: String, required: true },
    isVeg: { type: Boolean, required: true },
    isContainsEgg: { type: Boolean, required: true },
    category: { type: String, required: true },
    photos: {
      type: mongoose.Types.ObjectId,  // The same type as that in mongodb - basically ill refer to the id of the object (photo in this case)
      ref: "Images",  // Photos will refer to the images collection in  mongodb
    },
    price: { type: Number, default: 150, required: true },
    addOns: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Foods",
      },
    ],
    restaurant: {
      type: mongoose.Types.ObjectId,
      ref: "Restaurants",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const FoodModel = mongoose.model("Foods", FoodSchema);