<template>
    <div>
      <div ref="main" style="width: 100%; height: 100%;" ></div>
    </div>
</template>
<script>
import * as echarts from "echarts";
import ecStat from 'echarts-stat'

export default {
    name: "bar",
    props : {
        inputData : {
          type: Array,
          default: [[8.3, 8.6, 8.8, 10.5, 10.7, 10.8, 18.0, 18.0, 20.6],[1,2,3,4,5,6,7,8,9,10]]
      },
        refreshWidth: {
            type: String,
            default: "200px"
        },
        postData:{}
    },
    data(){
        return{
            option : {},
            myChart : null,
            type:["正常样本","对抗样本"],
            modeMsg:{
                "reach":{"ID":"reach","name":"可达性","modellist":["CNN-3layer"],"dataset":["mnist","cifar10"],
                "label":{
                    "mnist":{
                    0:"数字1",
                    1:"数字2",
                    2:"数字3",
                    3:"数字4",
                    4:"数字5",
                    5:"数字6",
                    6:"数字7",
                    7:"数字8",
                    8:"数字9",
                    9:"数字0",
                    },
                    "cifar10":{
                    0:"飞机",
                    1:"汽车",
                    2:"鸟类",
                    3:"猫",
                    4:"鹿",
                    5:"狗",
                    6:"青蛙",
                    7:"马",
                    8:"船",
                    9:"卡车", }
                    }
                },
            }
            // 使用ref创建虚拟DOM引用，使用时用main.value
        }
    },
    mounted(){
      // 基于准备好的dom，初始化echarts实例
      this.$nextTick(function(){
        let ylabel = this.modeMsg.reach.label[this.postData.dataname]
        this.myChart = echarts.init(this.$refs.main);
        this.refreshData(this.inputData, ylabel)
    })
            
    },
    methods:{
        
        dataFormat (data, name, isReverse) {
            const copyObj = (obj = {}) => {            //变量先置空
                let newobj = null;  

                //判断是否需要继续进行递归
                if (typeof (obj) == 'object' && obj !== null) {
                    newobj = obj instanceof Array ? [] : {};                //进行下一层递归克隆
                    for (var i in obj) {
                        newobj[i] = copyObj(obj[i])
                    }                //如果不是对象直接赋值
                } else newobj = obj;            
                return newobj;    
            }
            let min = []; // 区间的最小值, 堆叠，透明
            let max = []; // 区间的最大值, 堆叠，显示
            let negative = []; // 负值处理，堆叠，显示负值的部分，max仅显示了正值的部分。特殊情况，区间最小值为负值，最大值为正值。
            let minLabel = []; // 显示区间的最小值的 label 数据，在 max 上通过 markpoint 实现，以控制 label 颜色值和显示的柱子颜色值一致，并且显示隐藏有效

            // 对数据排序，后面需要找到整组数据中最小值
            let sortData = copyObj(data);
            sortData.sort((a, b) => a[0] - b[0])

            data.forEach((item, i) => {

            // 取哪个值作为透明底层(从0开始)，[-min, +max]->0不需要透明; [-min, -max]->-max到0填充透明；[+min,+max]->0到+min填充透明
            min.push(item[1] <= 0 ? item[1] : item[0] <= 0 ? 0 : item[0]);
            // 主要处理[-min,+max]情况，填充显示-min的部分。其他情况不需要填充，为0。
            negative.push(item[1] <=0 || item[0] >= 0 ? 0 : item[0]);

            // 横向：coord: [offsetx，y]，等同于 xAxis: offsetx, yAxis: y。其中，offsetx 表示偏移值，y 表示bar的索引。
            // 竖向：[x, offsety]
            const coord = isReverse ? [item[0], i] : [i, item[0]];
            minLabel.push({
            value: item[0], // 对值进行格式化
            coord: item[0] || sortData[0][0] ? coord : [], // 当最小值不为0的时候，都要显示
            })

            max.push({
            // // 差值作为叠加值，在透明层的数据上叠加。[-min, +max]->0到max,不需要堆叠进行差值计算; [+min, +max]->+max - +min需要计算差值；[-min,-max]->-min - -max需要计算差值
            value: item[1] <=0 ? item[0] - item[1] : item[0] <= 0 ? item[1] : item[1] - item[0],
            range: item, // tooltip 显示
            name, // legend 显示
            label: {
            formatter: '' + item[1], // 最终值作为显示值
            },
            itemStyle: {
            color: item[2]
            }
            })
            })

            return {
            min,
            max,
            negative,
            minLabel
            }
        },
        createSeries (arr, name, showLabel, isReverse) {
            let newSeries = [];

            const {min, max, minLabel, negative} = this.dataFormat(arr, name, isReverse);

            const maxPosition = isReverse ? 'right' : 'top';
            const minPosition = isReverse ? 'left' : 'bottom';

            newSeries = [
            // 作为堆叠辅助，不显示
            {
            type: 'bar',
            stack: name,
            tooltip: {
            show: false
            },
            // 透明
            itemStyle: {
            barBorderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)'
            },
            emphasis: {
            itemStyle: {
                barBorderColor: 'rgba(0,0,0,0)',
                color: 'rgba(0,0,0,0)'
            }
            },
            label: {
            show: false,
            },
            data: min
            },
            // 当区间[负值，正值]时，用于显示负值的部分
            {
            type: 'bar',
            stack: name,
            name: name, // 名称和max相同，保证柱子统一颜色
            tooltip: {
            show: false,
            },
            label: {
            show: false,
            },
            data: negative,
            },
            // 用于显示正值的部分
            {
            type: 'bar',
            stack: name,
            name: name,
            tooltip: {
            show: true,
            },
            label: {
            show: showLabel,
            position: maxPosition,
            },
            markPoint: {
            symbol: 'rect',
            // 图形上面的小头隐藏
            symbolSize: 0.000000000000001,
            label: {
                show: showLabel,
                position: minPosition,
            },
            data: minLabel
            },
            data: max,
            }
            ]

            return newSeries;
        },
        refreshData(data1,category) {
            this.myChart.resize({
                width: this.refreshWidth,
                height: this.$refs.main.clientHeight
            })
            var isReverse = true;
            var showLabel = true;
            const name = [
            '置信度', 
            ];
            const data= [];
            data.push(data1);
            let series = [];
            data.forEach((item, i) => {
            series = [...series, ...this.createSeries(item, name[i], showLabel, isReverse)]
            })

            let yAxis = {
            type: 'value'
            }

            let xAxis = {
            type: 'category',
            axisLine: {
                onZero: false
            },
            splitLine: {
                show: false
            },
            data: category
            }

            if (isReverse) {
            [xAxis, yAxis] = [yAxis, xAxis];
            }

            this.option = {
            color: ['#0CFFFF', 'violet', 'orange'],
            legend: {
                data: name,
                textStyle:{
                        color:'#FFF',
                        
                    },
                left:'right'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function (params) {
                var html = '';
                var axisValue = '';
                params.forEach(item => {
                    axisValue = item.axisValue;
                    const range = item.data.range;
                    html += item.marker + item.name + ': ' + range[0] + ' ~ ' + range[1] + '<br/>';
                })
                const {name, data: {range}} = params[0];
                return axisValue + '<br/>' + html;
                }
            },
            grid: {
                top:"30px",
                left:"20px",
                right:"10px",
                bottom:"20px",
                containLabel: true
            },
            xAxis: xAxis,
            yAxis: yAxis,
            series: series
            };
            this.myChart.clear()
            this.myChart.setOption(this.option);
    }
    },
    watch:{
        inputData(value,newval){
            this.$nextTick(function(){
                this.refreshData()
            })   
         }  

    }
}
</script>