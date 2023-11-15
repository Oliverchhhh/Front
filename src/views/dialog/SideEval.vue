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
                    <div class="dialog-title"><img src="../../assets/img/sideIcon.png" style="width: 50px; height: 50px;">侧信道分析结果报告</div>
                  </slot>
              </div>
              <div class="dialog_main" id="pdfDom" >
              <!--弹窗的内容-->
                  <slot name="main">
                    <div class="paramShow">
                        <a-row >
                            <a-col :span="6" >
                                <div class="paramContent">
                                    <p><span class="paramName">能耗文件：</span><span class="paramValue">{{ dataChoiceList[postData.trs_file] }}</span></p>
                                </div>
                            </a-col>
                            <a-col :span="6" >
                                <div class="paramContent">
                                    <p><span class="paramName">能耗分析方法：</span><span class="paramValue">{{ methodChoiceList[postData.methods] }}</span></p>
                                </div>
                            </a-col>
                            <a-col :span="6" >
                                <div class="paramContent"></div>
                            </a-col>
                            <a-col :span="6" >
                                <div class="paramContent"></div>
                            </a-col>
                        </a-row>

                    </div>
                    
                    <div class="reportContentCon">
                        <div class="result_div_notop">
                            <p class=" main_top_echarts_con_title ">能耗分析结果</p>
                            <div class="accLineChart">

                                <!-- 图表 -->
                                <div class="g_score_content" id="score"></div>
                                
                                <div class="conclusion">
                                    <p v-show="methodChoiceList[postData.methods]!='HPA'" class="result_text">{{ res.text1 }}存在阈值>4.5的值，说明{{ res.text2 }}泄露</p>
                                    <p v-show="methodChoiceList[postData.methods]=='HPA'" class="result_text">{{ res.text3 }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="result_div_notop" v-show="methodChoiceList[postData.methods]=='SPA'">
                            <p class=" main_top_echarts_con_title ">原模型示意图</p>
                            <div class="g_score_content" id="ori_network"></div>
                            <p class=" main_top_echarts_con_title ">模型恢复示意图</p>
                            <div class="g_score_content" id="res_network"></div>
                            <div class="conclusion">
                                <p class="result_text">根据SPA攻击的相关性系数曲线特征，可以直接区分出模型各层结构。</p>
                            </div>
                        </div>
                    </div>
                    <a-button @click="getPdf()" style="width:160px;height:50px;margin-bottom:30px;margin-top:10px;
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
import {drawside, drawTtest, drawALLPA} from "../../assets/js/drawEcharts.js"
export default {
  name:"injectResultDialog",
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
      },
    },
      
  data() {
    return {
      htmlTitle:"侧信道分析",
      dataChoiceList: {
        "(022.108.112.-9)elmotracegaus_cpa_-9.trs":"trace1",
        "(022.112.116.-9)elmotracegaus_hpa_-9.trs":"trace2",
        "(2122.108.112.47)elmotracegaus_cpa_47.trs":"trace3",
        "(2122.108.112.47)elmotracegaus_hpa_47.trs":"trace4",
        "(7522.108.112.2)elmotracegaus_cpa_2.trs":"trace5",
        "(7522.112.116.2)elmotracegaus_hpa_2.trs":"trace6"
      },
      methodChoiceList:{
        'cpa':'CPA',
        'dpa':'DPA',
        'hpa':'HPA',
        'ttest':'T-test',
        'x2test':'X²-Test'
      },
      res:{
        text1:null,
        text2:null,
        text3:null,
      }
    }
  },
  created(){
    console.log('side created:',this.result)
    if ("side" in this.result){
      this.resultPro(this.result)
    }
  },
  watch:{
    result(newValue, oldValue){
      console.log('side:',this.result)
      if ("side" in newValue){
        this.resultPro(this.result)
      }
    }
  },
  methods:{
    resultPro(res){
        debugger;
        res = res.side;
        if ('ttest' in res) {
            drawTtest('score',res.ttest.X, res.ttest.Y[0]);
            if(Math.max.apply(Math, res.ttest.Y[0])>4.5 || Math.min.apply(Math, res.ttest.Y[0])<-4.5){
                this.res.text1 = "";
                this.res.text2 = "有"
            } else {
                this.res.text1 = "不";
                this.res.text2 = "无"
            }
            return
        }
        // 根据情况是否保留x2test
        if ('x2test' in res) {
            drawTtest('score',res.x2test.X, res.x2test.Y[0]);
            if(Math.max.apply(Math, res.x2test.Y[0])>4.5 || Math.min.apply(Math, res.x2test.Y[0])<-4.5){
                this.res.text1 = "";
                this.res.text2 = "有"
            } else {
                this.res.text1 = "不";
                this.res.text2 = "无"
            }
            return
        }
        if (this.methodChoiceList[this.postData.methods] == 'HPA') {
            let echart_legend = [];
            let echart_X = res.hpa.X;
            let echarts_y = []
            for(var i = 0; i < res.hpa.Y.length; i++){
                echart_legend.push("错误值");
                let temp = {};
                temp['symbol'] = 'none';
                temp['name'] = echart_legend[i];
                temp['type'] = 'line';
                temp['data'] = res.hpa.Y[i];
                echarts_y.push(temp);
            }
            echarts_y.push({'symbol':'none', 'name':'错误值', 'type': 'line', 'data': res.hpa.false });
            echart_legend.push("错误值");
            echarts_y.push({'symbol':'none', 'name':'正确值', 'type': 'line', 'data': res.hpa.true });
            echart_legend.push("正确值");
            drawALLPA('score', echart_legend, echart_X, echarts_y);
            if(Math.max(Math.max.apply(Math, res.hpa.Y),Math.max.apply(Math, res.hpa.false)) < Math.min.apply(Math, res.hpa.true)){
                this.res.text3 = "正确值相关性与错误值相关性差值大且稳定，说明侧信道攻击成功"
            } else {
                this.res.text3 = "正确值相关性与错误值相关性差值小或不稳定，说明侧信道攻击失败"
            }
            
        }
        if (this.methodChoiceList[this.postData.methods] == 'SPA') {
            // 待定
            drawALLPA('score', res.spa.X, res.spa.Y, res.spa.false, res.spa.true);
        }
        if (this.methodChoiceList[this.postData.methods] == 'DPA') {
            let echart_legend = [];
            let echart_X = res.dpa.X;
            let echarts_y = []
            for(var i = 0; i < res.dpa.Y.length; i++){
                echart_legend.push("错误值");
                let temp = {};
                temp['symbol'] = 'none';
                temp['name'] = echart_legend[i];
                temp['type'] = 'line';
                temp['data'] = res.dpa.Y[i];
                echarts_y.push(temp);
            }
            echarts_y.push({'symbol':'none', 'name':'错误值', 'type': 'line', 'data': res.dpa.false });
            echart_legend.push("错误值");
            echarts_y.push({'symbol':'none', 'name':'正确值', 'type': 'line', 'data': res.dpa.true });
            echart_legend.push("正确值");
            drawALLPA('score', echart_legend, echart_X, echarts_y);
        }
        if (this.methodChoiceList[this.postData.methods] == 'CPA') {
            let echart_legend = [];
            let echart_X = res.cpa.X;
            let echarts_y = []
            for(var i = 0; i < res.cpa.Y.length; i++){
                echart_legend.push("错误值");
                let temp = {};
                temp['symbol'] = 'none';
                temp['name'] = echart_legend[i];
                temp['type'] = 'line';
                temp['data'] = res.cpa.Y[i];
                echarts_y.push(temp);
            }
            echarts_y.push({'symbol':'none', 'name':'错误值', 'type': 'line', 'data': res.cpa.false });
            echart_legend.push("错误值");
            echarts_y.push({'symbol':'none', 'name':'正确值', 'type': 'line', 'data': res.cpa.true });
            echart_legend.push("正确值");
            drawALLPA('score', echart_legend, echart_X, echarts_y);
        }   
    },
    closeMyself() {
      this.$emit("on-close");
      //如果需要传参的话，可以在"on-close"后面再加参数，然后在父组件的函数里接收就可以了。
    },
    _stopPropagation(ev){
      var _this = this;
      ev.stopPropagation();
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
.dialog-title{
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
.content_div{
  display: flex;
  gap: 40px;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
}
.accLineChart{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 24px;

    width: 960px;
    height: 454px;
}
.g_score_content{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px 120px;
    gap: 20px;
    width: 960px;
    height: 366px;
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}
</style>