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
                        <div class="dialog-title"><img src="../../assets/img/modelEvaIcon.png"
                                style="width: 50px; height: 50px;">对抗攻击防御评估报告</div>
                    </slot>
                </div>
                <div class="dialog_main" id="pdfDom">
                    <!--弹窗的内容-->
                    <slot name="main">
                        <!-- 防御信息 -->
                        <!-- <div v-if="Object.keys(postData).length > 0" class="paramShow"> -->
                        <div class="paramShow">
                            <a-row style="width: 100%;">
                                <a-col :span="2">
                                    <div class="grid-content grid-content-top" style="color:#6C7385">数据集:</div>
                                    <div class="grid-content" style="color:#6C7385">攻击样本数:</div>
                                </a-col>
                                <a-col :span="5">
                                    <div class="grid-content grid-content-top">{{postData.adv_dataset}}</div>
                                    <div class="grid-content">{{postData.adv_nums}}</div>
                                </a-col>
                                <a-col :span="2">
                                    <div class="grid-content grid-content-top" style="color:#6C7385">模型:</div>
                                    <div class="grid-content" style="color:#6C7385">攻击方法:</div>
                                </a-col>
                                <a-col :span="5">
                                    <div class="grid-content grid-content-top">{{postData.adv_model}}</div>
                                    <div class="grid-content">
                                        {{ Array.isArray(postData.adv_method) ? postData.adv_method.join('、') : postData.adv_method }}
                                    </div>
                                </a-col>
                                <a-col :span="2">
                                    <div class="grid-content grid-content-top" style="color:#6C7385">防御方法:</div>
                                    <div class="grid-content" style="color:#6C7385">原始精度:</div>
                                </a-col>
                                <a-col :span="8">
                                    <div class="grid-content grid-content-top" v-text="defenseShow(postData.defense_methods)"></div>
                                    <div class="grid-content">{{ res.no_defense_accuracy ? (res.no_defense_accuracy * 100).toFixed(2) + '%' : '未知' }}</div>
                                </a-col>
                            </a-row>
                            <a-row style="width: 100%; margin-top: 12px;" v-if="res.currentAttack && res.allResults && res.allResults[res.currentAttack]">
                                <a-col :span="24">
                                    <div class="grid-content" style="color:#6C7385">
                                        防御后精度: 
                                        <template v-if="res.allResults[res.currentAttack].ATDefenseACClist && res.allResults[res.currentAttack].ATDefenseACClist.length > 0">
                                            <span v-for="(acc, index) in res.allResults[res.currentAttack].ATDefenseACClist" :key="index">
                                                {{ res.allResults[res.currentAttack].ATlabels[index] }}: {{ (acc * 100).toFixed(2) }}%
                                                {{ index < res.allResults[res.currentAttack].ATDefenseACClist.length - 1 ? '、' : '' }}
                                            </span>
                                        </template>
                                        <template v-else>
                                            暂无对抗训练防御精度数据
                                        </template>
                                    </div>
                                </a-col>
                            </a-row>
                        </div>

                        <!-- 图片表格 -->
                        <div class="result-title" style="margin-top: 169px;">攻击样本示例</div>
                        <PictureTable key="pictable0" table-id="table0" :header="true" :headerRow="true"
                            :headerColumn="false" :have-border="true" :content="selectPicList" :single-output="true"
                            :cellWidth="setCellWidth" cellHeight=100px class="center-horizon"
                            style="height: 100%;width: 1000px; margin-bottom: 20px;">
                        </PictureTable>

                        <!-- 指标展示图2,柱状图 -->
                        <div class="result-title">对抗攻击防御评估详情</div>

                        <!-- Attack method selector when multiple attack methods are present -->
                        <div v-if="res.attackMethods && res.attackMethods.length > 1" style="text-align: center; margin-bottom: 20px;">
                            <span style="margin-right: 10px; font-weight: bold;">选择攻击方法:</span>
                            <a-select 
                                style="width: 200px;" 
                                v-model="res.currentAttack" 
                                @change="switchAttackMethod">
                                <a-select-option 
                                    v-for="method in res.attackMethods" 
                                    :key="method" 
                                    :value="method">
                                    {{ method }}
                                </a-select-option>
                            </a-select>
                        </div>

                        <div style="font-size:18px;text-align:center;margin-top: 10px;font-weight :bold">对抗攻击防御算法检出效果</div>
                        <div style="font-size:10px;color:#7f7f81;text-align: center">柱形图展示各个防御算法在所选攻击算法下的检出成功率</div>
                        <div v-if="'detect_labels' in res">
                            <div id="advAttackDefenseEvalChart" class="echart" style="width: 1000px; height: 400px;"></div>
                        </div>
                        <div v-if="'detect_labels' in res" class="describeMinor"
                            style="width: 1000px;height: 70px;line-height: 70px;margin-bottom: 20px;">
                            如上图所示为对抗攻击防御效果图，其中{{ res.maxMethod }}对抗样本检测效果最佳，检出率为{{ res.maxRate }}。
                        </div>
                        <div v-if="'ATlabels' in res" style="font-size:18px;text-align:center;margin-top: 40px;font-weight :bold">对抗训练防御效果</div>

                        <div v-if="'ATlabels' in res">
                            <div id="defenseATEchart" class="echart" style="width: 1000px; height: 400px;"></div>
                        </div>
                        <div v-if="'ATlabels' in res" class="describeMinor"
                            style="width: 1000px;height: 70px;line-height: 70px;">
                            如上图所示为对抗训练防御效果图，其中{{ res.ATMaxMethod }}对抗攻击防御效果最佳，防御后的模型对对抗样本分类精度为{{ res.ATMaxRate }}。
                        </div>

                        <div class="downloadBtn">
                            <button class="exportResultBtn" @click="getPdf()"><a-icon type="upload" />导出报告内容</button>
                        </div>
                    </slot>
                </div>
            </div>
        </transition>

    </div>
