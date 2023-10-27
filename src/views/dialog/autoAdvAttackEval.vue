<template>
  <div class="dialog">
    <!--外层的遮罩 点击事件用来关闭弹窗，isShow控制弹窗显示 隐藏的props-->
    <div class="dialog-cover back"  v-if="isShow" @click="closeMyself"></div>
    <!-- transition 这里可以加一些简单的动画效果 -->
    <transition name="drop">
      <!--style 通过props 控制内容的样式 -->
      <div class="dialog-content" v-if="isShow" @click.stop="_stopPropagation($event)">
        <div class="dialog_head back">
            <!--弹窗头部 title-->
            <div class="close_button">
                <a-icon type="close" @click="closeMyself" style="font-size: 20px;color:#6C7385;" class="closebutton"/>
            </div>
            <slot name="header">
              <div class="dialog-title"><img src="../../assets/img/modelEvaIcon.png" style="width: 50px; height: 50px;">模型对抗性测试</div>
            </slot>
        </div>
        <div class="dialog_main" id="pdfDom" >
        <!--弹窗的内容-->
          <slot name="main" v-if="['graph', 'graph_rule'].indexOf(postData.AutoMethod)>-1">
            <!-- 攻击信息 -->
            <div v-if="Object.keys(postData).length > 0" style="background: var(--gray-7, #F2F4F9);;width: 100%;padding: 24px;">
              <a-row >
                <a-col :span="3">
                  <div class="grid-content-name" style="color:#6C7385">自动化攻防方案:</div>
                </a-col>
                <a-col :span="6">
                  <div class="grid-content-value">{{auto_method[postData.AutoMethod]}}</div>
                </a-col>
                <a-col :span="2">
                  <div class="grid-content-name" style="color:#6C7385">模型:</div>
                </a-col>
                <a-col :span="3">
                  <div class="grid-content-value">{{postData.ModelParam.name}}</div>
                </a-col>
                <a-col :span="2">
                  <div class="grid-content-name" style="color:#6C7385">数据集:</div>
                </a-col>
                <a-col :span="3">
                  <div class="grid-content-value">{{postData.DatasetParam.name}}</div>
                </a-col>
                <a-col :span="2">
                  <div class="grid-content-name" style="color:#6C7385">数据类型:</div>
                </a-col>
                <a-col :span="3">
                  <div class="grid-content-value">{{postData.data_type}}</div>
                </a-col>
              </a-row>
              <a-row >
                
                <a-col :span="2">
                  <div class="grid-content-name" style="color:#6C7385">攻击方式:</div>
                </a-col>
                <a-col :span="5">
                  <div class="grid-content-value">{{postData.attack_mode}}</div>
                </a-col>
                <a-col :span="2">
                  <div class="grid-content-name" style="color:#6C7385">攻击类型:</div>
                </a-col>
                <a-col :span="5">
                  <div class="grid-content-value">{{postData.attack_type}}</div>
                </a-col>
                <a-col :span="2">
                  <div class="grid-content-name" style="color:#6C7385">防御算法:</div>
                </a-col>
                <a-col :span="5">
                  <div class="grid-content-value">{{postData.defend_algorithm}}</div>
                </a-col>
              </a-row>
            </div>
            <!-- 总得分 -->
            <div class='graph_result'>
              <div class='bar_div'>
                <div class="result-title">机器学习攻防技战术知识图谱</div>
                <div class='graph_content'>
                  <div id='graph_echart'></div>
                  <div class="conclusion">
                    <p class="result_text">如上图所示是由各种攻击算法与防御算法构建的攻防技知识图谱，基于此可构建更科学的自动化测试方案。</p>
                  </div>
                </div>
              </div>
              <div class='bar_div'>
                <div class="result-title">自动化测试方案及测试结果</div>
                <div class='graph_content'>
                  <div id='test_echart'></div>
                  <div class="conclusion">
                    <p class="result_text">本次测试制定的测试方案为{{defenseShow(result['Auto_Attack'][postData.AutoMethod]["recom_algorithm"])}}，
                      部分测试结果如上所示，其中{{res.label}}攻击效果最佳，受攻击后的模型准确率为{{res.min_acc}}。</p>
                  </div>
                </div>
              </div>
            </div>
            <!-- 评估详情 -->
            <a-button @click="getPdf()" style="width:160px;height:40px;margin-bottom:30px;margin-top:10px;
            font-size:18px;color:white;background-color:rgb(46, 56, 245);border-radius:8px;">
              <a-icon type="upload" />导出报告内容
            </a-button>
          </slot>
          <slot name="main" v-if="['rule', 'flow_rule', 'flow'].indexOf(postData.AutoMethod)>-1">
            <!-- 攻击信息 -->
            <div v-if="Object.keys(postData).length > 0" style="background: var(--gray-7, #F2F4F9);;width: 100%;padding: 24px;">
              <a-row >
                <a-col :span="3">
                  <div class="grid-content-name" style="color:#6C7385">自动化攻防方案:</div>
                </a-col>
                <a-col :span="6">
                  <div class="grid-content-value">{{auto_method[postData.AutoMethod]}}</div>
                </a-col>
                <a-col :span="2">
                  <div class="grid-content-name" style="color:#6C7385">模型:</div>
                </a-col>
                <a-col :span="3">
                  <div class="grid-content-value">{{postData.ModelParam.name}}</div>
                </a-col>
                <a-col :span="2">
                  <div class="grid-content-name" style="color:#6C7385">数据集:</div>
                </a-col>
                <a-col :span="3">
                  <div class="grid-content-value">{{postData.DatasetParam.name}}</div>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="2">
                  <div class="grid-content-name" style="color:#6C7385">攻击算法:</div>
                </a-col>
                <a-col :span="22">
                  <div class="grid-content-value" style="text-align:left">{{defenseShow(postData.AdvMethods)}}</div>
                </a-col>
              </a-row>
            </div>
            <!-- 总得分 -->
            <div class="result-title">模型鲁棒性得分</div>
            <div style="position:relative;text-align: center;">
              <div style="width: 100%; height: 300px; position: absolute; text-align: center; line-height: 230px;
                font-size: 80px; color: white; font-weight: bold;
                "> {{res.score}} </div>
              <div style="width: 100%; height: 300px; position: absolute; text-align: center; line-height: 330px;
                font-size: 20px; color: white;
                "> {{res.Eva}}  </div>
              <img style="width: 300px; height: 300px;" src="../../assets/img/score.png">
              <div class="conclusion"><p class="result_text ">{{res.score_des}}</p></div>
            </div>
            
            <!-- 评估详情 -->
            <div class='bar_div' >
              <div class="result-title">对抗性测试方案生成及自动化对抗测试评估</div>
              <div class='graph_content'>
                <div id='test_echart'></div>
                <div class="conclusion">
                  <p class="result_text">本次测试制定的测试方案为{{defenseShow(postData.AdvMethods)}}，
                    部分测试结果如上所示，其中{{res.label}}攻击效果最佳，受攻击后的模型准确率为{{res.min_acc}}。</p>
                </div>
              </div>
            </div>
            <a-button @click="getPdf()" style="width:160px;height:40px;margin-bottom:30px;margin-top:10px;
            font-size:18px;color:white;background-color:rgb(46, 56, 245);border-radius:8px;">
              <a-icon type="upload" />导出报告内容
            </a-button>
          </slot>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import * as echarts from "echarts";
