"use strict";

const JWT = require("jsonwebtoken");
const {
  AuthFailureError,
  NotFoundError,
} = require("../../core/error.response");
// const { findKeyByUserId } = require('../../models/repositories/keytoken.repo')
const asyncHandler = require("../../helpers/asyncHandler");
const { findKeyByUserId } = require("../../models/repositories/keytoken.repo");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "rtoken-id",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error("error verify", err);
      } else {
        console.log("decode verify", decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {}
};

const authentication = (isRequired) =>
  asyncHandler(async (req, res, next) => {
    if (isRequired) {
      // --------------------------------------------------
      // Validate user_id
      // --------------------------------------------------
      const userId = req.headers[HEADER.CLIENT_ID];
      if (!userId || userId == "") {
        throw new AuthFailureError("Error: Invalid request");
      }

      // --------------------------------------------------
      // Lấy public key, private key, refresh token
      // --------------------------------------------------
      const keyStore = await findKeyByUserId({ user_id: userId });
      if (!keyStore) throw new NotFoundError("Error: Not found keyStore");

      // --------------------------------------------------
      // Trường hợp authentication
      // --------------------------------------------------
      try {
        // --------------------------------------------------
        // Validate access token và giải mã
        // --------------------------------------------------
        const accessToken = req.headers[HEADER.AUTHORIZATION];
        if (!accessToken || accessToken == "")
          throw new AuthFailureError("Error: Invalid Request");
        const decodeUser = await verifyJWT(accessToken, keyStore.public_key);
        // --------------------------------------------------
        // Kiểm tra refresh token khớp với user_id
        // --------------------------------------------------
        if (userId != decodeUser.id)
          throw new AuthFailureError("Error: Invalid userId");

        // --------------------------------------------------
        // Gán vào request
        // --------------------------------------------------
        req.keyStore = keyStore;
        req.user = decodeUser;
        return next();
      } catch (err) {
        throw err;
      }
    } else {

      // --------------------------------------------------
      // Validate user_id
      // --------------------------------------------------
      const userId = req.headers[HEADER.CLIENT_ID];
      if (!userId || userId == "") {
        return next();
      }

      // --------------------------------------------------
      // Lấy public key, private key, refresh token
      // --------------------------------------------------
      const keyStore = await findKeyByUserId({ user_id: userId });
      if (!keyStore) return next();

      // --------------------------------------------------
      // Trường hợp authentication
      // --------------------------------------------------
      try {
        // --------------------------------------------------
        // Validate access token và giải mã
        // --------------------------------------------------
        const accessToken = req.headers[HEADER.AUTHORIZATION];
        if (!accessToken || accessToken == "") return next();
        const decodeUser = await verifyJWT(accessToken, keyStore.public_key);
        // --------------------------------------------------
        // Kiểm tra refresh token khớp với user_id
        // --------------------------------------------------
        if (userId != decodeUser.id) return next();

        // --------------------------------------------------
        // Gán vào request
        // --------------------------------------------------
        req.keyStore = keyStore;
        req.user = decodeUser;
        return next();
      } catch (err) {
        return next();
      }
    }
  });

// const authentication = asyncHandler(async (req, res, next) => {
//   // --------------------------------------------------
//   // Validate user_id
//   // --------------------------------------------------
//   const userId = req.headers[HEADER.CLIENT_ID];
//   console.log(userId)
//   if (!userId || userId == "") {
//     throw new AuthFailureError("Error: Invalid request");
//   }

//   // --------------------------------------------------
//   // Lấy public key, private key, refresh token
//   // --------------------------------------------------
//   const keyStore = await findKeyByUserId({ _id: userId });
//   if (!keyStore) throw new NotFoundError("Error: Not found keyStore");

//   // --------------------------------------------------
//   // Trường hợp authentication
//   // --------------------------------------------------
//   try {
//     // --------------------------------------------------
//     // Validate access token và giải mã
//     // --------------------------------------------------
//     const accessToken = req.headers[HEADER.AUTHORIZATION];
//     if (!accessToken || accessToken == "")
//       throw new AuthFailureError("Error: Invalid Request");
//     const decodeUser = await verifyJWT(accessToken, keyStore.publicKey);
//     // --------------------------------------------------
//     // Kiểm tra refresh token khớp với user_id
//     // --------------------------------------------------
//     if (userId != decodeUser.user_id)
//       throw new AuthFailureError("Error: Invalid userId");

//     // --------------------------------------------------
//     // Gán vào request
//     // --------------------------------------------------
//     req.keyStore = keyStore;
//     req.user = decodeUser;
//     return next();
//   } catch (err) {
//     throw err;
//   }
// });

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
};