</template>
<script>

import PictureTable from "../../components/pictureTable.vue";
import { drawbar, drawLineBar } from "../../assets/js/drawEcharts.js"

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
        postData:{},
        result:{},
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
        headerRow: false,
        cellHeight: "80px",

    },

    data() {
        return {
            
            echart_init: false,
            // output路径需修改
            selectPicList: [
                ["原始样本", "噪声", "对抗样本"],
                // [[require("@/assets/img/third.png"), "pic"],[require("@/assets/img/third.png"), "pic"],[require("@/assets/img/third.png"), "pic"]],
                // [[require("@/assets/img/third.png"), "pic"],[require("@/assets/img/third.png"), "pic"],[require("@/assets/img/third.png"), "pic"]],
                // [[require("@/assets/img/third.png"), "pic"],[require("@/assets/img/third.png"), "pic"],[require("@/assets/img/third.png"), "pic"]]
                [["./static/output/images/0/clean.jpeg", "pic"], ["./static/output/images/0/noise.jpeg", "pic"], ["./static/output/images/0/adv.jpeg", "pic"]],
                [["./static/output/images/1/clean.jpeg", "pic"], ["./static/output/images/1/noise.jpeg", "pic"], ["./static/output/images/1/adv.jpeg", "pic"]]
                [["./static/output/images/2/clean.jpeg", "pic"], ["./static/output/images/2/noise.jpeg", "pic"], ["./static/output/images/2/adv.jpeg", "pic"]]
            ],
            setCellWidth: [0.33, 0.34, 0.33],
            htmlTitle: 'advAttackDefenseReport',
            res:{}
        }
    },
    // props:["is-show","top-distance"],
    methods: {
        closeMyself() {
            this.$emit("on-close");
            //如果需要传参的话，可以在"on-close"后面再加参数，然后在父组件的函数里接收就可以了。
        },
        // 防御方法参数显示
        defenseShow(method=[]){
            // let param = JSON.parse(method);
            return method.join('、');
        },
        _stopPropagation(ev) {
            var _this = this;
            ev.stopPropagation();
        },
        updated() {
            if ("attack_defense" in this.result) {
                this.res = this.result.attack_defense;
            } else {
                this.res = this.result;
            }

            if (!this.res || !this.res.detect_rates) {
                // Clear data and charts if detect_rates is missing
                this.res.detect_labels = [];
                this.res.detect_rates = []; // This is rateList for the chart
                this.res.maxRate = "0.0000";
                this.res.maxMethod = "";
                this.res.ATlabels = [];
                this.res.noDefenseACC = []; // This is noDefenseACClist for the chart
                this.res.ATDefenseACC = []; // This is ATDefenseACClist for the chart
                this.res.ATMaxRate = "0.0000";
                this.res.ATMaxMethod = "";
                this.res.attackMethods = [];
                this.res.currentAttack = null;
                this.res.allResults = {};
                this.$nextTick(() => {
                    const chart1Instance = document.getElementById("advAttackDefenseEvalChart");
                    if (chart1Instance && chart1Instance.__echartsInstance__) {
                        echarts.getInstanceByDom(chart1Instance).clear();
                    } else if (chart1Instance) {
                        chart1Instance.innerHTML = '';
                    }
                    const chart2Instance = document.getElementById("defenseATEchart");
                    if (chart2Instance && chart2Instance.__echartsInstance__) {
                        echarts.getInstanceByDom(chart2Instance).clear();
                    } else if (chart2Instance) {
                        chart2Instance.innerHTML = '';
                    }
                });
                return;
            }

            // 检测数据结构
            const firstKey = Object.keys(this.res.detect_rates)[0];
            const isReversedStructure = firstKey && typeof this.res.detect_rates[firstKey] === 'object';
            
            let processedRates = {};
            if (isReversedStructure) {
                // 转换数据结构：从"防御方法->攻击方法"到"攻击方法->防御方法"
                for (const defenseMethod in this.res.detect_rates) {
                    for (const attackMethod in this.res.detect_rates[defenseMethod]) {
                        if (!processedRates[attackMethod]) {
                            processedRates[attackMethod] = {};
                        }
                        processedRates[attackMethod][defenseMethod] = this.res.detect_rates[defenseMethod][attackMethod];
                    }
                }
                this.res.detect_rates = processedRates;
            }
            
            const ATMethod = ["Madry", "TRADES", "FreeAT", "FastAT", "CARTL", "MART"];
            const allResults = {};
            const attackMethods = Object.keys(this.res.detect_rates);
            
            // 确保攻击方法下拉菜单总是显示
            this.res.attackMethods = attackMethods;
            
            let firstAttackMethodProcessed = false;

            for (const attackMethod of attackMethods) {
                const defenseRatesForAttack = this.res.detect_rates[attackMethod];
                
                let currentAttackLabels = [];
                let currentAttackRateList = [];
                let currentAttackMaxRate = 0;
                let currentAttackMaxMethod = "";
                
                let currentAttackATlabels = [];
                let currentAttackNoDefenseACC = [];
                let currentAttackATDefenseACC = [];
                let currentAttackATMaxRate = 0;
                let currentAttackATMaxMethod = '';

                // 检查当前攻击方法是否是对抗训练方法
                const isATMethod = ATMethod.indexOf(attackMethod) !== -1;

                for (const defenseMethod in defenseRatesForAttack) {
                    const rate = defenseRatesForAttack[defenseMethod];

                    if (isATMethod) {
                        // 如果攻击方法是对抗训练方法，所有结果都归类到AT
                        if (currentAttackATMaxRate < rate) {
                            currentAttackATMaxMethod = attackMethod;
                            currentAttackATMaxRate = rate;
                        }
                        if (currentAttackATlabels.indexOf(attackMethod) === -1) {
                            currentAttackATlabels.push(attackMethod);
                            currentAttackATDefenseACC.push(rate);
                            if (this.res.no_defense_accuracy !== undefined) {
                                currentAttackNoDefenseACC.push(this.res.no_defense_accuracy);
                            }
                        }
                    } else {
                        // 如果攻击方法不是对抗训练方法，检查防御方法
                        if (ATMethod.indexOf(defenseMethod) === -1) {
                            if (currentAttackMaxRate < rate) {
                                currentAttackMaxMethod = defenseMethod;
                                currentAttackMaxRate = rate;
                            }
                            currentAttackLabels.push(defenseMethod);
                            currentAttackRateList.push(rate);
                        } else {
                            if (currentAttackATMaxRate < rate) {
                                currentAttackATMaxMethod = defenseMethod;
                                currentAttackATMaxRate = rate;
                            }
                            if (currentAttackATlabels.indexOf(defenseMethod) === -1) {
                                currentAttackATlabels.push(defenseMethod);
                                currentAttackATDefenseACC.push(rate);
                                if (this.res.no_defense_accuracy !== undefined) {
                                    currentAttackNoDefenseACC.push(this.res.no_defense_accuracy);
                                }
                            }
                        }
                    }
                }
                
                allResults[attackMethod] = {
                    detect_labels: currentAttackLabels,
                    detect_ratelist: currentAttackRateList,
                    maxRate: currentAttackMaxRate.toFixed(4),
                    maxMethod: currentAttackMaxMethod,
                    
                    ATlabels: currentAttackATlabels,
                    noDefenseACClist: currentAttackNoDefenseACC,
                    ATDefenseACClist: currentAttackATDefenseACC,
                    ATMaxRate: currentAttackATMaxRate.toFixed(4),
                    ATMaxMethod: currentAttackATMaxMethod,
                };

                if (!firstAttackMethodProcessed) {
                    this.res.detect_labels = currentAttackLabels;
                    this.res.detect_rates = currentAttackRateList;
                    this.res.maxRate = currentAttackMaxRate.toFixed(4);
                    this.res.maxMethod = currentAttackMaxMethod;

                    if (currentAttackATlabels.length > 0) {
                        this.res.ATlabels = currentAttackATlabels;
                        this.res.noDefenseACC = currentAttackNoDefenseACC;
                        this.res.ATDefenseACC = currentAttackATDefenseACC;
                        this.res.ATMaxRate = currentAttackATMaxRate.toFixed(4);
                        this.res.ATMaxMethod = currentAttackATMaxMethod;
                    } else {
                        this.res.ATlabels = [];
                        this.res.noDefenseACC = [];
                        this.res.ATDefenseACC = [];
                        this.res.ATMaxRate = "0.0000";
                        this.res.ATMaxMethod = "";
                    }
                    firstAttackMethodProcessed = true;
                    this.res.currentAttack = attackMethod;
                }
            }

            this.res.allResults = allResults;
            
            this.$nextTick(() => {
                if (this.res.detect_labels && this.res.detect_labels.length > 0) {
                    drawbar("advAttackDefenseEvalChart", this.res.detect_rates, this.res.detect_labels, "", "算法名称", "检出率");
                } else {
                    const chart1Instance = document.getElementById("advAttackDefenseEvalChart");
                    if (chart1Instance && chart1Instance.__echartsInstance__) {
                        echarts.getInstanceByDom(chart1Instance).clear();
                    } else if (chart1Instance) {
                        chart1Instance.innerHTML = '暂无数据';
                    }
                }

                if (this.res.ATlabels && this.res.ATlabels.length > 0) {
                    drawLineBar("defenseATEchart", this.res.ATDefenseACC, this.res.ATlabels, this.res.noDefenseACC);
                } else {
                    const chart2Instance = document.getElementById("defenseATEchart");
                    if (chart2Instance && chart2Instance.__echartsInstance__) {
                        echarts.getInstanceByDom(chart2Instance).clear();
                    } else if (chart2Instance) {
                        chart2Instance.innerHTML = '暂无数据';
                    }
                }
            });
        },
        switchAttackMethod(attackMethod) {
            // Update charts based on selected attack method
            if (this.res.allResults && this.res.allResults[attackMethod]) {
                const results = this.res.allResults[attackMethod];
                
                // Update charts and displayed data
                if (results.detect_labels.length > 0) {
                    this.res.detect_labels = results.detect_labels;
                    this.res.detect_ratelist = results.detect_ratelist;
                    this.res.maxRate = results.maxRate;
                    this.res.maxMethod = results.maxMethod;
                    drawbar("advAttackDefenseEvalChart", results.detect_ratelist, results.detect_labels, "", "算法名称", "检出率");
                }
                
                if (results.ATlabels.length > 0) {
                    this.res.ATlabels = results.ATlabels;
                    this.res.ATDefenseACClist = results.ATDefenseACClist;
                    this.res.noDefenseACClist = results.noDefenseACClist;
                    this.res.ATMaxRate = results.ATMaxRate;
                    this.res.ATMaxMethod = results.ATMaxMethod;
                    drawLineBar("defenseATEchart", results.ATDefenseACClist, results.ATlabels, results.noDefenseACClist);
                }
            }
        },
    },
    watch:{
        result(newValue, oldValue){
            console.log('watch:',this.result)
            if ("attack_defense" in this.result){
                this.updated()
            }else if('detect_rates' in this.result){
                this.updated()
            }
        },
    },
    created(){
        console.log('created:',this.result)
        if ("attack_defense" in this.result){
            this.updated()
        }else if('detect_rates' in this.result){
            this.updated()
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
}</style>