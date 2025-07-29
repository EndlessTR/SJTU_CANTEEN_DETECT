const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

exports.main = async (event, context) => {
  const { restaurant } = event;
  try {
    const res = await db.collection('comments')
      .where({
        restaurant: restaurant
      })
      .field({
        starRating: true
      })
      .get();

    const comments = res.data;
    if (comments.length === 0) {
      return {
        success: true,
        averageRating: 0
      };
    }

    const totalRating = comments.reduce((sum, comment) => sum + comment.starRating, 0);
    const averageRating = totalRating / comments.length;

    return {
      success: true,
      averageRating: averageRating
    };
  } catch (err) {
    return {
      success: false,
      error: err.toString()
    };
  }
};