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
                    <div class="dialog-title"><img src="../../assets/img/modelMeasureIcon.png" style="width: 50px; height: 50px;">AI模型安全度量报告</div>
                  </slot>
              </div>
              <div class="dialog_main" id="pdfDom" >
              <!--弹窗的内容-->
                  <slot name="main">
                    <div class="result_div">
                        <div class="conclusion_info">
                            <!-- 显示输入信息 -->
                            <p class="result_annotation">数据集：{{ postData.dataset }}</p>
                            <p class="result_annotation">度量模型：{{ postData.model }}</p>
                            <p class="result_annotation">自然样本生成策略：{{ postData.naturemethod }}</p><p class="result_annotation">自然样本扰动强度：{{ postData.natureargs }}</p>
                            <p class="result_annotation">对抗样本生成策略：{{ postData.advmethod }}</p><p class="result_annotation">对抗样本扰动强度：{{ postData.advargs }}</p>
                            <div class="result_annotation result_pro">模型度量维度：
                                <div v-for="(item, index) in postData.measuremethod " :key="index"> 
                                    <p v-show="item=='generalization' ">泛化性</p>
                                    <p v-show="item=='safety' ">安全性</p>
                                    <p v-show="item=='robustness' ">鲁棒性</p>
                                </div>             
                            </div>
                        </div>
                       <div class="echart_title">            
                            <div class=" main_top_echarts_con_title ">模型安全度量结果</div>
                            <div  class="" id="score_echart" style="width: 450px;height: 450px;"></div>
                            <div class="conclusion">
                                <p class="result_text">各属性数值&gt;0.50为属性优秀，0.15~0.50为属性良好，数值&lt;0.15为属性缺乏 </p>
                            </div>
                        </div>
                        <div id="rdeva">
                            <!-- 图表 -->
                            <div class=" main_top_echarts_con_title ">样本示例</div>
                            <img  class="sample_img" :src="res.sampleImg">
                            <div class="conclusion">
                                <p class="result_text">图示每行分别为8张原始样本、自然策略 {{ postData.naturemethod }} 生成样本、对抗策略 {{ postData.advmethod }} 生成样本 </p>
                            </div>
                        </div>
                   </div>
                   <a-button @click="getPdf()" style="width:160px;height:40px;margin-bottom:30px;margin-top:10px;
                        font-size:18px;color:white;background-color:rgb(46, 56, 245);border-radius:8px;">
                        导出报告内容
                    </a-button>
                  </slot>
              </div>
          </div>
      </transition>
  </div>
</template>
<script>
import * as echarts from "echarts";
import {draw_score_polar} from "../../assets/js/drawEcharts.js"
export default {
  name:"envTestDialog",
  components: {
    draw_score_polar
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
      htmlTitle:"模型安全度量",
      res:{}
    }
  },
  created(){
    console.log('ModelMeasure created:',this.result)
    if ("ModelMeasure" in this.result){
      this.resultPro(this.result)
    }
  },
  watch:{
    result(newValue, oldValue){
      console.log('ModelMeasure:',this.result)
      if ("ModelMeasure" in newValue){
        this.resultPro(this.result)
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
    resultPro(res){
            // debugger; 
            this.res.score = [];
            this.res.method = [];
            let tmp_path = res.ModelMeasure.result.split('output');
            this.res.sampleImg = 'static/output'+tmp_path[1];
            if("robustness" in res.ModelMeasure) {
                this.res.method.push("鲁棒性");
                this.res.score.push(parseFloat(res.ModelMeasure["robustness"].toFixed(2)));
            }
            if("generalization" in res.ModelMeasure) {
                this.res.method.push("泛化性");
                this.res.score.push(parseFloat(res.ModelMeasure["generalization"].toFixed(2)));
            }
            if("safety" in res.ModelMeasure) {
                this.res.method.push("安全性");
                this.res.score.push(parseFloat(res.ModelMeasure["safety"].toFixed(2)));
            }
            draw_score_polar("score_echart", this.res.score, this.res.method);  
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
.result_div{
   display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px 60px;
    gap: 24px;
    width: 1080px;
    height: 1200px;
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
    margin: auto;
}
.conclusion_info{
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    padding: 20px;
    gap: 25px;
    margin-bottom: 20px;
    width: 1080px;
    background: #F2F4F9;
    border-radius: 4px;
}
.result_pro{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    /* margin: 0 0 0 -20px; */
}
.echart_title{
   display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px 120px;
    gap: 4px;
    width: 960px;
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}
.conclusion{
   box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: left;
    padding: 24px;
    gap: 8px;
    width: 960px;
    background: #F2F4F9;
    border-radius: 4px;
    flex: none;
    order: 2;
    flex-grow: 0;
}
.result_text{
   width: 912px;
    font-family: 'HONOR Sans CN';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    color: #000000;
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
    gap: 10px;
    width: 960px;
    flex: none;
    order: 1;
    flex-grow: 0
}
.sample_img {
    width: fit-content;
    height: 300px;
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

</style>