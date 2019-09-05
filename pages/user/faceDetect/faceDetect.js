import utils from "../../../utils/util.js";

var app = getApp();
let imgArr = [];
let tmpImg = '';

Page({
  data: {
    upSrc: '',
    downSrc: '',
    leftSrc: '',
    rightSrc: '',
    capturedNum: 0,
    numList: [{
      name: '俯'
    }, {
      name: '仰'
    }, {
      name: '左'
    }, {
      name: '右'
    },],
    num: 0,
    direction: 1,
    downStatus: false,
    leftStatus: false,
    rightStatus: false,
    finishStatus: false
  },

  onLoad() {
    this.showTip();
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

  ViewImage(e) {
    console.log(e);
    wx.previewImage({
      urls: imgArr,
      current: e.currentTarget.dataset.url
    });
  },
  //拍照
  takePhoto: function () {
    var that = this;
    that.ctx.takePhoto({
      quality: 'low',
      success: (res) => {
        tmpImg = res.tempImagePath;
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
        imgArr.push(tmpImg)
        if (side == 1) {
          this.setData({
            upSrc: tmpImg,
            downStatus: true,
            capturedNum: 1
          })
        } else if (side == 2) {
          this.setData({
            downSrc: tmpImg,
            leftStatus: true,
            capturedNum: 2
          })
        } else if (side == 3) {
          this.setData({
            leftSrc: tmpImg,
            rightStatus: true,
            capturedNum: 3
          })
        } else if (side == 4) {
          this.setData({
            rightSrc: tmpImg,
            finishStatus: true,
            capturedNum: 4
          })
        }
        utils.showToastWindow(res.data.msg, "none")
      } else {
        utils.showToastWindow(res.data.msg, "none")
        that.takePhoto();
      }
    }).catch(res => {
      console.log(res);
    })
  },

})