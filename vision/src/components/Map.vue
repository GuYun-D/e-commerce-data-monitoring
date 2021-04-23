<template>
  <div class="com-container">
    <div class="com-chart" ref="map_ref">
      
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      chartsInstance: null,
      allData: null,
    }
  },
  methods: {
    async initCharts() {
      this.chartsInstance = this.$echarts.init(this.$refs.map_ref)
      // 获取中国地图矢量数据
      // axios基准路径已经配置，不能使用axios，所以在当前页面在引入axios
      const ret = await axios.get('http://localhost:8080/static/map/china.json')
      console.log(ret)
      // 注册地图
      this.$echarts.registerMap('china', ret.data)

      const initOption = {
        geo: {
          type: 'map',
          map: 'china'
        }
      }
      this.chartsInstance.setOption(initOption)
    },
    async getData() {
      const { data: ret } = await this.$http.get()
      this.allData = ret
      this.updataChart()
    },
    updataChart() {
      const dataOption = {}
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