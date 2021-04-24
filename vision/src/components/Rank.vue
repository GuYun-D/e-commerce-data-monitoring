<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>
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
  methods: {
    initCharts() {
      this.chartsInstance = this.$echarts.init(this.$refs.rank_ref)
      const initOption = {
        xAxis: {
          type: 'category',
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            type: 'bar',
          },
        ],
      }
      this.chartsInstance.setOption(initOption)
    },
    async getData() {
      const { data: ret } = await this.$http.get('rank')
      this.allData = ret
      // 对元素进行排序，从大到小
      this.allData.sort((a, b) => {
        return b.value - a.value
      })
      this.updataChart()
    },
    updataChart() {
      // 所有省份数据
      const provinceArr = this.allData.map((item) => {
        return item.name
      })
      console.log(provinceArr)
      // 所有省份对应的数据
      const valueArr = this.allData.map((item) => {
        return item.value
      })
      console.log(valueArr)

      const dataOption = {
        xAxis: {
          data: provinceArr,
        },
        series: [
          {
            data: valueArr,
          },
        ],
      }
      this.chartsInstance.setOption(dataOption)
    },
    screenAdapter() {
      const adapteeOption = {}
      this.chartsInstance.setOption(adapteeOption)
      this.chartsInstance.resize()
    },
  },
  mounted() {
    this.initCharts()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
  },
}
</script>

<style lang='less' scoped>
</style>