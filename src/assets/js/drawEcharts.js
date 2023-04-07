import * as echarts from 'echarts'
// 数据占比 属性1
function drawclass1pro(ID, mydata, classname, dataname){
    var option;
    var data_s = [];
    var label = [];
    var temp = {value:0,name:null};
     for (var key in mydata){
         data_s.push({
             name:key,
             value:mydata[key].toFixed(2)
         })
         label.push(key)
     }

    // const data = genData(50);
    option = {
      // title: {
      //   text: '敏感属性：'+classname,
      //   textStyle:{
      //       color:'rgba(0, 0, 0, 1)'
      //   },
      //   left: 'center',
      //   top: 280,
      // },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
    //   grid: {
    //     top:"1%",

    //     left:10,

    //     right:"1%",

    //     bottom:250
    // },
      // legend: {
      //   textStyle:{
      //       color:'rgba(0, 0, 0, 1)'
      //   },
      //   type: 'scroll',
      //   orient: 'vertical',
      //   right: 10,
      //   // left:30,
      //   top: 20,
      //   bottom: 10,
      //   data: label
      // },
      legend: {
        top: '5%',
        left: 'center'
      },
      color:["rgba(91,143,249,0.85)","rgba(90,216,166,0.85)"],
      series: [
        {
          name: dataname,
          type: 'pie',
          radius: ['60%', '70%'],
          // center: ['40%', '50%'],
          avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'left'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
          data: data_s,
          // emphasis: {
          //   itemStyle: {
          //     shadowBlur: 10,
          //     shadowOffsetX: 0,
          //     shadowColor: 'rgba(0, 0, 0, 0.5)'
          //   }
          // }
        }
      ]
    };
    setTimeout(function(){
        var myChartcons = echarts.init(document.getElementById(ID));
        window.addEventListener("resize", function () {
            myChartcons.resize()});
        option && myChartcons.setOption(option);
    },500)
}
//敏感属性1直方图 difference id=class1Difference
function drawbar(ID, data, label,name){
    var option;
    option = {
      title:{
        text:name,
        textStyle:{
          fontSize:18,
          color:"rgba(0, 0, 0, 1)"
        },
        x:'center',
        y:'bottom'
      },
      xAxis: {
        type: 'category',
        data: label,
        axisLabel:{
          show:true,
          textStyle:{
            color: "rgba(0, 0, 0, 1)",
            fontSize:14
          }
        },
        axisLine:{
          onZero:true,
          lineStyle:{
            color:'rgba(0, 0, 0, 1)'
          }
        }
      },
      yAxis: {
        type: 'value',
        min:0,
        max:1,
        interval:0.2,
        axisLabel:{
          show:true,
          textStyle:{
            color: "rgba(0, 0, 0, 1)",
            fontSize:14
          },
          // margin: 10px,
        },
        axisLine:{
          show:false,
          lineStyle:{
            color:'rgba(0, 0, 0, 1)'
          }
        },
        splitLine: {
          show: true,
          lineStyle:{
              type:'dashed'
          }
        }
      },
      series: [
        {
          data: data,
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          itemStyle:{
            normal:{
              color:'#91c7ae',
              label:{
                show:true,
                position:"top",
                color:"rgba(0, 0, 0, 1)"
              }
            }
          }
        }
      ]
    };
    setTimeout(function(){
        var myChartcons = echarts.init(document.getElementById(ID));
        window.addEventListener("resize", function () {
            myChartcons.resize()});
        option && myChartcons.setOption(option);
    },500)
  }

