import utils from "../../../utils/util.js";
import auth from "../../../utils/auth.js";

const app = getApp();
const { $Toast } = require('../../../dist/base/index');

Component({
  options: {
    addGlobalClass: true,
  },

  data: {
    monetarySum: 0,
    calorieSum: 0,
    icNumber: null,
  },

  attached: function (options) {
    this.setData({
      hasLogin: app.globalData.indexLoginStatus
    })
    if(this.data.hasLogin) {
      this.getData();
    }
  },

  methods: {
    getData: function () {
      utils.queryUser().then(res => {
        if (res.data.code === 200) {
          let responseData = res.data.data;
          this.setData({
            calorieSum: responseData.calorieSum,
            icNumber: responseData.icNumber,
            monetarySum: responseData.money,
            userName: responseData.userName
          })
        } else if (res.data.code === 202) {
          // console.log("获取信息出错", res.data.msg);
          // $Toast({
          //   content: '获取信息失败',
          //   type: 'error'
          // });
        } else {
          console.log("获取信息失败", res);
          // $Toast({
          //   content: '获取信息失败',
          //   type: 'error'
          // });
          utils.showToastWindow('获取信息失败');
        }
      }).catch(res => {
        console.log("获取信息失败", res);
        utils.showToastWindow('获取信息失败');
        // $Toast({
        //   content: '获取信息失败',
        //   type: 'error'
        // });
      })
    },  
    logout: function() {
      utils.logout().then(res=>{
        if (res.data.code === 200){
          wx.removeStorageSync("token")
          wx.removeStorageSync("isFaceDetect");
          wx.showToast({
            title: "已退出，跳转中",
            icon: 'loading',
            duration: 2000,
            mask: true,
            success: function () {
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/index/index',
                })
              }, 1000) //延迟时间
            },
          });

          // $Toast({
          //   content: '正在退出...',
          //   icon: 'loading',
          //   duration: 0,
          //   mask: false
          // });
          // setTimeout(() => {
          //   wx.redirectTo({
          //     url: '/pages/index/index',
          //   })
          // }, 1000);

        } else {
          utils.showToastWindow("退出登录失败");
          // $Toast({
          //   content: '退出登录失败',
          //   type: 'error'
          // });
        }
      }).catch(res=>{
        console.log("退出登录出错");
        utils.showToastWindow("退出登录失败");
        // $Toast({
        //   content: '退出登录失败',
        //   type: 'error'
        // });
      })
    },
    toFaceDetect() {
      auth.checkHasLogined().then(isLogined => {
        console.log(isLogined);
        if (isLogined) {
          wx.navigateTo({
            url: '/pages/user/faceDetect/faceDetect',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        } else {
          wx.showModal({
            title: '您还未登录',
            content: '请先登录再进行操作',
            confirmText: '立即登录',
            cancelText: '暂不登录',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/login/login',
                })
              } else if (res.cancel) {
                console.log('用户点击取消');
               
              }
            }
          })
        }
      })
    }
  }
})