import node from "../../../static/graph/node.json";
import relation from "../../../static/graph/relation.json";
export default {
  name:"autoAdvAttackEval",
  components: {
  },
  props: {
      isShow: {
      //弹窗组件是否显示 默认不显示
      type: Boolean,
      default: false,
      required:true, //必须
      },
      result:{},
      postData:{
      }
      },
      
  data() {
    return {
      htmlTitle:"自动化对抗攻击评估报告",
      echart_init: false,
      res:{},
      auto_method:{
        'graph':"基于知识图谱的AI模型自动化攻防",
        'graph_rule':"融合规则驱动的知识图谱自动化攻防",
        'flow':"基于流水线的AI模型自动化攻防",
        'rule':"规则驱动的AI模型自动化攻防",
        'flow_rule':"融合规则驱动的流水线自动化攻防"
      }
    }
  },
  watch:{
    result(newValue, oldValue){
      if ("Auto_Attack" in newValue){
        this.updated()
      }
    }
    
  },
  // props:["is-show","top-distance"],
  methods: {
    closeMyself() {
      this.$emit("on-close");
      //如果需要传参的话，可以在"on-close"后面再加参数，然后在父组件的函数里接收就可以了。
    },
    _stopPropagation(ev){
      var _this = this;
      ev.stopPropagation();
    },
    // 防御方法参数显示-
    defenseShow(method=[]){
      // let param = JSON.parse(method);
      return method.join('、');
    },
    initGraph2() {
      console.log(node);
      console.log(relation);
      const edges = relation.map(item => {
        item.target = item.dest
        return item
      });
      const data = node
      console.log(node, edges)
      const categories = Array.from(new Set(node.map(item => item.method_type))).map(item => {
        return {
          name: item
        }
      })
      const cateData = data.map(item => {
        item.category = categories.find(it => it.name === item.method_type)
        return item
      })
      const option = {
        color: 'red',
        tooltip: {
          formatter(item) {
            console.log(item)
            if (item.dataType === 'node') {
              return `
              <div>
                <h1>
                  攻击算法：${item.name}
                </h1>
                <p>
                  算法描述：${item.data.desc}
                </p>
                <p >
                  来源论文：${item.data.paper}
                </p>
                <p>
                <p>
                  方法类型：${item.data.method_type}
                </p>
              </div>
            `
            } else {
              return `
              <div>
                <h1>${item.data.source} > ${item.data.target}</h1>
                <h1>关系描述：${item.data.desc}</h1>
              </div>
            `
            }
          },
        },
        series: [
        {
          // categories,
          type: 'graph',
          layout: 'force',
          animation: true,
          data: cateData,
          roam: true,
          zoom: 1.5,
          draggable: true,
          edgeSymbol: ['circle', 'arrow'],
          label: {
            show: true,
            position: 'right',
            formatter: '{b}'
          },
          emphasis: {
            focus: 'adjacency',
            itemStyle: {
              color: 'rgb(73,209,198)'
            }
          },
          force: {
            // initLayout: 'circular'
            // gravity: 0
            repulsion: 100,
            edgeLength: 5
          },
          edges: edges
        }]
      };
      setTimeout(function(){let myChart = echarts.init(document.getElementById("graph_echart"));
          option && myChart.setOption(option);
        },500)
    },
    initGraph3(data) {
      const acc = data
      const option = {
        xAxis: {
          type: 'category',
          data: Object.keys(acc),
          axisLabel: {
            color: "#000",
            interval:0,
          },
          name: '算法名称',
          nameLocation: 'center',
          nameGap: 40,
          nameTextStyle: {
            fontSize: 20,
            color: 'black'
          },
        },
        tooltip: { trigger: 'axis', axisPointer: { lineStyle: { color: '#000' } } },

        yAxis: {
          name: '准确率',
          nameLocation: 'center',
          nameGap: 40,
          nameTextStyle: {
            fontSize: 20,
            color: 'black'
          },
          axisLine: { lineStyle: { color: '#000' } },
          splitLine: { lineStyle: { color: '#57617B' } },
          type: 'value',
          axisLabel: {
            formatter: '{value} %',
            fontSize: 15,
            color: "#000",
            textBorderColor: "var(--gray-3, #6C7385);",
            textBorderWidth: 0.5,
            textBorderType: "solid"
          }
        },
        series: [
        {
          data: Object.keys(acc).map(item => {
            if (item === 'ori') {
              return {
                value: acc[item] ,
                itemStyle: {
                  color: '#a90000'
                }
              }
            } else {
              return {
                value: acc[item] ,
                itemStyle: {
                  color: 'rgba(11, 85, 244, 0.8)'
                }
              }
            }
          }),
          type: 'bar',
          barWidth: 36
        }
      ]
      };
      setTimeout(function(){let myChart = echarts.init(document.getElementById("test_echart"));
        option && myChart.setOption(option);
      },500)
    },
    updated(){
      //code
      this.res = {}
      this.res.label = '';
      this.res.min_acc = 100
      this.res["Eva"] = ''
      var data={}
      if(this.postData.AutoMethod == "graph"){
        this.initGraph2()
        for(let temp in this.result.Auto_Attack[this.postData.AutoMethod]){
          if (temp != 'recom_algorithm' ){
            data[temp] = this.result.Auto_Attack[this.postData.AutoMethod][temp]["after_acc"]
            data['ori'] = this.result.Auto_Attack[this.postData.AutoMethod][temp]["before_acc"]
          }
        }
        if( data != {}){
          this.res["data"]=data
          this.initGraph3(data)
        }
      }else if(this.postData.AutoMethod == "graph_rule"){
        this.initGraph2()
        data = this.result.Auto_Attack[this.postData.AutoMethod]['acc']
        this.initGraph3(data)
      }
      else if(["flow", "rule", "flow_rule"].indexOf(this.postData.AutoMethod) > -1 ){
        data = this.result.Auto_Attack[this.postData.AutoMethod]['attack_results']
        data['ori'] = this.result.Auto_Attack[this.postData.AutoMethod]['ori_acc']
        this.initGraph3(data)
      }
      for(let temp in data){
        if (temp != "ori"){
          if (this.res.min_acc > data[temp]){
            this.res.min_acc = data[temp]
            this.res.label = temp
          }
        }
        
      }
      this.res['score'] = parseInt(this.res.min_acc)
      if (this.res.min_acc < 30){
        this.res['score'] += 20
      }
      if(this.res.min_acc >= 80 ){
        this.res["Eva"] = "优秀"
      }else if (this.res.min_acc <80 && this.res.min_acc >=60 ){
        this.res["Eva"] = "良好"
      }else{
        this.res["Eva"] = "差"
      }
      let strmehtod = this.defenseShow(this.postData.AdvMethods)
      this.res["score_des"] = `${this.postData.ModelParam.name}模型鲁棒性得分为${this.res.score}，是一个较${this.res.Eva}的模型，本次对抗攻击方法有${strmehtod}，其中${this.res.label}的攻击效果最佳`
    }
  }
}

