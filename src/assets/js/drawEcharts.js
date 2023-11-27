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

    option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
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
function drawbar(ID, data, label, name='',xname='', yname='', min_max=[0,1,0.2]){
    var option;
    option = {
      title:{
        text:name,
        textStyle:{
          fontFamily : 'HONOR Sans CN',
          fontStyle:'normal',
          fontWeight:700,
          fontSize:14,
          color:"#000000"
        },
        x:'center',
        y:'bottom'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid:{
        x:"8%",
        y:"10%",
        x2:"10%",
        y2:"15%",
      },
      xAxis: {
        type: 'category',
        name:xname,
        data: label,
        axisLabel:{
          show:true,
          // rotate: '45',
          textStyle:{
            color: "#3E4453",
            fontSize:12,
            fontFamily : 'HONOR Sans CN',
          fontStyle:'normal',
          fontWeight:400,
          }
        },
        axisLine:{
          onZero:true,
          lineStyle:{
            color:'#B4B9C5'
          }
        }
      },
      yAxis: {
        name:yname,
        type: 'value',
        min:min_max[0],
        max:min_max[1],
        interval:min_max[0.2],
        axisLabel:{
          show:true,
          textStyle:{
            color: "#6C7385",
            fontSize:12,
            fontFamily : 'HONOR Sans CN',
          fontStyle:'normal',
          fontWeight:400,
          },
          // margin: 10px,
        },
        axisLine:{
          show:false,
          lineStyle:{
            color:'#B4B9C5'
          }
        },
        splitLine: {
          show: true,
          lineStyle:{
            color:"#E0E3EB",
              type:'solid'
          }
        }
      },
      series: [
        {
          data: data,
          type: 'bar',
          showBackground: false,
          barMaxWidth: '100',
          itemStyle:{
              color:'rgba(11, 85, 244, 0.8)',
              label:{
              show:true,
              position:"top",
              fontSize:12,
              color:"rgba(0, 0, 0, 1)",
              fontFamily : 'HONOR Sans CN',
              fontStyle:'normal',
              fontWeight:400,
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

function drawbarhigh(ID, data, label, name='',xname='', yname=''){
  var option;
  let max = Math.round(Math.max.apply(null,data)+1)
  let internum = Math.round(max/10)
  
  option = {
    title:{
      text:name,
      textStyle:{
        fontFamily : 'HONOR Sans CN',
        fontStyle:'normal',
        fontWeight:700,
        fontSize:14,
        color:"#000000"
      },
      x:'center',
      y:'bottom'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid:{
      x:"8%",
      y:"10%",
      x2:"10%",
      y2:"15%",
    },
    xAxis: {
      type: 'category',
      name:xname,
      data: label,
      axisLabel:{
        show:true,
        // rotate: '45',
        textStyle:{
          color: "#3E4453",
          fontSize:12,
          fontFamily : 'HONOR Sans CN',
        fontStyle:'normal',
        fontWeight:400,
        }
      },
      axisLine:{
        onZero:true,
        lineStyle:{
          color:'#B4B9C5'
        }
      }
    },
    yAxis: {
      name:yname,
      type: 'value',
      min:0,
      max:max,
      interval:internum,
      axisLabel:{
        show:true,
        textStyle:{
          color: "#6C7385",
          fontSize:12,
          fontFamily : 'HONOR Sans CN',
        fontStyle:'normal',
        fontWeight:400,
        },
        // margin: 10px,
      },
      axisLine:{
        show:false,
        lineStyle:{
          color:'#B4B9C5'
        }
      },
      splitLine: {
        show: true,
        lineStyle:{
          color:"#E0E3EB",
            type:'solid'
        }
      }
    },
    series: [
      {
        data: data,
        type: 'bar',
        showBackground: false,
        barMaxWidth: '100',
        itemStyle:{

            color:'rgba(11, 85, 244, 0.8)',
            label:{
              show:true,
              position:"top",
              fontSize:12,
              color:"rgba(0, 0, 0, 1)",
              fontFamily : 'HONOR Sans CN',
          fontStyle:'normal',
          fontWeight:400,
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

              color:'#91c7ae',
              label:{
                show:true,
                position:"top",
                color:"rgba(0, 0, 0, 1)"
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

              color:'rgb(61,163,216)',
              label:{
                show:true,
                position:"top",
                color:"rgba(0, 0, 0, 1)"
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
function drawconseva1(ID, value, color='#0B55F4', titlename=''){
    var option;

    console.log(value);
    option = {
      series: [
        {
          type: 'gauge',
          center: ['50%', '60%'],
          radius:150,
          min: 0,
          max: 100,
          splitNumber: 5,
          itemStyle: {
            color: color
          },
          progress: {
            show: true,
            width: 15
          },
          pointer: {
            show: false
          },
          axisLine: {
            lineStyle: {
              width: 15
            }
          },
          axisTick: {
            distance: 10,
            splitNumber: 5,
            lineStyle: {
              width: 1,
              color: '#999'
            }
          },
          splitLine: {
            distance: 10,
            length: 10,
            lineStyle: {
              width: 2,
              color: '#999'
            }
          },
          axisLabel: {
            distance: 18,
            color: '#999',
            fontSize: 12
          },
          anchor: {
            show: false
          },
          title: {
            show: false
          },
          detail: {
            valueAnimation: true,
            width: '60%',
            lineHeight: 70,
            borderRadius: 8,
            offsetCenter: [0, '0%'],
            fontSize: 66,
            fontWeight: 'bolder',
            formatter: '{value}',
            color: 'inherit'
          },
          data: [
            {
              value: value
            }
          ]
        },]
    };
    if(titlename != ''){
      option["title"] = {
        // show:true,
        text:titlename,
        textStyle:{
          color:"rgba(0, 0, 0, 1)",
          fontSize:18,
        },
        x:'center',
        y:280,
      }
    }
    setTimeout(function(){
        var myChartcons = echarts.init(document.getElementById(ID));
        window.addEventListener("resize", function () {
            myChartcons.resize()});
        option && myChartcons.setOption(option);
    },500)
  }
  // 热力图
function drawCorelationHeat(ID, heatX, heatY, data, colorList,showflag=true, boundarylist=[-1,1]){
  var option;
  var data1 = data.map(function (item) {
    return [item[1], item[0], item[2] || '-'];
  });
  option = {
    tooltip: {
      position: 'top'
    },
    grid: {
      height: '50%',
      top: '10%'
    },
    xAxis: {
      type: 'category',
      data: heatX,
      splitArea: {
        show: true
      },
      axisLabel:{
        rotate: '90'
      },
    },
    yAxis: {
      type: 'category',
      data: heatY,
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: boundarylist[0],
      max: boundarylist[1],
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      inRange: {
        color: colorList
      },
      bottom: '20px'
    },
    series: [
      {
        name: '系数',
        type: 'heatmap',
        data: data,
        label: {
          show: showflag
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
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

  // 热力图
  function drawRobustHeat(ID, heatX, heatY, data, colorList, showflag=true, boundarylist=[-1,1]){
    var option;
    var data1 = data.map(function (item) {
      return [item[1], item[0], item[2] || '-'];
    });
    option = {
      tooltip: {
        position: 'top'
      },
      grid: {
        height: '50%',
        top: '10%'
      },
      xAxis: {
        type: 'category',
        data: heatX,
        splitArea: {
          show: true
        },
        axisLabel:{
          rotate: '90'
        },
      },
      yAxis: {
        type: 'category',
        data: heatY,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        min: boundarylist[0],
        max: boundarylist[1],
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        inRange: {
          color: colorList
        },
        bottom: '20px'
      },
      series: [
        {
          name: '鲁棒性',
          type: 'heatmap',
          data: data,
          label: {
            show: showflag
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
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

function drawLine(ID, legendlist, datadict, xlable){
  var serieslist=[];
  for(let i in legendlist){
    let temp = {};
    temp["name"] = legendlist[i];
    temp["type"] = "line";
    temp["data"] = datadict[legendlist[i]];
    serieslist.push(temp);
  }
  var option;
  option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: legendlist,
      y:"bottom",
      x:'center',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xlable,
      
    },
    yAxis: {
      type: 'value',
      name:"准确率%"
    },
    series:serieslist
  }
  setTimeout(function(){
    var myChartcons = echarts.init(document.getElementById(ID));
    window.addEventListener("resize", function () {
        myChartcons.resize()});
    option && myChartcons.setOption(option);
  },500)
}

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
function dataFormat (data, name, isReverse) {
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
}

// 生成序列数据
function createSeries (arr, name, showLabel, isReverse) {
let newSeries = [];

const {min, max, minLabel, negative} = dataFormat(arr, name, isReverse);

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
}
function drawIntervalBar(ID, data1, category){
  var isReverse = true;
var showLabel = true;
const name = [
  '置信度', 
];
const data= [];
data.push(data1);
let series = [];
data.forEach((item, i) => {
  series = [...series, ...createSeries(item, name[i], showLabel, isReverse)]
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

let option = {
  title: {
    text: '类别',
  },
  color: ['dodgerblue', 'violet', 'orange'],
  legend: {
    data: name
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
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: xAxis,
  yAxis: yAxis,
  series: series
};
  setTimeout(function(){
    var myChartcons = echarts.init(document.getElementById(ID));
    window.addEventListener("resize", function () {
        myChartcons.resize()});
    option && myChartcons.setOption(option);
  },500)
}
import G6 from '@antv/g6';
function drawPopGraph(ID, data, centerPng, secondPng){
  

  const leafSizeRange = [40, 120];
  const container = document.getElementById(ID);
  
  const width = 960;
  
  const height = 600;
  setTimeout(function(){
    const tooltip = new G6.Tooltip({
      // offsetX and offsetY include the padding of the parent container
      offsetX: 15,
      offsetY: 15,
      // the types of items that allow the tooltip show up
      // 允许出现 tooltip 的 item 类型
      itemTypes: ['node'],
      // custom the tooltip's content
      // 自定义 tooltip 内容
      getContent: (e) => {
        const outDiv = document.createElement('div');
        const model = e.item.getModel();
        var name ="";
        if (!model.isLeaf){
          if (model.id.indexOf("center") !== -1){
            // 中心节点的label
            name = `${model.label}数据集`
          }else if(model.id.indexOf("second") !== -1){
            name = `${model.label}属性占比情况：`;
            for(let temp in model.children){
              name= name+`</br>${model.children[temp].label}占比是：${model.children[temp].population}`;
            }
          }else{
            name = `${model.label}</br>占比是: ${model.population}`;
          }
        }else{
          name = `${model.label}</br>占比是: ${model.population}`;
        }
        
        outDiv.style.width = 'fit-content';
        //outDiv.style.padding = '0px 0px 20px 0px';
        outDiv.innerHTML = `<div style="font-size: 16px;">${name}</div>`;
        return outDiv;
      },
    });
    const graph = new G6.TreeGraph({
      container:ID,
      width,
      height,
      fitView: true,
      fitViewPadding: 20,
      linkCenter: true,
      defaultNode: {
        size: 30,
        style: {
          lineWidth: 0,
          fill: "rgba(57, 117, 245, 1)"
        }
      },
      defaultEdge: {
        color: "rgba(11, 85, 244, 1)",
        style: {
          lineWidth: 0.3,
          shadowBlur: 20,
          shadowColor: "#FF4654"
        }
      },
      nodeStateStyles: {
        hover: {
          stroke: "rgba(57, 117, 245, 1)",
          lineWidth: 10
        }
      },
      modes: {
        default: [
          {
            type: "collapse-expand",
            onChange: function onChange(item, collapsed) {
              const data = item.get("model");
              data.collapsed = collapsed;
              return true;
            }
          },
          "drag-canvas",
          "zoom-canvas"
        ]
      },
      layout: {
        type: "compactBox",
        direction: "LR",
        nodeSep: 20,
        rankSep: 50,
        radial: true,
        getId: function getId(d) {
          return d.id;
        },
        getHeight: () => {
          return 30;
        },
        getWidth: (d) => {
          if(d.id.indexOf("center")!==-1){
            return 300;
          }
          return 20;
        },
        getVGap: () => {
          return 20;
        },
        getHGap: () => {
          return 100;
        },
      },
      plugins: [tooltip],
    });

    graph.node(function (node) {
      return {
        label: node.label,
        labelCfg: {
          position: "center",
        }
      };
    });
    const sizeScale = leafSizeRange[1] - leafSizeRange[0];
    const mapImgScale = 1;
    const imgs = {
      "center": {
        src:centerPng,
        width: 160,
        height: 160
      },
      "second": {
        src:secondPng,
        width: 120,
        height: 120
      }
    };
    G6.Util.traverseTree(data, (item) => {
      if (!item.isLeaf) {
        
        if (item.id.indexOf("center") !== -1) {
          item.img = imgs["center"].src;
          item.type="image"
          item.size = [
            imgs["center"].width * mapImgScale,
            imgs["center"].height * mapImgScale
          ];
          item.labelCfg={
            style:{
              fontSize:20,
              fill:"#FFF"
            }
          };
        } else if(item.id.indexOf("second") !== -1){
          
          item.img = imgs["second"].src;
          item.type="image"
          item.size = [
            imgs["second"].width * mapImgScale,
            imgs["second"].height * mapImgScale
          ];
          item.labelCfg={
            style:{
              fontSize:18,
              fill:"rgba(11, 85, 244, 1)"
            }
          };
        }
        else{
          item.size = 30;
        }
        item.style = {
          shadowColor: "rgba(11, 85, 244, 0.08)",
          shadowBlur: 200
        };
      } else {
        item.size =
          item.population * sizeScale + leafSizeRange[0];
        item.labelCfg={
          style:{
            fontSize:14,
            fill:"#FFF"
          }
        };
      }
    });
    graph.data(data);
    graph.render();
    graph.fitView();
    graph.on('node:mouseenter', (e) => {
      graph.setItemState(e.item, 'hover', true);
    });
    graph.on('node:mouseleave', (e) => {
      graph.setItemState(e.item, "hover", false);
    });
  },500)
}

function drawStackedLine(ID, data,legendInfo, label, name){
  var option;
  option = {
    title: {
      text: name,
      textStyle:{
        fontFamily : 'HONOR Sans CN',
        fontStyle:'normal',
        fontWeight:700,
        fontSize:14,
        color:"#000000"
      },
      x:'center',
      y:'bottom',
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: legendInfo
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      name:'扰动系数',
      type: 'category',
      boundaryGap: false,
      data: label
    },
    yAxis: {
      name:"攻击成功率",
      type: 'value',
      min:0,
      max:1,
    },
    series: [
      {
        name: legendInfo[0],
        type: 'line',
        // stack: 'Total',
        data: data[0]
      },
      {
        name: legendInfo[1],
        type: 'line',
        // stack: 'Total',
        data: data[1]
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
 
// 重要神经元覆盖测试图
function drawImportanceCoverage(ID, data) {
  console.log(data);
  var inc_option;
  var reldraw = data;
  var xdada = Array(reldraw['0'].length).fill('');
  console.log(xdada);

  inc_option = {
      baseOption: {
          textStyle: {
              fontSize: 15,
          },
          timeline: {
              axisType: 'category',
              autoPlay: true,
              playInterval: 1000,
              data: ['0%', '25%', '50%', '75%', '100%'],
              label: {
                  formatter: function (s) {
                      return s;
                  }
              }
          },
          dataZoom: [
              {
                  type: 'inside'
              },
          ],
          tooltip: {},
          legend: {
              left: 'right',
              data: ['重要性']
          },
          calculable: true,
          grid: {
              top: 80,
              bottom: 100,
              tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                      type: 'shadow',
                      label: {
                          show: true,
                          formatter: function (params) {
                              return params.value.replace('\n', '');
                          }
                      }
                  }
              }
          },
          xAxis: [
              {
                  type: 'category',
                  axisLabel: { interval: 0 },
                  data: xdada,
                  splitLine: { show: false },
                  name: '神经元'
              }
          ],
          yAxis: [
              {
                  type: 'value',
                  name: '重要性'
              }
          ],
          series: [{ name: '重要性', type: 'bar' }]
      },
      options: [
          {
              title: { text: '开始运行' },
              series: [{ data: reldraw['0'] }]
          },
          {
              title: { text: '运行25%' },
              series: [{ data: reldraw['1'] }]
          },
          {
              title: { text: '运行50%' },
              series: [{ data: reldraw['2'] }]
          },
          {
              title: { text: '运行75%' },
              series: [{ data: reldraw['3'] }]
          },
          {
              title: { text: '运行结束' },
              series: [{ data: reldraw['4'] }]
          }
      ]
  };
  setTimeout(function(){
    var myChartcons = echarts.init(document.getElementById(ID));
    window.addEventListener("resize", function () {
        myChartcons.resize()});
        inc_option && myChartcons.setOption(inc_option);
    },500)
    
}

function drawAcc_or_loss(ID, data, title){
  console.log(data);
  var option;
  option = {
    tooltip: {
      trigger: 'axis'
    },

    legend: {
      data: title
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: title[0],
        data:data[0],
        type: 'line',
        smooth: true
      },
      {
        name: title[1],
        data:data[1],
        type: 'line',
        smooth: true
      },
    ]
  };
  setTimeout(function(){
    var myChartcons = echarts.init(document.getElementById(ID));
    window.addEventListener("resize", function () {
        myChartcons.resize()});
        option && myChartcons.setOption(option);
    },500)

}

function draw_score_polar(ID, data, title){
  console.log(data);
  let colorList = ['#126BFE', '#5E0BF4', '#FE7E07'];
  let visualMapPiecesData = [];
  for (var i = 0; i < title.length; i++) {
    visualMapPiecesData.push({
      value: data[i],
      label: title[i],
      color: colorList[i]
    });
  }
  debugger;
  var option;
  option = {
    title: [
      {
        // text: '模型安全度量结果'
      }
    ],
    polar: {
      center: ['50%', '50%'],
      radius: [50, '80%']
    },
    angleAxis: {
      max: 0.5,
      startAngle: 90,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false
      },
      splitLine: {
        show: false
      },
      clockwise: false
    },
    radiusAxis: {
      type: 'category',
      data: title,
      z: 100,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    tooltip: {
      show: true,
      trigger: 'item'
    },
    visualMap: {
      top: 40,
      x: 'left',
      orient: 'vertical',
      textStyle: {
        color: '#000'
      },
      pieces: visualMapPiecesData,
      outOfRange: {
        color: '#999'
      }
    },
    series: {
      type: 'bar',
      data: data,
      coordinateSystem: 'polar'
      // label: {
      //   show: true,
      //   position: 'left',
      //   formatter: '{b}: {c}'
      // },
      // itemStyle: {
      //   normal: {
      //     // 定制显示（按顺序）
      //     color: function (params) {
      //       return colorList[params.dataIndex]
      //     }
      //         }}
    }
  };
  setTimeout(function(){
    var myChartcons = echarts.init(document.getElementById(ID));
    window.addEventListener("resize", function () {
        myChartcons.resize()});
        option && myChartcons.setOption(option);
    },500)

}




function exportResult(ID){
  // debugger
  if (confirm("您确认下载该pdf文件吗？") ){
      // 输出pdf尺寸为download_page大小
      var element = document.getElementById(ID);
      // var element = this.$refs.report_pdf;
      const opt = {
          margin:[10, 20, 10, 20],
          filename:this.tid+'.pdf',
          image:{type:'jpeg',quality:1},
          html2canvas:{scale:5},
          jsPDF:{unit:'mm',format:'a4', orientation:'portrait'}
      };

      html2pdf().from(element).set(opt).save();

  }
}

function drawLineBar(ID, detect_rate, label, no_defense_accuracy=[], datalegend=['防御前的模型分类精度', '防御后的模型分类精度'], min_max=[0,1,0.2]){
  const colors = ['#5470C6', '#91CC75'];
  const option = {
    color: colors,
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        }
    },
    grid:{
      x:"8%",
      y:"10%",
      x2:"10%",
      y2:"15%",
    },
    legend: {
      textStyle:{
        color: "#3E4453",
        fontSize:12,
        fontFamily : 'HONOR Sans CN',
        fontStyle:'normal',
        fontWeight:400,
      },
      right: "10%",
      data: datalegend
    },
    xAxis: [
        {
            name: '算法名称',
            // nameLocation: 'center',
            nameGap: 40,
            textStyle:{
              color: "#3E4453;",
              fontSize:12,
              fontFamily : 'HONOR Sans CN',
              fontStyle:'normal',
              fontWeight:400,
            },
            type: 'category',
            axisTick: {
                alignWithLabel: true
            },
            axisLabel: {
                rotate: 20,
                textStyle:{
                  color: "#3E4453;",
                  fontSize:12,
                  fontFamily : 'HONOR Sans CN',
                  fontStyle:'normal',
                  fontWeight:400,
                },
            },
            data: label,

        }
    ],
    yAxis: {
        name: '模型分类精度',
        // nameLocation: 'center',
        nameGap: 40,
        axisLine: { show:false,lineStyle: { color: '#B4B9C5' } },
        splitLine: { lineStyle: { color: '#E0E3EB' ,type:'solid'} },
        type: 'value',
        axisLabel: {
            
            textStyle:{
              color: "#6C7385",
              fontSize:12,
              fontFamily : 'HONOR Sans CN',
            fontStyle:'normal',
            fontWeight:400,
            }
        },
        min: min_max[0],
        max: min_max[1],
        interval: min_max[2],
    },
    series: [
        {
            data: detect_rate,
            name: datalegend[1],
            type: 'bar',
            animationDuration: 3000,
            itemStyle: {
                normal: {
                    color: '#5470C6'
                },
                emphasis: {
                    color: '#37D2D4'
                }
            },
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
            }
        },
        {
            data: no_defense_accuracy,
            name: datalegend[0],
            type: 'line',
            animationDuration: 3000,
            itemStyle: {
                normal: {
                    color: 'red'
                },
                emphasis: {
                    color: '#37D2D4'
                }
            },
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
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

function drawside(ID, data){
  // debugger
  var _x = [];
  for (var i = 0; i < data.len; i++) {
      _x.push(i);
  }
  var _y = data["50-all-1"];
  var option;
  option = {
      tooltip: { trigger: 'axis', axisPointer: { lineStyle: { color: '#ffffff' } } },
      grid: {
          top: 30
      },
      xAxis: {
          type: 'category',
          data: _x,
          name: "时间",
          axisLine: { lineStyle: { color: '#57617B' } },
          splitLine: { lineStyle: { color: '#57617B' } },
          axisLabel: {
              fontSize: 12,
              color: "#000000",
              fontWeight: "normal",
          }
      },
      yAxis: {
          type: 'value',
          name: "mV",
          axisLine: { lineStyle: { color: '#000' } },
          splitLine: { lineStyle: { color: '#57617B' } },
          axisLabel: {
              fontSize: 10,
              color: "#000000",
              fontWeight: "normal",
          }
      },
      series: [

          {
              name: "功耗",
              data: _y,
              type: 'line',
              animationDuration: 2500,
              lineStyle: {
                  width: 0.2
              },
              symbolSize: 1,
              itemStyle: { normal: { color: "#0B55F4" } }
          },
      ]
  };
  setTimeout(function(){
    var myChartcons = echarts.init(document.getElementById(ID));
    window.addEventListener("resize", function () {
        myChartcons.resize()});
      option && myChartcons.setOption(option);
  },500)
}

function drawTtest(ID, xdata, ydata) {
  debugger;
  var option;
  option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      name:'曲线点数',
      data: xdata
    },
    yAxis: {
      max: Math.max(5, Math.max.apply(Math, ydata)),
      min:-5,
      type: 'value',
      name:'检测阈值'
    },
    series: [
      {
        data: ydata,
        type: 'line',
        markLine: {
          data: [{
            name:'阈值',
            yAxis: 4.5
            // type: "average"
          },
          {
            name:'阈值',
            yAxis: -4.5
            // type: "average"
          },
        ],
          silent: true
        }
        // smooth: true
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


// function drawALLPA(ID, xdata, ydata, fdata, tdata) {
function drawALLPA(ID, legend, x_data, serieslist) {
  // debugger
  // console.log(legend);
  // console.log(x_data);
  // console.log(serieslist);
  var option;
  option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: legend
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: x_data,
    },
    yAxis: {
      type: 'value',
      name:"相关性系数"
    },
    series: serieslist
  }

  setTimeout(function(){
    var myChartcons = echarts.init(document.getElementById(ID));
    window.addEventListener("resize", function () {
        myChartcons.resize()});
    option && myChartcons.setOption(option);
  },500)
}

function drawFormalLine(ID, legend, x_data, serieslist, yname) {
  // debugger
  // console.log(legend);
  // console.log(x_data);
  // console.log(serieslist);
  var option;
  option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: legend
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: x_data,
    },
    yAxis: {
      type: 'value',
      name: yname,
      max:100
    },
    series: serieslist
  }

  setTimeout(function(){
    var myChartcons = echarts.init(document.getElementById(ID));
    window.addEventListener("resize", function () {
        myChartcons.resize()});
    option && myChartcons.setOption(option);
  },500)
}

function initGraph1(ID, res) {
  debugger;
  console.log(res);
  // data.data.robust_test_result.normal_method.toFixed(2)
  var data = res.data.line_and_area;
  var option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['鲁棒区域（鲁棒训练）', '非鲁棒区域（鲁棒训练）', '鲁棒边界（非鲁棒训练）', '非鲁棒边界（非鲁棒训练）']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'value',
        boundaryGap: false,
        min:0,
        max:50,
        interval:10
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '鲁棒区域（鲁棒训练）',
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 2
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          origin:'start'
        },
        emphasis: {
          focus: 'series'
        },
        data: data.robust_line
      },
      {
        name: '非鲁棒区域（鲁棒训练）',
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 2
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          origin:'end'
        },
        emphasis: {
          focus: 'series'
        },
        data: data.nonrobust_line
      },
      {
        name: '鲁棒边界（非鲁棒训练）',
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 2,
          type:'dashed'
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          origin:'start'
        },
        emphasis: {
          focus: 'series'
        },
        data: data.std_train_line1
      },
      {
        name: '非鲁棒边界（非鲁棒训练）',
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 2,
          type:'dashed'
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          origin:'end'
        },
        emphasis: {
          focus: 'series'
        },
        data: data.std_train_line2
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

function initGraph2(ID, data) {
  debugger;
  var option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    xAxis: {
      type: 'category',
      data: ['非鲁棒训练', '鲁棒训练'],
      name: '训练方式',
    },
    yAxis: {
      type: 'value',
      name: '扰动节点比例',
    },
    series: [
      {
        data: [
        {
          value:data.data.robust_test_result.normal_method.toFixed(2),
          itemStyle: {
              color: '#a90000'
            }
        }, {
          value:data.data.robust_test_result.robust_method.toFixed(2),
        }],
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
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

function DrawRobustBar(ID, legend, xAxis, data1, data2) {
  debugger;
  var option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    legend: {
      data: legend
    },
    xAxis: [
      {
        type: 'category',
        data: xAxis,
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          formatter: '{value} %'
        }
      },
    ],
    series: [
      {
        name: 'Normal Training',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return value + ' %';
          }
        },
        data: data1
      },
      {
        name: 'Feature Scatter',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return value + ' %';
          }
        },
        data: data2
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

export {
  drawclass1pro,
  drawbar,
  drawbarimproved,
  drawconseva1,
  drawCorelationHeat,
  drawRobustHeat,
  drawPopGraph,
  drawLine,
  drawIntervalBar,
  drawStackedLine,
  drawLineBar,
  exportResult, drawImportanceCoverage,
  drawAcc_or_loss,
  draw_score_polar, 
  drawside, drawTtest, drawALLPA,
  drawbarhigh,drawFormalLine,
  initGraph1,initGraph2,
  DrawRobustBar,
}