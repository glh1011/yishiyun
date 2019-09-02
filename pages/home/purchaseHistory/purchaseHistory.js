import utils from "../../../utils/util.js";
import auth from "../../../utils/auth.js";
import uCharts from '../../ucharts/u-charts.min.js';

const monthArr = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const monthArr1 = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
const dayArr = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15","16", "17", 
"18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
const defaultMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
const defaultDay = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
var _self;
var canvaColumn = null;
var canvaLine = null;
const app = getApp();

Page({
  data: {
    cWidth: '',
    cHeight: '',
    index: 0,
    curYear: '',
    curMonth: '',
    curMonthsArray: '',
    TabCur: 0,
    scrollLeft: 0,
    today: '',
    date: '',
    expenseDetail: [],
    sumMoneyByMonth: 0,
    averageDaily: 0,
    highestSpend: 0,
    hasPurchaseRecord: false
  },

  onLoad: function (options) {
    var today = new Date();
    let d = utils.formatTime(today);
    let curYear = today.getFullYear();
    let curMonth = today.getMonth() + 1;
    let curMonthsArray = monthArr1.slice(0, curMonth);
    this.setData({
      today: d,
      date: d,
      curYear: curYear,
      curMonth: curMonth,
      index: curMonth - 1,
      curMonthsArray: curMonthsArray
    })

    _self = this;
    this.cWidth = wx.getSystemInfoSync().windowWidth - 50;
    this.cHeight = 500 / 750 * wx.getSystemInfoSync().windowWidth;
    this.getDiagramData();
    auth.showLoginModal();
  },

  //月消费与日消费导航栏切换
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    if(this.data.TabCur ==0 ) {
      this.getDiagramData();
    }else if(this.data.TabCur == 1) {
      this.getExpenseDetail();
    }
  },

  //月消费月份切换
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      curMonth: parseInt(e.detail.value) + 1
    })
    this.getDiagramData();
  },

  //日消费日期切换
  bindDateChange: function (e) {
    wx.showLoading({ title: '加载中', icon: 'loading' });
    this.setData({
      date: e.detail.value
    })
    this.getExpenseDetail();
  },

  //月消费数据获取，并配置图表
  getDiagramData: function() {
    wx.showLoading({ title: '加载中', icon: 'loading' });
    let requestData = {
      year: this.data.curYear,
      month: this.data.curMonth
    }
    utils.queryEatLogByMonth(requestData).then(res => {
      let thisMonth = this.data.curMonth;
      if(res.data.code === 200) {
        let responseData = res.data.data;
        this.setData({
          sumMoneyByMonth: responseData.sumMoneyByMonth,
          averageDaily: responseData.averageDaily,
          highestSpend: responseData.highestSpend,
        })

        let Line = {
          categories: [],
          series: [{
            "name": "单日消费金额/元",
            "data": []
          }]
        };
        Line.categories = dayArr.slice(0, responseData.spendMoneyByDay.length);
        Line.series[0].data = responseData.spendMoneyByDay;

        let Column = {
          categories: [], 
          series: [{
            "name": "月消费金额/元",
            "data": []
          }] };
        Column.categories = monthArr.slice(0, thisMonth);
        Column.series[0].data = responseData.everyMonthSpend.slice(0, thisMonth);
        
        _self.showLine("canvasLine", Line);
        _self.showColumn("canvasColumn", Column);
        
      } else {
        this.setDefaultDiagram();
      }
    }).catch(res => {
      console.log("获取月消费记录失败", res);
      this.setDefaultDiagram();
    })
    wx.hideLoading();
  },

  //获取日消费详情
  getExpenseDetail: function() {
    let requestData = {
      date: this.data.date
    }
    utils.queryEatLog(requestData).then(res => {
      let expenseDetailArr = [];
      if (res.data.code == 200) {
        let responseData = res.data.data;
        expenseDetailArr = responseData.breakfast.concat(responseData.lunch);
        expenseDetailArr = expenseDetailArr.concat(responseData.dinner);
        this.setData({
          hasPurchaseRecord: true,
          expenseDetail: expenseDetailArr
        })
      }else if(res.data.code == 202) {
        this.setData({
          hasPurchaseRecord: false,
          expenseDetail: []
        })
        let msg = "当日" + res.data.msg;
        utils.showToastWindow(msg, 'none');
      } else {
        this.setData({
          hasPurchaseRecord: false,
          expenseDetail: []
        })
        utils.showToastWindow("获取日消费记录失败", 'none');
      }
      wx.hideLoading();
    }).catch(res => {
      this.setData({
        hasPurchaseRecord: false,
        expenseDetail: []
      })
      console.log("获取就餐记录失败",res);
      utils.showToastWindow("获取日消费记录失败");
    })
  },

  //折线图
  showLine(canvasId, chartData) {
    canvaLine = new uCharts({
      $this: _self,
      canvasId: canvasId,
      type: 'area',
      colors: ['#28B8A1'],
      fontSize: 11,
      legend: false,
      dataLabel: true,
      dataPointShape: false,
      background: '#FFFFFF',
      pixelRatio: 1,
      categories: chartData.categories,
      series: chartData.series,
      animation: true,
      enableScroll: true,//开启图表拖拽功能
      xAxis: {
        disableGrid: false,
        type: 'grid',
        gridType: 'dash',
        itemCount: 4,
        scrollShow: true,
        scrollAlign: 'left',
        gridColor: '#eee',
      },
      yAxis: {
        disableGrid: false,
        gridType: 'dash',
        gridColor: '#eee',
        min: 10,
        max: 180,
        format: (val) => { return val.toFixed(0) }
      },
      width: _self.cWidth,
      height: _self.cHeight,
      extra: {
        area: {
          type: 'curve'
        }
      },
    });
  },

  touchLine(e) {
    canvaLine.scrollStart(e);
  },

  moveLine(e) {
    canvaLine.scroll(e);
  },

  touchEndLine(e) {
    canvaLine.scrollEnd(e);
    //toolTip事件，如果滚动后不需要显示，可不填写
    canvaLine.showToolTip(e, {
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },

  //柱状图
  showColumn(canvasId, chartData) {
    canvaColumn = new uCharts({
      $this: _self,
      canvasId: canvasId,
      type: 'column',
      colors: ['#28B8A1'],
      legend: true,
      fontSize: 11,
      background: '#FFFFFF',
      pixelRatio: 1,
      animation: true,
      categories: chartData.categories,
      series: chartData.series,
      enableScroll: false,
      xAxis: {
        disableGrid: true,
      },
      yAxis: {
        gridColor: '#eee',
      },
      dataLabel: true,
      width: _self.cWidth,
      height: _self.cHeight,
      extra: {
        column: {
          type: 'group',
          width: _self.cWidth * 0.45 / chartData.categories.length
        }
      }
    });
  },
  
  // touchColumn(e) {
  //   canvaColumn.showToolTip(e, {
  //     format: function (item, category) {
  //       if (typeof item.data === 'object') {
  //         return category + ' ' + item.name + ':' + item.data.value
  //       } else {
  //         return category + ' ' + item.name + ':' + item.data
  //       }
  //     }
  //   });
  // },

  setDefaultDiagram() {
    let Line = {
      categories: [],
      series: [{
        "name": "单日消费金额/元",
        "data": []
      }]
    };
    Line.categories = dayArr;
    Line.series[0].data = defaultDay;
    let Column = {
      categories: [],
      series: [{
        "name": "月消费金额/元",
        "data": []
      }]
    };
    Column.categories = monthArr.slice(0, this.data.curMonth);
    Column.series[0].data = defaultMonth.slice(0, this.data.curMonth);
    _self.showLine("canvasLine", Line);
    _self.showColumn("canvasColumn", Column);
    utils.showToastWindow("获取月消费记录失败", "none");
  }

})