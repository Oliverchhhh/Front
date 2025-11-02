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
              <div class="dialog-title"><img src="../../assets/img/modularDevelopIcon.png" style="width: 50px; height: 50px;">AI模型模块化开发</div>
            </slot>
        </div>
        <div class="dialog_main" id="pdfDom" >
        <!--弹窗的内容-->
          <slot name="main">
            <div class="result_div">
              <div class="conclusion_info">
                  <!-- 显示输入信息：搜索方法、（初始化方法）、搜索迭代轮数、构建模型类型 -->
                  <p class="result_annotation">搜索方法：{{ postData.tuner }}</p>
                  <p class="result_annotation" v-if="postData.tuner == 'DREAM'">初始化方式：{{ postData.init }}</p>
                  <p class="result_annotation">搜索迭代轮数：{{ postData.iternum }}</p>
                  <p class="result_annotation">构建模型类型：{{ postData.model }}</p>
                  <p class="result_annotation">每次搜索训练轮数：{{ postData.epoch }}</p>
                  <p class="result_annotation">数据集：{{ postData.dataset }}</p>
              </div>
              <div class="result_row"> 
                  <div class="echart_title">         
                      <div class=" main_top_echarts_con_title ">准确率曲线</div>     
                      <div id="acc_echart" class="box"> </div>               
                  </div>
                  <div class="echart_title">
                      <div class=" main_top_echarts_con_title ">损失曲线</div>
                      <div id="loss_echart" class="box"> </div>     
                  </div>
              </div>
              
              <div id="rdeva">
                  <!-- 图表 -->
                  <div class="conclusion">
                      <p class="result_text">X轴代表每个方法迭代搜索的次数，左右两图纵轴分别是历史最优的准确率 {{  }}和损失函数数值 {{  }}</p>
                      <p class="result_text">两张图展示了各个搜索方法在不断迭代中逐渐找到准确率更高、损失更低的模型及参数等模块化的组合，最终为给定任务构造和开发一个性能优秀的模型。</p>
                  </div>
              </div>
            </div>
            <div class="button_group">
                <button class="downloadGenerationBtn" @click="PopDownloadShow"><a-icon type="download" />下载模型</button>
                <a-button @click="getPdf()" style="width:160px;height:50px;margin-bottom:30px;margin-top:10px;
                font-size:18px;color:white;background-color:rgb(46, 56, 245);border-radius:8px;">
                导出报告内容
                </a-button>
                <button class="downloadGenerationBtn" @click="PopInferenceShow">在线推理</button>
            </div>
            <popDialog :isShow="isShowPopDownload" v-show="isShowPopDownload" @on-close="closePopDownloadDialog">
                <div slot="header" class="pop_text">下载模型</div>
                <div slot="main">
                    <p  class="pop_content">请选择模型框架类型</p>
                    <div class="pop_button_group">
                    <button class="pop_button" @click="downloadGeneration" value="PyTorch"><a-icon type="download" />PyTorch</button>
                    <button class="pop_button" @click="downloadGeneration" value="TensorFlow"><a-icon type="download" />TensorFlow</button>
                    <button class="pop_button" @click="downloadGeneration" value="PaddlePaddle"><a-icon type="download" />PaddlePaddle</button>
                </div>
                </div>             
            </popDialog>
            <onlineProcess :isShow="isShowPopInfer" v-show="isShowPopInfer" @on-close="closePopInferenceDialog">
                <div slot="header">
                    <p class="pop_text">模型推理</p>
                    <div class="pop_button_group_">
                        <button class="pop_button" > <a-icon type="upload" />上传图片</button>
                        <button class="pop_button"  @click="onlineInference"><a-icon type="file-image" theme="twoTone" />在线推理</button>
                    </div>
                </div>
                <div slot="main">
                    <div class="pop_button_group_ inferclass">
                      <a-upload
                          name="avatar"
                          list-type="picture-card"
                          class="avatar-uploader"
                          :show-upload-list="false"
                          action="/Task/UploadPic"
                          :before-upload="beforeUpload"
                          @change="handleChange"
                      >
                          <img v-if="imageUrl" :src="imageUrl" alt="avatar" class="uploadShowImage"/>
                          <div v-else>
                          <a-icon :type="loading ? 'loading' : 'plus'" style="font-size: 19px;" />
                          <div class="ant-upload-text">
                              上传图片
                          </div>
                          </div>
                      </a-upload>
                  <button class="upload_buuton">预测结果{{ imgPre }}</button>
                </div>
                </div>             
            </onlineProcess>
               
          </slot>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import * as echarts from "echarts";
