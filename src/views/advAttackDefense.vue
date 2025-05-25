<template>
    <div>
        <a-layout>
            <a-layout-header>
                <!-- 导航栏 -->
                <navmodule/>
            </a-layout-header>
            <a-layout-content>
                <!-- 功能介绍 -->
                <func_introduce :funcDesText="funcDesText"></func_introduce>
                <!-- 参数配置和进度条容器 -->
                <div class="main-container">
                <!-- 参数配置容器 -->
                <div class="paramCon">
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
                                :checked="index == selectedModel" >
                            </ModelCard>
                            <div class="mainParamName48">请选择攻击方法（单选）</div>
                                <MethodCard v-if="modelInfo[selectedModel].name != 'Vicuna-7B-v1.1'" style="width: 1104px;" v-for="(info, index) in methodInfo" :key="'Method' + index"
                                    v-bind="info" :indexInParent="index" :attack_type="'advAttackDefense'" :dataset="selectedDataset" @updateAttributes="updataMethodAttributes" 
                                    @selectMethod="updateMethod" :checked="selectedMethod.indexOf(methodInfo[index].id) > -1">
                                </MethodCard>
                                <div v-for="(methods, i) in showmethodInfo" :key="i" style="margin-bottom: 16px;">
                                    <a-row :gutter="16" style="height:50px;" type="flex">
                                        <a-col :flex="24 / methods.length" v-for="(method, j) in methods" :key="j" class="denfenseMethod">
                                            <a-button :id="'button' + i + j" @click="changeMethods(i, j, true)"
                                                >{{ method.name }}</a-button>
                                        </a-col>
                                    </a-row>
                                </div>
                                <!-- 攻击方法描述区域 - 统一显示 -->
                                <div v-if="attackMethodDescription !== ''" class="methodDescription"> {{ attackMethodDescription }} </div>

                                <AdvAttackEval v-if="modelInfo[selectedModel].name != 'Vicuna-7B-v1.1'" :is-show="resultVisible" :result="result" :postData="postData" @on-close="() => { resultVisible = !resultVisible }">
                                </AdvAttackEval>
                                <LLMAttackEval v-else :is-show="resultVisible" :result="result" :postData="postData" @on-close="() => { resultVisible = !resultVisible }">
                                </LLMAttackEval>

                            <div class="mainParamName48">请输入攻击样本数</div>
                            <a-input-number class="samplenumBox" v-model="sampleNum" :min="1" :max="10000" style="height: 60px;padding:16px 24px;" placeholder="请在此输入攻击样本数，（输入范围1-10000，建议值50）" />

                            <div class="mainParamName48">请选择防御方法（可多选）</div>

                            <div v-for="(methods, i) in showdefensemethodInfo" :key="i" style="margin-bottom: 16px;">
                                <a-row :gutter="16" style="height:50px;" type="flex">
                                    <a-col :flex="24 / methods.length" v-for="(method, j) in methods" :key="j" class="denfenseMethod" >
                                        <a-button :id="'defenseBtn' + i + j" @click="changeMethods(i, j, false)"
                                            >{{ method.name }}</a-button>
                                    </a-col>
                                </a-row>
                            </div>
                            <!-- 防御方法描述区域 - 统一显示 -->
                            <div v-if="defenseMethodDescription !== ''" class="methodDescription"> {{ defenseMethodDescription }} </div>

                            <AdvAttackDefenseEval :is-show="resultVisible" :result="result" :postData="postData" @on-close="() => { resultVisible = !resultVisible }">
                            </AdvAttackDefenseEval>
                            </div>
                        </div>
                    </div>
                    <!-- 进度条组件 -->
                    <div class="progress-container">
                        <!-- <h2 class="subTitle" style="margin-top: -96px;">对抗性</h2> -->
                        <div class="progress-wrapper">
                            <vertical-steps
                                :key="currentSubStep"
                                :mainSteps="defenseSteps"
                                :currentMainStep="currentMainStep"
                                :currentSubStep="currentSubStep"
                                @update:currentSubStep="handleSubStepChange"
                                @update:currentMainStep="mainIndex => { currentMainStep = mainIndex; }"
                            />
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
/* 引入自定义js，结果显示 */

/* 引入图片 */
import funcicon from "../assets/img/AdvAttackDefenseIcon.png"
import bgimg from "../assets/img/modelEvaBackground.png"
import errorImg from "../assets/img/logo.png"
import DataSetCard from "../components/card/DataSetCard.vue"
import ModelCard from "../components/card/ModelCard.vue"
import MethodCard from "../components/card/MethodCard.vue";
import AdvAttackDefenseEval from "./dialog/AdvAttackDefenseEval.vue";
import VerticalSteps from "../components/VerticalSteps.vue";
import AdvAttackEval from "./dialog/AdvAttackEval.vue";
import LLMAttackEval from "./dialog/LLMAttackEval.vue";

