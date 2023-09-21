<template>
  <div class="dialog">
    <!--外层的遮罩 点击事件用来关闭弹窗，isShow控制弹窗显示 隐藏的props-->
    <div class="dialog-cover back" v-if="isShow" @click="closeMyself"></div>
    <!-- transition 这里可以加一些简单的动画效果 -->
    <transition name="drop">
      <!--style 通过props 控制内容的样式 -->
      <div class="dialog-content" v-if="isShow" @click.stop="_stopPropagation($event)">
        <div class="dialog_head back">
          <!--弹窗头部 title-->
          <div class="close_button">
            <a-icon type="close" @click="closeMyself" style="font-size: 20px;color:#6C7385;" class="closebutton" />
          </div>
          <slot name="header">
            <div class="dialog-title"><img src="../../assets/img/modelEvaIcon.png"
                style="width: 50px; height: 50px;">后门攻击评估</div>
          </slot>
        </div>
        <div class="dialog_main" id="pdfDom">
          <!--弹窗的内容-->
          <slot name="main">
            <!-- 防御信息 -->
            <div v-if="Object.keys(postData).length > 0" style="background-color: #F2F4F9;width: 100%; padding: 24px;">
              <a-row >
                <a-col :span="2">
                  <div class="grid-content-name" style="color:#6C7385">数据集:</div>
                </a-col>
                <a-col :span="5">
                  <div class="grid-content-value">{{postData.Dataset}}</div>
                </a-col>
                <a-col :span="2">
                  <div class="grid-content-name" style="color:#6C7385">模型:</div>
                </a-col>
                <a-col :span="5">
                  <div class="grid-content-value">{{postData.Model}}</div>
                </a-col>
                <a-col :span="2">
                  <div class="grid-content-name" style="color:#6C7385">投毒方法:</div>
                </a-col>
                <a-col :span="8">
                  <div v-for="temp in defenseShow(postData.Method)">
                    <div  class="grid-content-value" >{{temp}}</div>
                  </div>
                </a-col>
              </a-row>
            </div>

            <!-- 总得分 -->
            <div class="result-title">模型鲁棒性得分</div>
            <div style="position:relative;">
              <div style="width: 300px; height: 300px; position: absolute; text-align: center; line-height: 230px;
                          font-size: 80px; color: white; font-weight: bold;
                          "> {{res.score}} </div>
              <div style="width: 300px; height: 300px; position: absolute; text-align: center; line-height: 330px;
                          font-size: 20px; color: white;
                          ">  {{res.Eva}}  </div>
              <img style="width: 300px; height: 300px;" src="../../assets/img/score.png">
            </div>
            <div class="describe " style="width: 960px;padding:24px">{{res.score_des}}</div>
            <div class="describeMinor" style="width: 960px;height: 50px;line-height: 30px;">评估分数越高模型鲁棒性越好</div>
            <!-- 指标展示图1,折线图 -->
            <div class="result-title">后门攻击成功率情况</div>
            <div>
              <div id="backdoorEvalChart1" class="echart" style="width: 960px; height: 400px;"></div>
            </div>
            <div class="describeMinor" style="width: 960px;height: 100px;line-height: 100px;margin-top: 20px;">从结果中可以看到，在测试的几种攻击中，{{res.maxmethod}}的攻击效果最佳</div>

            <!-- 图片表格 -->
            <div class="result-title" style="margin-bottom: 24px;">后门攻击样本示例</div>

            <PictureTable key="pictable0" table-id="table0" :header="true" :headerRow="false" :headerColumn="true"
              :have-border="true" :content="selectPicList" :single-output="true" :cellWidth="setCellWidth"
              cellHeight="140px" class="center-horizon" style="height: 100%;width: 960px; margin-bottom: 20px;">
            </PictureTable>


            <!-- 指标展示图2,柱状图 -->
            <div class="result-title">不同投毒方法在相同投毒率下的攻击成功率</div>
            <div>
              <div id="backdoorEvalChart2" class="echart" style="width: 960px; height: 400px;"></div>
            </div>
            <div class="describeMinor" style="width: 960px;height: 50px;line-height: 50px;margin-top: 20px;">
              C-Acc: 模型在干净样本上的预测准确率
            </div>
            <div class="describeMinor" style="width: 960px;height: 20px;line-height: 20px;">
              ASR: 模型将投毒样本预测为目标类的准确率
            </div>
            <div class="describeMinor" style="width: 960px;height: 50px;line-height: 50px;margin-bottom: 40px;">
              R-Acc: 模型将投毒样本预测为原类别的概率
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
import PictureTable from "../../components/pictureTable.vue";
export default {
  name: "resultDialog",
  components: {
    PictureTable: PictureTable
  },
  props: {
    isShow: {
      //弹窗组件是否显示 默认不显示
      type: Boolean,
      default: false,
      required: true, //必须
    },
    result:{},
    postData:{},
    //下面这些属性会绑定到div上面 详情参照上面的html结构
    // 如： :style="{top:topDistance+'%',width:widNum+'%'}"
    widNum: {
      //内容宽度
      type: Number,
      default: 50
    },
    leftSite: {
      // 左定位
      type: Number,
      default: 25.2
    },
    topDistance: {
      //top上边距
      type: Number,
      default: 10
    },
    pdt: {
      //上padding
      type: Number,
      default: 22
    },
    pdb: {
      //下padding
      type: Number,
      default: 47
    },
    headerRow: false
  },

  data() {
    return {
      echart_init: false,
      selectPicList: [
        ["123", "345", "345", "123", "123"],
      ],
      setCellWidth: [0.17, 0.16, 0.16,0.16,0.16,0.16],
      htmlTitle: 'backdoorReport',
      res:{}
    }
  },
  watch:{
    result(newValue, oldValue){
      if ("backdoor_attack" in newValue){

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
    _stopPropagation(ev) {
      var _this = this;
      ev.stopPropagation();
    },

    defenseShow(method="[]"){
      let param = JSON.parse(method);
      return param
    },
    updated() {
    //code
    debugger
    // 数据处理，总分
    this.res.labels = [];
    this.res.ACClist = [];
    this.res.ASRlist = [];
    this.res.RACClist = []
    this.res.maxasr = 0
    this.res.maxacc = 0
    this.res.maxracc = 0
    this.res.maxmethod = ""
    this.res.maxaccmethod = ""
    this.res.maxraccmethod = ""
    let pp_asr_serieslist = []
    // output路径
    let pic_base_path=`./static/output/${this.result.tid}/${this.result.stidlist.backdoor}`
    this.selectPicList=[["0", "1", "2", "3", "4"],]
    for(let temp in this.result.backdoor_attack){
      if( ["stop","tid", "stid"] .indexOf(temp) == -1){
        if (this.res.maxasr < this.result.backdoor_attack[temp].attack_success_rate){
          this.res.maxasr = this.result.backdoor_attack[temp].attack_success_rate
          this.res.maxmethod = temp
        }
        if (this.res.maxacc < this.result.backdoor_attack[temp].accuracy){
          this.res.maxacc = this.result.backdoor_attack[temp].accuracy
          this.res.maxaccmethod = temp
        }
        if (this.res.maxracc < this.result.backdoor_attack[temp].accuracyonb){
          this.res.maxracc = this.result.backdoor_attack[temp].accuracyonb
          this.res.maxraccmethod = temp
        }
        this.res.labels.push(temp)
        this.res.ACClist.push(this.result.backdoor_attack[temp].accuracy*100)
        this.res.RACClist.push(this.result.backdoor_attack[temp].accuracyonb*100)
        this.res.ASRlist.push(this.result.backdoor_attack[temp].attack_success_rate*100)
        pp_asr_serieslist.push({
          "name":temp,
          "type":"line",
          "symbol": "none",
          "itemStyle": { "normal": { "lineStyle": { "width": 2.5 } } },
          "data":this.result.backdoor_attack[temp].asr
        })
        this.selectPicList.push(["原始图片",[[`${pic_base_path}/${temp}/index0_clean.jpeg`], "pic"],
        [[`${pic_base_path}/${temp}/index1_clean.jpeg`], "pic"],
        [[`${pic_base_path}/${temp}/index2_clean.jpeg`], "pic"],
        [[`${pic_base_path}/${temp}/index3_clean.jpeg`], "pic"],
        [[`${pic_base_path}/${temp}/index4_clean.jpeg`], "pic"]])
        this.selectPicList.push([temp,[`${pic_base_path}/${temp}/index0_poisoned.jpeg`, "pic"],
        [[`${pic_base_path}/${temp}/index1_poisoned.jpeg`], "pic"],
        [[`${pic_base_path}/${temp}/index2_poisoned.jpeg`], "pic"],
        [[`${pic_base_path}/${temp}/index3_poisoned.jpeg`], "pic"],
        [[`${pic_base_path}/${temp}/index4_poisoned.jpeg`], "pic"]])
      }
    }
    this.res["score"] = 100-this.res.maxasr*100
    if (this.res["score"] < 49){
      this.res["score"] += 10
    }
    if(this.res["score"] >= 80 ){
      this.res["Eva"] = "优秀"
    }else if (this.res["score"] <80 && this.res["score"] >=60 ){
      this.res["Eva"] = "良好"
    }else{
      this.res["Eva"] = "差"
    }
    this.res["score_des"] = `${this.postData.Model}模型鲁棒性得分为${this.res.score},是一个较${this.res.Eva}的模型，本次投毒攻击方法有${this.defenseShow(this.postData.Method)}，其中${this.res.maxmethod}的攻击效果最佳`
    let pplist = this.result.backdoor_attack[this.res.maxmethod].pp_poison
    // 相同投毒率
    console.log(this.postData)
    let option1 = {
      title: {
        text: 'Stacked Line',
        show: false
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        top: 'bottom',
        bottom: '50%',
        icon: 'rect',
        itemWidth: 20,
        itemHeight: 5,//设置图例的宽和高
        data:this.res.labels
      },
      grid: {
        left: '6%',
        right: '7%',
        bottom: '12%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        name: '投毒比例',
        nameLocation: 'end',
        boundaryGap: false,
        // axisLabel: {
        //   formatter: function(val){
        //     return parseFloat(val).toFixed(3)*100+"%";}
        // },
        data: pplist
      },
      yAxis: {
        type: 'value',
        name: '攻击成功率(%)',
        min: 20,
        max: 110
      },
    };
    option1.series=pp_asr_serieslist;

    setTimeout(function(){
      let backdoorEvalChart1 = echarts.init(document.getElementById("backdoorEvalChart1"));
      option1 && backdoorEvalChart1.setOption(option1);
    },500)

    let option2 = {
      legend: {
        top: 'bottom',
        bottom: '20%',
        icon: 'rect',
        itemWidth: 10,
        itemHeight: 10,
        data: ['C-Acc', 'ASR', 'R-Acc'],
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: [
        {
          type: 'category',
          name:'攻击方法',
          axisTick: { show: false },
          data: this.res.labels
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '攻击成功率(%)'
        }
      ],
      series: [
        {
          name: 'C-Acc',
          type: 'bar',
          barWidth: '10%',
          emphasis: {
            focus: 'series'
          },
          data: this.res.ACClist
        },
        {
          name: 'ASR',
          type: 'bar',
          barWidth: '10%',
          emphasis: {
            focus: 'series'
          },
          data: this.res.ASRlist
        },
        {
          name: 'R-Acc',
          type: 'bar',
          barWidth: '10%',
          barGap: '8%',
          emphasis: {
            focus: 'series'
          },
          data: this.res.RACClist
        }
      ]
    };
    setTimeout(function(){
      let backdoorEvalChart2 = echarts.init(document.getElementById("backdoorEvalChart2"));
      option2 && backdoorEvalChart2.setOption(option2);
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
  z-index:999;
}

.close_button {
  height: 40px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  float: right;
}

/* 内容层 z-index要比遮罩大，否则会被遮盖， */
.dialog-content {
  position: fixed;
  top: 10px;
  width: 1080px;
  left: 0;
  right:0;
  margin: auto;
  bottom: 10px;
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
.dialog_head {
  width: 1080px;
  left: 0px;
  top: 1px;
  height: 88px;
  padding: 24px 18px 24px 24px;
  border-bottom: 0px solid #E0E3EB;
}

.dialog_main {
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

.foot_close {
  background: #5196FF;
  border-radius: 4px;
  width: 143px;
  height: 50px;
}

.dialog-title {
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
  font-size: 24px;
  color: #333333;
  letter-spacing: 0;
  font-weight: 600;
  text-align: center;
}

.describe {
  font-family: 'HONOR Sans CN';
  font-size: 16px;
  color: #000000;
  letter-spacing: 0;
  text-align: center;
  background-color: #F2F4F9;
}

.describeMinor {
  font-family: 'HONOR Sans CN';
  font-size: 16px;
  color: #3a3a3a;
  letter-spacing: 0;
  text-align: center;
  background-color: #F2F4F9;
}

.result-subtitle {
  margin-top: 20px;
  font-family: 'HONOR Sans CN';
  font-size: 18px;
  color: #333333;
  letter-spacing: 1px;
  font-weight: 400;
  text-align: center;
}

.a-row {
  margin-bottom: 0px;
  margin-left: 30px;
  height: 40px;
  line-height: 40px;
  width: 1080px;
  font-family: 'HONOR Sans CN';
  font-size: 14px;

}

.a-col {
  border-color: #F2F4F9;
  line-height: 20px;
  left: 10px;
}
.grid-content {
  min-height: 40px;
  background: #F2F4F9;
  left: 10px;
}
.sub-name{
  color: var(--gray-3, #6C7385);
  font-family: HONOR Sans CN;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
}
.sub-value{
  color: #000;
  text-align: left;
  font-family: HONOR Sans CN;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
}
</style>