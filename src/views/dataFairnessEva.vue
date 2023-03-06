<template>
     <div>
        <a-layout>
            <!-- 顶部菜单栏 -->
        <a-layout-header>
            <!-- 导航栏 -->
            <navmodule/>
        </a-layout-header>
        <a-layout-content>
            <!-- 产品介绍 -->
            <top_product/>
            <!-- 功能介绍 -->
            <func_introduce :funcDesText="funcDesText"></func_introduce>
            <!-- 参数配置 -->
            <div class="paramCon">
                <!-- 参数配置容器 -->
                <h2 class="subTitle">参数配置</h2>
                
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
                        <a-divider />
                    </div>
                    <div class="inputdiv">
                        <!-- 输入主体 -->
                        <p class="paramName">请选择数据集</p>
                        <!-- 折叠面板 -->
                        <template>
                            <!-- 单选组件 选中哪个显示哪个数据集信息 -->
                            <a-radio-group v-model="value" @change="onChangeRadio" v-for="(temp,index) in dataname" :key="index">
                                <div class="radiobackground">
                                <a-radio :style="radioStyle" :value="index">
                                    {{ temp }}
                                </a-radio>
                                </div>
                                <!-- 数据集描述 -->
                                <div class="datades" v-if="value===index">
                                    <br/>
                                    <p class="bgInfo" style="margin-top: -25px; height: auto;"><a :href="datainfo[temp].href">{{ datainfo[temp].name }}</a>：{{ datainfo[temp].text }}</p>
                                    <datatable :tabledata="datainfo[temp].tabledata"></datatable>
                                </div>
                            </a-radio-group>
                        </template>
                        <p class="paramName">请选择敏感属性</p>
                        <div>
                            <dataAttrTranfer :mockData="mockData" :targetKeys="targetKeys" @clientTransfer="clientTransfer"></dataAttrTranfer>
                        </div> 

                    </div>
                </div>
            </div>

        </a-layout-content>
        <a-layout-footer>

        </a-layout-footer>
        </a-layout>
     </div>
</template>
<script>
/* 引入组件，导航栏 */
import navmodule from "../components/nav.vue";
/* 引入组件，产品介绍 */
import top_product from "../components/productIntroduce.vue"
/* 引入组件，功能介绍 */
import func_introduce from "../components/funcIntroduce.vue"
/* 引入组件，数据集表格 */
import datatable from "../components/dataTable.vue"
/* 引入组件，属性选择 */
import dataAttrTranfer from "../components/dataAttrTranfer.vue"
/* 引入图片 */
import funcicon from "../assets/img/dataEvaIcon.png"
import bgimg from "../assets/img/dataEvaBackground.png"

// import { defineComponent,reactive, ref } from 'vue';

