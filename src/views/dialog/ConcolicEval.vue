<template>
  <div class="dialog">
    <!--外层的遮罩 点击事件用来关闭弹窗，isShow控制弹窗显示 隐藏的props-->
    <div class="dialog-cover"  v-if="isShow" @click="closeMyself"></div>
    <!-- transition 这里可以加一些简单的动画效果 -->
    <transition name="drop">
        <!--style 通过props 控制内容的样式 -->
      <div class="dialog-content" v-if="isShow" @click.stop="_stopPropagation($event)">
        <div class="dialog_head">
          <!--弹窗头部 title-->
          <div class="close_button">
            <a-icon type="close" @click="closeMyself" style="font-size: 20px;color:#6C7385;" class="closebutton"/>
          </div>
          <slot name="header">
            <div class="dialog-title"><img src="../../assets/img/concolicIcon.png" style="width: 50px; height: 50px;">测试样本自动生成</div>
          </slot>
        </div>
        <div class="dialog_main" id="pdfDom" >
        <!--弹窗的内容-->
          <slot name="main">
            <!-- 攻击信息 -->
            <div v-if="Object.keys(postData).length > 0" style="background: var(--gray-7, #F2F4F9);;width: 100%;padding: 24px;">
              <a-row >
                <a-col :span="2">
                  <div class="grid-content-name" style="color:#6C7385">数据集：</div>

                </a-col>
                <a-col :span="4">
                  <div class="grid-content-value">{{postData.dataname}}</div>

                </a-col>
                <a-col :span="2">
                  <div class="grid-content-name" style="color:#6C7385">模型：</div>

                </a-col>
                <a-col :span="4">
                  <div class="grid-content-value">{{postData.modelname}}</div>
                </a-col>
                <a-col :span="2">
                  <div class="grid-content-name" style="color:#6C7385">约束范式：</div>

                </a-col>
                <a-col :span="4">
                  <div class="grid-content-value">{{postData.norm}}</div>
                  <!-- <div class="grid-content-value">70 亿</div> -->
                </a-col>
                <a-col :span="2">
                  <div class="grid-content-name" style="color:#6C7385">动态符号执行次数：</div>

                </a-col>
                <a-col :span="4">
                  <div class="grid-content-value">{{postData.times}}</div>
                </a-col>
              </a-row>
            </div>
            <!-- 总得分 -->
            <div>
              <div class=" main_top_echarts_con_title ">样本生成结果示意图</div>
              <div class="echart_title">        
                <p class="title_annotation">合计生成测试样本数量：{{ res.allnumber }}</p>
                <p class="title_annotation">实时生成测试样本数量： {{ res.newnumber }}</p>  
              </div>
              <div id="rdeva">
                <resultTable :tableHead="tablehead" :tableBody="tablebody"></resultTable>
                <div class="conclusion">
                    <p class="result_text">最左侧图片为原始的种子样本，最右侧为自动生成的新样本，中间列展示了两张图片的改变了哪些像素点的RGB通道值，为了展示明显施加了二值化操作即如果某个像素值被修改则为255否则为0。</p>
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
import resultTable from "../../components/resultsTable.vue"
export default {
  name:"resultDialog",
  components: {
    resultTable
  },
  props: {
    isShow: {
      //弹窗组件是否显示 默认不显示
      type: Boolean,
      default: false,
      required:true, //必须
    },
    result:{},
    postData:{}
  },
     
  data() {
    return {
      htmlTitle:"测试样本自动生成报告",
      echart_init: false,
      res:{},
      tablehead: [],
      tablebody: [],
    }
  },
  created(){
    console.log('concliccreated:',this.result)
    if ("Concolic" in this.result){
      this.updated()
    }
  },
  watch:{
    result(newValue, oldValue){
      console.log('conclic:',this.result)
      if ("Concolic" in newValue){
        this.updated()
      }
    }
    
  },
  // props:["is-show","top-distance"],
  methods: {
    closeMyself() {
      this.$emit("on-close");
      //如果需要传参的话，可以在"on-close"后面再加参数，然后在父组件的函数里接收就可以了。
    },
    _stopPropagation(ev){
      var _this = this;
      ev.stopPropagation();
    },
    // 防御方法参数显示-
    defenseShow(method=[]){
      // let param = JSON.parse(method);
      return method.join('、');
    },
    updated(){
      this.res["allnumber"] = this.result.Concolic.allnumber;
      this.res["newnumber"] = this.result.Concolic.newnumber;
      this.res.demopath = this.result.Concolic.demopath;
      this.tablehead = ["原始样本", "二值化差异", "动态符号生成样本"];
      this.tablebody = [];
      for (var i=0;i<Object.keys(this.res.demopath).length/3;i++) {
        let init_img = this.res.demopath[i+"_init"].split('output');
        let diff_img = this.res.demopath[i+"_diff"].split('output');
        let new_img = this.res.demopath[i+"_new"].split('output');

        var tablebody_tr = ['static/output'+init_img[1], 'static/output'+diff_img[1], 'static/output'+new_img[1]];
        this.tablebody.push(tablebody_tr);
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
  /* display: inline;
  margin-top: 38px; */
  width: 279px;
  height: 36px;
  font-family: 'HONOR Sans CN';
  font-size: 24px;
  color: #333333;
  letter-spacing: 0;
  line-height: 48px;
  font-weight: 600;
}
/* 图表名称样式 */
.echart_title{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px 0px;
    gap: 10px;
    isolation: isolate;

    width: 960px;
    height: auto;
    /* Inside auto layout */
    flex: none;
    order: 1;
    flex-grow: 0;
}
/* 得分图div */
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
.title_annotation{
    /* width: 217px;
    height: 24px; */

    font-family: 'HONOR Sans CN';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    /* identical to box height, or 150% */

    display: flex;
    align-items: center;
    text-align: center;

    /* Untitled/gray-1 */

    color: #000000;


    /* Inside auto layout */

    flex: none;
    order: 0;
    flex-grow: 0;
}
</style>