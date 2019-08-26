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
    textareaAValue: ''
  },
  onLoad: function (options) {
    console.log(options);
    this.getDishDetail(options.dishesId);
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


  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null,
      textareaAValue: ''
    })
  },
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },
})