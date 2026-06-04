import { v2 as cloudinary } from 'cloudinary';

export const uploadToCloudinary = (
  file: Express.Multer.File,
): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: 'campaigns',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      )
      .end(file.buffer);
  });
};