<template>
     <div>
        <a-layout>
            <!-- 顶部菜单栏 -->
            <a-layout-header>
                <!-- 导航栏 -->
                <navmodule />
            </a-layout-header>
            <a-layout-content>
                <!-- 功能介绍 -->
                <func_introduce :funcDesText="funcDesText"></func_introduce>
                <!-- 参数配置 -->
                <div class="paramCon">
                    <!-- 参数配置容器 -->
                    <h2 class="subTitle" style="margin-top: -96px;">参数配置</h2>

                    <div class="funcParam">
                        <div class="paramTitle">
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
                            <div class="mainParamNameNotop">请选择数据集</div>
                            <DataSetCard style="width: 1104px; margin-bottom: 16px;" v-for="(info, index) in dataSetInfo"
                                :key="'Dataset' + index" v-bind="info" :indexInParent="index" @selectDataset="changeDataset"
                                :checked="index == selectedDataset">
                            </DataSetCard>
                            <div class="mainParamName48">请选择模型</div>
                            <ModelCard style="width: 1104px; margin-bottom: 16px;" v-for="(info, index) in modelInfo" :key="'Model' + index"
                                v-bind="info" :indexInParent="index" @selectModel="changeModel"
                                :checked="index == selectedModel">
                            </ModelCard>
                            <div class="mainParamName48">请选择攻击方法（可多选）</div>
                            <MethodCard style="width: 1104px; " v-for="(info, index) in methodInfo" :key="'Method' + index"
                                v-bind="info" :indexInParent="index" :attack_type="'advAttack'" :dataset="selectedDataset" @updateAttributes="updataMethodAttributes" 
                                @selectMethod="updateMethod" :checked="selectedMethod.indexOf(methodInfo[index].id) > -1">
                            </MethodCard>
                            <div class="mainParamName48">请选择群智化防御方法（可多选）</div>
                            <DefenseCard style="width: 1104px; " v-for="(info, index) in DefenseInfo"
                                :key="'Defense' + index" v-bind="info" :indexInParent="index" @selectedDefense="updateDefense"
                                :checked="selectedDefense.indexOf(DefenseInfo[index].id) > -1"> 
                            </DefenseCard>
                            <CrowdDefenseEval :is-show="resultVisible" :result="result" :postData="postData" @on-close="() => { resultVisible = !resultVisible }">
                            </CrowdDefenseEval>
                            
                        </div>
                    </div>
                </div>
                <!-- 日志展示 -->
                <div v-if="logflag">
                    <showLog :percent="percent" :logtext="logtext"></showLog>
                </div>
            </a-layout-content>
            <a-layout-footer class="layoutFooter">

            </a-layout-footer>
        </a-layout>
     </div>
</template>
<script>
/* 引入组件，导航栏 */
import navmodule from "../components/nav.vue";
/* 引入组件，功能介绍 */
import func_introduce from "../components/funcIntroduce.vue"
/* 引入组件，日志显示 */
import showLog from "../components/showLog.vue"
/* 引入组件，结果显示 */
import resultDialog from "../components/resultDialog.vue"

import funcicon from "../assets/img/crowdDefenseIcon.png"
import bgimg from "../assets/img/modelEvaBackground.png"

import DataSetCard from "../components/card/DataSetCard.vue"
import ModelCard from "../components/card/ModelCard.vue"
import MethodCard from "../components/card/MethodCard.vue"
import DefenseCard from "../components/card/DefenseCard.vue"
import CrowdDefenseEval from "./dialog/CrowdDefenseEval.vue"

const selectSvg = {
        template:`
        <svg t="1680138013828" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4354" width="128" height="128"><path d="M534.869333 490.496a1403.306667 1403.306667 0 0 0 50.858667-25.813333c16.042667-8.618667 29.013333-15.061333 38.570667-19.029334 9.557333-3.925333 17.066667-6.058667 22.869333-6.058666 9.557333 0 17.749333 3.2 24.917333 10.026666 6.826667 6.826667 10.581333 15.061333 10.581334 25.088 0 5.76-1.706667 11.818667-5.12 17.92-3.413333 6.101333-7.168 10.069333-10.922667 11.861334-35.157333 14.677333-74.410667 25.429333-116.736 31.872 7.850667 7.168 17.066667 17.237333 28.330667 29.781333 11.264 12.544 17.066667 18.986667 17.749333 20.053333 4.096 6.101333 9.898667 13.653333 17.408 22.613334 7.509333 8.96 12.629333 15.786667 15.36 20.778666 2.730667 5.034667 4.437333 11.093333 4.437333 18.304a33.706667 33.706667 0 0 1-9.898666 24.021334 33.834667 33.834667 0 0 1-25.6 10.410666c-10.24 0-22.186667-8.618667-35.157334-25.472-12.970667-16.512-30.037333-46.933333-50.517333-91.050666-20.821333 39.424-34.816 65.962667-41.642667 78.506666-7.168 12.544-13.994667 22.186667-20.48 28.672a30.976 30.976 0 0 1-22.528 9.685334 32.256 32.256 0 0 1-25.258666-11.093334 35.413333 35.413333 0 0 1-9.898667-23.68c0-7.893333 1.365333-13.653333 4.096-17.578666 25.258667-35.84 51.541333-67.413333 78.848-93.568a756.650667 756.650667 0 0 1-61.44-12.544 383.061333 383.061333 0 0 1-57.685333-20.48c-3.413333-1.749333-6.485333-5.717333-9.557334-11.818667a30.208 30.208 0 0 1-5.12-16.853333 32.426667 32.426667 0 0 1 10.581334-25.088 33.152 33.152 0 0 1 24.234666-10.026667c6.485333 0 14.677333 2.133333 24.576 6.101333 9.898667 4.266667 22.186667 10.026667 37.546667 18.261334 15.36 7.893333 32.426667 16.853333 51.882667 26.538666-3.413333-18.261333-6.485333-39.082667-8.874667-62.378666-2.389333-23.296-3.413333-39.424-3.413333-48.042667 0-10.752 3.072-19.712 9.557333-27.264A30.677333 30.677333 0 0 1 512.341333 341.333333c9.898667 0 18.090667 3.925333 24.576 11.477334 6.485333 7.893333 9.557333 17.92 9.557334 30.464 0 3.584-0.682667 10.410667-1.365334 20.48-0.682667 10.368-2.389333 22.570667-4.096 36.906666-2.048 14.677333-4.096 31.146667-6.144 49.834667z" fill="#FF3838" p-id="4355"></path></svg>
        `,
    };
    const selectIcon = {
        template: `
            <a-icon :component="selectSvg" />
        `,
        data() {
            return {
                selectSvg,
            };
        },
    }
