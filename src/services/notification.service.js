"use strict";

const { BadRequestError } = require("../core/error.response");
const { runProducerQueue } = require("../dbs/init.rabbit");
const notificationModel = require("../models/notification.model");
const {
  getUserByFollowId,
  getUserFollow,
  getFollowByUser,
} = require("../models/repositories/follower.repo");
const { findKeyByUserId } = require("../models/repositories/keytoken.repo");
const { createNoti } = require("../models/repositories/notification.repo");
const { getNameAvatarById } = require("../models/repositories/user.repo");
const { convertToObjectIdMongodb } = require("../utils");

class NotificationService {
  static pusNotiToSystem = async ({ type, user_name, id }, {post_id, follower_user_id}) => {

    // --------------------------------------------------
    // Check type
    // --------------------------------------------------
    if (type === "NEW POST") {
      // --------------------------------------------------
      // lay user follow
      // --------------------------------------------------
      let listFolow = await getFollowByUser({
        followed_user_id: id,
        limit: 10,
        sort: "createdAt",
        type_sort: 1,
        page: 1,
      });
      if (!listFolow) {
          throw new BadRequestError("Error: List Follow not exist");
        }
      // let listNoti = [];
      for (let follow of listFolow) {
        const newNoti = await createNoti({
          noti_type: "NEW POST",
          noti_senderId: id,
          noti_receivedId: follow.follower_user_id,
          noti_seen: false,
          option: {
            post_id
          }
        });

        if (!newNoti) {
          throw new BadRequestError("Error: Create noti fail");
        }

        const userRec = await getNameAvatarById({_id: follow.follower_user_id})
  
        await runProducerQueue(
          "PostApp",
          "NEW POST",
          JSON.stringify(
            {
              noti_type: "NEW POST",
              noti_senderId: id,
              noti_sender_name: user_name,
              noti_receivedId: listFolow.follower_user_id,
              noti_received_name: userRec.user_name,
              noti_seen: false,
              post_id,
            }
          )
        ).catch(console.error);
      }
        // --------------------------------------------------
        // Check đăng nhập
        // --------------------------------------------------
        // let key = await findKeyByUserId({ user_id: follow.follower_user_id });
        // if (!key) {
        //   throw new BadRequestError("Error: Check login fail");
        // }
      //   if (key.public_key != "") {
      //     // --------------------------------------------------
      //     // Tạo list đẩy thông báo các user đăng nhập
      //     // --------------------------------------------------
      //     listNoti.push({
      //       noti_type: "NEW POST",
      //       noti_senderId: id,
      //       noti_receivedId: key.user_id,
      //       noti_seen: false,
      //     });
      //     const newNoti = await createNoti({
      //       noti_type: "NEW POST",
      //       noti_senderId: id,
      //       noti_receivedId: key.user_id,
      //       noti_seen: false,
      //     });
      //     if (!newNoti) throw err;
      //   } else {
      //     const newNoti = await createNoti({
      //       noti_type: "NEW POST",
      //       noti_senderId: id,
      //       noti_receivedId: key.user_id,
      //       noti_seen: false,
      //     });
      //     console.log(newNoti);
      //   }
      // }
      // for (let noti of listNoti) {
      //   await runProducerQueue(
      //     "PostApp",
      //     "new post",
      //     JSON.stringify(noti)
      //   ).catch(console.error);
      // }
    }

    if (type === "ADD FRIEND") {
        const newNoti = await createNoti({
          noti_type: "ADD FRIEND",
          noti_senderId: follower_user_id,
          noti_receivedId: id,
          noti_seen: false,
          option: {}
        });

        if (!newNoti) {
          throw new BadRequestError("Error: Create noti fail");
        }

        const userRec = await getNameAvatarById({_id: follower_user_id})

        await runProducerQueue(
          "PostApp",
          "NEW POST",
          JSON.stringify(
            {
              noti_type: "ADD FRIEND",
              noti_senderId: follower_user_id,
              noti_sender_name: userRec.user_name,
              noti_receivedId: id,
              noti_received_name: user_name,
              noti_seen: false,
            }
          )
        ).catch(console.error);
      }

      if (type === "ACCEPT FRIEND") {
        const newNoti = await createNoti({
          noti_type: "ACCEPT FRIEND",
          noti_senderId: follower_user_id,
          noti_receivedId: id,
          noti_seen: false,
          option: {}
        });

        if (!newNoti) {
          throw new BadRequestError("Error: Create noti fail");
        }

        const userRec = await getNameAvatarById({_id: follower_user_id})
  
        await runProducerQueue(
          "PostApp",
          "NEW POST",
          JSON.stringify(
            {
              noti_type: "ACCEPT FRIEND",
              noti_senderId: follower_user_id,
              noti_sender_name: userRec.user_name,
              noti_receivedId: id,
              noti_received_name: user_name,
              noti_seen: false,
            }
          )
        ).catch(console.error);
      }
  };

  static listNotiByUser = async ({ type = "ALL", isRead = 0 }, { id }) => {
    const listNoti = await notificationModel.find({noti_receivedId: id})
    console.log(listNoti)

    const newNotis = await Promise.all(
      listNoti.map(async (noti) => {
        const { user_name, user_avatar } = await getNameAvatarById({
          _id: noti.noti_senderId,
        });

        return {
          ...noti._doc,
          noti_sender_name: user_name,
          noti_sender_avatar: user_avatar,
        };
      })
    );
    return newNotis;
  }
}

module.exports = NotificationService;
