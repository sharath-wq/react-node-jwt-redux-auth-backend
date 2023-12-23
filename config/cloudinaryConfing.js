const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: "djnljzyhb",
    api_key: "283675542447934",
    api_secret: "7RUYAvWzSaZ953yScA-BSqw4dnw",
});

async function handleUpload(file) {
    const res = await cloudinary.uploader.upload(file, {
        resource_type: "auto",
        folder: "profile",
    });
    return res;
}

module.exports = { cloudinary, handleUpload };
