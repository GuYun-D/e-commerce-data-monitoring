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
      this.chartsInstance = this.$echarts.init(this.$refs.trend_ref)
      const initOption = {
        xAxis: {
          type: 'category',
        },

        yAxis: {
          type: 'value',
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
      // 获取类目轴数据
      const timerArr = this.allData.common.moth
      // y轴数据
      const valueArr = this.allData.map.data
      // 数据
      const seriesArr = valueArr.map((item) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          stack: 'map'
        }
      })
      // 图例数据
      const lengedArr = valueArr.map((item) => {
        return item.name
      })
      console.log(lengedArr)

      const dataOption = {
        xAixs: {
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
