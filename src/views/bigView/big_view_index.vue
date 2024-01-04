<template>
    <div id="index" ref="appRef1">
        <div>
            <video autoplay muted loop playbackrate="1" class="background_video">
                <source src="../../assets/img/bg.mp4" type="video/mp4">
            </video>
            <!-- <div style="background-color: #000;opacity: 0.5;position: fixed;width: 100%;z-index: 1;height: 100%;"></div> -->
        </div>

        <dv-loading v-if="loading">Loading...</dv-loading>
        <div v-else class="host-body">
            <div class="head">
                <div class="head_text">
                    <div></div>
                    <div class="title_VoAI">
                        
                    </div>
                    <div>
                        <div class="time_text">{{ dateYear }} {{ dateWeek }} {{ dateDay }}</div>
                    </div>
                </div>
                <div class="head_border_center">
                    <dv-decoration-6  class="border_center" />
                </div>
            </div>
            <div class="center_row">
                <div class="center_left_content left_right">
                    <!-- 可解释性 -->
                    <div class="explainability first" >
                        <div class="first_bg" >
                            <!-- 散点图 -->
                            <ScatterChart v-if="'attack_dim_reduciton' in res" :inputData="res.attack_dim_reduciton['FGSM']['pca']"
                                id="echartleft" class="ex_chart_content" style="
                                            position: relative;
                                            "
                                :refreshWidth="'266px'" :color="excolor"></ScatterChart>
                            <!-- 散点图 -->
                            <HistogramChart v-if="'attack_dim_reduciton' in res" :inputData="res.attack_dim_reduciton['FGSM']['svm']"
                                id="echartright" class="ex_chart_content" style="
                                            position: relative;
                                            "
                                :refreshWidth="'266px'" :color="excolor">
                            </HistogramChart>    
                        </div>
                        <div class="first_title">
                            <span class="first_title_name">可解释性</span>
                            <a-icon type="right" class="right_arrow" />
                        </div>
                    </div>
                    <!-- 可用性 -->
                    <div class="usability first">
                        
                        <div class="first_bg">
                            <resultTable  v-if="'tableBody' in useRes" :tableHead="useRes.tablehead" :tableBody="useRes.tableBody" :imgstyle="[32,32]" id="usability_left"></resultTable>
                            <div id="usability_right"><img id="model_img" :src="useRes.model_url"></div>
                        </div>
                        <div class="first_title">
                            
                            <span class="first_title_name">可用性</span>
                            <a-icon type="right"  class="right_arrow"/>
                        </div>
                    </div>
                </div>
                <div class="center_center_content">
                    <!-- 选择 -->
                    <div class="select_div">
                        <div class="select_bg1">
                            <div class="select_bg2">
                                <div class="select_content">
                                    <div class="select_data">
                                        <span class="select_name">数据集：</span>
                                        <a-select default-value="MNIST" class="select_down"  @change="handleChangeData">
                                            <a-select-option value="MNIST" >
                                                MNIST
                                            </a-select-option>
                                            <a-select-option  value="CIFAR10">
                                                CIFAR10
                                            </a-select-option>
                                        </a-select>
                                    </div>
                                    <div class="select_model">
                                        <span class="select_name">模型：</span>
                                        <a-select default-value="ResNet18" class="select_down" style="width: 120px" @change="handleChangeModel">
                                            <a-select-option value="ResNet18">
                                                ResNet18
                                            </a-select-option>
                                            <a-select-option value="ResNet34">
                                                ResNet34
                                            </a-select-option>
                                            <a-select-option value="ResNet50">
                                                ResNet50
                                            </a-select-option>
                                            <a-select-option value="ResNet101">
                                                ResNet101
                                            </a-select-option>
                                            <a-select-option value="ResNet154">
                                                ResNet154
                                            </a-select-option>
                                        </a-select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 六维评估 -->
                    <div class="assessment">
                        <!-- <div id="six" :style="sixbg"> -->
                        <div id="six" >
                            <div id="piechart">
                            </div>
                        </div>
                        <div class="score_text"> {{ show_score }}</div>
                    </div>
                </div>
                <div class="center_right_content left_right">
                    <!-- 可验证性 -->
                    <div class="verifiability first">
                        <div class="first_bg">
                            <div class="verifiability_chart">
                                <IBPChart v-if="'auto_verify' in res" class="verifiability_chart" :inputData="res.auto_verify.boundary1" :postData="res.param" :refreshWidth="'552px'"></IBPChart>
                            </div>
                            <!-- <div id="verifiability_chart"></div> -->
                        </div>
                        <div class="first_title">
                            <span class="first_title_name">可验证性</span>
                            <a-icon type="right"  class="right_arrow"/>
                        </div>
                    </div>
                    <!-- 完整性 -->
                    <div class="integrity first">
                        <div class="first_bg">
                            <div id="integrity_chart"></div>
                        </div>
                        <div class="first_title">
                            <span class="first_title_name">完整性</span>
                            <a-icon type="right"  class="right_arrow"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bottom_row">
                <!-- 公平性 -->
                <div class="fairness second">
                    <div class="second_bg">
                        <div style="width: 316px;height: 220px;">
                            <div class="leftup">
                                <div class="circle1">
                                    <div class="fairness_score">
                                        <p class="score_num">{{fairnessRes.score}}</p>
                                        <div style="width: 44px;height: 1px;background: rgba(255, 255, 255, 0.40);"></div>
                                        <p class="score_evaluate">{{fairnessRes.score_evaluate}}</p>

                                    </div>
                                </div>
                                <div id="consistency_div">

                                </div>
                            </div>
                            <div class="leftdown">
                                <div class="cons">
                                    <div class="circl2">
                                        <div id="individual_score"></div>
                                    </div>
                                    <div class="cons_des">
                                        <p class="cons_text_name">个体公平性评估</p>
                                        <dv-percent-pond :config="'value:'+fairnessRes.consistency_score" style="width:100%;height:8px;" />
                                        <p>得分 {{ fairnessRes.consistency_score }}</p>
                                    </div>
                                </div>
                                <div class="cons">
                                    <div class="circl2">
                                        <div id="group_score"></div>
                                    </div>
                                    <div class="cons_des">
                                        <p class="cons_text_name">群体公平性评估</p>
                                        <dv-percent-pond :config="'value:'+fairnessRes.consistency_score" style="width:100%;height:8px;" />
                                        <p>得分 {{ fairnessRes.consistency_score }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="fairness_chart">
                            <div class="group_echart_content">
                                <div  class="group_left_echart"  id="sexDifference"></div>
                                <div class="group_right_echart"  id="sexRatio"></div>
                            </div>
                            <div class="group_echart_content">
                                <div  class="group_left_echart"  id="ageDifference"></div>
                                <div class="group_right_echart"  id="ageRatio"></div>
                            </div>
                        </div>
                    </div>
                    <div class="second_title">
                        <span class="first_title_name">公平性</span>
                        <a-icon type="right"  class="right_arrow"/>
                    </div>
                    
                </div>
                <!-- 鲁棒性 -->
                <div class="robust second">
                    <div class="second_bg">
                        <div id="robust_chart2" style="width: 316px;height: 220px;"></div>
                        <div id="robust_chart"></div>
                    </div>
                    <div class="second_title">
                        <span class="first_title_name">鲁棒性</span>
                        <a-icon type="right"  class="right_arrow"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import drawMixin from "../../util/drawMixin";
import { formatTime } from '../../util/index.js'
import fairnessImg from '../../assets/img/fairness_c.png'
import robustImg from '../../assets/img/robust_c.png'
import integrityImg from '../../assets/img/integrity_c.png'
import explainabilityImg from '../../assets/img/explainability_c.png'
import verifiabilityImg from '../../assets/img/verifiability_c.png'
import usabilityImg from '../../assets/img/usability_c.png'
import noselectImg from '../../assets/img/noselect.png'
import ScatterChart from "../../components/charts/ScatterChart.vue";
import HistogramChart from "../../components/charts/HistogramChart.vue"
import IBPChart from "../../components/charts/IBPChart.vue"
import resultTable from "../../components/resultsTable.vue"
import {drawconseva1, drawbar, drawImportanceCoverage} from "../../assets/js/drawEcharts.js"
import * as echarts from "echarts";
export default {
    mixins: [ drawMixin ],
    data() {
      return {
        timing: null,
        loading: true,
        dateDay: null,
        dateYear: null,
        dateWeek: null,
        weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        decorationColor: ['#568aea', '#000000'],
        result:{
            fairness:90,
            explainability:80,
            usability:75,
            verifiability:90,
            integrity:98,
            robust:50,
            score:70
        },
        show_score:null,
        imgpath:noselectImg,
        modelname:"ResNet18",
        dataname:"MNIST",
        res_group:{
            'MNIST_ResNet18':'20231201_0933_b6d58d5',
            'MNIST_ResNet34':'',
            'MNIST_ResNet50':'',
            'MNIST_ResNet101':'',
            'MNIST_ResNet152':'',
            'CIFAR10_ResNet18':'20231201_0900_f6e04bf',
            'CIFAR10_ResNet34':'',
            'CIFAR10_ResNet50':'',
            'CIFAR10_ResNet101':'',
            'CIFAR10_ResNet152':'',
        },
        useRes:{},
        fairnessRes:{},
        res:{},
        excolor:[['#00D1FF','#FF9D00'],['#fff']]
      }
    },
    components: {
        ScatterChart,
        HistogramChart,
        IBPChart,
        resultTable
    },
    created(){
        this.getResult()
        
    },
    mounted() {
        this.show_score = this.result.score
        this.timeFn()
        
        this.cancelLoading()
        this.setPieChart()
    },
    beforeDestroy () {
      clearInterval(this.timing)
    },
    methods: {
        timeFn() {
            this.timing = setInterval(() => {
            this.dateDay = formatTime(new Date(), 'HH: mm: ss')
            this.dateYear = formatTime(new Date(), 'yyyy-MM-dd')
            this.dateWeek = this.weekday[new Date().getDay()]
            }, 1000)
        },
        cancelLoading() {
            setTimeout(() => {
            this.loading = false
            }, 500)
        },
        handleChangeData(value){
            this.dataname = value
            this.getResult()
        },
        handleChangeModel(value){
            this.modelname = value
            this.getResult()
        },
        deepClone(obj){
            let _obj = JSON.stringify(obj)
            let objClone = JSON.parse(_obj)
            return objClone
        },
        resultUsePro(res){
            if(!('FrameworkTest' in res)){
                return
            }
            this.useRes = this.deepClone(res.FrameworkTest) 
            this.useRes.tablehead = []
            this.useRes.tableBody = []
            var generate_fig_number = this.useRes.generate_figure.length;
            this.useRes.tableBody[0] = ["触发样本"]
            this.useRes.tableBody[1] = ["正确标签"]
            for(let j=0; j<generate_fig_number; j++) {
                let key1 = "figure-"+String(j);
                this.useRes[key1]["path"] = 'static/output/'+this.useRes.out_path.split('output')[1] +"/"+ this.useRes[key1]["path"].split("/")[1];
                var error_frame = this.useRes[key1]["path"].split("bgbk")[1].slice(0,-6);
                this.useRes.tableBody[0].push(this.useRes[key1]["path"])
                this.useRes.tableBody[1].push(this.useRes[key1]["ground_truth"])
            }
            let bakend_dict = {
                'torch':'Pytorch',
                'theano':'Theano',
                'paddle':'PaddlePaddle',
                'tensorflow':'TensorFlow',
                'cntk':'CNTK'
            }
            
            for(let i = 0;i < this.useRes.normal_backend.length; i++){
                this.useRes.tableBody[2+i] = [bakend_dict[this.useRes.normal_backend[i]]]
                for(let j=0; j<generate_fig_number; j++) {
                    let key1 = "figure-"+String(j);
                    this.useRes.tableBody[2+i].push(this.useRes[key1]["normal_backend_result"])
                }
            }
            var bodylen = this.useRes.tableBody.length
            for(let i = 0;i < this.useRes.buggy_backend.length; i++){
                if (this.useRes.buggy_backend[i] == error_frame) {
                    this.useRes.tableBody[bodylen+i] = [bakend_dict[this.useRes.buggy_backend[i]]]
                    for(let j=0; j<generate_fig_number; j++) {
                        let key1 = "figure-"+String(j);
                        this.useRes.tableBody[bodylen+i].push(this.useRes[key1]["buggy_backend_result"])
                    }
                };
            }
            this.useRes.buggy_layer = this.useRes.buggy_layer["0"];
            this.useRes.model_url = 'static/output/'+this.useRes.out_path.split('output')[1]+"/model.png";       
        },
        reusltFairnessPro(res){
            this.fairnessRes=this.deepClone(res.date_evaluate)
            this.fairnessRes.score = this.fairnessRes["Overall fairness"].toFixed(2)*100;
            this.fairnessRes.consistency_score = this.fairnessRes["Overall individual fairness"].toFixed(2)*100;
            this.fairnessRes.group_score =  this.fairnessRes["Overall group fairness"].toFixed(2)*100;
            // 总分判断
            if(this.fairnessRes.score > 80){
                this.fairnessRes.score_evaluate = "优秀";
                this.fairnessRes.score_con = "公平";
            }else if(this.fairnessRes.score > 60 && this.fairnessRes.score <=80){
                this.fairnessRes.score_evaluate = "良好";
                this.fairnessRes.score_con = "较公平";
            }else{
                this.fairnessRes.score_evaluate = "差";
                this.fairnessRes.score_con = "较不公平";
            }
            this.fairnessRes["Consistency"]=this.fairnessRes.Consistency.toFixed(2)*100;
            var color='#0B55F4';
            if (this.fairnessRes["Consistency"]<=30){
                color = "#F4320B";
            }else if(this.fairnessRes["Consistency"]>70){
                color='#07C168';
            }else{
                color = '#0B55F4';
            }
            drawconseva1("consistency_div",this.fairnessRes["Consistency"],color);
        },
        getResult(){
            this.res={}
            var that = this;
            that.$axios.get('/output/Resultdata', {params:{ Taskid: this.res_group[this.dataname+'_'+this.modelname] }}).then((data)=>{
                that.res=data.data.result;
                console.log("dataget_result:",that.res);
                this.resultUsePro(this.res)
                this.reusltFairnessPro(this.res)
                let importanceData = data.data.result.CoverageImportance.ImportanceNeuronsCoverage.reldraw.reldraw;
                drawImportanceCoverage("integrity_chart", importanceData, {'textcolor':'#fff','gridtop':60,'girdbottom':60,'type':'line'});
            })
        },
        setExplainability(data){
            console.log(data)
        },
        setPieChart(){
            var that = this
            let option1={
                series: [
                    {
                    type: 'pie',
                    radius: ['59%', '95%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: 'rgba(0, 0, 0, 0)',
                        borderWidth: 8
                    },
                    color: 'rgba(0, 0, 0, 0)',
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 64,
                            lineHeight:60,
                            fontWeight: 400,
                            fontFamily:'YouSheBiaoTiHei',
                            color:'#FFF',
                            textShadowColor:'rgba(0, 0, 0, 0.25)',
                            textShadowBlur:8,
                            textShadowOffsetX:0,
                            textShadowOffsetY:4
                        },
                        
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        { value: 1, name: that.result.robust, label: 'robust', url:robustImg},
                        { value: 1, name: that.result.fairness, label: 'fairness', url:fairnessImg },
                        { value: 1, name: that.result.integrity, label: 'integrity', url:integrityImg},
                        { value: 1, name: that.result.verifiability, label: 'verifiability', url:verifiabilityImg},
                        { value: 1, name: that.result.explainability, label: 'explainability', url:explainabilityImg},
                        { value: 1, name: that.result.usability, label: 'usability', url:usabilityImg }
                    ]
                    }
                ]
                };
            
            setTimeout(function(){
                let myChart1 = echarts.init(document.getElementById("piechart"));
                window.addEventListener("resize", function () {
                myChart1.resize()});
                option1 && myChart1.setOption(option1);
                myChart1.on('mousemove',function(params){
                    that.show_score = ''
                    let six_label = document.getElementById("six")
                    six_label.style.backgroundImage = `url(${params.data.url})`
                })
                myChart1.on('mouseout',function(params){
                    that.show_score = that.result.score
                    let six_label = document.getElementById("six")
                    six_label.style.backgroundImage = `url(${noselectImg})`
                })
            },500)
        }
    }
  }
