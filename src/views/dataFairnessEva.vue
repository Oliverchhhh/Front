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
                        <a-button class="DataEva" @click="dataEvaClick">
                            <a-icon type="security-scan" />
                            评估
                        </a-button>
                    </div>
                    <a-divider />
                    <div class="inputdiv">
                        <!-- 输入主体 -->
                        <fairnessDataset @clientDatasetSelect="clientDatasetSelect"></fairnessDataset>
                    </div>
                </div>
            </div>
            <!-- 日志展示 -->
            <div v-if="logflag">
                <showLog :percent="percent" :logtext="logtext"></showLog>
            </div>
            <!-- 结果展示 -->
            <dataEvaResult @on-close="closeDialog" :isShow="isShowPublish" v-show="isShowPublish">
                <div slot="header">
                    <div class="dialog_title">
                        <h1>公平性评估</h1>
                        <p class="inputParam">数据集：{{ dataname[dataNameValue] }} 所选敏感属性：<span v-for="(temp,index) in senAttrList" :key="index">{{ temp }} </span> 所选目标属性：<span v-for="(temp,index) in tarAttrList" :key="index">{{ temp }} </span></p>
                        <p class="inputParam">所选统计属性：<span v-for="(temp,index) in staAttrList" :key="index">{{ temp }} </span></p>
                    </div>
                </div>
                <div class="dialog_publish_main" slot="main">
                    <!-- 得分图 -->
                    <div class="result" style="width: 100%;position: relative;">
                        <div id="rdeva">
                            <div class="echart_title">
                                <div class="left_gradient"></div>
                                <div class=" main_top_echarts_con_title ">个体公平性评估得分</div>
                                <div class="right_gradient"></div>
                            </div>
                            <div id = 'conseva' class="result" style="width: 500px;height:400px;margin-left:25%;margin-top: -10px;"></div>
                            <div class="resultext">
                                <p>说明：个体公平性评估是指评估数据集中相似的个体是否有相似的标签或预测结果，趋于相似则代表数据集是公平的。</p>
                                <p>{{ consText }}</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 数据占比 -->
                    <div class="result" style="width: 100%;position: relative;float: left;margin-top: 0%;">
                        <div class="echart_title">
                            <div class="left_gradient"></div>
                            <div class=" main_top_echarts_con_title ">各群体优势预测结果占比/各群体样本占比</div>
                            <div class="right_gradient"></div>
                        </div>
                        <div style="width:100px;float: left;margin: 10px 0px 10px 40px;height: 400px;background-color: beige;">
                            <a-tabs  tab-position="left" style="margin-top: 10px;" size="large" @change="callbackpro">
                            <a-tab-pane v-for="(temp,index) in staAttrList" :key=index :tab=temp>
                            </a-tab-pane>
                        </a-tabs>
                        </div>
                        <div id="pro" class="result" style="width: 678px;height:400px;display: inline-block;"></div>   
                        <div class="resultext">
                                    <p >{{ propTextsub }}</p>
                        </div>           
                    </div>
                    <!-- 群体 -->
                    <div class="result" style="width: 100%; position: relative; float: left;margin-top: 0.1%;">
                        <!-- <div class=" main_top_echarts_con_title bar_data_eva" style="display:none">数据集：群体公平性评估</div> -->
                        <div class="echart_title">
                            <div class="left_gradient"></div>
                            <div class=" main_top_echarts_con_title ">数据集：群体公平性评估</div>
                            <div class="right_gradient"></div>
                        </div>
                        <div style="width: 98%;height: 90%;overflow: scroll;margin-left :1%">
                            <div class="result" v-for="(temp,index) in senAttrList" style="float: left;margin-top:.5%;margin-bottom:5%" :key="index">
                                <div  style="float: left;width: 500px;height: 400px;" :id="temp+'Difference'"></div>
                                <div style="width:500px;float:left;height:400px" :id="temp+'Ratio'"></div>
                                <div class="resultext">
                                    <p>说明：群体公平性评估是指评估数据集中同一属性下各个群体通过不同评估方法预测结果准确率是否有差别，差别越小则代表数据集越公平。如上图是{{ temp }}属性下的群体公平性评估</p>
                                    <p >{{ grouptext[temp] }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </dataEvaResult>
        </a-layout-content>
        <a-layout-footer>

        </a-layout-footer>
        </a-layout>
     </div>
</template>
<script>
/* 引入组件，导航栏 */
import navmodule from "../components/nav.vue";
/* 引入组件，功能介绍 */
import func_introduce from "../components/funcIntroduce.vue"
/* 引入组件，公平性数据集选择 */
import fairnessDataset from "../components/fairnessDatasetSelect.vue"
/* 引入组件，日志显示 */
import showLog from "../components/showLog.vue"
/* 引入组件，结果显示 */
import dataEvaResult from "../components/dataEvaResult.vue"
/* 引入自定义js，结果显示 */
import {drawclass1pro, drawconseva1, drawbar} from "../assets/js/drawEcharts.js"
/* 引入图片 */
import funcicon from "../assets/img/dataEvaIcon.png"
import bgimg from "../assets/img/dataEvaBackground.png"

// import { defineComponent,reactive, ref } from 'vue';

export default {
    name:"datafairnesseva",
    components:{
        /* 注册组件 */
        navmodule:navmodule,
        func_introduce:func_introduce,
        showLog:showLog,
        dataEvaResult:dataEvaResult,
        fairnessDataset:fairnessDataset
    },
    data(){
        return{
            /* 数据占比结论 */
            propTextsub:"",
            /* 日志框是否显示，false不显示，true显示，默认不显示 */
            logflag:false,
            /* 进度 */
            percent:10,
            /* 日志内容 */
            logtext:["开始执行","执行结束"],
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
                    "支持用户上传自定义数据集",
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
            result:{}
        }
    },
    watch:{
        /* 判断弹框是否显示，如果true显示结果弹框，并且底层滚动取消*/
        isShowPublish:{
            immediate:true,
            handler(v){
                if(v){
                    this.noScroll();
                    // body.style.overflow="hidden";
                    // body.style.height="100%";
                    // document.body.style.overflow="hidden";
                    // document.body.style.height="100%";
                }else{
                    this.canScroll();
                    // body.style.overflow="visible";
                    // body.style.height="herit";
                    // document.body.style.overflow="visible";
                    // document.body.style.height="auto";
                }
            }
        }
    },
    mounted(){
        let that=this;
        // that.resultPro();
        // that.callbackpro(0);
    },
    methods: { 
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
        },
        /* result 处理*/
        resultPro(){
            // debugger;
            this.senAttrList = ['age'];
            this.tarAttrList = ['credit_amount'];
            this.staAttrList = ['age','credit_amount'];
            var that = this;
            var res = {'Favorable Rate Difference': 
                    {'credit_amount': 
                        {'age': 0.05977907732293697}
                    }, 
                    'Favorable Rate Ratio': {
                        'credit_amount': {
                            'age': 0.8472521999003819
                        }
                    }, 
                    'Consistency': 0.7814000000000003, 
                    'Proportion': {
                        'age': {
                            '>25': 0.81, '<=25': 0.18999999999999995
                        }
                    }, 
                    'Corelation coefficients': [{
                        'attr': 'credit_amount', 'target': 'credit_amount', 'values': {
                            'pearson': 0.9999999999999999, 'spearman': 1.0, 'kendalltau': 1.0, 'mutual_info': 0.6640641265641081
                        }
                    }, {
                        'attr': 'credit_amount', 'target': 'age', 'values': {
                            'pearson': 0.048314876568606106, 'spearman': 0.04831487656860612, 'kendalltau': 0.04831487656860611, 'mutual_info': 0.0011839451088140607
                        }
                    }, {
                        'attr': 'age', 'target': 'credit_amount', 'values': {
                            'pearson': 0.048314876568606106, 'spearman': 0.04831487656860612, 'kendalltau': 0.04831487656860612, 'mutual_info': 0.0011839451088140607
                        }
                    }, {
                        'attr': 'age', 'target': 'age', 'values': {
                            'pearson': 1.0, 'spearman': 1.0, 'kendalltau': 1.0, 'mutual_info': 0.4862229646617908
                        }
                    }]
                };
            that.result["Consistency"]=res.Consistency.toFixed(2);
            that.result["Proportion"]=res.Proportion;
            //得分图
            drawconseva1("conseva",res.Consistency.toFixed(2));
            if( res.Consistency.toFixed(2)>0.9 )
            {
                that.consText=that.dataname[that.dataNameValue]+"数据集的个体公平性得分为"+res.Consistency.toFixed(2)+"，高于标准线0.9，故该数据集从个体公平性方面分析结果为公平数据集";
            }
            else if( res.Consistency.toFixed(2)<=0.9 && res.Consistency.toFixed(2)>=0.6 )
            {
                that.consText=that.dataname[that.dataNameValue]+"数据集的个体公平性得分为"+res.Consistency.toFixed(2)+"，高于标准线0.6，故该数据集从个体公平性方面分析结果为较公平数据集";
            }
            else( res.Consistency.toFixed(2)<0.6 )
            {
                that.consText=that.dataname[that.dataNameValue]+"数据集的个体公平性得分为"+res.Consistency.toFixed(2)+"，低于标准线0.6，故该数据集从个体公平性方面分析结果为相对不公平数据集";
            }
            //饼图
            
            for( var key in res.Proportion){
                // drawclass1pro(key+"pro", res.Proportion[key], key, that.dataname[that.dataNameValue]);
                var maxkey ="";
                var maxvalue=0;
                var minkey="";
                var minvalue=1;
                for(let temp in res.Proportion[key]){
                    if( res.Proportion[key][temp]>=maxvalue ){
                        maxkey=temp;
                        maxvalue=res.Proportion[key][temp]
                    }
                    if (res.Proportion[key][temp] < minvalue){
                        minkey=temp;
                        minvalue=res.Proportion[key][temp]
                    }
                }
                var maxmin=maxvalue/minvalue;
                if(maxmin < 1.2){
                    that.propText[key]="数据集属性"+key+"中，"+maxkey+"的占比是"+maxvalue.toFixed(2)+"，"+minkey+"的占比是"+minvalue.toFixed(2)+",两者间的比值是"+maxmin.toFixed(2)+"相对公平";
                }else{
                    that.propText[key]="数据集属性"+key+"中，"+maxkey+"的占比是"+maxvalue.toFixed(2)+"，"+minkey+"的占比是"+minvalue.toFixed(2)+",两者间的比值是"+maxmin.toFixed(2)+"相对不公平"
                }
                
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
            for(let temp1 in res["Favorable Rate Difference"]){
                labels.push(temp1)
                for(let attrTemp of that.attrlist){
                    diflist[attrTemp].push(res["Favorable Rate Difference"][temp1][attrTemp].toFixed(2))
                    ratiolist[attrTemp].push(res["Favorable Rate Ratio"][temp1][attrTemp].toFixed(2))
                }
            };
            that.result["diflist"]=diflist;
            that.result["ratiolist"]=ratiolist;
            // 画图
            for(let attrTemp of that.senAttrList){
                drawbar(attrTemp+"Difference",diflist[attrTemp],labels,"Favorable Rate Difference");
                drawbar(attrTemp+"Ratio",ratiolist[attrTemp],labels,"Favorable Rate Ratio");
                that.grouptext[attrTemp]="结果说明待填充"
            }

        },
        /* 点击评估触发事件 */
        dataEvaClick(){
            this.logflag = true;
            /*判断选择*/
            if (this.senAttrList.length ==0 ){
                alert("请选择敏感属性");
            };
            if (this.tarAttrList.length ==0 ){
                alert("请选择目标属性");
            };
            if (this.staAttrList.length ==0 ){
                alert("请选择统计属性");
            };
            var that=this;
            var tid = "";
            /* 调用创建主任务接口 */
            this.$axios.post("http://127.0.0.1:24109/Task/CreateTask",{AttackAndDefenseTask:0}).then((result) => {
                console.log(result);
                tid = result.data.Taskid;
                const postdata={
                dataname:that.dataname[that.dataNameValue],
                senAttrList:JSON.stringify(that.senAttrList),
                tarAttrList:JSON.stringify(that.tarAttrList),
                staAttrList:JSON.stringify(that.staAttrList),
                tid:tid};
                console.log(postdata)
                that.$axios.post("http://127.0.0.1:24109/DataFairnessEvaluate",postdata).then((ressult) => {
                    /* 同步任务，接口直接返回结果，日志关闭，结果弹窗显示 */
                    that.logflag = false;
                    that.isShowPublish = true;
                    var res = ressult.data;
                    console.log(res);
                    
                    that.result["Consistency"]=res.Consistency.toFixed(2);
                    that.result["Proportion"]=res.Proportion;
                    //得分图
                    drawconseva1("conseva",res.Consistency.toFixed(2));
                    if( res.Consistency.toFixed(2)>0.9 )
                    {
                        that.consText=that.dataname[that.dataNameValue]+"数据集的个体公平性得分为"+res.Consistency.toFixed(2)+"，高于标准线0.9，故该数据集从个体公平性方面分析结果为公平数据集";
                    }
                    else if( res.Consistency.toFixed(2)<=0.9 && res.Consistency.toFixed(2)>=0.6 )
                    {
                        that.consText=that.dataname[that.dataNameValue]+"数据集的个体公平性得分为"+res.Consistency.toFixed(2)+"，高于标准线0.6，故该数据集从个体公平性方面分析结果为较公平数据集";
                    }
                    else( res.Consistency.toFixed(2)<0.6 )
                    {
                        that.consText=that.dataname[that.dataNameValue]+"数据集的个体公平性得分为"+res.Consistency.toFixed(2)+"，低于标准线0.6，故该数据集从个体公平性方面分析结果为相对不公平数据集";
                    }
                    //饼图
                    
                    for( var key in res.Proportion){
                        // drawclass1pro(key+"pro", res.Proportion[key], key, that.dataname[that.dataNameValue]);
                        var maxkey ="";
                        var maxvalue=0;
                        var minkey="";
                        var minvalue=1;
                        for(let temp in res.Proportion[key]){
                            if( res.Proportion[key][temp]>=maxvalue ){
                                maxkey=temp;
                                maxvalue=res.Proportion[key][temp]
                            }
                            if (res.Proportion[key][temp] < minvalue){
                                minkey=temp;
                                minvalue=res.Proportion[key][temp]
                            }
                        }
                        var maxmin=maxvalue/minvalue;
                        if(maxmin < 1.2){
                            that.propText[key]="数据集属性"+key+"中，"+maxkey+"的占比是"+maxvalue.toFixed(2)+"，"+minkey+"的占比是"+minvalue.toFixed(2)+",两者间的比值是"+maxmin.toFixed(2)+"相对公平";
                        }else{
                            that.propText[key]="数据集属性"+key+"中，"+maxkey+"的占比是"+maxvalue.toFixed(2)+"，"+minkey+"的占比是"+minvalue.toFixed(2)+",两者间的比值是"+maxmin.toFixed(2)+"相对不公平"
                        }
                        
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
                    for(let temp1 in res["Favorable Rate Difference"]){
                        labels.push(temp1)
                        for(let attrTemp of that.attrlist){
                            diflist[attrTemp].push(res["Favorable Rate Difference"][temp1][attrTemp].toFixed(2))
                            ratiolist[attrTemp].push(res["Favorable Rate Ratio"][temp1][attrTemp].toFixed(2))
                        }
                    };
                    that.result["diflist"]=diflist;
                    that.result["ratiolist"]=ratiolist;
                    // 画图
                    for(let attrTemp of that.senAttrList){
                        drawbar(attrTemp+"Difference",diflist[attrTemp],labels,"Favorable Rate Difference");
                        drawbar(attrTemp+"Ratio",ratiolist[attrTemp],labels,"Favorable Rate Ratio");
                        that.grouptext[attrTemp]="结果说明待填充"
                    }
                }).catch((err) => {
                        console.log(err)
                });
            }).catch((err) => {
                console.log(err)
            });    
        }

    },
        };
</script>
<!-- <style  scoped> -->
<style scoped>

.paramCon{
    width: 1200px;
    margin-left: 360px;
}
.funcParam{
/* 模型公平性评估 */
box-sizing: border-box;
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
width: 1200px;
height: 824px;
background: #FFFFFF;
border: 1px solid #E0E3EB;
margin: 0px 0px 40px 0px;
box-shadow: 0px 8px 20px rgba(44, 51, 67, 0.06);
border-radius: 8px;
flex: none;
order: 0;
flex-grow: 0;
text-align: left;
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
/* 输入模块div样式 */
.inputdiv{
    margin: 0px 48px;
    height: 700px;
    overflow: auto;
}
/* 结果标题样式 */
/* 结果名称样式 */
.dialog_title h1{
    font-family: PingFangSC-Semibold;
    font-size: 32px;
    color: #333333;
    letter-spacing: 0;
    font-weight: 600;
    margin-bottom: 8px;
    /* width: 160px; */
}
/* 参数展示样式 */
.dialog_title p{
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #79828F;
    letter-spacing: 0;
    line-height: 24px;
    font-weight: 400;
}
/* 图表名称样式 */
.echart_title{
    text-align: center;
}
.main_top_echarts_con_title{
    height: 28px;
    font-family: PingFangSC-Medium;
    font-size: 20px;
    color: #384458;
    letter-spacing: 0;
    font-weight: 500;
    display: inline-block;
}
.left_gradient{
    display: inline-block;
    width: 56px;
    height: 12px;
    opacity: 0.28;
    transform: scaleX(-1);
    background-image: linear-gradient(270deg, #FFFFFF 0%, #3672F5 100%);
    border-radius: 7.5px 0px 0px 7.5px;
    margin-right: 12px;
}
.right_gradient{
    display: inline-block;
    width: 56px;
    height: 12px;
    opacity: 0.28;
    background-image: linear-gradient(270deg, #FFFFFF 0%, #3672F5 100%);
    border-radius: 7.5px 0px 0px 7.5px;
    margin-left: 12px;
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
    height:495px;
    text-align: center;
}
</style>
