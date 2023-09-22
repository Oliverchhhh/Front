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
                    <div class="dialog-title"><img src="../../assets/img/crowdDefenseIcon.png" style="width: 50px; height: 50px;">模型群智化防御</div>
                  </slot>
              </div>
              <div class="dialog_main" id="pdfDom" >
              <!--弹窗的内容-->
                  <slot name="main">
                    <!-- 攻击信息 -->
                    <!-- <div v-if="Object.keys(postData).length > 0" style="background: var(--gray-7, #F2F4F9);;width: 100%;padding: 24px;"> -->
                    <div  style="background: var(--gray-7, #F2F4F9);;width: 100%;padding: 24px;">
                      <a-row >
                        <a-col :span="2">
                          <div class="grid-content-name" style="color:#6C7385">数据集:</div>
        
                        </a-col>
                        <a-col :span="5">
                          <div class="grid-content-value">{{postData.DatasetParam.name}}</div>

                        </a-col>
                        <a-col :span="2">
                          <div class="grid-content-name" style="color:#6C7385">模型:</div>

                        </a-col>
                        <a-col :span="5">
                          <div class="grid-content-value">{{postData.ModelParam.name}}</div>
 
                        </a-col>
                        <a-col :span="2">
                          <div class="grid-content-name" style="color:#6C7385">攻击方法:</div>
     
                        </a-col>
                        <a-col :span="8">
                          <div class="grid-content-value">{{defenseShow(postData.AdvMethods)}}</div>
                        </a-col>
                        <a-col :span="2">
                          <div class="grid-content-name" style="color:#6C7385">群智化防御方法:</div>
     
                        </a-col>
                        <a-col :span="8">
                          <div class="grid-content-value">{{ defenseShow(postData.DefMethod) }}</div>
                        </a-col>
                      </a-row>
                    </div>
                    <!-- 原始准确率 & 受攻击后的准确率 -->
                    <div>
                      <div class="result-title">受攻击前后的准确率变化</div>
                      <div id="acc_ori" class="echart" style="width: 1000px; height: 400px;"></div>
                      <div class="conclusion">
                        <p class="result_text ">本次测试受{{sub_acc_method}}攻击后的准确率下降最大，下降幅度为{{max_sub_acc}}</p>
                      </div>
                    </div>
                    <!-- 不同攻击方法的攻击成功率 -->
                    <div>
                      <div class="result-title">不同攻击方法的攻击成功率对比</div>
                      <div id="asr_ori" class="echart" style="width: 1000px; height: 400px;"></div>
                      <div class="conclusion">
                        <p class="result_text ">本次测试{{method}}攻击算法的攻击成功率最高，最高为{{max_asr}}</p>
                      </div>
                    </div>
                    <!-- 对抗训练后的攻击成功率 -->
                    <!-- 对抗训练后的准确率 -->
                    <!--  -->
                    <!-- Nash博弈结果 -->
                    <div > 
                      <div class="result-title">准确率收益直方图</div>
                      <div id="acc_Chart" class="echart" style="width: 1000px; height: 400px;"></div>
                      <!-- <div class="conclusion">
                        <p class="result_text ">从结果中可以看到，在测试的几种攻击中，其中攻击效果最佳的为{{res.maxmethod}}，攻击成功率为{{res.maxasr}},{{ res.mintimemethod }}所花费的时间最少，而{{ res.maxtimemethod }}类攻击所花费的时间最多，但是其达到的准确率也较高</p>
                      </div> -->
                      <div class="result-title">鲁棒性收益矩阵</div>
                      <div id="rob_Chart" class="echart" style="width: 1000px; height: 400px;"></div>
                      <!-- <div class="conclusion">
                        <p class="result_text ">从结果中可以看到，在测试的几种攻击中，其中攻击效果最佳的为{{res.maxmethod}}，攻击成功率为{{res.maxasr}},{{ res.mintimemethod }}所花费的时间最少，而{{ res.maxtimemethod }}类攻击所花费的时间最多，但是其达到的准确率也较高</p>
                      </div> -->
                      <div class="result-title">博弈策略收益曲线</div>
                      <div id="bal_Chart" class="echart" style="width: 1000px; height: 400px;"></div>
                      <div class="conclusion">
                        <p class="result_text ">Nash博弈结论</p>
                      </div>
                    </div>
                    <!-- 评估详情 -->

                    <div class="result-title">防御模型在各种攻击下的准确率变化</div>
                    <div>
                      
                      <!-- 待修改：柱状图 -->
                      <div id="myChart" class="echart" style="width: 1000px; height: 400px;"></div>
                      <div class="conclusion">
                        <p class="result_text ">集成防御与自动化攻击检测PACA解释</p>
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
      //下面这些属性会绑定到div上面 详情参照上面的html结构
      // 如： :style="{top:topDistance+'%',width:widNum+'%'}"
      widNum:{
      //内容宽度
      type: Number,
      default:50
      },
      leftSite:{
      // 左定位
      type: Number,
      default:25.2
      },
      topDistance: {
      //top上边距
      type: Number,
      default:10
      },
      pdt:{
      //上padding
      type: Number,
      default:22
      },
      pdb:{
      //下padding
      type: Number,
      default:47
      }
      },
      
  data() {
    return {
      htmlTitle:"群智化防御报告",
      res:{},
      postData:{
        // 静态结果
        "DatasetParam": {"name":"MNIST"},
        "ModelParam": {"name":"ResNet34"},
      },
      selectPicList: [
        ["攻击方法", "加噪前", "噪声", "加噪后"],
        ]
    }
  },
  watch:{
    result(newValue, oldValue){
      if ("Defense_Ensemble" in newValue){

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
        //code
        this.res.labels = [];
        this.res.maxasr = 0
        this.res.maxmethod = ""
        this.res.ASRlist = []
        this.res.timelist = []
        this.res.maxtime = 0
        this.res.mintime = 100
        this.res.maxtimemethod = ""
        this.res.mintimemethod = ""
        this.res.timelist = []
        for(let temp in this.result.adv_attack){
          if( ["stop","tid", "stidlist"] .indexOf(temp) == -1){
            if (this.res.maxasr < this.result.adv_attack[temp].asr){
              this.res.maxasr = this.result.adv_attack[temp].asr.toFixed(2)
              this.res.maxmethod = temp
            }
            if (this.res.maxtime < this.result.adv_attack[temp].time){
              this.res.maxtime = this.result.adv_attack[temp].time
              this.res.maxtimemethod = temp
            }
            if (this.res.mintime > this.result.adv_attack[temp].time){
              this.res.mintime = this.result.adv_attack[temp].time
              this.res.mintimemethod = temp
            }
            this.res.labels.push(temp)
            this.res.ASRlist.push(this.result.adv_attack[temp].asr.toFixed(2))
            this.res.timelist.push(this.result.adv_attack[temp].time.toFixed(4))
            let bef_dirname = './static/output'+this.result.adv_attack[temp].pic[0].split("output")[1]
            let adv_dirname = './static/output'+this.result.adv_attack[temp].pic[1].split("output")[1]
            let per_dirname = './static/output'+this.result.adv_attack[temp].pic[2].split("output")[1]
            this.selectPicList.push([temp, [[`${bef_dirname}`], "pic"], [[`${per_dirname}`], "pic"],[[`${adv_dirname}`], "pic"]])
          }
        }
        this.res["score"] = 100-this.res.maxasr
        if(this.res["score"] >= 80 ){
          this.res["Eva"] = "优秀"
        }else if (this.res["score"] <80 && this.res["score"] >=60 ){
          this.res["Eva"] = "良好"
        }else{
          this.res["Eva"] = "差"
        }
        let methodstr = this.defenseShow(this.postData.Method)
        this.res["score_des"] = `${this.postData.Model}模型鲁棒性得分为${this.res.score}，是一个较${this.res.Eva}的模型，本次对抗攻击方法有${methodstr}，其中${this.res.maxmethod}的攻击效果最佳`
        let option = {
          xAxis: {
            type: 'category',
            name:"算法名称",
            data: this.res.labels
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: '{c}%'
          },
          yAxis: {
            name:"攻击成功率",
            type: 'value',
            axisLabel: {
              formatter: '{value} %'
            },
            min:0,
            max:100,
          },
          series: [
            {
              data: this.res.ASRlist,
              type: 'bar'
            }
          ]
        }
        
        setTimeout(function(){let myChart = echarts.init(document.getElementById("myChart"));
          option && myChart.setOption(option);
        },500)

        
        let option2 = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: '{c}s'
          },
          xAxis: {
            name:"算法名称",
            type: 'category',
            data: this.res.labels
          },
          yAxis: {
            name:"运行时间（单位：s）",
            type: 'value'
          },
          series: [
            {
              data: this.res.timelist,
              type: 'bar'
            }
          ]
        }
        setTimeout(function(){
          let timechart = echarts.init(document.getElementById("timeChart"));
          option2 && timechart.setOption(option2);
        },500)
      }
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
.foot_close{
  background: #5196FF;
  border-radius: 4px;
  width: 143px;
  height: 50px;
}
.dialog-title{
  display: inline;
  margin-top: 38px;
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
.describe {
  font-family: 'HONOR Sans CN';
  font-size: 16px;
  color: #000000;
  letter-spacing: 0;
  text-align: center;
}
.result-subtitle {
  margin-top: 20px;
  color: var(--light-fontgray-4-title, rgba(0, 0, 0, 0.90));
  text-align: center;
  font-family: HONOR Sans CN;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 28px;
}

</style>