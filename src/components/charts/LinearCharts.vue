
<template>
    <div>
        <div ref="main" style="width: 100%; height: 100%;" class="center"></div>
        <!-- <div>{{ "$$10^2$$" }}</div> -->
        <!-- <vue-latex :expression="'\\frac{a_i}{1+x}'" display-mode/> -->
    </div>
</template>
  
<script setup>
import { ref, onMounted, watch } from "vue";
import * as echarts from "echarts";

const props = defineProps({
    xData: {
        type: Array,
        default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yData: {
        type: Object,
        default: {
            "Email": [120, 132, 101, 134, 90, 230, 210],
            "Union Ads": [220, 182, 191, 234, 290, 330, 310],
            "Video Ads": [150, 232, 201, 154, 190, 330, 410],
            "Direct": [320, 332, 301, 334, 390, 330, 320],
            "Search Engine": [820, 932, 901, 934, 1290, 1330, 1320]
        }
    },
    refreshWidth: {
        type: String,
        default: "200px"
    },
        refresh_Width:{
          type: Boolean,
          default:true
        }
})

// 折线图的备用样式，用于统一不同的
const storedSymbols = ['emptycircle', 'emptyrect', 'emptytriangle', 'emptydiamond', 'emptytriangle', 'emptytriangle', 'emptytriangle', 'emptypin', 'emptyarrow', 'emptyroundRect', 'emptynone']
const storedSymbolRotates = [0, 0, 0, 0, 90, 180, 270]
var option = {}
var myChart = null
const main = ref(null) // 使用ref创建虚拟DOM引用，使用时用main.value

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
    myChart.resize({
        width: props.refreshWidth,
        height: main.value.clientHeight
    })
    let series = []
    let methods = []
    for (const [method, values] of Object.entries(props.yData)) {
        methods.push(method)
        series.push({
            name: method,
            type: "line",
            stack: "Total",
            data: values,
            symbol: storedSymbols[methods.length - 1],
            symbolSize: 8,
            symbolRotate: storedSymbolRotates[methods.length - 1]
        })
    }
    // 指定图表的配置项和数据
    option = {
        tooltip: {
            trigger: 'axis'
        },
        grid:{
            x:"18%",
        },
        legend: {
            data: methods,
            textStyle: {
                fontSize: 16,
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                // saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: props.xData,
            axisLabel: {
                fontSize: 16
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                fontSize: 16
            }
        },
        series: series
    }
    myChart.setOption(option);
}

watch(() => [...props.xData], () => {
    refreshData()
})

watch(() => props.refreshWidth, () => {
    refreshData()
})
</script>
  
<style scoped>
.center {
    left: 50%;
    top: 50%;
    position: relative;
    transform: translate(-50%, -50%);
}
</style>