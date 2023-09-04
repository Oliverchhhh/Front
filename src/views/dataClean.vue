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
                        <div class="datasetSelected">
                            <div class="SelectWithUpload">
                                <p class="mainParamName">低维数据</p>
                                <a-button class="uploadDatasetBtn" @click="dataUploadClick">
                                    <a-icon type="upload" style="color: #0B55F4;" />上传数据</a-button>
                            </div>
                            
                            
                            <a-radio-group v-model="datasetChoice" @change="onDatasetChoiceChange">
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="table" >
                                        abnormal_table.npz
                                    </a-radio>
                                    <p class="matchedMethodText"><span>低维数据：</span>指数字形式的、特征维数较少的数据。检测离群点或异常值是数据挖掘的核心问题之一，数据的爆发式增长要求我们能够及时筛选出其中存在问题的数据并予以剔除。</p>
                                    <p class="matchedMethodText">示例：随机生成正态化的二维样本，模拟存在离群异常数据的低维数据，并进行检测。</p>
                                    <div class="demoData" >
                                        <img class="onedemo" src="../assets/img/abnormal_table_demo.png">
                                    </div>
                                    
                                </div>
                            </a-radio-group>
                            <p class="mainParamName">文本数据</p>
                            <a-radio-group v-model="datasetChoice" @change="onDatasetChoiceChange">
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="txt_encode" >
                                        THUCNews格式异常文本
                                    </a-radio>
                                    <p class="matchedMethodText"><span>THUCNews：</span>由清华大学自然语言处理实验室推出的根据新浪新闻RSS订阅频道2005~2011年间的历史数据筛选过滤生成，包含74万篇新闻文档（2.19 GB），并划分出14个分类类别：财经、彩票、房产、股票、家居、教育、科技、社会、时尚、时政、体育、星座、游戏、娱乐。</p>
                                    <p class="matchedMethodText">示例：检测文本中的错误编码，并进行清洗</p>
                                    <div class="demoData" >
                                        <p>
                                            Ħ��������GPON��FTTH�б�EPON��������
                                        ������ �ߣ�³����
                                        ����2009�꣬�ڹ��ڹ��ͭ�˵Ļ��������£�Ħ������Я���ڹ����г����Ѿ���÷ḻ��Ӫ�����GPON�����������
                                        </p>
                                        
                                    </div>
                                    
                                </div>
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="txt_format">
                                        THUCNews待标点清洗文本
                                    </a-radio>
                                    <p class="matchedMethodText"><span>THUCNews：</span>由清华大学自然语言处理实验室推出的根据新浪新闻RSS订阅频道2005~2011年间的历史数据筛选过滤生成，包含74万篇新闻文档（2.19 GB），并划分出14个分类类别：财经、彩票、房产、股票、家居、教育、科技、社会、时尚、时政、体育、星座、游戏、娱乐。</p>
                                    <p class="matchedMethodText">示例：将文本数据的标点符号进行清洗，便于后续处理</p>
                                    <div class="demoData" >
                                        <p>
                                            昨日上海天然橡胶期货价格再度大幅上扬，在收盘前1小时，大量场外资金涌入，主力1003合约强劲飙升很快升穿21000
                                            元/吨整数关口，终盘报收于21,400元/吨，上涨2.27%，较前一日结算价上涨475元/吨，成交量为736,816手，持仓量为225,046 手。当日整体市场增仓3.4万余手。

                                        </p>
                                    </div>
                                </div>
                            </a-radio-group>
                            <div class="SelectWithUpload">
                                <p class="mainParamName">图像数据</p>
                                <a-button class="uploadDatasetBtn" @click="dataUploadClick">
                                    <a-icon type="upload" style="color: #0B55F4;" />上传数据</a-button>
                            </div>
                            <!-- <p class="mainParamName">图像数据</p> -->
                            <a-radio-group v-model="datasetChoice" @change="onDatasetChoiceChange">
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="CIFAR10" >
                                        CIFAR10
                                    </a-radio>
                                    <p class="matchedMethodText"><span>CIFAR10数据集：</span>是由 Hinton 的学生 Alex Krizhevsky 和 Ilya Sutskever 整理的一个用于识别普适物体的小型数据集。一共包含 10 个类别的 RGB 彩色图 片：飞机（ airplane ）、汽车（ automobile ）、鸟类（ bird ）、猫（ cat ）、鹿（ deer ）、狗（ dog ）、蛙类（ frog ）、马（ horse ）、船（ ship ）和卡车（ truck ）。图片的尺寸为 32×32 ，数据集中一共有 50000 张训练圄片和 10000 张测试图片。</p>
                                    <p class="matchedMethodText">图例：</p>
                                    <div class="demoData" >
                                        <div v-for="(item, index) in CIFAR10_imgs" :key="index">
                                            <img :src="item.imgUrl">
                                        </div>
                                    </div>
                                    
                                </div>
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="MNIST">
                                        MNIST
                                    </a-radio>
                                    <p class="matchedMethodText"><span>MNIST数据集：</span>是一个手写体数字的图片数据集，该数据集来由美国国家标准与技术研究所（National Institute of Standards and Technology, NIST）发起整理，一共统计了来自250个不同的人手写数字图片，其中50%是高中生，50%来自人口普查局的工作人员。该数据集的收集目的是希望通过算法，实现对手写数字的识别。</p>
                                    <p class="matchedMethodText">图例：</p>
                                    <div class="demoData" >
                                        <div v-for="(item, index) in MNIST_imgs" :key="index">
                                            <img :src="item.imgUrl">
                                        </div>
                                    </div>
                                </div>
                            </a-radio-group>
                        </div>
                        <!-- 上传弹窗 -->
                        <!-- <uploadDataset @on-close="closeDialog" :isShow="false" v-show="false">
                            
                        </uploadDataset> -->
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
                        <h1>异常数据检测结果报告</h1>
                    </div>
                </div>
                <div class="dialog_publish_main" slot="main">
                    <!-- 总评分 -->
                    <div class="result_div">
                        <div class="conclusion_info">
                            <!-- 显示输入信息：检测类型、数据集/清洗类型 -->
                            <p class="result_annotation" v-if=" result.dataset_or_format == 'table'">检测类型：低维数据</p>
                            <p class="result_annotation" v-if="result.dataset_or_format == 'txt_encode' | result.dataset_or_format == 'txt_format'">检测类型：文本数据</p>
                            <p class="result_annotation" v-if="result.dataset_or_format == 'MNIST' | result.dataset_or_format == 'CIFAR10'">检测类型：图像数据</p>
                            <p class="result_annotation"  v-if="result.dataset_or_format == 'txt_encode' | result.dataset_or_format == 'txt_format'">文本格式：{{result.dataset_or_format}}</p> 
                            <p class="result_annotation" v-else>数据集：{{result.dataset_or_format}}</p>
                        </div>
                        <div class="g_score_content">
                            <div class="scorebg">
                                <div class=" main_top_echarts_con_title ">修复率</div>
                                <!-- 显示分数 -->
                                <p class="g_score"> {{result.score}}%</p>
                            </div>
                            <!-- 仅图像类型数据显示评分计算 -->
                            <div class="conclusion" v-if="result.dataset_or_format == 'MNIST' | result.dataset_or_format == 'CIFAR10'">
                                <p class="result_annotation">对{{ result.num_images }}张图片进行检测，检测到{{ result.num_detect}}张异常数据，使用Cleanlab算法对异常数据进行修复，修复率为{{ result.score }}%</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 图表 -->
                    <div class="result_div">                        
                        <div class="echart_title">                           
                            <div class=" main_top_echarts_con_title " v-if="result.dataset_or_format=='table'">低维数据修复结果</div>
                            <div class=" main_top_echarts_con_title " v-if="result.dataset_or_format == 'txt_encode' | result.dataset_or_format == 'txt_format'">文本数据清洗结果</div>
                            <div class=" main_top_echarts_con_title " v-if="result.dataset_or_format == 'MNIST' | result.dataset_or_format == 'CIFAR10'">检出标签错误示例</div>
                            <!-- <p class="title_annotation">标题说明，可无</p> -->
                        </div>
                        <div id="rdeva">
                            <!-- 图表 -->
                            <!-- <div id = 'conseva'></div> -->
                            <div class="table_class_result" v-if="result.dataset_or_format=='table'">
                                <!-- <img :src="require(result.table_origin)">
                                <img :src="require(result.table_fix)"> -->
                                <img :src="result.table_origin">
                                <img :src="result.table_fix">
                            </div>
                            <div class="text_class_result" v-if="result.dataset_or_format == 'txt_encode' | result.dataset_or_format == 'txt_format'">
                                <p>{{ result.text_origin }}</p>
                                <p>{{ result.text_clean }}</p>
                            </div>
                            <div class="image_class_result" v-if="result.dataset_or_format == 'MNIST' | result.dataset_or_format == 'CIFAR10'">
                                <!-- 替换为返回图像 -->
                                <img :src="result.demo_img">
                            </div>
                            <div class="conclusion">
                                <p class="result_text" v-if="result.dataset_or_format=='table'">图为低维数据清洗结果，图中黑点为真实离群样本点，黄点为真实良性样本点，绿线展示分类决策边界，在绿色范围内的即为清洗后的样本点。</p>
                                <p class="result_text" v-if="result.dataset_or_format == 'txt_encode' | result.dataset_or_format == 'txt_format'">左侧展示的是清洗前的文本数据，右侧展示的是清洗后的文本数据。</p>
                                <p class="result_text" v-if="result.dataset_or_format == 'MNIST' | result.dataset_or_format == 'CIFAR10'">图示为检测出的标签错误样本，其中蓝色框展示该样本原始标签及程序判别其可信度，灰色框展示该样本在数据集内的编号，绿色框内展示清洗后标签及可信度。</p>
                            </div>
                        </div>
                        <button class="exportResultBtn" @click="exportResult"><a-icon type="upload" />导出报告内容</button>
                    </div>
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
import navmodule from "../components/nav.vue";
/* 引入组件，功能介绍 */
import func_introduce from "../components/funcIntroduce.vue"
/* 引入组件，日志显示 */
import showLog from "../components/showLog.vue"
/* 引入组件，结果显示 */
import resultDialog from "../components/resultDialog.vue"
// import uploadDataset from "../components/uploadDataset.vue"
/* 引入自定义js，结果显示 */
/* 引入图片 */
import funcicon from "../assets/img/dataCleanIcon.png"
import bgimg from "../assets/img/modelEvaBackground.png"

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
};
export default {
    name:"dataClean",
    components:{
        /* 注册组件 */
        navmodule:navmodule,
        func_introduce:func_introduce,
        showLog:showLog,
        resultDialog:resultDialog,
        // uploadDataset:uploadDataset,
        selectIcon,
    },
    data(){
        return{
            /* 单选按钮样式 */
            radioStyle: {
                display: 'block',
                lineHeight: '30px',
            },
            /* 数据类型选择*/
            datasetChoice: "table",
            /* 上传标识符和存放路径*/
            upload_flag: 0,
            upload_path: "",
            /* 数据集*/
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
                name:"异常数据检测",
                /* 功能icon，需先引入 */
                imgpath:funcicon,
                /* 功能背景图片，需先引入 */
                bgimg:bgimg,
                /* 功能介绍下的总介绍 */
                destext:"自动化数据清洗与量化评估",
                /* 背景介绍 */
                backinfo:"通过分析AI系统常见异常数据来源及类型，基于置信学习等多种技术修复异常数据，并丢弃不可修复的异常数据，从而实现自动化的数据集清洗及量化评估，生成异常检测效果分析报告及清洁的数据集",
                /* 亮点介绍 */
                highlight:[
                    "检测AI系统多模态异常数据，数据类型≥3种",
                    "采用离群值检测、编码检测与标点标准化处理、置信学习方法修复",
                    "支持自定义数据集上传与数据集异常检测，能够有效提升数据可用性和安全性"
                ]
            },
            /* 结果弹窗状态信息 */
            isShowPublish:false,
            /* 评估结果 */
            result:{
                "score":94.64,
                "dataset_or_format": "",
                // 表格结果
                "table_origin": "",
                "table_fix": "",
                // // 文本结果
                "text_origin":"",
                "text_clean":"",
                // 图像结果
                "num_images": 10000,
                "num_detect": 34,
                "demo_img": ""
            },
            res_tmp : {},
            /* 主任务id */ 
            tid:"",
            /* 子任务id */ 
            stidlist:{},
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
        document.title = '异常数据检测';
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
        exportResult(){
            if (confirm("您确认下载该pdf文件吗？") ){
                document.body.scrollTop = document.documentElement.scrollTop = 0;
                // 输出pdf尺寸为download_page大小
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
            // debugger;
            this.result["score"] = parseInt(100*res.DataClean.fix_rate);
            this.result["dataset_or_format"] = this.datasetChoice;
            if(this.result["dataset_or_format"]=="table") {
                this.result["table_origin"]=res.DataClean.result_origin
                this.result["table_fix"]=res.DataClean.result_clean
            }
            else if(this.result["dataset_or_format"] =='MNIST' | this.result["dataset_or_format"] =='CIFAR10'){
                this.result["num_images"]=res.DataClean.num_images
                this.result["num_detect"]=res.DataClean.num_detect
                this.result["demo_img"]=res.DataClean.result
            }else{
                this.result["text_origin"]=res.DataClean.before
                this.result["text_clean"]=res.DataClean.after
            }
            
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
            // debugger;
            if (this.res_tmp.data.stop) {
                // 关闭日志显示
                this.logflag = false;
                // 关闭结果数据获取data
                clearInterval(this.clk);
                // 关闭日志获取结果获取
                clearInterval(this.logclk);
                // 显示结果窗口
                this.isShowPublish = true;
                // 处理结果
                // console.log(this.res_tmp.data)
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
        /* 点击上传触发事件，修改上传标识符和路径 */
        dataUploadClick(){
            // 对应上传接口
            // this.$axios.post()
            this.upload_flag = 1;
            this.upload_path = "";
        },
        /* 点击评估触发事件 */
        dataEvaClick(){
            // debugger;
            /* 备份 */ 
            var that=this;
            
            /* 调用创建主任务接口，需开启后端程序 */
            this.$axios.post("/Task/CreateTask",{AttackAndDefenseTask:0}).then((result) => {
                console.log(result);
                that.tid = result.data.Taskid;
                // that.tid = "20230615_1004_278f3fc";
                
                /* 请求体 postdata*/
                const postdata={
                    dataset:that.datasetChoice,
                    upload_flag:that.upload_flag,
                    upload_path: that.upload_path,
                    tid:that.tid};
                // console.log(postdata)
                that.$axios.post("/DataClean/DataCleanParamSet", postdata).then((res) => {
                    
                    that.logflag = true;
                    
                    /* 同步任务，接口直接返回结果，日志关闭，结果弹窗显示，异步任务返回stid */
                    // 同步任务
                    // that.logflag = false;
                    // that.isShowPublish = true;
                    // that.result = res.data;
                    // that.resultPro(res.data);
                    // 异步任务
                    // that.stid =  "S20230616_1026_ce27a93";
                    that.stid =  res.data.stid;
                    that.logclk = self.setInterval(that.getLog, 500);
                    that.clk = self.setInterval(that.update, 1000);
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
    margin: 1% 0;
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

.demoData{
    display: flex;
    margin-left: 40px;
    gap: 10px;
    /* justify-content: space-around; */
    margin-bottom: 20px;
    /* background: aliceblue; */
}

.demoData p{
    background: aliceblue;
}
.demoData img{
    /* position: absolute; */
    width: 64px;
    height: 64px;
    left: 0px;
    top: 0px;
}

.onedemo {
    width: 200px !important; 
    height: 170px !important; 
    left: 0px;
    top: 0px;
}

.upload_bound{
    /* modal-confirm */


    /* Auto layout */

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 24px;
    gap: 24px;

    position: relative;
    width: 464px;
    height: 268px;

    /* 背景色/color-bg-3

    二级容器背景
    */
    background: #FFFFFF;
    border-radius: 4px;
    z-index: 1;
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

.result_div{
    margin-top: 0;
}

.conclusion{
    margin: 10px 0;
}

.conclusion_info{
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 20px;
    gap: 25px;
    margin-bottom: 20px;
    width: 1080px;
    /* gray-7 */

    background: #F2F4F9;
    border-radius: 4px;
}

.g_score{
    width: fit-content;
    font-size: 60px
}

.g_score_content{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px 120px;
    gap: 20px;

    width: 960px;
    height: fit-content;


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
    height: fit-content;

    flex: none;
    /* order: 1; */
    flex-grow: 0
}
/* 得分图echart */
#conseva{
    width: 300px;
    height:300px;
}

.table_class_result{
    width: 1000px;
    height: initial;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: flex-start;
}

.text_class_result{
    width: 1000px;
    height: initial;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: flex-start;
}

.text_class_result p{
    float: left;
    word-break: break-all;
    width: 450px;
}

.image_class_result{
    width: 100%;
    height: 100%;
    /* background-image: url(../../static/img/image_result.png); */
    /* src: ; */
}
</style>
