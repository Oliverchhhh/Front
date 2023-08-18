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
        refresh_Width:{
          type: Boolean,
          default:true
        }
    },
    data(){
        return{
            option : {},
            myChart : null,
            color:['#37A2DA','#e06343'],
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
          // 指定图表的配置项和数据
          let mySeries = []
          let legend = []
          let maxYValue = -Infinity
          console.log(this.inputData)

          for (let i in this.inputData) {
            legend.push(this.type[i])
            var bins = this.inputData[i]
            var min = Infinity;
            var max = -Infinity;
            
            bins = ecStat.histogram(bins, "sturges")
            console.log(bins)

            var data = echarts.util.map(bins.data, function (item, index) {
              // 左刻度
              var x0 = bins.bins[index].x0;
              // 右刻度
              var x1 = bins.bins[index].x1;
              // 获得数据集中最值
              min = Math.min(min, x0);
              max = Math.max(max, x1);

              maxYValue = Math.max(item[1], maxYValue)
              // item[0]代表刻度的中间值，item[1]代表出现的次数
              return [x0, x1, item[1]];
            });

            mySeries.push({
              name: this.type[i],
              type: "custom",
              data: data,
              renderItem : function(_, api) {
                // 这个根据自己的需求适当调节
                var yValue = api.value(2);
                var start = api.coord([api.value(0), yValue]);
                var size = api.size([api.value(1) - api.value(0), yValue]);

                return {
                  // 矩形及配置
                  type: 'rect',
                  shape: {
                      x: start[0] + 1,
                      y: start[1],
                      width: size[0] - 2,
                      height: size[1]
                  },
                  style: {
                    fill: api.visual('color'),
                    opacity: 1
                  }
                };
              },
              itemStyle: {
                color: this.color[i]
              }
            })

          }
            // 指定图表的配置项和数据
            this.option = {
                legend: {
                    top: 10,
                    data: legend
                },
                grid:{
                    x:"18%",
                },
                xAxis: {
                  type:"value",
                },
                yAxis: {
                    min: 0,
                    max: () => {
                      let num = 10 ** (maxYValue.toString().length - 1)
                      return Math.ceil(maxYValue / num + 1) * num;
                    }
                },
                series: mySeries
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

