import utils from "../../../utils/util.js";

Page({
  data: {
    userComments: [],
  },

  onLoad: function (options) {
    this.getUserComment();
  },

  getUserComment() {
    utils.queryUserComment().then(res => {
      console.log(res.data);
      if (res.data.code == 200) {
        let responseData = res.data.data
        if (responseData.length !== 0) {
          this.setData({
            userComments: responseData,
            hasComment: true
          })
        }
        else if (responseData.length === 0) {
          this.setData({
            hasComment: false
          })
        }
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