export default {
    name:"advAttack",
    components:{
        /* 注册组件 */
        navmodule:navmodule,
        func_introduce:func_introduce,
        showLog:showLog,
        resultDialog:resultDialog,
        selectIcon,
        DataSetCard,
        ModelCard,
        MethodCard,
        DefenseCard,
        CrowdDefenseEval,
    },
    data(){
        return{
            
            /* 单选按钮样式 */
            radioStyle: {
                display: 'block',
                lineHeight: '30px',
            },
            /* 评估按钮样式和状态 */
            buttonBGColor:{
                background:"#0B55F4",
                color:"#FFFFFF"
            },
            // 按钮是否置灰
            disStatus:false,
            /* 日志框是否显示，false不显示，true显示，默认不显示 */
            logflag:false,
            /* 进度 */
            percent:10,
            /* 日志内容，调用日志接口获取 */
            logtext:[],
            /* 功能介绍模块信息 */
            funcDesText:{
                /* 功能名称 */
                name: "群智化防御",
                /* 功能icon，需先引入 */
                imgpath:funcicon,
                /* 功能背景图片，需先引入 */
                bgimg:bgimg,
                /* 功能介绍下的总介绍 */
                destext:"实现基于群体智能的模型全生命周期动态防御",
                /* 背景介绍 */
                backinfo:"针对AI模型保护机制设计孤立、覆盖环节有限、防御策略固定等特点，突破防御智能体功能设计、智能体结构设计、智能体博弈机制、群体智能防御算法等关键技术，实现基于群体智能的模型全生命周期动态防御。",
                /* 亮点介绍 */
                highlight:[
                    "具备自动攻击检测、脆弱感知、异常过滤、算法加固的能力；",
                    "内置支持协同与博弈方法≥5种，包括Nash博弈、集成防御、xxxx、xxxxx、xxxxx，实现PACA自动攻击检测；",
                    "可防御的攻击算法包含FGSM等超过20种对抗攻击算法，防御成功率超过90%。"
                ]
            },
            /* 评估结果 */
            result:{},
            /* 主任务id */ 
            tid:"",
            /* 子任务id */ 
            stidlist:{},
            /* 异步任务结果查循环clock */
            clk:"",
            /* 日志查询clock*/
            logclk: "",
            // 数据集信息
            dataSetInfo: [
            {
                name: "CIFAR10",
                class:['airplane','automobile','bird','cat','deer','dog','frog','horse','ship','truck'],
                description: "是由 Hinton 的学生 Alex Krizhevsky 和 Ilya Sutskever 整理的一个用于识别普适物体的小型数据集。一共包含 10 个类别的 RGB 彩色图 片：飞机（ airplane ）、汽车（ automobile ）、鸟类（ bird ）、猫（ cat ）、鹿（ deer ）、狗（ dog ）、蛙类（ frog ）、马（ horse ）、船（ ship ）和卡车（ truck ）。图片的尺寸为 32×32 ，数据集中一共有 50000 张训练圄片和 10000 张测试图片。",
                pictureSrcs: [
                    [require('../assets/img/cifar100.jpg'), 
                    require('../assets/img/cifar101.jpg'),
                    require('../assets/img/cifar102.jpg'), 
                    require('../assets/img/cifar103.jpg'), 
                    require('../assets/img/cifar104.jpg'), 
                    require('../assets/img/cifar105.jpg'), 
                    require('../assets/img/cifar106.jpg'),
                    require('../assets/img/cifar107.jpg'),
                    require('../assets/img/cifar108.jpg'),
                    require('../assets/img/cifar109.jpg')],
                    ],
                },
                {
                    name: "MNIST",
                    description: "是一个手写体数字的图片数据集，该数据集来由美国国家标准与技术研究所（National Institute of Standards and Technology (NIST)）发起整理，一共统计了来自250个不同的人手写数字图片，其中50%是高中生，50%来自人口普查局的工作人员。该数据集的收集目的是希望通过算法，实现对手写数字的识别。",
                    class:['数字0','数字1','数字2','数字3','数字4','数字5','数字6','数字7','数字8','数字9'],
                    pictureSrcs: [
                        [require("../assets/img/mnist0.jpg"),
                        require('../assets/img/mnist1.jpg'),
                        require('../assets/img/mnist2.jpg'), 
                        require('../assets/img/mnist3.jpg'), 
                        require('../assets/img/mnist4.jpg'), 
                        require('../assets/img/mnist5.jpg'), 
                        require('../assets/img/mnist6.jpg'),
                        require('../assets/img/mnist7.jpg'),
                        require('../assets/img/mnist8.jpg'),
                        require('../assets/img/mnist9.jpg'),],
                    ],
                },
                
            ],
            selectedDataset: 0,
            modelInfo: [
                {
                    name: "ResNet18",
                    layer:18
                },
                {
                    name: "ResNet34",
                    layer:34
                },
                {
                    name: "ResNet50",
                    layer:50
                },
                // {
                //     name: "ResNet101",
                //     layer:101
                // },
                // {
                //     name: "ResNet152",
                //     layer:152
                // },
            ],
            selectedModel: 0,
            methodInfo: [
                {
                    name: "FGSM",
                    id:"FGSM",
                    description: "Fast Gradient Sign MethodFGSM快速梯度符号法是一种简单而有效的生成对抗样本的方法，其工作方式如下：在给定输入数据后，利用已训练的模型输出预测并计算损失函数的梯度，然后使用梯度的符号来创建使损失最大化的新数据",
                    attributes: [
                        [
                        { name: "扰动系数", key:"eps", defaultNumber: 0.031, number: 0.0, type: "inputNumber" , min: 0, step:0.001},
                            { name: "范数", key:"norm", defaultNumber: 0, number: 0, type: "selectgroup" ,valuelist:["1","2","inf"]},
                        
                        ],
                    ]
                },
                {
                    name: "BIM",
                    id:"BIM",
                    description: "Basic Iterative MethodBIM迭代式FGSM是对FGSM的改进方法，主要的改进有两点，其一是FGSM方法是一步完成的，而BIM方法通过多次迭代来寻找对抗样本；其次，为了避免迭代过程中出现超出有效值的情况出现，使用了一个修建方法严格限制像素值的范围",
                    attributes: [
                        [
                        { name: "扰动系数", key:"eps", defaultNumber: 0.031, number: 0, type: "inputNumber" , min: 0, step:0.001},
                        { name: "步长参数", key:"eps_step", defaultNumber: 0.01, number: 0, type: "inputNumber" , min: 0, step:1},
                        {name: "最大迭代次数", key:"max_iter", defaultNumber: 20, number: 0, type: "inputNumber" , min: 1, step:1},
                        { name: "范数", key:"norm", defaultNumber: 2, number: 2, type: "selectgroup" ,valuelist:[1,2,"inf"]},
                    ],
                    ]
                },
                {
                    name: "PGDL1",
                    id:"PGDL1",
                    description: "Projected Gradient DescentPGD投影梯度下降法是FGSM的迭代版本，该方法思路和BIM基本相同，不同之处在于该方法在迭代过程中使用范数投影的方法来约束非法数据，并且相对于BIM有一个随机的开始噪声。支持L1 norm范数",
                    attributes: [
                        [
                        { name: "扰动系数", key:"eps", defaultNumber: 0.3, number: 0.0, type: "inputNumber" , min: 0,step:0.1},
                        { name: "步长参数", key:"eps_step", defaultNumber: 0.1, number: 0.0, type: "inputNumber" , min: 0, step:0.1},
                        {name: "最大迭代次数", key:"max_iter", defaultNumber: 20, number: 0, type: "inputNumber" , min: 1,  step:1},
                        { name: "随机开始次数", key:"num_random_init", defaultNumber: 1, number: 0, type: "inputNumber" ,min: 0,  step:1},
                    ],
                    ]
                },
                {
                    name: "PGDL2",
                    id:"PGDL2",
                    description: "Projected Gradient DescentPGD投影梯度下降法是FGSM的迭代版本，该方法思路和BIM基本相同，不同之处在于该方法在迭代过程中使用范数投影的方法来约束非法数据，并且相对于BIM有一个随机的开始噪声。支持L2 norm范数",
                    attributes: [
                        [
                        { name: "扰动系数", key:"eps", defaultNumber: 0.3, number: 0.0, type: "inputNumber" , min: 0,step:0.1},
                        { name: "步长参数", key:"eps_step", defaultNumber: 0.1, number: 0.0, type: "inputNumber" , min: 0, step:0.1},
                        {name: "最大迭代次数", key:"max_iter", defaultNumber: 20, number: 0, type: "inputNumber" , min: 1,  step:1},
                        { name: "随机开始次数", key:"num_random_init", defaultNumber: 1, number: 0, type: "inputNumber" ,min: 0,  step:1},
                    ],
                    ]
                },
                {
                    name: "PGDLinf",
                    id:"PGDLinf",
                    description: "Projected Gradient DescentPGD投影梯度下降法是FGSM的迭代版本，该方法思路和BIM基本相同，不同之处在于该方法在迭代过程中使用范数投影的方法来约束非法数据，并且相对于BIM有一个随机的开始噪声。支持Linf norm范数",
                    attributes: [
                        [
                        { name: "扰动系数", key:"eps", defaultNumber: 0.3, number: 0.0, type: "inputNumber" , min: 0,step:0.1},
                        { name: "步长参数", key:"eps_step", defaultNumber: 0.1, number: 0.0, type: "inputNumber" , min: 0, step:0.1},
                        {name: "最大迭代次数", key:"max_iter", defaultNumber: 20, number: 0, type: "inputNumber" , min: 1,  step:1},
                        { name: "随机开始次数", key:"num_random_init", defaultNumber: 1, number: 0, type: "inputNumber" ,min: 0,  step:1},   
                    ],
                    ]
                },
                {
                    name: "C&W",
                    id:"C&W",
                    description: "该方法的出发点是攻击比较有名的对抗样本防御方法-防御蒸馏(就防御蒸馏方法而言，它在基本的L-BFGS，FGSM攻击方法上表现本身就比较差)。对于寻找对抗样本过程中目标函数的设置将会极大的影响对抗样本的攻击效果，为此，通过目标函数的设定，在零范数，二范数和无穷范数的限制下分别设计了三种不同的寻找对抗样本的目标函数，这三种方法均可以绕过防御蒸馏的防御",
                    attributes: [
                        [{ name: "最大迭代次数", key:"max_iterations", defaultNumber: 1000, number: 0, type: "inputNumber" , min: 1, step:1},
                        { name: "优化器学习率", key:"lr", defaultNumber: 0.01, number: 0, type: "inputNumber" , min: 0, step:0.01},
                        ],
                    ]
                },
                {
                    name: "DeepFool",
                    id:"DeepFool",
                    description: "DeepFool方法的出发点是想要精确的度量模型对于对抗样本的鲁棒性，为此提出了鲁棒性定义和计算方法。最终使用该计算方法生成对抗样本",
                    attributes: [
                        [ {name: "最大迭代次数", key:"max_iter", defaultNumber: 50, number: 0, type: "inputNumber" , min: 1, step:1},
                        { name: "扰动系数", key:"eta", defaultNumber: 0.02, number: 0.0, type: "inputNumber" , min: 0, step:0.01},
                        ],
                    ]
                },
                {
                    name: "JSMA",
                    id:"JacobianSaliencyMap",
                    description: "该方法通过输入样本每一个位置的前向导数，借鉴模型解释性方法中的显著图理论，构造了一种对抗显著图。对抗显著图上的点的值就是样本中每一个点对每个目标类的前向导数大小，直觉上来讲，其反映的是该样本点对生成某一个目标类对抗样本的贡献度。那么使用该对抗显著图，确定需要攻击到的目标类后，便可以从该图中选择对目标类对抗影响最大的点进行修改即可。",
                    attributes: [
                        [{name: "噪声大小", key:"theta", defaultNumber: 0.1, number: 0.0, type: "inputNumber" , step:0.1},
                        { name: "允许修改的最大特征百分比", key:"gamma", defaultNumber: 1.0, number: 0.0, type: "inputNumber" , min: 0, max: 1, step:0.1},
                        ],
                    ]
                },
                {
                    name: "Brendel&BethgeAttack",
                    id:"Brendel&BethgeAttack",
                    description: "边界攻击的基本思想是从一个已经是对抗样本的点(无目标攻击随意选择，有目标攻击选择目标类图片)开始，通过随机游走算法来减少对抗样本的强度，使其在决策边界上和被攻击的样本接近",
                    attributes: [
                        [{ name: "正交步骤的初始步长", key:"delta", defaultNumber: 0.01, number: 0.0, type: "inputNumber" , min: 0, step:0.01},
                        { name: "趋近步骤的初始步长大小", key:"eps", defaultNumber: 0.01, number: 0.0, type: "inputNumber" , min: 0, step:0.01},
                        {name: "调整步长因数", key:"step_adapt", defaultNumber: 0.667, number: 0.0, type: "inputNumber" , min: 0, max: 1, step:0.001},
                        { name: "最大迭代次数", key:"max_iter", defaultNumber: 1000, number: 0, type: "inputNumber" ,min: 1, step:1},   
                        ],[
                        { name: "每次迭代的最大判定数", key:"num_trial", defaultNumber: 25, number: 0, type: "inputNumber" , min: 1,step:1},
                        { name: "每次判定的样本数目", key:"sample_size", defaultNumber: 20, number: 0, type: "inputNumber" , min: 1, step:1},
                        {name: "初始化的判定次数", key:"init_size", defaultNumber: 100, number: 0, type: "inputNumber" , min: 1, step:1},
                        ]
                    ]
                },
                {
                    name: "UniversalPerturbationL1",
                    id:"UniversalPerturbationL1",
                    description: "在一个给定模型和数据集上，通过迭代算法寻找一个让大多数图片都被错误分类的对抗噪声。支持L1 norm范数",
                    attributes: [
                        [{ name: "攻击方法", key:"attacker", defaultNumber: 0, number: 0, type: "selectgroup" ,valuelist:["FGSM","BIM","PGD", "DeepFool", "JSMA", "Carlini_l2","Carlini_inf","Simba"]},],
                        [
                        { name: "扰动系数", key:"eps", defaultNumber: 0.078, number: 0.0, type: "inputNumber" , min: 0, step:0.001},
                        {name: "最大迭代次数", key:"max_iter", defaultNumber: 20, number: 0, type: "inputNumber" ,min: 0, step:1},],
                    ]
                },
                {
                    name: "UniversalPerturbationL2",
                    id:"UniversalPerturbationL2",
                    description: "在一个给定模型和数据集上，通过迭代算法寻找一个让大多数图片都被错误分类的对抗噪声。支持L2 norm范数",
                    attributes: [
                        [{ name: "攻击方法", key:"attacker", defaultNumber: 0, number: 0, type: "selectgroup" ,valuelist:["FGSM","BIM","PGD", "DeepFool", "JSMA", "Carlini_l2","Carlini_inf","Simba"]},],[
                        { name: "扰动系数", key:"eps", defaultNumber: 0.078, number: 0.0, type: "inputNumber" , min: 0, step:0.001},
                        {name: "最大迭代次数", key:"max_iter", defaultNumber: 20, number: 0, type: "inputNumber" ,min: 0, step:1},
                        ],
                    ]
                },
                {
                    name: "UniversalPerturbationLinf",
                    id:"UniversalPerturbationLinf",
                    description: "在一个给定模型和数据集上，通过迭代算法寻找一个让大多数图片都被错误分类的对抗噪声。支持Linf norm范数",
                    attributes: [
                        [{ name: "攻击方法", key:"attacker", defaultNumber: 0, number: 0, type: "selectgroup" ,valuelist:["FGSM","BIM","PGD", "DeepFool", "JSMA", "Carlini_l2","Carlini_inf","Simba"]},],[
                        { name: "扰动系数", key:"eps", defaultNumber: 0.078, number: 0.0, type: "inputNumber" , min: 0, step:0.001},
                        {name: "最大迭代次数", key:"max_iter", defaultNumber: 20, number: 0, type: "inputNumber" ,min: 0, step:1},
                        ],
                    ]
                },
                {
                    name: "AutoAttackL1",
                    id:"AutoAttackL1",
                    description: "该方法首先改进了PGD方法的步长调整方法以及其的损失函数，并且进一步将白盒的FAB攻击和黑盒的Square攻击集成到了框架中。支持L1 norm范数",
                    attributes: [
                        [
                        { name: "扰动系数", key:"eps", defaultNumber: 0.031, number: 0.0, type: "inputNumber" , min: 0, step:0.001},
                        { name: "步长参数", key:"eps_step", defaultNumber: 0.01, number: 0.0, type: "inputNumber" , min: 0, step:0.01},
                        ],
                    ]
                },
                {
                    name: "AutoAttackL2",
                    id:"AutoAttackL2",
                    description: "该方法首先改进了PGD方法的步长调整方法以及其的损失函数，并且进一步将白盒的FAB攻击和黑盒的Square攻击集成到了框架中。支持L2 norm范数",
                    attributes: [
                        [
                        { name: "扰动系数", key:"eps", defaultNumber: 0.031, number: 0.0, type: "inputNumber" , min: 0, step:0.001},
                        { name: "步长参数", key:"eps_step", defaultNumber: 0.01, number: 0.0, type: "inputNumber" , min: 0, step:0.01},
                        ],
                    ]
                },
                {
                    name: "AutoAttackLinf",
                    id:"AutoAttackLinf",
                    description: "该方法首先改进了PGD方法的步长调整方法以及其的损失函数，并且进一步将白盒的FAB攻击和黑盒的Square攻击集成到了框架中。支持Linf norm范数",
                    attributes: [
                        [
                        { name: "扰动系数", key:"eps", defaultNumber: 0.031, number: 0.0, type: "inputNumber" , min: 0, step:0.001},
                        { name: "步长参数", key:"eps_step", defaultNumber: 0.01, number: 0.0, type: "inputNumber" , min: 0, step:0.01},
                        ],
                    ]
                },
                {
                    name: "GD-UAP",
                    id:"GD-UAP",
                    description: "该方法在UAP工作的基础上提出了数据不相关的通用对抗噪声。与UAP生成的基本方法不同，该方法以对一个神经网络所有神经元产生更大的输出为目标，即以寻求那些可以使网络整体神经元更加激活的输入噪声为目标，并且将该噪声作为通用对抗噪声",
                    attributes: [
                        [
                        { name: "最小饱和度", key:"sat_min", defaultNumber: 0.35, number: 0, type: "inputNumber" , min: 0, max: 1, step:0.01},
                        { name: "饱和度阈值", key:"sat_threshold", defaultNumber: 0.00001, number: 0, type: "inputNumber" , min: 0, max: 1, step:0.00001},
                        { name: "扰动系数", key:"eps", defaultNumber: 0.078, number: 0.0, type: "inputNumber" , min: 0, step:0.001},],
                        [
                        {name: "最大迭代次数", key:"max_iter", defaultNumber: 10000, number: 0, type: "inputNumber" ,min: 1,step:1},
                        {name: "耐心间隔", key:"patience_interval", defaultNumber: 10, number: 0, type: "inputNumber" ,min: 0, step:1},
                        ],
                    ]
                },
                {
                    name: "SquareAttackL1",
                    id:"SquareAttackL1",
                    description: "该方法的主体思路是使用优化理论中的随机搜索方法来寻找对抗噪声，这种随机搜索的方法很多黑盒攻击方法都采用过。随机搜索的总体框架大体相同，如下图所示。基本思路是在在一个采用空间中随机选择一个噪声，如果该噪声能够降低目标函数的损失则将其添加到原图片上，否则进入下一轮的随机搜索。支持L1 norm范数。",
                    attributes: [
                        [
                        { name: "初始化百分比", key:"p_init", defaultNumber: 0.05, number: 0.0, type: "inputNumber" , min: 0, step:0.01},
                        { name: "重启次数", key:"n_restarts", defaultNumber: 1, number: 0, type: "inputNumber" , min: 1, step:1},
                        { name: "loss类型", key:"loss_type", defaultNumber: 0, number: 0, type: "selectgroup" ,valuelist:["margin","ce"]},    
                    ],
                    ]
                },{
                    name: "SquareAttackL2",
                    id:"SquareAttackL2",
                    description: "该方法的主体思路是使用优化理论中的随机搜索方法来寻找对抗噪声，这种随机搜索的方法很多黑盒攻击方法都采用过。随机搜索的总体框架大体相同，如下图所示。基本思路是在在一个采用空间中随机选择一个噪声，如果该噪声能够降低目标函数的损失则将其添加到原图片上，否则进入下一轮的随机搜索。支持L2 norm范数。",
                    attributes: [
                        [
                        { name: "初始化百分比", key:"p_init", defaultNumber: 0.05, number: 0.0, type: "inputNumber" , min: 0, step:0.01},
                        { name: "重启次数", key:"n_restarts", defaultNumber: 1, number: 0, type: "inputNumber" , min: 1, step:1},
                        { name: "loss类型", key:"loss_type", defaultNumber: 0, number: 0, type: "selectgroup" ,valuelist:["margin","ce"]},
                    ],
                    ]
                },{
                    name: "SquareAttackLinf",
                    id:"SquareAttackLinf",
                    description: "该方法的主体思路是使用优化理论中的随机搜索方法来寻找对抗噪声，这种随机搜索的方法很多黑盒攻击方法都采用过。随机搜索的总体框架大体相同，如下图所示。基本思路是在在一个采用空间中随机选择一个噪声，如果该噪声能够降低目标函数的损失则将其添加到原图片上，否则进入下一轮的随机搜索。支持Linf norm范数。",
                    attributes: [
                        [
                        { name: "初始化百分比", key:"p_init", defaultNumber: 0.05, number: 0.0, type: "inputNumber" , min: 0, step:0.01},
                        { name: "重启次数", key:"n_restarts", defaultNumber: 1, number: 0, type: "inputNumber" , min: 1, step:1},
                        { name: "loss类型", key:"loss_type", defaultNumber: 0, number: 0, type: "selectgroup" ,valuelist:["margin","ce"]},
                    ],
                    ]
                },
                {
                    name: "HSJA",
                    id:"HSJA",
                    description: "在优化框架下的基于决策的攻击，并提出了一系列新颖的算法，用于生成针对性和非针对性的对抗性示例，这些示例针对“ 2-距离”或“∞距离”的最小距离进行了优化。 该算法本质上是迭代的，每个迭代涉及三个步骤：梯度方向的估计，通过几何级数进行的步长搜索和通过二分法的边界搜索。对优化框架和梯度方向估计进行了理论分析。这不仅为选择超参数提供了参考，而且还激发了所提出算法中的必要步骤",
                    attributes: [
                        [
                        { name: "梯度估计的最大次数", key:"max_eval", defaultNumber: 1000, number: 0, type: "inputNumber" , min:1, step:1},
                        {name: "最大迭代次数", key:"max_iter", defaultNumber: 50, number: 0, type: "inputNumber" ,min: 1,  step:1},
                        { name: "范数", key:"norm", defaultNumber: 0, number: 0, type: "selectgroup" ,valuelist:[2,"inf"]},    
                    ],[
                        { name: "梯度估计的初始次数", key:"init_eval", defaultNumber: 100, number: 0, type: "inputNumber" , min:1, step:1},
                        {name: "初始最大试验次数", key:"init_size", defaultNumber: 100, number: 0.0, type: "inputNumber" ,min: 1,  step:1},
                        ],
                    ]
                },
                {
                    name: "PixelAttack",
                    id:"PixelAttack",
                    description: "使用差分进化算法寻找满足零范数约束的对抗样本",
                    attributes: [
                        [
                        { name: "允许修改的像素数目", key:"th", defaultNumber: 1, number: 0, type: "inputNumber" , min: 1, max: 784, step:1},
                        {name: "最大迭代次数", key:"max_iter", defaultNumber: 5, number: 0, type: "inputNumber" ,min: 1, step:1},
                        { name: "进化算法", key:"es", defaultNumber: 0, number: 0, type: "selectgroup" ,valuelist:["DE","CMAES"]},],
                    ]
                },
                {
                    name: "SimBA",
                    id:"SimBA",
                    description: "该方法的基本思想为对于图片空间的任意一个方向，添加或者减少一个扰动值，总是有可能让神经网络对于该图片属于某个类别的分数变得更低或者更高，因此论文通过随机选择一些坐标点，通过添加或者减少扰动值，使图片分类到某个类别的分数总是往更低的方向去，从而最终导致图片分类错误。这可以看作是一种贪婪的选择策略，每一步都选择对于自己最优的方向，以此来接近全局最优",
                    attributes: [
                        [
                        { name: "过冲参数", key:"epsilon", defaultNumber: 0.031, number: 0.0, type: "inputNumber" , min: 0, step:0.001},
                        {name: "最大迭代次数", key:"max_iter", defaultNumber: 3000, number: 0, type: "inputNumber" ,min: 0, step:1},    
                        { name: "攻击方法", key:"attack", defaultNumber: 0, number: 0, type: "selectgroup" ,valuelist:["dct","px"]},
                        { name: "pixel攻击的顺序", key:"order", defaultNumber: 0, number: 0, type: "selectgroup" ,valuelist:["random","diag"]},
                        
                        ],
                    ]
                },
                {
                    name: "ZOO",
                    id:"ZOO",
                    description: "在一个给定模型和数据集上，通过迭代算法寻找一个让大多数图片都被错误分类的对抗噪声。支持Linf norm范数",
                    attributes: [
                        [
                        { name: "步长", key:"step_size", defaultNumber: 0.01, number: 0, type: "inputNumber" , min: 0, max:1, step:0.01},
                        {name: "最大迭代次数", key:"max_iter", defaultNumber: 3000, number: 0, type: "inputNumber" ,min: 1, step:1},
                        { name: "初始常量", key:"initial_const", defaultNumber: 0.01, number: 0, type: "inputNumber" , min: 0, max:1, step:0.01},
                        { name: "置信度", key:"confidence", defaultNumber: 0, number: 0.0, type: "inputNumber" , min: 0, step:0.001},
                        ],
                    ]
                },
                {
                    name: "GeoDAL1",
                    id:"GeoDAL1",
                    description: "该方法基于神经网络决策边界往往具有较低曲率的事实假设，提出了一种在线性框架下通过法向量估计的方法完成黑盒基于决策模式下的对抗样本搜寻的方法。支持L1 norm范数",
                    attributes: [
                        [
                        {name: "二维频率空间维数", key:"sub_dim", defaultNumber: 10, number: 0, type: "inputNumber" ,min: 1,step:1},
                        {name: "最大迭代次数", key:"max_iter", defaultNumber: 1, number: 0, type: "inputNumber" ,min: 1, step:1},
                        { name: "高斯扰动方差", key:"sigma", defaultNumber: 0.0002, number: 0.0, type: "inputNumber" , min: 0, step:0.0001},
                        { name: "λ参数", key:"lambda_param", defaultNumber: 0.6, number: 0.0, type: "inputNumber" , min: 0, step:0.1},
                        ],
                    ]
                },{
                    name: "GeoDAL2",
                    id:"GeoDAL2",
                    description: "该方法基于神经网络决策边界往往具有较低曲率的事实假设，提出了一种在线性框架下通过法向量估计的方法完成黑盒基于决策模式下的对抗样本搜寻的方法。支持L2 norm范数",
                    attributes: [
                        [
                        {name: "二维频率空间维数", key:"sub_dim", defaultNumber: 10, number: 0, type: "inputNumber" ,min: 1,step:1},
                        {name: "最大迭代次数", key:"max_iter", defaultNumber: 1, number: 0, type: "inputNumber" ,min: 1, step:1},
                        { name: "高斯扰动方差", key:"sigma", defaultNumber: 0.0002, number: 0.0, type: "inputNumber" , min: 0, step:0.0001},
                        { name: "λ参数", key:"lambda_param", defaultNumber: 0.6, number: 0.0, type: "inputNumber" , min: 0, step:0.1},
                        ],
                    ]
                },{
                    name: "GeoDALinf",
                    id:"GeoDALinf",
                    description: "该方法基于神经网络决策边界往往具有较低曲率的事实假设，提出了一种在线性框架下通过法向量估计的方法完成黑盒基于决策模式下的对抗样本搜寻的方法。支持Linf norm范数",
                    attributes: [
                        [
                        {name: "二维频率空间维数", key:"sub_dim", defaultNumber: 10, number: 0, type: "inputNumber" ,min: 1,step:1},
                        {name: "最大迭代次数", key:"max_iter", defaultNumber: 1000, number: 0, type: "inputNumber" ,min: 1, step:1},
                        { name: "高斯扰动方差", key:"sigma", defaultNumber: 0.0002, number: 0.0, type: "inputNumber" , min: 0, step:0.0001},
                        { name: "λ参数", key:"lambda_param", defaultNumber: 0.6, number: 0.0, type: "inputNumber" , min: 0, step:0.1},
                        ],
                    ]
                },
                {
                    name: "Fastdrop",
                    id:"Fastdrop",
                    description: "该方法利用图像频域修改更加容易产生高质量对抗样本的思想，通过将图像变换到频域后，使用简单的频域小量随机丢弃和还原的搜索策略完成攻击",
                    attributes: [
                    ]
                },
            ],
            DefenseInfo: [
                {
                    name: "Nash博弈",
                    id:"Nash",
                    src: require('../assets/img/NashBalanceImg.png')
                },
                {
                    name: "集成博弈",
                    id:"Inte",
                    src: require('../assets/img/InterDefenseImg.png')
                },
                {
                    name: "自动攻击检测PACA",
                    id:"PACA",
                    src: require('../assets/img/PACAImg.png')
                },
                {
                    name: "待定1",
                    id:"tmp1",
                    src: ""
                },
                {
                    name: "待定2",
                    id:"tmp2",
                    src: ""
                },
                {
                    name: "待定3",
                    id:"tmp3",
                    src: ""
                },
            ],
            selectedMethod:["FGSM"],
            selectedAttributes: {},
            selectedDefense: ["Nash"],
            resultVisible: true,
            postData:{},
        }
    },
    watch: {
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
        }
    },
    created() {
        document.title = '模型群智化防御';
        },
    methods: { 
        /* 关闭结果窗口 */
        closeDialog(){
            this.resultVisible=false;
            //把绑定的弹窗数组 设为false即可关闭弹窗
        },
        updateMethod(index, checked){
            if (checked == true){
                this.selectedMethod.push(this.methodInfo[index].id)
            }else{
                this.selectedMethod.splice(this.selectedMethod.indexOf(this.methodInfo[index].id),1)
            }
            console.log(this.selectedMethod)
        },
        updateDefense(index, checked){
            if (checked == true){
                this.selectedDefense.push(this.DefenseInfo[index].id)
            }else{
                this.selectedDefense.splice(this.selectedDefense.indexOf(this.DefenseInfo[index].id),1)
            }
            console.log(this.selectedDefense)
        },
        /* 获取结果 */ 
        getData(){
            var that = this;
            that.$axios.get('/api/output/Resultdata', {params:{ Taskid: that.tid }}).then((data)=>{
                console.log("dataget:",data);
                that.result=data;
            });
        },
        /* 获取日志 */ 
        getLog(){
            debugger
            var that = this;
            if(that.percent < 99){
               that.percent += 1;
            }
            that.$axios.get('/api/Task/QueryLog', { params: { Taskid: that.tid } }).then((data) => {
                console.log("log:",data)
                if (JSON.stringify(that.stidlist)=='{}'){
                    that.logtext = [Object.values(data.data.Log).slice(-1)[0]];
                }else{
                    that.logtext=[]
                    for(let temp in that.stidlist){
                        that.logtext.push(data.data.Log[that.stidlist[temp]]);
                    }
                }
            });
        },
        /* 停止结果获取循环 */ 
        stopTimer() {
            if (this.result.data.stop == 1) {
                // 关闭日志显示
                this.logflag = false;
                // 关闭结果数据获取data
                clearInterval(this.clk);
                // 关闭日志获取结果获取
                clearInterval(this.logclk);
                                // 处理结果
                this.result = this.result.data.result;
                this.result["tid"] = this.tid
                this.result["stidlist"] = this.stidlist
                // 显示结果窗口
                this.resultVisible = true

            }else if(this.result.data.stop == 2){
                this.percent=100
                // 关闭结果数据获取data
                clearInterval(this.clk);
                this.clk=null
                // 关闭日志获取结果获取
                clearInterval(this.logclk);
                this.logclk = null
            }
        },
        /* 更新结果*/ 
        update(){
            this.getData();
            try{
                this.stopTimer();
            }catch(err){}
        },
        /* 点击评估触发事件 */
        dataEvaClick() {
            this.postData={}
            let dataset = this.dataSetInfo[this.selectedDataset].name;
            let model = this.modelInfo[this.selectedModel].name
            if(this.selectedMethod.length == 0){
                this.$message.warning('请至少选择一项对抗攻击方法！',3);
                return
            }
            // 检查各个方法的参数
            for(let i = 0; i < this.selectedMethod.length; i ++){
                if (!(this.selectedMethod[i] in this.selectedAttributes)){
                    let attributes_dict = {}
                    let info =[]
                    for( let methodnum = 0 ; methodnum < this.methodInfo.length; methodnum++){
                        if (this.methodInfo[methodnum].id == this.selectedMethod[i]){
                            info = this.methodInfo[methodnum].attributes
                            break
                        }
                    }
                    for(let i = 0; i < info.length; i++) {
                        for(let j = 0; j < info[i].length; j++) {
                            if ( info[i][j].type ==  "selectgroup"){
                                attributes_dict[info[i][j].key] = info[i][j].valuelist[info[i][j].defaultNumber]
                            }else{
                                attributes_dict[info[i][j].key] = info[i][j].defaultNumber
                            }
                        }
                    }
                    this.postData[this.selectedMethod[i]] = attributes_dict
                }else{
                    this.postData[this.selectedMethod[i]] = this.selectedAttributes[this.selectedMethod[i]]
                }
            }
            this.logtext = [];
            this.logflag = true;
            var that = this;
            that.$axios.post("/api/Task/CreateTask", { AttackAndDefenseTask: 0 }).then((result) => {
                console.log(result);
                that.tid = result.data.Taskid;
                that.logclk = setInterval(() => {
                        that.getLog();
                    }, 6000)
                /* 请求体 postdata*/
                that.postData["Dataset"] = dataset
                that.postData["Model"] = model
                that.postData["Method"] = JSON.stringify(that.selectedMethod)
                that.postData["Taskid"] = that.tid
                console.log(that.postData)
                that.$axios.post("/api/Attack/AdvAttack", that.postData).then((res) => {
                    that.stidlist =  {"advattack":res.data.stid};
                    that.clk = setInterval(() => {
                            that.update();
                        }, 30000)
                }).catch((err) => {
                    console.log(err);
                    clearInterval(that.logclk);
                });
            }).catch((err) => {
                console.log(err)
            });
        },
        // 更换数据集
        changeDataset(index) {
            this.selectedDataset = index;
        },
        // 更换模型
        changeModel(index) {
            this.selectedModel = index;
        },
        // 更新方法参数
        updataMethodAttributes(index, attributes_dict) {
            this.selectedAttributes[this.methodInfo[index].id] = attributes_dict;
        },
        changeDefense(index) {
            this.selectedDefense = index;
        },
        // 防御方法点击选中
        changeMethods(i, j) {
            debugger;
            let button = document.getElementById("button" + i + j)
            if (button.style.color == "") {

                button.style.color = "#0B55F4"
                button.style.borderColor = "#C8DCFB"
                button.style.background = "#F2F4F9"
                this.selectedMethod.push(this.methodInfoNoParam[i][j].name)
                this.selectedAttributes[this.methodInfoNoParam[i][j].name] = {}
            } else {

                button.style.color = ""
                button.style.borderColor = "#C8DCFB"
                button.style.background = "#F2F4F9"
                button.blur()
                this.selectedMethod.splice(this.selectedMethod.indexOf(this.methodInfoNoParam[i][j].name), 1 )
                delete this.selectedAttributes[this.methodInfoNoParam[i][j].name]
            }
        },
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

.paramTitle h3{
    /* height: 48px; */
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
.denfenseMethod .ant-btn{
    width: 100%;
    background-color: #F2F4F9;
    font-size:20px;
    height:50px;
    color:#000
}
.ant-divider-horizontal{
    margin: 0 0;
}

</style>
