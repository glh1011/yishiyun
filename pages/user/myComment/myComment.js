import utils from "../../../utils/util.js";

Page({

  data: {
    userComments: [],
    // hasComment: ''
  },

  onLoad: function (options) {
    this.getUserComment();
  },

  getUserComment() {
    utils.queryUserComment().then(res => {
      console.log(res.data);
      if (res.data.code == 200) {
        let responseData = res.data.data
        this.setData({
          userComments: responseData,
          hasComment: true
        })
      } else {
        this.setData({
          hasComment: false
        })
      }
    }).catch(res => {
      console.log(res);
      this.setData({
        hasComment: false
      })
    })
  },
})