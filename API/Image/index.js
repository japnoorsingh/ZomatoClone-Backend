// Library
import express from "express";
import multer from "multer";

// Database modal
import { ImageModel } from "../../database/allModels";

const Router = express.Router();

// multer config
const storage = multer.memoryStorage();   // Multer makes it possible to access your system memory (RAM). Basically if you have weak internet connection, the image you upload will be stored for some time in our RAM and then it will take its time to upload it to the bucket.
const upload = multer({ storage });

// utility function
import { s3Upload } from "../../utils/s3.js";

/**
 * Route        /
 * Des          Uploads given image to s3 bucket and saves file link to mongodb
 * Params       none
 * Access       Public
 * Method       POST
 */
Router.post("/", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    // s3 bucket options
    const bucketOptions = {
      Bucket: "zomato-clone-japnoorsingh",
      Key: file.originalname,  // what was the original name of the file
      Body: file.buffer,  // buffer -> sequence of numbers that represent your imagw
      ContentType: file.mimetype,  // Type of the file uploaded
      ACL: "public-read", // Access Control List -> Who can access the list
    };

    const uploadImage = await s3Upload(bucketOptions);  

    const saveImageToDatabase = await ImageModel.create({
      images: [{ location: uploadImage.Location }], 
    });

    return res.status(200).json(saveImageToDatabase);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

Router.get("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const image = await ImageModel.findById(_id);

    return res.status(200).json(image);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default Router;