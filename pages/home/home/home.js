import utils from "../../../utils/util.js";
import {banner} from '../../../images/base64/banner.js';
import uCharts from '../../ucharts/u-charts.min.js';

var value1 = null, value2 = null, str = null;
var _self;
var ringCanvas = null;

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    banner: banner,
    cardCur: 0,
    intake: '0',
    ingestible: '0',
    rate: '0',
    mealMoney: '0',
    mealWeight: '0',
    lastEatLog: [],
    mostLike: []
  },
  attached: function() {
    _self = this;
    this.getIndexData();
  },
  methods:{
    getIndexData(){
      let data = {
        telephoneNumber: "13384996939"
      }
      this.getIntakeData(data);
      this.getLatestLog(data);
      this.getMostLike();
    },
    //获取摄入热量等数据
    getIntakeData(data){
      utils.queryIntake(data).then(res => {
        if (res.data.code == 200) {
          let resultData = res.data.data;
          this.setData({
            intake: resultData.availableEnergy,
            ingestible: resultData.availabledEnergy,
            mealMoney: resultData.money,
            mealWeight: resultData.weight,
            rate: resultData.availableEnergy / (resultData.availableEnergy + resultData.availabledEnergy)
          })
          str = Math.round((this.data.rate * 100)).toString() + "%";
          value1 = this.data.intake;
          value2 = this.data.ingestible;
          var options = {
            series: [
              { name: "已摄入", data: value1 },
              { name: "未摄入", data: value2 }
            ]
          };
          _self.showRing("intakeCanvas", options, str);
        }
      }).catch(res => {
        console.log("获取热量摄入数据失败", res);
      })
    },
    //获取最近一次就餐记录
    getLatestLog(data){
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
    getMostLike(){
      utils.queryMostLike().then(res => {
        if (res.data.code == 200) {
          if (res.data.data.length >= 4) {
            this.setData({
              mostLike: res.data.data.slice(0, 4)
            })
          } else {
            this.setData({
              lastEatLog: res.data.data
            })
          }
        }
      }).catch(res => {
        console.log("获取最受欢迎菜品失败");
      })
    },

    //环形图
    showRing(canvasId, chartData, rate) {
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
        width: 150,
        height: 150,
        disablePieStroke: true,
        dataLabel: false,
      });
    }
  }
})