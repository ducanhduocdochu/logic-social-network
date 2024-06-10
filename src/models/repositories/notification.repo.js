const notificationModel = require("../notification.model");

const createNoti = async ({
  noti_type,
  noti_senderId,
  noti_receivedId,
  noti_seen,
  option
}) => {
  return await notificationModel.create({
    noti_type,
    noti_senderId,
    noti_receivedId,
    noti_seen,
    option
  });
};

module.exports = { createNoti };
