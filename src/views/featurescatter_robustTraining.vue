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
                <div class="labelSelection">
                    <router-link to="/robust_advTraining"><button class="labelunselected">对抗鲁棒训练</button></router-link>
                    <router-link to="/gcn_robustTraining"><button class="labelunselected">可认证鲁棒性训练</button></router-link>
                    <router-link to="/featurescatter_robustTraining"><button class="labelselected">特征散射鲁棒性训练</button></router-link>
                    <router-link to="/seat_robustTraining"><button class="labelunselected">自我整合鲁棒性训练</button></router-link>
                    <router-link to="/smoothing_robustTraining"><button class="labelunselected">关键参数微调鲁棒性训练</button></router-link>
                </div>
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
                        <div class="datasetSelected">
                            <p class="mainParamNameNotop">请选择数据集</p>
                            <a-radio-group v-model="datasetChoice" @change="onDatasetChoiceChange">
                                <a-radio :style="radioStyle" value="CIFAR10" >CIFAR10</a-radio>
                                <div class="matchedDes" v-show="datasetChoice=='CIFAR10'">
                                    <p class="matchedMethodText"><span>CIFAR10数据集：</span>是由 Hinton 的学生 Alex Krizhevsky 和 Ilya Sutskever 整理的一个用于识别普适物体的小型数据集。一共包含 10 个类别的 RGB 彩色图 片：飞机（ airplane ）、汽车（ automobile ）、鸟类（ bird ）、猫（ cat ）、鹿（ deer ）、狗（ dog ）、蛙类（ frog ）、马（ horse ）、船（ ship ）和卡车（ truck ）。图片的尺寸为 32×32 ，数据集中一共有 50000 张训练圄片和 10000 张测试图片。</p>
                                    <p class="matchedMethodText">图例：</p>
                                    <div class="demoData" >
                                        <div v-for="(item, index) in CIFAR10_imgs" :key="index">
                                            <img :src="item.imgUrl">
                                        </div>
                                    </div>
                                </div>
                                <a-radio :style="radioStyle" value="CIFAR100" >CIFAR100</a-radio>
                                <div class="matchedDes" v-show="datasetChoice=='CIFAR100'">
                                    <p class="matchedMethodText"><span>CIFAR100数据集：</span>CIFAR10数据集是CIFAR100数据集的子集。与CIFAR10类似，它有100个类，每个类包含600个图像，600个图像中有500个训练图像和100个测试图像。100类实际是由20个类(每个类又包含5个子类)构成。</p>
                                    <p class="matchedMethodText">图例：</p>
                                    <div class="demoData" >
                                        <div v-for="(item, index) in CIFAR10_imgs" :key="index">
                                            <img :src="item.imgUrl">
                                        </div>
                                    </div>
                                </div>
                                <a-radio :style="radioStyle" value="SVHN"> SVHN10 </a-radio>
                                <div class="matchedDes" v-show="datasetChoice=='SVHN'">
                                    <p class="matchedMethodText"><span>SVHN10数据集：</span>是一个街景房屋号码数据集，该数据集来源于谷歌街景门牌号码。原生的数据集1(Format 1)是一些原始的未经处理的彩色图片，Format2 将这些数字裁剪成32x32的大小，包含10个类，73257位用于训练，26032位用于测试，531131 个额外的、难度稍低的样本，用作额外的训练数据。</p>
                                    <p class="matchedMethodText">图例：</p>
                                    <div class="demoData" >
                                        <div v-for="(item, index) in SVHN10_imgs" :key="index">
                                            <img :src="item.imgUrl">
                                        </div>
                                    </div>
                                </div>
                            </a-radio-group>
                        </div>
                        <div class="modelSelected">
                            <p class="mainParamName">请选择模型</p>
                            <a-radio-group v-model="modelChoice" @change="onModelChoiceChange">
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="ResNet" >ResNet</a-radio>
                                    <a-radio :style="radioStyle" value="LeNet" >LeNet</a-radio>
                                    <a-radio :style="radioStyle" value="Vgg" >VggNet</a-radio>
                                    <a-radio :style="radioStyle" value="WideResNet" >WideResNet</a-radio>
                                </div>
                            </a-radio-group>
                        </div>
                        <div class="modelSelected">
                            <p class="mainParamName">请选择对抗训练方法</p>
                            <a-select
                                style="width: 1104px;"
                                v-model="advChoice"
                                @focus="handleFocus"
                                @blur="handleBlur"
                                @change="onAdvChoiceChange">
                                <a-select-option v-for="temp in advTrainMethod" :value="temp">
                                {{ temp }}
                                </a-select-option>
                            </a-select>
                        </div>
                        <div class="thresholdSet">
                            <p class="mainParamName">请输入选择评估算法（可多选）</p>
                            <div v-for="(methods, i) in showmethodInfo" :key="i" style="margin-bottom: 16px;">
                                <a-row :gutter="16" style="height:50px;" type="flex">
                                    <a-col :flex="24 / methods.length" v-for="(method, j) in methods" :key="j" class="denfenseMethod">
                                        <a-button :id="'button' + i + j"  @click="changeMethods(i,j)"
                                            >{{ method.name }}</a-button>
                                    </a-col>
                                </a-row>
                                <div v-if="methodHoverIndex==i && methodDescription !== ''" style="padding:14px 24px;margin: 16px auto; "> {{ methodDescription }} </div>
                            </div>
                        </div>
                        <div class="modelSelected">
                            <p class="mainParamName">请设置训练参数</p>
                            <div class="paramsSelected">
                                <div>
                                    <p class="matchedMethodText paramblock">学习率：</p> 
                                    <el-input-number :min="0" :max="1" :step="0.1" v-model="lr"></el-input-number>
                                </div>
                                <div>
                                    <p class="matchedMethodText paramblock">最大训练轮数：</p> 
                                    <el-input-number :min="1" :max="200"  v-model="maxiter"></el-input-number>
                                </div>
                                <div>
                                    <p class="matchedMethodText paramblock">学习率衰减的轮数：</p> 
                                    <el-input-number :min="4" :max="100"  v-model="lr_decayiter"></el-input-number>
                                </div>
                                <div>
                                    <p class="matchedMethodText paramblock">学习率衰减的速率：</p> 
                                    <el-input-number :min="0" :max="1" :step="0.1" v-model="lr_decayspd"></el-input-number>
                                </div>
                                <div>
                                    <p class="matchedMethodText paramblock">批量大小：</p> 
                                    <el-input-number :min="1" :max="1000" v-model="batchsize"></el-input-number>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 日志展示 -->
            <div v-if="logflag">
                <showLog :percent="percent" :logtext="logtext"></showLog>
            </div>
            <!-- 结果展示 -->
            <resultDialog  @on-close="closeDialog" 
               :isShow="isShowPublish" 
               v-show="isShowPublish"
               ref="report_pdf"
               >
                <div slot="header">
                    <div class="dialog_title">
                        <img class="paramIcom" :src="funcDesText.imgpath" :alt="funcDesText.name">
                        <h1>特征散射鲁棒性训练</h1>
                    </div>
                </div>
                <div class="dialog_publish_main" slot="main" id="pdfDom">
                    <!-- 图表 -->
                    <div class="result_div">
                        <div class="conclusion_info">
                            <!-- 显示输入信息：检测类型、数据集/清洗类型 -->
                            <p class="result_annotation">数据集：{{ datasetChoice }}</p>
                            <p class="result_annotation">模型：{{ modelChoice }}</p>
                            <p class="result_annotation">学习率：{{ lr }}</p>
                            <p class="result_annotation">学习率衰减的轮数：{{ lr_decayiter }}</p>
                            <p class="result_annotation">学习率衰减的速率：{{ lr_decayspd }}</p>
                            <p class="result_annotation">最大训练轮数：{{ maxiter }}</p>
                            <p class="result_annotation">训练时的批量大小：{{ batchsize }}</p>
                        </div>
                        <div class=" main_top_echarts_con_title ">特征散射鲁棒性训练效果</div>
                        <div id="rdeva">
                            <div style="width: 800px; height: 500px;" id="adv_robust_result"></div>
                            <div class="conclusion">
                                <p class="result_text">{{ modelChoice }}模型、{{ datasetChoice }}数据集，用Feature Scatter方法进行模型鲁棒性训练后模型鲁棒性增强。</p>
                            </div>
                        </div>
                    </div>
                    <a-button @click="getPdf()" style="width:160px;height:50px;margin-bottom:30px;margin-top:10px;
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
/* 引入组件，日志显示 */
import showLog from "../components/showLog.vue"
/* 引入组件，结果显示 */
import resultDialog from "../components/resultDialog.vue"
/* 引入自定义js，结果显示 */

