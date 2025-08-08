const cloudinary = require("../config/cloudinary");

exports.cloudUpload = async(file,folder,height,width)=>{
try {
   const option = {
    resource_type:"auto",
    folder:folder, 
 }
 if(height){
   option.height =height
 }
 if(width){
   option.width = width;
 }

  return await cloudinary.uploader.upload(file.tempFilePath,option);


} catch (error) {
   console.log("Error while uploading in cloudinary",error);
}
}

exports.deleteFile = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error occurred during file deletion:", error);
    throw error; 
  }
};