export default {
    name:"datafairnesseva",
    components:{
        /* 注册组件 */
        navmodule:navmodule,
        top_product:top_product,
        func_introduce:func_introduce,
        datatable:datatable,
        dataAttrTranfer:dataAttrTranfer,
    },
    data(){
        return{
            /* 单选框默认选中 */
            dataname:["German","Adult","Compas"],
            value: "0",
            /* 单选按钮样式 */
            radioStyle: {
                display: 'block',
                height: '30px',
                lineHeight: '30px',
            },
             /* 每个数据集可选属性列表 */
            dataAttrlist:{
            German:[{title:"Age",description:"借款人的年龄",chosen:true},
            {title:"Sex",description:"借款人的性别",chosen:true},
            {title:"Credit history",description:"借款人的性别",chosen:false},
            {title:"Status of existing checking account",description:"借款人的过去信用记录",chosen:false}],
            Adult:[
            {title:"Age",description:"以年为单位的年龄",chosen:true},
            {title:"Sex",description:"个人的性别",chosen:true},
            {title:"Workclass",description:"个人的工作类型，如私人/政府 ",chosen:false},
            {title:"Education",description:"个人的工作类型，如私人/政府 ",chosen:false},
            {title:"Education-num",description:"Education-num",chosen:false}],
            Compas:[
            {title:"Age",description:"被拘留人的年龄",chosen:true},
            {title:"Sex",description:"被拘留人的性别",chosen:true},
            {title:"Race",description:"被拘留人的种族",chosen:false},
            {title:"Score",description:"模型预测的被拘留人再次犯罪的风险得分",chosen:false},
            {title:"criminal-type",description:"被拘留人的犯罪类型",chosen:false}],
            },
            mockData:[],
            targetKeys:[],

            /* 数据集信息 */
            datainfo:{
                German:{
                    name:"German数据集",
                    text:"是一个用于信用评估的数据集。该数据集包含各种个人信息，包括性别、年龄、工作类型、信用记录等等。这些信息被用于预测个人的信用违约概率，以便银行等金融机构能够做出更好的贷款决策。",
                    href:"https://archive.ics.uci.edu/ml/datasets/statlog+(german+credit+data)",
                    tabledata:[
                        {name:"数据集特征",value:"多元统计"},
                        {name:"示例个数",value:"1,000"},
                        {name:"所属领域",value:"财经"},
                        {name:"属性类型",value:"连续型，离散型"},
                        {name:"属性数量",value:"20"},
                        {name:"创建日期",value:"1994-11-17"},
                        {name:"相关任务",value:"分类"},
                        {name:"是否缺失",value:"否"}
                    ],
                    attrlist:[]
                },
                Adult:{
                    name:"Adult数据集",
                    text:"Adult数据集是一个用于预测个人收入是否超过50000美元的数据集。该数据集包含各种个人信息，包括年龄、教育程度、职业、婚姻状况等等。",
                    href:"https://archive.ics.uci.edu/ml/datasets/adult",
                    tabledata:[
                        {name:"数据集特征",value:"多元统计"},
                        {name:"示例个数",value:"48842"},
                        {name:"所属领域",value:"财经/社会"},
                        {name:"属性类型",value:"连续型，离散型"},
                        {name:"属性数量",value:"14"},
                        {name:"创建日期",value:"1996-05-01"},
                        {name:"相关任务",value:"分类"},
                        {name:"是否缺失",value:"是"}
                    ],
                },
                Compas:{
                    name:"Compas数据集",
                    text:"是一个用于犯罪风险评估的数据集。该数据集包含各种犯罪嫌疑人的个人信息，包括性别、年龄、种族、前科记录等等。这些信息被用于预测嫌疑人的未来犯罪行为的概率，以便法院能够在决定是否对其进行拘留或释放时做出更好的判断。",
                    href:"https://www.propublica.org/datastore/dataset/compas-recidivism-risk-score-data-and-analysis",
                    tabledata:[
                        {name:"数据集特征",value:"多元统计"},
                        {name:"示例个数",value:"6172"},
                        {name:"所属领域",value:"社会"},
                        {name:"属性特征",value:"连续型，离散型"},
                        {name:"属性数量",value:"12"},
                        {name:"创建日期",value:"2016-5-23"},
                        {name:"相关任务",value:"分类"},
                        {name:"是否缺失",value:"否"}
                    ],
                }
            },
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
            }
        }
    },
    methods: {
        onChangeRadio(e) {
            const targetKeys = [];
            const mockData = [];
            const dataAttrlist = this.dataAttrlist[this.dataname[this.value]]
            for (let index in dataAttrlist) {
                const data = {
                    key: index,
                    title: dataAttrlist[index].title,
                    description: dataAttrlist[index].description,
                    chosen: dataAttrlist[index].chosen,
                };
                if (data.chosen) {
                    targetKeys.push(data.key);
                }
                mockData.push(data);
            }
            this.mockData = mockData;
            this.targetKeys = targetKeys;
        },
        clientTransfer(targetKeys){
            this.targetKeys=targetKeys;
        },
        dataEvaClick(){
            const attrlist=[];
            for( let i in this.targetKeys){
                attrlist.push(this.dataAttrlist[this.dataname[this.value]][this.targetKeys[i]].title)
            };
            
            var that=this;
            var tid = "";
            /* 调用创建主任务接口 */
            this.$axios.post("http://127.0.0.1:24109/Task/CreateTask",{AttackAndDefenseTask:0}).then((result) => {
                console.log(result);
                tid = result.data.Taskid;
                const postdata={
                dataname:that.dataname[that.value],
                attrlist:attrlist,
                tid:tid};
                console.log(postdata)
                that.$axios.post("http://127.0.0.1:24109/DataFairnessEvaluate",postdata).then((result) => {
                    console.log(result)
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
    width: 1420px;
    margin: 79.78px auto auto auto;
    margin-left: 250px;
}
.funcParam{
box-shadow: 13px 13px 51px 0px rgba(111,118,138,0.2);
width: 1420px;
height: 720px;
border-radius: 8px; 
margin: 60px 0;
background-color: #FFFFFF;
text-align: left;
}
.paramTitle{
    height:101px;
    padding: 32px 0 0 0;
    margin-left: 35.3px;
    margin-right: 31px;
    text-align: left;
}
.paramIcom{
    display: inline;
    width: 42px;
    height: 32px;
    margin: auto 16px 0px auto;
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
    width: 143px;
    height: 50px;
    border-radius: 4px;
    background-color: #FFFFFF;
    display: inline;
    float: right;
    font-size: 24px;
    padding: 7px 32px;
    font-family: PingFangSC-Semibold;   
}
/* 输入模块div样式 */
.inputdiv{
    margin: 5px 31px;
    height: 540px;
    overflow: auto;
}

/* 单选背景样式 */
.radiobackground{
    background-color: #F1F3F7;
    border-radius: 4px;
    height: 63px;
    padding: 17px 0px;
    margin: 0 0 15px 0;
}
/* 输入名样式 */
.paramName{
    height: 40px;
    font-family: PingFangSC-Regular;
    font-size: 20px;
    color: #79828F;
    letter-spacing: 0;
    line-height: 40px;
    font-weight: 400;
    margin: 17px 0px;
}

.ant-radio-group{
    width: 100%;
}
.ant-radio-wrapper{
    margin: 0px 33px;
    font-size: 20px;
    font-family: PingFangSC-Regular;
    color: #555B66;
    font-weight: 400;
}
.ant-radio-inner{

    top: -5px;
}
/* 数据集描述 */
.datades{
    margin: 0 73px;
}
</style>
