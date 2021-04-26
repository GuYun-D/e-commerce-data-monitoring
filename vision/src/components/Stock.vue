<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartsInstance: null,
      allData: null,
      // 当前数据显式的页数
      currentIndex: 0,
      // 定时器的id
      timerId: ''
    }
  },
  methods: {
    initCharts() {
      this.chartsInstance = this.$echarts.init(this.$refs.stock_ref, 'chalk')
      this.$socket.send({
        "action": 'getData',
        "socketType": 'stockData',
        "chartName": 'stock',
        "value": ''
      })
      const initOption = {
        title: {
          text: '|   库存和销量分析',
          top: 20,
          left: 20,
        },
      }
      this.chartsInstance.setOption(initOption)

      // 图表事件监听
      this.chartsInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })

      this.chartsInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    getData(ret) {
      // const { data: ret } = await this.$http.get('stock')
      this.allData = ret
      // console.log(ret);
      this.updataChart()
      this.startInterval()
    },
    updataChart() {
      // 饼图中心点坐标
      const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%'],
      ]

      // 圆环图渐变色
      const colorArr = [
        ['#4ff778', '#0ba82c'],
        ['#e5dd45', '#e8b11c'],
        ['#e8821c', '#e55445'],
        ['#5052ee', '#ab6ee5'],
        ['#23e5e5', '#2e72bf'],
      ]

      // 处理数据
      // 控制数据的显示
      const start = this.currentIndex * 5
      const end = (this.currentIndex + 1) * 5 
      const showData = this.allData.slice(start, end)
      const seriesArr = showData.map((item, index) => {
        return {
          type: 'pie',
          // 变成圆环图
          radius: [110, 100],
          center: centerArr[index],
          hoverAnimation: false,
          labelLine: {
            show: false,
          },
          label: {
            position: 'center',
            color: colorArr[index][0],
          },
          data: [
            {
              // 销量
              name: item.name + '\n' + item.sales,
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0,
                    color: colorArr[index][0],
                  },
                  {
                    offset: 1,
                    color: colorArr[index][1],
                  },
                ]),
              },
            },
            {
              // 库存
              value: item.stock,
              // 库存的颜色都是灰色
              itemStyle: {
                color: '#333843',
              },
            },
          ],
        }
      })

      const dataOption = {
        series: seriesArr,
      }
      this.chartsInstance.setOption(dataOption)
    },
    screenAdapter() {
      const titleFontSize = this.$refs.stock_ref.offsetWidth / 100 * 3.6
      const innerRadius = this.titleFontSize * 2
      const outRadius = innerRadius * 1.125

      const adapteeOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },

        series: [
          {
            type: 'pie',
            radius: [outRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },{
            type: 'pie',

            radius: [outRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          }, {
            type: 'pie',

            radius: [outRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          }, {
            type: 'pie',

            radius: [outRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          }, {
            type: 'pie',
            radius: [outRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          }
        ]
      }
      this.chartsInstance.setOption(adapteeOption)
      this.chartsInstance.resize()
    },

    startInterval(){
      if(this.timerId){
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.currentIndex ++
        if(this.currentIndex > 1 ){
          this.currentIndex = 0
        }
        this.updataChart()
      }, 5000)
    }
  },
  mounted() {
    this.initCharts()
    // this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timerId)
    this.$socket.unregisterCallBack('stockData')
  },

  created(){
    this.$socket.registerCallBack('stockData', this.getData)
  }
}
</script>

<style lang='less' scoped>
</style>