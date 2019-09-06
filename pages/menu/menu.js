// pages/menu/menu.js
const app = getApp();
import utils from "../../utils/util.js";


Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    TabArray: ['全部', '早饭', '午饭', '晚饭'],
    currentNavtab: 0,
    CustomBar: app.globalData.CustomBar,
    loadingMore: false, //loading中
    breakloadingMore:false,//breakloadingMore中
    lunchloadingMore:false,
    dinnerloadingMore:false,
    loadingMoreHidden: false,
    isEnd: false, //全部到底啦
    breakFastIsEnd:false,//早餐到底啦
    lunchIsEnd:false,//午餐到底啦
    dinnerIsEnd:false,//晚餐到底啦
    allLists: [], //全部菜品
    allFoodShow: [], //展示的全部菜品
    breakFoodShow:[],//展示的早餐菜品
    lunchFoodShow:[],//展示的午餐菜品
    dinnerFoodShow:[],//展示的晚餐菜品
    breakfastLists: [], //早饭菜品
    lunchLists: [], //午饭菜品
    dinnerLists: [], //晚饭菜品
    pageSize: 1,
    page: 1000,
    pageHeight: 0//屏幕高度
  },
  attached: function() {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight)
        //calc(100rpx + env(safe-area-inset-bottom) / 2);
        that.setData({
          pageHeight: ((res.windowHeight - that.data.CustomBar) * (750 / res.windowWidth))
        })
      }
    })
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
      var currentNavtab = e.currentTarget.dataset.id;
      if (currentNavtab == 0){
        this.getFoodShow();
      } else if (currentNavtab == 1){
        this.getBreakfastShow();
      } else if (currentNavtab == 2) {
        this.getLunchShow();
      } else if (currentNavtab == 3) {
        this.getDinnerShow();
      }
    },
    /**
     * 模糊搜索功能
     */
    search:function(key){
      var that = this;
      var curNavtab = that.data.currentNavtab;
      var resultData;
      
      var tempdataArr = [];//临时数组
      if(curNavtab == 0){
        that.setData({
          isEnd: false
        })
        //全部菜单
        resultData = app.globalData.allDishesDatas;
        if (key == '') {//用户没有输入，全部显示
          that.setData({
            allLists: resultData,
          })
          that.getFoodShow();
          return;
        }
        tempdataArr = that.findSubArr(resultData,key);
        console.log("查询结果:"+tempdataArr.length);
        if(tempdataArr.length != 0){
          that.setData({
            allLists: tempdataArr
          })
        }else{
          that.setData({
            allLists: []
          })
        }
        that.getFoodShow();
      }else if(curNavtab == 1){
        //早餐菜单
        resultData = that.data.breakfastLists;
      }else if(curNavtab == 2){
        //午餐菜单
        resultData = that.data.lunchLists;
      }else if(curNavtab == 3){
        //晚餐菜单
        resultData = that.data.dinnerLists;
      }

    },
    /**
     * 通过关键字查询结果数组
     */
    findSubArr:function(resultData,key){
      var tempdataArr = [];//临时数组
      for (let i in resultData) {
        if (resultData[i].dishName.indexOf(key) >= 0) {//查找关键字
          tempdataArr.push(resultData[i]);
        }
      }
      return tempdataArr;
    },
    /**
     * 获取搜索输入框的值
     */
    wxSearchInput:function(e){
      console.log(e.detail.value)
      this.search(e.detail.value);
    },

    toDetailsTap: function(e) {
      console.log("detail:" + e.currentTarget.dataset.id);
      wx.navigateTo({
        url: "/pages/dishDetail/dishDetail?dishesId=" + e.currentTarget.dataset.id
      })
    },
    searchByFoodName:function(){
      utils.showToastWindow("待升级", "none");
    },
    getNextFoodShow:function(){
      var curNav = this.data.currentNavtab;
      if(curNav == 0){
        console.log("allfoodshow...")
        this.getFoodShow();
      }else if(curNav == 1){
        console.log("breakfoodshow...")
        this.getBreakfastShow();
      }else if(curNav == 2){
        console.log("lunchfoodshow...")
        this.getLunchShow();
      }else if(curNav == 3){
        console.log("dinnerfoodshow...")
        this.getDinnerShow();
      }
    },
    //晚餐的下拉加载函数
    getDinnerShow: function () {
      var that = this;
      if (that.data.dinnerIsEnd) {
        console.log('dinner is End,return...');
        return;
      }
      console.log('notEnd,continue...');
      that.setData({
        dinnerloadingMore: true
      })
      var pageSize = 5;
      var dinnerFoodShow = that.data.dinnerFoodShow;
      var dinnerFoodShowLength = dinnerFoodShow.length;
      console.log('dinnerFoodShowLength:' + dinnerFoodShowLength);
      if (dinnerFoodShowLength + pageSize <= that.data.dinnerLists.length) {
        for (var i = dinnerFoodShowLength; i < dinnerFoodShowLength + pageSize; i++) {
          dinnerFoodShow.push(that.data.dinnerLists[i]);
        }

        that.setData({
          dinnerFoodShow: dinnerFoodShow
        })

        if (dinnerFoodShow.length < that.data.dinnerLists.length) {
          that.setData({
            dinnerloadingMore: false
          })
        } else {
          that.setData({
            dinnerloadingMore: false,
            dinnerIsEnd: true
          })
        }
        console.log('dinnerFoodShow.length:' + dinnerFoodShow.length, '-=-=-=-=-=-=-=')
      } else if (dinnerFoodShowLength < that.data.dinnerLists.length) {
        for (var i = dinnerFoodShowLength; i < that.data.dinnerLists.length; i++) {
          dinnerFoodShow.push(that.data.dinnerLists[i])
        }
        //虚拟加载特效

        that.setData({
          dinnerFoodShow: dinnerFoodShow,
          dinnerloadingMore: false,
          dinnerIsEnd: true
        })
        console.log('dinnerFoodShow.length:' + dinnerFoodShow.length, '-=-=-=-=-=-=-=')
      }
    },
    //午餐的下拉加载函数
    getLunchShow: function () {
      var that = this;
      if (that.data.lunchIsEnd) {
        console.log('lunch is End,return...');
        return;
      }
      console.log('notEnd,continue...');
      that.setData({
        lunchloadingMore: true
      })
      var pageSize = 5;
      var lunchFoodShow = that.data.lunchFoodShow;
      var lunchFoodShowLength = lunchFoodShow.length;
      console.log('lunchFoodShowLength:' + lunchFoodShowLength);
      if (lunchFoodShowLength + pageSize <= that.data.lunchLists.length) {
        for (var i = lunchFoodShowLength; i < lunchFoodShowLength + pageSize; i++) {
          lunchFoodShow.push(that.data.lunchLists[i]);
        }

        that.setData({
          lunchFoodShow: lunchFoodShow
        })

        if (lunchFoodShow.length < that.data.lunchLists.length) {
          that.setData({
            lunchloadingMore: false
          })
        } else {
          that.setData({
            lunchloadingMore: false,
            lunchIsEnd: true
          })
        }
        console.log('lunchFoodShow.length:' + lunchFoodShow.length, '-=-=-=-=-=-=-=')
      } else if (lunchFoodShowLength < that.data.lunchLists.length) {
        for (var i = lunchFoodShowLength; i < that.data.lunchLists.length; i++) {
          lunchFoodShow.push(that.data.lunchLists[i])
        }
        //虚拟加载特效

        that.setData({
          lunchFoodShow: lunchFoodShow,
          lunchloadingMore: false,
          lunchIsEnd: true
        })
        console.log('lunchFoodShow.length:' + lunchFoodShow.length, '-=-=-=-=-=-=-=')
      } 
    },
    //早餐的下拉加载函数
    getBreakfastShow:function(){
      var that = this;
      if(that.data.breakFastIsEnd){
        console.log('breakfast is End,return...');
        return;
      }
      console.log('notEnd,continue...');
      that.setData({
        breakloadingMore: true
      })
      var pageSize = 5;
      var breakFoodShow = that.data.breakFoodShow;
      var breakFoodShowLength = breakFoodShow.length;
      console.log('breakFoodShowLength:' + breakFoodShowLength);
      if (breakFoodShowLength + pageSize <= that.data.breakfastLists.length) {
        for (var i = breakFoodShowLength; i < breakFoodShowLength + pageSize; i++) {
          breakFoodShow.push(that.data.breakfastLists[i]);
        }

        that.setData({
          breakFoodShow: breakFoodShow
        })

        if (breakFoodShow.length < that.data.breakfastLists.length) {
          that.setData({
            breakloadingMore: false
          })
        } else {
          that.setData({
            breakloadingMore: false,
            breakFastIsEnd: true
          })
        }
        console.log('breakFoodShow.length:'+breakFoodShow.length, '-=-=-=-=-=-=-=')
      } else if (breakFoodShowLength < that.data.breakfastLists.length) {
        for (var i = breakFoodShowLength; i < that.data.breakfastLists.length; i++) {
          breakFoodShow.push(that.data.breakfastLists[i])
        }
        //虚拟加载特效

        that.setData({
          breakFoodShow: breakFoodShow,
          breakloadingMore: false,
          breakFastIsEnd: true
        })
        console.log('breakFoodShow.length:' + breakFoodShow.length, '-=-=-=-=-=-=-=')
      }
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
      //显示的数据+pageSize，小于数据的总长度
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
        //显示的数据+pagesize可能已经超过总数据了，但是显示数据还小于总数据
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
      }else{
        //显示的数据可能大于总数据，因为查询返回的总数据可能为空或者返回的查询总数据小于之前显示的数据
        that.setData({
          allFoodShow: that.data.allLists,
          loadingMore: false,
          isEnd: true
        })
      }
    }
  }
})