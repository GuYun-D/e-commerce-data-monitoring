<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
    <span :style="comStyle" class="iconfont arr-left" @click="toLeft">&#xe6ef;</span>
    <span :style="comStyle" class="iconfont arr-right" @click="toRight">&#xe6ed;</span>
    <span :style="comStyle" class="cat-name">{{ cateName }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartsInstance: null,
      allData: null,
      // 控制数据切换,一级分类数据
      currentIndex: 0,

      // 文字大小
      titleFontSize: 0,
    }
  },
  methods: {
    initCharts() {
      this.chartsInstance = this.$echarts.init(this.$refs.hot_ref, 'chalk')
      this.$socket.send({
        "action": 'getData',
        "socketType": 'hotproductData',
        "chartName": 'hotproduct',
        "value": ''
      })
      const initOption = {
        series: [
          {
            type: 'pie',
            label: {
              show: false,
            },
            emphasis: {
              label: {
                show: true,
              },
              labelLine: {
                show: false,
              },
            },
          },
        ],

        title: {
          text: '| 热销商品的占比',
          left: 20,
          top: 20,
        },

        legend: {
          top: '15%',
          icon: 'circle',
        },

        tooltip: {
          show: true,
          formatter: function (arg) {
            // 得到二级分类中的三级分类
            const thirdCategory = arg.data.children
            // 计算出所有三级分类的数值总和
            let total = 0
            thirdCategory.forEach((item) => {
              total += item.value
            })
            let retStr = ''
            thirdCategory.forEach((item) => {
              retStr += `
                ${item.name}: ${parseInt((item.value / total) * 100) + '%'}
                <br />
              `
            })
            return retStr
          },
        },
      }
      this.chartsInstance.setOption(initOption)
    },
    getData(ret) {
      // const { data: ret } = await this.$http.get('/hotproduct')
      this.allData = ret
      this.updataChart()
    },
    updataChart() {
      /**
       * 数据处理，含有三个级别的分类，先只做其中一级的分类
       */
      // 饼图数据
      const seriesData = this.allData[this.currentIndex].children.map((item) => {
        return {
          name: item.name,
          value: item.value,
          // 为了在tooltip中得到这个三级分类
          children: item.children,
        }
      })
      // 图例数据
      const legendData = this.allData[this.currentIndex].children.map((item) => {
        return item.name
      })

      // console.log(seriesData)
      const dataOption = {
        series: [
          {
            data: seriesData,
          },
        ],

        legend: {
          data: legendData,
        },
      }
      this.chartsInstance.setOption(dataOption)
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.hot_ref.offsetWidth / 100) * 3.6
      const adapteeOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },

        series: [
          {
            radius: this.titleFontSize * 4.5,
            center: ['50%', '60%'],
          },
        ],

        legend: {
          itemWidth: this.titleFontSize ,
          itemHeight: this.titleFontSize ,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
        },
      }
      this.chartsInstance.setOption(adapteeOption)
      this.chartsInstance.resize()
    },

    toLeft() {
      this.currentIndex--
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1
      }
      this.updataChart()
    },

    toRight() {
      this.currentIndex++
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0
      }

      this.updataChart()
    },
  },
  mounted() {
    this.initCharts()
    // this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
  },

  computed: {
    cateName() {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.currentIndex].name
      }
    },

    comStyle() {
      return {
        fontSize: this.titleFontSize + 'px',
      }
    },
  },

  created() {
    this.$socket.registerCallBack('hotproductData', this.getData)
  },
}
</script>

<style lang='less' scoped>
.arrInit {
  position: absolute;
  top: 50%;
  transform: translate(-50%);
  cursor: pointer;
}

.title {
  color: white;
}

.arr-left {
  left: 10%;
  .arrInit();
  .title();
}

.arr-right {
  right: 10%;
  .arrInit();
  .title();
}

.cat-name {
  position: absolute;
  left: 80%;
  bottom: 20px;
  .title();
}
</style>