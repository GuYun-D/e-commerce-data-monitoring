<template>
  <div class="com-container">
    <div class="com-chart" ref="trend_ref">
      呵呵忽然
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
      this.chartsInstance = this.$echarts.init(this.refs.trend_ref)
      const initOption = {}
      this.chartsInstance.setOption(initOption)
    },

    async getData(){
      const {data: ret} = await this.$http.get()
      this.allData = ret
      this.updataChart()
    },

    updataChart(){
      const dataOption = {}
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
    window.addEventListener('resize', screenAdapter)
    this.screenAdapter()
  },

  destroyed(){
    window.removeEventListener('resize', screenAdapter)
  }

}
</script>

<style lang='less' scoped>

</style>
