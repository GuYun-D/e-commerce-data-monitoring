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
    }
  },
  methods: {
    initCharts() {
      this.chartsInstance = this.$echarts.init(this.$refs.stock_ref)
      const initOption = {
      }
      this.chartsInstance.setOption(initOption)
    },
    async getData() {
      const { data: ret } = await this.$http.get('stock')
      this.allData = ret
      // console.log(ret);
      this.updataChart()
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
      // 处理数据
      const showData = this.allData.slice(0, 5)
      const seriesArr = showData.map((item, index) => {
        return {
          type: 'pie',
          // 变成圆环图
          radius: [110, 100],
          center: centerArr[index],
          data: [
            {
              // 销量
              value: item.sales,
            },
            {
              // 库存
              value: item.stock,
            },
          ],
        }
      })

      const dataOption = {
        series: seriesArr
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