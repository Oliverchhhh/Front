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
                    <div class="dialog-title"><img src="../../assets/img/frameworkTestIcon.png" style="width: 50px; height: 50px;">开发框架安全结构度量</div>
                  </slot>
              </div>
              <div class="dialog_main" id="pdfDom" >
              <!--弹窗的内容-->
                  <slot name="main">
                    <div class="result_div">
                        <div class="conclusion_info">
                            <!-- 显示输入信息：检测类型、数据集/清洗类型 -->
                            <p class="result_annotation">检测框架：</p>
                            <div class="result_annotation result_pro"><p v-for="(item, index) in postData.framework" :key="index">{{item}}</p></div>
                            <!-- <p class="result_annotation">当前系统Cuda版本：{{ result.result.EnvTest.detection_result['Current Cuda Version'] }}</p> -->
                            <p class="result_annotation">待检测模型：{{ postData.model }}</p>
                        </div>
                       <div class="echart_title">         
                           <div class=" main_top_echarts_con_title ">触发漏洞样本展示</div>                    
                       </div>
                       <div>
                            <resultTable :tableHead="res.tablehead" :tableBody="res.tablebody"></resultTable>
                       </div>
                       <div class="echart_title">
                           <div class=" main_top_echarts_con_title ">模型漏洞层定位</div>
                       </div>
                       
                       <div id="rdeva">
                           <!-- 图表 -->
                           <div class="box">
                                <img id="model_img" :src="res.model_url">
                           </div>
                           <div class="conclusion">
                                <p>存在漏洞的开发框架为</p> <p v-for="(item, index) in res.bugger_backend" :key="index">{{ item }}</p><p>，</p>
                                <p>定位漏洞层为 {{ res.buggy_layer}}</p>
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
import resultTable from "../../components/resultsTable.vue"
export default {
  name:"frameworkTestDialog",
  components: {
    resultTable: resultTable
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
      htmlTitle:"开发框架安全结构度量",
      res:{}
    }
  },
  created(){
    console.log('FrameworkTest reated:',this.result)
    if ("FrameworkTest" in this.result){
      this.resultPro(this.result)
    }
  },
  watch:{
    result(newValue, oldValue){
      console.log('FrameworkTest:',this.result)
      if ("FrameworkTest" in newValue){
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
            this.res = res.FrameworkTest;
            this.res.tablehead = ["触发样本", "正确标签",]
            this.res.tablebody = []
            var generate_fig_number = this.res.generate_figure.length;
            for(var i=0; i<generate_fig_number; i++) {
                var res = "figure-"+String(i);
                this.res[res]["path"] = 'static/output/'+this.res.out_path.split('output')[1] +"/"+ this.res[res]["path"].split("/")[1];
                var error_frame = this.res[res]["path"].split("bgbk")[1].slice(0,-6);
                // 构造表格【行】
                // var tablebody_tr = ["<img :src='{{this.res[res]['path']}}'>", this.res[res]["ground_truth"]];
                var tablebody_tr = [this.res[res]['path'], this.res[res]["ground_truth"]];
                for(var j=0;j<this.res.normal_backend.length;j++){
                    tablebody_tr.push(this.res[res]["normal_backend_result"]);
                };
                tablebody_tr.push(this.res[res]["buggy_backend_result"])
                // console.log(tablebody_tr);
                // 将表格【行】添加到表格主题中
                debugger;
                this.res.tablebody.push(tablebody_tr);
            };
            for(var i in this.res.normal_backend) {
                switch(this.res.normal_backend[i]) {
                    case 'torch':
                        this.res.normal_backend[i]='Pytorch';
                        break;
                    case 'theano':
                        this.res.normal_backend[i] = "Theano";
                        break;
                    case 'paddle':
                        this.res.normal_backend[i] = "PaddlePaddle";
                        break;
                    case 'tensorflow':
                        this.res.normal_backend[i] = 'TensorFlow';
                        break;
                    case 'cntk':
                        this.res.normal_backend[i] = 'CNTK';
                        break;
                }
                // 将所需值添加到tablehead
                this.res.tablehead.push(this.res.normal_backend[i]);
            }
            for(var i in this.res.buggy_backend) {
                var temp_var = this.res.buggy_backend[i];
                switch(this.res.buggy_backend[i]) {
                    case 'torch':
                        this.res.buggy_backend[i]='Pytorch';
                        break;
                    case 'theano':
                        this.res.buggy_backend[i] = "Theano";
                        break;
                    case 'paddle':
                        this.res.buggy_backend[i] = "PaddlePaddle";
                        break;
                    case 'tensorflow':
                        this.res.buggy_backend[i] = 'TensorFlow';
                        break;
                    case 'cntk':
                        this.res.buggy_backend[i] = 'CNTK';
                        break;
                }
                if (temp_var == error_frame) {
                this.res.tablehead.push(this.res.buggy_backend[i]);
                };
            };
            this.res.normal_backend = this.res.normal_backend;
            this.res.bugger_backend = this.res.buggy_backend;
            this.res.buggy_layer = this.res.buggy_layer["0"];
            this.res.model_url = 'static/output/'+this.res.out_path.split('output')[1]+"/model.png";       
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
.result_div{
   display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px 60px;
    gap: 24px;

    width: 1080px;
    /* height: 1134px; */


    /* Inside auto layout */

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
    margin: auto;
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
    /* gray-7 */

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
    margin: 0 0 0 -20px;
}

/* 图表名称样式 */
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
#rdeva{
   display: flex;
flex-direction: column;
align-items: center;
padding: 0px;
gap: 24px;
width: 960px;
flex: none;
order: 1;
flex-grow: 0
}

.box{
    height: 350px;
    width: 960px;
    /* overflow: overlay; */
    overflow-y: scroll;
}
#model_img {
    height: auto;
    width: 500px;
    overflow: hidden;
}
 
/* 得分图echart */
.conclusion{
   box-sizing: border-box;

/* Auto layout */

display: flex;
flex-direction: row;
justify-content: center;
align-items: left;
padding: 24px;
gap: 8px;

width: 960px;
/* height: 144px; */

/* gray-7 */

background: #F2F4F9;
border-radius: 4px;

/* Inside auto layout */

flex: none;
order: 2;
flex-grow: 0;
}
</style>