// Libraries
import express from "express";
import passport from "passport";

// Database modal
import { OrderModel } from "../../database/allModels";

// ValidateUser
import ValidateUser from "../../config/validateUser";

const Router = express.Router();

/**
 * Route        /
 * Des          GET all orders based on id
 * Params       _id
 * Access       Private
 * Method       GET
 */
Router.get("/:_id", passport.authenticate("jwt"), async (req, res) => { // passport.authenticate = Making the route private
  try {
    await ValidateUser(req, res);
    const { _id } = req.params;

    const getOrders = await OrderModel.findOne({ user: _id });  // Get all orders of the user

    if (!getOrders) {
      return res.status(400).json({ error: "User not found" });
    }

    return res.status(200).json({ orders: getOrders });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Route        /new/:_id  // Add new order
 * Des          Add new order
 * Params       _id
 * Access       Private
 * Method       POST or PUT
 */
Router.post("/new/:_id", passport.authenticate("jwt"), async (req, res) => {
  try {
    const { _id } = req.params;
    const { orderDetails } = req.body;

    const addNewOrder = await OrderModel.findOneAndUpdate(
      {
        user: _id,  
      },
      {
        $push: { orderDetails },  // What you want to update -> push those order into the array.
      },
      { new: true }  // When you update a documment, new order (updated) you will have to make it true so that it returns updated data
    );

    return res.json({ order: addNewOrder });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default Router;