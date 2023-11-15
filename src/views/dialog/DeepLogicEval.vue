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
                    <div class="dialog-title"><img src="../../assets/img/coverageneuralIcon.png" style="width: 50px; height: 50px;">逻辑神经元测试准则</div>
                  </slot>
              </div>
              <div class="dialog_main" id="pdfDom" >
              <!--弹窗的内容-->
                  <slot name="main">
                    <div class="result_div">
                        <div class="conclusion_info">
                            <!-- 显示输入信息：检测类型、数据集/清洗类型 -->
                            <p class="result_annotation">数据集：{{ postData.dataset }}</p>
                            <p class="result_annotation">模型：{{ postData.model }}</p>
                        </div>
                        <div class=" main_top_echarts_con_title ">逻辑神经元测试结果</div>
                        <div id="rdeva">
                            <div id="deep_logic_result" class="box" style="height: 500px; width: 800px;"> </div>
                            <div class="conclusion">
                                <p class="result_text">输出随着测试用例变化，待测试模型缺陷检出率变化曲线图，缺陷检出率越大模型风险越高。使用逻辑神经元测试准则DEEPLOGIC筛选出的数据能达到最高的缺陷检出率。</p>
                            </div>
                        </div>
                    </div>
                    <a-button @click="getPdf()" style="width:160px;height:50px;margin-bottom:30px;margin-top:10px;
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
import {drawFormalLine} from "../../assets/js/drawEcharts.js"
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
      htmlTitle:"逻辑神经元测试准则",
      res:{}
    }
  },
  created(){
    console.log('DeepLogic created:',this.result)
    if ("DeepLogic" in this.result){
      this.updated()
    }
  },
  watch:{
    result(newValue, oldValue){
      console.log('DeepLogic:',this.result)
      if ("DeepLogic" in newValue){
        this.updated()
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
      debugger;
      this.res.test_img = res.DeepLogic.result;
      this.res.score = res.DeepLogic.apfd;
      var lable = [];
      var seriesList = [];
      var x_data = [0,20,40,60,80,100]
      for(let i in this.res.test_img){
          var temp = i.split('_');
          if(temp[1]=='fault'){
              lable.push(temp[0]);
              seriesList.push({
                  "name": temp[0],
                  "type": "line",
                  "data": this.res.test_img[i]});
          }
      };
      drawFormalLine("deep_logic_result", lable, x_data, seriesList, "Percentage of fault detected")
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
.result_div{
    margin-top: 0;
}
.conclusion_info{
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    padding: 20px;
    gap: 25px;
    margin-bottom: 20px;
    width: 1080px;
    background: #F2F4F9;
    border-radius: 4px;
}
#rdeva{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px;
    width: 960px;
    height: auto;
    flex: none;
    order: 1;
    flex-grow: 0
}
</style>