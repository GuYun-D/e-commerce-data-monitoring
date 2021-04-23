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
      this.chartsInstance = this.$echarts.init(this.$refs.map_ref, 'chalk')
      // 获取中国地图矢量数据
      // axios基准路径已经配置，不能使用axios，所以在当前页面在引入axios
      const ret = await axios.get('http://localhost:8080/static/map/china.json')
      // 注册地图
      this.$echarts.registerMap('china', ret.data)

      const initOption = {
        title: {
          text: '| 商家分布',
          left: 20,
          top: 20
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2e728f',
            borderColor: '#333'
          }
        },
        legend: {
          left: '5%',
          bottom: '5%',
          // 将图例排列方式改为竖直
          orient: 'vertical'
        }
      }
      this.chartsInstance.setOption(initOption)
    },
    async getData() {
      const { data: ret } = await this.$http.get('/map')
      this.allData = ret
      this.updataChart()
    },
    updataChart() {
      // 图例数据
      const legendArr = this.allData.map(item => {
        return item.name
      })

      // 处理数据
      const seriesArr = this.allData.map(item => {
        // return的对象就是代表一个类别的所有散点数据
        // 类别：ret中三个数组，分别代表三个类别，黄金，白金，钻石
        // 如果想要在地图中显示散点数据，需要给散点图表添加配置：coordinateSystem: 'geo'
        return {
          type: 'effectScatter',
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo',
          rippleEffect: {
            scale: 5,
            brushType: 'stroke'
          }
        }
      })

      const dataOption = {
        series: seriesArr,
        legend: {
          data: legendArr
        }
      }
      this.chartsInstance.setOption(dataOption)
    },
    screenAdapter() {
      const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
      const adapteeOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },

        legend: {
          itemWidth : titleFontSize / 2,
          itemHeight : titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2
          }
        }
      }
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