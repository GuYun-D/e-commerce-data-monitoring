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
      // 当前显示的页数
      currentPage: 1,
      // 一共有多少页
      totalPage: 0,
      // 定时器id
      timerID: null
    }
  },

  methods: {
    // 初始话echarts对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref)
      // 对图标对象进行事件监听
      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timerID)
      })

      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    // 获取数据
    async getData() {
      // http://localhost: 3000/api/seller
      const { data: ret } = await this.$http.get('/seller')
      console.log(ret)
      this.allData = ret
      // 对数组排序
      this.allData.sort(function (a, b) {
        return a.value - b.value
      })
      // 每五个一页
      this.totalPage = this.allData.length % 5 === 0 ? this.allData.length / 5 : this.allData.length + 1
      this.updataChart()
      // 启动定时器，实时刷新
      this.startInterval()
    },
    // 更新图表
    updataChart() {
      const start = (this.currentPage - 1) * 5 // 0
      const end = this.currentPage * 5 // 5
      const showData = this.allData.slice(start, end)

      const sellerNames = showData.map((item) => {
        return item.name
      })

      const sellerValues = showData.map((item) => {
        return item.value
      })

      const option = {
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'category',
          data: sellerNames,
        },
        series: [
          {
            type: 'bar',
            data: sellerValues,
          },
        ],
      }

      this.chartInstance.setOption(option)
    },

    startInterval() {
      if(this.timerID){
        clearInterval(this.timerID)
      }
      this.timerID = setInterval(() => {
        this.currentPage ++
        if(this.currentPage > this.totalPage){
          this.currentPage = 1
        }
        this.updataChart()
      }, 3000)
    },
  },

  // dom加载完毕的生命周期函数
  mounted() {
    this.initChart()
    this.getData()
  },

  // 组件被销毁的生命周期
  destoryed(){
    clearInterval(timerID)
  }
}
</script>

<style lang="less" scoped>
</style>
