<template>
     <div>
        <a-layout>
            <!-- 顶部菜单栏 -->
        <a-layout-header>
            <!-- 导航栏 -->
            <navmodule/>
        </a-layout-header>
        <a-layout-content>
            <!-- 功能介绍 -->
            <func_introduce :funcDesText="funcDesText"></func_introduce>
            <!-- 参数配置和进度条容器 -->
            <div class="main-container">
                <!-- 参数配置 -->
                <div class="paramCon">
                    <!-- 参数配置容器 -->
                    <h2 class="subTitle" style="margin-top: -96px;">参数配置</h2>
                    
                    <div class="funcParam">
                        <div class="paramTitle" >
                            <!-- 功能标题和执行按钮 -->
                            <!-- icon展示 -->
                            <img class="paramIcom" :src="funcDesText.imgpath" :alt="funcDesText.name">
                            <!-- 功能名称 -->
                            <h3>{{ funcDesText.name }}</h3>
                            <a-button class="DataEva" @click="dataEvaClick" :style="buttonBGColor" :disabled="disStatus">
                                <a-icon type="security-scan" />
                                评估
                            </a-button>
                        </div>
                        <a-divider />
                        <div class="inputdiv">
                            <!-- 输入主体 -->
                            <fairnessDataset :dataname="dataname" @clientDatasetSelect="clientDatasetSelect"></fairnessDataset>
                        </div>
                    </div>
                </div>
                
                <!-- 进度条组件 -->
                <div class="progress-container">
                    <h2 class="subTitle" style="margin-top: -96px;">工作流程进度</h2>
                    <div class="progress-wrapper">
                        <vertical-steps
                            :currentMainStep="currentMainStep"
                            :currentSubStep="currentSubStep"
                            @update:currentMainStep="handleMainStepChange"
                            @update:currentSubStep="handleSubStepChange"
                        />
                    </div>
                </div>
            </div>
            <!-- 日志展示 -->
            <div v-if="logflag">
                <showLog :percent="percent" :logtext="logtext"></showLog>
            </div>
            <!-- 结果展示 -->
            <resultDialog @on-close="closeDialog" :isShow="isShowPublish" v-show="isShowPublish">
                <div slot="header">
                    <div class="dialog_title">
                        <img class="paramIcom" :src="funcDesText.imgpath" :alt="funcDesText.name">
                        <h1>数据集公平性评估结果报告</h1>
                    </div>
                </div>
                <div class="dialog_publish_main" slot="main" id="pdfDom">
                    <div v-if="Object.keys(postData).length > 0" style="background: var(--gray-7, #F2F4F9);;width: 100%;padding: 24px;">
                      <a-row >
                        <a-col :span="2">
                          <div class="grid-content-name" style="color:#6C7385">数据集:</div>
        
                        </a-col>
                        <a-col :span="4">
                          <div class="grid-content-value">{{postData.dataname}}</div>

                        </a-col>
                      </a-row>
                    </div>
                    <!-- 总评分 -->
                    <div class="result_div">
                        <div class="g_score_content">
                            <div class="scorebg">
                                <div class=" main_top_echarts_con_title ">数据集公平性总评分</div>
                            
                                <p class="g_score"> {{result.score}}</p>
                                <p class="g_score_evaluate"> {{ result.score_evaluate }}</p>
                            </div>
                        </div>
                        <div class="conclusion">
                            <p class="result_text">{{ dataname[dataNameValue] }} 数据集综合评分为{{result.score}}，是一个{{ result.score_con }}的数据集</p>
                            <p class="result_annotation">综合评分计算来源是个体公平性和群体公平性两个维度上的评分</p>
                        </div>
                    </div>
                    <!-- 评分详情 -->
                    <div class="result_div">
                        <div class=" main_top_echarts_con_title ">公平性评分详情</div>
                        <div class="two_score">
                            <div class="left_score_label">
                                <P class="score_text">{{ result.consistency_score }}</P>
                                <p class="score_lable">个体公平性评估</p>
                            </div>
                            <div class="center_score_label">
                                <div class="process_bg" ><div class="left_pro" :style="'width:'+result.consistency_score/100*210 +'px'"></div></div>
                                <div class="process_bg" style="margin-left: -4px;"><div class="right_pro" :style="'width:'+result.group_score/100*210 +'px'"></div></div>
                            </div>
                            <div class="right_score_label">
                                <P class="score_text">{{ result.group_score }}</P>
                                <p class="score_lable">群体公平性评估</p>
                            </div>
                        </div>
                        <div class="conclusion" style="height: 80px;">
                            <div class="score_description">
                                <div class="con_score">{{ result.consistency_score }}</div>
                                <div class="result_text" style="line-height: 24px ;display: inline;font-weight: 500;">数据集中个体公平性指标为{{ result.Consistency }}</div>
                            </div>
                            
                        </div>
                        <div class="conclusion" style="height: 80px;">
                            <div class="score_description">
                                <div class="con_score">{{ result.group_score }}</div>
                                <div class="result_text" style="line-height: 24px ;display: inline;font-weight: 500;">数据集经 Favorable Rate Difference、Favorable Rate Ratio 算法评估后，综合得分为{{ result.group_score }}</div>
                            </div>
                        </div>
                    </div>
                    <!-- 个体得分图 -->
                    <div class="result_div">
                        
                        <div class="echart_title">
                            
                            <div class=" main_top_echarts_con_title ">个体公平性评估得分</div>
                            <p class="title_annotation">个体公平性评估是指评估数据集中相似的个体是否有相似的标签或预测结果</p>
                            
                        </div>
                        <div id="rdeva">
                            <div id = 'conseva'></div>
                            <div class="conseva_label">consistency</div>
                            <div class="conclusion">
                                <p class="result_text">{{ consText }}</p>
                                <p class="result_annotation">个体公平性指标越接近1，数据集越公平。</p>
                            </div>
                        </div>
                        
                    </div>
                    
                    
                    <!-- 群体 -->
                    <div class="result_div">
                        <!-- <div class=" main_top_echarts_con_title bar_data_eva" style="display:none">数据集：群体公平性评估</div> -->
                        <div class="echart_title">
                            
                            <div class=" main_top_echarts_con_title ">数据集群体公平性评估</div>
                            <p class="title_annotation">群体公平性是指：根据敏感属性划分各个群体之间在一些目标属性上的差异</p>
                            
                        </div>
                        <div class="group_echarts_div">

                            <div v-for="(temp,index) in senAttrList" class="attr_echarts_div" :key="index">
                                <div class="attr_title_div">
                                    <h3>{{ temp }}</h3>
                                    <p>敏感属性</p>
                                </div>
                                <div class="group_echart_content">
                                    <div  class="group_left_echart"  :id="temp+'Difference'"></div>
                                    <div class="group_right_echart"  :id="temp+'Ratio'"></div>
                                </div>
                                <div class="conclusion">
                                    <p class="result_text">{{ grouptext[temp] }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- <a-divider>With Text</a-divider> -->
                    <!-- 数据占比 -->
                    <div class="result_div">
                        <div class="echart_title">
                            <div class=" main_top_echarts_con_title ">数据集中各属性的占比</div>
                        </div>
                        <div id="pro_tree"></div>   
                        <div class="conclusion">
                                    <p class="result_text">各属性的占比越均匀，数据集越公平</p>
                                    <p class="result_annotation">子节点面积大小代表占比多少</p>
                        </div>           
                    </div>
                    <!-- 相关性 -->
                    <div class="result_div_notop" v-if="['German', 'Adult', 'Compas'].indexOf(postData.dataname) >-1">
                      <div class="echart_title">
                          <div class=" main_top_echarts_con_title ">数据集的各属性之间的相关性</div>
                          <p class="title_annotation">群体公平性是指：根据敏感属性划分各个群体之间在一些目标属性上的差异</p>
                      </div>
                      <div class="heat_content" v-if="flag.nmi">
                          <h3>互信息系数</h3>
                          <div id="NMI" class="heat_canvas" :style="{height:heat_height.nmi}"></div>
                          <div class="conclusion">
                              <p class="result_text">互信息的值大于等于0，值越大表示两个变量之间的依赖关系越强。互信息为0时，表示两个变量相互独立。但是需要注意的是，互信息值的上限取决于两个变量的熵，因此互信息值本身并不具有直接的对比意义。可以使用归一化互信息（Normalized Mutual Information，NMI）进行归一化处理，将其值映射到0到1之间。</p>
                          </div>
                      </div>
                      <div class="heat_content" v-if="flag.pearson">
                          <h3>Pearson相关系数</h3>
                          <div id="person" class="heat_canvas" :style="{height:heat_height.pearson}"></div>
                          <div class="conclusion">
                              <p class="result_text ">Pearson相关系数的取值范围为-1到1。1表示完全正相关，0表示无关，-1表示完全负相关。</p>
                          </div>
                      </div>
                      <div class="heat_content" v-if="flag.spearman">
                      <h3>Spearman秩相关系数</h3>
                          <div id="spearman" class="heat_canvas" :style="{height:heat_height.spearman}"></div>
                          <div class="conclusion" >
                              <p class="result_text ">Spearman秩相关系数的取值范围也为-1到1。1表示完全正单调关系，0表示无单调关系，-1表示完全负单调关系。</p>
                          </div>
                      </div>
                      <div class="heat_content" v-if="flag.kendalltau">
                          <h3>Kendall Tau相关系数</h3>
                          <div id="Kendall" class="heat_canvas" :style="{height:heat_height.kendalltau}"></div>
                          <div class="conclusion">
                              <p class="result_text ">Kendall Tau相关系数的取值范围也为-1到1。1表示完全正序关系，0表示无序关系，-1表示完全负序关系。</p>
                          </div>
                      </div>
                        
                    </div>
                    <a-button @click="getPdf()" style="width:160px;height:40px;margin-bottom:30px;margin-top:10px;
                    font-size:18px;color:white;background-color:rgb(46, 56, 245);border-radius:8px;">
                      导出报告内容
                    </a-button>
                </div>
            </resultDialog>
        </a-layout-content>
        <a-layout-footer>

        </a-layout-footer>
        </a-layout>
     </div>
</template>
<script>
/* 引入组件，导航栏 */
import navmodule from "../components/nav_homme.vue";
/* 引入组件，功能介绍 */
import func_introduce from "../components/funcIntroduce.vue"
/* 引入组件，公平性数据集选择 */
import fairnessDataset from "../components/fairnessDatasetSelect.vue"
/* 引入组件，日志显示 */
import showLog from "../components/showLog.vue"
/* 引入组件，结果显示 */
import resultDialog from "../components/resultDialog.vue"
/* 引入组件，进度条 */
import VerticalSteps from "../components/VerticalSteps.vue"
/* 引入自定义js，结果显示 */
import {drawclass1pro, drawconseva1, drawbar, drawCorelationHeat, drawPopGraph} from "../assets/js/drawEcharts.js"

/* 引入图片 */
import funcicon from "../assets/img/dataEvaIcon.png"
import bgimg from "../assets/img/dataEvaBackground.png"
import centerPng from "../assets/img/center.png"
import secondPng from "../assets/img/second.png"
export default {
    name:"datafairnesseva",
    components:{
        /* 注册组件 */
        navmodule:navmodule,
        func_introduce:func_introduce,
        showLog:showLog,
        resultDialog:resultDialog,
        fairnessDataset:fairnessDataset,
        VerticalSteps,
    },
    data(){
        return{
            htmlTitle: '数据集公平性评估报告',
            stidlist:{},
            postData:{},
            tid:"",
            /* 热力图height*/
            heat_height:{
                pearson:"213px",
                spearman:"213px",
                kendalltau:"213px",
                nmi:"213px",
            },
            flag:{
                pearson:false,
                spearman:false,
                kendalltau:false,
                nmi:false,
            },
            /* 评估按钮样式和状态 */
            buttonBGColor:{
                background:"#0B55F4",
                color:"#FFFFFF"
            },
            disStatus:false,
            /* 数据占比结论 */
            propTextsub:"",
            /* 日志框是否显示，false不显示，true显示，默认不显示 */
            logflag:false,
            /* 进度 */
            percent:10,
            /* 日志内容 */
            logtext:[],
            dataname:["German","Adult","Compas"],
            /* 选中数据集序号 */
            dataNameValue:0,
            /* 选中敏感属性列表 */
            senAttrList:[],
            /* 选中目标属性列表 */
            tarAttrList:[],
            /* 选中统计属性列表 */
            staAttrList:[],
            /* 功能介绍模块信息 */
            funcDesText:{
                /* 功能名称 */
                name:"数据集公平性评估",
                /* 功能icon，需先引入 */
                imgpath:funcicon,
                /* 功能背景图片，需先引入 */
                bgimg:bgimg,
                /* 功能介绍下的总介绍 */
                destext:"数据集中普遍存在偏见，通过公平性评估功能，可视化展示数据集中的偏见现象",
                /* 背景介绍 */
                backinfo:"数据集在收集的过程中的偏见行为可能导致数据集中存在偏见，包括带有偏见的数据标注，带有偏见的数据采样，如男性样本的比例远高于女性等等，数据公平性评估功能发现数据集中属性分布不均衡现象，并直观向用户展示数据问题。",
                /* 亮点介绍 */
                highlight:[
                    "支持German，Adult，Compas数据集",
                    "数据集中存在多种属性，用户可自定义选择敏感属性",
                    "从数据集基础统计分析、群体公平性、个体公平性等多个维度评估数据集，可视化展示数据集公平性"
                ]
            },
            /* 结果弹窗状态信息 */
            isShowPublish:false,
            /* 个体公平性结论 */
            consText:"",
            /* 数据占比结论 */
            propText:{},
            /* 群体公平性结论 */
            grouptext:{},
            /* 公平性结果 */
            result:{
                "score":72,
                "consistency_score":60,
                "group_score":70,},
            /* 进度条当前步骤 */
            currentMainStep: 0,
            currentSubStep: 0,
        }
    },
    watch:{
        /* 判断弹框是否显示，如果true显示结果弹框，并且底层滚动取消*/
        isShowPublish:{
            immediate:true,
            handler(v){
                if(v){
                    this.noScroll();
                }else{
                    this.canScroll();
                }
            }
        },
        /* 监听路由变化，更新进度条状态 */
        '$route': {
            immediate: true,
            handler(to) {
                this.setProgressStepsByRoute();
            }
        }
    },
    created() {
        document.title = '数据集公平性评估';
        this.setProgressStepsByRoute();
        },
        //在离开页面时执行
    beforeDestroy() {
        if(this.logclk){
            window.clearInterval(this.logclk);
        }
    },
    mounted() {
        // 确保在组件挂载后设置正确的进度条状态
        this.$nextTick(() => {
            this.setProgressStepsByRoute();
        });
    },
    methods: { 
        /* 获取日志 */ 
        getLog(){
            var that = this;
            if(that.percent < 99){
               that.percent += 1;
            }
            if (that.tid==''){
                console.log(that.tid)
                return
            }
            that.$axios.get('/Task/QueryLog', { params: { Taskid: that.tid } }).then((data) => {
                if (JSON.stringify(that.stidlist)=='{}'){
                    that.logtext = [Object.values(data.data.Log).slice(-1)[0]];
                    console.log(that.logtext)
                }else{
                    that.logtext=[]
                    for(let temp in that.stidlist){
                        that.logtext.push(data.data.Log[that.stidlist[temp]]);
                    }
                }
            });
        },
        callbackpro(val) {
            console.log("callbackval",val);
            if(!(this.staAttrList[val] in this.result["Proportion"])){
                drawclass1pro("pro",this.result["Proportion"][this.staAttrList[val]], this.staAttrList[val],this.dataname[this.dataNameValue]);
                this.propTextsub = this.propText[this.staAttrList[val]];
            }
            
        }, 
        /* 关闭结果窗口 */
        closeDialog(){
        this.isShowPublish=false;
        //把绑定的弹窗数组 设为false即可关闭弹窗
        },
        /* 监听数据集选择 */
        clientDatasetSelect(value, senAttrList, tarAttrList, staAttrList){
            this.dataNameValue = value;
            this.senAttrList = senAttrList;
            this.tarAttrList = tarAttrList;
            this.staAttrList = staAttrList;
            if(senAttrList.length==0 || tarAttrList.length==0 || staAttrList.length==0){
                this.buttonBGColor.background = "#C8DCFB";
                // this.disStatus = true;
                
                
            }else{
                this.buttonBGColor.background = "#0B55F4";
                // this.disStatus = false;
            };
        },
        /* result 处理*/
        resultPro(res){
            var that = this;
            // 总分判断
            if(that.result.score > 80){
                that.result.score_evaluate = "优秀";
                that.result.score_con = "公平";
            }else if(that.result.score > 60 && that.result.score <=80){
                that.result.score_evaluate = "良好";
                that.result.score_con = "较公平";
            }else{
                that.result.score_evaluate = "差";
                that.result.score_con = "较不公平";
            }
            that.result["Consistency"]=parseFloat(res.Consistency).toFixed(2)*100;
            that.result["Proportion"]=res.Proportion;
            var color='#0B55F4';
            if (that.result["Consistency"]<=30){
                color = "#F4320B";
            }else if(that.result["Consistency"]>70){
                color='#07C168';
            }else{
                color = '#0B55F4';
            }
            //得分图
            drawconseva1("conseva",that.result["Consistency"],color);
            if( that.result["Consistency"] > 90 )
            {
                that.consText=that.dataname[that.dataNameValue]+"数据集的个体公平性得分为"+that.result["Consistency"]+"，高于标准线0.9，故该数据集从个体公平性方面分析结果为公平数据集";
            }
            else if( that.result["Consistency"] <= 90 && that.result["Consistency"] >= 60 )
            {
                that.consText=that.dataname[that.dataNameValue]+"数据集的个体公平性得分为"+that.result["Consistency"]+"，高于标准线0.6，故该数据集从个体公平性方面分析结果为较公平数据集";
            }
            else( that.result["Consistency"] < 60 )
            {
                that.consText=that.dataname[that.dataNameValue]+"数据集的个体公平性得分为"+that.result["Consistency"]+"，低于标准线0.6，故该数据集从个体公平性方面分析结果为相对不公平数据集";
            }
            //直方图
            var diflist={};
            var ratiolist={};
            var labels = [];
            // 初始化diflist和ratiolist
            for(let attrTemp of that.senAttrList){
                diflist[attrTemp]=[];
                ratiolist[attrTemp]=[];
            };
            // 群体评估数据整合
            for(let temp1 in that.result["Favorable Rate Difference"]){
                labels.push(temp1)

                for(let attrTemp of that.senAttrList){
                    diflist[attrTemp].push(parseFloat(res["Favorable Rate Difference"][temp1][attrTemp]).toFixed(2))
                    ratiolist[attrTemp].push(parseFloat(res["Favorable Rate Ratio"][temp1][attrTemp]).toFixed(2))
                }
            };
            that.result["diflist"]=diflist;
            that.result["ratiolist"]=ratiolist;
            // 画图
            for(let attrTemp of that.senAttrList){
                drawbar(attrTemp+"Difference",diflist[attrTemp],labels,"Favorable Rate Difference");
                drawbar(attrTemp+"Ratio",ratiolist[attrTemp],labels,"Favorable Rate Ratio");
                that.grouptext[attrTemp]="本次测试敏感属性为"+attrTemp+"，目标属性为"+labels.toString()+"\
                左上直方图为使用favorable rate ratio的统计结果，表示不同"+attrTemp+"对目标属性结果预测的影响，\
                值越接近1则表示则敏感属性对目标属性的影响越小，\
                右上图直方图为使用favorable rate difference的统计结果，值越小则敏感属性"+attrTemp+"对目标属性的影响越小。"
            }
            // 占比图
            var data = {
                id: "center_"+that.dataname[that.dataNameValue],
                label: that.dataname[that.dataNameValue],
                population: 1,
                children: []};
            
            for (let key in that.result.Proportion){
                var second_children={
                    id:"second_"+key,
                    label:key,
                    population:1,
                    children:[]
                };
                for( let key1 in that.result.Proportion[key]){
                    var third_children={
                    id:key+'_'+key1,
                    label:key1,
                    population:parseFloat(that.result.Proportion[key][key1]).toFixed(3),
                    isLeaf: true,
                    };
                    second_children["children"].push(third_children);
                }
                data["children"].push(second_children);
            }
            
            console.log("centerPng11:",centerPng);
            drawPopGraph("pro_tree", data, centerPng, secondPng)
            // 热力图
            var personData=[];
                var spearmanData=[];
                var kendallData=[];
                var NMIData=[];
                var pearsonX=[];
                var pearsonY=[];
                var spearmanX=[];
                var spearmanY=[];
                var kendalltauX=[];
                var kendalltauY=[];
                var mutualX=[];
                var mutualY=[];
                for(let temp of this.result["Corelation coefficients"] ){
                    if(temp.values.pearson != null){
                        if(pearsonX.indexOf(temp["attr"]) == -1){
                            pearsonX.push(temp["attr"])
                        }
                        if(pearsonY.indexOf(temp["target"]) == -1){
                            pearsonY.push(temp["target"])
                        }
                        personData.push([pearsonX.indexOf(temp["attr"]), pearsonY.indexOf(temp["target"]) ,parseFloat(temp.values.pearson).toFixed(3)])
                    }
                    if(temp.values.spearman != null){
                        if(spearmanX.indexOf(temp["attr"]) == -1){
                            spearmanX.push(temp["attr"])
                        }
                        if(spearmanY.indexOf(temp["target"]) == -1){
                            spearmanY.push(temp["target"])
                        }
                        spearmanData.push([spearmanX.indexOf(temp["attr"]) ,spearmanY.indexOf(temp["target"]) ,parseFloat(temp.values.spearman).toFixed(3)])
                    }
                    if(temp.values.kendalltau != null){
                        if(kendalltauX.indexOf(temp["attr"]) == -1){
                            kendalltauX.push(temp["attr"])
                        }
                        if(kendalltauY.indexOf(temp["target"]) == -1){
                            kendalltauY.push(temp["target"])
                        }
                        kendallData.push([kendalltauX.indexOf(temp["attr"]), kendalltauY.indexOf(temp["target"]) ,parseFloat(temp.values.kendalltau).toFixed(3)])
                    }
                    if(temp.values.mutual_info != null){
                        if(mutualX.indexOf(temp["attr"]) == -1){
                            mutualX.push(temp["attr"])
                        }
                        if(mutualY.indexOf(temp["target"]) == -1){
                            mutualY.push(temp["target"])
                        }
                        NMIData.push([mutualX.indexOf(temp["attr"]), mutualY.indexOf(temp["target"]), parseFloat(temp.values.mutual_info).toFixed(3)])
                    }
                };
                if (mutualY.length>5){
                    this.heat_height.nmi = 48 * mutualY.length + "px";
                }
                if (kendalltauY.length>5){
                    this.heat_height.kendalltau = 48 * kendalltauY.length + "px";
                }
                if (spearmanY.length>5){
                    this.heat_height.spearman = 48 * spearmanY.length + "px";
                }
                if (pearsonY.length>5){
                    this.heat_height.pearson = 48 * pearsonY.length + "px";
                }
                var NMIColorList=["rgba(206, 221, 253, 1)", "rgba(157, 187, 251, 1)", "rgba(60, 119, 246, 1)", "rgba(11, 85, 244, 1)", "rgba(7, 51, 146, 1)"];
                var spearmanColorList=["rgba(223, 206, 253, 1)", "rgba(191, 157, 251, 1)", "rgba(142, 84, 247, 1)" ,"rgba(94, 11, 244, 1)", "rgba(56, 7, 146, 1)"];
                var kendallColorList=["rgba(253, 227, 206, 1)", "rgba(251, 199, 157, 1)", "rgba(247, 158, 84, 1)", "rgba(244, 116, 11, 1)", "rgba(146, 70, 7, 1)"];
                var personColorList=["rgba(253, 206, 236, 1)", "rgba(251, 157, 218, 1)", "rgba(247, 84, 190, 1)", "rgba(244, 11, 162, 1)", "rgba(195, 9, 130, 1)"];
                // person热力图
                if( NMIData.length > 0 ){
                    this.flag.nmi = true
                    drawCorelationHeat("NMI", mutualX, mutualY, NMIData, NMIColorList);
                }
                if(personData.length > 0){
                    this.flag.pearson = true
                    drawCorelationHeat("person", pearsonX, pearsonY, personData, personColorList);
                }
                if(spearmanData.length > 0){
                    this.flag.spearman = true
                    drawCorelationHeat("spearman", spearmanX, spearmanY, spearmanData, spearmanColorList);
                }
                if(kendallData.length > 0){
                    this.flag.kendalltau = true
                    drawCorelationHeat("Kendall", kendalltauX, kendalltauY, kendallData, kendallColorList);
                }
            

        },
        initParam(){
            this.logtext=[]
            this.percent=0
            this.postData={}
            this.result = {}
            this.tid=''
            this.stidlist = {}
            if(this.clk != ''){
                window.clearInterval(this.clk)
                this.clk = ''
            }
            if(this.logclk != ''){
                window.clearInterval(this.logclk)
                this.logclk = ''
            }
        },
        /* 点击评估触发事件 */
        dataEvaClick(){
            this.initParam()
            /*判断选择*/
            if (this.senAttrList.length ==0 ){
                this.$message.warning('请在数据集里面至少选择一项敏感属性！',3);
                return 0;
            };
            if (this.tarAttrList.length ==0 ){
                this.$message.warning('请在数据集里面至少选择一项目标属性！',3);
                return 0;
            };
            if (this.staAttrList.length ==0 ){
                this.$message.warning('请在数据集里面至少选择一项统计属性！',3);
                return 0;
            };
            this.logflag = true;
            var that=this;
            /* 调用创建主任务接口 */
            this.$axios.post("/Task/CreateTask",{AttackAndDefenseTask:0}).then((result) => {
                console.log(result);
                that.tid = result.data.Taskid;
                that.postData={
                dataname:that.dataname[that.dataNameValue],
                senAttrList:JSON.stringify(that.senAttrList),
                tarAttrList:JSON.stringify(that.tarAttrList),
                staAttrList:JSON.stringify(that.staAttrList),
                tid:that.tid};
                console.log(that.postData)
                that.logclk = window.setInterval(() => {
                    that.getLog();
                },200)
                that.percent=50
                that.$axios.post("/DataFairnessEvaluate",that.postData).then((res) => {
                    /* 同步任务，接口直接返回结果，日志关闭，结果弹窗显示 */
                    that.percent=100
                    that.isShowPublish = true;
                    res.data["score"] = parseInt(res.data["Overall fairness"]*100);
                    res.data["consistency_score"] = parseFloat(res.data["Overall individual fairness"]).toFixed(2)*100;
                    res.data["group_score"] =  parseFloat(res.data["Overall group fairness"]).toFixed(2)*100;
                    that.result = res.data;
                    that.resultPro(res.data);
                    // that.logflag = false;
                    window.clearInterval(that.logclk);
                }).catch((err) => {
                        console.log(err)
                });
            }).catch((err) => {
                console.log(err)
            });    
        },
        /* 处理主步骤变化 */
        handleMainStepChange(step) {
            this.currentMainStep = step;
            // 根据主步骤更新子步骤
            if (step === 0) {
                // 准备阶段
                this.currentSubStep = 0;
            } else if (step === 1) {
                // 训练阶段
                this.currentSubStep = 0;
            } else if (step === 2) {
                // 部署阶段
                this.currentSubStep = 0;
            }
        },
        /* 处理子步骤变化 */
        handleSubStepChange(step) {
            this.currentSubStep = step;
            // 根据子步骤执行相应的导航
            if (this.currentMainStep === 0) {
                // 准备阶段的子步骤
                if (step === 0) {
                    // 数据公平性提升
                    this.$router.push('/dataFairnessDebias');
                } else if (step === 1) {
                    // 对抗攻击评估
                    this.$router.push('/advAttack');
                } else if (step === 2) {
                    // 测试样本自动生成
                    this.$router.push('/concolic');
                }
            } else if (this.currentMainStep === 1) {
                // 训练阶段的子步骤
                if (step === 0) {
                    // 模型公平性提升
                    this.$router.push('/modelFairnessDebias');
                } else if (step === 1) {
                    // 模型鲁棒性训练
                    this.$router.push('/robust_advTraining');
                } else if (step === 2) {
                    // 异常数据检测
                    this.$router.push('/dataClean');
                }
            } else if (this.currentMainStep === 2) {
                // 部署阶段的子步骤
                if (step === 0) {
                    // 数据公平性评估
                    this.$router.push('/dataFairnessEva');
                } else if (step === 1) {
                    // 对抗攻击防御
                    this.$router.push('/advAttackDefense');
                } else if (step === 2) {
                    // 后门攻击防御
                    this.$router.push('/backdoorDefense');
                }
            }
        },
        /* 根据当前路由设置进度条状态 */
        setProgressStepsByRoute() {
            const route = this.$route.path;
            // 准备阶段
            if (route.includes('/dataFairnessDebias')) {
                this.currentMainStep = 0;
                this.currentSubStep = 0;
            } else if (route.includes('/advAttack')) {
                this.currentMainStep = 0;
                this.currentSubStep = 1;
            } else if (route.includes('/concolic')) {
                this.currentMainStep = 0;
                this.currentSubStep = 2;
            } 
            // 训练阶段
            else if (route.includes('/modelFairnessDebias')) {
                this.currentMainStep = 1;
                this.currentSubStep = 0;
            } else if (route.includes('/robust_advTraining')) {
                this.currentMainStep = 1;
                this.currentSubStep = 1;
            } else if (route.includes('/dataClean')) {
                this.currentMainStep = 1;
                this.currentSubStep = 2;
            }
            // 部署阶段
            else if (route.includes('/dataFairnessEva')) {
                this.currentMainStep = 2;
                this.currentSubStep = 0;
            } else if (route.includes('/advAttackDefense')) {
                this.currentMainStep = 2;
                this.currentSubStep = 1;
            } else if (route.includes('/backdoorDefense')) {
                this.currentMainStep = 2;
                this.currentSubStep = 2;
            }
        }
    }
}
</script>
<!-- <style  scoped> -->
<style scoped>

.paramCon{
    width: 1200px;
    margin-left: 360px;
}

.paramTitle{
    height:80px;
    padding: 20px 24px 20px 26px;
    text-align: left;
    width: 1200px;
}
.paramIcom{
    display: inline;
    width: 36px;
    height: 36px;
    margin: auto 10px 0px auto;
}
.paramTitle h3{
    /* height: 48px; */
    display: inline;
    margin-top: 38px;
    width: 279px;
    height: 36px;
    font-family: PingFangSC-Semibold;
    font-size: 24px;
    color: #333333;
    letter-spacing: 0;
    line-height: 48px;
    font-weight: 600;
}
/* 按钮样式 */
.DataEva{
    float: right;
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 20px;
    padding: 0px 24px;
    font-family: 'Microsoft YaHei';
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0px 24px;
    gap: 4px;
    width: 114px;
    height: 40px;
    background: #FFFFFF;
    border-radius: 6px;
}
.ant-divider-horizontal{
    margin: 0 0;
}

/* 图表名称样式 */
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
.dialog_publish_main{
align-items: center;
flex-direction: column;
position: absolute;
display: flex;
width: 1080px;
}
.g_score_content{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px 120px;
    gap: 20px;
    width: 960px;
    height: 366px;
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}

/* 结果文字样式 */
.resultext{
    width: 100%;
    /* height: 22px; */
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #000000;
    font-weight: 400;
    margin-top: -40px;
}
/* 得分图div */
#rdeva{
    display: flex;
flex-direction: column;
align-items: center;
padding: 0px;
width: 960px;
height: 414px;
flex: none;
order: 1;
flex-grow: 0
}
/* 得分图echart */
#conseva{
    width: 300px;
    height:300px;
}
/* 仪表盘中的文字 */
.conseva_label{
    margin-top: -85px;
    margin-bottom: 85px;
    width: 86px;
    height: 16px;
    font-family: 'Helvetica Neue';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 16px;
    text-align: center;
    color: #000000;
    flex: none;
    order: 1;
    flex-grow: 0;
}
/* 群体公平性 */
.group_echarts_div{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 24px;
    margin-top: 32px;
    width: 960px;
    flex: none;
    order: 1;
    flex-grow: 0;
}
/* 群体-单个属性框样式 */
.attr_echarts_div{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0px;
    width: 960px;
    flex: none;
    order: 0;
    flex-grow: 0;
}
/* 群体-属性标题框样式 */
.attr_title_div{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0px;
    gap: 4px;
    width: 960px;
    height: 64px;
    flex: none;
    order: 0;
    flex-grow: 0;
}
.attr_title_div h3{
    font-family: 'HONORSansCN-Bold';
    flex-direction: column;
    margin-bottom: 0px;
font-size: 28px;
line-height: 36px;
/* identical to box height, or 129% */

display: flex;
align-items: center;
text-align: center;

color: rgba(0, 0, 0, 0.9);


/* Inside auto layout */

flex: none;
order: 0;
align-self: stretch;
flex-grow: 0;
}
.attr_title_div p{
    font-family: 'HONOR Sans CN';
    flex-direction: column;
    margin-bottom: 0px;
font-size: 14px;
line-height: 24px;
/* identical to box height, or 171% */

display: flex;
align-items: center;
text-align: center;

/* gray-3 */

color: #6C7385;


/* Inside auto layout */

flex: none;
order: 1;
align-self: stretch;
flex-grow: 0;
}
.group_echart_content{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0px;
    width: 960px;
    height: 358px;
    flex: none;
    order: 0;
    flex-grow: 0;
}
/* 左边直方图 */
.group_left_echart{
    width: 480px;
    height: 358px;
    float: left;

}
/* 右边直方图 */
.group_right_echart{
    width: 480px;
    height: 358px;
    float: right;
}
/* 热力图框总样式 */
.heat_content{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0px;
    gap: 16px;

    width: 960px;


    /* Inside auto layout */

    flex: none;
    order: 0;
    flex-grow: 0;
}
/* 热力图标题样式 */
.heat_content h3{
font-family: 'HONOR Sans CN';
font-size: 24px;
line-height: 32px;
font-weight: 700;
margin-top:24px;
/* identical to box height, or 133% */

display: flex;
align-items: center;
text-align: center;

/* 文字色/light/fontgray4-title */

color: rgba(0, 0, 0, 0.9);


/* Inside auto layout */

flex: none;
order: 0;
flex-grow: 1;
}
/* 热力图画布大小 */
.heat_canvas{
    width: 960px;
    /* max-height: 930px;
    min-height: 213px; */
}
/* 占比图画布大小 */
#pro_tree{
    width: 960px;
    height: 600px;
    /* min-height: 200px;
    max-height: 600px; */
}

/* 主容器样式 */
.main-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 40px;
    position: relative;
}

/* 进度条容器样式 */
.progress-container {
    width: 300px;
    background-color: #F5F8FF;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    position: fixed;
    right: 60px;
    top: 50%;
    transform: translateY(-50%);
    height: fit-content;
}

.progress-wrapper {
    margin-top: 20px;
}
</style>
