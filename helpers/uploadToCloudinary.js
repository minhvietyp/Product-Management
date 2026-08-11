const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Upload stream từ Buffer
let streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });

    // Đã sửa: dùng buffer trực tiếp thay vì req.file.buffer
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

module.exports = async (buffer) => {
  let result = await streamUpload(buffer);
  return result.secure_url;
};