/* 引入图片 */
import funcicon from "../assets/img/robustTrainingIcon.png"
import bgimg from "../assets/img/modelEvaBackground.png"
import { DrawRobustBar } from '../assets/js/drawEcharts'

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
    name:"coverage_layer",
    components:{
        /* 注册组件 */
    navmodule: navmodule,
    func_introduce: func_introduce,
    showLog: showLog,
    resultDialog: resultDialog,
    selectIcon, DrawRobustBar
    },
    data(){
        return{
            htmlTitle:"特征散射鲁棒性训练",
            /* 单选按钮样式 */
            methodHoverIndex:-1,
            methodDescription:"",
            radioStyle: {
                display: 'block',
                lineHeight: '30px',
            },
            datasetChoice: "CIFAR10",
            MNIST_imgs:[
                {imgUrl:require('../assets/img/mnist0.jpg'),name:'mnist0'},
                {imgUrl:require("../assets/img/mnist1.jpg"),name:'mnist1'},
                {imgUrl:require("../assets/img/mnist2.jpg"),name:'mnist2'},
                {imgUrl:require("../assets/img/mnist3.jpg"),name:'mnist3'},
                {imgUrl:require("../assets/img/mnist4.jpg"),name:'mnist4'},
                {imgUrl:require("../assets/img/mnist5.jpg"),name:'mnist5'},
                {imgUrl:require("../assets/img/mnist6.jpg"),name:'mnist6'},
                {imgUrl:require("../assets/img/mnist7.jpg"),name:'mnist7'},
                {imgUrl:require("../assets/img/mnist8.jpg"),name:'mnist8'},
                {imgUrl:require("../assets/img/mnist9.jpg"),name:'mnist9'},
                ],
            CIFAR10_imgs:[
                {imgUrl:require('../assets/img/cifar100.jpg'),name:'mnist0'},
                {imgUrl:require("../assets/img/cifar101.jpg"),name:'mnist1'},
                {imgUrl:require("../assets/img/cifar102.jpg"),name:'mnist2'},
                {imgUrl:require("../assets/img/cifar103.jpg"),name:'mnist3'},
                {imgUrl:require("../assets/img/cifar104.jpg"),name:'mnist4'},
                {imgUrl:require("../assets/img/cifar105.jpg"),name:'mnist5'},
                {imgUrl:require("../assets/img/cifar106.jpg"),name:'mnist6'},
                {imgUrl:require("../assets/img/cifar107.jpg"),name:'mnist7'},
                {imgUrl:require("../assets/img/cifar108.jpg"),name:'mnist8'},
                {imgUrl:require("../assets/img/cifar109.jpg"),name:'mnist9'},
                ],
            SVHN10_imgs:[
                {imgUrl:require('../assets/img/ex10.png'),name:'svhn0'},
                {imgUrl:require("../assets/img/ex1.png"),name:'svhn1'},
                {imgUrl:require("../assets/img/ex2.png"),name:'svhn2'},
                {imgUrl:require("../assets/img/ex3.png"),name:'svhn3'},
                {imgUrl:require("../assets/img/ex4.png"),name:'svhn4'},
                {imgUrl:require("../assets/img/ex5.png"),name:'svhn5'},
                {imgUrl:require("../assets/img/ex6.png"),name:'svhn6'},
                {imgUrl:require("../assets/img/ex7.png"),name:'svhn7'},
                {imgUrl:require("../assets/img/ex8.png"),name:'svhn8'},
                {imgUrl:require("../assets/img/ex9.png"),name:'svhn9'},
                ],
            modelChoice: "ResNet",
            advChoice: 'FGSM',
            advTrainMethod:['FGSM', "PGD","CW",],
            selectedMethod:[],
            // selectedAttributes:"",
            showmethodInfo:[[
            {name:"Natural",description:"没有对抗攻击的测试方法，只做分类准确率计算",},
            {name:"FGSM",description:"FGSM算法:快速梯度符号法是一种简单而有效的生成对抗样本的方法，其工作方式如下：在给定输入数据后，利用已训练的模型输出预测并计算损失函数的梯度，然后使用梯度的符号来创建使损失最大化的新数据",},
            {name:"PGD",description:"PGD算法：Projected Gradient DescentPGD投影梯度下降法是FGSM的迭代版本，该方法思路和BIM基本相同，不同之处在于该方法在迭代过程中使用范数投影的方法来约束非法数据，并且相对于BIM有一个随机的开始噪声",},
            {name:"CW",description:"C&W算法：该方法的出发点是攻击比较有名的对抗样本防御方法-防御蒸馏(就防御蒸馏方法而言，它在基本的L-BFGS，FGSM攻击方法上表现本身就比较差)。对于寻找对抗样本过程中目标函数的设置将会极大的影响对抗样本的攻击效果，为此，通过目标函数的设定，在零范数，二范数和无穷范数的限制下分别设计了三种不同的寻找对抗样本的目标函数，这三种方法均可以绕过防御蒸馏的防御",},
                ]],
            lr:0.1,
            maxiter:120, //200
            lr_decayiter:60,
            lr_decayspd:0.1,
            batchsize:128,
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
                name:"模型鲁棒性训练",
                /* 功能icon，需先引入 */
                imgpath:funcicon,
                /* 功能背景图片，需先引入 */
                bgimg:bgimg,
                /* 功能介绍下的总介绍 */
                destext:"提升模型在对抗样本攻击下的鲁棒性",
                /* 背景介绍 */
                backinfo:"对抗攻击对于模型危害巨大，轻则造成模型失效，重则影响人工智能安全性。通过可认证鲁棒训练、对抗训练等方式来对AI模型进行安全加固，提升模型在对抗样本攻击下的鲁棒性。",
                /* 亮点介绍 */
                highlight:[
                    "鲁棒性训练方法5种，满足多任务类型模型的鲁棒性提升需求；",
                    "面向GCN的可认证鲁棒训练，能够有效提升图神经网络模型的鲁棒性；",
                    "面向CNN的对抗训练、基于特征散射的鲁棒性训练、基于异常感知的鲁棒性训练以及基于随机平滑的鲁棒性训练，能够有效提升卷积神经网络的鲁棒性。"
                ]
            },
            /* 结果弹窗状态信息 */
            isShowPublish:false,
            /* 评估结果 */
            result:{},
            res_tmp:{},
            /* 主任务id */ 
            tid:"",
            /* 子任务id */ 
            stidlist:"",
            /* 异步任务结果查循环clock */
            clk:"",
            /* 日志查询clock*/
            logclk:"", 
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
        }
    },
    created() {
        document.title = '模型鲁棒性训练';
        },
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
        closeDialog(){
            this.isShowPublish=false;
            //把绑定的弹窗数组 设为false即可关闭弹窗
        },
        onDatasetChoiceChange(e){
            // 修改选择数据集
            console.log('radio checked', e.target.value);
        },
        onModelChoiceChange(e){
            // 修改选择模型
            console.log('radio checked', e.target.value);
        },
        onAdvChoiceChange(e){
            // debugger
            console.log('radio checked', e);
        },
        handleBlur() {
            console.log('blur');
        },
        handleFocus() {
            console.log('focus');
        },
        // 攻击方法点击选中
        changeMethods(i, j) {
            let button = document.getElementById("button" + i + j)
            if (button.style.color == "") {
                this.methodHoverIndex = i
                this.methodDescription = this.showmethodInfo[i][j].description
                button.style.color = "#0B55F4"
                button.style.borderColor = "#C8DCFB"
                button.style.background = "#E7F0FD"
                this.selectedMethod.push(this.showmethodInfo[i][j].name)
                // this.selectedAttributes[this.showmethodInfo[i][j].name] = {}
            } else {
                this.methodHoverIndex = -1
                this.methodDescription = ""
                button.style.color = ""
                button.style.borderColor = "#C8DCFB"
                button.style.background = "#F2F4F9"
                button.blur()
                this.selectedMethod.splice(this.selectedMethod.indexOf(this.showmethodInfo[i][j].name), 1 )
                // delete this.selectedAttributes[this.showmethodInfo[i][j].name]
            }
        },
        exportResult(){
            if (confirm("您确认下载该pdf文件吗？") ){
                var element = document.getElementById("download_page");
                const opt = {
                    margin:[10, 20, 10, 20],
                    filename:this.tid+'.pdf',
                    image:{type:'jpeg',quality:1},
                    html2canvas:{scale:5},
                    jsPDF:{unit:'mm',format:'a4', orientation:'portrait'}
                };
                html2pdf().from(element).set(opt).save();
            }
        },
        /* result 处理*/
        resultPro(res){
            debugger;
            let data = res.FeatureScatter;
            let legend = ["Normal Training", "Robust Training"];
            let xAxis = Object.keys(data.feature_scatter);
            let data_ori = [];
            let data_fs = [];
            for(let i in xAxis){
                data_ori.push(data.normal_train[xAxis[i]]);
                data_fs.push(data.feature_scatter[xAxis[i]]);
            }
            DrawRobustBar('adv_robust_result', legend, xAxis, data_ori, data_fs);
        },
        /* 获取结果 */ 
        getData(){
            // debugger
            var that = this;
            that.$axios.get('/output/Resultdata', {params:{ Taskid: that.tid }}).then((data)=>{
                console.log("dataget:",data);
                // that.result=data;
                that.res_tmp = data;
            });
        },
        /* 获取日志 */ 
        getLog(){
            // debugger;
            var that = this;
            if (that.percent<99){
                that.percent+=1;
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
            // debugger;
            // var that = this;
            if (this.res_tmp.data.stop==1  && this.tid == this.res_tmp.data.result.tid) {
                // 关闭日志显示
                this.percent=100
                this.logflag = false;
                // 关闭结果数据获取data
                window.clearInterval(this.clk);
                // 关闭日志获取结果获取
                window.clearInterval(this.logclk);
                // 显示结果窗口
                this.isShowPublish = true;
                // 处理结果
                // console.log(this.result.data.result)
                this.resultPro(this.res_tmp.data.result);
            }
        },
        /* 更新结果*/ 
        update(){
            // debugger;
            this.getData();
            try{
                this.stopTimer();
            }catch(err){}
        },
        /* 点击评估触发事件 */
        dataEvaClick(){
            /* 备份 */ 
            var that = this;
            if(that.selectedMethod.length==0){
                that.$message.warning('请至少选择一项评估算法！',3);
                return
            }
            // that.tid = "20231130_1553_7208602";
            // that.stidlist =  {"FeatureScatter":"S20231130_1553_1fd2cee"};
            // that.clk = window.setInterval(() => {
            //     that.update();
            // }, 300)
            //     return
            /* 调用创建主任务接口，需开启后端程序 */
            this.$axios.post("/Task/CreateTask",{AttackAndDefenseTask:0}).then((result) => {
                that.tid = result.data.Taskid;
                /* 请求体 postdata*/
                const postdata={
                    dataset:that.datasetChoice,
                    modelname:that.modelChoice,
                    attack_method: that.advChoice,
                    evaluate_methods:that.selectedMethod,
                    lr: that.lr,
                    batch_size: that.batchsize,
                    max_epoch: that.maxiter,
                    decay_epoch: that.lr_decayiter,
                    decay_rate: that.lr_decayspd,
                    tid:that.tid};
                that.$axios.post("/Defense/AdvTraining_FeatureScatter", postdata).then((res) => {
                    that.logflag = true;
                    // 异步任务
                    that.stidlist =  {"FeatureScatter":res.data.stid}
                    that.logclk = window.setInterval(that.getLog, 3000);
                    that.clk = window.setInterval(that.update, 3000);
                }).catch((err) => {
                        console.log(err)
                });
            }).catch((err) => {
                console.log(err)
            });    
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
.funcParam{
/* 单神经元覆盖准则 */
box-sizing: border-box;
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
width: 1200px;
height: 824px;
background: #FFFFFF;
border: 1px solid #E0E3EB;
margin: 30px 0px 40px 0px;
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
.datasetSelected{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    /* gap: 16px; */
    width: 1104px;
    /* height: 228px; */
    /* Inside auto layout */
    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
}
.matchedDes{
    display: flex;
    flex-direction: column;
    /* align-items: flex-start; */
    padding: 0px;
    width: 1104px;
    /* height: 106px; */
    border-radius: 4px;
    /* Inside auto layout */
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}

.paramsSelected{
    display: flex;
    flex-wrap: wrap;
    gap: 8%;
}

.matchedMethodText{
    /* display: flex; */
    display: block;
    flex-direction: column;
    align-items: flex-start;
    padding: 12px 24px;
    width: 1104px;
    /* height: 46px; */
    height:auto;
    font-family: 'HONOR Sans CN';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: #3E4453;
    margin-bottom: 0px;
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}
.matchedMethodText span{
    color:#0B55F4
}

.paramblock {
    width: 220px;
    padding: 12px 0px;
}

.demoData{
    display: flex;
    margin-left: 20px;
    gap: 10px;
    /* justify-content: space-around; */
    margin-bottom: 20px;
}
.demoData img{
    /* position: absolute; */
    width: 64px;
    height: 64px;
    left: 0px;
    top: 0px;
    /* background: url(../assets/img/mnist1.jpg); */
}

.modelSelected{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    /* gap: 16px; */
    width: 1104px;
    /* height: 228px; */
    /* Inside auto layout */
    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
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
.conclusion_info{
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    flex-wrap: wrap;
    align-items: center;
    padding: 20px;
    gap: 25px;
    margin-bottom: 20px;
    width: 1080px;
    /* gray-7 */

    background: #F2F4F9;
    border-radius: 4px;
}

.result_div{
    margin-top: 0;
}

.title_annotation{
    /* width: 217px;
    height: 24px; */

    font-family: 'HONOR Sans CN';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    /* identical to box height, or 150% */

    display: flex;
    align-items: center;
    text-align: center;

    /* Untitled/gray-1 */

    color: #000000;


    /* Inside auto layout */

    flex: none;
    order: 0;
    flex-grow: 0;
}

.resultchart{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 24px;
    isolation: isolate;
    margin-bottom: 10px;
    width: 960px;
    height: auto;
    flex: none;
    order: 1;
    flex-grow: 0;
}

.dialog_publish_main{
align-items: center;
flex-direction: column;
position: absolute;
display: flex;
width: 1080px;
height: fit-content;
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
    /* height: 414px; */
    height: auto;
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
