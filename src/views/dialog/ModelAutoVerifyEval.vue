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
                    <div class="dialog-title"><img src="../../assets/img/formalVerifyIcon.png" style="width: 50px; height: 50px;">安全性评估报告</div>
                  </slot>
              </div>
              <div class="dialog_main" id="pdfDom" >
              <!--弹窗的内容-->
                  <slot name="main">
                    <div class="paramShow">
                        <a-row >
                            <a-col :span="6" >
                                <div class="paramContent">
                                    <p><span class="paramName">样本：</span><img class="paramShowSample" :src="'/static/output/'+res.tid+'/'+res.stidlist.auto_verify+'/input.png'" alt="sample"/></p>
                                </div>
                            </a-col>
                            <a-col :span="6" >
                                <div class="paramContent">
                                    <p><span class="paramName">样本所属数据集：</span><span class="paramValue">{{ postData.dataset }}</span></p>
                                </div>
                            </a-col>
                            <a-col :span="6" >
                                <div class="paramContent">
                                    <p><span class="paramName">深度学习模型：</span><span class="paramValue">{{ postData.net }}</span></p>
                                </div>
                            </a-col>
                            <a-col :span="6" >
                                <div class="paramContent">
                                    <p><span class="paramName">攻击强度：</span><span class="paramValue">{{ postData.eps }}</span></p>
                                </div>
                            </a-col>
                        </a-row>
                    </div>
                    <!-- 总评分 -->
                    <div class="reportContent">
                        <div class="classification">
                            <p class=" main_top_echarts_con_title ">正常样本分类结果</p>
                            <div class="conclusion">
                                <p class="result_text">{{ modeMsg.reach.label[postData.dataset][res.auto_verify["predicted"]] }}</p>
                            </div>
                        </div>
                        <div class="result_div_notop">
                            <p class=" main_top_echarts_con_title ">解释可视化展示(IBP)</p>
                            <div class="IBPChart">

                                <!-- 图表 -->
                                <div id='IBP'></div>
                                
                                <div class="conclusion">
                                    <p class="result_text">如上柱状图，在预测分类为{{ modeMsg.reach.label[postData.dataset][res.auto_verify["predicted"]] }}的图像上，
                                        设置噪声强度为{{postData.eps}},
                                        验证模型的安全性，输出区域存在一定的重叠，对应安全特征存在且在风险</p>
                                </div>
                            </div>
                        </div>
                        <div class="result_div_notop">
                            <p class=" main_top_echarts_con_title ">解释可视化展示(CROWN-IBP)</p>
                            <div class="IBPChart">

                                <!-- 图表 -->
                                <div id='CROWN'></div>
                                
                                <div class="conclusion">
                                    <p class="result_text">如上柱状图，在预测分类为{{ modeMsg.reach.label[postData.dataset][res.auto_verify["predicted"]+1] }}的图像上，
                                        设置噪声强度为{{postData.eps}},
                                        验证模型的安全性，输出区域存在一定的重叠，对应安全特征存在且在风险</p>
                                </div>
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
import {drawIntervalBar} from "../../assets/js/drawEcharts.js"
export default {
  name:"modelAutoVerifyDialog",
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
      htmlTitle:"安全性验证报告",
      res:{},
      modeMsg:{
        "reach":{"ID":"reach","name":"可达性","modellist":["CNN-3layer"],"dataset":["mnist","cifar10"],
          "label":{
            "mnist":{
              0:"数字1",
              1:"数字2",
              2:"数字3",
              3:"数字4",
              4:"数字5",
              5:"数字6",
              6:"数字7",
              7:"数字8",
              8:"数字9",
              9:"数字0",
            },
            "cifar10":{
              0:"飞机",
              1:"汽车",
              2:"鸟类",
              3:"猫",
              4:"鹿",
              5:"狗",
              6:"青蛙",
              7:"马",
              8:"船",
              9:"卡车",
            }
          }
        },
      }
    }
  },
  created(){
    console.log('auto_verify created:',this.result)
    if ("auto_verify" in this.result){
      this.res = this.result
      let ylabel = this.modeMsg.reach.label[this.postData.dataname]
      drawIntervalBar("IBP",this.res.auto_verify.boundary1,ylabel)
      drawIntervalBar("CROWN",this.res.auto_verify.boundary2,ylabel)
    }
  },
  watch:{
    result(newValue, oldValue){
      console.log('auto_verify:',this.result)
      if ("auto_verify" in newValue){
        this.res = this.result
        let ylabel = this.modeMsg.reach.label[this.postData.dataname]
        drawIntervalBar("IBP",this.res.auto_verify.boundary1,ylabel)
        drawIntervalBar("CROWN",this.res.auto_verify.boundary2,ylabel)
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
.reportContent{
    /* height: 1382px;
    bottom: 130px;
    top: 166px; */
    display: flex;
    flex-direction: column;
    align-items: center;
    /* padding: 0px; */
    gap: 60px;
    width: 1080px;
    /* left: 0px; */
    margin-top: 133px;
}

.classification{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px;
    gap: 24px;
    width: 960px;
    height: 132px;
    flex: none;
    order: 0;
    flex-grow: 0;
}
.IBPChart{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 24px;
    width: 960px;
    height: 505px;
    flex: none;
    order: 1;
    flex-grow: 0;
}
#IBP{
    width: 960px;
    height: 385px;
}
#CROWN{
    width: 960px;
    height: 385px;
}
</style>