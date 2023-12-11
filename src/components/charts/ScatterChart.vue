
<template>
    <div>
        <div ref="main" style="width: 100%; height: 100%;"></div>
        <!-- <div>{{ "$$10^2$$" }}</div> -->
        <!-- <vue-latex :expression="'\\frac{a_i}{1+x}'" display-mode/> -->
    </div>
</template>
  
<script>
import * as echarts from "echarts";


export default {
    name: "scatter",
    props : {
        inputData:{
            type: Array,
            default: [[4,1], [3, -4]]
        },
        refreshWidth: {
            type: String,
            default: "200px"
        },
        refresh_Width:{
          type: Boolean,
          default:true
        },
        color:{
            type: Array,
            default: [['#37A2DA','#e06343'],['#000']]
        }
    },
    data(){
        return{
            option : {},
            myChart : null,
            type:["正常样本","对抗样本"]
            // 使用ref创建虚拟DOM引用，使用时用main.value
        }
    },
    mounted(){
            // 基于准备好的dom，初始化echarts实例
            this.$nextTick(function(){
                this.myChart = echarts.init(this.$refs.main);
                this.refreshData()
            })
            
    },
    methods:{
        refreshData() {
            this.myChart.resize({
                width: this.refreshWidth,
                height: this.$refs.main.clientHeight
            })
            let series = []
            for (let i in this.inputData) {
                series.push({
                    name:this.type[i],
                    type: "scatter",
                    data: this.inputData[i],
                    symbolSize: 2,
                    itemStyle: { color: this.color[0][i], opacity:0.8 }
                })
            }
            // 指定图表的配置项和数据
            this.option = {
                legend: {
                    top: 5,
                    data: this.type,
                    textStyle:{
                        color:this.color[1][0]
                    }
                },
                grid:{
                    top:"30px",
                    left:"20px",
                    right:"10px",
                    bottom:"20px",
                },
                xAxis: {},
                yAxis: {
                    nameTextStyle:{
                        fontSize:6
                    }
                },
                series: series
            };
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
  