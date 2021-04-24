<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref">
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      chartsInstance: null,
      allData: null
    }
  },
  methods: {
    initCharts(){
      this.chartsInstance = this.$echarts.init(this.$refs.hot_ref)
      const initOption = {
        series: [
          {
            type: 'pie'
          }
        ]
      }
      this.chartsInstance.setOption(initOption)
    },
    async getData(){
      const {data: ret} = await this.$http.get('/hotproduct')
      this.allData = ret
      console.log(ret);
      this.updataChart()
    },
    updataChart(){
      /**
       * 数据处理，含有三个级别的分类，先只做其中一级的分类
       */
      // 饼图数据
      const seriesData = this.allData[0].children.map(item => {
        return {
          name: item.name,
          value: item.value
        }
      })
      // 图例数据
      const legendData = this.allData[0].children.map(item => {
        return item.name
      })

      console.log(seriesData);
      const dataOption = {
        series: [
          {
            data: seriesData
          }
        ],

        legend: {
          data: legendData
        }
      }
      this.chartsInstance.setOption(dataOption)
    },
    screenAdapter(){
      const adapteeOption = {}
      this.chartsInstance.setOption(adapteeOption)
      this.chartsInstance.resize()
    }
  },
  mounted(){
    this.initCharts()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed(){
    window.removeEventListener('resize', this.screenAdapter)
  }
}
</script>

<style lang='less' scoped>
</style>