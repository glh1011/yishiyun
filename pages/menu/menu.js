// pages/menu/menu.js
const app = getApp();


Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    TabArray: ['全部', '早饭', '午饭', '晚饭'],
    currentNavtab: 0,
    CustomBar: app.globalData.CustomBar,
    loadingMore: true, //loading中
    loadingMoreHidden: false,
    isEnd: false, //到底啦
    allLists: [], //全部菜品
    allFoodShow: [], //展示的全部菜品
    breakfastLists: [], //早饭菜品
    lunchLists: [], //午饭菜品
    dinnerLists: [], //晚饭菜品
    pageSize: 1,
    page: 1000
  },
  attached: function() {
    // _self = this;
    console.log('menu onload...')
    let list = [];
    for (let i = 0; i < 26; i++) {
      list[i] = String.fromCharCode(65 + i)
    }
    this.setData({
      list: list,
      listCur: list[0],
      allLists: app.globalData.allDishesDatas,
      breakfastLists: app.globalData.breakfastDishesDatas,
      lunchLists: app.globalData.lunchDishesDatas,
      dinnerLists: app.globalData.dinnerDishesDatas,
      pageSize: 1,
      page: 1000,
      allFoodShow: []
    })
    this.getFoodShow();
  },
  methods: {
    tabSelect(e) {
      this.setData({
        currentNavtab: e.currentTarget.dataset.id,
      })
    },

    toDetailsTap: function(e) {
      console.log("detail:" + e.currentTarget.dataset.id);
      wx.navigateTo({
        url: "/pages/dishDetail/dishDetail?dishesId=" + e.currentTarget.dataset.id
      })
    },

    getFoodShow: function() {
      var that = this;
      if (that.data.isEnd) {
        console.log('isEnd,return...');
        return;
      }
      console.log('notEnd,continue...');
      that.setData({
        loadingMore: true
      })
      var pageSize = 5;
      var allFoodShow = that.data.allFoodShow;
      var allFoodLength = allFoodShow.length;
      console.log('allFoodLength:' + allFoodLength);
      if (allFoodLength + pageSize <= that.data.allLists.length) {
        for (var i = allFoodLength; i < allFoodLength + pageSize; i++) {
          allFoodShow.push(that.data.allLists[i]);
        }

        that.setData({
          allFoodShow: allFoodShow
        })

        if (allFoodShow.length < that.data.allLists.length) {
          that.setData({
            loadingMore: false
          })
        } else {
          that.setData({
            loadingMore: false,
            isEnd: true
          })
        }
        console.log(allFoodShow.length, '-=-=-=-=-=-=-=')
      } else if (allFoodLength < that.data.allLists.length) {
        for (var i = allFoodLength; i < that.data.allLists.length; i++) {
          allFoodShow.push(that.data.allLists[i])
        }
        //虚拟加载特效

        that.setData({
          allFoodShow: allFoodShow,
          loadingMore: false,
          isEnd: true
        })
        console.log(allFoodShow.length, '-=-=-=-=-=-=-=')
      }
    }
  }
})

// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     TabArray: ['全部', '早饭', '午饭', '晚饭'],
//     currentNavtab: 0,
//     CustomBar: app.globalData.CustomBar,
//     loadingMore: true, //loading中
//     loadingMoreHidden: true,
//     isEnd: false, //到底啦
//     foodsLists: [{
//         foodName: "鱼香肉丝",
//         pic: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566190509862&di=6efcba0f0d79d7787f70c259f5205339&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F290%2Fw641h449%2F20181028%2FnTxh-hnaivxp9441065.jpg",
//         price: '1.10',
//         carbohydrate: '3.32',
//         protein: '4.5',
//         fat: '3.1',
//         heat: '25',
//         commentNums: '1',
//         likeNum: '1'
//       },
//       {
//         foodName: "鱼香肉丝",
//         pic: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566190509862&di=6efcba0f0d79d7787f70c259f5205339&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F290%2Fw641h449%2F20181028%2FnTxh-hnaivxp9441065.jpg",
//         price: '1.10',
//         carbohydrate: '3.32',
//         protein: '4.5',
//         fat: '3.1',
//         heat: '25',
//         commentNums: '1',
//         likeNum: '1'
//       },
//       {
//         foodName: "鱼香肉丝",
//         pic: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566190509862&di=6efcba0f0d79d7787f70c259f5205339&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F290%2Fw641h449%2F20181028%2FnTxh-hnaivxp9441065.jpg",
//         price: '1.10',
//         carbohydrate: '3.32',
//         protein: '4.5',
//         fat: '3.1',
//         heat: '25',
//         commentNums: '1',
//         likeNum: '1'
//       },
//       {
//         foodName: "鱼香肉丝",
//         pic: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566190509862&di=6efcba0f0d79d7787f70c259f5205339&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F290%2Fw641h449%2F20181028%2FnTxh-hnaivxp9441065.jpg",
//         price: '1.10',
//         carbohydrate: '3.32',
//         protein: '4.5',
//         fat: '3.1',
//         heat: '25',
//         commentNums: '1',
//         likeNum: '1'
//       },
//       {
//         foodName: "鱼香肉丝",
//         pic: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566190509862&di=6efcba0f0d79d7787f70c259f5205339&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F290%2Fw641h449%2F20181028%2FnTxh-hnaivxp9441065.jpg",
//         price: '1.10',
//         carbohydrate: '3.32',
//         protein: '4.5',
//         fat: '3.1',
//         heat: '25',
//         commentNums: '1',
//         likeNum: '1'
//       },
//       {
//         foodName: "鱼香肉丝",
//         pic: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566190509862&di=6efcba0f0d79d7787f70c259f5205339&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F290%2Fw641h449%2F20181028%2FnTxh-hnaivxp9441065.jpg",
//         price: '1.10',
//         carbohydrate: '3.32',
//         protein: '4.5',
//         fat: '3.1',
//         heat: '25',
//         commentNums: '1',
//         likeNum: '1'
//       },
//       {
//         foodName: "鱼香肉丝",
//         pic: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566190509862&di=6efcba0f0d79d7787f70c259f5205339&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F290%2Fw641h449%2F20181028%2FnTxh-hnaivxp9441065.jpg",
//         price: '1.10',
//         carbohydrate: '3.32',
//         protein: '4.5',
//         fat: '3.1',
//         heat: '25',
//         commentNums: '1',
//         likeNum: '1'
//       },
//       {
//         foodName: "鱼香肉丝",
//         pic: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566190509862&di=6efcba0f0d79d7787f70c259f5205339&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F290%2Fw641h449%2F20181028%2FnTxh-hnaivxp9441065.jpg",
//         price: '1.10',
//         carbohydrate: '3.32',
//         protein: '4.5',
//         fat: '3.1',
//         heat: '25',
//         commentNums: '1',
//         likeNum: '1'
//       },
//       {
//         foodName: "鱼香肉丝",
//         pic: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566190509862&di=6efcba0f0d79d7787f70c259f5205339&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F290%2Fw641h449%2F20181028%2FnTxh-hnaivxp9441065.jpg",
//         price: '1.10',
//         carbohydrate: '3.32',
//         protein: '4.5',
//         fat: '3.1',
//         heat: '25',
//         commentNums: '1',
//         likeNum: '1'
//       },
//       {
//         foodName: "鱼香肉丝",
//         pic: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566190509862&di=6efcba0f0d79d7787f70c259f5205339&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F290%2Fw641h449%2F20181028%2FnTxh-hnaivxp9441065.jpg",
//         price: '1.10',
//         carbohydrate: '3.32',
//         protein: '4.5',
//         fat: '3.1',
//         heat: '25',
//         commentNums: '1',
//         likeNum: '1'
//       },
//       {
//         foodName: "鱼香肉丝",
//         pic: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566190509862&di=6efcba0f0d79d7787f70c259f5205339&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F290%2Fw641h449%2F20181028%2FnTxh-hnaivxp9441065.jpg",
//         price: '1.10',
//         carbohydrate: '3.32',
//         protein: '4.5',
//         fat: '3.1',
//         heat: '25',
//         commentNums: '1',
//         likeNum: '1'
//       },
//       {
//         foodName: "鱼香肉丝",
//         pic: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566190509862&di=6efcba0f0d79d7787f70c259f5205339&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F290%2Fw641h449%2F20181028%2FnTxh-hnaivxp9441065.jpg",
//         price: '1.10',
//         carbohydrate: '3.32',
//         protein: '4.5',
//         fat: '3.1',
//         heat: '25',
//         commentNums: '1',
//         likeNum: '1'
//       },
//       {
//         foodName: "鱼香肉丝",
//         pic: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566190509862&di=6efcba0f0d79d7787f70c259f5205339&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F290%2Fw641h449%2F20181028%2FnTxh-hnaivxp9441065.jpg",
//         price: '1.10',
//         carbohydrate: '3.32',
//         protein: '4.5',
//         fat: '3.1',
//         heat: '25',
//         commentNums: '1',
//         likeNum: '1'
//       }
//     ],
//     allLists: [], //全部菜品
//     breakfastLists: [], //早饭菜品
//     lunchLists: [], //午饭菜品
//     dinnerLists: [] //晚饭菜品
//   },

//   tabSelect(e) {
//     this.setData({
//       currentNavtab: e.currentTarget.dataset.id,
//     })
//   },

//   toDetailsTap: function(e) {
//     console.log("detail");
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function(options) {
//     console.log('menu onload...')
//     let list = [];
//     for (let i = 0; i < 26; i++) {
//       list[i] = String.fromCharCode(65 + i)
//     }
//     this.setData({
//       list: list,
//       listCur: list[0]
//     })

//     this.setData({
//       allLists: app.globalData.allDishesDatas,
//       breakfastLists: app.globalData.breakfastDishesDatas,
//       lunchLists: app.globalData.lunchDishesDatas,
//       dinnerLists: app.globalData.dinnerLists.dinnerDishesDatas
//     })

//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function() {
//     console.log('menu onload...')
//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function() {

//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function() {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function() {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function() {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function() {

//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function() {

//   }
// })