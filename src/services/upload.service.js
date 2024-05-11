'use strict'

const fs = require('fs');
const cloudinary = require("../configs/config.cloudinary");
const { BadRequestError } = require('../core/error.response');

const uploadImageFromLocal = async({path}, {id, username}, {type}) => {
    const folderName = id + username + type
    try{
        const result = await cloudinary.uploader.upload(path, {
            public_id: 'thumb',
            folder: folderName
        })
        if (!result) {
            throw new BadRequestError("Error: Upload fail");
        }
        fs.unlink(path, (err) => {
            if (err) {
                throw new BadRequestError("Error: Upload fail");
            }
            console.log('File deleted successfully');
        });
        return {
            image_url: result.secure_url,
            thumb_url: await cloudinary.url(result.public_id, {
                height: 100,
                width: 100,
                format: 'jpg'
            }),
            public_id: result.public_id
        }
    } catch(err){
        console.error(err)
    }
}

const deleteUploadedFile = async ({id, username},{public_id}) => {
    console.log(public_id)
    try {
        const result = await cloudinary.uploader.destroy(public_id);

        if (result.result === 'ok') {
            return {
                result: result.result,
                public_id: result.public_id
            }
        } else {
            throw new BadRequestError("Error: Delete fail");
        }
    } catch (error) {
        throw new BadRequestError("Error: Delete fail");
    }
};


module.exports = {
    deleteUploadedFile,
    uploadImageFromLocal,
}
