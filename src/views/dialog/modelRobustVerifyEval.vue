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
                    <div class="dialog-title"><img src="../../assets/img/formalVerifyIcon.png" style="width: 50px; height: 50px;">鲁棒性形式化验证评估结果报告</div>
                  </slot>
              </div>
              <div class="dialog_main" id="pdfDom" >
              <!--弹窗的内容-->
                  <slot name="main">
                    <div class="paramShow">
                        <a-row >
                            <a-col :span="5" >
                                <div class="paramContent">
                                    <p><span class="paramName">数据集：</span><span class="paramValue">{{ postData.dataset }}</span></p>
                                </div>
                            </a-col>
                            <a-col :span="5" >
                                <div class="paramContent">
                                    <p><span class="paramName">模型：</span><span class="paramValue">{{ postData.model }}</span></p>
                                </div>
                            </a-col>
                            <a-col :span="5" >
                                <div class="paramContent">
                                    <p><span class="paramName">最大扰动值：</span><span class="paramValue">{{ postData.up_eps }}</span></p>
                                </div>
                            </a-col>
                            <a-col :span="5" >
                                <div class="paramContent">
                                    <p><span class="paramName">最小扰动值：</span><span class="paramValue">{{ postData.down_eps }}</span></p>
                                </div>
                            </a-col>
                            <a-col :span="4" >
                                <div class="paramContent">
                                    <p><span class="paramName">扰动次数：</span><span class="paramValue">{{ postData.steps }}</span></p>
                                </div>
                            </a-col>
                        </a-row>
                    </div>
                    <!-- 总评分 -->
                    <div class="result_div" style="margin-top: 120px;">
                        <div class="g_score_content" style="width:960px">
                            <div class="scorebg">
                                <div class=" main_top_echarts_con_title ">鲁棒性形式化验证总评分</div>
                                <!-- 显示分数 -->
                                <p class="g_score"> {{res.result_score.toFixed(0)}}</p>
                                <!-- 显示评估结果 -->
                                <p class="g_score_evaluate"> {{ res.resultEvaluate }}</p>
                            </div>
                        </div>
                        <div class="conclusion">
                            <p class="result_text"> 模型综合评分为{{res.result_score.toFixed(0)}}，是一个{{ res.resultScon }}的模型</p>
                            <p class="result_annotation">通过鲁棒性分析，在指定输入和扰动空间下，该模型可成功抵御对抗攻击的概率为{{res.result_score.toFixed(0)}}%。</p>
                        </div>
                    </div>
                    
                    <!-- 图表 -->
                    <div class="result_div">
                        
                        <div class="echart_title">
                            
                            <div class=" main_top_echarts_con_title ">鲁棒性分析结果</div>
                            <!-- <p class="title_annotation">标题说明，可无</p> -->
                            
                        </div>
                        <div id="rdeva">
                            <!-- 图表 -->
                            <div id = 'conseva'></div>
                            <div class="conclusion">
                                <!-- <p class="result_text">图表结论</p> -->
                                <p class="result_annotation">图表中auto_LiRPA曲线展示了在不同扰动大小下，使用auto_LiRPA算法分析所得AI模型被对抗样本成功攻击的概率。</p>
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
import {drawStackedLine} from "../../assets/js/drawEcharts.js"
export default {
  name:"modelRobustVerifyDialog",
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
      htmlTitle:"模型鲁棒性验证报告",
      res:{
        result_score:null,
        resultEvaluate:null,
        resultScon:null,

      }
    }
  },
  created(){
    console.log('formal_verification created:',this.result)
    if ("formal_verification" in this.result){
      this.resultPro()
    }
  },
  watch:{
    result(newValue, oldValue){
      console.log('formal_verification:',this.result)
      if ("formal_verification" in newValue){
        this.resultPro()
      }
    }
  },
  methods: {
    closeMyself() {
      this.$emit("on-close");
      //如果需要传参的话，可以在"on-close"后面再加参数，然后在父组件的函数里接收就可以了。
    },
    _stopPropagation(ev){
      var _this = this;
      ev.stopPropagation();
    },
    resultPro(){
      this.res = this.result.formal_verification.output_param
      // debugger;
      // 总分判断
      var allRates = this.res.LiRPA.rates;
      var sum = 0;
      var avgRates = 0;
      for (let v of allRates) {
          avgRates += v;
      }
      avgRates /= allRates.length;
      this.res.result_score = 100 - avgRates * 100;
      console.log("Avg rates is : ", this.res.result_score)
      if(this.res.result_score > 80){
        this.res.resultEvaluate = "优秀";
        this.res.resultScon = "鲁棒";
      }else if(this.res.result_score > 60 && this.res.result_score <=80){
        this.res.resultEvaluate = "良好";
        this.res.resultScon = "较鲁棒";
      }else{
        this.res.resultEvaluate = "差";
        this.res.resultScon = "较不鲁棒";
      }
      var disLabel = this.res.LiRPA.eps;
      var disData = [];
      var legendInfo = [];
      for (let disKey in this.result.formal_verification.output_param) {
        if(["result_score","resultEvaluate","resultScon"].indexOf(disKey)>-1){
          continue
        }
          var tmpData = this.result.formal_verification.output_param[disKey];
          disData.push(tmpData.rates)
          legendInfo.push(tmpData.name)
      }
      drawStackedLine('conseva', disData, legendInfo, disLabel, '')
            
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
z-index:1;
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
  position: absolute;
  width: 1080px;
  left: 0px;
  top: 89px;

}

.dialog-title{
  width: 390px;
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
.echart_title{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px 120px;
    gap: 4px;
    width: 960px;
    height: 62px;
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}
#rdeva{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px;
    width: 960px;
    height: 414px;
    flex: none;
    order: 1;
    flex-grow: 0
}
/* 得分图echart */
#conseva{
    width: 800px;
    height:800px;
}
</style>