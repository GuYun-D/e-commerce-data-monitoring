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
      timerID: null,
    }
  },

  methods: {
    // 初始话echarts对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, 'chalk')
      this.$socket.send({
        "action": 'getData',
        "socketType": 'sellerData',
        "chartName": 'seller',
        "value": ''
      })
      // 对图标初始化配置的控制
      const initOption = {
        title: {
          text: '| 商家销售统计',
          top: 20,
          left: 20,
        },

        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          // 设置坐标轴的位置，是不包括文字的，需要配置属性containLabel: true
          containLabel: true,
        },

        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'category',
        },

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            // 层级设置
            z: 0,
            lineStyle: {
              color: '#2d3443',
            },
          },
        },

        series: [
          {
            type: 'bar',
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: 'white',
              },
            },
            itemStyle: {
              // 指明方向
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: '#5052ee',
                },
                {
                  offset: 1,
                  color: '#c701ff',
                },
              ]),
            },
          },
        ],
      }
      this.chartInstance.setOption(initOption)

      // 对图标对象进行事件监听
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerID)
      })

      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    // 获取数据
    getData(ret) {
      // http://localhost: 3000/api/seller
      // const { data: ret } = await this.$http.get('/seller')
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

      const dataOption = {
        yAxis: {
          data: sellerNames,
        },

        series: [
          {
            data: sellerValues,
          },
        ],
      }

      this.chartInstance.setOption(dataOption)
    },

    startInterval() {
      if (this.timerID) {
        clearInterval(this.timerID)
      }
      this.timerID = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }
        this.updataChart()
      }, 3000)
    },

    // 屏幕适配函数
    // 当浏览器的屏幕发生变化时，调用此方法
    screenAdapter() {
      // this.$refs.seller_ref.offsetWidth
      // 当屏幕发生变化时，动态修改文字的大小
      const titleFontsize = (this.$refs.seller_ref.offsetWidth / 100) * 3.6
      console.log(titleFontsize)

      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontsize,
          }
        },

        tooltip: {
          axisPointer: {
            lineStyle: {
              with: titleFontsize
            },
          },
        },

        series: [
          {
            barWidth: titleFontsize,
            itemStyle: {
              barBorderRadius: [0, titleFontsize / 2, titleFontsize / 2, 0],
            },
          },
        ],
      }

      this.chartInstance.setOption(adapterOption)

      // 手动调用图表对象的resize，才能实现效果
      this.chartInstance.resize()
    },
  },

  // dom加载完毕的生命周期函数
  mounted() {
    this.initChart()
    // this.getData()
    window.addEventListener('resize', this.screenAdapter)
    // 在我们第一次进入图表的时候，也要调用方法进行适配
    this.screenAdapter()
  },

  // 组件被销毁的生命周期
  destoryed() {
    clearInterval(timerID)
    window.removeEventListener('resize', screenAdapter)
    this.$socket.unregisterCallBack('sellerData')
  },

  created(){
    this.$socket.registerCallBack('sellerData', this.getData)
  }
}
</script>

<style lang="less" scoped>
</style>
