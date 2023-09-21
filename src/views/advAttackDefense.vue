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
                            <div class="mainParamName48">请选择攻击方法</div>
                            <MethodCard style="width: 1104px; " v-for="(info, index) in methodInfo" :key="'Method' + index"
                                v-bind="info" :indexInParent="index" @selectMethod="changeAdvMethod" :checked="index == advMethod">
                            </MethodCard>
                            <div class="mainParamName48">请输入攻击样本数</div>
                            <a-input class="samplenumBox" v-model="sampleNum" style="height: 60px;padding:16px 24px;" placeholder="请在此输入攻击样本数，（输入范围1-10000，建议值50）" />

                            <div class="mainParamName48">请选择防御方法（可多选）</div>

                            <div v-for="(methods, i) in showdefensemethodInfo" :key="i" style="margin-bottom: 16px;">
                                <a-row :gutter="16" style="height:60px" type="flex">
                                    <a-col :flex="24 / methods.length" v-for="(method, j) in methods" :key="j" class="denfenseMethod" >
                                        <a-button :id="'button' + i + j"  @click="changeMethods(i,j)"
                                            @mouseover="methodButtonOver(i, j)"
                                            @mouseleave="methodnButtonLeave(i, j)"
                                            >{{ method.name }}</a-button>
                                    </a-col>
                                </a-row>
                                <div v-if="methodHoverIndex==i" style="padding:14px 24px;margin-bottom: 16px;"> {{ methodDescription }} </div>
                            </div>

                            <!-- <div style="margin-bottom: 20px;"></div> -->

                            <AdvAttackDefenseEval :is-show="resultVisible" :result="result" :postData="postData" @on-close="() => { resultVisible = !resultVisible }">
                            </AdvAttackDefenseEval>
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
    name: "advAttack",
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
    },
    data() {
        return {
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
                imgpath: funcicon,
                /* 功能背景图片，需先引入 */
                bgimg: bgimg,
                /* 功能介绍下的总介绍 */
                destext: "对抗攻击防御包括样本检测、噪声擦除和模型防御增强等，从多角度阻截对抗攻击",
                /* 背景介绍 */
                backinfo: "对抗攻击的原理是攻击者通过在源数据上增加人类难以通过感官辨识的细微改变，从而让深度学习模型接受并做出错误的分类决定，对抗攻击防御从对抗样本检测、对抗噪声擦除和模型防御力增强三个角度出发阻截对抗样本攻击，并使神经网络模型在面对对抗样本时仍能发挥正常功能。",
                /* 亮点介绍 */
                highlight: [
                    "对抗样本检测技术：样本检测算法包括Twis、Feature Squeezing、Spatial Smoothing等主流检测算法，有效检出数据集中的对抗样本",
                    "对抗噪声擦除技术：噪声擦除算法包括Region-based Classification、InverseGAN、JPEG Compression等9种算法，高效抵御对抗攻击",
                    "模型防御力增强技术：模型防御里增强包括CARTL、TRADES、FreeAT、FastAT等主流的6种对抗训练方法，提高模型对对抗样本的防御能力"
                ]
            },
            /* 评估结果 */
            result: {},
            /* 主任务id */
            tid: "",
            /* 子任务id */
            stid: {},
            /* 日志查询clock*/
            logclk: "",
            // 数据集信息
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
            selectedDataset: 0,
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
            selectedModel: 0,
            methodInfo: [
                {
                    name: "FGSM",
                    description: "Fast Gradient Sign MethodFGSM快速梯度符号法是一种简单而有效的生成对抗样本的方法，其工作方式如下：在给定输入数据后，利用已训练的模型输出预测并计算损失函数的梯度，然后使用梯度的符号来创建使损失最大化的新数据",
                    attributes:[]
                },
                {
                    name: "PGD",
                    description: "Projected Gradient Descent (PGD) 攻击的原理是利用梯度下降法来最大化对模型的分类错误。在PGD攻击中，首先选择一个输入样本作为初始值，然后对其进行多次修改，使得分类模型的错误最大化",
                    attributes:[]
                },
                {
                    name: "BPDA",
                    description: "Backward Pass Differentiable Approximation（BPDA）攻击的原理是在前向传播中使用非可微的操作，但在反向传播中将其替换为可微的近似操作，以估算对抗样本的梯度，从而最大化对模型的分类错误",
                    attributes:[]
                },
            ],
            advMethod:0,
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
            sampleNum:"",
            selectedDefenseMethod: [],
            methodDescription:"",
            resultVisible: false,
            methodHoverIndex: -1,
            postData:{},
            maxRate:0,
            maxMethod:"",
        }
    },
    watch: {
        /* 判断弹框是否显示，如果true显示结果弹框，并且底层滚动取消*/
        isShowPublish: {
            immediate: true,
            handler(v) {
                if (v) {
                    this.noScroll();
                } else {
                    this.canScroll();
                }
            }
        }
    },
    created() {
       document.title = '对抗攻击防御';
       this.showdefensemethodInfo = this.defensemethodInfo
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
            this.isShowPublish = false;
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
                    adv_method: that.methodInfo[that.advMethod].name,
                    adv_nums: that.sampleNum,
                    defense_methods: that.selectedDefenseMethod,
                    tid: that.tid
                };
                console.log(this.postData)
                that.$axios.post("/detect", that.postData).then((res) => {
                    that.result = res.data;
                    window.clearInterval(that.logclk);
                    that.stid['advAttackDefense'] =  res.data.stid
                    that.getLog();
                    let label=[];
                    let rateList=[];
                    let noDefenseACC=[];
                    let maxRate = 0;
                    let maxMethod="";
                    let ATDefenseACC=[];
                    let ATlabels=[];
                    let ATMaxRate=0;
                    let ATMaxMethod='';
                    const ATMethod = ["Madry","TRADES","FreeAT","FastAT","CARTL","MART"];
                    for (let temp in that.result.detect_rates){
                        if (ATMethod.indexOf(temp) == -1){
                            if (maxRate < that.result.detect_rates[temp]){
                                maxMethod = temp
                                maxRate = that.result.detect_rates[temp]
                            }
                            label.push(temp);
                            rateList.push(that.result.detect_rates[temp])
                            
                        }else{
                            if (ATMaxRate < that.result.detect_rates[temp]){
                                ATMaxMethod = temp
                                ATMaxRate = that.result.detect_rates[temp]
                            }
                            ATlabels.push(temp);
                            noDefenseACC.push(that.result.no_defense_accuracy)
                            ATDefenseACC.push(that.result.detect_rates[temp])
                        }
                        
                    }
                    that.result.maxRate = maxRate;
                    that.result.maxMethod = maxMethod;
                    that.result.ATMaxRate = ATMaxRate;
                    that.result.ATMaxMethod = ATMaxMethod;
                    that.result.detect_labels = label;
                    that.result.detect_ratelist = rateList;
                    that.result.ATlabels = ATlabels;
                    that.result.ATDefenseACClist = ATDefenseACC;
                    that.result.noDefenseACClist = noDefenseACC;
                    
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
        },
        // 更换模型
        changeModel(index) {
            this.selectedModel = index
        },
        // 更新方法参数
        changeAdvMethod(index){
            console.log(index)
            this.advMethod=index;
            if (this.methodInfo[this.advMethod].name == 'BPDA'){
                this.showdefensemethodInfo = [[{
                        name:"Pixel Defend",
                        id:"Pixel Defend",
                        description:"通过将恶意扰动的图像移回训练数据中的分布来去噪。PixCNN是专为图像像素分布设计的一个自回归生成模型，该模型用条件概率分布的乘积来定义所有像素上的联合分布。利用PixCNN把对抗样本的分布移回到正常样本的分布，以实现去噪",
                    },
                    {
                        name:"Pixel Defend Enhanced",
                        id:"Pixel Defend Enhanced",
                        description:"防御方法的原理是将正常训练的模型替换为对抗训练的模型，然后使用Pixel Defend对输入进行变换以防御BPDA攻击。",
                    }]]
            }else{
                this.showdefensemethodInfo = this.defensemethodInfo
            }
        },
        methodButtonOver(i, j) {
            // let button = document.getElementById("button" + i + j)
            // button.style.background = "lightblue"
        },
        methodnButtonLeave(i, j) {
            // let button = document.getElementById("button" + i + j)
            // button.style.background = "#F2F4F9"
        },
        // 防御方法点击选中
        changeMethods(i, j) {
            let button = document.getElementById("button" + i + j)
            if (button.style.color == "") {
                this.methodHoverIndex = i
                this.methodDescription = this.showdefensemethodInfo[i][j].description
                button.style.color = "#0B55F4"
                button.style.borderColor = "#C8DCFB"
                button.style.background = "#E7F0FD"
                this.selectedDefenseMethod.push(this.showdefensemethodInfo[i][j].id)
            } else {
                this.methodHoverIndex = -1
                this.methodDescription = ""
                button.style.color = ""
                button.style.borderColor = "#C8DCFB"
                button.style.background = "#F2F4F9"
                button.blur()
                this.selectedDefenseMethod.splice(this.selectedDefenseMethod.indexOf(this.showdefensemethodInfo[i][j].id), 1 )
            }
        },
    }
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
    height:60px;
    color:#000;
    border:0px;
    text-align: center;
    font-family: HONOR Sans CN;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 28px; 
}

.ant-divider-horizontal {
    margin: 0 0;
}


.samplenumBox{ 
    background-color: #F2F4F9;
    font-size: 18px;
}
</style>
