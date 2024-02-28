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
                <h2 class="subTitle" >参数配置</h2>
                <div class="moduleSwitch">
                    <a-radio-group v-model="mode" default-value="safe" @change="moduleChange" size="large">
                        <a-radio-button value="safe">
                            安全性
                        </a-radio-button>
                        <a-radio-button value="robust">
                            鲁棒性
                        </a-radio-button>
                        <a-radio-button value="consistency">
                            一致性
                        </a-radio-button>
                        <a-radio-button value="reach">
                            可达性
                        </a-radio-button>
                    </a-radio-group>
                </div>
                <div class="funcParam">
                    <div class="paramTitle" >
                        <!-- 功能标题和执行按钮 -->
                        <!-- icon展示 -->
                        <img class="paramIcom" :src="funcDesText.imgpath" :alt="modeMsg[mode].name">
                        <!-- 功能名称 -->
                        <h3>{{ modeMsg[mode].name }}</h3>
                        <a-button v-if="mode==='safe'" class="DataEva" @click="safeEvaClick" :style="buttonBGColor" :disabled="disStatus">
                            <a-icon type="security-scan" />
                            评估
                        </a-button>
                        <a-button v-if="mode==='robust'" class="DataEva" @click="robustEvaClick" :style="buttonBGColor" :disabled="disStatus">
                            <a-icon type="security-scan" />
                            评估
                        </a-button>
                        <a-button v-if="mode==='consistency'" class="DataEva" @click="consistencyEvaClick" :style="buttonBGColor" :disabled="disStatus">
                            <a-icon type="security-scan" />
                            评估
                        </a-button>
                        <a-button v-if="mode==='reach'" class="DataEva" @click="reachEvaClick" :style="buttonBGColor" :disabled="disStatus">
                            <a-icon type="security-scan" />
                            评估
                        </a-button>
                    </div>
                    <a-divider />
                    <div v-if="mode==='safe'" class="inputdiv">
                        <!-- 安全性 -->
                        <!-- 上传样本 -->
                        <div class="uploadImg">
                            <p class="mainParamName">上传样本</p>
                            <div class="uploadDiv">
                                <a-upload
                                    name="avatar"
                                    list-type="picture-card"
                                    class="avatar-uploader"
                                    :show-upload-list="false"
                                    action="/Task/UploadPic"
                                    :before-upload="beforeUpload"
                                    @change="handleChange"
                                >
                                    <img v-if="imageUrl" :src="imageUrl" alt="avatar" class="uploadShowImage"/>
                                    <div v-else>
                                    <a-icon :type="loading ? 'loading' : 'plus'" style="font-size: 19px;" />
                                    <div class="ant-upload-text">
                                        上传图片
                                    </div>
                                    </div>
                                </a-upload>
                            </div>
                        </div>
                        <!-- 选择数据集 -->
                        <div class="datasetSelected">
                            <p class="mainParamName">请选择样本所属数据集</p>
                            <a-radio-group v-model="datasetChoice" class="colummRadio" @change="onDatasetChoiceChange">
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="mnist">
                                        MNIST
                                    </a-radio>
                                    <p class="matchedMethodText"><span>MNIST数据集：</span>是一个手写体数字的图片数据集，该数据集来由美国国家标准与技术研究所（National Institute of Standards and Technology (NIST)）发起整理，一共统计了来自250个不同的人手写数字图片，其中50%是高中生，50%来自人口普查局的工作人员。该数据集的收集目的是希望通过算法，实现对手写数字的识别。</p>
                                    <p class="matchedMethodText">图例：</p>
                                    <div class="demoData" >
                                        <div v-for="(item, index) in MNIST_imgs" :key="index">
                                            <img :src="item.imgUrl">
                                        </div>
                                    </div>
                                </div>
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="cifar10" >
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
                                
                            </a-radio-group>
                        </div>
                        <!-- 选择模型 -->
                        <div class="modelSelected">
                            <p class="mainParamName">请选择深度学习模型</p>
                            <a-radio-group v-model="modelChoice" class="colummRadio" >
                                <a-radio :style="radioStyle" value="cnn_7layer_bn">
                                    CNN
                                </a-radio>
                                <a-radio :style="radioStyle" value="Resnet">
                                    ResNet
                                </a-radio>
                                <a-radio :style="radioStyle" value="Densenet">
                                    DenseNet
                                </a-radio>
                                <a-radio :style="radioStyle" value="Wide Resnet">
                                    Wide ResNet
                                </a-radio>
                            </a-radio-group>
                        </div>
                        <!-- 设置攻击强度 -->
                        <div class="attackIntensity">
                            <p class="mainParamName">请输入攻击强度</p>
                            <a-input class="paramsInput" placeholder="请输入浮点数：0-1.0" @change="onAttackIntensityChange"/>
                        </div>
                    </div>
                    <div v-if="mode==='robust'" class="inputdiv">
                        <!-- 选数据集 -->
                        <div class="datasetSelected" style="margin-top: 0px;">
                            <p class="mainParamNameNotop" style="margin-bottom: 0px;">请选择数据集</p>
                            <a-radio-group v-model="dataset" @change="onFrameworkChange" class="datasetRadioGroup">
                                <div class="datasetDiv">
                                    <a-radio :style="radioStyle" value="mnist" >
                                        MNIST
                                    </a-radio>
                                    <div class="datasetSizeInput">
                                        <p class="secondTitle">数据集大小</p>
                                        <a-input class="sizeInput" placeholder="请输入数据集的大小，建议：5-10" v-model="mnist_dataset" :disabled="dataset==='mnist'?false:true"/>
                                    </div>

                                </div>
                                <div class="datasetDiv">
                                    <a-radio :style="radioStyle" value="cifar10" >
                                        CIFAR10
                                    </a-radio>
                                    <div class="datasetSizeInput">
                                        <p class="secondTitle">数据集大小</p>
                                        <a-input class="sizeInput" placeholder="请输入数据集的大小，建议：2-5" v-model="cifar10_dataset" :disabled="dataset=='cifar10'?false:true"/>
                                    </div>
                                </div>
                                <div class="datasetDiv">
                                    <a-radio :style="radioStyle" value="gtsrb" >
                                        GTSRB
                                    </a-radio>
                                    <div class="datasetSizeInput">
                                        <p class="secondTitle">数据集大小</p>
                                        <a-input class="sizeInput" placeholder="请输入数据集的大小，建议：5-10" v-model="gtstb_dataset" :disabled="dataset=='gtsrb'?false:true"/>
                                    </div>
                                </div>
                                <div class="datasetDiv">
                                    <a-radio :style="radioStyle" value="mtfl" >
                                        MTFL
                                    </a-radio>
                                    <div class="datasetSizeInput">
                                        <p class="secondTitle">数据集大小</p>
                                        <a-input class="sizeInput" placeholder="请输入数据集的大小，建议：2-5" v-model="mtfl_dataset" :disabled="dataset=='mtfl'?false:true"/>
                                    </div>
                                </div>
                                <div class="datasetDiv">
                                    <a-radio :style="radioStyle" value="sst2" >
                                        SST2
                                    </a-radio>
                                    <div class="datasetSizeInput">
                                        <p class="secondTitle">数据集大小</p>
                                        <a-input class="sizeInput" placeholder="请输入数据集的大小，建议：2-5" v-model="sst2_dataset" :disabled="dataset=='sst2'?false:true"/>
                                    </div>
                                </div>
                            </a-radio-group>
                        </div>
                        
                        <div class="modelSelected" style="margin-top: 224px;">
                            <p class="mainParamName">请选择模型</p>
                            <a-radio-group v-model="ai_model" @change="onAiModelChange">
                                <div class="modelDiv">
                                    <a-radio :style="modelStyle" value="cnn" :disabled="['mnist'].indexOf(dataset) > -1? false: true" > CNN </a-radio>
                                </div>
                                <div class="modelDiv">
                                    <a-radio :style="modelStyle" value="resnet18" :disabled="['cifar10', 'mtfl', 'gtsrb'].indexOf(dataset) > -1? false: true" >  ResNet18 </a-radio>
                                </div>
                                <div class="modelDiv">
                                    <a-radio :style="modelStyle" value="densenet" :disabled="['cifar10'].indexOf(dataset) > -1? false: true" >  DenseNet </a-radio>
                                </div>
                                <div class="modelDiv">
                                    <a-radio :style="modelStyle" value="lstm" :disabled="['sst2'].indexOf(dataset) > -1? false: true" > LSTM </a-radio>
                                </div>
                                <div class="modelDiv">
                                    <a-radio :style="modelStyle" value="transformer" :disabled="['sst2'].indexOf(dataset) > -1? false: true" > Transformer </a-radio>
                                </div>
                            </a-radio-group>
                        </div>
                        <!-- 最大扰动值 -->
                        <div class="epsInput" style="margin-top: 24px;">
                            <p class="mainParamName">请设置最大扰动</p>
                                <a-input class="paramsInput" placeholder="请输入最大扰动值，建议输入：0.02-0.08之间" v-model="maxEps" />
                        </div>

                        <!-- 最小扰动值 -->
                        <div class="epsInput">
                            <p class="mainParamName">请设置最小扰动</p>
                            <a-input class="paramsInput" placeholder="请输入最小扰动值，建议输入：0.02-0.08之间" v-model="minEps" />
                        </div>

                        <!-- 最大扰动值 -->
                        <div class="epsInput">
                            <p class="mainParamName">请设置扰动次数</p>
                            <a-input class="paramsInput" placeholder="请输入扰动次数，建议输入4-6次" v-model="epsCnt" />
                        </div>

                    </div>
                    <div v-if="mode==='consistency'" class="inputdiv">
                        <!-- 一致性 -->
                        <!-- 上传样本 -->
                        <div class="uploadImg">
                            <p class="mainParamName">上传样本</p>
                            <div class="uploadDiv">
                                <a-upload
                                    name="avatar"
                                    list-type="picture-card"
                                    class="avatar-uploader"
                                    :show-upload-list="false"
                                    action="/Task/UploadPic"
                                    :before-upload="beforeUpload"
                                    @change="handleChange"
                                >
                                    <img v-if="imageUrl" :src="imageUrl" alt="avatar" class="uploadShowImage"/>
                                    <div v-else>
                                    <a-icon :type="loading ? 'loading' : 'plus'" style="font-size: 19px;" />
                                    <div class="ant-upload-text">
                                        上传图片
                                    </div>
                                    </div>
                                </a-upload>
                            </div>
                        </div>
                        <!-- 选择数据集 -->
                        <div class="datasetSelected">
                            <p class="mainParamName">请选择样本所属数据集</p>
                            <a-radio-group v-model="datasetChoice" class="colummRadio" @change="onDatasetChoiceChange">
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="mnist">
                                        MNIST
                                    </a-radio>
                                    <p class="matchedMethodText"><span>MNIST数据集：</span>是一个手写体数字的图片数据集，该数据集来由美国国家标准与技术研究所（National Institute of Standards and Technology (NIST)）发起整理，一共统计了来自250个不同的人手写数字图片，其中50%是高中生，50%来自人口普查局的工作人员。该数据集的收集目的是希望通过算法，实现对手写数字的识别。</p>
                                    <p class="matchedMethodText">图例：</p>
                                    <div class="demoData" >
                                        <div v-for="(item, index) in MNIST_imgs" :key="index">
                                            <img :src="item.imgUrl">
                                        </div>
                                    </div>
                                </div>
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="cifar10" >
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
                                
                            </a-radio-group>
                        </div>
                        <!-- 选择模型 -->
                        <div class="modelSelected">
                            <p class="mainParamName">请选择深度学习模型</p>
                            <a-radio-group v-model="modelChoice" class="colummRadio" @change="onDatasetChoiceChange">
                                <a-radio :style="radioStyle" value="vgg16_bn">
                                    VGG16
                                </a-radio>
                                <a-radio :style="radioStyle" value="resnet18">
                                    ResNet18
                                </a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                    <div v-if="mode==='reach'" class="inputdiv">
                        <!-- 可达性 -->
                        <div class="uploadImg">
                            <p class="mainParamName">上传样本</p>
                            <div class="uploadDiv">
                                <a-upload
                                    name="avatar"
                                    list-type="picture-card"
                                    class="avatar-uploader"
                                    :show-upload-list="false"
                                    action="/Task/UploadPic"
                                    :before-upload="beforeUpload"
                                    @change="handleChange"
                                >
                                    <img v-if="imageUrl" :src="imageUrl" alt="avatar" class="uploadShowImage"/>
                                    <div v-else>
                                    <a-icon :type="loading ? 'loading' : 'plus'" style="font-size: 19px;" />
                                    <div class="ant-upload-text">
                                        上传图片
                                    </div>
                                    </div>
                                </a-upload>
                            </div>
                        </div>
                        <!-- 选择数据集 -->
                        <div class="datasetSelected">
                            <p class="mainParamName">请选择样本所属数据集</p>
                            <a-radio-group v-model="datasetChoice" class="colummRadio" @change="onDatasetChoiceChange">
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="mnist">
                                        MNIST
                                    </a-radio>
                                    <p class="matchedMethodText"><span>MNIST数据集：</span>是一个手写体数字的图片数据集，该数据集来由美国国家标准与技术研究所（National Institute of Standards and Technology (NIST)）发起整理，一共统计了来自250个不同的人手写数字图片，其中50%是高中生，50%来自人口普查局的工作人员。该数据集的收集目的是希望通过算法，实现对手写数字的识别。</p>
                                    <p class="matchedMethodText">图例：</p>
                                    <div class="demoData" >
                                        <div v-for="(item, index) in MNIST_imgs" :key="index">
                                            <img :src="item.imgUrl">
                                        </div>
                                    </div>
                                </div>
                                <div class="matchedDes">
                                    <a-radio :style="radioStyle" value="cifar10" >
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
                            </a-radio-group>
                        </div>
                        <!-- 选择模型 -->
                        <div class="modelSelected">
                            <p class="mainParamName">请选择深度学习模型</p>
                            <!-- <a-radio :style="radioStyle" value="cnn_7layer_bn" defaultChecked disabled>
                                CNN-3layer
                            </a-radio> -->
                            <a-radio-group v-model="modelChoice" class="colummRadio" @change="onDatasetChoiceChange">
                                <a-radio :style="radioStyle" value="CNN-3layer" defaultChecked disabled>
                                    CNN-3layer
                                </a-radio>
                            </a-radio-group>
                        </div>
                        <!-- 设置样本真实类别 -->
                        <div class="attackIntensity">
                            <p class="mainParamName">请选择样本的真实类别</p>
                            <div class="matchedDes">
                                <a-select
                                    placeholder="请选择样本的真实类别"
                                    option-filter-prop="children"
                                    v-model="trueLabel"
                                    :filter-option="filterOptionTrueLabel"
                                    @focus="handleFocusTrueLabel"
                                    @blur="handleBlurTrueLabel"
                                    @change="trueLableSelectChange"
                                >
                                    <a-select-option v-for="(temp,index) in modeMsg.reach.label[datasetChoice]" :value="index">
                                        {{ temp }}
                                    </a-select-option>
                                </a-select>
                            </div>
                        </div>
                        <div class="attackIntensity">
                            <p class="mainParamName">请选择目标类别</p>
                            <div class="matchedDes">
                                <a-select
                                    placeholder="请选择目标类别"
                                    option-filter-prop="children"
                                    v-model="tarLabel"
                                    :filter-option="filterOptionTarLabel"
                                    @focus="handleFocusTarLabel"
                                    @blur="handleBlurTarLabel"
                                    @change="tarLabelSelectChange"
                                >
                                    <a-select-option v-for="(temp,index) in modeMsg.reach.label[datasetChoice]" :value="index">
                                        {{ temp }}
                                    </a-select-option>
                                </a-select>
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
            <resultDialog @on-close="closeDialog" :isShow="isShowPublish" v-show="isShowPublish">
                <!-- 安全性评估报告 -->
                <div slot="header" v-if="mode=='safe'">
                    <div class="dialog_title">
                        <img class="paramIcom" :src="funcDesText.imgpath" :alt="funcDesText.name">
                        <h1>安全性评估报告</h1>
                    </div>
                </div>
                <div class="dialog_publish_main" slot="main" v-if="mode=='safe'" id="pdfDom">
                    <div class="paramShow">
                        <a-row >
                            <a-col :span="6" >
                                <div class="paramContent">
                                    <p><span class="paramName">样本：</span><img class="paramShowSample" :src="imageUrl" alt="sample"/></p>
                                </div>
                            </a-col>
                            <a-col :span="6" >
                                <div class="paramContent">
                                    <p><span class="paramName">样本所属数据集：</span><span class="paramValue">{{ datasetChoice }}</span></p>
                                </div>
                            </a-col>
                            <a-col :span="6" >
                                <div class="paramContent">
                                    <p><span class="paramName">深度学习模型：</span><span class="paramValue">{{ modelChoice }}</span></p>
                                </div>
                            </a-col>
                            <a-col :span="6" >
                                <div class="paramContent">
                                    <p><span class="paramName">攻击强度：</span><span class="paramValue">{{ epsilon }}</span></p>
                                </div>
                            </a-col>
                        </a-row>
                    </div>
                    <!-- 总评分 -->
                    <div class="reportContent">
                        <div class="classification">
                            <p class=" main_top_echarts_con_title ">正常样本分类结果</p>
                            <div class="conclusion">
                                <p class="result_text">{{ modeMsg.reach.label[datasetChoice][result["predicted"]] }}</p>
                            </div>
                        </div>
                        <div class="result_div_notop">
                            <p class=" main_top_echarts_con_title ">解释可视化展示(IBP)</p>
                            <div class="IBPChart">

                                <!-- 图表 -->
                                <div id='IBP'></div>
                                
                                <div class="conclusion">
                                    <p class="result_text">如上柱状图，在预测标签为{{ modeMsg.reach.label[datasetChoice][result["predicted"]] }}的图像上，
                                        设置攻击强度为{{epsilon}}，
                                        验证模型的输出结果，观察真实标签与其他标签的输出置信区间重叠情况，重叠越多，表明在当前攻击强度下，模型有更大概率将卡车图片错误地预测为其他标签。</p>
                                </div>
                            </div>
                        </div>
                        <div class="result_div_notop">
                            <p class=" main_top_echarts_con_title ">解释可视化展示(CROWN-IBP)</p>
                            <div class="IBPChart">

                                <!-- 图表 -->
                                <div id='CROWN'></div>
                                
                                <div class="conclusion">
                                    <p class="result_text">如上柱状图，在预测标签为{{ modeMsg.reach.label[datasetChoice][result["predicted"]+1] }}的图像上，
                                        设置攻击强度为{{epsilon}}，
                                        验证模型的输出结果，观察真实标签与其他标签的输出置信区间重叠情况，重叠越多，表明在当前攻击强度下，模型有更大概率将卡车图片错误地预测为其他标签。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <a-button @click="getPdf()" style="width:160px;height:40px;margin-bottom:30px;margin-top:10px;
                        font-size:18px;color:white;background-color:rgb(46, 56, 245);border-radius:8px;">
                        <a-icon type="upload" />导出报告内容
                    </a-button>
                </div>
                <!-- 鲁棒性评估报告 -->
                <div slot="header" v-if="mode=='robust'">
                    <div class="dialog_title">
                        <img class="paramIcom" :src="funcDesText.imgpath" :alt="funcDesText.name">
                        <h1>鲁棒性形式化验证评估结果报告</h1>
                    </div>
                </div>
                <div class="dialog_publish_main" slot="main" v-if="mode=='robust'" id="pdfDom">
                    <div class="paramShow">
                        <a-row >
                            <a-col :span="5" >
                                <div class="paramContent">
                                    <p><span class="paramName">数据集：</span><span class="paramValue">{{ dataset }}</span></p>
                                </div>
                            </a-col>
                            <a-col :span="5" >
                                <div class="paramContent">
                                    <p><span class="paramName">模型：</span><span class="paramValue">{{ ai_model }}</span></p>
                                </div>
                            </a-col>
                            <a-col :span="5" >
                                <div class="paramContent">
                                    <p><span class="paramName">最大扰动值：</span><span class="paramValue">{{ maxEps }}</span></p>
                                </div>
                            </a-col>
                            <a-col :span="5" >
                                <div class="paramContent">
                                    <p><span class="paramName">最小扰动值：</span><span class="paramValue">{{ minEps }}</span></p>
                                </div>
                            </a-col>
                            <a-col :span="4" >
                                <div class="paramContent">
                                    <p><span class="paramName">扰动次数：</span><span class="paramValue">{{ epsCnt }}</span></p>
                                </div>
                            </a-col>
                        </a-row>
                    </div>
                    <!-- 总评分 -->
                    <div class="result_div" style="margin-top: 120px;">
                        <div class="g_score_content" style="width:960px">
                            <div class="scorebg">
                                <div class=" main_top_echarts_con_title ">鲁棒性形式化验证总评分</div>
                                <!-- 显示分数 -->
                                <p class="g_score"> {{result_score.toFixed(0)}}</p>
                                <!-- 显示评估结果 -->
                                <p class="g_score_evaluate"> {{ resultEvaluate }}</p>
                            </div>
                        </div>
                        <div class="conclusion">
                            <p class="result_text"> 模型综合评分为{{result_score.toFixed(0)}}，是一个{{ resultScon }}的模型</p>
                            <p class="result_annotation">通过鲁棒性分析，在指定输入和扰动空间下，该模型可成功抵御对抗攻击的概率为{{result_score.toFixed(0)}}%。</p>
                        </div>
                    </div>
                    
                    <!-- 图表 -->
                    <div class="result_div">
                        
                        <div class="echart_title">
                            
                            <div class=" main_top_echarts_con_title ">鲁棒性分析结果</div>
                            <!-- <p class="title_annotation">标题说明，可无</p> -->
                            
                        </div>
                        <div id="rdeva">
                            <!-- 图表 -->
                            <div id = 'conseva'></div>
                            <div class="conclusion">
                                <!-- <p class="result_text">图表结论</p> -->
                                <p class="result_annotation">图表中auto_LiRPA曲线展示了在不同扰动大小下，使用auto_LiRPA算法分析所得AI模型被对抗样本成功攻击的概率。</p>
                            </div>
                        </div>
                    </div>
                    <a-button @click="getPdf()" style="width:160px;height:40px;margin-bottom:30px;margin-top:10px;
                    font-size:18px;color:white;background-color:rgb(46, 56, 245);border-radius:8px;">
                    <a-icon type="upload" />导出报告内容
                    </a-button>
                </div>
                <!-- 一致性报告 -->
                <div slot="header" v-if="mode=='consistency'">
                    <div class="dialog_title">
                        <img class="paramIcom" :src="funcDesText.imgpath" :alt="funcDesText.name">
                        <h1>一致性评估报告</h1>
                    </div>
                </div>
                <div class="dialog_publish_main" slot="main" v-if="mode=='consistency'" id="pdfDom">
                    <div class="paramShow">
                        <a-row >
                            <a-col :span="8" >
                                <div class="paramContent">
                                    <p><span class="paramName">样本：</span><img class="paramShowSample" :src="imageUrl" alt="sample"/></p>
                                </div>
                            </a-col>
                            <a-col :span="8" >
                                <div class="paramContent">
                                    <p><span class="paramName">样本所属数据集：</span><span class="paramValue">{{ datasetChoice }}</span></p>
                                </div>
                            </a-col>
                            <a-col :span="8" >
                                <div class="paramContent">
                                    <p><span class="paramName">深度学习模型：</span><span class="paramValue">{{ modelChoice }}</span></p>
                                </div>
                            </a-col>
                        </a-row>
                    </div>
                    <!-- 总评分 -->
                    <div class="reportContentCon">
                        <div class="g_score_content" style="width: 1080px;">
                            <div class="scorebg">
                                <div class=" main_top_echarts_con_title ">模型一致性评分</div>
                            
                                <p class="g_score_2">{{ result["l2"] }}</p>
                                <!-- {{res.score.aft}} -->
                                <!-- <p class="g_score_evaluate"> {{ res.score_evaluate.aft }}</p> -->
                            </div>
                        </div>
                        <div class="result_div_notop">
                            <p class=" main_top_echarts_con_title ">一致性输出展示</p>
                            <!-- <div class="IBPChart"> -->

                                <!-- 图表 -->
                            <div class='featureImgDiv'>
                                <div class="imgShowtable">
                                    <div class="imageTitle">
                                        <p>Input</p>
                                    </div>
                                    <div class="imageContent"> 
                                        <div class="imgbg">
                                            <img :src="'./'+result.input"  />
                                        </div>
                                        
                                    </div>
                                </div>
                                <div class="imgShowtable">
                                    <div class="imageTitle">
                                        <p>Target</p>
                                    </div>
                                    <div class="imageContent"> 
                                        <div class="imgbg">
                                            <img :src="'./'+result.target"  />
                                        </div>
                                    </div>
                                </div>
                                <div class="imgShowtable">
                                    <div class="imageTitle">
                                        <p>Output</p>
                                    </div>
                                    <div class="imageContent"> 
                                        <div class="imgbg">
                                            <img :src="'./'+result.output"  />
                                        </div>
                                        
                                    </div>
                                </div>
                                <div class="imgShowtable">
                                    <div class="imageTitle">
                                        <p>Delta</p>
                                    </div>
                                    <div class="imageContent"> 
                                        <div class="imgbg">
                                            <img :src="'./'+result.delta"  />
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                                
                            <div class="conclusion">
                                <p class="result_text">如图，针对CIFAR10数据集测试图像输出特征图像，待验证模型的特征图像，
                                    通过特征转换模型得到的图像，以及两个图像的差别。主要对比待验证模型的特征图像和转换模型输出的目标图像，
                                    用以代表两个模型的知识特征，可以看出两个模型的知识特征对比差距不大，但是仍存在部分区域上的特征不一致的现象。</p>
                            </div>
                            
                        </div>
                    </div>
                    <a-button @click="getPdf()" style="width:160px;height:40px;margin-bottom:30px;margin-top:10px;
                        font-size:18px;color:white;background-color:rgb(46, 56, 245);border-radius:8px;">
                        <a-icon type="upload" />导出报告内容
                    </a-button>
                </div>
                <!-- 可达性报告 -->
                <div slot="header" v-if="mode=='reach'">
                    <div class="dialog_title">
                        <img class="paramIcom" :src="funcDesText.imgpath" :alt="funcDesText.name">
                        <h1>可达性评估报告</h1>
                    </div>
                </div>
                <div class="dialog_publish_main" slot="main" v-if="mode=='reach'" id="pdfDom">
                    <div class="paramShow">
                        <a-row >
                            <a-col :span="8" >
                                <div class="paramContent">
                                    <p><span class="paramName">样本：</span><img class="paramShowSample" :src="imageUrl" alt="sample"/></p>
                                </div>
                            </a-col>
                            <a-col :span="8" >
                                <div class="paramContent">
                                    <p><span class="paramName">样本所属数据集：</span><span class="paramValue">{{ datasetChoice }}</span></p>
                                </div>
                            </a-col>
                            <a-col :span="8" >
                                <div class="paramContent">
                                    <p><span class="paramName">深度学习模型：</span><span class="paramValue">{{ modelChoice }}</span></p>
                                </div>
                            </a-col>
                        </a-row>
                    </div>
                    <!-- 总评分 -->
                    <div class="reportContentCon">
                        <div class="result_div_notop">
                            <p class=" main_top_echarts_con_title ">真实类别到目标类别的可达区域展示</p>
                            <div class='reachImgDiv'>
                                <div class="imgContent">
                                    <a-row>
                                        <a-col :span="2">
                                            <div class="ylabel"> 目标类别:{{ modeMsg.reach.label[datasetChoice][tarLabel] }}</div>
                                        </a-col>
                                        <a-col :span="22">
                                            <div class="reachImgbg">
                                                <img :src='reachImgURL' style="height: 100%;width: 100%;" />
                                            </div>
                                        </a-col>
                                    </a-row>
                                    <a-row>
                                        <a-col>
                                            <div class="xlabel"> 真实类别:{{modeMsg.reach.label[datasetChoice][trueLabel]}}</div>
                                        </a-col>
                                    </a-row>
                                </div>

                            </div>
                                
                            <div class="conclusion">
                                <p class="result_text">如图是上传图片用理论验证和撒点验证两种方法计算得到的可达区域图，蓝色点代表理论验证值，黑色点是通过撒点实测得到的值。横坐标是预测为真实label的置信度，纵坐标是预测为目标label的置信度，当点都位于红线（y=x）下方时可认为可达区域安全</p>
                            </div>
                            
                        </div>
                    </div>
                    <a-button @click="getPdf()" style="width:160px;height:40px;margin-bottom:30px;margin-top:10px;
                        font-size:18px;color:white;background-color:rgb(46, 56, 245);border-radius:8px;">
                        <a-icon type="upload" />导出报告内容
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
import {drawIntervalBar, drawStackedLine} from "../assets/js/drawEcharts.js"
/* 引入图片 */
import funcicon from "../assets/img/formalVerifyIcon.png"
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
    }
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
    name:"formalVerfy",
    components:{
        /* 注册组件 */
        navmodule:navmodule,
        func_introduce:func_introduce,
        showLog:showLog,
        resultDialog:resultDialog,
        selectIcon,
    },
    data(){
        return{
            htmlTitle:"形式化验证报告",
            /* 单选按钮样式 */
            radioStyle: {
                display: 'block',
                lineHeight: '30px',
                width: '1104px'
            },
            modelStyle: {
                display: 'block',
                lineHeight: '10px',
                width: '100%'
            },
            /* 数据集选中的值 */
            dataset: 'mnist', 
            /* 数据集类型 */
            mnist_dataset: "",
            cifar10_dataset: "",
            gtstb_dataset: "",
            mtfl_dataset: "",
            sst2_dataset: "",
            /* 模型选择 */
            ai_model: 'cnn',
            /* 最大扰动值 */
            maxEps: "",
            /* 最小扰动值 */
            minEps: "",
            /* 扰动次数 */
            epsCnt: "",
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
            datasetChoice: "",
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
            /* 功能介绍模块信息 */
            funcDesText:{
                /* 功能名称 */
                name:"形式化验证",
                /* 功能icon，需先引入 */
                imgpath:funcicon,
                /* 功能背景图片，需先引入 */
                bgimg:bgimg,
                /* 功能介绍下的总介绍 */
                destext:"形式化验证从安全性 一致性 可达性三个方面验证模型",
                /* 背景介绍 */
                backinfo:"深度学习模型在任意扰动的作用下可能出现输出不符合预期的情况，形式化验证通过模型特征安全性验证、模型一致性验证、输出空间可达性验证，并可视化展示模型在对一个使用场景下的输出是否符合预期",
                /* 亮点介绍 */
                highlight:[
                    "模型特征安全性验证：基于线性松弛的扰动技术，实现多种AI系统的安全特性的快速验证",
                    "模型知识一致性验证：实现对目标模型在原始模型上的特征重构技术，并对模型在知识空间的一致性进行量化分析",
                    "输出空间可达性验证：针对深度学习模型的控制系统，AI系统的可达性验证目标是计算神经网络系统的输出的可达集合"
                ]
            },
            modeMsg:{"safe":{"ID":"safe","name":"安全性","modellist":["cnn_7layer_bn","Densenet","Resnet","Wide Resnet"],"dataset":["mnist","cifar10"]},
            "consistency":{"ID":"consistency","name":"一致性","modellist":["resnet18","vgg16_bn"],"dataset":["mnist","cifar10"]},
            "reach":{"ID":"reach","name":"可达性","modellist":["CNN-3layer"],"dataset":["mnist","cifar10"],
                "label":{"mnist":{
                            0:"数字1",
                            1:"数字2",
                            2:"数字3",
                            3:"数字4",
                            4:"数字5",
                            5:"数字6",
                            6:"数字7",
                            7:"数字8",
                            8:"数字9",
                            9:"数字0",
                        },
                        "cifar10":{
                            0:"飞机",
                            1:"汽车",
                            2:"鸟类",
                            3:"猫",
                            4:"鹿",
                            5:"狗",
                            6:"青蛙",
                            7:"马",
                            8:"船",
                            9:"卡车",
                        }
                    }
                },
            "robust":{"ID":"robust","name":"鲁棒性","modellist":["cnn","resnet18","densenet","lstm","transformer"],"dataset":['mnist','cifar10','mtfl','gtsrb','sst2']}
            },
            epsilon:-1.0,
            modelChoice:"consistency",
            // 当前页面
            mode:"safe",
            /* 结果弹窗状态信息 */
            isShowPublish:false,
            /* 评估结果 */
            result:{},
            result_score : 0.9,
            resultScon: "",
            resultEvaluate: "",
            /* 主任务id */ 
            tid:"",
            /* 子任务id */ 
            stidlist:{},
            /* 异步任务结果查循环clock */
            clk:"",
            /* 日志查询clock*/
            logclk:"", 
            // 上传图片状态
            loading:false,
            imageUrl: '',
            trueLabel:"1",
            tarLabel:"2",
            // 可达性图片URL
            reachImgURL:""
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
        document.title = '形式化验证';
        this.modelChoice = this.modeMsg[this.mode].modellist[0];
        this.datasetChoice = this.modeMsg[this.mode].dataset[0];
        },
    methods: { 
        // 切换页面
        moduleChange(e){
            console.log('radio checked', e.target.value);
            this.modelChoice = this.modeMsg[this.mode].modellist[0];
            this.datasetChoice = this.modeMsg[this.mode].dataset[0];
            this.imageUrl="";
            this.tid="";
            this.logflag=false;
            this.logtext=[];
            this.loading=false;
            this.percent=10;
            this.logclk="";
            this.trueLabel = "1";
            this.tarLabel = "2";
            this.result = {};
        },
        handleChange(info) {
            if (info.file.status === 'uploading') {
                this.loading = true;
                return;
            }
            if (info.file.status === 'done') {
                // Get this url from response in real world.
                getBase64(info.file.originFileObj, imageUrl => {
                this.imageUrl = imageUrl;
                this.loading = false;
                });
            }
            console.log(this.imageUrl);
        },
        beforeUpload(file) {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                this.$message.error('You can only upload JPG/png file!');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('Image must smaller than 2MB!');
            }
            return isJpgOrPng && isLt2M;
        },
        // 选择数据集
        onDatasetChoiceChange(e){
            // 修改选择数据集
            console.log('radio checked', e.target.value);
            this.trueLabel="1";
            this.tarLabel = "2";
        },
   
        onAttackIntensityChange(e) {
            if (e.target.value != "") {
                console.log('input epsilon: ', e.target.value);
                this.epsilon = e.target.value;   
            } 
            console.log(this.epsilon); 
        },

        trueLableSelectChange(value) {
            this.trueLabel=value
            if(this.trueLabel == this.tarLabel){
                this.$message.warning('真实类别不能与目标类别相同，请重新选择',3);
            }
            console.log(`trueLabel: ${this.trueLabel}`);
        },
        handleBlurTrueLabel() {
            console.log('blur');
        },
        handleFocusTrueLabel() {
            console.log('focus');
        },
        filterOptionTrueLabel(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        },

        tarLabelSelectChange(value) {
            this.tarLabel=value
            if(this.trueLabel == this.tarLabel){
                this.$message.warning('目标类别不能与真实类别相同，请重新选择',3);
            }
            console.log(`tarLabel: ${this.tarLabel}`);
        },
        handleBlurTarLabel() {
            console.log('blur');
        },
        handleFocusTarLabel() {
            console.log('focus');
        },
        filterOptionTarLabel(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        },
        /* 关闭结果窗口 */
        closeDialog(){
            this.isShowPublish=false;
            //把绑定的弹窗数组 设为false即可关闭弹窗
        },
        /* result 处理*/
        resultPro(res){
            res = res.result.formal_verification.output_param
            // debugger;
            var that = this;
            // 总分判断
            var allRates = res.LiRPA.rates;
            var sum = 0;
            var avgRates = 0;
            for (let v of allRates) {
                avgRates += v;
            }
            avgRates /= allRates.length;
            that.result_score = 100 - avgRates * 100;
            console.log("Avg rates is : ", that.result_score)
            if(that.result_score > 80){
                that.resultEvaluate = "优秀";
                that.resultScon = "鲁棒";
            }else if(that.result_score > 60 && that.result_score <=80){
                that.resultEvaluate = "良好";
                that.resultScon = "较鲁棒";
            }else{
                that.resultEvaluate = "差";
                that.resultScon = "较不鲁棒";
            }
            var disLabel = res.LiRPA.eps;
            var disData = [];
            var legendInfo = [];
            console.log("result_data is : ", res)
            for (let disKey in res) {
                var tmpData = res[disKey];
                disData.push(tmpData.rates)
                legendInfo.push(tmpData.name)
            }
            drawStackedLine('conseva', disData, legendInfo, disLabel, '')
            
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
            if (this.result.data.stop==1 && this.tid == this.result.data.result.tid) {
                // 关闭日志显示
                this.logflag = true;
                // 关闭结果数据获取data
                window.clearInterval(this.clk);
                this.clk=''
                // 关闭日志获取结果获取
                window.clearInterval(this.logclk);
                this.logclk=''
                // 显示结果窗口
                this.isShowPublish = true;
                // 处理结果
                this.result = this.result.data;
                this.resultPro(this.result);
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
            
            if(this.logclk != ''){
                window.clearInterval(this.logclk)
                this.logclk = ''
            }
        },
        /* 点击安全评估触发事件 */
        safeEvaClick(){
            this.initParam()
            // debugger;
            /*判断选择*/
            if (this.imageUrl == "" ){
                this.$message.warning('请上传jpg/png样本图片！',3);
                return 0;
            };
            if (this.datasetChoice == "" ){
                this.$message.warning('请选择数据集！',3);
                return 0;
            };
            if (this.modelChoice == "" ){
                this.$message.warning('请选择深度学习模型！',3);
                return 0;
            };
            if (this.epsilon <0 ||  this.epsilon > 1.0){
                this.$message.warning('请输入攻击强度，范围0-1.0！',3);
                return 0;
            };
            var that=this;
            /* 调用创建主任务接口，需开启后端程序 */
            that.$axios.post("/Task/CreateTask",{AttackAndDefenseTask:0}).then((result) => {
                console.log(result);
                that.tid = result.data.Taskid;
                // that.tid = "20230224_1106_d5ab4b1";
                /* 请求体 postdata*/
                const postdata={
                    dataset:that.datasetChoice,
                    net:that.modelChoice,
                    eps:that.epsilon,
                    pic:that.imageUrl,
                    tid:that.tid
                };
                console.log(postdata)
                that.percent = 40;
                that.logflag = true;
                that.logclk = window.setInterval(that.getLog, 6000);
                that.$axios.post("/auto_verify_img", postdata).then((res) => {
                    that.isShowPublish=true;
                    window.clearInterval(that.logclk);
                    that.logflag = false;
                    that.result = res.data;
                    console.log(that.result)
                    var ylabel=Object.values(that.modeMsg.reach.label[that.datasetChoice])

                    drawIntervalBar("IBP",that.result.boundary1,ylabel)
                    drawIntervalBar("CROWN",that.result.boundary2,ylabel)
                    // that.resultPro(res.data);
                }).catch((err) => {
                        console.log(err)
                });
            }).catch((err) => {
                console.log(err)
            });    
        },
        /* 点击评估触发事件 */
        consistencyEvaClick(){
            this.initParam()
            // debugger;
            /*判断选择*/
            if (this.imageUrl == "" ){
                this.$message.warning('请上传jpg/png样本图片！',3);
                return 0;
            };
            if (this.datasetChoice == "" ){
                this.$message.warning('请选择数据集！',3);
                return 0;
            };
            if (this.modelChoice == "" ){
                this.$message.warning('请选择深度学习模型！',3);
                return 0;
            };
            var that=this;
            /* 调用创建主任务接口，需开启后端程序 */
            that.$axios.post("/Task/CreateTask",{AttackAndDefenseTask:0}).then((result) => {
                console.log(result);
                that.tid = result.data.Taskid;
                // that.tid = "20230224_1106_d5ab4b1";
                /* 请求体 postdata*/
                const postdata={
                    dataset:that.datasetChoice,
                    net:that.modelChoice,
                    pic:that.imageUrl,
                    tid:that.tid,
                    layer:1
                };
                console.log(postdata)
                that.percent = 40;
                that.logflag = true;
                that.logclk = window.setInterval(that.getLog, 6000);
                that.$axios.post("/knowledge_consistency", postdata).then((res) => {
                    that.isShowPublish=true;
                    that.logflag = true;
                    window.clearInterval(that.logclk);
                    that.logflag = false;
                    that.result = res.data;
                    that.result["l2"] = that.result["l2"].toFixed(2);
                    // that.resultPro(res.data);
                }).catch((err) => {
                        console.log(err)
                });
            }).catch((err) => {
                console.log(err)
            });    
        },
        /* 点击评估触发事件 */
        reachEvaClick(){
            // this.$message.warning('功能开发中，敬请期待！',3);
            // return
            this.initParam()
            // debugger;
            /*判断选择*/
            if (this.imageUrl == "" ){
                this.$message.warning('请上传jpg/png样本图片！',3);
                return 0;
            };
            if (this.datasetChoice == "" ){
                this.$message.warning('请选择数据集！',3);
                return 0;
            };
            if (this.modelChoice == "" ){
                this.$message.warning('请选择深度学习模型！',3);
                return 0;
            };
            if (this.trueLabel == "" ){
                this.$message.warning('请选择样本的真实类别！',3);
                return 0;
            };
            if (this.tarLabel == "" ){
                this.$message.warning('请选择目标类别！',3);
                return 0;
            };
            if (this.trueLabel == this.tarLabel ){
                this.$message.warning('真实类别不能与目标类别相同，请重新选择！',3);
                return 0;
            };
            var that=this;
            /* 调用创建主任务接口，需开启后端程序 */
            that.$axios.post("/Task/CreateTask",{AttackAndDefenseTask:0}).then((result) => {
                console.log(result);
                that.tid = result.data.Taskid;
                // that.tid = "20230224_1106_d5ab4b1";
                /* 请求体 postdata*/
                const postdata={
                    dataset:that.datasetChoice,
                    label:that.trueLabel,
                    target:that.tarLabel,
                    pic:that.imageUrl,
                    tid:that.tid
                };
                console.log(postdata)
                that.percent = 40;
                that.logflag = true;
                that.logclk = window.setInterval(that.getLog, 60);

                that.$axios.post("/reach", postdata).then((res) => {
                    that.logflag = true;
                    window.clearInterval(that.logclk);
                    // that.logflag = false;
                    that.result = res.data;
                    that.reachImgURL = that.result.path
                    that.isShowPublish=true;
                }).catch((err) => {
                        console.log(err)
                });
            }).catch((err) => {
                console.log(err)
            });     
        },
        // 模型鲁棒性相关
        // 修改数据集与模型的对应关系
        onFrameworkChange(e){
            // this.ai_model = 'lstm';

            var currentDataset = e.target.value;
            if (currentDataset == 'mnist' && this.ai_model != 'cnn') {
                this.ai_model = 'cnn';
            }
            if (currentDataset == 'cifar10' && ['resnet18', 'desnet'].indexOf(this.ai_model) == -1) {
                this.ai_model = 'resnet18';
            }
            if (['mtfl', 'gtsrb'].indexOf(currentDataset) > -1 && this.ai_model != 'resnet18') {
                this.ai_model = 'resnet18';
            }
            if (currentDataset == 'sst2' && ['lstm', 'transformer'].indexOf(this.ai_model) == -1) {
                this.ai_model = 'lstm';
            }
            console.log('radio checked', e.target.value);
         },
         // 选择模型
         onAiModelChange(e){
            console.log('radio checked', e.target.value);
         },
        robustEvaClick(){
            this.initParam()
            if(this.clk != ''){
                window.clearInterval(this.clk)
                this.clk = ''
            }
            var that=this;
            var data_size = 0
            // that.tid = "20231007_1217_b0cc355"
            // that.stidlist =  {"formalverfy":'S20231007_0930_9a4d874'};
            // that.logclk = window.setInterval(that.getLog, 100);
            // that.clk = window.setInterval(() => {
            //     that.update();
            // }, 300)
            // that.logflag = true;
            // return
            /* 调用创建主任务接口，需开启后端程序 */
            this.$axios.post("/Task/CreateTask",{AttackAndDefenseTask:0}).then((result) => {
                console.log(result);
                that.tid = result.data.Taskid;
                if (this.dataset == 'mnist') {
                    data_size = this.mnist_dataset;
                } else if (this.dataset == 'cifar10') {
                    data_size = this.cifar10_dataset;
                } else if (this.dataset == 'mtfl') {
                    data_size = this.mtfl_dataset;
                } else if (this.dataset == 'gtsrb') {
                    data_size = this.gtstb_dataset;
                }else if (this.dataset == 'sst2') {
                    data_size = this.sst2_dataset;
                }
                if(data_size == ""){
                    that.$message.warning('请输入数据集大小',3);
                    return 0;
                }
                if(that.maxEps == ""){
                    that.$message.warning('请输入最大扰动值',3);
                    return 0;
                }
                if(that.minEps == ""){
                    that.$message.warning('请输入最小扰动值',3);
                    return 0;
                }
                if(that.epsCnt == ""){
                    that.$message.warning('请输入扰动次数',3);
                    return 0;
                }
                /* 请求体 postdata*/
                const postdata={
                    'dataset': this.dataset,
                    'model': this.ai_model,
                    'size': data_size,
                    'up_eps': this.maxEps,
                    'down_eps': this.minEps,
                    'steps': this.epsCnt,
                    'task_id':that.tid
                };
                console.log(postdata)
                // 异步任务
                // that.stid =  res.data.stid;
                // that.logflag = false;
                // that.logtext.length = 0;
                that.logclk = window.setInterval(that.getLog, 600);
                that.logflag = true;
                // 
                // 启动任务
                that.$axios.post("/FormalVerification", postdata).then((res) => {
                    that.stidlist =  {"formalverfy":res.data.stid};
                    that.clk = window.setInterval(that.update, 6000);
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
#funcDes{
    height: 790px;
}
.paramTitle h3{
    /* height: 48px; */
    display: inline;
    margin-top: 38px;
    width: 279px;
    height: 36px;
    font-family: HONOR Sans CN;
    font-size: 24px;
    color: #333333;
    letter-spacing: 0;
    line-height: 48px;
    font-weight: 600;
}
.subTitle{
    margin-top: -184px;
}
.moduleSwitch{
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 6px;

    position: absolute;
    width: 795px;
    height: 56px;
    left: calc(50% - 795px/2);
    margin: -96px auto 40px auto;

    /* gray-6 */

    background: #ECEEF3;
    border-radius: 3px;
}


.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before {
    /* background-color: #1890ff; */
}
.ant-radio-button-wrapper{
    background: none;
    border: none;
    font-family: HONOR Sans CN;
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 40px;
    width: 194px;
    align-items: center;
}
.ant-radio-button-wrapper-checked{
    background: #FFFFFF;
    color: #0B55F4;
}
.ant-radio-button-checked{
    color: #0B55F4;
    border: none;
}
.ant-radio-button-wrapper:first-child{
    border-left: none;
}
.ant-radio-button-wrapper:hover {
    color: #0B55F4;
}
.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before {
    /* background-color: #1890ff; */
}
.ant-radio-group-large{
    width: 795px;
}
.ant-radio-group-large .ant-radio-group-large{
    width: 194px;
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
.uploadImg{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 24px;
    width: 1104px;
    height: 276px;
    flex: none;
    order: 0;
    flex-grow: 0;
}
.mainParamName{
    margin: 0px 0px;
}


.avatar-uploader > .ant-upload {
  width: 160px;
  height: 160px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  width: 19px;
  height: 19px;
  color: #0B55F4;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  font-family: HONOR Sans CN;
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 22px;
  color: #0B55F4;
}
.datasetSelected{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 24px;
    width: 1104px;
    margin-top: 48px;
    /* height: 228px; */
    /* Inside auto layout */
    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
}
.ant-radio-wrapper{
    margin-bottom: 0px;
}

.ant-upload-picture-card-wrapper{
    width: auto;
}

.uploadDiv{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 32px 56px;
    gap: 4px;
    
    width: 1104px;
    height: 224px;
    background: #F2F4F9;
    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
}
.matchedDes{
    display: flex;
    flex-direction: column;
    gap:24px;
    padding: 0px;
    width: 1104px;
    border-radius: 4px;
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}
.demoData{
    margin-top: -12px;
    margin-bottom: 24px;
}
.matchedMethodText{
    /* display: flex; */
    display: block;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px 24px;
    width: 1104px;
    /* height: 46px; */
    height:auto;
    font-family: HONOR Sans CN;
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
.modelSelected{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap:24px;
    margin-top: 48px;
    width: 1104px;
    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
}
.modelChoice{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 24px;

    width: 1104px;
    height: 340px;


    /* Inside auto layout */

    flex: none;
    order: 2;
    align-self: stretch;
    flex-grow: 0;
}

.colummRadio{
    width: 100%;
    gap: 16px;
    display: flex;
    flex-direction: column;
}
.attackIntensity{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 24px;
    width: 1104px;
    margin-top: 48px;
    flex: none;
    order: 3;
    align-self: stretch;
    flex-grow: 0;
}
.paramShowSample{
    height:32px;
    width:32px
}
.uploadShowImage{
    height:160px;
    width:160px
}
.reportContent{
    height: 1382px;
    bottom: 130px;
    top: 166px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px;
    gap: 60px;
    width: 1080px;
    left: 0px;
}
.IBPChart{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 24px;
    width: 960px;
    height: 505px;
    flex: none;
    order: 1;
    flex-grow: 0;
}
#IBP{
    width: 960px;
    height: 385px;
}
#CROWN{
    width: 960px;
    height: 385px;
}
.classification{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px;
    gap: 24px;
    width: 960px;
    height: 132px;
    flex: none;
    order: 0;
    flex-grow: 0;
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
    width: 800px;
    height:800px;
}
.reportContentCon{
    display: flex;
    width: 1080px;
    flex-direction: column;
    align-items: center;
    gap: 60px;
    margin-top: 168px;
}
.g_score_content{
    width: 960px;
}
.featureImgDiv{
    display: flex;
    width: 960px;
    align-items: flex-start;
    border-radius: 4px;
    border: 1px solid #E0E3EB;
    background: #FFF;
}
imgShowtable{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: 1 0 0;
    width: 240px;
    height: 308px;
}
.imageTitle{
    display: flex;
    height: 68px;
    padding: 9px 32px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-self: stretch;
    border-right: 1px solid #E0E3EB;
    border-bottom: 1px solid #E0E3EB;
    background: var(--gray-7, #F2F4F9);
}
.imageTitle p{
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-shrink: 0;
    align-self: stretch;
    color: rgba(0, 0, 0, 0.90);
    text-align: center;
    font-family: HONOR Sans CN;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
}
.imageContent{
    display: flex;
    height: 240px;
    padding: 9px 20px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    align-self: stretch;
    border-right: 1px solid #E0E3EB;
    border-bottom: 1px solid #E0E3EB;
    background: #FFF;
}
.imgbg{
    display: flex;
    width: 200px;
    height: 200px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    
}
.imgbg img{
    width: 200px;
    height: 200px;
}
.reportContent{
    margin-top: 133px;
}
.reachImgDiv{
    display: flex;
    height: 476px;
    padding: 24px 193px 24px 132px;
    align-items: center;
    background: var(--light-neutral-1-bg, #FFF);
}
.imgContent{
    width: 635px;
    height: 428px;
}
.reachImgbg{
    height: 400px;
    width: 600px;
    display: inline-flex;
    padding: 30px 17px 22px 23px;
    justify-content: flex-end;
    align-items: center;
    border: 1px solid var(--gray-4, #B4B9C5);
}
.xlabel{
    color: #000;
    text-align: center;
    font-family: HONOR Sans CN;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; 
    align-self: stretch;
    margin-left: 100px;
}
.ylabel{
    color: #000;
    text-align: center;
    font-family: HONOR Sans CN;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; 
    transform: rotate(-90deg);
    width: 400px;
    margin-left: -170px;
    margin-top: 178px;
}
.datasetDiv{
    display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;

width: 1104px;
flex: none;
order: 0;
flex-grow: 0;
}
.modelDiv{
    display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
width: 1104px;
height: 76px;
border-radius: 4px;
flex: none;
order: 0;
align-self: stretch;
flex-grow: 0;
}

.sizeInput{
    height: 40px;
    padding: 0px 0px 0px 16px;
    font-family: HONOR Sans CN;
font-style: normal;
font-weight: 400;
font-size: 16px;
line-height: 24px;
color: #B4B9C5;
background: #F2F4F9;
border-radius: 4px;
}
.epsInput{
    display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 24px;
margin-top: 48px;
width: 1104px;
/* height: 1084px; */
flex: none;
order: 2;
align-self: stretch;
flex-grow: 0;
}
.datasetRadioGroup{
    display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 16px;

width: 1104px;
height: 632px;


/* Inside auto layout */

flex: none;
order: 1;
flex-grow: 0;
}
.datasetSizeInput{
    display: flex;
flex-direction: column;
align-items: flex-start;
padding: 12px 24px;
gap: 8px;

width: 1104px;
height: 94px;
flex: none;
order: 2;
flex-grow: 0;
}
.result_div{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px;
    margin-top: 48px;
    width: 960px;
    /* Inside auto layout */
    flex: none;
    order: 0;
    flex-grow: 0
    }
</style>
