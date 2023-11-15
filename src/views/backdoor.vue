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
                            <ModelCard style="width: 1104px;margin-bottom: 16px;" v-for="(info, index) in modelInfo" :key="'Model' + index"
                                v-bind="info" :indexInParent="index" @selectModel="changeModel"
                                :checked="index == selectedModel">
                            </ModelCard>
                            <div class="mainParamName48">投毒方法</div>
                            <MethodCard style="width: 1104px;" v-for="(info, index) in methodInfo" :key="'Method' + index"
                                v-bind="info" :indexInParent="index" :attack_type="'backdoor'" :dataset="selectedDataset" @updateAttributes="updataMethodAttributes" 
                                @selectMethod="updateMethod" :checked="selectedMethod.indexOf(methodInfo[index].id) > -1">
                            </MethodCard>
                            <!-- resultVisible -->
                            <BackdoorEval :is-show="resultVisible" :result="result" :postData="postData" @on-close="() => { resultVisible = !resultVisible }">
                            </BackdoorEval>
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
import navmodule from "../components/nav_homme.vue";
/* 引入组件，功能介绍 */
import func_introduce from "../components/funcIntroduce.vue"
/* 引入组件，日志显示 */
import showLog from "../components/showLog.vue"
/* 引入组件，结果显示 */
import resultDialog from "../components/resultDialog.vue"

/* 引入图片 */
import funcicon from "../assets/img/backdoorEvaIcon.png"
import bgimg from "../assets/img/modelEvaBackground.png"

