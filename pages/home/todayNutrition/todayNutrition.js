import utils from "../../../utils/util.js";
import uCharts from '../../ucharts/u-charts.min.js';

var _self;
var ringCanvas = null;

Page({
  data: {
    today:'',
    date: '',
    calorieAdvise: {},
    calorieReal: {},
    mainNutritionAdvise: {},
    mainNutritionReal: {},
    otherNutritionAdvise: {},
    otherNutritionReal: {},
    cWidth: '',
    cHeight: '',
  },

  onLoad: function (options) {
    var today = new Date();
    var d = utils.formatTime(today);
    this.setData({
      today: d,
      date: d
    });
    wx.showLoading({ title: '加载中', icon: 'loading' });
    _self = this;
    this.cWidth = wx.getSystemInfoSync().windowWidth;
    this.cHeight = 500 / 750 * wx.getSystemInfoSync().windowWidth;
    this.getNutritionAnalysis();
  },

  getNutritionAnalysis: function () {
    let requestData = {
      telephoneNumber: "13384996939",
      date: this.data.date
    }
    utils.queryTrophicAnalysis(requestData).then(res => {
      if (res.data.code == 200) {
        let responseData = res.data.data;
        var energy1 = responseData.calorieAnalyze.calorieReal.sumEnergy;
        var energy2 = responseData.calorieAnalyze.calorieAdvise.sumEnergy;
        var protein = responseData.mainNutritionAdvise.calorieReal.protein;
        var fat = responseData.mainNutritionAdvise.calorieReal.fat;
        var carbon = responseData.mainNutritionAdvise.calorieReal.carbohydrate;
        var options = {
          series: [
            { name: "已摄入", data: energy1}, 
            { name: "未摄入", data: energy2}
          ]
        };
        var color = {colors: ['#28B8A1', '#aaa']};
        _self.showRing("calorieCanvas", options, color);
        var options1 = {
          series: [
            { data: carbon, name: '碳水' },
            { data: fat, name: '脂肪' },
            { data: protein, name: '蛋白质' }
          ]
        };
        var color1 = { colors: ['#9085FB', '#FFCD6D', '#FC9E9E'] };
        _self.showRing("nutritionCanvas", options1, color1);

        this.setData({
          calorieAdvise: responseData.calorieAnalyze.calorieAdvise,
          calorieReal: responseData.calorieAnalyze.calorieReal,
          mainNutritionAdvise: responseData.mainNutritionAdvise.calorieAdvise,
          mainNutritionReal: responseData.mainNutritionAdvise.calorieReal,
          otherNutritionAdvise: responseData.otherNutritionAdvise.calorieAdvise,
          otherNutritionReal: responseData.otherNutritionAdvise.calorieReal
        })
      } else if (res.data.code == 202){
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
      wx.hideLoading()
    }).catch(res => {
      console.log("获取营养分析失败",res);
    })
  },

  bindDateChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
    wx.showLoading({title: '加载中', icon: 'loading'});
    this.getNutritionAnalysis();
  },

  showRing(canvasId, chartData, color) {
    ringCanvas = new uCharts({
      $this: _self,
      canvasId: canvasId,
      type: 'ring',
      fontSize: 11,
      legend: true,
      colors: color.colors,
      extra: {
        pie: {
          offsetAngle: -45,
          ringWidth: 40,
          lableWidth: 15,
          borderColor: ['#28B8A1', '#aaa'],
        }
      },
      background: '#FFFFFF',
      pixelRatio: _self.pixelRatio,
      series: chartData.series,
      animation: true,
      width: _self.cWidth,
      height: _self.cHeight,
      disablePieStroke: true,
      dataLabel: true,
    });
    return ringCanvas;
  }
})