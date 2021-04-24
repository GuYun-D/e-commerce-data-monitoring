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
      this.chartsInstance = this.$echarts.init(this.$refs.rank_ref, 'chalk')
      const initOption = {
        title: {
          text: '| 地区销售排行',
          left: 20,
          top: 20,
        },
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
        grid: {
          top: '40%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true,
        },

        tooltip: {
          show: true,
        },
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
      // 颜色渐变的数组
      const colorArr = [
        ['#0ba82c', '#4ff778'],
        ['#2e72bf', '#23e5e5'],
        ['#5052ee', '#ab6ee5'],
      ]
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
                    color: targetColorArr[0],
                  }, {
                    offset: 1,
                    color: targetColorArr[1]
                  }
                ])
              },
            },
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