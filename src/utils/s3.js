import AWS from "aws-sdk";
require("dotenv").config();  // bcoz sometimes process.env gives error while uploading image. So it is better to use it here also

// aws s3 bucket
const s3Bucket = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  region: "ap-south-1",  // Region of bucket
});

export const s3Upload = (options) => {
  return new Promise((resolve, reject) =>
    s3Bucket.upload(options, (error, data) => {
      if (error) return reject(error);
      return resolve(data);
    })
  );
};