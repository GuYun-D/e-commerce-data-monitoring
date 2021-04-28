<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      chartsInstance: null,
      allData: null,
      // 控制图表平行移动
      startValue: 0,
      endValue: 9,
      // 定时器
      timerId: ''
    }
  },
  methods: {
    initCharts() {
      this.chartsInstance = this.$echarts.init(this.$refs.rank_ref, this.theme)
      this.$socket.send({
        action: 'getData',
        socketType: 'rankData',
        chartName: 'rank',
        value: ''
      })
      const initOption = {
        title: {
          text: '| 地区销售排行',
          left: 20,
          top: 20
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar'
          }
        ],
        grid: {
          top: '40%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },

        tooltip: {
          show: true
        }
      }

      this.chartsInstance.setOption(initOption)
      this.chartsInstance.on('mouseover', function () {
        clearInterval(this.timerId)
      })
      this.chartsInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    getData(ret) {
      // const { data: ret } = await this.$http.get('rank')
      this.allData = ret
      // 对元素进行排序，从大到小
      this.allData.sort((a, b) => {
        return b.value - a.value
      })
      this.updataChart()
      this.startInterval()
    },
    updataChart() {
      // 颜色渐变的数组
      const colorArr = [
        ['#0ba82c', '#4ff778'],
        ['#2e72bf', '#23e5e5'],
        ['#5052ee', '#ab6ee5']
      ]
      // 所有省份数据
      const provinceArr = this.allData.map((item) => {
        return item.name
      })
      // console.log(provinceArr)
      // 所有省份对应的数据
      const valueArr = this.allData.map((item) => {
        return item.value
      })
      // console.log(valueArr)

      const dataOption = {
        // 区域缩放，实现动画平移
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue
        },
        xAxis: {
          data: provinceArr
        },
        series: [
          {
            data: valueArr,
            itemStyle: {
              color: (arg) => {
                // 渐变颜色变量
                let targetColorArr = null
                if (arg.value > 300) {
                  targetColorArr = colorArr[0]
                } else if (arg.value > 200) {
                  targetColorArr = colorArr[1]
                } else {
                  targetColorArr = colorArr[2]
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: targetColorArr[0]
                  },
                  {
                    offset: 1,
                    color: targetColorArr[1]
                  }
                ])
              }
            }
          }
        ]
      }
      this.chartsInstance.setOption(dataOption)
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.rank_ref.offsetWidth / 100) * 3.6
      const adapteeOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          }
        },

        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]
            }
          }
        ]
      }
      this.chartsInstance.setOption(adapteeOption)
      this.chartsInstance.resize()
    },

    // 控制图表移动函数
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.startValue++
        this.endValue++
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0
          this.endValue = 9
        }
        this.updataChart()
      }, 2000)
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
    clearInterval(timerId)
    this.$socket.unregisterCallBack('rankData')
  },

  created() {
    this.$socket.registerCallBack('rankData', this.getData)
  },

  computed: {
    ...mapState(['theme'])
  },

  watch: {
    theme() {
      // 销毁当前的图表
      this.chartsInstance.dispose()
      // 刷新主题
      this.initCharts()
      // 重新适配
      this.screenAdapter()
      // 更新图表
      this.updataChart()
    }
  }
}
</script>

<style lang='less' scoped>
</style>