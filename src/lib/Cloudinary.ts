import cloudinary from "cloudinary";

export const cloudinaryConfig = cloudinary.v2.config({
    secure: true,
});

export const Cloudinary = cloudinary.v2;