import * as echarts from '../../../ec-canvas/echarts';

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
      top: '28%',
      style: {
        text: "已摄入",
        textAlign: 'center',
        fill: '#333',//文字的颜色
        width: 30,
        height: 30,
        fontSize: 13,
        color: "#1a1a1a",
      }
    },{//环形图中间添加文字
      type: 'text',//通过不同top值可以设置上下显示
      left: 'center',
      top: '40%',
      style: {
        text: "897",
        textAlign: 'center',
        fill: '#000',//文字的颜色
        width: 30,
        height: 30,
        fontSize: 23,
        color: "#1a1a1a",
      }
    }, {
      type: 'text',
      left: 'center',
      top: '60%',
      style: {
        text: '建议摄入1390',
        textAlign: 'center',
        fill: '#999',
        width: 30,
        height: 30,
        fontSize: 11,
      }
    }],
    series: [{
      type: 'pie',
      radius: ['90%', '100%'],
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

Page({
  data: {
    ec: {
    }
  },

  onLoad: function (options) {

  },

  onReady: function () {

  },

  onShow: function () {

  },

  echartInit(e) {
    initChart(e.detail.canvas, e.detail.width, e.detail.height);
  },
})