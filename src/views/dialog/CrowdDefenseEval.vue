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
                    <div class="dialog-title"><img src="../../assets/img/crowdDefenseIcon.png" style="width: 50px; height: 50px;">模型群智化防御</div>
                  </slot>
              </div>
              <div class="dialog_main" id="pdfDom" >
              <!--弹窗的内容-->
                  <slot name="main">
                    <!-- 攻击信息 -->
                    <!-- <div v-if="Object.keys(postData).length > 0" style="background: var(--gray-7, #F2F4F9);;width: 100%;padding: 24px;"> -->
                    <div  style="background: var(--gray-7, #F2F4F9);;width: 100%;padding: 24px;">
                      <a-row >
                        <a-col :span="2">
                          <div class="grid-content-name" style="color:#6C7385">数据集:</div>
        
                        </a-col>
                        <a-col :span="5">
                          <div class="grid-content-value">{{postData.DatasetParam.name}}</div>

                        </a-col>
                        <a-col :span="2">
                          <div class="grid-content-name" style="color:#6C7385">模型:</div>

                        </a-col>
                        <a-col :span="5">
                          <div class="grid-content-value">{{postData.ModelParam.name}}</div>
 
                        </a-col>
                        <a-col :span="2">
                          <div class="grid-content-name" style="color:#6C7385">攻击方法:</div>
     
                        </a-col>
                        <a-col :span="8">
                          <div class="grid-content-value">{{defenseShow(postData.AdvMethods)}}</div>
                        </a-col>
                        <a-col :span="2">
                          <div class="grid-content-name" style="color:#6C7385">群智化防御方法:</div>
     
                        </a-col>
                        <a-col :span="8">
                          <div class="grid-content-value">{{ defenseShow(postData.DefMethod) }}</div>
                        </a-col>
                      </a-row>
                    </div>
                    <!-- 样本置信度分布对比 -->
                    <div>
                      <div  v-for="(temp,id) in postData.AdvMethods">
                        <div class="result-title">鲁棒训练前后样本置信度分布对比：{{ temp }}</div>
                        <div style="display: flex;">
                          <div :id="'results_scatter_bef_'+temp" class="echart" style="width: 490px; height: 400px;"></div>
                          <div :id="'results_scatter_aft_'+temp" class="echart" style="width: 490px; height: 400px;"></div>
                        </div>
                      </div>
                    <!-- 原始准确率 & 受攻击后的准确率 -->
                      <div class="result-title">受攻击前后的准确率变化</div>
                      <div id="acc_ori" class="echart" style="width: 1000px; height: 400px;"></div>
                    <!-- 不同攻击方法的攻击成功率 -->
                      <div class="result-title">不同攻击方法的攻击成功率对比（原始模型）</div>
                      <div id="asr_ori" class="echart" style="width: 1000px; height: 400px;"></div>
                      <!-- <div class="conclusion">
                        <p class="result_text ">结论1</p> -->
                        <!-- <p class="result_text ">本次测试受{{sub_acc_method}}攻击后的准确率下降最大，下降幅度为{{max_sub_acc}}；{{method}}攻击算法的攻击成功率最高，最高为{{max_asr}}</p> -->
                      <!-- </div> -->
                    </div>
                    <!-- 对抗训练后的攻击成功率 -->
                    <div>
                      <div class="result-title">模型加固后的模攻击成功率对比</div>
                      <div id="robust_asr" class="echart" style="width: 1000px; height: 400px;"></div>
                      <!-- <div class="conclusion">
                        <p class="result_text ">结论2</p> -->
                        <!-- <p class="result_text ">本次测试{{method}}攻击算法的攻击成功率最高，最高为{{max_asr}}</p> -->
                      <!-- </div> -->
                    </div>
                    <!-- 对抗训练后的准确率 -->
                    <div>
                      <div class="result-title">模型加固后的模型防御成功率对比</div>
                      <div id="robust_acc" class="echart" style="width: 1000px; height: 400px;"></div>
                      <!-- <div class="conclusion">
                        <p class="result_text ">结论2</p> -->
                        <!-- <p class="result_text ">本次测试{{method}}攻击算法的攻击成功率最高，最高为{{max_asr}}</p> -->
                      <!-- </div> -->
                    </div>
                    <!--  -->
                    <!-- Nash博弈结果 -->
                    <div > 
                      <div class="result-title">准确率收益直方图</div>
                      <div id="acc_Chart" class="echart" style="width: 1000px; height: 400px;"></div>
                      <!-- <div class="conclusion">
                        <p class="result_text ">从结果中可以看到，在测试的几种攻击中，其中攻击效果最佳的为{{res.maxmethod}}，攻击成功率为{{res.maxasr}},{{ res.mintimemethod }}所花费的时间最少，而{{ res.maxtimemethod }}类攻击所花费的时间最多，但是其达到的准确率也较高</p>
                      </div> -->
                      <div class="result-title">鲁棒性收益矩阵</div>
                      <div id="rob_Chart" class="echart" style="width: 1000px; height: 400px;"></div>
                      <!-- <div class="conclusion">
                        <p class="result_text ">从结果中可以看到，在测试的几种攻击中，其中攻击效果最佳的为{{res.maxmethod}}，攻击成功率为{{res.maxasr}},{{ res.mintimemethod }}所花费的时间最少，而{{ res.maxtimemethod }}类攻击所花费的时间最多，但是其达到的准确率也较高</p>
                      </div> -->
                      <div class="result-title">博弈策略收益曲线</div>
                      <div id="bal_Chart" class="echart" style="width: 1000px; height: 400px;"></div>
                      <div class="conclusion">
                        <p class="result_text ">如上分别是不同防御方法下的准确率和鲁棒性以及不同权重p下的收益曲线</p>
                      </div>
                    </div>
                    <!-- 评估详情 -->
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
import PictureTable from "../../components/pictureTable.vue";
import { drawbar, drawLineBar, drawRobustHeat} from "../../assets/js/drawEcharts.js"
export default {
  name:"resultDialog",
  components: {
    PictureTable: PictureTable
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

      },
      //下面这些属性会绑定到div上面 详情参照上面的html结构
      // 如： :style="{top:topDistance+'%',width:widNum+'%'}"
      widNum:{
      //内容宽度
      type: Number,
      default:50
      },
      leftSite:{
      // 左定位
      type: Number,
      default:25.2
      },
      topDistance: {
      //top上边距
      type: Number,
      default:10
      },
      pdt:{
      //上padding
      type: Number,
      default:22
      },
      pdb:{
      //下padding
      type: Number,
      default:47
      }
      },
      
  data() {
    return {
      htmlTitle:"群智化防御报告",
      res:{},
      postData:{
        // 静态结果
        "DatasetParam": {"name":"MNIST"},
        "ModelParam": {"name":"ResNet34"},
      },
    }
  },
  watch:{
    result(newValue, oldValue){
      if ("Defense_Ensemble" in newValue){
        this.drawrobust(newValue)
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
      drawrobust(res={}){
        
        // 鲁棒性直方图
        try{
          this.draw_robust_echart("robust_acc",res.Defense_Ensemble);
        }catch(err){}
        //鲁棒训练后样本置信度分布图
        try{
          var method = [];
          let acclist = []//受攻击后的准确率
          let acc_ori = []//原始准确率
          let asr_ori_list = [] //不同攻击方法的攻击成功率
          for(let temp in res.Defense_Ensemble.AdvAttack.atk_acc){
            method.push(temp);
            var sctDataAdv_tmp = [];
            var sctDataAdv2_tmp = [];
            var sctDataBen_tmp = [];
            var sctDataBen2_tmp = [];
            acclist.push(res.Defense_Ensemble.AdvAttack.atk_acc[temp]) 
            acc_ori.push(res.Defense_Ensemble.AdvAttack.test_acc)
            asr_ori_list.push(res.Defense_Ensemble.AdvAttack.atk_asr[temp])
            for (let i = 0; i < 32; i++) {
              sctDataBen_tmp.push(res.Defense_Ensemble.AdvAttack[temp].normal_scatter[i]);
              sctDataBen2_tmp.push(res.Defense_Ensemble.AdvAttack[temp].robust_scatter[i]);
            }
            for (let i = 32; i < 64; i++) {
                sctDataAdv_tmp.push(res.Defense_Ensemble.AdvAttack[temp].normal_scatter[i]);
                sctDataAdv2_tmp.push(res.Defense_Ensemble.AdvAttack[temp].robust_scatter[i]);
            }
            this.draw_scatter("results_scatter_bef_"+temp, sctDataBen_tmp,sctDataAdv_tmp,"鲁棒训练前样本置信度分布图");
            this.draw_scatter("results_scatter_aft_"+temp, sctDataBen2_tmp,sctDataAdv2_tmp,"鲁棒训练后样本置信度分布图");
          };
          
          drawLineBar("acc_ori", acclist, method, acc_ori,["受攻击前的分类精度","受攻击后的分类精度"],[1,100,10])
          drawbar("asr_ori",asr_ori_list,method,'',"攻击方法","攻击成功率",[0,100,10])
        }catch(err){}
        // 准确率收益直方图
        if (res.Defense_Ensemble.game){
          let game_data = res.Defense_Ensemble.game.nash
          let gameacc = game_data.normal_acc[0]
          drawbar("acc_Chart", gameacc, game_data.def_methods,'','防御方法' ,'准确率')
          var NMIColorList=["rgba(206, 221, 253, 1)", "rgba(157, 187, 251, 1)", "rgba(60, 119, 246, 1)", "rgba(11, 85, 244, 1)", "rgba(7, 51, 146, 1)"];
          let game_robust_data = []
          for( let i =0 ; i <  game_data.atk_methods.length; i++){
            for(let j = 0;j<game_data.def_methods.length;j++){
              game_robust_data.push([game_data.def_methods[j], game_data.atk_methods[i], game_data.robust_acc[i][j]])
            }
          }
          drawRobustHeat("rob_Chart", game_data.def_methods, game_data.atk_methods, game_robust_data, NMIColorList, true,  [0,100])
          var p_x = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
          var lime_series = []
          for( let i =0 ; i <  game_data.atk_methods.length; i++){
            var limedata=[];
            for(let j=0;j<game_data.def_strategy[game_data.atk_methods[i]].length;j++){
              limedata.push({"value":game_data.def_profit[i][j],
              "method":game_data.def_strategy[game_data.atk_methods[i]][j]})
            }
            lime_series.push({name:game_data.atk_methods[i],
              data: limedata,
              smooth: true, lineStyle: { normal: { width: 2 } },
              animationDuration: 2500,
              
              itemStyle: {  },
              type: 'line',})
            }
          let option_profit = {
            tooltip: { 
              trigger: 'axis', 
              axisPointer: { lineStyle: { color: '#000' } },
              formatter:function(params){
                console.log(params)
                var resp=params[0].name
                for(let i =0 ;i <params.length;i++){
                  resp+= "<br/>"+params[i].seriesName+'<br/>收益：'+params[i].data.value+'<br/>最佳防御方法：'+params[i].data.method
                }
                return resp
              }
             },
            legend: {
                icon: 'rect',
                data: game_data.atk_methods,
                textStyle: { fontSize: 15, color: '#000' },
                right: "10%"
            },
            xAxis: {
                type: 'category',
                data: p_x,
                name: "p",
                axisLine: { lineStyle: { color: '#000' } },
                splitLine: { lineStyle: { color: '#000' } },
                axisLabel: {
                    fontSize: 20,
                    color: "#000",

                    textBorderColor: "#000",
                    textBorderWidth: 0.5,
                    textBorderType: "solid"
                }
            },
            yAxis: {
                name: '攻防博弈收益率',
                nameLocation: 'center',
                nameGap: 40,
                nameTextStyle: {
                    fontSize: 20,
                    color: 'white'
                },
                axisLine: { lineStyle: { color: '#000' } },
                splitLine: { lineStyle: { color: '#000' } },
                type: 'value',
                axisLabel: {
                    margin: -15,
                    formatter: '{value} %',
                    fontSize: 15,
                    color: "#000",
                    textBorderColor: "#000",
                    textBorderWidth: 0.5,
                    textBorderType: "solid"
                },
                min: 50,
                interval: 10
            },
            series: lime_series
          }
          if (lime_series.length > 1){
            setTimeout(function(){
              var conseva = document.getElementById("bal_Chart");
              var myChartcons = echarts.init(conseva);
              window.addEventListener("resize", function () {
                  myChartcons.resize()});
                  option_profit && myChartcons.setOption(option_profit);
            },500)
          }
        }
      },
      draw_scatter(ID,bendata,advdata,title){
        
        var option = {
            title: {
                text: title,
                textStyle: { fontSize: 18, color: '#000' },
                top: "20px",
                left:"center"
            },
            toolbox: {
                left: "right",
                feature: {
                    dataZoom: {}
                },
                top: "20px"
            },
            legend: {
                left: "center",
                itemWidth: 14, itemHeight: 5, itemGap: 10,
                bottom: '10px',
                textStyle: { fontSize: 15, color: '#000' }
            },
            tooltip: {
                formatter: function (params) {
                    return (
                        params.seriesName +
                        '样本:<br/>' +
                        params.value[0] +
                        '，<br/>' +
                        params.value[1]
                    );
                }
            },
            xAxis: {
                type: 'value',
                axisLine: { lineStyle: { color: '#000' } },
                splitLine: { lineStyle: { color: '#57617B' } },
                axisLabel: {
                    fontSize: 15,
                    color: "#000",
                    // rgba(4, 249, 208, 1)

                    textBorderColor: "#000",
                    // rgba(139, 238, 103, 0.98)
                    textBorderWidth: 0.1,
                    textBorderType: "solid"
                }
            },
            yAxis: {
                type: 'value',
                axisLine: { lineStyle: { color: '#000' } },
                splitLine: { lineStyle: { color: '#57617B' } },
                axisLabel: {
                    fontSize: 15,
                    color: "#000",
                    // rgba(4, 249, 208, 1)
                    textBorderColor: "#000",
                    // rgba(139, 238, 103, 0.98)
                    textBorderWidth: 0.1,
                    textBorderType: "solid"
                }
            },
            series: [
                {
                    name: "正常样本",
                    type: "scatter",
                    symbolSize: 3.5,
                    data: bendata,
                    itemStyle: { normal: { color: 'green' } }
                },
                {
                    name: "对抗样本",
                    type: "scatter",
                    symbolSize: 3.5,
                    data: advdata,
                    itemStyle: { normal: { color: 'red' } }
                }
            ]
        };
        setTimeout(function() {
        var conseva = document.getElementById(ID);
        var myChartcons = echarts.init(conseva);
        
        window.addEventListener("resize", function () {
          myChartcons.resize()});
        option && myChartcons.setOption(option);
        conseva.style.display="inline-block";},500)
      },
      draw_robust_echart(ID,data) {
        var sourcelist = [];
        var asr_sourcelist = [];
        asr_sourcelist[0] = [''];
        sourcelist[0] = [""];
        var serieslist = [];
        var robustmethod="";
        if (data.AdvAttack){
          sourcelist[0].push("原模型准确率");
          asr_sourcelist[0].push("原模型攻击成功率")
          i = 1;
          for ( var key in data.AdvAttack.atk_acc){
            sourcelist[i]=[];
            asr_sourcelist[i] = [];
            sourcelist[i].push(key);
            asr_sourcelist[i].push(key);
            sourcelist[i].push(data.AdvAttack.atk_acc[key]);
            asr_sourcelist[i].push(data.AdvAttack.atk_asr[key]);
            i++;
          }
        };
        if(data.AdvTrain){
          sourcelist[0].push("对抗训练后的防御成功率");
          asr_sourcelist[0].push("对抗训练后的攻击成功率");
          robustmethod+="对抗训练 "
          i = 1;
          for ( var key in data.AdvTrain.def_acc){
            if (sourcelist[i].length==0){
              sourcelist[i]=[];
              asr_sourcelist[i] = []
              sourcelist[i].push(key);
              asr_sourcelist[i].push(key);
            }
            sourcelist[i].push(data.AdvTrain.def_acc[key]);
            asr_sourcelist[i].push(data.AdvTrain.def_asr[key]);
            i++;
          }
        };
        if(data.EnsembleDefense){
          sourcelist[0].push("集成防御后的防御成功率");
          asr_sourcelist[0].push("集成防御后的攻击成功率");
          robustmethod+="群智化防御";
          i = 1;
          for ( var key in data.EnsembleDefense.ens_acc){
            if (sourcelist[i].length==0){
              sourcelist[i]=[];
              asr_sourcelist[i] = []
              sourcelist[i].push(key);
              asr_sourcelist[i].push(key);
            }
            sourcelist[i].push(data.EnsembleDefense.ens_acc[key]);
            asr_sourcelist[i].push(data.EnsembleDefense.ens_asr[key]);
            i++;
          }
        };
        
        if(data.PACA){
          sourcelist[0].push("PACA自动化攻击检测");
          asr_sourcelist[0].push("PACA自动化攻击检测后的防御成功率");
          robustmethod += " PACA自动化攻击检测";
          i = 1;
          for (var key in data.PACA){
            if (sourcelist[i].length==0){
              sourcelist[i]=[];
              asr_sourcelist[i] = []
              sourcelist[i].push(key);
              asr_sourcelist[i].push(key);
            }
            sourcelist[i].push(data.PACA[key]*100);
            asr_sourcelist[i].push((1-data.PACA[key])*100)
            i++;
        }};
        for(var i =1;i < sourcelist[0].length;i++){
            serieslist.push(
              {type: 'bar'}
            )
          };
        
        var option = {
          title: {
            text: '鲁棒性评估',
            textStyle:{
              fontSize:18,
            },
            left:"center",
            textAlign: 'left',
            y:'30',
              },
          legend: {
            right:20,
            top:50,
              },
          grid: {
            left: '10%',
            right: '10%',
            bottom: '5%',
            top:'15%',
            containLabel: true
              },
          tooltip: {},
          dataset: {
            source: []
          },
          xAxis: { 
            type: 'category', 
            // boundaryGap: false
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value} %'
            }
          },
          series: []
        };
        var optionasr = {
          title: {
            text: '鲁棒性评估-攻击成功率',
            textStyle:{
              fontSize:18,
            },
            left:"center",
            textAlign: 'left',
            y:'30',
              },
          legend: {
            right:20,
            top:50,
              },
          grid: {
            left: '10%',
            right: '10%',
            bottom: '5%',
            top:'15%',
            containLabel: true
              },
          tooltip: {},
          dataset: {
            source: []
          },
          xAxis: { 
            type: 'category', 
            // boundaryGap: false
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value} %'
            }
          },
          series: []
        };
        if (sourcelist.length > 1){
          option.dataset.source=sourcelist;
          option.series=serieslist;
        //   echart_for_robust.hideLoading();
          let msg = "模型"+this.postData['ModelParam']['name']+"经过"+robustmethod+"等增强措施后，不同对抗攻击下的准确率直方图如上";
          setTimeout(function(){
            var conseva = document.getElementById(ID);
            var myChartcons = echarts.init(conseva);
            window.addEventListener("resize", function () {
                myChartcons.resize()});
            option && myChartcons.setOption(option);
          },500)
        }
        if (asr_sourcelist.length > 1){
          optionasr.dataset.source=asr_sourcelist;
          optionasr.series=serieslist;
        //   echart_for_robust.hideLoading();
          let msg1 = "模型"+this.postData['ModelParam']['name']+"经过"+robustmethod+"等增强措施后，不同对抗攻击下的攻击成功率直方图如上";
          setTimeout(function(){
            var conseva = document.getElementById("robust_asr");
            var myChartcons = echarts.init(conseva);
            window.addEventListener("resize", function () {
                myChartcons.resize()});
                optionasr && myChartcons.setOption(optionasr);
          },500)
        }
      },
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