</script>
  
<style scoped>
/* @import '../../assets/css/index.scss'; */
.host-body{
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
}
.head{
    width: 1920px;
    height: 88px;
    flex-shrink: 0;
    background-image: url("../../assets/img/headbg1.png");
    fill: linear-gradient(90deg, rgba(0, 40, 168, 0.00) 0.01%, rgba(0, 40, 168, 0.40) 50%, rgba(0, 40, 168, 0.00) 99.99%);
    backdrop-filter: blur(6px);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
}
.head_border_center{
    margin-top: 45px;
    display: grid;
    place-items: center;
    height: 8px;
}
.border_center{
    width: 146px;
    height: 8px;
}
.background_video{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
}
.head_text{
    display: grid;
    grid-template-columns: repeat(3, 33.33%);
}
.title_VoAI{
    text-align: center;
    text-shadow: 0px 14px 57px #1343C1, 0px 4px 12px rgba(0, 0, 0, 0.04);
    font-family: Alibaba PuHuiTi 2.0;
    font-size: 40px;
    font-style: normal;
    font-weight: 700;
    line-height: 88px;
    letter-spacing: 12px; 
    background: linear-gradient(180deg, #FFF 17.25%, #BED2FE 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
.time_text{
    font-family: Alibaba PuHuiTi 2.0;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: 2.56px;
    background: linear-gradient(180deg, #FFF 0%, #A2BBFD 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: right;
    place-content:end;
    margin-top: 16px;
    margin-right: 24px;
}
.center_row{
    width: 100%;
    height: 652px;
    display: grid;
    padding:0px 24px;
    grid-template-columns:30% 40% 30%
}
.left_right{
    width: 568px;
    height: 620px;
    margin-top: 24px;
    display:flex;
    gap:24px;
    flex-direction:column
}
.center_center_content{
    width: 736px;
    height: 620px;
    display:flex;
    justify-content:center;
    align-items: center;
    flex-direction:column;
    margin-left:10px;
}
.first_title{
    display: flex;
    width: 568px;
    height: 42px;
    padding: 0px 4px 0px 16px;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    border-radius: 12px;
    border: 1px solid rgba(73, 189, 254, 0.00);
    background: linear-gradient(180deg, rgba(0, 40, 168, 0.15) 0%, #0028A8 100%);
    box-shadow: 0px 4px 12px 0px #0127A4, 0px 8px 12px 0px rgba(1, 39, 164, 0.32), 0px 6px 12px 0px rgba(1, 39, 164, 0.16);
    backdrop-filter: blur(8px);
    margin-top: -298px;
}
.first_title_name{
    color: #FFF;
    text-shadow: -1px 1px 8px rgba(255, 255, 255, 0.30);
    font-family: Alibaba PuHuiTi 2.0;
    font-size: 18px;
    font-style: normal;
    font-weight: 900;
    line-height: 26px; /* 144.444% */
}
.select_div{
    width: 646px;
    height: 60px;
}

.select_bg1{
    width: 646px;
    height: 60px;
    border-radius: 12px;
    background: linear-gradient(180deg, rgba(0, 40, 168, 0.15) 0%, #0028A8 100%);
    box-shadow: 0px -1px 0px 0px #49BDFE inset;
}
.select_bg2{
    width: 646px;
    height: 60px;
    display: grid;
    place-items: center;
    border-radius: 12px;
    background: linear-gradient(90deg, #030A1C 0%, rgba(0, 0, 0, 0.00) 50%, #020A1A 100%);
}
.circle1{

}
.score_num{
    color: #FFF;
    text-align: center;
    font-family: Alibaba PuHuiTi 2.0;
    font-size: 32px;
    font-style: normal;
    font-weight: 700;
    line-height: 28px; /* 87.5% */
}
.score_evaluate{
    color: #06FFA5;
    text-align: center;
    font-family: Alibaba PuHuiTi 2.0;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 12px; /* 100% */
}
.select_content{
    display: flex;
    height: 34px;
    width: 506px;
    align-items: flex-start;
    gap: 100px;
}
.select_data{
    display: flex;
    align-items: center;
    flex: 1 0 0;
}
.select_model{
    display: flex;
    align-items: center;
}
.select_name{
    color: rgba(255, 255, 255, 0.60);
    font-family: Alibaba PuHuiTi 2.0;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 28px; /* 140% */
}

.first{
    width: 568px;
    height: 298px;
}
.first_bg{
    display: flex;
    width: 568px;
    height: 298px;
    padding: 62px 8px 8px 8px;
    justify-content: center;
    align-items: flex-start;
    gap: 20px;
    border-radius: 12px;
    border: 1px solid rgba(73, 189, 254, 0.00);
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(8px);
}
.ex_chart_content{
    width: 266px;
    height: 228px;
}

#usability_left{
    width: 260px;
    height: 228px;
}
#usability_right{
    width: 272px;
    height: 228px;
    overflow-y: scroll;
}
#model_img {
    height: auto;
    width: 272px;
    overflow: hidden;
}

.verifiability_chart{
    width: 552px;
    height: 228px;
}
#integrity_chart{
    width: 552px;
    height: 228px;
}
.right_arrow{
    color:white;
    height: 34px;
    width:34px;
    font-size: 26px;
    padding: 4px 4px;
}
.assessment{
    width: 668px;
    height: 580px;
    background-image:
    url(../../assets/img/center6.png),
    url(../../assets/img/center5.png),
    url(../../assets/img/center4.png),
    url(../../assets/img/center3.png),
    url(../../assets/img/center2.png),
    url(../../assets/img/center1.png);
    background-size:
    160px 160px ,
    218px 218px ,
    330px 330px ,
    240px 240px ,
    498px 498px ,
    668px 580px ;
    background-repeat: no-repeat;
    background-position: center center;
}
.fairness_score{
    display: flex;
    padding: 7px;
    justify-content: center;
    align-items: center;
    width: 148px;
    height: 148px;
    background-image:
    url(../../assets/img/fairnessScore1.svg),
    url(../../assets/img/fairnessScore2.svg),
    url(../../assets/img/fairnessScore3.svg);
    background-size:
    134px 134px ,
    118px 118px ,
    90px 90px ;
    background-repeat: no-repeat;
    background-position: center center;
}
#six{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url(../../assets/img/noselect.png);
    background-size:  426px 426px ;
    background-repeat: no-repeat;
    background-position: center center;
}
#piechart{
    height: 426px;
    width: 426px;
}
.score_text{
    height: 160px;
    width: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFF;
    text-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
    font-family: YouSheBiaoTiHei;
    font-size: 64px;
    font-style: normal;
    font-weight: 400;
    line-height: 60px; /* 93.75% */
    margin-top: -360px;
}
.bottom_row{
    padding: 18px 24px;
    display: flex;
    align-items: flex-start;
    gap: 24px;
    height: 334px;
}
.second{
    width: 924px;
    height: 298px;
}
.second_bg{
    display: flex;
    width: 100%;
    padding: 62px 8px 8px 8px;
    justify-content: center;
    align-items: flex-start;
    gap: 20px;
    border-radius: 12px;
    border: 1px solid rgba(73, 189, 254, 0.00);
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(8px);
}
.second_title{
    display: flex;
    height: 42px;
    padding: 0px 4px 0px 16px;
    justify-content: space-between;
    align-items: center;
    border-radius: 12px;
    border: 1px solid rgba(73, 189, 254, 0.00);
    background: linear-gradient(180deg, rgba(0, 40, 168, 0.15) 0%, #0028A8 100%);
    box-shadow: 0px 4px 12px 0px #0127A4, 0px 8px 12px 0px rgba(1, 39, 164, 0.32), 0px 6px 12px 0px rgba(1, 39, 164, 0.16);
    backdrop-filter: blur(8px);
    margin-top: -298px;
    width: 100%;
}
.fairness_chart{
    display: flex;
    gap:12px;
    height:120px;
}
.group_echart_content{
    display: flex;
    gap:12px;
    height:120px;
    width: 281px;
}
</style>