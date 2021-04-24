<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
    <span class="iconfont arr-left" @click="toLeft">&#xe6ef;</span>
    <span class="iconfont arr-right" @click="toRight">&#xe6ed;</span>
    <span class="cat-name">{{cateName}}</span>
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
    }
  },
  methods: {
    initCharts() {
      this.chartsInstance = this.$echarts.init(this.$refs.hot_ref)
      const initOption = {
        series: [
          {
            type: 'pie',
          },
        ],
      }
      this.chartsInstance.setOption(initOption)
    },
    async getData() {
      const { data: ret } = await this.$http.get('/hotproduct')
      this.allData = ret
      // console.log(ret)
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
      const adapteeOption = {}
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
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
  },

  computed: {
    cateName(){
      if(!this.allData){
        return ''
      }else{
        return this.allData[this.currentIndex].name
      }
    }
  }
}
</script>

<style lang='less' scoped>
.arrInit {
  position: absolute;
  top: 50%;
  transform: translate(-50%);
  cursor: pointer;
}

.arr-left {
  left: 10%;
  .arrInit();
}

.arr-right {
  right: 10%;
  .arrInit();
}

.cat-name{
  position: absolute;
  left: 80%;
  bottom: 20px;
}
</style>