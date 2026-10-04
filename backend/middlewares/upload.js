const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

function uploadBufferToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Borrado "best effort": un fallo en Cloudinary no debe bloquear la operación principal.
async function deleteFromCloudinary(publicIds) {
  await Promise.all(
    (publicIds || []).filter(Boolean).map((publicId) =>
      cloudinary.uploader.destroy(publicId).catch((err) => {
        console.error(`No se pudo borrar la imagen ${publicId} de Cloudinary:`, err.message);
      })
    )
  );
}

module.exports = { upload, uploadBufferToCloudinary, deleteFromCloudinary };
