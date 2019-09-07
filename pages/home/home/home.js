import utils from "../../../utils/util.js";
import {banner} from '../../../images/base64/banner.js';
import uCharts from '../../ucharts/u-charts.min.js';

var _self;
var ringCanvas = null;

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    banner: banner,
    cardCur: 0,
    intake: 0,
    ingestible: 0,
    rate: 0,
    mealMoney: 0,
    mealWeight: 0,
    lastEatLog: [],
    mostLike: [],
    cWidth: '',
    cHeight: ''
  },
  attached: function (options) {
    _self = this;
    //首页环形图占据的宽度比例约为0.4，并依此设置环形图实际宽度
    this.cWidth = wx.getSystemInfoSync().windowWidth * 0.4;
    this.cHeight = wx.getSystemInfoSync().windowWidth * 0.4;
    this.getIndexData();
  },
  methods:{
    getIndexData: function(){
      this.getIntakeData();
      this.getLatestLog();
      this.getMostLike();
    },
    //获取摄入热量等数据
    getIntakeData: function(){
      utils.queryIntake().then(res => {
        if (res.data.code == 200) {
          let resultData = res.data.data;
          if (resultData.availabledEnergy == 0) {
            this.setData({
              rate: 0
            })
          } else {
            this.setData({
              rate: resultData.availableEnergy / (resultData.availableEnergy + resultData.availabledEnergy)
            })
          }
          this.setData({
            intake: resultData.availabledEnergy,
            ingestible: resultData.availableEnergy, 
            mealMoney: resultData.money,
            mealWeight: resultData.weight,
          })
          let str = Math.round((this.data.rate * 100)).toString() + "%";
          let value1 = this.data.intake;
          let value2 = this.data.ingestible;
          let options = {
            series: [
              { name: "已摄入", data: value1 },
              { name: "未摄入", data: value2 }
            ]
          };
          _self.showRing("intakeCanvas", options, str);
        } else {
          this.setDefaultRing();
        }
      }).catch(res => {
        this.setDefaultRing();
        console.log("获取热量摄入数据失败", res);
      })
    },
    //获取最近一次就餐记录
    getLatestLog: function(data){
      utils.queryLastEatLog(data).then(res => {
        if (res.data.code == 200) {
          if (res.data.data.length >= 2) {
            this.setData({
              lastEatLog: res.data.data.slice(0, 2)
            })
          } else {
            this.setData({
              lastEatLog: res.data.data
            })
          }
        }
      }).catch(res => {
        console.log("获取最近一次就餐记录失败");
      })
    },
    //获取最受欢迎菜品数据
    getMostLike: function(){
      utils.queryMostLike().then(res => {
        if (res.data.code == 200) {
          if (res.data.data.length >= 4) {
            this.setData({
              mostLike: res.data.data
            })
          } else {
            this.setData({
              mostLike: res.data.data
            })
          }
        }
      }).catch(res => {
        console.log("获取最受欢迎菜品失败");
      })
    },

    //环形图
    showRing: function(canvasId, chartData, rate) {
      ringCanvas = new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: 'ring',
        fontSize: 11,
        legend: {
          show: false
        },
        colors: ['#28B8A1', '#aaa'],
        title: {
          name: rate,
          color: '#7cb5ec',
          fontSize: 28,
          offsetY: 0,
        },
        subtitle: {
          name: '健康指数',
          color: '#999',
          fontSize: 14,
          offsetY: 0,
        },
        extra: {
          pie: {
            offsetAngle: -45,
            ringWidth: 8,
            lableWidth: 15,
          }
        },
        background: '#FFFFFF',
        pixelRatio: 1,
        series: chartData.series,
        animation: true,
        width: _self.cWidth,
        height: _self.cHeight,
        disablePieStroke: true,
        dataLabel: false,
      });
    },
    //出错等情况下的默认设置
    setDefaultRing: function() {
      let str = "0%";
      let value1 = 0;
      let value2 = 1;
      let options = {
        series: [
          { name: "已摄入", data: value1 },
          { name: "未摄入", data: value2 }
        ]
      };
      _self.showRing("intakeCanvas", options, str);
    },
    updating:function(){
      utils.showToastWindow("该功能未开放")
    }
  }
 })