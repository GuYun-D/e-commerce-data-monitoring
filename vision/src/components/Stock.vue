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
      this.chartsInstance = this.$echarts.init(this.$refs.stock_ref, 'chalk')
      const initOption = {
        title: {
          text: '|   库存和销量分析',
          top: 20,
          left: 20,
        },
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

      // 圆环图渐变色
      const colorArr = [
        ['#4ff778', '#0ba82c'],
        ['#e5dd45', '#e8b11c'],
        ['#e8821c', '#e55445'],
        ['#5052ee', '#ab6ee5'],
        ['#23e5e5', '#2e72bf'],
      ]

      // 处理数据
      const showData = this.allData.slice(0, 5)
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