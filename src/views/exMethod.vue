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
                        <DataSetCard style="width: 1104px; margin-bottom: 16px;" 
                            v-for="(info, index) in dataSetInfo" :key="'Dataset' + index" 
                            v-bind="info"
                            :indexInParent="index"
                            @selectDataset="changeDataset"
                            :checked="index == selectedDataset">
                        </DataSetCard>
                        <div class="mainParamName48">请选择模型</div>
                        <div style="width: 1104px;margin-bottom: 16px;">
                            <a-upload 
                            action="/ex/uploadModel"
                            name="ex_upload_model"
                            
                            @change="uploadModel">
                            <div class="uploadModelStyle" >请上传模型</div>
                            </a-upload>
                        </div>
                        <ModelCard style="width: 1104px; margin-bottom: 16px;"
                            v-for="(info, index) in modelInfo" :key="'Model' + index" 
                            v-bind="info"
                            :indexInParent="index"
                            @selectModel="changeModel"
                            :checked="index == selectedModel">
                        </ModelCard>
                        <!-- 方法选择：仅按钮 -->
                        <div class="mainParamName48">请选择攻击方法（可多选）</div>
                        <a-row :gutter="16" style="margin-top:16px" v-for="(methods, i) in methodInfo" :key="'attack'+i" type="flex">
                            <a-col :flex="24 / methods.length" v-for="(method, j) in methods" :key="j">
                                <a-button :id="'button' + i + j" class="methodButton" @click="changeMethods(i,j)"
                                    @mouseover="methodButtonOver(i, j)"
                                    >{{ method.name }}</a-button>
                            </a-col>
                            <div v-if="methodHoverIndex==i" class="attackmethodDes"> {{ methodDescription }} </div>
                        </a-row>
                        <!-- 特征归因 -->
                        <div class="mainParamName48">请选择特征归因可视化算法（可多选）</div>
                        <a-row :gutter="16" style="margin-top:16px" v-for="(methods, i) in featureMethodInfo" :key="'feature'+i" type="flex">
                            <a-col :flex="24 / methods.length" v-for="(method, j) in methods" :key="j">
                                <a-button :id="'feature' + i + j" class="methodButton" @click="changeFeatureMethods(i,j)"
                                    @mouseover="featureMethodButtonOver(i, j)"
                                    >{{ method.name }}</a-button>
                            </a-col>
                            <div v-if="featureMethodHoverIndex==i" class="attackmethodDes"> {{ featureMethodDescription }} </div>
                        </a-row>
                        <!-- 降维 -->
                        <div class="mainParamName48">请选择数据分布降维可视化算法（可多选）</div>
                        <a-row :gutter="16" style="margin-top:16px" v-for="(methods, i) in dimensionMethodInfo" :key="'dimension'+i" type="flex">
                            <a-col :flex="24 / methods.length" v-for="(method, j) in methods" :key="j">
                                <a-button :id="'dimension' + i + j" class="methodButton" @click="changeDimensionMethods(i,j)"
                                    @mouseover="dimensionMethodButtonOver(i, j)"
                                    >{{ method.name }}</a-button>
                            </a-col>
                            <div v-if="dimensionMethodHoverIndex==i" class="attackmethodDes"> {{ dimensionMethodDescription }} </div>
                        </a-row>
                        <!-- 模型内部解释 -->
                        <div class="mainParamName48">请选择模型内部特征分析可视化算法</div>
                        <a-radio :style="radioStyle" :checked="layerchecked" :disabled="selectedFeatureMethod.length==0 ? true:false" @click="layerExplainChange">
                            Guided-backpropagation
                        </a-radio>
                        <ExMethodEval :isShow="resultVisible" :result="result" :postData="postData" @on-close="() => {resultVisible = !resultVisible}"></ExMethodEval>
                    </div>
                </div>
            </div>
            <!-- 日志展示 -->
            <div v-if="logflag">
                <showLog :percent="percent" :logtext="logtext"></showLog>
            </div>
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
import funcicon from "../assets/img/modelEvaIcon.png"
import bgimg from "../assets/img/modelEvaBackground.png"
import ExMethodEval from "../views/dialog/ExMethodEval.vue"
import DataSetCard from "../components/card/DataSetCard.vue"
import ModelCard from "../components/card/ModelCard.vue"
import MethodCard from "../components/card/MethodCard.vue";

