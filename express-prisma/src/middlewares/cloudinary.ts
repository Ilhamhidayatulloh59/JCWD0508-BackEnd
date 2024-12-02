import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import * as streamifier from "streamifier";

cloudinary.config({
  api_key: "611585734934427",
  api_secret: "7wzGZNSjfs8unzEgzwezNiq8SBc",
  cloud_name: "dn6uglajh",
});

export const cloudinaryUpload = (
  file: Express.Multer.File,
  folder: string
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result as UploadApiResponse);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

export const cloudinaryRemove = async (secure_url: string) => {
  // extractPublicIdFormUrl(secure_url)
  const publicId = extractPublicIdFormUrl(secure_url);
  return await cloudinary.uploader.destroy(publicId);
};

const extractPublicIdFormUrl = (url: string) => {
  const urlParts = url.split("/");
  const publicIdWithExtension = urlParts[urlParts.length - 1];
  const publicId = publicIdWithExtension.split(".")[0];
  return publicId;
};