const selectSvg = {
    template: `
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
    name: "advAttackDefense",
    components: {
        /* 注册组件 */
        navmodule: navmodule,
        func_introduce: func_introduce,
        showLog: showLog,
        resultDialog: resultDialog,
        selectIcon,
        DataSetCard,
        ModelCard,
        MethodCard,
        AdvAttackDefenseEval,
        VerticalSteps,
        AdvAttackEval,
        LLMAttackEval,
    },
    data() {
        return {
            // Track separate descriptions for attack and defense methods
            attackMethodDescription: "",
            defenseMethodDescription: "",
            /* 单选按钮样式 */
            radioStyle: {
                display: 'block',
                lineHeight: '30px',
            },
            /* 评估按钮样式和状态 */
            buttonBGColor: {
                background: "#0B55F4",
                color: "#FFFFFF"
            },
            // 按钮是否置灰
            disStatus: false,
            /* 日志框是否显示，false不显示，true显示，默认不显示 */
            logflag: false,
            /* 进度 */
            percent: 10,
            errorImg:errorImg,
            /* 日志内容，调用日志接口获取 */
            logtext: [],
            /* 功能介绍模块信息 */
            funcDesText: {
                /* 功能名称 */
                name: "对抗攻击防御",
                /* 功能icon，需先引入 */
                imgpath:funcicon,
                /* 功能背景图片，需先引入 */
                imgbg:bgimg,
                /* 功能介绍下的总介绍 */
                destext:"多种对抗攻击和防御算法对深度学习模型进行攻击和防御，可视化展示效果",
                /* 背景介绍 */
                backinfo:"对抗防御是对抗攻击的逆过程，是为了让对抗样本在被投毒之后，能够正确的进行分类。本平台主要支持JPEG压缩、随机缩放、特征压缩等多种对抗防御算法",
                /* 亮点介绍 */
                highlight:[
                    "支持JPEG压缩、随机缩放等多种对抗防御算法",
                    "支持离线防御和在线一体化防御",
                    "支持单模型和多模型防御"
                ],
            },
            /* 结果弹窗是否显示 */
            resultVisible: false,
            /* 评估结果 */
            result: {},
            /* 评估参数 */
            postData: {},
            /* 主任务id */ 
            tid: "",
            /* 子任务id */ 
            stid: {},
            /* 存储异步任务结果查循环clock */
            clk: "",
            /* 日志查询clock */
            logclk: "",
            /* 选择的数据集 */
            selectedDataset: 0,
            /* 选择的模型 */
            selectedModel: 0,
            /* 选择的方法 */
            selectedMethod: [],
            /* 选择的防御方法 */
            selectedDefenseMethod: [],
            /* 选择的方法参数 */
            selectedAttributes: {},
            dataSetInfo: [
                {
                    name: "MNIST",
                    description: "是一个手写体数字的图片数据集，该数据集来由美国国家标准与技术研究所（National Institute of Standards and Technology (NIST)）发起整理，一共统计了来自250个不同的人手写数字图片，其中50%是高中生，50%来自人口普查局的工作人员。该数据集的收集目的是希望通过算法，实现对手写数字的识别。",
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
            ],
            modelInfo: [
            {
                    name: "SmallCNN",
                    disabled:false
                },
                {
                    name: "ResNet18",
                    disabled:true
                },
                {
                    name: "VGG16",
                    disabled:true
                },
            ],
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
                        { name: "扰动系数", key:"eps", defaultNumber: 0.031, number: 0.0, type: "inputNumber" , min: 0, step:0.001},
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
                    description: "在优化框架下的基于决策的攻击，并提出了一系列新颖的算法，用于生成针对性和非针对性的对抗性示例，这些示例针对'2-距离'或'∞距离'的最小距离进行了优化。 该算法本质上是迭代的，每个迭代涉及三个步骤：梯度方向的估计，通过几何级数进行的步长搜索和通过二分法的边界搜索。对优化框架和梯度方向估计进行了理论分析。这不仅为选择超参数提供了参考，而且还激发了所提出算法中的必要步骤",
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
            methodInfoNoParam:[[
                {name:"DIFGSM",description:"DIFGSM算法：Diverse Inputs Iterative Fast Gradient Sign Method,通过创建多样的输入模式提高对抗样本的迁移性。做法是对输入的原图像以p的概率加上随机且可导的变换(transformation)，使用梯度的方法最大化模型对变换后的原图像的损失函数值从而得到对抗图像",},
                {name:"FAB", description:"FAB算法：Fast Adaptive Boundary Attack使用类似DeepFool投影到决策平面的方法，主要不同的是，FAB将过程中的扰动尽可能偏向原样本点，从而可以找到能改变分类器输出的最小扰动。扰动的衡量距离为 linf",},
                {name:"FABL1", description:"FABL1算法：Fast Adaptive Boundary Attack使用类似DeepFool投影到决策平面的方法，主要不同的是，FAB将过程中的扰动尽可能偏向原样本点，从而可以找到能改变分类器输出的最小扰动。扰动的衡量距离为 l1",},
                {name:"FABL2", description:"FABL2算法：Fast Adaptive Boundary Attack使用类似DeepFool投影到决策平面的方法，主要不同的是，FAB将过程中的扰动尽可能偏向原样本点，从而可以找到能改变分类器输出的最小扰动。扰动的衡量距离为 l2",},
                {name:"EOTPGD", description:"EOTPGD算法：结合Expectation Over Transformation算法生成具有鲁棒性的对抗样本，能在变换(transformation)后依旧保持对抗性",}
                ],
                [
                {name:"FFGSM",description:"FFGSM算法：在使用FGSM攻击算法前加入随机初始化的扰动，经过实验发现基于FFGSM的对抗训练拥有高效性",},
                {name:"Jitter",description:"Jitter算法：使用新的损失函数从而改善效率和攻击成功率，同时通过输出logits标准化到固定值范围将规模不变性引入损失函数",},
                {name:"MIFGSM",description:"MIFGSM算法：momentum iterative FGSM是一种使用momentum迭代梯度的方法，该方法在迭代梯度对抗攻击(如BIM)的基础上，累计每次梯度方向的速度向量作为momentum，每次对抗扰动不再直接使用梯度方向，转而采用momentum方向，从而稳定更新方向并避免局部极值，更好提高攻击迁移性",},
                {name:"NIFGSM",description:"NIFGSM算法：通过使用Nesterov Accelerated Gradient(NAG)到迭代梯度攻击方法中，由于NAG对之前累积的梯度进行修正，有助于有效地预测未来，从而使攻击更具有鲁棒性",},
                {name:"PGDRS",description:"PGDRS算法：randmized smoothing是提高模型鲁棒性的一种高效方法，PGD for randmized smoothing则是争对这类randmized smoothing模型的pgd对抗攻击方法。攻击norm为linf",}
                ],
                [
                {name:"PGDRSL2",description:"PGDRSL2算法：randmized smoothing是提高模型鲁棒性的一种高效方法，PGD for randmized smoothing则是争对这类randmized smoothing模型的pgd对抗攻击方法。攻击norm为l2",},
                {name:"RFGSM",description:"RFGSM算法：R+FGSM在FGSM中加入随机的步骤, 是一个在白盒设置下高效的能替代迭代攻击的方法",},
                {name:"SINIFGSM",description:"SINIFGSM算法：SCALE-INVARIANT NIFGSM通过使用模型放大的方法实现多模型的组合攻击，使得攻击避免在白盒设置下'过拟合'，从而生成更具有迁移性的对抗样本",},
                {name:"SparseFool",description:"SparseFool算法：利用决策边界的低均值曲率计算对抗稀疏(sparse)扰动",},
                {name:"SPSA",description:"SPSA算法：SPSA adversarial attack是一种黑盒攻击方法，使用SPSA方法近似loss对样本的梯度，利用迭代梯度更新方法生成对抗样本",}
                ],
                [
                {name:"TIFGSM",description:"TIFGSM算法：Translation-Invarient FGSM将translation-invarient attack与FGSM结合，具体是将对抗目标调整为使像素平移后的对抗样本输出与真实标签的loss最大，同时使用卷积梯度的方法减小计算代价，使用该攻击方法拥有更强的迁移性",},
                {name:"TPGD",description:"TPGD算法：基于KL-Divergence loss的pgd攻击",},
                {name:"VMIFGSM",description:"VMIFGSM算法：variance tuning MIFGSM在MIFGSM方法上，不再直接使用当前计算的梯度做momentum累加，而是基于先前迭代下的梯度方差调整当前梯度",},
                {name:"VNIFGSM",description:"VNIFGSM算法：variance tuning MIFGSM在NIFGSM方法上，不再直接使用当前计算的梯度做momentum累加，而是基于先前迭代下的梯度方差调整当前梯度",},
                ],
                [
                {name:"AutoPGDL1", description:"一种基于L1范数正则化的对抗性攻击算法，通过迭代生成对抗样本，以欺骗机器学习模型并导致错误的预测结果。该算法利用L1范数正则化来控制对抗样本的扰动大小，使得扰动更加稀疏",},
                {name:"AutoPGDL2", description:"一种基于L2范数正则化的对抗攻击算法，通过迭代生成对抗样本，以欺骗机器学习模型。一定程度上成功地改变了原始样本的特征，导致模型产生错误的预测结果",},
                {name:"AutoPGDLinf", description:"基于1-无穷范数正则化的AutoPGD方法的对抗性攻击算法，在AutoPGDLinf算法中，对抗样本的生成过程是通过最小化原始样本与对抗样本之间的距离，并同时最大化对抗样本的损失函数来实现的。为了限制对抗样本的扰动范围，算法使用了1-无穷范数正则化，即对扰动进行约束，使其在每个维度上的取值范围不超过一个预先设定的阈值",},
                {name:"Auto-CGL1", description:"基于L1范数正则化的Auto-CGD方法的对抗性攻击算法。该算法通过最小化目标函数来寻找最优的扰动，使得扰动后的输入数据能够误导模型产生错误的预测结果",}
                ],
                [
                {name:"Auto-CGL2", description:"基于L2范数正则化的Auto-CGD方法的对抗性攻击算法，通过迭代优化的方式生成对抗样本。它首先选择一个初始的对抗样本，然后通过迭代的方式不断调整该样本，使其能够最大程度地欺骗目标模型",},
                {name:"Auto-CGLinf", description:"基于1-无穷范数正则化的Auto-CGD方法的对抗性攻击算法。通过计算原始样本与对抗样本之间的梯度来确定调整方向。使用一种自适应的学习率调整策略来更新对抗样本",},
                {name:"ElasticNetL1", description:"基于L1范数正则化的弹性网络的对抗性攻击算法。使用了弹性网络的思想，结合了L1范数正则化正则化。它通过迭代优化的方式生成对抗样本",},
                {name:"ElasticNetL2", description:"使用弹性网络方法和L2范数正则化的对抗性攻击算法，使用了弹性网络的思想，结合了L2范数正则化。它通过迭代优化的方式生成对抗样本",}
                ],
                [
                {name:"ElasticNet-EN", description:"使用弹性网络方法的L1和L2范数正则化的对抗性攻击算法,同时使用L1范数和L2范数正则化。L1范数正则化可以促使生成的对抗样本具有稀疏性，而L2范数正则化可以平衡对抗样本的整体扰动。这种结合可以帮助算法在生成对抗样本时取得更好的平衡，同时保持对抗样本的有效性和可解释性",},
                {name:"FeatureAdversaries", description:"针对输入数据中的特定特征的对抗性攻击算法，通过分析目标模型的预测行为和特征重要性，选择一个或多个目标特征进行攻击",},
                {name:"NewtonFool", description:"基于牛顿优化方法的对抗性攻击算法。使用牛顿优化方法来迭代地更新扰动值，利用了损失函数的二阶导数信息，通过求解方程来找到最小值。在每次迭代中，算法计算损失函数的梯度和海森矩阵，并使用这些信息来更新扰动值",}
                ],
                [
                {name:"SpatialTransformation", description:"使用空间转换欺骗模型的对抗性攻击算法。对输入图像进行一系列的几何变换，例如旋转、缩放、平移等，以改变图像的外观和结构。这些变换会导致模型在处理经过转换的图像时产生错误的预测结果",},
                {name:"TargetedUniversalPerturbationL2", description:"利用L2范数正则化生成通用摄动的对抗性攻击算法，生成通用摄动，以欺骗目标模型。该算法使用L2范数正则化来生成摄动，以确保生成的摄动在图像中的扰动较小",},
                {name:"TargetedUniversalPerturbationLinf", description:"产生1-无穷范数正则化的通用摄动的对抗性攻击算法，生成通用摄动（universal perturbation），以欺骗目标模型。该算法使用1-无穷范数正则化来生成摄动，以确保生成的摄动在图像中的扰动较小",},
                ],
                [
                {name:"VirtualAdversarialMethod", description:"基于虚拟对抗训练方法的对抗攻击算法。通过在原始样本的附近生成虚拟对抗样本，这些样本在输入空间中与原始样本非常接近，但在模型输出上具有最大化的不确定性。模型在原始样本和虚拟对抗样本之间进行训练，以增强模型对对抗性扰动的鲁棒性",},
                {name:"SignOPTAttack", description:"使用Sign-OPT方法进行优化的对抗性攻击算法",},
                ],
            ],
            showmethodInfo:[],
            sampleNum:"",
            showdefensemethodInfo:[],
            defensemethodInfo: [
                [
                    {
                        name:"Feature Squeezing",
                        id:"Feature Squeeze",
                        description:"通过将对应于原始空间中许多不同特征向量的样本凝聚成一个单一的样本来减少敌手可用的搜索空间。通过比较DNN模型对原始输入的预测和对挤压后的输入的预测，能以较高的准确率和较少的假阳性检测出对抗样本",
                    },
                    {
                        name:"Spatial Smoothing",
                        id:"Spatial Smoothing",
                        description:"是一种图像处理技术，用于减少图像中的噪声和细节，以使图像更加平滑和清晰。它通常通过使用卷积核（如高斯卷积核）来对图像进行平滑处理，并将卷积核沿图像的像素分布进行卷积。在图像处理中，Spatial smoothing常用于去除图像噪声，提高图像质量，以及为后续处理提供更加稳定的图像基础",
                    },
                    {
                        name:"Twis",
                        id:"Twis",
                        description:"基于两个发现：一，对抗样本只占样本空间的极小部分，对任意样本添加高斯噪声，样本更有可能落到正常样本的范围；二，正常样本添加对抗噪声，很容易成为对抗样本，而对抗样本添加对抗噪声则仍然是对抗样本。基于这两个发现，分别利用高斯噪声和对抗噪声来改变样本，根据分类结果的变化来判断样本是否具有对抗性",
                    },
                    {
                        name:"InverseGAN",
                        id:"InverseGAN",
                        description:"通过训练编码器网络，能够在不访问任何训练数据的情况下对预训练的生成器网络进行反转，即恢复出给定测试图片的潜在编码，该框架能够应用于对抗样本防御。在训练集上训练生成器G反演模型I,给定测试样本$$x^{adv}$$先利用训练好的编码器网络得到$$z^0$$，再不断优化得到最优的潜在编码所生成的$$x^{proj}$$，实现对对抗样本的去噪",
                    },
                ],
                [
                    {
                        name:"DefenseGAN",
                        id:"DefenseGAN",
                        description:"通过对GAN生成的虚假图像进行识别，从而防止对真实图像进行攻击。DefenseGAN可以用于保护图像分类器免受GAN生成的对抗样本的攻击。DefenseGAN使用在良性数据上训练的WGAN来对对抗样本进行去噪，降低它的对抗性后再交给分类模型识别",
                    },
                    {
                        name:"JPEG compression",
                        id:"JPEG",
                        description:"一种常用的图像压缩标准，用于压缩彩色图像和灰度图像。它使用一种称为颜色变换和分配系数的技术，将图像的颜色空间从原始的RGB空间变换到YCbCr空间，并使用DCT（离散余弦变换）来编码图像。将对抗样本图片JPEG压缩后再交给模型识别，对于扰动较小的对抗样本具有不错的防御能力",
                    },
                    {
                        name:"Label smoothing",
                        id:"Label Smoothing",
                        description:"通过降低标签的置信度来降低模型对对抗样本的过度敏感性。通过从每个类别的真实标签中减去一个小的值，将标签的置信度降低，从而使模型对不符合预期的对抗样本的鲁棒性得到提高",
                    },
                    {
                        name:"Pixel Defend",
                        id:"Pixel Defend",
                        description:"通过将恶意扰动的图像移回训练数据中的分布来去噪。PixCNN是专为图像像素分布设计的一个自回归生成模型，该模型用条件概率分布的乘积来定义所有像素上的联合分布。利用PixCNN把对抗样本的分布移回到正常样本的分布，以实现去噪",
                    }
                ],
                [
                    {
                        name:"Total Variance Minimization",
                        id:"Total Variance Minimization",
                        description:"源自图像处理中的全变分去噪，全变分去噪的优点是既能去除噪声，又能保留图像中的边界等信息。其基本思想是，如果图像的细节有很多高频信息（如尖刺、噪点等），那么整幅图像的梯度幅值之和（全变分）是比较大的，如果能够使整幅图像的梯度积分之和降低，就达到了去噪的目的",
                    },
                    {
                        name:"Pixel Deflection",
                        id:"Pixel Deflection",
                        description:"利用模型鲁棒性通过强制图像与自然图像统计相匹配来抵御对抗扰动。 通过Pixel Deflection的过程重新分配像素值来局部破坏图像。随后基于小波的去噪操作软化了这种损坏，以及一些对抗性的变化",
                    },
                    {
                        name:"Regin-based classification",
                        id:"Rgioned-based",
                        description:"对于良性/对抗测试样本，将信息集成在以样本为中心的超立方体中以预测其标签。具体来说，从输入空间中以测试样本为中心的超立方体中采样一些数据点；使用现有的DNN来预测每个采样数据点的标签；并且在采样数据点的标签中以多数票作为测试样本的标签。基于区域的分类可以显着减轻对抗攻击，而不会牺牲良性样本的分类准确性",
                    }
                ],
                [
                    {
                        name:"Gaussian Data Augmentation",
                        id:"Gaussian Data Augmentation",
                        description:"增强模型的泛化能力，让模型能将原始数据和经过扰动后的数据分类相同。主要做法是使用高斯噪声扰动的样本来扩展训练集，有助于平滑模型置信度，而不会影响真实样本的准确性",
                    },
                    {
                        name:"PGD adversarial training",
                        id:"Madry",
                        description:"最经典的对抗训练方式，其损失函数是对抗样本和正确标签之间的交叉熵，只以对抗样本的正确分类为目标，因此，模型会将正常样本附近的对抗样本正确分类",
                    },
                    {
                        name:"TRADES",
                        id:"TRADES",
                        description:"在PGD Adversarial Training的基础上进行了改进，将模型的鲁棒性和准确率建立联系。通过在损失函数中使用正则化项来平衡模型在干净样本上的准确性和对抗性样本的鲁棒性之间的权衡。这导致决策边界更加平滑，对抗样本的鲁棒性得到提高",
                    }
                ],
                [
                    {
                        name:"FreeAT",
                        id:"FreeAT",
                        description:"在生成对抗样本时，每次迭代得到的梯度也用于模型参数的更新。为保证对抗扰动是迭代多步的，将前一次更新的扰动作为下一次更新的初始扰动。降低了对抗训练的成本",
                    },
                    {
                        name:"FastAT",
                        id:"FastAT",
                        description:"一种快速对抗训练的方法，其出发点是基于一步攻击（FGSM）和基于迭代式攻击（PGD）的对抗训练以及FreeAT的鲁棒性的巨大差异。FastAT对扰动进行非零初始化，可以达到和基于迭代式攻击（PGD）以及FreeAT相当的鲁棒性",
                    },
                    {
                        name:"MART",
                        id:"MART",
                        description:"Misclassification Aware adveRsarial Training(MART)，错误分类感知对抗训练 ，它在训练期间明确区分错误分类和正确分类的样本。MART可以显著提高最先进的对抗鲁棒性",
                    },
                    {
                        name:"CARTL",
                        id:"CARTL",
                        description:"一种新的合作对抗鲁棒迁移学习，通过特征距离最小化对模型进行预训练，并通过对目标域任务的非扩展微调来微调预训练模型",
                    }

                ],

            ],
            currentMainStep: 2, // 模型 - keeping at index 2 to match both files
            currentSubStep: 0, // 对抗攻击防御
        }
    },
    watch: {
        /* 判断弹框是否显示，如果true显示结果弹框，并且底层滚动取消*/
        resultVisible: {
            immediate: true,
            handler(v) {
                if (v) {
                    this.noScroll();
                } else {
                    this.canScroll();
                }
            }
        },
        /* 监听路由变化，更新进度条状态 */
        '$route': {
            immediate: true,
            handler() {
                // Ensure steps data is available before calling
                if (this.defenseSteps && this.defenseSteps.length > 0) { 
                    this.setProgressStepsByRoute();
                } else {
                    console.warn('defenseSteps not ready in route watcher');
                }
            }
        },
        /* 监听样本数量输入 */
        sampleNum: {
            handler(val) {
                if (val && !isNaN(val)) {
                    // 更新导航步骤为"模型"-"对抗攻击防御"，因为样本数量是这个页面的配置部分
                    this.updateCurrentStep(2, 0);
                }
            }
        },
        selectedDataset:{
            handler(value){
                if(value==0){ // MNIST
                    this.modelInfo = [
                        { name: "SmallCNN", disabled:false },
                        { name: "ResNet18", disabled:true },
                        { name: "VGG16",    disabled:true },
                    ]
                }else{ // CIFAR10
                    this.modelInfo = [
                        { name: "SmallCNN", disabled:true }, // Example: Adjust as per actual availability
                        { name: "ResNet18", disabled:false },
                        { name: "VGG16",    disabled:false },
                    ]
                }
                this.changeModel(0); // Reset selected model and update attack methods
            }
        }
    },
    created() {
        document.title = '对抗攻击防御';
        
        // 初始化防御方法数据
        this.showdefensemethodInfo = this.defensemethodInfo;
        
        // 初始化攻击方法数据
        if (this.modelInfo[this.selectedModel] && this.modelInfo[this.selectedModel].name == "Vicuna-7B-v1.1"){
             this.showmethodInfo = [[{
                 name: "LLM-Attacks",
                 description: "LLM Attacks算法用于构建针对各种大型语言模型(LLM)的对抗攻击。通过这种算法，攻击者可以自动生成一系列提示后缀，绕过LLM的安全机制，并导致LLM输出有害的响应",
             }]]
        } else {
             this.showmethodInfo = this.methodInfoNoParam;
        }
        
        // Ensure steps data is available before calling
        if (this.defenseSteps && this.defenseSteps.length > 0) { 
             this.setProgressStepsByRoute();
        } else {
             console.warn('defenseSteps not ready in created()');
        }
    },
    mounted() {
        this.changeDataset(0);
        this.changeModel(0);
        
        // Ensure steps data is available after mount and DOM update
        this.$nextTick(() => {
            if (this.defenseSteps && this.defenseSteps.length > 0) { 
                this.setProgressStepsByRoute();
            } else {
                console.warn('defenseSteps not ready in mounted()');
            }
        });
    },
    //在离开页面时执行
    beforeDestroy() {
        if(this.clk) { //如果定时器还在运行,关闭定时器
            window.clearInterval(this.clk); //关闭
        }
        if(this.logclk){
            window.clearInterval(this.logclk);
        }
    },
    methods: {
        /* 关闭结果窗口 */
        closeDialog() {
            this.resultVisible = false;
            //把绑定的弹窗数组 设为false即可关闭弹窗
        },
        noExistImg(e){
            e.target.src=this.errorImg;
        },
        
        /* 获取日志 */ 
        getLog(){
            // debugger
            var that = this;
            if(that.percent < 99){
               that.percent += 1;
            }
            that.$axios.get('/Task/QueryLog', { params: { Taskid: that.tid } }).then((data) => {
                // console.log("log:", data)
                if (JSON.stringify(that.stid)=='{}'){
                    that.logtext = [Object.values(data.data.Log).slice(-1)[0]];
                }else{
                    that.logtext=[]
                    for(let temp in that.stid){
                        that.logtext.push(data.data.Log[that.stid[temp]]);
                    }
                }
            });
        },
        initParam(){
            this.logtext=[]
            this.percent=0
            this.postData={}
            this.result = {}
            this.tid=''
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
            if (1 <= this.sampleNum && this.sampleNum <= 10000 ){
            }
            else{
                this.$message.warning('请输入攻击样本数量，输入范围为1-10000，建议值50！',3);
                return 0;
            }
            if (this.selectedDefenseMethod.length == 0){
                this.$message.warning('请至少选择一项防御方法！',3);
                return 0;
            }
            if (this.selectedMethod.length == 0){
                this.$message.warning('请选择一项攻击方法！',3);
                return 0;
            }
            
            // 更新导航步骤为"模型"-"对抗攻击防御"，保持在当前页面
            this.updateCurrentStep(2, 0);
            
            // 处理攻击方法参数
            const attackMethod = this.selectedMethod[0];
            let attackParams = {};
            
            // 检查是否有参数设置
            if (attackMethod in this.selectedAttributes) {
                attackParams = this.selectedAttributes[attackMethod];
            } else {
                // 查找默认参数
                for (let i = 0; i < this.methodInfo.length; i++) {
                    if (this.methodInfo[i].id === attackMethod) {
                        const attributes = this.methodInfo[i].attributes || [];
                        const defaultParams = {};
                        
                        for (let j = 0; j < attributes.length; j++) {
                            for (let k = 0; k < attributes[j].length; k++) {
                                const attr = attributes[j][k];
                                if (attr.type === "selectgroup") {
                                    defaultParams[attr.key] = attr.valuelist[attr.defaultNumber];
                                } else {
                                    defaultParams[attr.key] = attr.defaultNumber;
                                }
                            }
                        }
                        
                        attackParams = defaultParams;
                        break;
                    }
                }
            }
            
            this.logflag = true;
            var that = this;

            /* 调用创建主任务接口，需开启后端程序 */
            that.$axios.post("/Task/CreateTask", { AttackAndDefenseTask: 0 }).then((result) => {
                console.log(result);
                that.tid = result.data.Taskid;
                that.logclk = window.setInterval(that.getLog, 6000);
                
                /* 请求体 postdata*/
                that.postData = {
                    adv_dataset: dataset,
                    adv_model: model,
                    adv_method: that.selectedMethod[0], // 使用选择的第一个攻击方法（单选模式）
                    adv_nums: that.sampleNum,
                    defense_methods: that.selectedDefenseMethod,
                    tid: that.tid,
                };
                
                // 添加攻击方法参数
                if (Object.keys(attackParams).length > 0) {
                    that.postData[attackMethod] = attackParams;
                }
                
                // 添加调试日志，显示发送到后端的请求数据
                console.log('发送到后端的请求数据:', JSON.stringify(that.postData, null, 2));
                console.log('%c完整请求数据对象 👇', 'background: #3498db; color: white; font-size: 14px; padding: 5px;');
                console.table(that.postData);
                
                console.log(this.postData)
                that.$axios.post("/detect", that.postData).then((res) => {
                    that.result = res.data;
                    console.log('后端返回数据:', res.data);
                    window.clearInterval(that.logclk);
                    that.stid['advAttackDefense'] =  res.data.stid
                    that.getLog();
                    that.resultVisible = !that.resultVisible;
                    that.logflag = false;
                }).catch((err) => {
                    console.log(err);
                    window.clearInterval(that.logclk);
                });
            }).catch((err) => {
                console.log(err)
            });
        },
        // 更新当前导航步骤
        updateCurrentStep(mainStep, subStep) {
            this.currentMainStep = mainStep;
            this.currentSubStep = subStep;
        },
        
        // 更换数据集
        changeDataset(index) {
            this.selectedDataset = index
            if (this.selectedDataset == 0){
                this.selectedModel = 0
                this.modelInfo[0].disabled=false
                this.modelInfo[1].disabled=true
                this.modelInfo[2].disabled=true
            }else{
                if (this.selectedModel == 0){
                    this.selectedModel = 1
                }
                this.modelInfo[0].disabled=true
                this.modelInfo[1].disabled=false
                this.modelInfo[2].disabled=false
            }
            
            // 更新导航步骤为"模型"-"对抗攻击防御"
            this.updateCurrentStep(2, 0);
        },
        
        // 更换模型
        changeModel(index) {
            this.selectedModel = index;
            
            // 更新攻击方法选项
            if (this.modelInfo[this.selectedModel] && this.modelInfo[this.selectedModel].name == "Vicuna-7B-v1.1"){
                this.showmethodInfo = [[{
                    name: "LLM-Attacks",
                    description: "LLM Attacks算法用于构建针对各种大型语言模型(LLM)的对抗攻击。通过这种算法，攻击者可以自动生成一系列提示后缀，绕过LLM的安全机制，并导致LLM输出有害的响应",
                }]]
            } else {
                this.showmethodInfo = this.methodInfoNoParam;
            }
            
            // 清除所有选中状态
            this.selectedMethod = [];
            this.attackMethodDescription = "";
            this.defenseMethodDescription = "";
            this.selectedAttributes = {};
            
            // 更新导航步骤为"模型"-"选择模型"
            this.updateCurrentStep(2, 0);
        },
        updateMethod(index, checked){
            // Clear existing selections first (for single-select implementation)
            this.selectedMethod = [];
            this.selectedAttributes = {};
            
            // If checked, add the new selection
            if (checked){
                this.selectedMethod.push(this.methodInfo[index].id);
                // Update the description
                this.attackMethodDescription = this.methodInfo[index].description;
            } else {
                // Clear description if no selection
                this.attackMethodDescription = "";
            }
            
            // Clear all other method cards
            for (let i = 0; i < this.methodInfo.length; i++) {
                if (i !== index) {
                    const methodCardElement = document.getElementById("methodCard" + i);
                    if (methodCardElement) {
                        methodCardElement.classList.remove('selected');
                    }
                }
            }
            
            console.log(this.selectedMethod);
            
            // 更新导航步骤为"模型"-"对抗攻击防御"，保持在当前页面
            this.updateCurrentStep(2, 0);
        },
        
        updataMethodAttributes(index, attributes_dict) {
            this.selectedAttributes[this.methodInfo[index].id] = attributes_dict;
        },
        
        changeMethods(i, j, isAttack = false) {
            let buttonId = isAttack ? "button" + i + j : "defenseBtn" + i + j;
            let button = document.getElementById(buttonId);
            if (!button) return;
            
            // 获取当前方法
            const methods = isAttack ? this.showmethodInfo : this.showdefensemethodInfo;
            const method = methods[i][j];
            
            if (isAttack) {
                // 攻击方法 - 单选模式
                if (button.style.color === "" || button.style.color === "rgb(0, 0, 0)") {
                    // 清除所有攻击方法选择
                    this.clearAllAttackMethods();
                    
                    // 选中当前方法
                    button.style.color = "#0B55F4";
                    button.style.borderColor = "#C8DCFB";
                    button.style.background = "#E7F0FD";
                    
                    // 单选模式，替换数组内容
                    this.selectedMethod = [method.name];
                    this.selectedAttributes[method.name] = {};
                    
                    // 更新攻击方法描述
                    this.attackMethodDescription = method.description;
                    
                    // 更新导航步骤为"模型"-"对抗攻击防御"
                    this.updateCurrentStep(2, 0);
                } else {
                    // 清除选中状态
                    button.style.color = "";
                    button.style.borderColor = "#C8DCFB";
                    button.style.background = "#F2F4F9";
                    button.blur();
                    this.selectedMethod = [];
                    delete this.selectedAttributes[method.name];
                    
                    // 清除攻击方法描述
                    this.attackMethodDescription = "";
                }
            } else {
                // 防御方法 - 多选模式
                if (button.style.color === "" || button.style.color === "rgb(0, 0, 0)") {
                    // 选中当前方法
                    button.style.color = "#0B55F4";
                    button.style.borderColor = "#C8DCFB";
                    button.style.background = "#E7F0FD";
                    
                    // 多选模式，添加到数组
                    if (this.selectedDefenseMethod.indexOf(method.id) === -1) {
                        this.selectedDefenseMethod.push(method.id);
                    }
                    
                    // 更新防御方法描述
                    this.defenseMethodDescription = method.description;
                    
                    // 更新导航步骤为"模型"-"对抗攻击防御"
                    this.updateCurrentStep(2, 0);
                } else {
                    // 清除选中状态
                    button.style.color = "";
                    button.style.borderColor = "#C8DCFB";
                    button.style.background = "#F2F4F9";
                    button.blur();
                    
                    // 从数组中移除
                    const index = this.selectedDefenseMethod.indexOf(method.id);
                    if (index > -1) {
                        this.selectedDefenseMethod.splice(index, 1);
                    }
                    
                    // 如果没有选中的防御方法，清除防御方法描述
                    if (this.selectedDefenseMethod.length === 0) {
                        this.defenseMethodDescription = "";
                    }
                }
            }
        },
        
        // 清除所有攻击方法选择
        clearAllAttackMethods() {
            // 清除MethodCard选择
            for (let i = 0; i < this.methodInfo.length; i++) {
                const methodId = this.methodInfo[i].id;
                const index = this.selectedMethod.indexOf(methodId);
                if (index > -1) {
                    this.selectedMethod.splice(index, 1);
                    delete this.selectedAttributes[methodId];
                }
            }
            
            // 清除无参数方法选择
            for (let i = 0; i < this.showmethodInfo.length; i++) {
                for (let j = 0; j < this.showmethodInfo[i].length; j++) {
                    let button = document.getElementById("button" + i + j);
                    if (button) {
                        button.style.color = "";
                        button.style.borderColor = "#C8DCFB";
                        button.style.background = "#F2F4F9";
                    }
                }
            }
            
            // 清除攻击方法描述
            this.attackMethodDescription = "";
        },
        
        /* 处理子步骤变化 */
        handleSubStepChange(subStepIndex) {
            const mainStep = this.defenseSteps[this.currentMainStep];
            if (mainStep && mainStep.subSteps && mainStep.subSteps[subStepIndex]) {
                const path = mainStep.subSteps[subStepIndex].path;
                this.currentSubStep = subStepIndex; 
                if (path && this.$route.path !== path) {
                    this.$router.push(path);
                }
            } else {
                console.error("Sub-step path not found for", this.currentMainStep, subStepIndex);
            }
        },
        
        /* 根据当前步骤滚动到相应的表单部分 */
        scrollToCurrentSection() {
            // Map step combinations to DOM elements to scroll to
            const mainStep = this.currentMainStep;
            const subStep = this.currentSubStep;
            
            let elementSelector = '';
            
            // 数据步骤
            if (mainStep === 0) {
                if (subStep === 0) {
                    // 选择数据集
                    elementSelector = '.mainParamNameNotop';
                } else if (subStep === 1) {
                    // 选择攻击样本
                    elementSelector = 'a-input-number.samplenumBox';
                }
            }
            // 算法步骤
            else if (mainStep === 1) {
                if (subStep === 0) {
                    // 选择攻击方法
                    elementSelector = '.mainParamName48:nth-of-type(3)';
                } else if (subStep === 1) {
                    // 选择防御方法
                    elementSelector = '.mainParamName48:nth-of-type(4)';
                }
            }
            // 模型步骤 
            else if (mainStep === 2) {
                if (subStep === 0) {
                    // 选择模型
                    elementSelector = '.mainParamName48:nth-of-type(1)';
                } else if (subStep === 1) {
                    // 评估结果
                    elementSelector = '.DataEva';
                }
            }
            
            // Scroll to the element if found
            if (elementSelector) {
                const element = document.querySelector(elementSelector);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        },
        /* 根据当前路由设置进度条状态 */
        setProgressStepsByRoute() {
            const routePath = this.$route.path;
            if (!this.defenseSteps || this.defenseSteps.length === 0) {
                console.warn("defenseSteps is not defined or empty in setProgressStepsByRoute");
                return;
            }
            for (let mainIndex = 0; mainIndex < this.defenseSteps.length; mainIndex++) {
                const mainStep = this.defenseSteps[mainIndex];
                if (mainStep.subSteps) {
                    for (let subIndex = 0; subIndex < mainStep.subSteps.length; subIndex++) {
                        const subStep = mainStep.subSteps[subIndex];
                        if (subStep.path === routePath) {
                            this.currentMainStep = mainIndex;
                            this.currentSubStep = subIndex;
                            return;
                        }
                    }
                }
            }
            // Default for this page if no specific sub-step matches
            if (routePath.includes('/advAttackDefense')) {
                this.currentMainStep = 2; // 模型 - keeping at index 2 to match both files
                this.currentSubStep = 0; // 对抗攻击防御
            } else {
                // Fallback if route not found
                this.currentMainStep = 0; 
                this.currentSubStep = 0;
            }
        },
        
        // 处理详细攻击方法卡片的选择
        changeDetailMethod(index) {
            // 获取当前按钮
            let currentButton = document.getElementById("methodCard" + index);
            if (!currentButton) return;
            
            const methodId = this.methodInfo[index].id;
            const isCurrentlySelected = currentButton.style.color === "rgb(11, 85, 244)" || 
                                      currentButton.style.color === "#0B55F4";
            
            // 无论是选择还是取消选择，都先清除所有选择
            this.resetAllMethodButtons();
            
            // 如果当前不是选中状态，则选中
            if (!isCurrentlySelected) {
                currentButton.style.color = "#0B55F4";
                currentButton.style.borderColor = "#C8DCFB";
                currentButton.style.background = "#E7F0FD";
                this.attackMethodDescription = this.methodInfo[index].description;
                // 添加到选择数组 - 单选模式只保存一个方法ID
                this.selectedMethod = [methodId];
            }
        },
        
        // 重置所有攻击方法按钮状态
        resetAllMethodButtons() {
            // 1. 重置详细方法卡片按钮
            for (let i = 0; i < this.methodInfo.length; i++) {
                let btn = document.getElementById("methodCard" + i);
                if (btn) {
                    btn.style.color = "";
                    btn.style.borderColor = "#C8DCFB";
                    btn.style.background = "#F2F4F9";
                }
            }
            
            // 2. 重置无参数方法按钮
            for (let i = 0; i < this.showmethodInfo.length; i++) {
                for (let j = 0; j < this.showmethodInfo[i].length; j++) {
                    let btn = document.getElementById("button" + i + j);
                    if (btn) {
                        btn.style.color = "";
                        btn.style.borderColor = "#C8DCFB";
                        btn.style.background = "#F2F4F9";
                    }
                }
            }
            
            // 3. 清空选择数组
            this.selectedMethod = [];
            this.selectedAttributes = {}; // 清空参数对象
        },
        
        // 处理详细攻击方法卡片的鼠标悬停
        methodDetailOver(index) {
            if (index < this.methodInfo.length) {
                this.attackMethodDescription = this.methodInfo[index].description;
            }
        },
        
        // 处理详细攻击方法卡片的鼠标离开
        methodDetailLeave() {
            if (this.selectedMethod.length === 0) {
                this.attackMethodDescription = "";
            } else {
                const currentSelectedAttackIdOrName = this.selectedMethod[0]; // This can be an ID or a Name
                let description = "";
                
                // Try to find in methodInfo (parameterized attack methods, selected by ID)
                const selectedParameterizedMethod = this.methodInfo.find(m => m.id === currentSelectedAttackIdOrName);
                if (selectedParameterizedMethod) {
                    description = selectedParameterizedMethod.description;
                } else {
                    // Try to find in showmethodInfo (non-parameterized attack methods, selected by Name)
                    // Note: showmethodInfo is initialized based on model type, potentially from methodInfoNoParam
                    let baseAttackMethods = this.methodInfoNoParam; // Default to methodInfoNoParam
                    if (this.modelInfo[this.selectedModel] && this.modelInfo[this.selectedModel].name == "Vicuna-7B-v1.1") {
                         // If it's Vicuna, showmethodInfo is custom. We need to handle this.
                         // For simplicity, if LLM-Attacks is selected, its description should be used.
                         if (currentSelectedAttackIdOrName === "LLM-Attacks" && this.showmethodInfo.length > 0 && this.showmethodInfo[0].length > 0) {
                            description = this.showmethodInfo[0][0].description;
                         }
                    } else {
                        // Iterate through methodInfoNoParam which populates showmethodInfo for non-LLM models
                        for (const methodGroup of baseAttackMethods) {
                            const selectedNonParameterizedMethod = methodGroup.find(m => m.name === currentSelectedAttackIdOrName);
                            if (selectedNonParameterizedMethod) {
                                description = selectedNonParameterizedMethod.description;
                                break;
                            }
                        }
                    }
                }
                this.attackMethodDescription = description;
            }
        },
    },
    computed: {
        // Return defense steps with the three main categories: 数据, 算法, 模型
        defenseSteps() {
            return [
                {
                    title: '数据',
                    subSteps: [
                        { title: '对抗性数据生成', path: '/advAttack' }
                    ]
                },
                {
                    title: '算法',
                    subSteps: [
                        { title: '对抗性训练算法', path: '/robust_advTraining' }
                    ]
                },
                {
                    title: '模型',
                    subSteps: [
                        { title: '对抗攻击防御', path: '/advAttackDefense' }
                    ]
                }
            ];
        }
    },
}
</script>
<!-- <style  scoped> -->
<style scoped>
.paramCon {
    width: 1200px;
    margin-left: 360px;
}
.paramTitle {
    height: 80px;
    padding: 20px 24px 20px 26px;
    text-align: left;
    width: 1200px;
    font-size: 18px;
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
    font-family: 'HONOR Sans CN';
    font-size: 24px;
    color: #333333;
    letter-spacing: 0;
    line-height: 48px;
    font-weight: 600;
}

/* 按钮样式 */
.DataEva {
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
    height:50px;
    color:#000;
    border:1px solid #C8DCFB;
    text-align: center;
    font-family: HONOR Sans CN;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 28px; 
}

.denfenseMethod .ant-btn:hover{
    color: #0B55F4;
    border-color: #C8DCFB;
    background: #E7F0FD;
}

.methodDescription {
    background-color: #F9FAFC;
    border-radius: 4px;
    padding: 14px 24px;
    margin-bottom: 24px;
    color: #666;
    font-size: 14px;
    line-height: 22px;
}

.ant-divider-horizontal {
    margin: 0 0;
}

.samplenumBox{ 
    background-color: #F2F4F9;
    font-size: 18px;
    width: 100%;
}

/* Added styles for layout */
.main-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 40px;
    position: relative;
}

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
/* End of added styles */
</style>
