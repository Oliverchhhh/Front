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
                    <div class="dialog-title"><img src="../../assets/img/formalVerifyIcon.png" style="width: 50px; height: 50px;">可达性评估报告</div>
                  </slot>
              </div>
              <div class="dialog_main" id="pdfDom" >
              <!--弹窗的内容-->
                  <slot name="main">
                    <div class="paramShow">
                        <a-row >
                            <a-col :span="8" >
                                <div class="paramContent">
                                    <p><span class="paramName">样本：</span><img class="paramShowSample" :src="'/static/output/'+res.tid+'/'+res.stidlist.model_reach+'/input.png'" alt="sample"/></p>
                                </div>
                            </a-col>
                            <a-col :span="8" >
                                <div class="paramContent">
                                    <p><span class="paramName">样本所属数据集：</span><span class="paramValue">{{ postData.dataset }}</span></p>
                                </div>
                            </a-col>
                            <a-col :span="8" >
                                <div class="paramContent">
                                    <p><span class="paramName">深度学习模型：</span><span class="paramValue">CNN-3layer</span></p>
                                </div>
                            </a-col>
                        </a-row>
                    </div>
                    <!-- 总评分 -->
                    <div class="reportContentCon">
                        <div class="result_div_notop">
                            <p class=" main_top_echarts_con_title ">真实类别到目标类别的可达区域展示</p>
                            <div class='reachImgDiv'>
                                <div class="imgContent">
                                    <a-row>
                                        <a-col :span="2">
                                            <div class="ylabel"> 目标类别:{{ modeMsg.reach.label[postData.dataset][postData.target] }}</div>
                                        </a-col>
                                        <a-col :span="22">
                                            <div class="reachImgbg">
                                                <img :src='res.model_reach.path' style="height: 100%;width: 100%;" />
                                            </div>
                                        </a-col>
                                    </a-row>
                                    <a-row>
                                        <a-col>
                                            <div class="xlabel"> 真实类别:{{modeMsg.reach.label[postData.dataset][postData.label]}}</div>
                                        </a-col>
                                    </a-row>
                                </div>

                            </div>
                                
                            <div class="conclusion">
                                <p class="result_text">如图是上传图片用理论验证和撒点验证两种方法计算得到的可达区域图，蓝色点代表理论验证值，黑色点是通过撒点实测得到的值。横坐标是预测为真实label的置信度，纵坐标是预测为目标label的置信度，当点都位于红线（y=x）下方时可认为可达区域安全</p>
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
  name:"modelreachDialog",
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
      htmlTitle:"可达性评估报告",
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
    },
    }
  },
  created(){
    console.log('model_reachcreated:',this.result)
    if ("model_reach" in this.result){
      this.res = this.result
    }
  },
  watch:{
    result(newValue, oldValue){
      console.log('model_reach:',this.result)
      if ("model_reach" in newValue){
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
.reachImgDiv{
    display: flex;
    height: 476px;
    padding: 24px 193px 24px 132px;
    align-items: center;
    background: var(--light-neutral-1-bg, #FFF);
}
.imgContent{
    width: 635px;
    height: 428px;
}
.ylabel{
    color: #000;
    text-align: center;
    font-family: HONOR Sans CN;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; 
    transform: rotate(-90deg);
    width: 400px;
    margin-left: -170px;
    margin-top: 178px;
}
.reachImgbg{
    height: 400px;
    width: 600px;
    display: inline-flex;
    padding: 30px 17px 22px 23px;
    justify-content: flex-end;
    align-items: center;
    border: 1px solid var(--gray-4, #B4B9C5);
}
.xlabel{
    color: #000;
    text-align: center;
    font-family: HONOR Sans CN;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; 
    align-self: stretch;
    margin-left: 100px;
}
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

</style>