import DataSetCard from "../components/card/DataSetCard.vue"
import ModelCard from "../components/card/ModelCard.vue"
import MethodCard from "../components/card/MethodCard.vue";
import BackdoorEval from "./dialog/BackdoorEval.vue";

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
    name:"backdoor",
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
        BackdoorEval,
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
                name: "后门攻击评估",
                /* 功能icon，需先引入 */
                imgpath:funcicon,
                /* 功能背景图片，需先引入 */
                bgimg:bgimg,
                /* 功能介绍下的总介绍 */
                destext:"多种投毒攻击方法对深度学习数据和模型进行攻击，可视化评估投毒攻击影响",
                /* 背景介绍 */
                backinfo:"人工智能系统相较于传统的计算机系统来说，它最大的特点就是需要用海量的大数据来训练模型。\
                攻击者会通过数据投毒的方式，在训练数据集中插入一些带毒样本对模型进行恶意攻击，\
                当有毒数据被攻击者激活后,会使本身在良性样本上表现良好的模型的预测性能发生恶意转化。后门攻击评估可以有效评估攻击效果。",
                /* 亮点介绍 */
                highlight:[
                    "支持多种主流的后门攻击算法，如基础的Backdoor Attack、Clean-Label Backdoor Attack、Clean Label Feature Collision Attack、Adversarial Backdoor Embedding等",
                    "支持用户自主设定投毒比例、投毒样式的宽高位置等信息，调试入门门槛低",
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
                }
               
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
                {
                    name: "ResNet101",
                    layer:101
                },
                {
                    name: "ResNet152",
                    layer:152
                },
            ],
            selectedModel: 0,
            methodInfo: [
                {
                    name: "Backdoor Attack",
                    id:"PoisoningAttackBackdoor",
                    description: "该方法使用数据投毒的方法，向训练集中的数据添加特别的后门特征（修改特定位置的像素值或者添加小的特殊图形），并且将这些数据的标签设置为目标标签。当模型在经过以上投毒后的训练集上训练后，在干净的样本上仍然可以保持较高的准确率，但是当输入的样本出现以上添加的后门特征时，模型会以较高的概率将输入样本分类到提前设定的目标标签中",
                    attributes: [
                        [{ name: "样本投毒比例", key:"pp_poison", defaultNumber: 0.33, number: 0.0, type: "inputNumber" , min: 0, max: 1, step:0.01},
                        { name: "投毒样本保存数量", key:"save_num", defaultNumber: 10, number: 0, type: "inputNumber" , min: 0, max: 10000, step:1},
                        { name: "测试样本数量", key:"test_sample_num", defaultNumber: 1000, number: 0, type: "inputNumber" , min: 0, max: 10000, step:1},
                        ],
                        [{ name: "目标类别", key:"target", defaultNumber: 0, number: 0, type: "selectgroup", valuelist:['数字0','数字1','数字2','数字3','数字4','数字5','数字6','数字7','数字8','数字9'] }],
                    ]
                },
                {
                    name: "Clean-Label Backdoor Attack L1",
                    id:"PoisoningAttackCleanLabelBackdoorL1",
                    description: "其基本思路是仅仅在攻击设定的目标标签类中的样本中添加后门，从而保证添加后门的样本能够保持原本正确的标签，避免了对于标签的修改，从而保证攻击的隐蔽性。由于这样以来，后门样本在训练过程中涉及到的样本类大大减少，很大程度上减少了后门特征被学习到的可能性。为了保证这种攻击方式下仍然具有较好的效果，论文中提出了两种方法来增强目标类学习训练过程中对于后门特征的依赖。支持L1 norm范数",
                    attributes: [
                        [{ name: "样本投毒比例", key:"pp_poison", defaultNumber: 0.33, number: 0.0, type: "inputNumber" , min: 0, max: 1, step:0.01},
                        { name: "投毒样本保存数量", key:"save_num", defaultNumber: 10, number: 0, type: "inputNumber" , min: 0, max: 10000, step:1},
                        { name: "测试样本数量", key:"test_sample_num", defaultNumber: 1000, number: 0, type: "inputNumber" , min: 0, max: 10000, step:1},
                        ],
                        [{ name: "目标类别", key:"target", defaultNumber: 0, number: 0, type: "selectgroup", valuelist:['数字0','数字1','数字2','数字3','数字4','数字5','数字6','数字7','数字8','数字9'] }],
                        [
                        { name: "扰动系数", key:"eps", defaultNumber: 0.031, number: 0.0, type: "inputNumber" , min: 0, max: 1, step:0.001},
                        { name: "步长参数", key:"eps_step", defaultNumber: 0.01, number: 0.0, type: "inputNumber" , min: 0, max: 1, step:0.01},
                        { name: "最大迭代次数", key:"max_iter", defaultNumber: 10, number: 0, type: "inputNumber" , min: 0, max: 100, step:1},
                        ]
                    ]
                },
                {
                    name: "Clean-Label Backdoor Attack L2",
                    id:"PoisoningAttackCleanLabelBackdoorL2",
                    description: "其基本思路是仅仅在攻击设定的目标标签类中的样本中添加后门，从而保证添加后门的样本能够保持原本正确的标签，避免了对于标签的修改，从而保证攻击的隐蔽性。由于这样以来，后门样本在训练过程中涉及到的样本类大大减少，很大程度上减少了后门特征被学习到的可能性。为了保证这种攻击方式下仍然具有较好的效果，论文中提出了两种方法来增强目标类学习训练过程中对于后门特征的依赖。支持L1 norm范数",
                    attributes: [
                        [{ name: "样本投毒比例", key:"pp_poison", defaultNumber: 0.33, number: 0.0, type: "inputNumber" , min: 0, max: 1, step:0.01},
                        { name: "投毒样本保存数量", key:"save_num", defaultNumber: 10, number: 0, type: "inputNumber" , min: 0, max: 10000, step:1},
                        { name: "测试样本数量", key:"test_sample_num", defaultNumber: 1000, number: 0, type: "inputNumber" , min: 0, max: 10000, step:1},
                        ],
                        [{ name: "目标类别", key:"target", defaultNumber: 0, number: 0, type: "selectgroup", valuelist:['数字0','数字1','数字2','数字3','数字4','数字5','数字6','数字7','数字8','数字9'] }],
                        [
                        { name: "扰动系数", key:"eps", defaultNumber: 0.031, number: 0.0, type: "inputNumber" , min: 0, max: 1, step:0.001},
                        { name: "步长参数", key:"eps_step", defaultNumber: 0.01, number: 0.0, type: "inputNumber" , min: 0, max: 1, step:0.01},
                        { name: "最大迭代次数", key:"max_iter", defaultNumber: 10, number: 0, type: "inputNumber" , min: 0, max: 100, step:1},
                        ]
                    ]
                },
                {
                    name: "Clean-Label Backdoor Attack Linf",
                    id:"PoisoningAttackCleanLabelBackdoorLinf",
                    description: "其基本思路是仅仅在攻击设定的目标标签类中的样本中添加后门，从而保证添加后门的样本能够保持原本正确的标签，避免了对于标签的修改，从而保证攻击的隐蔽性。由于这样以来，后门样本在训练过程中涉及到的样本类大大减少，很大程度上减少了后门特征被学习到的可能性。为了保证这种攻击方式下仍然具有较好的效果，论文中提出了两种方法来增强目标类学习训练过程中对于后门特征的依赖。支持L1 norm范数",
                    attributes: [
                    [{ name: "样本投毒比例", key:"pp_poison", defaultNumber: 0.33, number: 0.0, type: "inputNumber" , min: 0, max: 1, step:0.01},
                        { name: "投毒样本保存数量", key:"save_num", defaultNumber: 10, number: 0, type: "inputNumber" , min: 0, max: 10000, step:1},
                        { name: "测试样本数量", key:"test_sample_num", defaultNumber: 1000, number: 0, type: "inputNumber" , min: 0, max: 10000, step:1},
                        ],
                        [{ name: "目标类别", key:"target", defaultNumber: 0, number: 0, type: "selectgroup", valuelist:['数字0','数字1','数字2','数字3','数字4','数字5','数字6','数字7','数字8','数字9'] }],
                        [
                        { name: "扰动系数", key:"eps", defaultNumber: 0.031, number: 0.0, type: "inputNumber" , min: 0, max: 1, step:0.001},
                        { name: "步长参数", key:"eps_step", defaultNumber: 0.01, number: 0.0, type: "inputNumber" , min: 0, max: 1, step:0.01},
                        { name: "最大迭代次数", key:"max_iter", defaultNumber: 10, number: 0, type: "inputNumber" , min: 0, max: 100, step:1},
                        ]
                    ]
                },
                {
                    name: "Clean Label Feature Collision Attack",
                    id:"FeatureCollisionAttack",
                    description: "算法是在保持样本数据和标签正确对应下的数据投毒攻击，在训练阶段选择需要攻击的目标数据和基本类，经过投毒攻击以后，在推理阶段出现该目标数据时，会被分类到基本类中。方法中的目标类数据指的是攻击方法所针对的攻击实体",
                    attributes: [
                    [{ name: "样本投毒比例", key:"pp_poison", defaultNumber: 0.33, number: 0.0, type: "inputNumber" , min: 0, max: 1, step:0.01},
                        { name: "投毒样本保存数量", key:"save_num", defaultNumber: 10, number: 0, type: "inputNumber" , min: 0, max: 10000, step:1},
                        { name: "测试样本数量", key:"test_sample_num", defaultNumber: 1000, number: 0, type: "inputNumber" , min: 0, max: 10000, step:1},
                        ],
                        [{ name: "目标类别", key:"target", defaultNumber: 0, number: 0, type: "selectgroup", valuelist:['数字0','数字1','数字2','数字3','数字4','数字5','数字6','数字7','数字8','数字9'] }],
                        [
                        { name: "标识特征层", key:"feature_layer", defaultNumber: 3, number: 0, type: "inputNumber" , min: 0, max: 18, step:1},
                        { name: "优化方法的学习率", key:"learning_rate", defaultNumber: 0.01, number: 0.0, type: "inputNumber" , min: 0, max: 1, step:0.01},
                        { name: "学习率的衰变系数", key:"decay_coeff", defaultNumber: 0.5, number: 0, type: "inputNumber" , min: 0, max: 1, step:0.1},
                        ],
                        [
                        { name: "攻击停止阈值", key:"stopping_tol", defaultNumber: 0.0001, number: 0.0, type: "inputNumber" , min: 0, max: 1, step:0.0001},
                        { name: "对象改变停止阈值", key:"obj_threshold", defaultNumber: 0, number: 0.0, type: "inputNumber" , min: 0, max: 1, step:0.0001},
                        { name: "旧对象值数目", key:"num_old_obj", defaultNumber: 40, number: 0, type: "inputNumber" , min: 0, max: 100, step:1}
                        ],
                        [
                        { name: "相似系数", key:"similarity_coeff", defaultNumber: 256, number: 0, type: "inputNumber" , min: 0, max: 1000, step:1},
                        { name: "最大迭代次数", key:"max_iter", defaultNumber: 120, number: 0, type: "inputNumber" , min: 0, max: 1000, step:1},
                        { name: "水印透明度", key:"watermark", defaultNumber: 0, number: 0.0, type: "inputNumber" , min: 0, max: 1, step:0.001}
                        ]
                    ]
                },
                {
                    name: "Adversarial Backdoor Embedding",
                    id:"PoisoningAttackAdversarialEmbedding",
                    description: "对于一个被基本后门攻击方法攻击的模型，该方法通过一个对抗的模型结构和一个新的目标函数来将模型在被添加后门的全体训练样本上重新训练，在保证模型在干净样本上分类准确度的基础上，减少模型在干净样本和后门样本上潜空间上的特征差异",
                    attributes: [
                        [{ name: "样本投毒比例", key:"pp_poison", defaultNumber: 0.33, number: 0.0, type: "inputNumber" , min: 0, max: 1, step:0.01},
                        { name: "投毒样本保存数量", key:"save_num", defaultNumber: 10, number: 0, type: "inputNumber" , min: 0, max: 10000, step:1},
                        { name: "测试样本数量", key:"test_sample_num", defaultNumber: 1000, number: 0, type: "inputNumber" , min: 0, max: 10000, step:1},
                        ],
                        [{ name: "目标类别", key:"target", defaultNumber: 0, number: 0, type: "selectgroup", valuelist:['数字0','数字1','数字2','数字3','数字4','数字5','数字6','数字7','数字8','数字9'] }],
                    ],
                },
            ],
            selectedMethod:["PoisoningAttackBackdoor"],
            selectedAttributes: {},
            resultVisible: false,
            postData:{},
        }
    },
    watch: {
        /* 判断弹框是否显示，如果true显示结果弹框，并且底层滚动取消*/
        resultVisible:{
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
        document.title = '后门攻击评估';
        
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
        /* 获取结果 */ 
        getData(){
            var that = this;
            that.$axios.get('/output/Resultdata', {params:{ Taskid: that.tid }}).then((data)=>{
                console.log("dataget:",data);
                that.result=data;
            });
        },
        /* 获取日志 */ 
        getLog(){
            // debugger
            var that = this;
            if(that.percent < 99){
               that.percent += 1;
            }
            that.$axios.get('/Task/QueryLog', { params: { Taskid: that.tid } }).then((data) => {
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
                window.clearInterval(this.clk);
                // 关闭日志获取结果获取
                window.clearInterval(this.logclk);
                
                // 处理结果
                this.result = this.result.data.result;
                this.result["tid"] = this.tid
                this.result["stidlist"] = this.stidlist
                // 显示结果窗口
                this.resultVisible = !this.resultVisible
            }
        },
        /* 更新结果*/ 
        update(){
            this.getData();
            try{
                this.stopTimer();
            }catch(err){}
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
        dataEvaClick() {
            this.initParam()
            let dataset = this.dataSetInfo[this.selectedDataset].name;
            let model = this.modelInfo[this.selectedModel].name
            if(this.selectedMethod.length == 0){
                this.$message.warning('请至少选择一项投毒方法！',3);
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
                        attributes_dict[info[i][j].key] = info[i][j].defaultNumber
                        }
                    }
                    attributes_dict["trigger"]=[0 , 0, 4, 0]
                    this.postData[this.selectedMethod[i]] = attributes_dict
                }else{
                    this.postData[this.selectedMethod[i]] = this.selectedAttributes[this.selectedMethod[i]]
                }
                if(!(this.postData[this.selectedMethod[i]]['save_num'] < this.postData[this.selectedMethod[i]]["test_sample_num"])){
                    this.$message.warning(`${this.selectedMethod[i]}方法保存样本数需小于测试样本数！`,3);
                    return
                }
            }
            this.logtext = [];
            this.logflag = true;
            var that = this;
            // that.tid = "20231004_2003_7514589"
            // that.stidlist =  {"backdoor":"S20231004_2003_86f85ea"};
            // that.postData["Dataset"] = dataset
            // that.postData["Model"] = model
            // that.postData["Method"] = JSON.stringify(this.selectedMethod)
            // that.postData["Taskid"] = that.tid
            // that.clk = window.setInterval(that.update, 30);
            // return
            that.$axios.post("/Task/CreateTask", { AttackAndDefenseTask: 0 }).then((result) => {
                console.log(result);
                that.tid = result.data.Taskid;
                that.logclk = window.setInterval(that.getLog, 20000);
                /* 请求体 postdata*/
                that.postData["Dataset"] = dataset
                that.postData["Model"] = model
                that.postData["Method"] = JSON.stringify(this.selectedMethod)
                that.postData["Taskid"] = that.tid
                console.log(that.postData)
                that.$axios.post("/Attack/BackdoorAttack", that.postData).then((res) => {
                    that.stidlist =  {"backdoor":res.data.stid};
                    that.clk = window.setInterval(that.update, 30000);
                    
                    
                }).catch((err) => {
                    console.log(err);
                    window.clearInterval(that.clk);
                    window.clearInterval(that.logclk);
                });
            }).catch((err) => {
                console.log(err)
            });
            
        },
        // 更换数据集
        changeDataset(index) {
            this.selectedDataset = index
            for(let i =0 ;i < this.methodInfo.length;i++){
                if (this.methodInfo[i].attributes[1][0].key == "target"){
                    this.methodInfo[i].attributes[1][0].valuelist = this.dataSetInfo[index].class
                }
                
            }
            
            
        },
        // 更换模型
        changeModel(index) {
            this.selectedModel = index
            if (this.methodInfo[4].attributes[2][0].key == "feature_layer"){
                this.methodInfo[4].attributes[2][0].max = this.modelInfo[this.selectedModel].layer
            }
        },
        // 更新方法参数
        updataMethodAttributes(index, attributes_dict) {

            this.selectedAttributes[this.methodInfo[index].id] = attributes_dict
            
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

.layoutFooter{
    background: #FFFFFF;
}

.paramTitle h3 {
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


/* Inside auto layout */

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


    /* Inside auto layout */

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


/* Inside auto layout */

flex: none;
order: 1;
flex-grow: 0
}
/* 得分图echart */
#conseva{
    width: 300px;
    height:300px;
}

</style>
