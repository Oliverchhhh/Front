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
                    <div class="dialog-title"><img src="../../assets/img/modelEvaIcon.png" style="width: 50px; height: 50px;">对抗攻击评估</div>
                  </slot>
              </div>
              <div class="dialog_main" id="pdfDom" >
              <!--弹窗的内容-->
                  <slot name="main">
                    <!-- 攻击信息 -->
                    <div v-if="Object.keys(postData).length > 0" style="background: var(--gray-7, #F2F4F9);;width: 100%;padding: 24px;">
                      <a-row >
                        
                        <a-col :span="2">
                          <div class="grid-content-name" style="color:#6C7385">模型:</div>

                        </a-col>
                        <a-col :span="5">
                          <div class="grid-content-value">{{postData.model}}</div>
 
                        </a-col>
                        <a-col :span="2">
                          <div class="grid-content-name" style="color:#6C7385">攻击方法:</div>
     
                        </a-col>
                        <a-col :span="5">
                          <div class="grid-content-value">LLM attack</div>
                        </a-col>
                        <a-col :span="2">
                          <div class="grid-content-name" style="color:#6C7385">参数规模:</div>
     
                        </a-col>
                        <a-col :span="8">
                          <div class="grid-content-value">{{result.LLM_attack.LLMparams}}</div>
                          <!-- <div class="grid-content-value">70 亿</div> -->
                        </a-col>
                      </a-row>
                    </div>
                    <!-- 总得分 -->
                 
                    
                    <!-- 评估详情 -->
                    <div class="result-title">对抗攻击样本示例</div>
                    <div class="content_div">
                      <div>
                      <p class="llm_title">输入样本:</p>
                      <div class="conclusion">
                        
                        <p class="result_text " v-for="(goal,index) in result['LLM_attack'].params.goals" :key="'goal'+index">{{goal}}</p>
                      </div>
                    </div>
                    <div>
                      <p class="llm_title">预期输出:</p>
                      <div class="conclusion">
                        
                        <p class="result_text " v-for="(target, index) in result['LLM_attack'].params.targets" :key="'target'+index">{{target}}</p>
                      </div>
                    </div>
                    <div>
                      <p class="llm_title">对抗文本:</p>
                      <div class="conclusion">
                        
                        <p class="result_text " v-for="(control, index) in result['LLM_attack'].controls" :key="'control'+index">{{control}}</p>
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
import PictureTable from "../../components/pictureTable.vue";
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
      },
      
  data() {
    return {
      htmlTitle:"对抗攻击评估报告",
      
    }
  },
  created(){
    console.log('LLM_attack reated:',this.result)
    if ("LLM_attack" in this.result){
      console.log('LLM_attack reated:',this.result)
    }
  },
  watch:{
    result(newValue, oldValue){
      console.log('LLM_attack:',this.result)
      if ("LLM_attack" in newValue){
        console.log('LLM_attack reated:',this.result)
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
.llm_title{
  color: #000;
  font-family: HONOR Sans CN;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 28px; /* 140% */
  margin-bottom: 18px;
  text-align:left
}
</style>