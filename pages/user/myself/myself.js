import utils from "../../../utils/util.js";
import auth from "../../../utils/auth.js";

Component({
  options: {
    addGlobalClass: true,
  },

  data: {
    monetarySum: 0,
    calorieSum: 0,
    icNumber: null
  },

  attached: function (options) {
    auth.checkHasLogined().then(isLogined => {
      console.log(isLogined);
      if (isLogined) {
        this.setData({
          hasLogin: true
        })
        this.getData();
      } else {
        this.setData({
          hasLogin: false
        })
      }
    })
  },

  methods: {
    getData: function () {
      utils.queryUser().then(res => {
        if (res.data.code === 200) {
          let responseData = res.data.data;
          this.setData({
            calorieSum: responseData.calorieSum,
            icNumber: responseData.icNumber,
            monetarySum: responseData.monetarySum,
            userName: responseData.userName
          })
        } else {
          console.log("获取信息出错", res);
          utils.showToastWindow('获取信息出错');
        }
      }).catch(res => {
        console.log("获取信息失败", res);
        utils.showToastWindow('获取信息失败');
      })
    },
    
    logout: function() {
      utils.logout().then(res=>{
        if (res.data.code === 200){
          wx.showToast({
            title: "已退出，跳转中",
            icon: 'success',
            duration: 2000,
            mask: true,
            success: function () {
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/login/login',
                })
              }, 1000) //延迟时间
            },
          });
          // wx.redirectTo({
          //   url: '/pages/login/login',
          // })
        } else {
          utils.showToastWindow("退出登录失败", "none");
        }
      }).catch(res=>{
        console.log("退出登录出错");
        utils.showToastWindow("退出登录失败", "none");
      })
    },
    showPrompt: function() {
      utils.showToastWindow("待升级", "none");
    }
  }
})