"use strict";
const { findUserById } = require("../models/repositories/user.repo");
const { getInfoData } = require("../utils");

class UserService {
  static getInfoUser = async (user) => {
    // --------------------------------------------------
    // Lấy Info
    // --------------------------------------------------
    const foundUser = await findUserById({ _id: user.id });

    return {
        foundUser: getInfoData({
          fileds: [
            "id",
            "user_slug",
            "user_name",
            "user_avatar",
            "user_gender",
            "user_date_of_birth",
            "user_location",
            "user_occupation",
            "user_twitter",
            "user_facebook",
            "user_linkedin",
            "user_email",
            "user_phone",
            "user_status",
            "user_type",
          ],
          object: foundUser,
        }),
    };
  };

  static getInfoUserById = async ({ id }) => {
    // --------------------------------------------------
    // Lấy Info
    // --------------------------------------------------
    const foundUser = await findUserById({ _id: id });

    return {
        foundUser: getInfoData({
          fileds: [
            "id",
            "user_slug",
            "user_name",
            "user_avatar",
            "user_gender",
            "user_date_of_birth",
            "user_location",
            "user_occupation",
            "user_twitter",
            "user_facebook",
            "user_linkedin",
            "user_email",
            "user_phone",
            "created_at",
          ],
          object: foundUser,
        }),
    };
  };
}

module.exports = UserService;
