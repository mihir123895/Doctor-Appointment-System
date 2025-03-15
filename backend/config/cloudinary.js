import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME, // Use correct env variable
    api_key: process.env.CLOUDINARY_API_KEY, // Use correct env variable
    api_secret: process.env.CLOUDINARY_SECRET_KEY, // Use correct env variable
  });
};

export default connectCloudinary;
