Page({

  data: {
    TabCur: 0,
    data: [
      { 
        message: '根据学校2019年暑假餐饮工作安排，结合师生留校情况及食堂实际状况，现将我校暑期食堂工作安排通知如下：暑假期间（7月6日至8月30日），由我校一食堂二楼、三食堂提供餐饮服务工作，其他食堂暂停营业。特此通知',
        image: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1801876585,962760975&fm=26&gp=0.jpg',
        time: '2019年8月23日 13:23'
      },
      {
        message: '根据学校2019年暑假餐饮工作安排，结合师生留校情况及食堂实际状况，现将我校暑期食堂工作安排通知如下：暑假期间（7月6日至8月30日），由我校一食堂二楼、三食堂提供餐饮服务工作，其他食堂暂停营业。特此通知',
        image: "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2837298411,46615710&fm=26&gp=0.jpg",
        time: '2019年8月21日 10:18'
      }
    ],
  },

  onLoad: function (options) {

  },
  tabSelect:function(){
    var curTab = this.data.TabCur;
    this.setData({
      TabCur:!curTab
    })
  }
})