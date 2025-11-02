<template>
  <div>
    <div ref="main" style="width: 100%; height: 100%;" class="center"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import * as echarts from "echarts";

const props = defineProps({
  xlabels : {
    type: Array,
    default: ["name1", "name2"]
  },
  data : {
    type: Array,
    default: [
      [850, 740, 900, 1070, 930, 850, 950, 980, 980, 880, 1000, 980, 930, 650, 760, 810, 1000, 1000, 960, 960],
      [960, 940, 960, 940, 880, 800, 850, 880, 900, 840, 830, 790, 810, 880, 880, 830, 800, 790, 760, 800],
    ]
  }
})

var option = {}
var myChart = null
const main = ref() // 使用ref创建虚拟DOM引用，使用时用main.value

function init() {
  // 基于准备好的dom，初始化echarts实例
  myChart = echarts.init(main.value);
  refreshData()
}

onMounted(
  () => {
    init()
  }
)

function refreshData() {
  // 指定图表的配置项和数据
option = {
    dataset: [
      {
        // prettier-ignore
        source: props.data
      },
      {
        transform: {
          type: 'boxplot',
          config: { itemNameFormatter: function (params) {
            return props.xlabels[params.value]
          } }
        }
      },
      {
        fromDatasetIndex: 1,
        fromTransformResult: 1
      }
    ],
    tooltip: {
    trigger: 'item',
    axisPointer: {
        type: 'shadow'
    }
    },
    xAxis: {
    type: 'category',
    boundaryGap: true,
    nameGap: 30,
    splitArea: {
        show: false
    },
    splitLine: {
        show: false
    }
    },
    yAxis: {
    type: 'value',
    // min: -1.000,
        // max: 14.1000,
    splitArea: {
        show: true
    }
    },
    series: [
    {
        name: 'boxplot',
        type: 'boxplot',
        datasetIndex: 1
    }
    ]
}
  myChart.setOption(option);
}

watch(() => [...props.xlabels], () => {
  // console.log("refresh data in box chart")
  refreshData()
})

watch(() => [...props.data], () => {
  // console.log("refresh data in box chart")
  refreshData()
})
</script>

<style scoped>
</style>