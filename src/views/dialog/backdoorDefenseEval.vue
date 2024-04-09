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
                        <a-icon type="close" @click="closeMyself" style="font-size: 20px;color:#6C7385;"
                            class="closebutton" />
                    </div>
                    <slot name="header">
                        <div class="dialog-title"><img src="../../assets/img/backdoorDefenseIcon.png"
                                style="width: 50px; height: 50px;">后门防御评估报告</div>
                    </slot>
                </div>
                <div class="dialog_main" id="pdfDom">
                    <!--弹窗的内容-->
                    <slot name="main">
                        <!-- 防御信息 -->
                        <!-- <div v-if="Object.keys(postData).length > 0" class="paramShow"> -->
                        <div class="paramShow1">
                            <div class="paramDiv">
                                <div class="column">
                                    <div class="paramNameDiv">
                                        <p class="resParamName">数据集：</p>
                                        <p class="resParamName">攻击样本数：</p>
                                    </div>
                                    <div class="paramValueDiv">
                                        <p class="paramValue">{{postData.adv_dataset}}</p>
                                        <p class="paramValue">{{postData.adv_nums}}</p>
                                    </div>
                                </div>
                                <div class="column">
                                    <div class="paramNameDiv">
                                        <p class="resParamName">攻击方法：</p>
                                    </div>
                                    <div class="paramNameDiv">
                                        <p class="paramValue">{{postData.adv_method}}</p>
                                    </div>
                                </div>
                                <div class="defenseParam">
                                    <p class="resParamName">
                                        防御方法：
                                    </p>
                                    <p class="paramValue" v-text="defenseShow(postData.defense_methods)">
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- 图片表格 -->
                        <div class="reportContentCon">
                            <div class="result_div_notop">
                                <!-- <p class="moduleTitle">攻击样本示例</p> -->
                                <p class="main_top_echarts_con_title">攻击样本示例</p>
                                <PictureTable key="pictable0" table-id="table0" :header="true" :headerRow="true" :headerColumn="true"
                                :have-border="true" :content="selectPicList" :single-output="true" :cellWidth="setCellWidth"
                                cellHeight="140px" class="center-horizon" style="height: 100%;width: 960px; margin-bottom: 20px;">
                                </PictureTable>
                               
                            </div>
                            <div class="result_div_notop">
                                <p class=" main_top_echarts_con_title ">后门攻击防御效果柱状图</p>
                                <div class='defenseResultBar'>
                                    <div id="defenseBarEchart"></div>
                                    <div class="conclusion">
                                        <p class="result_text">如上图所示为后门攻击防御效果图，其中{{ res.maxMethod }}后门检测效果最佳，检出率为{{ res.maxRate }}。</p>
                                    </div>
                                </div>
                            </div>
                            <div class="result_div_notop" v-if="NCisShow(postData.defense_methods)">
                                <p class=" main_top_echarts_con_title ">Neural Cleanse后门触发器示例</p>
                                <div class="sampleTable">
                                    <div class="sampleColumn">
                                        <div class="sampleTitleCol">
                                            <p class="sampleTitleText">
                                                后门防御算法名称
                                            </p>
                                        </div>
                                        <div class="samplePicCol" v-for="(info, index) in res.NCres.name" :key="'name'+index">
                                            <div>
                                                <p class="sampleTitleText">
                                                {{ info }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="sampleColumn">
                                        <div class="sampleTitleCol">
                                            <p class="sampleTitleText">
                                                真实触发器
                                            </p>
                                        </div>
                                        <div class="samplePicCol" v-for="(info, index) in res.NCres.trueTrigger" :key="'trueTrigger'+index">
                                            <div>
                                                <img :src="info" >
                                            </div>
                                        </div>
                                    </div>
                                    <div class="sampleColumn">
                                        <div class="sampleTitleCol">
                                            <p class="sampleTitleText">
                                                预测触发器
                                            </p>
                                        </div>
                                        <div class="samplePicCol" v-for="(info, index) in res.NCres.predictTrigger" :key="'predictTrigger'+index">
                                            <div>
                                                <img @error="noExistImg" :src="info" >
                                            </div>
                                        </div>
                                    </div>
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

import PictureTable from "../../components/pictureTable.vue";
import {drawbar} from "../../assets/js/drawEcharts.js"

export default {
    name: "backdoorDefenseDialog",
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
        postData:{},
        result:{}
    },

    data() {
        return {
            echart_init: false,
            // output路径需修改
            selectPicList:[["攻击方法", "BackdoorAttack", "BackdoorAttack", "BackdoorAttack"],
            ["加噪前",[["./static/output/backdoor/0/clean.jpeg"], "pic"], [["./static/output/backdoor/1/clean.jpeg"], "pic"], [["./static/output/backdoor/2/clean.jpeg"], "pic"]],
            ["噪声",["./static/output/backdoor/0/backdoor.jpeg", "pic"], ["./static/output/backdoor/1/backdoor.jpeg", "pic"], ["./static/output/backdoor/2/backdoor.jpeg", "pic"]],
            ["加噪后",["./static/output/backdoor/0/poisoned.jpeg", "pic"], ["./static/output/backdoor/1/poisoned.jpeg", "pic"], ["./static/output/backdoor/2/poisoned.jpeg", "pic"]],
            ],
            setCellWidth: [0.17, 0.16, 0.16,0.16,0.16,0.16],
            htmlTitle: '后门防御评估报告',
            res:{
                maxRate:null,
                maxMethod:null,
                NCres:{
                name:[],
                trueTrigger:[],
                predictTrigger:[]
            },
            }
        }
    },
    // props:["is-show","top-distance"],
    methods: {
        closeMyself() {
            this.$emit("on-close");
            //如果需要传参的话，可以在"on-close"后面再加参数，然后在父组件的函数里接收就可以了。
        },
        // 防御方法参数显示
        defenseShow(method="[]"){
            let param = JSON.parse(method);
            return param.join('、');
        },
        _stopPropagation(ev) {
            var _this = this;
            ev.stopPropagation();
        },
        updated(res) {
            debugger
            let label=[];
            let rateList=[];
            let noDefenseACC=[];
            let maxRate = 0;
            let maxMethod="";
            for (let temp in res.detect_rates){
                if (maxRate < res.detect_rates[temp]){
                    maxMethod = temp
                    maxRate = res.detect_rates[temp]
                }
                label.push(temp);
                rateList.push(res.detect_rates[temp])
                noDefenseACC.push(res.no_defense_accuracy)
            }
            this.res.maxRate = maxRate;
            this.res.maxMethod = maxMethod
            drawbar("defenseBarEchart",rateList,label, "", "算法名称", "检出率")
            // output路径需修改
            if ( label.indexOf("Neural Cleanse L1") > -1 ){
                this.res.NCres.name.push("Neural Cleanse L1");
                let imgpath = "./static/output/trigger/l1/"
                // require('/static/img/output/sample00.png')
                this.res.NCres.trueTrigger.push(imgpath+"trigger.jpeg")
                this.res.NCres.predictTrigger.push(imgpath+"trigger_predict.jpeg")
            }
            if ( label.indexOf("Neural Cleanse L2") > -1 ){
                this.res.NCres.name.push("Neural Cleanse L2");
                let imgpath = "./static/output/trigger/l2/"
                this.res.NCres.trueTrigger.push(imgpath+"trigger.jpeg")
                this.res.NCres.predictTrigger.push(imgpath+"trigger_predict.jpeg")
            }
            if ( label.indexOf("Neural Cleanse Linf") > -1 ){
                this.res.NCres.name.push("Neural Cleanse Linf");
                let imgpath = "./static/output/trigger/linf/"
                this.res.NCres.trueTrigger.push(imgpath+"trigger.jpeg")
                this.res.NCres.predictTrigger.push(imgpath+"trigger_predict.jpeg")
            }
        },
        NCisShow(method="[]"){
            // return true;
            if (method.indexOf("Neural Cleanse") > -1){
                return true;
            }else{
                return false;
            }
        },
    },
    watch:{
        result(newValue, oldValue){
            console.log('watch:',this.result)
            if ("backdoor_defense" in this.result){
                this.updated(this.result.backdoor_defense)
            }
        },
    },
    created(){
        console.log('backdoor_defense created:',this.result)
        if ("backdoor_defense" in this.result){
            this.updated(this.result.backdoor_defense)
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
    z-index: 999;
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
    right: 0;
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
    /* display: inline;
    margin-top: 38px; */
    width: 340px;
    height: 36px;
    font-family: HONOR Sans CN;
    font-size: 24px;
    color: #333333;
    letter-spacing: 0;
    line-height: 48px;
    font-weight: 600;
}

.result-title {
    margin-top: 60px;
    font-family: HONOR Sans CN;
    font-size: 28px;
    color: #333333;
    line-height: 36px;
    letter-spacing: 0;
    font-weight: 700;
    text-align: center;
    margin-bottom: 24px;
}

.describe {
    font-family: HONOR Sans CN;
    font-size: 16px;
    color: #000000;
    letter-spacing: 0;
    text-align: center;
    background-color: #F2F4F9;
}

.describeMinor {
    font-family: HONOR Sans CN;
    font-size: 16px;
    color: #3a3a3a;
    letter-spacing: 0;
    text-align: center;
    background-color: #F2F4F9;
}

.result-subtitle {
    margin-top: 20px;
    font-family: HONOR Sans CN;
    font-size: 18px;
    color: #333333;
    letter-spacing: 1px;
    font-weight: 400;
    text-align: center;
}

.grid-content {
    line-height: 24px;
    background: #F2F4F9;
    left: 10px;
}
.grid-content-top{
    margin-bottom: 12px;
}
.row-bg {
    padding: 10px 0;
    background-color: #F2F4F9;
}
.paramDiv{
    display: flex;
    /* flex-direction: column; */
    align-items: flex-start;
    gap: 12px;
    align-self: stretch;
}
.column{
    display: flex;
    align-items: flex-start;
    gap: 8px;
    flex: 1 0 0;
}
.paramNameDiv{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
}
.paramValueDiv{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    flex: 1 0 0;
}
.resParamName{
    color: var(--gray-3, #6C7385);
    text-align: center;
    font-family: HONOR Sans CN;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 150% */
}
.paramValue{
    color: #000;
    font-family: HONOR Sans CN;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 150% */
}
.defenseParam{
    display: flex;
    width: 540px;
    align-items: flex-start;
    gap: 8px;
}
.defenseParam .resParamName{
    width: 80px;
}
.defenseParam .paramValue{
    flex: 1 0 0;
    text-align: left;
}
.reportContentCon{
    display: flex;
    width: 1080px;
    flex-direction: column;
    align-items: center;
    gap: 60px;
    margin-top: 60px;
}
.sampleTable{
    display: flex;
    width: 960px;
    align-items: flex-start;
    border-radius: 4px;
    border: 1px solid #E0E3EB;
    background: #FFF;
}
.sampleColumn{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: 1 0 0;
}
.sampleTitleCol{
    display: flex;
    height: 68px;
    padding: 9px 32px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-self: stretch;
    border-right: 1px solid #E0E3EB;
    border-bottom: 1px solid #E0E3EB;
    background: var(--gray-7, #F2F4F9);
}
.sampleTitleText{
    align-self: stretch;
    color: rgba(0, 0, 0, 0.90);
    text-align: center;
    font-family: HONOR Sans CN;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 28px; /* 140% */
}
.samplePicCol{
    display: flex;
    height: 128px;
    padding: 9px 20px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    align-self: stretch;
    border-right: 1px solid #E0E3EB;
    border-bottom: 1px solid #E0E3EB;
    background: #FFF;
}
.samplePicCol div{
    display: flex;
    height: 48px;
    padding: 0px 0.5px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
}
.samplePicCol div img{
    width: 48px;
    height: 48px;
    flex-shrink: 0;
}
.defenseResultBar{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 24px;
    align-self: stretch;
}
#defenseBarEchart{
    display: flex;
    height: 432px;
    width: 960px;
    padding: 32px 32px 0px 32px;
    flex-direction: column;
    align-items: flex-start;
}
</style>