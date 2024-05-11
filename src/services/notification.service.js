"use strict";

const { BadRequestError } = require("../core/error.response");
const { runProducerQueue } = require("../dbs/init.rabbit");
const notificationModel = require("../models/notification.model");
const {
  getUserByFollowId,
  getUserFollow,
} = require("../models/repositories/follower.repo");
const { findKeyByUserId } = require("../models/repositories/keytoken.repo");
const { createNoti } = require("../models/repositories/notification.repo");
const { convertToObjectIdMongodb } = require("../utils");

class NotificationService {
  static pusNotiToSystem = async ({ type, id }) => {
    // --------------------------------------------------
    // Check type
    // --------------------------------------------------
    if (type === "NEW POST") {
      // --------------------------------------------------
      // lay user follow
      // --------------------------------------------------
      let listFolow = await getUserFollow({
        id,
        limit: 10,
        sort: "createdAt",
        type_sort: 1,
        page: 1,
      });
      if (!listFolow) {
          throw new BadRequestError("Error: List Follow not exist");
        }
      let listNoti = [];
      for (let follow of listFolow) {
        // --------------------------------------------------
        // Check đăng nhập
        // --------------------------------------------------
        let key = await findKeyByUserId({ user_id: follow.followerUserId });
        if (!key) {
          throw new BadRequestError("Error: Check login fail");
        }
        if (key.public_key != "") {
          // --------------------------------------------------
          // Tạo list đẩy thông báo các user đăng nhập
          // --------------------------------------------------
          listNoti.push({
            noti_type: "NEW POST",
            noti_senderId: id,
            noti_receivedId: key.user_id,
            noti_seen: false,
          });
          const newNoti = await createNoti({
            noti_type: "NEW POST",
            noti_senderId: id,
            noti_receivedId: key.user_id,
            noti_seen: false,
          });
          if (!newNoti) throw err;
        } else {
          const newNoti = await createNoti({
            noti_type: "NEW POST",
            noti_senderId: id,
            noti_receivedId: key.user_id,
            noti_seen: false,
          });
          console.log(newNoti);
        }
      }

      for (let noti of listNoti) {
        await runProducerQueue(
          "PostApp",
          "new post",
          JSON.stringify(noti)
        ).catch(console.error);
      }
    }
  };

  static listNotiByUser = async ({ type = "ALL", isRead = 0 }, { user_id }) => {
    try {
      const match = { noti_receivedId: convertToObjectIdMongodb(user_id) };

      if (type !== "ALL") {
        match["noti_type"] = type;
      }

      const notifications = await notificationModel.aggregate([
        { $match: match },
        {
          $project: {
            noti_type: 1,
            noti_senderId: 1,
            noti_receivedId: 1,
            noti_content: 1,
            noti_option: 1,
            createdAt: 1,
          },
        },
      ]);

      return notifications;
    } catch (error) {
      throw new BadRequestError("Error: Get list noti fail");
    }
  };
}

module.exports = NotificationService;