export default {
    name:"robustFormalVerification",
    components:{
        /* 注册组件 */
        navmodule:navmodule,
        func_introduce:func_introduce,
        showLog:showLog,
        resultDialog:resultDialog,
        DataSetCard,
        ModelCard,
        MethodCard,
        ExMethodEval,
    },
    data(){
        return{
            /* 单选按钮样式 */
            radioStyle: {
                display: 'block',
                lineHeight: '30px',
            },
            layerchecked:false,
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
                name:"攻击机理分析",
                /* 功能icon，需先引入 */
                imgpath:funcicon,
                /* 功能背景图片，需先引入 */
                bgimg:bgimg,
                /* 功能介绍下的总介绍 */
                destext:"通过解释算法对样本进行分析，可视化展示对抗样本攻击效果",
                /* 背景介绍 */
                backinfo:"通过研究各类对抗性攻击的生成与作用机理，即其误导模型的内在原因，并建立易于人类理解的解释方法，为安全性验证与防御策略构建等工作提供理论指导。",
                /* 亮点介绍 */
                highlight:[
                    "特征归因可视化：通过解释算法计算模型在正常样本和对抗样本上的显著图，并做可视化标注处理及展示；进一步通过相关系数量化显著区域的差异性，以此说明对抗噪声通过影响模型关注的特征进而影响分类决策",
                    "数据分布降维可视化：将对抗样本和正常样本同时输入到降维方法中，将其同时映射到同一平面中并做可视化处理，进而分析其空间分布的差异，以此说明对抗样本在分布上与正常样本差距较大，可以通过一些分布检测算法进行过滤",
                    "模型内部特征分析可视化：根据模型输出层来分析模型内部（各个隐藏层）上特征所贡献的大小说明对抗噪声通过影响模型关注的特征进而影响分类决策"
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
            logclk:"", 
            // 数据集信息
            dataSetInfo: [
            {
                    name: "ImageNet",
                    description: "是ILSVRC竞赛使用的是数据集，由斯坦福大学李飞飞教授主导，包含了超过1400万张全尺寸的有标记图片，大约有22000个类别的数据。",
                    classname:['数字0','数字1','数字2','数字3','数字4','数字5','数字6','数字7','数字8','数字9'],
                    pictureSrcs: [
                        [require("../assets/img/ImageNet1.png"),
                        require('../assets/img/ImageNet2.png'),
                        require('../assets/img/ImageNet3.png'), 
                        require('../assets/img/ImageNet4.png'), 
                        require('../assets/img/ImageNet5.png'), 
                        require('../assets/img/ImageNet6.png'), 
                        require('../assets/img/ImageNet7.png'),
                        require('../assets/img/ImageNet8.png'),
                        require('../assets/img/ImageNet9.png'),
                        require('../assets/img/ImageNet1.png'),],
                    ],
                },
            {
                    name: "CIFAR10",
                    classname:['airplane','automobile','bird','cat','deer','dog','frog','horse','ship','truck'],
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
                    classname:['数字0','数字1','数字2','数字3','数字4','数字5','数字6','数字7','数字8','数字9'],
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
                    name:"VGG",
                    subset: ["vgg11", "vgg13", "vgg16", "vgg19"]
                },
                {
                    name:"ResNet",
                    subset: ["ResNet18", "ResNet34", "ResNet50", "ResNet101", "ResNet152"]
                },
                {
                    name:"DenseNet",
                    subset: ["DenseNet121", "DenseNet161", "DenseNet169", "DenseNet201"]
                }
            ],
            selectedModel: 0,
            subModel:0,
            methodInfo: [
                [
                    {
                        name: "FGSM",
                        description: "Fast Gradient Sign MethodFGSM快速梯度符号法是一种简单而有效的生成对抗样本的方法，其工作方式如下：在给定输入数据后，利用已训练的模型输出预测并计算损失函数的梯度，然后使用梯度的符号来创建使损失最大化的新数据。",
                    },
                    {
                        name: "RFGSM",
                        description: "Random Fast Gradient Sign MethodR-FGSM随机快速梯度符号法是FGSM的一种变体，在应用FGSM产生的对抗扰动之前，给在输入样本中增加一个小的随机扰动，这样有助于避免梯度Mask的防御策略。",
                    },
                    {
                        name: "FFGSM",
                        description: "FGSM in fast adversarial trainingFFGSM快速FGSM是FGSM的一种变体，在应用FGSM产生的对抗扰动前，给在输入样本中增加一个小的随机扰动。与R-FGSM不同的是，扰动以均匀分布代替高斯分布。",
                    },
                    {
                        name: "MIFGSM",
                        description: "Momentum Iterative Fast Gradient Sign MethodMI-FGSM基于动量的迭代FGSM是在I-FGSM的基础上，通过将动量项整合到攻击的迭代过程中，使计算结果能摆脱局部最优，并且增加了更新方向的稳定性。",
                    },
                ],
                [
                    {
                        name: "DIFGSM",
                        description: "Diverse Inputs Iterative Fast Gradient Sign Method(DI2-FGSM)输入多样的迭代FGSM是在I-FGSM的基础上，让输入图片随机进行数据增强，即在样本输入模型之前，以一定概率p对其进行随机resize，padding等操作。该方法增强了攻击的鲁棒性，使得黑盒攻击成功率显著增加。",
                    },
                    {
                        name: "BIM",
                        description: "Basic Iterative MethodBIM迭代式FGSM是FGSM方法的变体，其工作原理为：每轮迭代在上一步算得的对抗样本基础上，各像素增加（或减少）一个常数。",
                    },
                    {
                        name: "EOTPGD",
                        description: "Expectation Over Transformation based PGDEOTPGD变换期望PGD是将EOT的思想加入到PGD算法中，即迭代中用损失函数梯度的期望代替符号梯度本身。",
                    },
                    {
                        name: "PGD",
                        description: "Projected Gradient DescentPGD投影梯度下降法是FGSM的迭代版本，与BIM不同的是，它对每次迭代的结果进行裁剪，保证新样本的各个像素都在x的ϵ邻域（L∞）内。",
                    },
                    {
                        name: "PGDL2",
                        description: "L2-bounded PGDPGDL2L2范数投影梯度下降法是PGD算法的另一个版本，其对每次的迭代结果采用L2范数裁剪。",
                    },
                ]
                
            ],
            selectedMethods: [], 
            featureMethodInfo:[[
                {
                    name: "LRP",
                    id:"lrp",
                    description: "LRP算法：通过自定义模型反向传输规则，将模型决策的结果归因到样本像素中，进而可视化其中对分类有利和对分类有害的显著区域。",
                },
                {
                    name: "Grad-CAM",
                    id:"gradcam",
                    description: "Grad-CAM算法：通过解构模型特征提取层的特征图（feature map），提取对模型当前决策起到积极影响的区域。",
                },
                {
                    name: "Integrated Grad",
                    id:"integrated_grad",
                    description: "Integrated Grad算法：积分梯度方法，通过对基线到输入进行模型梯度的积分，提升归因质量。",
                }
            ]], 
            selectedFeatureMethod:[],
            featureMethodDescription:"",
            featureMethodHoverIndex:-1,
            dimensionMethodInfo:[[{
                    name: "PCA",
                    id: "pca",
                    description: "PCA算法：主成分分析（Principal Component Analysis，PCA）是一种数学方法，用于将高维数据转化为低维表示，同时保留数据中最重要的信息。它通过寻找数据中的主要变化方向（主成分），将原始特征转化为这些主成分的线性组合，从而实现数据的降维和压缩。",
                },
                {
                    name: "t-SNE",
                    id: "tsne",
                    description: "t-SNE算法：非线性降维算法，非常适用于高维数据降维到2维或者3维，并进行可视化。",
                },
                {
                    name: "SVN",
                    id: "svm",
                    description: "SVN算法：采用支持向量机来拟合样本分布，并计算样本到SVM边界的距离和样本数据之间的关系，分析样本的分布情况。",
                }]],
            selectedDimensionMethod:[],
            dimensionMethodDescription:"",
            dimensionMethodHoverIndex:-1,
            methodDescription: "",
            methodHoverIndex: -1,
            resultVisible: false,
            postData:{},
            uploadflag:false,
        }
    },
    watch:{
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
        document.title = '攻击机理分析';
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
        layerExplainChange(e){
            this.layerchecked = !this.layerchecked
            e.target.blur()
        },
        /* 关闭结果窗口 */
        closeDialog(){
            this.resultVisible=false;
            //把绑定的弹窗数组 设为false即可关闭弹窗
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
            if (this.result.data.stop==1) {
                // 关闭日志显示
                this.logflag = false;
                // 关闭结果数据获取data
                window.clearInterval(this.clk);
                // this.clk = null
                // 关闭日志获取结果获取
                window.clearInterval(this.logclk);
                // this.logclk = null
                 // 处理结果
                this.result = this.result.data.result;
                this.result["tid"] = this.tid
                this.result["stidlist"] = this.stidlist
                // 显示结果窗口
                this.resultVisible = true;
            }
        },
        /* 更新结果*/ 
        update(){
            // debugger
            this.getData();
            try{
                this.stopTimer();
            }catch(err){}
        },
        // 上传模型
        uploadModel(info){
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                this.$message.success(`${info.file.name} file uploaded successfully`);
                this.uploadflag = true
            } else if (info.file.status === 'error') {
                this.$message.error(`${info.file.name} file upload failed.`);
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
            let dataset = this.dataSetInfo[this.selectedDataset].name;
            let model = this.modelInfo[this.selectedModel].subset[this.subModel]
            if(this.selectedMethods.length == 0){
                this.$message.warning('请至少选择一项攻击算法！',3);
                return
            }
            if(this.selectedFeatureMethod.length == 0 && this.selectedDimensionMethod.length == 0){
                this.$message.warning('请至少选择一项特征归因可视化算法或数据分布降维可视化算法！',3);
                return
            }
            this.logtext = [];
            this.logflag = true;
            
            // this.resultVisible = true;
            // this.tid = "20230815_1029_dcb8922"
            // this.postData["Taskid"] = "20230815_1029_dcb8922"
            // this.postData["DatasetParam"] = {"name":dataset}
            // this.stidlist["dimention"] = "S20230815_1029_2902a94"
            // this.stidlist["feature"] = "S20230815_1029_08a94c2"
            // // that.postData["ModelParam"] = {"name":model,"ckpt":this.uploadflag}
            // this.postData["ModelParam"] = {"name":model,"ckpt":null}
            // this.postData["AdvMethods"] = this.selectedMethods
            // this.postData["ExMethods"] = this.selectedFeatureMethod
            // this.postData["Use_layer_explain"] = this.layerchecked
            // this.postData["VisMethods"] = this.selectedDimensionMethods
            // this.clk = window.setInterval(() => {
            //     this.update();
            // },2000)
            // return 0
            var that = this;
            that.$axios.post("/Task/CreateTask", { AttackAndDefenseTask: 0 }).then((result) => {
                console.log(result);
                that.tid = result.data.Taskid;
                // that.logclk = window.setInterval(that.getLog, 20000);
                that.logclk = window.setInterval(() => {
                    that.getLog();
                },20000)
                // 数据降维
                that.postData["Taskid"] = that.tid
                that.postData["DatasetParam"] = {"name":dataset}
                // that.postData["ModelParam"] = {"name":model,"ckpt":this.uploadflag}
                that.postData["ModelParam"] = {"name":model,"ckpt":null}
                that.postData["AdvMethods"] = that.selectedMethods
                if(that.selectedDimensionMethod.length > 0){
                    that.postData["VisMethods"] = that.selectedDimensionMethod
                    
                    that.$axios.post("/Attack/AttackDimReduciton", that.postData).then((res) => {
                        that.stidlist["dimention"] =  res.data.stid;
                        that.clk = window.setInterval(() => {
                            that.update();
                        },60000)
                    }).catch((err) => {
                        console.log(err);
                        window.clearInterval(that.logclk);
                    });}
                // 特征归因
                if(that.selectedFeatureMethod.length > 0){
                    that.postData["ExMethods"] = that.selectedFeatureMethod
                    that.postData["Use_layer_explain"] = that.layerchecked
                    that.$axios.post("/Attack/AttackAttrbutionAnalysis", that.postData).then((res) => {
                        that.stidlist["feature"] =  res.data.stid;
                        if(that.clk==""){
                            // that.clk = self.setInterval(that.update, 60000);
                            that.clk = window.setInterval(() => {
                                that.update();
                            },60000)
                        }
                    }).catch((err) => {
                        console.log(err);
                        window.clearInterval(that.logclk);
                    });
                }
                
            }).catch((err) => {
                console.log(err)
            });
            
        },
        // 更换数据集
        changeDataset(index) {
            this.selectedDataset = index
        },
        // 更换模型
        changeModel(index, subsetIndex) {
            this.selectedModel = index
            this.subModel = subsetIndex
            console.log(subsetIndex)
        },
        // 更新方法参数
        changeMethods(i, j) {
            // debugger
            let button = document.getElementById("button" + i + j)
            if (button.style.color == "") {
                this.methodHoverIndex = i
                this.methodDescription = this.methodInfo[i][j].description
                button.style.color = "#0B55F4"
                button.style.borderColor = "#C8DCFB"
                button.style.background = "#F2F4F9"
                this.selectedMethods.push(this.methodInfo[i][j].name)
            } else {
                this.methodHoverIndex = -1
                this.methodDescription = ""
                button.style.color = ""
                button.style.borderColor = "#C8DCFB"
                button.style.background = "#F2F4F9"
                button.blur()
                this.selectedMethods.splice(this.selectedMethods.indexOf(this.methodInfo[i][j].name), 1 )
            }
        },
        // 方法按钮的hover状态
        methodButtonOver(i, j) {
            this.methodHoverIndex = i
            this.methodDescription = this.methodInfo[i][j].description
        },
        // 更新方法参数
        changeFeatureMethods(i, j) {
            // debugger
            let button = document.getElementById("feature" + i + j)
            if (button.style.color == "") {
                this.featureMethodHoverIndex = i
                this.featureMethodDescription = this.featureMethodInfo[i][j].description
                button.style.color = "#0B55F4"
                button.style.borderColor = "#C8DCFB"
                button.style.background = "#F2F4F9"
                this.selectedFeatureMethod.push(this.featureMethodInfo[i][j].id)
            } else {
                this.featureMethodHoverIndex = -1
                this.featureMethodDescription = ""
                button.style.color = ""
                button.style.borderColor = "#C8DCFB"
                button.style.background = "#F2F4F9"
                button.blur()
                this.selectedFeatureMethod.splice(this.selectedFeatureMethod.indexOf(this.featureMethodInfo[i][j].id), 1 )
                if(this.selectedFeatureMethod.length == 0){
                    this.layerchecked = false
                }
            }
        },
        // 方法按钮的hover状态
        featureMethodButtonOver(i, j) {
            this.featureMethodHoverIndex = i
            this.featureMethodDescription = this.featureMethodInfo[i][j].description
        },
        // 更新方法参数
        changeDimensionMethods(i, j) {
            // debugger
            let button = document.getElementById("dimension" + i + j)
            if (button.style.color == "") {
                this.dimensionMethodHoverIndex = i
                this.dimensionMethodDescription = this.dimensionMethodInfo[i][j].description
                button.style.color = "#0B55F4"
                button.style.borderColor = "#C8DCFB"
                button.style.background = "#F2F4F9"
                this.selectedDimensionMethod.push(this.dimensionMethodInfo[i][j].id)
            } else {
                this.dimensionMethodHoverIndex = -1
                this.dimensionMethodDescription = ""
                button.style.color = ""
                button.style.borderColor = "#C8DCFB"
                button.style.background = "#F2F4F9"
                button.blur()
                this.selectedDimensionMethod.splice(this.selectedDimensionMethod.indexOf(this.dimensionMethodInfo[i][j].id), 1 )
            }
        },
        // 方法按钮的hover状态
        dimensionMethodButtonOver(i, j) {
            this.dimensionMethodHoverIndex = i
            this.dimensionMethodDescription = this.dimensionMethodInfo[i][j].description
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
.bgInfo{
    height:auto
}
.paramTitle{
    height:80px;
    padding: 20px 24px 20px 26px;
    text-align: left;
    width: 1200px;
}
.methodDes{
    height: 100px;
    width: 960px;
    background-color: aquamarine;
}
.methodButton{
    height: 60px;
    width: 100%;
    color: #000;
    text-align: center;
    font-family: HONOR Sans CN;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
    border-radius: 4px;
    border: 0px solid #C8DCFB;
    background: var(--gray-7, #F2F4F9);
    display: flex;
    padding: 16px 24px;
    justify-content: center;
    align-items: center;
    gap: 16px;
    flex: 1 0 0;
}
/* 公式样式 */
.formula_Y{
    height:24px;
    width:15px;
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
.attackmethodDes{
    display: flex;
    width: 1104px;
    padding: 24px;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    color: var(--gray-3, #6C7385);
    font-family: HONOR Sans CN;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
}
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
.uploadModelStyle{
    display: flex;
    padding: 16px 24px;
    align-items: center;
    width: 1104px;
    gap: 16px;
    align-self: stretch;
    border-radius: 4px;
    background: var(--gray-7, #F2F4F9);
    color: var(--blue-3, #0B55F4);
    font-family: HONOR Sans CN;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
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
/* identical to box height, or 100% */

text-align: center;

/* gray-1 */

color: #000000;


/* Inside auto layout */

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
/* Inside auto layout */

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

/* Inside auto layout */

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


/* Inside auto layout */

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


/* Inside auto layout */

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
</style>
