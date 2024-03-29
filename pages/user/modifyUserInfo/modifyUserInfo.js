import utils from "../../../utils/util.js";

const { $Toast } = require('../../../dist/base/index');

Page({
  data: {
    endDate: '',
    date: '',
    index: null,
    picker: ['坐式生活方式：极少运动', '轻微活动：日常活动', '中等强度健身：每周3-4次', '大强度健身：每周4次以上', '专业运动员：每周6次以上运动'],
    tongtongId: null,
    userName: '',
    userSex: '',
    userBirth: '',
    userHeight: '',
    userWeight: '',
    userSportIndex: ''
  },

  onLoad: function (options) {
    let today = new Date();
    let d = utils.formatTime(today);
    this.setData({
      endDate: d
    });
    this.getUserInfo();
  },

  getUserInfo() {
    utils.queryUserInfo().then(res => {
      if (res.data.code == 200) {
        let responseData = res.data.data;
        let sexTmp = null;
        if (responseData.sex == "0") {
          sexTmp = false;
        } else if (responseData.sex == "1") {
          sexTmp = true;
        }
        this.setData({
          tongtongId: responseData.id,
          userName: responseData.name,
          userSex: sexTmp,
          userBirth: responseData.brith,
          userHeight: responseData.hight,
          userWeight: responseData.weight,
          userSportIndex: responseData.sportType
        })
      }
    }).catch(res => {
      console.log(res);
    })
  },

  DateChange(e) {
    this.setData({
      userBirth: e.detail.value
    })
  },

  PickerChange(e) {
    console.log(e);
    this.setData({
      userSportIndex: e.detail.value
    })
  },

  formSubmit: function (e) {
    console.log(e.detail.value);
    let allValue = e.detail.value;
    if (allValue.sex == true) {
      allValue.sex = '1'
    } else if (allValue.sex == false) {
      allValue.sex = '0'
    }
    utils.perfectInfo(allValue).then(res => {
      if (res.data.code == 200) {
        console.log(res);
        // utils.showToastWindow(res.data.msg);
        $Toast({
          content: res.data.msg,
          type: 'success'
        });
      }
      this.getUserInfo();
    }).catch(res => {
      console.log("修改个人信息失败", res);
      $Toast({
        content: '修改个人信息失败',
        type: 'error'
      });
    })
  },

  showAlert: function () {
    // utils.showToastWindow("此项不可修改", "none")
    $Toast({
      content: "此项不可修改",
      type: 'warning'
    });
  }
}) 