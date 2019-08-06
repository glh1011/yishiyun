import * as echarts from '../../../ec-canvas/echarts';
import {banner} from '../../../images/base64/banner.js';

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    backgroundColor: "#ffffff",
    color: ['#28B8A1', '#eee'],
    graphic: [{//环形图中间添加文字
      type: 'text',//通过不同top值可以设置上下显示
      left: 'center',
      top: '40%',
      style: {
        text: "80%",
        textAlign: 'center',
        fill: '#000',//文字的颜色
        width: 30,
        height: 30,
        fontSize: 23,
        color: "#1a1a1a",
    }}, {
      type: 'text',
      left: 'center',
      top: '60%',
      style: {
        text: '查看详情',
        textAlign: 'center',
        fill: '#999',
        width: 30,
        height: 30,
        fontSize: 11,
      }
    }],
    series: [{
      type: 'pie',
      radius: ['63%', '75%'],
      itemStyle: {
        normal: {
          label: {
            show: false
          },
          labelLine: {
            show: false
          }
        }
      },
      data: [
        { value: 78, name: '已摄入' },
        { value: 13, name: '未摄入' }
      ],
    }]
  };

  chart.setOption(option);
  return chart;
}

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    banner: banner,
    cardCur: 0,
    ec: {
    }
  },
  methods:{
    echartInit(e) {
      initChart(e.detail.canvas, e.detail.width, e.detail.height);
    },
    cardSwiper(e) {
      this.setData({
        cardCur: e.detail.current
      })
    },
    // toTodayNutrition: function (e) {
    //   console.log("dianjishijian");
    //   wx.navigateTo({
    //     url: '../../pages/home/todayNutrition/todayNutrition',
    //   })
    // },
  }
})