import popDialog from "../../components/popDialog.vue"
import onlineProcess from "../../components/onlineProcess.vue"
import {drawAcc_or_loss} from "../../assets/js/drawEcharts.js"
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  name:"modularDevelopDialog",
  components: {
    popDialog,onlineProcess
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
      htmlTitle:"模型模块化开发",
      loading:false,
      imageUrl: '',
      imgPre:'',
      res:{},
      /* 下载模型弹窗状态 */
      isShowPopDownload: false,
      /* 在线推理弹窗状态 */
      isShowPopInfer: false,
    }
  },
  created(){
    console.log('ModularDevelop created:',this.result)
    if ("ModularDevelop" in this.result){
      this.resultPro(this.result)
    }
  },
  watch:{
    result(newValue, oldValue){
      console.log('ModularDevelop:',this.result)
      if ("ModularDevelop" in newValue){
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
        this.imgPre = '';
        ev.stopPropagation();
    },
    handleChange(info) {
            if (info.file.status === 'uploading') {
                this.loading = true;
                return;
            }
            if (info.file.status === 'done') {
                // Get this url from response in real world.
                getBase64(info.file.originFileObj, imageUrl => {
                this.imageUrl = imageUrl;
                this.loading = false;
                });
            }
            this.imgPre = '';
            // console.log(this.imageUrl);
        },
        beforeUpload(file) {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                this.$message.error('You can only upload JPG/png file!');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('Image must smaller than 2MB!');
            }
            return isJpgOrPng && isLt2M;
        },
    //下载搜索模型    
    downloadGeneration(e){
      if (confirm("您确认下载模型？") ) {
          debugger
          // 下载生成测试样本
          var that = this;
          let path = this.result[e.target.value];
          // let file = 'static/output'+path.split('output')[1]; 
          // console.log(path.substring(path.lastIndexOf("/",path.lastIndexOf("/")-1)+1,path.lastIndexOf("/")));
          // let file = path.split('output')[0]+'output/cache/GeneratedCases/'+path.substring(path.lastIndexOf("/",path.lastIndexOf("/")-1)+1,path.lastIndexOf("/"));
          let param = new FormData();       // 创建form对象    
          param.append('file', path);       // 通过append向form对象添加数据
          param.append("type", 'dictionary'); // 添加form表单中其他数据
          that.post_file = param;
          let config = {
              headers: {'Content-Type': 'multipart/form-data'},
              responseType: "blob"
          };
          that.$axios.post("/Task/DownloadData",that.post_file, config).then((res)=>{
              console.log(res);
              var zipName = "Generation_Download"; // 下载的文件名
              let blob = new Blob([res.data], { type: "application/zip" }); // 下载格式为zip
              if ("download" in document.createElement("a")) {
                  let elink = document.createElement("a"); // 创建一个<a>标签
                  elink.style.display = "none"; // 隐藏标签
                  elink.href = window.URL.createObjectURL(blob); // 配置href
                  elink.download = zipName;
                  elink.click();
                  URL.revokeObjectURL(elink.href); // 释放URL 对象
                  document.body.removeChild(elink); // 移除<a>标签
              } else {
              //IE10+
              navigator.msSaveBlob(blob, zipName);
              }
          }).catch((err)=>{
              console.log(err)
          })
        }
    },
    /* 打开下载窗口 */
    PopDownloadShow(){
      this.isShowPopDownload=true;
    },
    /* 关闭下载窗口 */
    closePopDownloadDialog(){
        this.isShowPopDownload=false;
        //把绑定的弹窗数组 设为false即可关闭弹窗
    },
    /* 打开推理窗口 */
    PopInferenceShow(){
    this.isShowPopInfer=true;
    },
    /* 关闭推理窗口 */
    closePopInferenceDialog(){
        this.isShowPopInfer=false;
        //把绑定的弹窗数组 设为false即可关闭弹窗
    },
    //在线推理    
    onlineInference(){
      console.log("执行到这啦！");
      // console.log(this.res);
      // console.log(this.result);
      var that = this;
      that.$axios.post("/MDTest/ModelInference", {"model_path":that.res["TensorFlow"]}).then((res) => {
          that.imgPre = res.data["imageLabel"]
          console.log(that.imgPre);
          // 
      });
    },
    /* result 处理*/
    resultPro(res){
      debugger;
      let train_acc = res.ModularDevelop.best_history.accuracy;
      let train_loss = res.ModularDevelop.best_history.loss;
      let val_acc = res.ModularDevelop.best_history.val_accuracy;
      let val_loss = res.ModularDevelop.best_history.val_loss;
      drawAcc_or_loss("acc_echart", [train_acc, val_acc], ["训练准确率", "验证准确率"]);  
      drawAcc_or_loss("loss_echart", [train_loss,val_loss], ["训练损失", "验证损失"]); 
      this.res["PyTorch"] = res.ModularDevelop.target_torch;
      this.res["Tensorflow"] = res.ModularDevelop.target_tensorflow;
      this.res["PaddlePaddle"] = res.ModularDevelop.target_paddle;
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
.ant-upload-picture-card-wrapper {
    width: 50%;
}

.result_div{
   display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px 60px;
    gap: 24px;
    width: 1080px;
    height: fit-content;
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
    justify-content: flex-start;
    align-items: center;
    padding: 20px;
    gap: 10px;
    margin-bottom: 20px;
    width: 1080px;
    background: #F2F4F9;
    border-radius: 4px;
    flex-wrap: wrap; 
}
.result_annotation {
    width: 200px
}
.result_row{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin: 5% 0;
}

/* 图表名称样式 */
.echart_title{
   display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px 120px;
    gap: 4px;
    width: 500px;
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}
.box{
    height: 350px;
    width: 450px;
    /* overflow: overlay; */
    overflow-y: scroll;
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
/* pop下载模型与在线推理css */
.button_group{
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
    padding: 20px;
}
.pop_text{
    font-family: HONOR Sans CN;
    font-size: 20px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0em;
    text-align: left;
    width: 100px;
    height: 30px;
}

.pop_content{
    font-family: HONOR Sans CN;
    font-size: 16px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0em;
    text-align: left;
    width: 450px;
    height: 20px;
}

.pop_button{
    font-size: 16px;
    width: 150px;
    gap: 0;
    padding: 0;

    flex-direction: row;
    justify-content: center;
    align-items: center;

    height: 40px;
    left: calc(50% - 248px/2);
    bottom: 40px;
    background: #FFFFFF;
    border-radius: 6px;
    border-color: #0B55F4;
    font-family: 'HONOR Sans CN';
    font-style: normal;
    font-weight: 400;
    /* font-size: 22px; */
    line-height: 22px;
    color: #0B55F4;
}
.upload_buuton{
    font-size: 16px;
    width: 200px;
    gap: 0;
    padding: 0;

    flex-direction: row;
    justify-content: center;
    align-items: center;

    height: 200px;
    left: calc(50% - 248px/2);
    bottom: 40px;
    background: #FFFFFF;
    border-radius: 6px;
    border-color: #0B55F4;
    font-family: 'HONOR Sans CN';
    font-style: normal;
    font-weight: 400;
    /* font-size: 22px; */
    line-height: 22px;
    color: #0B55F4;
}
.pop_button_group_{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    /* gap: 8px; */
    /* padding: 20px 0; */
}

.pop_button_group_ .pop_button{
    width: 200px;
}
.pop_button_group_ button:first-of-type{
    background: #0B55F4;
    color: white;
}
.pop_button_group_ button:last-of-type{
    background: white;
    color: #0B55F4;
}

.inferclass {
    margin: 20px 0;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: flex-start;
    gap: 45px;
}
.inferclass button:first-of-type {
    color: #0B55F4;
    background: #EEF5FF;
    border: dashed 1px #8DBBFB;
}

.inferclass button:last-of-type {
    color: #3E4453;
    background: #F2F4F9;
    /* border: dashed 1px #F2F4F9; */
    height: 165px;
    width: 165px;
}
</style>