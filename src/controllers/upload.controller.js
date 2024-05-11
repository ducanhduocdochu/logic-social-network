'user strict'

const { BadRequestError } = require("../core/error.response")
const { SuccessResponse } = require("../core/success.reponse")
const { uploadImageFromUrl, uploadImageFromLocalFiles, uploadImageFromLocal, deleteUploadedFile } = require("../services/upload.service")

class uploadController {
    uploadFileFromLocal = async(req, res, next) => {
        const {file} = req
        if(!file){
            throw new BadRequestError('File missing')
        } 
        new SuccessResponse({
            message: 'upload file successfully',
            metadata: await uploadImageFromLocal({path: file.path}, req.user, req.body)
        }).send(res)
    }

    deleteUploadedFile = async(req, res, next) => {
        new SuccessResponse({
            message: 'Delete file successfully',
            metadata: await deleteUploadedFile(req.user, req.query)
        }).send(res)
    }

}

module.exports = new uploadController()