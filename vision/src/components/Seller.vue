/**
    商家销售统计横向柱状图
 */
<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // echarts对象
      chartInstance: null,
      // 服务器返回的数据
      allData: null,
    }
  },

  methods: {
    // 初始话echarts对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref)
    },
    // 获取数据
    async getData() {
      // http://localhost: 8080/api/seller
      const { data: ret } = await this.$http.get('/seller')
      console.log(ret)
      this.allData = ret
      this.updataChart()
    },
    // 更新图表
    updataChart() {
      const sellerNames = this.allData.map((item) => {
        return item.name
      })

      const sellerValues = this.allData.map((item) => {
        return item.value
      })

      const option = {
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: "category",
          data: sellerNames,
        },
        series: [
          {
            type: "bar",
            data: sellerValues,
          },
        ],
      }

      this.chartInstance.setOption(option)
    },
  },

  mounted() {
    this.initChart()
    this.getData()
  },
}
</script>

<style lang="less" scoped>
</style>
