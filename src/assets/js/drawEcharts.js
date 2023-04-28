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
function drawbar(ID, data, label,name){
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
        y:"5%",
        x2:"10%",
        y2:"15%",
      },
      xAxis: {
        type: 'category',
        data: label,
        axisLabel:{
          show:true,
          // rotate: '45',
          textStyle:{
            color: "#3E4453;",
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
        type: 'value',
        min:0,
        max:1,
        interval:0.2,
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
            normal:{
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
          center: ['50%', '60%'],
          radius:150,
          min: 0,
          max: 1,
          splitNumber: 5,
          itemStyle: {
            color: '#0B55F4'
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
  // 热力图
function drawCorelationHeat(ID, heatX, data, colorList){
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
      data: heatX,
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: -1,
      max: 1,
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
          show: true
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

import G6 from '@antv/g6';
function drawPopGraph(ID, data, centerPng, secondPng){
  

  const leafSizeRange = [40, 120];
  const container = document.getElementById(ID);
  
  const width = 960;
  
  const height = 600;
  setTimeout(function(){
    const tooltip = new G6.Tooltip({
      // offsetX and offsetY include the padding of the parent container
      offsetX: 10,
      offsetY: 10,
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
        outDiv.innerHTML = `<div>${name}</div>`;
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

export {
  drawclass1pro,
  drawbar,
  drawbarimproved,
  drawconseva1,
  drawconseva,
  drawCorelationHeat,
  drawPopGraph,
}