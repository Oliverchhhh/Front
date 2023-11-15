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
                    <div class="dialog-title"><img src="../../assets/img/formalVerifyIcon.png" style="width: 50px; height: 50px;">一致性评估报告</div>
                  </slot>
              </div>
              <div class="dialog_main" id="pdfDom" >
              <!--弹窗的内容-->
                  <slot name="main">
                    <div class="paramShow">
                        <a-row >
                            <a-col :span="8" >
                                <div class="paramContent">
                                    <p><span class="paramName">样本：</span><img class="paramShowSample" :src="'/'+res.model_consistency.input" alt="sample"/></p>
                                </div>
                            </a-col>
                            <a-col :span="8" >
                                <div class="paramContent">
                                    <p><span class="paramName">样本所属数据集：</span><span class="paramValue">{{ postData.dataset }}</span></p>
                                </div>
                            </a-col>
                            <a-col :span="8" >
                                <div class="paramContent">
                                    <p><span class="paramName">深度学习模型：</span><span class="paramValue">{{ postData.net }}</span></p>
                                </div>
                            </a-col>
                        </a-row>
                    </div>
                    <!-- 总评分 -->
                    <div class="reportContentCon">
                        <div class="g_score_content" style="width: 1080px;">
                            <div class="scorebg">
                                <div class=" main_top_echarts_con_title ">模型一致性评分</div>
                            
                                <p class="g_score_2">{{ res.model_consistency["l2"].toFixed(1) }}</p>
                                <!-- {{res.score.aft}} -->
                                <!-- <p class="g_score_evaluate"> {{ res.score_evaluate.aft }}</p> -->
                            </div>
                        </div>
                        <div class="result_div_notop">
                            <p class=" main_top_echarts_con_title ">一致性输出展示</p>
                            <!-- <div class="IBPChart"> -->

                                <!-- 图表 -->
                            <div class='featureImgDiv'>
                                <div class="imgShowtable">
                                    <div class="imageTitle">
                                        <p>Input</p>
                                    </div>
                                    <div class="imageContent"> 
                                        <div class="imgbg">
                                            <img :src="'./'+res.model_consistency.input"  />
                                        </div>
                                        
                                    </div>
                                </div>
                                <div class="imgShowtable">
                                    <div class="imageTitle">
                                        <p>Target</p>
                                    </div>
                                    <div class="imageContent"> 
                                        <div class="imgbg">
                                            <img :src="'./'+res.model_consistency.target"  />
                                        </div>
                                    </div>
                                </div>
                                <div class="imgShowtable">
                                    <div class="imageTitle">
                                        <p>Output</p>
                                    </div>
                                    <div class="imageContent"> 
                                        <div class="imgbg">
                                            <img :src="'./'+res.model_consistency.output"  />
                                        </div>
                                        
                                    </div>
                                </div>
                                <div class="imgShowtable">
                                    <div class="imageTitle">
                                        <p>Delta</p>
                                    </div>
                                    <div class="imageContent"> 
                                        <div class="imgbg">
                                            <img :src="'./'+res.model_consistency.delta"  />
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                                
                            <div class="conclusion">
                                <p class="result_text">如图，针对CIFAR10数据集测试图像输出特征图像，待验证模型的特征图像，
                                    通过特征转换模型得到的图像，以及两个图像的差别。主要对比待验证模型的特征图像和转换模型输出的目标图像，
                                    用以代表两个模型的知识特征，可以看出两个模型的知识特征对比差距不大，但是仍存在部分区域上的特征不一致的现象。</p>
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

export default {
  name:"modelfairnessdebiasDialog",
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
      htmlTitle:"一致性评估报告",
      res:{}
    }
  },
  created(){
    console.log('model_consistency created:',this.result)
    if ("model_consistency" in this.result){
      this.res = this.result
    }
  },
  watch:{
    result(newValue, oldValue){
      console.log('model_consistency:',this.result)
      if ("model_consistency" in newValue){
        this.res = this.result
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
.result_text{
  text-align: left;
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
.featureImgDiv{
    display: flex;
    width: 960px;
    align-items: flex-start;
    border-radius: 4px;
    border: 1px solid #E0E3EB;
    background: #FFF;
}
imgShowtable{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: 1 0 0;
    width: 240px;
    height: 308px;
}
.imageTitle{
    display: flex;
    height: 68px;
    padding: 9px 32px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-self: stretch;
    border-right: 1px solid #E0E3EB;
    border-bottom: 1px solid #E0E3EB;
    background: var(--gray-7, #F2F4F9);
}
.imageTitle p{
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-shrink: 0;
    align-self: stretch;
    color: rgba(0, 0, 0, 0.90);
    text-align: center;
    font-family: HONOR Sans CN;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
}
.imageContent{
    display: flex;
    height: 240px;
    padding: 9px 20px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    align-self: stretch;
    border-right: 1px solid #E0E3EB;
    border-bottom: 1px solid #E0E3EB;
    background: #FFF;
}
.imgbg{
    display: flex;
    width: 200px;
    height: 200px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    
}
.imgbg img{
    width: 200px;
    height: 200px;
}
.reportContent{
    margin-top: 133px;
}
</style>