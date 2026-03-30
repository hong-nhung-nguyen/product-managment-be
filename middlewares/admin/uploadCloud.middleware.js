const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Cloundinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
})
// End Cloundinary Configuration

module.exports.upload = async (req, res, next) => {
    try {
        if (req.file) {
            const folder = req.uploadFolder || "product-thumbnails";
            const streamUpload = (buffer) => {
                return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: folder },
                    (error, result) => {
                    if (result) resolve(result);
                    else reject(error);
                    }
                );

                streamifier.createReadStream(buffer).pipe(stream);
                });
        };

        const uploadResult = await streamUpload(req.file.buffer);

        req.body[req.file.fieldname] = uploadResult.secure_url;
        }

        next();
    } catch(error) {
        console.log(error);
    }
}