//敏感属性直方图 提升
function drawbarimproved( ID, data, data2, label, name){
    var option;
    option = {
      title:{
        text:name,
        textStyle:{
          fontSize:18,
          // align:center,
          
          color:"rgba(0, 0, 0, 1)"
        },
        x:'center',
        y:'bottom'
      },
      xAxis: {
        type: 'category',
        data: label,
        axisLabel:{
          show:true,
          textStyle:{
            color: "rgba(0, 0, 0, 1)",
            fontSize:14
          }
        },
        axisLine:{
          onZero:true,
          lineStyle:{
            color:'rgba(0, 0, 0, 1)'
          }
        }
      },
      yAxis: {
        type: 'value',
        min:-0.1,
        max:1.1,
        interval:0.2,
        axisLabel:{
          show:true,
          textStyle:{
            color: "rgba(0, 0, 0, 1)",
            fontSize:14
          },
          // margin: 10px,
        },
        axisLine:{
          show:false,
          lineStyle:{
            color:'rgba(0, 0, 0, 1)'
          }
        },
        splitLine: {
          show: true,
          lineStyle:{
              type:'dashed'
          }
        }
      },
      legend: {
        data: ['origin', 'improved'],
        textStyle:{
          color:"rgba(0, 0, 0, 1)",
          fontSize:14,
          // right:"100px"
          // x:"right",
          // y:"top",
          // padding:[20,200,300,10]
        },
        x:"right"
      },
      series: [
        {
          name:"origin",
          data: data,
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          itemStyle:{
            normal:{
              color:'#91c7ae',
              label:{
                show:true,
                position:"top",
                color:"rgba(0, 0, 0, 1)"
              }
            }
          }
        },
        {
          name:"improved",
          data: data2,
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          itemStyle:{
            normal:{
              color:'rgb(61,163,216)',
              label:{
                show:true,
                position:"top",
                color:"rgba(0, 0, 0, 1)"
              }
            }
          }
        }
      ]
    };
    setTimeout(function(){
        var myChartcons = echarts.init(document.getElementById(ID));
        window.addEventListener("resize", function () {
            myChartcons.resize()});
        option && myChartcons.setOption(option);
    },500)
  }
//公平性评估大
function drawconseva1(ID, value){
    var option;

    console.log(value);
    option = {
      series: [
        {
          type: 'gauge',
          minInterval:0.02,
          min:0,
          max:1,
          axisLine: {
            lineStyle: {
              width: 15,
              color: [
                [0.3, '#fd666d'],
                [0.7, '#37a2da'],
                [1, '#67e0e3']
              ]
            }
          },
          grid: {
            left: "1%",
            right: "1%",
            show: true
          },
          pointer: {
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            distance: -10,
            length: 15,
            lineStyle: {
              color: '#fff',
              width: 2
            }
          },
          splitLine: {
            distance: -20,
            length: 30,
            lineStyle: {
              color: '#fff',
              width: 2
            }
          },
          axisLabel: {
            color: 'auto',
            distance: 20,
            fontSize: 15
          },
          detail: {
            valueAnimation: true,
            formatter: 'Consistency\n{value}',
            color: 'auto',
            fontSize:20
          },
          data: [
            {
              value: value
            }
          ]
        }
      ]
    };
    setTimeout(function(){
        var myChartcons = echarts.init(document.getElementById(ID));
        window.addEventListener("resize", function () {
            myChartcons.resize()});
        option && myChartcons.setOption(option);
    },500)
  }
  //个体公平性评估小
function drawconseva( ID, value, titlename){
    var option;
    console.log(value);
    option = {
      title:{
        // show:true,
        text:titlename,
        textStyle:{
          color:"rgba(0, 0, 0, 1)",
          fontSize:18,
        },
  x:'center',
  y:280,
  },
      series: [
        {
          type: 'gauge',
          minInterval:0.02,
          min:0,
          max:1,
          radius:100,
          axisLine: {
            lineStyle: {
              width: 10,
              color: [
                [0.3, '#fd666d'],
                [0.7, '#37a2da'],
                [1, '#67e0e3']
              ]
            }
          },
          grid: {
            left: "1%",
            right: "1%",
            show: true
          },
          pointer: {
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            distance: -5,
            length: 5,
            lineStyle: {
              color: '#fff',
              width: 2
            }
          },
          splitLine: {
            distance: -5,
            length: 15,
            lineStyle: {
              color: '#fff',
              width: 2
            }
          },
          axisLabel: {
            color: 'auto',
            distance: 10,
            fontSize: 13
          },
          detail: {
            valueAnimation: true,
            formatter: 'Consistency\n{value}',
            color: 'auto',
            fontSize:15
          },
          data: [
            {
              value: value
            }
          ]
        }
      ]
    };
    setTimeout(function(){
        var myChartcons = echarts.init(document.getElementById(ID));
        window.addEventListener("resize", function () {
            myChartcons.resize()});
        option && myChartcons.setOption(option);
    },500)
  };

  export{
    drawclass1pro,
    drawbar,
    drawbarimproved,
    drawconseva1,
    drawconseva
  }