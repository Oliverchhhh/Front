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
                    <div class="dialog-title"><img src="../../assets/img/dataCleanIcon.png" style="width: 50px; height: 50px;">异常数据检测结果报告</div>
                  </slot>
              </div>
              <div class="dialog_main" id="pdfDom" >
              <!--弹窗的内容-->
                  <slot name="main">
                    <!-- 总评分 -->
                    <div class="result_div">
                        <div class="conclusion_info">
                            <!-- 显示输入信息：检测类型、数据集/清洗类型 -->
                            <p class="result_annotation" v-if=" res.dataset_or_format == 'table'">检测类型：低维数据</p>
                            <p class="result_annotation" v-if="res.dataset_or_format == 'txt_encode' | res.dataset_or_format == 'txt_format'">检测类型：文本数据</p>
                            <p class="result_annotation" v-if="res.dataset_or_format == 'MNIST' | res.dataset_or_format == 'CIFAR10'">检测类型：图像数据</p>
                            <p class="result_annotation"  v-if="res.dataset_or_format == 'txt_encode' | res.dataset_or_format == 'txt_format'">文本格式：{{res.dataset_or_format}}</p> 
                            <p class="result_annotation" v-else>数据集：{{res.dataset_or_format}}</p>
                        </div>
                        <div class="g_score_content">
                            <div class="scorebg">
                                <div class=" main_top_echarts_con_title ">修复率</div>
                                <!-- 显示分数 -->
                                <p class="g_score"> {{res.score}}%</p>
                            </div>
                            <!-- 仅图像类型数据显示评分计算 -->
                            <div class="conclusion" v-if="res.dataset_or_format == 'MNIST' | res.dataset_or_format == 'CIFAR10'">
                                <p class="result_annotation">对{{ res.num_images }}张图片进行检测，检测到{{ res.num_detect}}张异常数据，使用Cleanlab算法对异常数据进行修复，修复率为{{ res.score }}%</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 图表 -->
                    <div class="result_div">                        
                        <div class="echart_title">                           
                            <div class=" main_top_echarts_con_title " v-if="res.dataset_or_format=='table'">低维数据修复结果</div>
                            <div class=" main_top_echarts_con_title " v-if="res.dataset_or_format == 'txt_encode' | res.dataset_or_format == 'txt_format'">文本数据清洗结果</div>
                            <div class=" main_top_echarts_con_title " v-if="res.dataset_or_format == 'MNIST' | res.dataset_or_format == 'CIFAR10'">检出标签错误示例</div>
                            <!-- <p class="title_annotation">标题说明，可无</p> -->
                        </div>
                        <div id="rdeva">
                            <!-- 图表 -->
                            <!-- <div id = 'conseva'></div> -->
                            <div class="table_class_result" v-if="res.dataset_or_format=='table'">
                                <img :src="res.table_origin">
                                <img :src="res.table_fix">
                                <!-- <img :src="res.table_origin">
                                <img :src="res.table_fix"> -->
                            </div>
                            <div class="text_class_result" v-if="res.dataset_or_format == 'txt_encode' | res.dataset_or_format == 'txt_format'">
                                <p>{{ res.text_origin }}</p>
                                <p>{{ res.text_clean }}</p>
                            </div>
                            <div class="image_class_result" v-if="res.dataset_or_format == 'MNIST' | res.dataset_or_format == 'CIFAR10'">
                                <!-- 替换为返回图像 -->
                                <!-- <img :src="res.demo_img"> -->
                                <img :src="res.demo_img">
                            </div>
                            <div class="conclusion">
                                <p class="result_text" v-if="res.dataset_or_format=='table'">图为低维数据清洗结果，图中黑点为真实离群样本点，黄点为真实良性样本点，绿线展示分类决策边界，在绿色范围内的即为清洗后的样本点。</p>
                                <p class="result_text" v-if="res.dataset_or_format == 'txt_encode' | res.dataset_or_format == 'txt_format'">左侧展示的是清洗前的文本数据，右侧展示的是清洗后的文本数据。</p>
                                <p class="result_text" v-if="res.dataset_or_format == 'MNIST' | res.dataset_or_format == 'CIFAR10'">图示为检测出的标签错误样本，其中蓝色框展示该样本原始标签及程序判别其可信度，灰色框展示该样本在数据集内的编号，绿色框内展示清洗后标签及可信度。</p>
                            </div>
                        </div>
                        
                        <!-- <button class="exportResultBtn" @click="exportResult"><a-icon type="upload" />导出报告内容</button> -->
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
import {drawconseva1, drawbarimproved, drawCorelationHeat, drawPopGraph} from "../../assets/js/drawEcharts.js"
import centerPng from "../../assets/img/center.png"
import secondPng from "../../assets/img/second.png"
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
      htmlTitle:"模型公平性提升报告",
      res:{}
    }
  },
  created(){
    console.log('DataClean created:',this.result)
    if ("DataClean" in this.result){
      this.resultPro(this.result)
    }
  },
  watch:{
    result(newValue, oldValue){
      console.log('DataClean:',this.result)
      if ("DataClean" in newValue){
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
            this.res = {};
            this.res["score"] = parseInt(100*res.DataClean.fix_rate);
            this.res["dataset_or_format"] = this.postData.dataset;
            if(this.res["dataset_or_format"]=="table") {
                let tmp_path_ori = res.DataClean.result_origin.split('output');
                let tmp_path_cle = res.DataClean.result_clean.split('output');                
                this.res["table_origin"] = 'static/output'+tmp_path_ori[1];
                this.res["table_fix"]= 'static/output'+tmp_path_cle[1];
            }
            else if(this.res["dataset_or_format"] =='MNIST' | this.res["dataset_or_format"] =='CIFAR10'){
                this.res["num_images"]=res.DataClean.num_images;
                this.res["num_detect"]=res.DataClean.num_detect;
                let tmp_path = res.DataClean.result.split('output');
                this.res["demo_img"]='static/output'+tmp_path[1];
            }else{
                this.res["text_origin"]=res.DataClean.before;
                this.res["text_clean"]=res.DataClean.after;
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
/* .result_text{
  text-align: left;
} */
.table_class_result img{
    width: 400px;
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
.text_class_result p{
    float: left;
    word-break: break-all;
    width: 450px;
}
.dialog-title{
  width: 300px;
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
    height: fit-content;
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}
.g_score{
    width: fit-content;
    font-size: 60px
}
#rdeva{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px;
    width: 960px;
    height: fit-content;
    flex: none;
    flex-grow: 0
}
.table_class_result{
    width: 1000px;
    height: initial;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: flex-start;
}
.text_class_result{
    width: 1000px;
    height: initial;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: flex-start;
}
.image_class_result{
    width: 100%;
    height: 100%;
}
.image_class_result img{
    width: 800px;
}
.conclusion_info{
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 20px;
    gap: 25px;
    margin-bottom: 20px;
    width: 1080px;
    background: #F2F4F9;
    border-radius: 4px;
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
</style>