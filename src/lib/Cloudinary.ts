import cloudinary from "cloudinary";

export const cloudinaryConfig = cloudinary.v2.config({
    secure: true,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    secure_cdn_subdomain: true
});

export const Cloudinary = cloudinary.v2;