</script>

<style scoped>
/* 最外层 设置position定位 */
.dialog {
position: relative;
color: #e7e5e6;
font-size: 16px;
}
/* 遮罩 设置背景层，z-index值要足够大确保能覆盖，高度 宽度设置满 做到全屏遮罩 */
.dialog-cover {
background: rgba(68, 68, 68, 0.8);
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
}
.close_button{
  height: 40px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  float: right;
}
/* 内容层 z-index要比遮罩大，否则会被遮盖， */
.dialog-content{
position: fixed;
top: 10px;
width: 1080px;
left: 420px;
bottom: 5px;
/* 移动端使用felx布局 */
display: flex;
flex-direction: column;
justify-content: start;
align-items: center;
z-index: 2001;
color: rgb(0, 0, 0);
overflow: scroll;
background: #FFFFFF;
box-shadow: 0px 8px 20px rgba(44, 51, 67, 0.06);
border-radius: 8px;
}
/* 标题框样式 */
.dialog_head{
  width: 1080px;
  left: 0px;
  top: 1px;
  height: 88px;
  padding: 24px 18px 24px 24px;
  border-bottom: 1px solid #E0E3EB;
}

.dialog_main{
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  /* gap: 60px; */

  position: absolute;
  width: 1080px;
  /* height: 8265px; */
  left: 0px;
  top: 89px;

}
.foot_close{
  background: #5196FF;
  border-radius: 4px;
  width: 143px;
  height: 50px;
}
.dialog-title{
  display: inline;
  margin-top: 38px;
  width: 279px;
  height: 36px;
  font-family: 'HONOR Sans CN';
  font-size: 24px;
  color: #333333;
  letter-spacing: 0;
  line-height: 48px;
  font-weight: 600;
}
.graph_result{
  display: flex;
  width: 1080px;
  flex-direction: column;
  align-items: center;
  gap: 60px;
}
.bar_style{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}
.graph_content{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}
#graph_echart{
  width: 960px;
  height: 465px;
  border-radius: 4px;
  background: #FFF;
}
#test_echart{
  width: 960px;
  height: 432px;
  border-radius: 4px;
  background: #FFF;
}
.result-title {
  margin-top: 30px;
  font-family: 'HONOR Sans CN';
  font-size: 28px;
  color: #000;
  letter-spacing: 0;
  font-weight: 700;
  text-align: center;
}
.describe {
  font-family: 'HONOR Sans CN';
  font-size: 16px;
  color: #000000;
  letter-spacing: 0;
  text-align: center;
}
.result-subtitle {
  margin-top: 20px;
  color: var(--light-fontgray-4-title, rgba(0, 0, 0, 0.90));
  text-align: center;
  font-family: HONOR Sans CN;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 28px;
}

</style>