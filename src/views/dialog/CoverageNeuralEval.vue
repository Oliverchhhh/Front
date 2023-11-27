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
                    <div class="dialog-title"><img src="../../assets/img/coverageneuralIcon.png" style="width: 50px; height: 50px;">单神经元覆盖准则评估报告</div>
                  </slot>
              </div>
              <div class="dialog_main" id="pdfDom" >
              <!--弹窗的内容-->
                  <slot name="main">
                    <!-- 图表 -->
                    <div class="result_div">
                        <div class="conclusion_info">
                            <!-- 显示输入信息：检测类型、数据集/清洗类型 -->
                            <p class="result_annotation">数据集：{{ postData.dataset }}</p>
                            <p class="result_annotation">模型：{{ postData.model }}</p>
                            <p class="result_annotation">神经元激活阈值：{{ postData.k }}</p>
                            <p class="result_annotation">测试图片数量：{{ postData.N }}</p>
                        </div>
                        <div class=" main_top_echarts_con_title ">单神经元覆盖测试准则</div>
                        <div id="rdeva">
                            <div class="box">
                                <div v-for="(item, index) in res.img_list" v-show="index==mark" :key="index">
                                    <!-- <iframe class="graph_show" :src="item.imgUrl"></iframe> -->
                                    <img class="graph_show" :src="item.imgUrl" alt="">
                                    <p style="margin: 1% auto 12% auto;">当前覆盖率：{{ item.coverage }}%</p>
                                </div>
                            </div>
                            <div class="conclusion">
                                <p class="result_text">理论上经过充分测试的模型覆盖率应该接近100%，如果覆盖率小于90%，则模型存在安全隐患的可能性较大。
                                  由于深度网络参数过多，图片里进行压缩显示，每个圆点代表多个神经元，圆点的深度代表对应神经元被激活的比例，深蓝色为全部激活。对于超大模型，只显示前20层的激活情况，但覆盖率数值对应整个模型。</p>
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

export default {
  name:"coverageNeuralDialog",
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
      htmlTitle:"单神经元覆盖准则评估报告",
      res:{},
      mark:0
    }
  },
  created(){
    console.log('CoverageNeural created:',this.result)
    if ("CoverageNeural" in this.result){
      this.mark=0
      this.resultPro(this.result)
    }
  },
  watch:{
    result(newValue, oldValue){
      console.log('CoverageNeural:',this.result)
      if ("CoverageNeural" in newValue){
        this.mark=0
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
    /* result 处理*/
    resultPro(res){
        debugger;
        this.res.img_list = res.CoverageNeural.coverage_test_yz.coverage_neural;
        for(var i=0; i<this.res.img_list.length;i++){
            this.res.img_list[i]["coverage"] = parseInt(100*this.res.img_list[i]["coverage"]);
            this.res.img_list[i]["imgUrl"]='static/output'+this.res.img_list[i]["imgUrl"].split('output')[1];
        }
        this.play();
    },
    play:function(){
        setInterval(this.autoPlay, 2000)
    },
    autoPlay(){
            // debugger;
        this.mark++;
        if (this.mark == this.res.img_list.length){
            this.mark=0
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
  top: 40px;

}
#rdeva{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px;

    width: 960px;
    /* height: 414px; */
    height: auto;
    /* Inside auto layout */

    flex: none;
    order: 1;
    flex-grow: 0
}
.dialog-title{
  width: 370px;
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
    /* gray-7 */

    background: #F2F4F9;
    border-radius: 4px;
}
.graph_show {
    margin:10% auto;
    /* width: 400px; */
    height: 400px;
}
</style>