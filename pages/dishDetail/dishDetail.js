import utils from "../../utils/util.js";

Page({
  data: {
    calorie: 0,
    carbohydrate: 0,
    cholesterol: 0,
    commentNum: 0,
    dietaryFiber: 0,
    dishImage: "",
    dishNam: "菜品名称",
    dishPrice: 0,
    dishType: 0,
    fat: 0,
    likeNum: 0,
    protein: 0,
    salt: 0,
    vitamin: 0,
    weight: 0,
    comments: [],
    commentContent: '',
    showModal: false,
  },

  onLoad: function (options) {
    console.log(options);
    this.setData({
      dishesId: options.dishesId
    })
    this.getDishDetail(this.data.dishesId);
    this.getComment(this.data.dishesId);
  },

  onShow: function () {
    this.getDishDetail(this.data.dishesId);
    this.getComment(this.data.dishesId);
  },

  getDishDetail: function (dishesId) {
    let requestData = {
      dishesId: dishesId
    }
    utils.queryDishDetail(requestData).then(res=>{
      console.log(res.data);
      if(res.data.code == 200) {
        let responseData = res.data.data;
        this.setData({
          calorie: responseData.calorie,
          carbohydrate: responseData.carbohydrate,
          cholesterol: responseData.cholesterol,
          commentNum: responseData.commentNum,
          dietaryFiber: responseData.dietaryFiber,
          dishImage: responseData.dishImage,
          dishNam: responseData.dishNam,
          dishPrice: responseData.dishPrice,
          dishType: responseData.dishType,
          fat: responseData.fat,
          likeNum: responseData.likeNum,
          protein: responseData.protein,
          salt: responseData.salt,
          vitamin: responseData.vitamin,
          weight: responseData.weight
        })
      }else{
        wx.showToast({
          icon: 'none',
          title: res.data.msg,
        })
      }
    }).catch(res=>{
      console.log(res);
    })
  },

  getComment: function (dishesId) {
    let requestData = {
      dishId: dishesId
    }
    utils.queryDishComment(requestData).then(res => {
      console.log(res.data);
      if (res.data.code == 200) {
        let responseData = res.data.data;
        console.log("comment",responseData);
        this.setData({
          comments: responseData
        })
      } else {
      }
    }).catch(res => {
      console.log(res);
    })
  },

  handlelikeDish: function() {
    let requestData = {
      dishesId: this.data.dishesId
    }
    utils.likeDish(requestData).then(res => {
      console.log(res.data);
      if (res.data.code == 200) {
        this.onShow();
      } else {
        utils.showToastWindow("点赞菜品失败")
      }
    }).catch(res => {
      utils.showToastWindow("点赞菜品失败")
      console.log(res);
    })
  },

  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
 
  hideModal: function () {
    this.setData({
      showModal: false,
      commentContent: ''
    });
  },
 
  onCancel: function () {
    this.hideModal();
  },
  
  onConfirm: function () {
    wx.showLoading({title: '提交中'})
    let requestData = {
      dishesId: this.data.dishesId,
      commentContent: this.data.commentContent
    }
    utils.submitComment(requestData).then(res => {
      console.log(res);
      if (res.data.code == 200) {
        utils.showToastWindow(res.data.msg);
        this.onShow();
      } else if(res.data.code == 202){
        utils.showToastWindow(res.data.msg, "none");
      }else {
        utils.showToastWindow("评论失败");
      }
    }).catch(res => {
      console.log(res);
      utils.showToastWindow('评论失败');
    })
    wx.hideLoading();
    this.hideModal();
  },
  textareaInput(e) {
    this.setData({
      commentContent: e.detail.value
    })
  },
})