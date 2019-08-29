// pages/nutritionSummary/nutritionSummary.js
import uCharts from '../ucharts/u-charts.min.js';
var util = require("../../utils/time-utils.js")
var utils = require("../../utils/util.js")
var canvaColumn = null;
var _self;

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    selectWeek: 0,
    timeBean: {},
    cWidth: '',
    cHeight: '',
    curWeekArray: [],//这一周的日期
    standardWeekArray:[],//一周的标准热量
    curWeekNutritionArray:[0,0,0,0,0,0,0],//一周的实际热量
    compare:[],//实际比标准
    compareColor:['green','cyan','red'],//评价中过低、标准、过高对应的颜色
    compareItemTitle: ['标准', '过高', '过低'],//评价中过低、标准、过高对应的标题
    isHaveCal:false,//判断一周内是否有摄入记录
    curWeekDateArray:[],//一周七天的年月日时间
    curWeekDataList:[]//一周七天的日期、摄入量、标准的字典
  },
  attached: function (options) {
    _self = this;
    this.cWidth = wx.getSystemInfoSync().windowWidth;
    this.cHeight = 500 / 750 * wx.getSystemInfoSync().windowWidth;
    this.setData({
      timeBean: util.getWeekDayList(this.data.selectWeek)
    })
    console.log(this.data.timeBean);
    this.selectWeekDay();
    this.getNutritionSummaryData();
  },
  methods: {
    getNutritionSummaryData: function () {
      console.log(this.data.timeBean);
      console.log(this.data.curWeekArray);
      var date = this.data.timeBean.yearMonth+"-"+this.data.curWeekArray[0];
      
      console.log(date);
      var data = {
        date: date
      }
      utils.queryNuritionSummary(data).then(res => {
        console.log(res);
        var dates = res.data.data.dates;
        var curWeekDateArray = [];
        for(var i = 0; i < dates.length; i++){
          curWeekDateArray.push(dates[i].split(" ")[0]);
        }
        //获取标准热量数组
        this.setData({
          standardWeekArray: res.data.data.availableEnergy,
          curWeekDateArray: curWeekDateArray,
          curWeekDataList:[],
          isHaveCal:false
        })
        if(res.data.code == 200){
          var curWeekDataList = [];
          for (var i = 0; i < 7; i++) {
            var curWeekDataListItem = {};
            curWeekDataListItem.date = this.data.curWeekDateArray[i];
            curWeekDataListItem.input = res.data.data.data[i];
            curWeekDataListItem.comment = res.data.data.compare[i];
            curWeekDataList.push(curWeekDataListItem)
          }
          console.log(curWeekDataList);
          this.setData({
            curWeekNutritionArray:res.data.data.data,
            isHaveCal:true,
            compare:res.data.data.compare,
            curWeekDataList: curWeekDataList
          })
          
          let Column = {
            categories: [],
            series: [{
              "name": "实际热量",
              "data": [],
              "color": "#1cbbb4"
            }, {
              "name": "标准热量",
              "data": [],
              "color": "#eee"
            }]
          };
          Column.categories = this.data.curWeekArray;
          Column.series[0].data = this.data.curWeekNutritionArray;
          Column.series[1].data = this.data.standardWeekArray;
          _self.showColumn("canvasColumn", Column);
        }else{
          this.setDefaultDiagram();
        }
      }, err => {

      })
    },
    toTodayNutrition(e){
      console.log("detail:" + e.currentTarget.dataset.id);
      wx.navigateTo({
        url: "/pages/home/todayNutrition/todayNutrition?date=" + e.currentTarget.dataset.id
      })
    },
    /**
     * 点击了上一周，选择周数字减一，然后直接调用工具类中一个方法获取到数据
     */
    touchColumn(e) {
      canvaColumn.showToolTip(e, {
        format: function (item, category) {
          if (typeof item.data === 'object') {
            return category + ' ' + item.name + ':' + item.data.value
          } else {
            return category + ' ' + item.name + ':' + item.data
          }
        }
      });
    },

    lastWeek: function (e) {
      var selectWeek = --this.data.selectWeek;
      var timeBean = this.data.timeBean
      timeBean = util.getWeekDayList(selectWeek)

      if (selectWeek != 0) {
        timeBean.selectDay = 0;
      }

      this.setData({
        timeBean,
        selectWeek
      })
      this.selectWeekDay();
      this.getNutritionSummaryData();
    },

    /**
     * 点击了下一周，选择周数字加一，然后直接调用工具类中一个方法获取到数据
     */
    nextWeek: function (e) {
      var selectWeek = ++this.data.selectWeek;
      var timeBean = this.data.timeBean
      timeBean = util.getWeekDayList(selectWeek)

      if (selectWeek != 0) {
        timeBean.selectDay = 0;
      }

      this.setData({
        timeBean,
        selectWeek
      })
      this.selectWeekDay();
      this.getNutritionSummaryData();
    },

    /**
     * 选中了某一日，改变selectDay为选中日
     */
    dayClick: function (e) {
      var timeBean = this.data.timeBean
      timeBean.selectDay = e.detail;
      this.setData({
        timeBean,
      })
    },
    //获取当前周的日期数组
    selectWeekDay: function () {
      
      var weekDayList = this.data.timeBean.weekDayList;
      var curWeekArray = [];
      var curWeekDateArray = [];
      for (var i = 0; i < 7; i++) {
        var date = this.data.timeBean.yearMonth + "-" + weekDayList[i].day;
        curWeekArray.push(weekDayList[i].day.toString());
        curWeekDateArray.push(date);
      }
      this.setData({
        curWeekArray: curWeekArray,
        curWeekDateArray: curWeekDateArray
      })
      console.log(this.data.curWeekDateArray);
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
        xAxis: {
          disableGrid: true,
        },
        yAxis: {
          gridColor: '#eee',
          format:(val)=>{return val.toFixed(0)}
          //format: (val) => { return val.toFixed(0) + '元' },
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
    //设置默认的柱状图
    setDefaultDiagram() {
      let Column = {
        categories: [],
        series: [{
          "name": "实际热量",
          "data": [],
          "color": "#1cbbb4"
        }, {
          "name": "标准热量",
          "data": [],
          "color": "#eee"
        }]
      };
      Column.categories = this.data.curWeekArray;
      Column.series[0].data = [0,0,0,0,0,0,0];
      // Column.series[1].data = this.data.standardWeekArray;
      Column.series[1].data = [4,4,4,4,4,4,4];
      _self.showColumn("canvasColumn", Column);
      wx.showToast({
        title: "本周没有营养记录",
        icon: 'none',
        duration: 2000
      })
    }
 }
})