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
      date: this.data.date
    }
    utils.queryTrophicAnalysis(requestData).then(res => {
      if (res.data.code == 200) {
        let responseData = res.data.data;
        let energy1 = responseData.calorieAnalyze.calorieReal.sumEnergy;
        let energy2 = responseData.calorieAnalyze.calorieAdvise.sumEnergy;
        let protein = responseData.mainNutritionAdvise.calorieReal.protein;
        let fat = responseData.mainNutritionAdvise.calorieReal.fat;
        let carbon = responseData.mainNutritionAdvise.calorieReal.carbohydrate;
        let options = {
          series: [
            { name: "已摄入", data: energy1}, 
            { name: "未摄入", data: energy2}
          ]
        };
        let color = {colors: ['#28B8A1', '#aaa']};
         _self.showRing("calorieCanvas", options, color);
        let options1 = {
          series: [
            { data: carbon, name: '碳水' },
            { data: fat, name: '脂肪' },
            { data: protein, name: '蛋白质' }
          ]
        };
        let color1 = { colors: ['#9085FB', '#FFCD6D', '#FC9E9E'] };
        _self.showRing("nutritionCanvas", options1, color1);

        this.setData({
          calorieAdvise: responseData.calorieAnalyze.calorieAdvise,
          calorieReal: responseData.calorieAnalyze.calorieReal,
          mainNutritionAdvise: responseData.mainNutritionAdvise.calorieAdvise,
          mainNutritionReal: responseData.mainNutritionAdvise.calorieReal,
          otherNutritionAdvise: responseData.otherNutritionAdvise.calorieAdvise,
          otherNutritionReal: responseData.otherNutritionAdvise.calorieReal
        })
      } else {
        this.setDefaultDiagram(res.data.msg);
      }
      //wx.hideLoading()
    }).catch(res => {
      console.log("获取营养分析失败",res);
      this.setDefaultDiagram("获取营养分析失败");
    })
    wx.hideLoading()
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
  },

  setDefaultDiagram(msg) {
    utils.showToastWindow(msg, 'none');
    this.setData({
      calorieAdvise: { breakfast: 0, lunch: 0, dinner: 0, sumEnergy: 0 },
      calorieReal: { breakfast: 0, lunch: 0, dinner: 0, sumEnergy: 0 },
      mainNutritionAdvise: { fat: 0, protein: 0, carbohydrate: 0 },
      mainNutritionReal: { fat: 0, protein: 0, carbohydrate: 0 },
      otherNutritionAdvise: { dietaryFiber: 0, salt: 0, cholesterol: 0, vitamin: 0 },
      otherNutritionReal: { dietaryFiber: 0, salt: 0, cholesterol: 0, vitamin: 0 },
    })
    // this.setData({
    //   modalName: 'Modal'
    // });
    let options = {
      series: [
        { name: "已摄入", data: 0 },
        { name: "未摄入", data: 1 }
      ]
    };
    let color = { colors: ['#28B8A1', '#aaa'] };
    _self.showRing("calorieCanvas", options, color);
    let options1 = {
      series: [
        { data: 0, name: '碳水' },
        { data: 0, name: '脂肪' },
        { data: 0, name: '蛋白质' }
      ]
    };
    let color1 = { colors: ['#9085FB', '#FFCD6D', '#FC9E9E'] };
    _self.showRing("nutritionCanvas", options1, color1);
  }

})