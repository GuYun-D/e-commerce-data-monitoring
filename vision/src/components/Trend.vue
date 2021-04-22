<template>
  <div class="com-container">
    <div class="com-chart" ref="trend_ref">呵呵忽然</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartsInstance: null,
      allData: null,
    }
  },

  mounted() {
    this.initCharts()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },

  methods: {
    initCharts() {
      this.chartsInstance = this.$echarts.init(this.$refs.trend_ref, 'chalk')
      const initOption = {
        xAxis: {
          type: 'category',
          // 紧挨边缘
          boundaryGap: false,
        },

        yAxis: {
          type: 'value',
        },

        tooltip: {
          trigger: 'axis',
        },

        legend: {
          left: 20,
          top: '15%',
          icon: 'circle',
        },

        grid: {
          top: '35%',
          right: '4%',
          bottom: '1%',
          left: '3%',
          containLabel: true,
        },
      }
      this.chartsInstance.setOption(initOption)
    },

    async getData() {
      const { data: ret } = await this.$http.get('trend')
      console.log(ret)
      this.allData = ret
      this.updataChart()
    },

    updataChart() {
      // 定义颜色值
      // 半透明的颜色值
      const colorArr1 = [
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(22, 242, 217, 0.5)',
        'rgba(254, 33, 30, 0.5)',
        'rgba(250, 105, 0, 0.5)'
      ]
      // 全透明的颜色值
      const colorArr2 = [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ]

      // 获取类目轴数据
      const timerArr = this.allData.common.month
      // y轴数据
      const valueArr = this.allData.map.data
      // 数据
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          stack: 'map',
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index]
              },{
                offset: 1,
                color: colorArr2[index]
              }
            ])
          }
        }
      })
      // 图例数据
      const lengedArr = valueArr.map((item) => {
        return item.name
      })
      console.log(lengedArr)

      const dataOption = {
        xAxis: {
          data: timerArr,
        },

        series: seriesArr,

        legend: {
          data: lengedArr,
        },
      }
      this.chartsInstance.setOption(dataOption)
    },

    screenAdapter() {
      const adapteeOption = {}
      this.chartsInstance.setOption(adapteeOption)
      this.chartsInstance.resize()
    },
  },

  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
  },
}
</script>

<style lang='less' scoped>
</style>
