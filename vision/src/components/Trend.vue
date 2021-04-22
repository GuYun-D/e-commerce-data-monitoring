<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{ '|      ' + showTitle }}</span>
      <span :style="comStyle" class="iconfont" id="title-icon" @click="showChoice = !showChoice">&#xe6eb;</span>
      <div class="selete_con" v-show="showChoice" :style="marginStyle">
        <div class="selete_item" v-for="item in seleteTypes" :key="item.key" @click="handleSelect(item.key)">{{ item.text }}</div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartsInstance: null,
      allData: null,
      // 控制标题的显示与隐藏
      showChoice: false,
      // 显示数据的类型
      choiceType: 'map',
      // 字体大小
      titleFontSize: 0,
    }
  },

  mounted() {
    this.initCharts()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },

  methods: {
    initCharts() {
      this.chartsInstance = this.$echarts.init(this.$refs.trend_ref, 'chalk')
      const initOption = {
        xAxis: {
          type: 'category',
          // 紧挨边缘
          boundaryGap: false,
        },

        yAxis: {
          type: 'value',
        },

        tooltip: {
          trigger: 'axis',
        },

        legend: {
          left: 20,
          top: '15%',
          icon: 'circle',
        },

        grid: {
          top: '35%',
          right: '4%',
          bottom: '1%',
          left: '3%',
          containLabel: true,
        },
      }
      this.chartsInstance.setOption(initOption)
    },

    async getData() {
      const { data: ret } = await this.$http.get('trend')
      console.log(ret)
      this.allData = ret
      this.updataChart()
    },

    updataChart() {
      // 定义颜色值
      // 半透明的颜色值
      const colorArr1 = ['rgba(11, 168, 44, 0.5)', 'rgba(44, 110, 255, 0.5)', 'rgba(22, 242, 217, 0.5)', 'rgba(254, 33, 30, 0.5)', 'rgba(250, 105, 0, 0.5)']
      // 全透明的颜色值
      const colorArr2 = ['rgba(11, 168, 44, 0)', 'rgba(44, 110, 255, 0)', 'rgba(22, 242, 217, 0)', 'rgba(254, 33, 30, 0)', 'rgba(250, 105, 0, 0)']

      // 获取类目轴数据
      const timerArr = this.allData.common.month
      // y轴数据
      const valueArr = this.allData[this.choiceType].data
      // 数据
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          stack: this.choiceType,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index],
              },
              {
                offset: 1,
                color: colorArr2[index],
              },
            ]),
          },
        }
      })
      // 图例数据
      const lengedArr = valueArr.map((item) => {
        return item.name
      })
      console.log(lengedArr)

      const dataOption = {
        xAxis: {
          data: timerArr,
        },

        series: seriesArr,

        legend: {
          data: lengedArr,
        },
      }
      this.chartsInstance.setOption(dataOption)
    },

    screenAdapter() {
      // 根据宽度计算字体大小
      this.titleFontSize = (this.$refs.trend_ref.offsetWidth / 100) * 3.6
      const adapteeOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
        },
      }
      this.chartsInstance.setOption(adapteeOption)
      this.chartsInstance.resize()
    },

    handleSelect(currentType) {
      this.choiceType = currentType
      this.updataChart()
      this.showChoice = false
    },
  },

  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
  },

  computed: {
    seleteTypes() {
      if (!this.allData) {
        return []
      } else {
        return this.allData.type.filter((item) => {
          return item.key != this.choiceType
        })
      }
    },

    showTitle() {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.choiceType].title
      }
    },

    // 设置字体大小
    comStyle() {
      return {
        fontSize: this.titleFontSize + 'px',
      }
    },

    // 设置间距
    marginStyle() {
      return {
        marginLeft: this.titleFontSize - 20 + 'px',
      }
    },
  },
}
</script>

<style lang='less' scoped>
.title {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 2;
  color: #fff;

  #title-icon {
    margin-left: 10px;
    cursor: pointer;
  }

  .selete_item {
    &:hover {
      cursor: pointer;
    }
  }

  .selete_con {
    background-color: #222733;
  }
}
</style>
