import utils from "../../../utils/util.js";
import auth from "../../../utils/auth.js";

const app = getApp();
var timer;
var errorCounts = 0;

Page({
  data: {
    direction: 1,
    stepToast: '正在识别',
    detailToast: '请将面部位于人脸识别区域中，并稍俯面部',
  },

  onLoad() {
    var that = this;
    var sysInfo = wx.getSystemInfoSync()
    that.setData({
      windowWidth: sysInfo.windowWidth,
    })
    var isFaceDetect = wx.getStorageSync("isFaceDetect");
    console.log(isFaceDetect);
    if(isFaceDetect == true){
      wx.showModal({
        title: '您已经录入过人脸',
        content: '请选择是否再次录入',
        confirmText: '继续录入',
        cancelText: '暂不录入',
        success(res) {
          if (res.confirm) {
            
            that.showTip();
          } else if (res.cancel) {
            console.log('用户点击取消');
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }else{
      that.showTip();
    } 
  },

  onHide() {
    errorCounts = 0;
  },

  showTip() {
    let that = this;
    wx.showModal({
      title: "声明",
      content: "根据检测到的人脸，自动采集上下左右四张照片，即可在食堂的人脸识别收银设备上，实现刷脸识别身份并进行支付",
      showCancel: true,
      cancelText: "取消",
      cancelColor: "#000",
      confirmText: "确定",
      confirmColor: "#1cbbb4",
      success: function (res) {
        if (res.confirm) {
          that.ctx = wx.createCameraContext()
          that.takePhoto();
        }
        else if (res.cancel) {
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },

  downDetect() {
    this.setData({
      direction: 2,
      num: 1
    })
    this.ctx = wx.createCameraContext()
    this.takePhoto();
  },

  leftDetect() {
    this.setData({
      direction: 3,
      num: 2
    })
    this.ctx = wx.createCameraContext()
    this.takePhoto();
  },

  rightDetect() {
    this.setData({
      direction: 4,
      num: 3
    })
    this.ctx = wx.createCameraContext()
    this.takePhoto();
  },

  finish() {
    wx.navigateBack({
      delta: 1
    })
  },

  error(e) {
    console.log(e.detail);
    wx.showModal({
      title: "提示",
      content: "您已拒绝摄像头权限，如想开通，可点击右上菜单-关于吃一口自助-右上角菜单-设置中进行权限的手动设置并重新进入，或删除小程序后重新添加",
      showCancel: false,
      cancelColor: "#000",
      confirmText: "确定",
      confirmColor: "#1cbbb4",
      success: function (res) {
        if (res.confirm) {
        }
      }
    })
  },

  //拍照
  takePhoto: function () {
    //如果连续错误15次就退出
    if(errorCounts >= 15) {
      errorCounts = -1;
      wx.navigateBack({
        delta: 1
      })
    }
    var that = this;
    that.ctx.takePhoto({
      quality: 'low',
      success: (res) => {
        this.imgToBase64(res.tempImagePath);
      }
    })
  },
  //照片转Base64
  imgToBase64(picUrl) {
    let that = this;
    wx.getFileSystemManager().readFile({
      filePath: picUrl,
      encoding: 'base64',
      success: res => {
        //console.log('data:image/png;base64,' + res.data);
        that.faceDetect(res.data, that.data.direction);
      }
    })
  },
  //传入照片，检测人脸
  faceDetect(content, side) {
    let that = this;
    let requestData = {
      faceImage: content,
      direction: side
    }
    utils.addFace(requestData).then(res => {
      console.log(res);
      if (res.data.code == 200) {
        errorCounts = 0;
        if (side == 1) {
          
          setTimeout(function () {
            that.setData({
              stepToast: '正在识别仰面...',
              detailToast: '请稍仰面部'
            })
            that.downDetect();
          }, 2500)
        } else if (side == 2) {
          
          setTimeout(function () {
            that.setData({
              stepToast: '正在识别右侧面部...',
              detailToast: '请将面部稍向左转'
            })
            that.leftDetect();
          }, 2500)
        } else if (side == 3) {
          
          setTimeout(function () {
            that.setData({
              stepToast: '正在识别面部左侧...',
              detailToast: '请将面部稍向右转'
            })
            that.rightDetect();
          }, 2500)
        } else if (side == 4) {
          that.setData({
            stepToast: '识别成功，人脸录入完成',
            detailToast: '后续可在食堂的人脸识别收银设备上，实现刷脸识别身份并进行支付'
          })
          //录入成功跳转，并将录入成功标识存到缓存
          setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
          }, 3000) //延迟时间
          wx.setStorageSync("isFaceDetect", true);
        }
        wx.showToast({
          title: "录入成功",
          icon: "success",
          duration: 3000
        })
      } else {
        utils.showToastWindow(res.data.msg, "none")
        errorCounts++;
        that.takePhoto();
      }
    }).catch(res => {
      console.log(res);
    })
  },

})