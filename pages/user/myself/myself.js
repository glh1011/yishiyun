import utils from "../../../utils/util.js";
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
    this.getData();
  },
  methods: {
    getData: function () {
      utils.queryUser().then(res => {
        if (res.data.code === 200) {
          let responseData = res.data.data;
          this.setData({
            calorieSum: responseData.calorieSum,
            icNumber: responseData.icNumber,
            monetarySum: responseData.monetarySum
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
          wx.redirectTo({
            url: '/pages/login/login',
          })
        }
      }).catch(res=>{
        console.log("退出登录出错");
      })
    }
  }
})