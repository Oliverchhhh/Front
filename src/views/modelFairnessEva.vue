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
                        <!-- 选数据 -->
                        <fairnessDataset :dataname="dataname" @clientDatasetSelect="clientDatasetSelect"></fairnessDataset>
                        <!-- 选模型 -->
                        <div class="model">
                            <p class="mainParamName"><select-icon :stlye="{width:'4px'}" />请选择模型结构</p>
                            <div style="width: 1104px;margin-bottom: 16px;">
                                <a-upload 
                                action="/fairness/uploadModel"
                                :file-list="fileList"
                                name="ckpt"
                                @change="uploadModel">
                                <div class="uploadModelStyle" >请上传模型</div>
                                </a-upload>
                            </div>
                            <a-radio :style="radioStyle" defaultChecked disabled v-if="['German','Adult','Compas'].indexOf(dataname[dataNameValue]) > -1">
                                3 Hidden-layer FCN
                            </a-radio>
                            <a-radio :style="radioStyle" defaultChecked disabled v-else>
                                Resnet50
                            </a-radio>
                            <p v-if="['German','Adult','Compas'].indexOf(dataname[dataNameValue]) === -1">使用缓存模型
                                <a-switch checked-children="开"  un-checked-children="关" :checked='test_mode' :disabled="retrain_disabled" @change="onChangeSwitch"/>
                            </p>
                        </div>
                        <!-- 选算法 -->
                        <div class="selectMethod">
                            <p class="mainParamName"><select-icon :stlye="{width:'4px'}" />请选择评估算法（可多选）</p>
                            <div class="methodDes">
                                <a-checkbox-group @change="onChangeEvaMethod" :disabled ="['German','Adult','Compas'].indexOf(dataname[dataNameValue]) > -1 ? false: true"> 
                                    <a-row  type="flex" justify="space-around" v-for="index in 8">
                                        <a-col :span="index > 6 ? 12:8" v-for="num in (index > 6 ? 2:3)">
                                            <a-checkbox  v-if="index > 6 && (18+(index-7)*2+num-1<22)" :value=Object.keys(evamethod)[18+(index-7)*2+num-1] >
                                                <div :class="18+(index-7)*2+num-1>17 ? 'checkboxdivlen':'checkboxdiv'" :style="['German','Adult','Compas'].indexOf(dataname[dataNameValue]) > -1 ?'':disablestyle" @mouseenter="checkboxMouseEnter(index, num)" >{{ Object.values(evamethod)[18+(index-7)*2+num-1]["name"] }}</div>
                                            </a-checkbox>
                                            <a-checkbox  v-else-if="index <= 6 " :value=Object.keys(evamethod)[(index-1)*3+num-1] >
                                                <div :class="(index-1)*3+num-1>17 ? 'checkboxdivlen':'checkboxdiv' " :style="['German','Adult','Compas'].indexOf(dataname[dataNameValue]) > -1 ?'':disablestyle" @mouseenter="checkboxMouseEnter(index, num)" >{{ Object.values(evamethod)[(index-1)*3+num-1]["name"] }}</div>
                                            </a-checkbox>
                                            
                                        </a-col>
                                        <transition name="fade">
                                            <a-col :span="24" v-show="methodDesShow[index-1]">
                                                <div class="formulaDes" v-if="rowkey <= 6">
                                                    <span class="formula" v-html="Object.values(evamethod)[rowkey*3+colkey]['formula']"></span>
                                                    <span class="formulaDes" v-html="Object.values(evamethod)[rowkey*3+colkey]['des']"></span>
                                                </div>
                                                <div class="formulaDes" v-else-if="rowkey > 6">
                                                    <span class="formula" v-html="Object.values(evamethod)[18+(rowkey-6)*2+colkey]['formula']"></span>
                                                    <span class="formulaDes" v-html="Object.values(evamethod)[18+(rowkey-6)*2+colkey]['des']"></span>
                                                </div>
                                            </a-col>
                                        </transition>
                                    </a-row>
                                </a-checkbox-group>
                                <div v-for="(methods, i) in imgEvaMethod" :key="i" style="margin-bottom: 16px;">
                                    <a-row :gutter="16" style="height:50px;" type="flex">
                                        <a-col :flex="24 / methods.length" v-for="(method, j) in methods" :key="j" class="denfenseMethod">
                                            <a-button :id="'button' + i + j"  @click="changeMethods(i,j)" :disabled ="['Cifar10-S','CelebA'].indexOf(dataname[dataNameValue]) > -1 ? false: true">{{ method.name }}</a-button>
                                        </a-col>
                                    </a-row>
                                    <div v-if="methodHoverIndex==i && methodDescription !== ''" style="padding:14px 24px;margin-bottom: 16px;"> {{ methodDescription }} </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 日志展示 -->
            <div v-show="logflag">
                <showLog :percent="percent" :logtext="logtext"></showLog>
            </div>
            <!-- 结果展示 -->
            <resultDialog @on-close="closeDialog" :isShow="isShowPublish" v-show="isShowPublish">
                <div slot="header">
                    <div class="dialog_title">
                        <img class="paramIcom" :src="funcDesText.imgpath" :alt="funcDesText.name">
                        <h1>模型公平性评估结果报告</h1>
                    </div>
                </div>
                <div class="dialog_publish_main" slot="main" id="pdfDom">
                    <div v-if="Object.keys(postData).length > 0" style="background: var(--gray-7, #F2F4F9);;width: 100%;padding: 24px;">
                      <a-row >
                        <a-col :span="2">
                          <div class="grid-content-name" style="color:#6C7385">数据集:</div>
        
                        </a-col>
                        <a-col :span="4">
                          <div class="grid-content-value">{{postData.dataname}}</div>

                        </a-col>
                        <a-col :span="2">
                          <div class="grid-content-name" style="color:#6C7385">模型结构:</div>
        
                        </a-col>
                        <a-col :span="4">
                          <div class="grid-content-value">{{postData.modelname}}</div>

                        </a-col>
                        <a-col :span="2">
                          <div class="grid-content-name" style="color:#6C7385">评估算法:</div>
                        </a-col>
                        <a-col :span="10">
                          <div class="grid-content-value">{{defenseShow(postData.metrics)}}</div>
                        </a-col>
                      </a-row>
                    </div>
                    <!-- 总评分 -->
                    <div class="result_div">
                        <div class="g_score_content">
                            <div class="scorebg">
                                <div class=" main_top_echarts_con_title ">模型公平性总评分</div>
                            
                                <p class="g_score">  {{result.score}}</p>
                                <p class="g_score_evaluate"> {{ result.score_evaluate }}</p>
                            </div>
                        </div>
                        <div class="conclusion">
                            <p class="result_text">模型综合评分为{{result.score}}，是一个{{ result.score_con }}的模型</p>
                            <p class="result_annotation">综合评分计算来源是个体公平性和群体公平性两个维度上的评分</p>
                        </div>
                    </div>
                    <!-- 评分详情 -->
                    <div class="result_div" v-if="['German', 'Adult', 'Compas'].indexOf(postData.dataname) >-1">
                        <div class=" main_top_echarts_con_title ">公平性评分详情</div>
                        <div class="two_score">
                            <div class="left_score_label">
                                <P class="score_text">{{ result.consistency_score }}</P>
                                <p class="score_lable">个体公平性评估</p>
                            </div>
                            <div class="center_score_label">
                                <div class="process_bg" ><div class="left_pro" :style="'width:'+result.consistency_score/100*210 +'px'"></div></div>
                                <div class="process_bg" style="margin-left: -4px;"><div class="right_pro" :style="'width:'+result.group_score/100*210 +'px'"></div></div>
                            </div>
                            <div class="right_score_label">
                                <P class="score_text">{{ result.group_score }}</P>
                                <p class="score_lable">群体公平性评估</p>
                            </div>
                        </div>
                        <div class="conclusion" style="height: 80px;">
                            <div class="score_description">
                                <div class="con_score">{{ result.consistency_score }}</div>
                                <div class="result_text" style="line-height: 24px ;display: inline;font-weight: 500;">模型个体公平性指标为{{ result.Consistency }}</div>
                            </div>
                            
                        </div>
                        <div class="conclusion" style="height: 80px;">
                            <div class="score_description">
                                <div class="con_score">{{ result.group_score }}</div>
                                <div class="result_text" style="line-height: 24px ;display: inline;font-weight: 500;">模型经所选公平性评估算法评估后，综合得分为{{ result.group_score }}</div>
                            </div>
                        </div>
                    </div>
                    <!-- 个体得分图 -->
                    <div class="result_div" v-if="['German', 'Adult', 'Compas'].indexOf(postData.dataname) >-1">
                        
                        <div class="echart_title">
                            
                            <div class=" main_top_echarts_con_title ">个体公平性评估得分</div>
                            <p class="title_annotation">个体公平性评估是指评估数据集中相似的个体是否有相似的标签或预测结果</p>
                            
                        </div>
                        <div id="rdeva">
                            <div id = 'conseva'></div>
                            <div class="conseva_label">consistency</div>
                            <div class="conclusion">
                                <p class="result_text">{{ consText }}</p>
                                <p class="result_annotation">个体公平性指标越接近1，模型越公平。</p>
                            </div>
                        </div>
                        
                    </div>
                    
                    
                    <!-- 群体 -->
                    <div class="result_div" v-if="['German', 'Adult', 'Compas'].indexOf(postData.dataname) >-1">
                        <div class="echart_title">
                            
                            <div class=" main_top_echarts_con_title ">模型群体公平性评估</div>
                            <p class="title_annotation">群体公平性是指：根据敏感属性划分各个群体之间在一些目标属性上的差异</p>
                            
                        </div>
                        <div class="group_echarts_div">

                            <div v-for="(temp,index) in senAttrList" class="attr_echarts_div" :key="index">
                                <div class="attr_title_div">
                                    <h3>{{ temp }}</h3>
                                    <p>敏感属性</p>
                                </div>
                                <div class="group_echart_content">
                                    <div  class="model_group_echart"  :id="temp"></div>
                                </div>
                                <div class="conclusion">
                                    <p class="result_text">{{ grouptext[temp] }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 图片数据集 -->
                    <!-- 群体 -->
                    <div class="result_div" v-if="['Cifar10-S', 'CelebA'].indexOf(postData.dataname) >-1">
                        <div class="echart_title">
                            <div class=" main_top_echarts_con_title ">图片数据集评估结果直方图</div>
                        </div>
                        <div class="group_echarts_div">
                            <div  class="model_group_echart"  id="evaBar"></div>
                            <div class="conclusion">
                                <p class="result_text">{{ grouptext["evaBar"] }}</p>
                            </div>
                        </div>
                    </div>
                    <!-- <a-divider>With Text</a-divider> -->
                    <!-- 数据占比 -->
                    <div class="result_div" v-if="['German', 'Adult', 'Compas'].indexOf(postData.dataname) >-1">
                        <div class="echart_title">
                            <div class=" main_top_echarts_con_title ">数据集中各群体的占比</div>
                        </div>
                        <div id="pro_tree"></div>   
                        <div class="conclusion">
                                    <p class="result_text">各群体的占比越均匀，数据集越公平</p>
                                    <p class="result_annotation">子节点面积大小代表占比多少</p>
                        </div>           
                    </div>
                    <!-- 相关性 -->
                    <div class="result_div_notop" v-if="['German', 'Adult', 'Compas'].indexOf(postData.dataname) >-1">
                      <div class="echart_title">
                          <div class=" main_top_echarts_con_title ">数据集的各属性之间的相关性</div>
                          <p class="title_annotation">群体公平性是指：根据敏感属性划分各个群体之间在一些目标属性上的差异</p>
                      </div>
                      <div class="heat_content" v-if="flag.nmi">
                          <h3>互信息系数</h3>
                          <div id="NMI" class="heat_canvas" :style="{height:heat_height.nmi}"></div>
                          <div class="conclusion">
                              <p class="result_text">互信息的值大于等于0，值越大表示两个变量之间的依赖关系越强。互信息为0时，表示两个变量相互独立。但是需要注意的是，互信息值的上限取决于两个变量的熵，因此互信息值本身并不具有直接的对比意义。可以使用归一化互信息（Normalized Mutual Information，NMI）进行归一化处理，将其值映射到0到1之间。</p>
                          </div>
                      </div>
                      <div class="heat_content" v-if="flag.pearson">
                          <h3>Pearson相关系数</h3>
                          <div id="person" class="heat_canvas" :style="{height:heat_height.pearson}"></div>
                          <div class="conclusion">
                              <p class="result_text ">Pearson相关系数的取值范围为-1到1。1表示完全正相关，0表示无关，-1表示完全负相关。</p>
                          </div>
                      </div>
                      <div class="heat_content" v-if="flag.spearman">
                      <h3>Spearman秩相关系数</h3>
                          <div id="spearman" class="heat_canvas" :style="{height:heat_height.spearman}"></div>
                          <div class="conclusion" >
                              <p class="result_text ">Spearman秩相关系数的取值范围也为-1到1。1表示完全正单调关系，0表示无单调关系，-1表示完全负单调关系。</p>
                          </div>
                      </div>
                      <div class="heat_content" v-if="flag.kendalltau">
                          <h3>Kendall Tau相关系数</h3>
                          <div id="Kendall" class="heat_canvas" :style="{height:heat_height.kendalltau}"></div>
                          <div class="conclusion">
                              <p class="result_text ">Kendall Tau相关系数的取值范围也为-1到1。1表示完全正序关系，0表示无序关系，-1表示完全负序关系。</p>
                          </div>
                      </div>
                        
                    </div>
                    <a-button @click="getPdf()" style="width:160px;height:40px;margin-bottom:30px;margin-top:10px;
                    font-size:18px;color:white;background-color:rgb(46, 56, 245);border-radius:8px;">
                    <a-icon type="upload" />  导出报告内容
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
/* 引入组件，公平性数据集选择 */
import fairnessDataset from "../components/fairnessDatasetSelect.vue"
/* 引入组件，日志显示 */
import showLog from "../components/showLog.vue"
/* 引入组件，结果显示 */
import resultDialog from "../components/resultDialog.vue"
/* 引入自定义js，结果显示 */
import {drawclass1pro, drawconseva1, drawbar, drawCorelationHeat, drawPopGraph} from "../assets/js/drawEcharts.js"
// import {getLog} from "../assets/js/getData.js"
/* 引入图片 */
import funcicon from "../assets/img/modelEvaIcon.png"
import bgimg from "../assets/img/modelEvaBackground.png"
import centerPng from "../assets/img/center.png"
import secondPng from "../assets/img/second.png"

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
    name:"modelfairnesseva",
    components:{
        /* 注册组件 */
        navmodule:navmodule,
        func_introduce:func_introduce,
        showLog:showLog,
        resultDialog:resultDialog,
        fairnessDataset:fairnessDataset,
        selectIcon,
    },
    data(){
        return{
            htmlTitle: '模型公平性评估报告',
            stidlist:{},
            fileList:[],
            /* 评估行 */
            rowkey:0,
            colkey:0,
            methodDesShow:[false,false,false,false,false,false,false,false],
            evamethod:{
                "DI":{"name":"Dsiaprate Impact(DI)" ,"formula":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mfrac><mrow><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>1</mn><mo>∣</mo><mi>Z</mi><mo>=</mo><mn>0</mn><mo stretchy="false">)</mo></mrow><mrow><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>1</mn><mo>∣</mo><mi>Z</mi><mo>=</mo><mn>1</mn><mo stretchy="false">)</mo></mrow></mfrac></math>', "des":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>为模型预测结果，</mo><mi>Z</mi><mo>为保护属性（如种族），</mo><mn>0</mn><mo>代表劣势群体（如白人），</mo><mn>1</mn><mo>代表优势群体（如有色人种），</mo><mi>P</mi><mo>为概率，该计算结果越接近</mo><mn>1</mn><mo>，则模型越公平</mo></math>'},
                "DP":{"name":"Demographic Parity(DP)" ,"formula":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mo stretchy="false">|</mo><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>1</mn><mo>∣</mo><mi>Z</mi><mo>=</mo><mn>0</mn><mo stretchy="false">)</mo><mo>−</mo><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>1</mn><mo>∣</mo><mi>Z</mi><mo>=</mo><mn>1</mn><mo stretchy="false">)</mo><mo stretchy="false">|</mo></math>',"des":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>为模型预测结果，</mo><mi>Z</mi><mo>为保护属性（如种族），</mo><mn>0</mn><mo>代表劣势群体（如白人），</mo><mn>1</mn><mo>代表优势群体（如有色人种），</mo><mi>P</mi><mo>为概率，该计算结果越接近</mo><mn>0</mn><mo>，则模型越公平</mo></math>'},
                "FPd":{"name":"False Positive Difference(FPd)" ,"formula":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow data-mjx-texclass="INNER"><mo data-mjx-texclass="OPEN">|</mo><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>≠</mo><mi>Y</mi><mo>∣</mo><mi>Y</mi><mo>=</mo><mn>0</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>0</mn><mo stretchy="false">)</mo><mo>−</mo><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>≠</mo><mi>Y</mi><mo>∣</mo><mi>Y</mi><mo>=</mo><mn>0</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>1</mn><mo stretchy="false">)</mo><mo data-mjx-texclass="CLOSE">|</mo></mrow></math>',"des":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>为模型预测结果，</mo><mi>Z</mi><mo>为保护属性（如种族），</mo><mn>0</mn><mo>代表劣势群体（如白人），</mo><mn>1</mn><mo>代表优势群体（如有色人种），</mo><mi>P</mi><mo>为概率，该计算结果越接近</mo><mn>0</mn><mo>，则模型越公平</mo></math>'},
                "FPr":{"name":"False Positive Ratio(FPr)" ,"formula":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mfrac><mrow><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>≠</mo><mi>Y</mi><mo>∣</mo><mi>Y</mi><mo>=</mo><mn>0</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>0</mn><mo stretchy="false">)</mo></mrow><mrow><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>≠</mo><mi>Y</mi><mo>∣</mo><mi>Y</mi><mo>=</mo><mn>0</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>1</mn><mo stretchy="false">)</mo></mrow></mfrac></math>',"des":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>为模型预测结果，</mo><mi>Z</mi><mo>为保护属性（如种族），</mo><mn>0</mn><mo>代表劣势群体（如白人），</mo><mn>1</mn><mo>代表优势群体（如有色人种），</mo><mi>P</mi><mo>为概率，该计算结果越接近</mo><mn>1</mn><mo>，则模型越公平</mo></math>'},
                "FNd":{"name":"False Negative Difference(FNd)" ,"formula":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow data-mjx-texclass="INNER"><mo data-mjx-texclass="OPEN">|</mo><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>≠</mo><mi>Y</mi><mo>∣</mo><mi>Y</mi><mo>=</mo><mn>1</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>0</mn><mo stretchy="false">)</mo><mo>−</mo><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>≠</mo><mi>Y</mi><mo>∣</mo><mi>Y</mi><mo>=</mo><mn>1</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>1</mn><mo stretchy="false">)</mo><mo data-mjx-texclass="CLOSE">|</mo></mrow></math>',"des":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>为模型预测结果，</mo><mi>Z</mi><mo>为保护属性（如种族），</mo><mn>0</mn><mo>代表劣势群体（如白人），</mo><mn>1</mn><mo>代表优势群体（如有色人种），</mo><mi>P</mi><mo>为概率，该计算结果越接近</mo><mn>0</mn><mo>，则模型越公平</mo></math>'},
                "FNr":{"name":"False Negative Ratio(FNr)" ,"formula":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mfrac><mrow><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>≠</mo><mi>Y</mi><mo>∣</mo><mi>Y</mi><mo>=</mo><mn>1</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>0</mn><mo stretchy="false">)</mo></mrow><mrow><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>≠</mo><mi>Y</mi><mo>∣</mo><mi>Y</mi><mo>=</mo><mn>1</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>1</mn><mo stretchy="false">)</mo></mrow></mfrac></math>',"des":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>为模型预测结果，</mo><mi>Z</mi><mo>为保护属性（如种族），</mo><mn>0</mn><mo>代表劣势群体（如白人），</mo><mn>1</mn><mo>代表优势群体（如有色人种），</mo><mi>P</mi><mo>为概率，该计算结果越接近</mo><mn>1</mn><mo>，则模型越公平</mo></math>'},
                "TPd":{"name":"True Positive Difference(TPd)" ,"formula":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow data-mjx-texclass="INNER"><mo data-mjx-texclass="OPEN">|</mo><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mi>Y</mi><mo>∣</mo><mi>Y</mi><mo>=</mo><mn>0</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>0</mn><mo stretchy="false">)</mo><mo>−</mo><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mi>Y</mi><mo>∣</mo><mi>Y</mi><mo>=</mo><mn>0</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>1</mn><mo stretchy="false">)</mo><mo data-mjx-texclass="CLOSE">|</mo></mrow></math>',"des":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>为模型预测结果，</mo><mi>Z</mi><mo>为保护属性（如种族），</mo><mn>0</mn><mo>代表劣势群体（如白人），</mo><mn>1</mn><mo>代表优势群体（如有色人种），</mo><mi>P</mi><mo>为概率，该计算结果越接近</mo><mn>1</mn><mo>，则模型越公平</mo></math>'},
                "TPr":{"name":"True Positive Ratio(TPr)" ,"formula":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mfrac><mrow><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mi>Y</mi><mo>∣</mo><mi>Y</mi><mo>=</mo><mn>0</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>0</mn><mo stretchy="false">)</mo></mrow><mrow><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mi>Y</mi><mo>∣</mo><mi>Y</mi><mo>=</mo><mn>0</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>1</mn><mo stretchy="false">)</mo></mrow></mfrac></math>',"des":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>为模型预测结果，</mo><mi>Z</mi><mo>为保护属性（如种族），</mo><mn>0</mn><mo>代表劣势群体（如白人），</mo><mn>1</mn><mo>代表优势群体（如有色人种），</mo><mi>P</mi><mo>为概率，该计算结果越接近</mo><mn>1</mn><mo>，则模型越公平</mo></math>'},
                "TNd":{"name":"True Negative Difference(TNd)" ,"formula":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow data-mjx-texclass="INNER"><mo data-mjx-texclass="OPEN">|</mo><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mi>Y</mi><mo>∣</mo><mi>Y</mi><mo>=</mo><mn>1</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>0</mn><mo stretchy="false">)</mo><mo>−</mo><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mi>Y</mi><mo>∣</mo><mi>Y</mi><mo>=</mo><mn>1</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>1</mn><mo stretchy="false">)</mo><mo data-mjx-texclass="CLOSE">|</mo></mrow></math>',"des":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>为模型预测结果，</mo><mi>Z</mi><mo>为保护属性（如种族），</mo><mn>0</mn><mo>代表劣势群体（如白人），</mo><mn>1</mn><mo>代表优势群体（如有色人种），</mo><mi>P</mi><mo>为概率，该计算结果越接近</mo><mn>1</mn><mo>，则模型越公平</mo></math>'},
                "TNr":{"name":"True Negative Ratio(TNr)" ,"formula":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mfrac><mrow><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mi>Y</mi><mo>∣</mo><mi>Y</mi><mo>=</mo><mn>1</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>0</mn><mo stretchy="false">)</mo></mrow><mrow><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mi>Y</mi><mo>∣</mo><mi>Y</mi><mo>=</mo><mn>1</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>1</mn><mo stretchy="false">)</mo></mrow></mfrac></math>',"des":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>为模型预测结果，</mo><mi>Z</mi><mo>为保护属性（如种族），</mo><mn>0</mn><mo>代表劣势群体（如白人），</mo><mn>1</mn><mo>代表优势群体（如有色人种），</mo><mi>P</mi><mo>为概率，该计算结果越接近</mo><mn>1</mn><mo>，则模型越公平</mo></math>'},
                "FOd":{"name":"False Omission Difference(FOd)" ,"formula":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow data-mjx-texclass="INNER"><mo data-mjx-texclass="OPEN">|</mo><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>≠</mo><mi>Y</mi><mo>∣</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>0</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>0</mn><mo stretchy="false">)</mo><mo>−</mo><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>≠</mo><mi>Y</mi><mo>∣</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>0</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>1</mn><mo stretchy="false">)</mo><mo data-mjx-texclass="CLOSE">|</mo></mrow></math>',"des":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>为模型预测结果，</mo><mi>Z</mi><mo>为保护属性（如种族），</mo><mn>0</mn><mo>代表劣势群体（如白人），</mo><mn>1</mn><mo>代表优势群体（如有色人种），</mo><mi>P</mi><mo>为概率，该计算结果越接近</mo><mn>0</mn><mo>，则模型越公平</mo></math>'},
                "FOr":{"name":"False Omission Ratio(FOr)" ,"formula":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mfrac><mrow><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>≠</mo><mi>Y</mi><mo>∣</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>0</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>0</mn><mo stretchy="false">)</mo></mrow><mrow><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>≠</mo><mi>Y</mi><mo>∣</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>0</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>1</mn><mo stretchy="false">)</mo></mrow></mfrac></math>',"des":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>为模型预测结果，</mo><mi>Z</mi><mo>为保护属性（如种族），</mo><mn>0</mn><mo>代表劣势群体（如白人），</mo><mn>1</mn><mo>代表优势群体（如有色人种），</mo><mi>P</mi><mo>为概率，该计算结果越接近</mo><mn>1</mn><mo>，则模型越公平</mo></math>'},
                "FDd":{"name":"False Discovery Difference(FDd)" ,"formula":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow data-mjx-texclass="INNER"><mo data-mjx-texclass="OPEN">|</mo><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>≠</mo><mi>Y</mi><mo>∣</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>1</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>0</mn><mo stretchy="false">)</mo><mo>−</mo><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>≠</mo><mi>Y</mi><mo>∣</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>1</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>1</mn><mo stretchy="false">)</mo><mo data-mjx-texclass="CLOSE">|</mo></mrow></math>',"des":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>为模型预测结果，</mo><mi>Z</mi><mo>为保护属性（如种族），</mo><mn>0</mn><mo>代表劣势群体（如白人），</mo><mn>1</mn><mo>代表优势群体（如有色人种），</mo><mi>P</mi><mo>为概率，该计算结果越接近</mo><mn>0</mn><mo>，则模型越公平</mo></math>'},
                "FDr":{"name":"False Discovery Ratio(FDr)" ,"formula":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mfrac><mrow><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>≠</mo><mi>Y</mi><mo>∣</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>1</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>0</mn><mo stretchy="false">)</mo></mrow><mrow><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>≠</mo><mi>Y</mi><mo>∣</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>1</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>1</mn><mo stretchy="false">)</mo></mrow></mfrac></math>',"des":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>为模型预测结果，</mo><mi>Z</mi><mo>为保护属性（如种族），</mo><mn>0</mn><mo>代表劣势群体（如白人），</mo><mn>1</mn><mo>代表优势群体（如有色人种），</mo><mi>P</mi><mo>为概率，该计算结果越接近</mo><mn>1</mn><mo>，则模型越公平</mo></math>'},
                "PRd":{"name":"Precision Difference(PRd)" ,"formula":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow data-mjx-texclass="INNER"><mo data-mjx-texclass="OPEN">|</mo><mi>P</mi><mo stretchy="false">(</mo><mi>Y</mi><mo>=</mo><mn>1</mn><mo>∣</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>1</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>0</mn><mo stretchy="false">)</mo><mo>−</mo><mi>P</mi><mo stretchy="false">(</mo><mi>Y</mi><mo>=</mo><mn>1</mn><mo>∣</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>1</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>1</mn><mo stretchy="false">)</mo><mo data-mjx-texclass="CLOSE">|</mo></mrow></math>',"des":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>为模型预测结果，</mo><mi>Z</mi><mo>为保护属性（如种族），</mo><mn>0</mn><mo>代表劣势群体（如白人），</mo><mn>1</mn><mo>代表优势群体（如有色人种），</mo><mi>P</mi><mo>为概率，该计算结果越接近</mo><mn>0</mn><mo>，则模型越公平</mo></math>'},
                "F1d":{"name":"F1 Score Difference(F1d)" ,"formula":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow data-mjx-texclass="INNER"><mo data-mjx-texclass="OPEN">|</mo><mfrac><mrow><mn>2</mn><mi>P</mi><mo stretchy="false">(</mo><mi>Y</mi><mo>=</mo><mn>1</mn><mo>∣</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>1</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>1</mn><mo stretchy="false">)</mo><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>1</mn><mo>∣</mo><mi>Y</mi><mo>=</mo><mn>1</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>1</mn><mo stretchy="false">)</mo></mrow><mrow><mi>P</mi><mo stretchy="false">(</mo><mi>Y</mi><mo>=</mo><mn>1</mn><mo>∣</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>1</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>1</mn><mo stretchy="false">)</mo><mo>+</mo><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>1</mn><mo>∣</mo><mi>Y</mi><mo>=</mo><mn>1</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>1</mn><mo stretchy="false">)</mo></mrow></mfrac><mo>−</mo><mfrac><mrow><mn>2</mn><mi>P</mi><mo stretchy="false">(</mo><mi>Y</mi><mo>=</mo><mn>1</mn><mo>∣</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>1</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>0</mn><mo stretchy="false">)</mo><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>1</mn><mo>∣</mo><mi>Y</mi><mo>=</mo><mn>1</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>0</mn><mo stretchy="false">)</mo></mrow><mrow><mi>P</mi><mo stretchy="false">(</mo><mi>Y</mi><mo>=</mo><mn>1</mn><mo>∣</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>1</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>0</mn><mo stretchy="false">)</mo><mo>+</mo><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>1</mn><mo>∣</mo><mi>Y</mi><mo>=</mo><mn>1</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>0</mn><mo stretchy="false">)</mo></mrow></mfrac><mo data-mjx-texclass="CLOSE">|</mo></mrow></math>',"des":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>为模型预测结果，</mo><mi>Z</mi><mo>为保护属性（如种族），</mo><mn>0</mn><mo>代表劣势群体（如白人），</mo><mn>1</mn><mo>代表优势群体（如有色人种），</mo><mi>P</mi><mo>为概率，该计算结果越接近</mo><mn>1</mn><mo>，则模型越公平</mo></math>'},
                "PE":{"name":"Predictive Equality" ,"formula":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>1</mn><mo>∣</mo><mi>Z</mi><mo>=</mo><mn>0</mn><mo>,</mo><mi>Y</mi><mo>=</mo><mn>0</mn><mo stretchy="false">)</mo><mo>−</mo><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>1</mn><mo>∣</mo><mi>Z</mi><mo>=</mo><mn>1</mn><mo>,</mo><mi>Y</mi><mo>=</mo><mn>0</mn><mo stretchy="false">)</mo></math>',"des":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>为模型预测结果，</mo><mi>Z</mi><mo>为保护属性（如种族），</mo><mn>0</mn><mo>代表劣势群体（如白人），</mo><mn>1</mn><mo>代表优势群体（如有色人种），</mo><mi>P</mi><mo>为概率，该计算结果越接近</mo><mn>0</mn><mo>，则模型越公平</mo></math>'},
                
                "EOD":{"name":"Equal Odds" ,"formula":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mstyle displaystyle="false" scriptlevel="0"><munder><mo data-mjx-texclass="OP">∑</mo><mrow><mi>y</mi><mo>∈</mo><mo stretchy="false">(</mo><mn>1</mn><mo>,</mo><mn>0</mn><mo stretchy="false">)</mo></mrow></munder></mstyle></mrow><mrow><mo stretchy="false">|</mo></mrow><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>1</mn><mo>∣</mo><mi>Z</mi><mo>=</mo><mn>0</mn><mo>,</mo><mi>Y</mi><mo>=</mo><mi>y</mi><mo stretchy="false">)</mo><mo>−</mo><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>1</mn><mo>∣</mo><mi>Z</mi><mo>=</mo><mn>1</mn><mo>,</mo><mi>Y</mi><mo>=</mo><mi>y</mi><mo stretchy="false">)</mo><mo stretchy="false">|</mo></math>',"des":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>为模型预测结果，</mo><mi>Z</mi><mo>为保护属性（如种族），</mo><mn>0</mn><mo>代表劣势群体（如白人），</mo><mn>1</mn><mo>代表优势群体（如有色人种），</mo><mi>P</mi><mo>为概率，该计算结果越接近</mo><mn>1</mn><mo>，则模型越公平</mo></math>'},
                "PP":{"name":"Predictive Parity" ,"formula":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mi>P</mi><mo stretchy="false">(</mo><mi>Y</mi><mo>=</mo><mn>1</mn><mo>∣</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>1</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>0</mn><mo stretchy="false">)</mo><mo>−</mo><mi>P</mi><mo stretchy="false">(</mo><mi>Y</mi><mo>=</mo><mn>1</mn><mo>∣</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>1</mn><mo>,</mo><mi>Z</mi><mo>=</mo><mn>1</mn><mo stretchy="false">)</mo></math>',"des":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>为模型预测结果，</mo><mi>Z</mi><mo>为保护属性（如种族），</mo><mn>0</mn><mo>代表劣势群体（如白人），</mo><mn>1</mn><mo>代表优势群体（如有色人种），</mo><mi>P</mi><mo>为概率，该计算结果越接近</mo><mn>0</mn><mo>，则模型越公平</mo></math>'},
                "EOP":{"name":"Equal Opportunity" ,"formula":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>1</mn><mo>∣</mo><mi>Z</mi><mo>=</mo><mn>0</mn><mo>,</mo><mi>Y</mi><mo>=</mo><mn>1</mn><mo stretchy="false">)</mo><mo>−</mo><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>=</mo><mn>1</mn><mo>∣</mo><mi>Z</mi><mo>=</mo><mn>1</mn><mo>,</mo><mi>Y</mi><mo>=</mo><mn>1</mn><mo stretchy="false">)</mo></math>',"des":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>为模型预测结果，</mo><mi>Z</mi><mo>为保护属性（如种族），</mo><mn>0</mn><mo>代表劣势群体（如白人），</mo><mn>1</mn><mo>代表优势群体（如有色人种），</mo><mi>P</mi><mo>为概率，该计算结果越接近</mo><mn>0</mn><mo>，则模型越公平</mo></math>'},
                "OMd":{"name":"Overall Misclassification Difference(OMd)" ,"formula":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow data-mjx-texclass="INNER"><mo data-mjx-texclass="OPEN">|</mo><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>≠</mo><mi>Y</mi><mo>∣</mo><mi>Z</mi><mo>=</mo><mn>0</mn><mo stretchy="false">)</mo><mo>−</mo><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>≠</mo><mi>Y</mi><mo>∣</mo><mi>Z</mi><mo>=</mo><mn>1</mn><mo stretchy="false">)</mo><mo data-mjx-texclass="CLOSE">|</mo></mrow></math>',"des":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>为模型预测结果，</mo><mi>Z</mi><mo>为保护属性（如种族），</mo><mn>0</mn><mo>代表劣势群体（如白人），</mo><mn>1</mn><mo>代表优势群体（如有色人种），</mo><mi>P</mi><mo>为概率，该计算结果越接近</mo><mn>0</mn><mo>，则模型越公平</mo></math>'},
                "OMr":{"name":"Overall Misclassification Ratio(OMr)" ,"formula":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mfrac><mrow><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>≠</mo><mi>Y</mi><mo>∣</mo><mi>Z</mi><mo>=</mo><mn>0</mn><mo stretchy="false">)</mo></mrow><mrow><mi>P</mi><mo stretchy="false">(</mo><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>≠</mo><mi>Y</mi><mo>∣</mo><mi>Z</mi><mo>=</mo><mn>1</mn><mo stretchy="false">)</mo></mrow></mfrac></math>',"des":'<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mover><mi>Y</mi><mo stretchy="false">^</mo></mover></mrow><mo>为模型预测结果，</mo><mi>Z</mi><mo>为保护属性（如种族），</mo><mn>0</mn><mo>代表劣势群体（如白人），</mo><mn>1</mn><mo>代表优势群体（如有色人种），</mo><mi>P</mi><mo>为概率，该计算结果越接近</mo><mn>1</mn><mo>，则模型越公平</mo></math>'}
                },
            imgEvaMethod:[
                [{name:"mPre",description:""},
                {name:"mFPR",description:""},
                {name:"mFNR",description:""},
                {name:"mTNR",description:""},
                ],[
                {name:"mTPR",description:""},
                {name:"mAcc",description:""},
                {name:"mF1",description:""},
                {name:"mBA",description:""},
                ]],
            methodHoverIndex:-1,
            methodDescription:'',
            /* 单选按钮样式 */
            radioStyle: {
                display: 'block',
                lineHeight: '30px',
            },
            /* 热力图height*/
            heat_height:{
        pearson:"213px",
        spearman:"213px",
        kendalltau:"213px",
        nmi:"213px",
      },
      flag:{
        pearson:false,
        spearman:false,
        kendalltau:false,
        nmi:false,
      },
            /* 评估按钮样式和状态 */
            buttonBGColor:{
                background:"#0B55F4",
                color:"#FFFFFF"
            },
            disStatus:false,
            /* 数据占比结论 */
            propTextsub:"",
            /* 日志框是否显示，false不显示，true显示，默认不显示 */
            logflag:false,
            /* 进度 */
            percent:10,
            /* 日志内容 */
            logtext:[],
            dataname:["German","Adult","Compas", "Cifar10-S","CelebA"],
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
                name:"模型公平性评估",
                /* 功能icon，需先引入 */
                imgpath:funcicon,
                /* 功能背景图片，需先引入 */
                bgimg:bgimg,
                /* 功能介绍下的总介绍 */
                destext:"模型预测存在偏见，通过公平性评估功能，可视化展示模型预测的偏见情况",
                /* 背景介绍 */
                backinfo:"数据集中一般会存在偏见，而模型在训练过程中可能会放大训练数据集中的偏见，甚至产生出新的偏见，而这些偏见最终会导致模型产生带有偏见的预测结果。通过模型公平性评估功能可从不同维度评估模型公平性。",
                /* 亮点介绍 */
                highlight:[
                    "支持German，Adult，Compas数据集",
                    "从群体公平性、个体公平性等两个维度评估模型，可视化展示模型公平性",
                    "支持27种公平性评估算法，如：Disparate impact，Demographic parity，Predictive equality……"
                ]
            },
            /* 结果弹窗状态信息 */
            isShowPublish:false,
            /* 个体公平性结论 */
            consText:"",
            /* 群体公平性结论 */
            grouptext:{},
            /* 公平性结果 */
            result:{},
            retrain_disabled:false,
            resultbef:{},
            test_mode:false,
            /* 评估算法选择结果*/
            evaCheckedValues:[],
            evaImgCheckedValues:[],
            modelpath:'',
            /* 日志查询clock*/
            logclk:"", 
            /*主任务id*/ 
            tid:"",
            postData:{},
            response:{},
            disablestyle:{
                'color': 'rgba(0,0,0,.25)',
                'background-color': '#f5f5f5'
            }
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
        document.title = '模型公平性评估';
        },
    // watch:{
    //     response(newValue, oldValue){
    //         console.log('watch:', this.response)
    //         if ("model_evaluate" in newValue){
    //             this.result = JSON.parse(JSON.stringify(this.response.model_evaluate))
    //             this.resultPro(this.result)
    //         }
    //     }
        
    // },
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
        // 防御方法参数显示
        defenseShow(method="[]"){
            let param = JSON.parse(method);
            return param.join('、');
        },
        onChangeSwitch(checked){
            this.test_mode = checked
            
        },
        changeMethods(i, j) {
            // debugger;
            let button = document.getElementById("button" + i + j)
            if (button.style.color == "") {
                this.methodHoverIndex = i
                this.methodDescription = this.imgEvaMethod[i][j].description
                button.style.color = "#0B55F4"
                button.style.background = "#E7F0FD"
                this.evaImgCheckedValues.push(this.imgEvaMethod[i][j].name)
                
            } else {
                this.methodHoverIndex = -1
                this.methodDescription = ""
                button.style.color = ""
                button.style.borderColor = "#C8DCFB"
                button.style.background = "#F2F4F9"
                button.blur()
                this.evaImgCheckedValues.splice(this.evaImgCheckedValues.indexOf(this.imgEvaMethod[i][j].name), 1 )
            }
        },
        /* 获取日志 */ 
        getLog(){
            // debugger
            let data=null
            var that = this;
            if(that.percent < 99){
               that.percent += 1;
            }
            that.$axios.get('Task/QueryLog', { params: { Taskid: that.tid } }).then((data) => {
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
        getData(){
            let data=null
            var that = this;
            that.$axios.get('/output/Resultdata', {params:{ Taskid: that.tid }}).then((data)=>{
                if(data.data.result.tid==that.tid){
                    console.log("dataget:",data);
                    that.resultbef=data;
                }
                
            });
        },
        /* 停止结果获取循环 */ 
        stopTimer() {
            if (this.resultbef.data.stop == 1 && this.resultbef.data.result.tid==this.tid) {
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
                this.response = this.resultbef.data.result;
                this.resultPro(this.response.model_evaluate);
            }
        },
        /* 更新结果*/ 
        update(){
            this.getData();
            try{
                this.stopTimer();
            }catch(err){}
        },
        /* 关闭结果窗口 */
        closeDialog(){
        this.isShowPublish=false;
        // Object.assign(this.$data, this.$options.data.call(this))
        //把绑定的弹窗数组 设为false即可关闭弹窗
        },
        onChangeEvaMethod(checkedValues){
            
            console.log('checked = ', checkedValues);
            this.evaCheckedValues = checkedValues
        },
        disableImgMehod(){
            for (let i in this.imgEvaMethod){
                for(let j in this.imgEvaMethod[i]){
                    let button = document.getElementById("button" + i + j)
                    this.methodHoverIndex = -1
                    this.methodDescription = ""
                    button.style.color = "rgba(0,0,0,.25)"
                    button.style.borderColor = "#C8DCFB"
                    button.style.background = "#f5f5f5"
                    button.blur()
                }
            }
            this.evaImgCheckedValues = []
        },
        ableImgMehod(){
            for (let i in this.imgEvaMethod){
                for(let j in this.imgEvaMethod[i]){
                    let button = document.getElementById("button" + i + j)
                    this.methodHoverIndex = -1
                    this.methodDescription = ""
                    button.style.color = ""
                    button.style.borderColor = "#C8DCFB"
                    button.style.background = "#F2F4F9"
                    button.blur()
                }
            }
            
        },
        // 上传模型
        uploadModel(info){
            let fileList = [...info.fileList];
            fileList = fileList.slice(-1);
            fileList = fileList.map(file => {
                if (file.response) {
                // Component will show file.url as link
                    file.url = "static/"+file.response.filepath
                    file.filepath = file.response.filepath;
                }
                return file;
            });
            this.fileList = fileList;
            if (info.file.status !== 'uploading') {
                console.log(info.fileList)
            }
            if (info.file.status === 'done') {
                if(info.file.response.code === 10000){
                    this.$message.success(`${info.file.name} file uploaded successfully`);
                    this.test_mode = true
                    this.retrain_disabled = true
                    this.modelpath = info.file.response.filepath
                }
            } else if (info.file.status === 'error') {
                this.$message.error(`${info.file.name} file upload failed.`);
            }
            if (info.file.status === 'removed'){
                this.modelpath = ''
                // this.test_mode = true
                this.retrain_disabled = false
            }
        },
        /* 监听数据集选择 */
        clientDatasetSelect(value, senAttrList, tarAttrList, staAttrList){
            this.dataNameValue = value;
            this.senAttrList = senAttrList;
            this.tarAttrList = tarAttrList;
            this.staAttrList = staAttrList;
            if(senAttrList.length==0 || tarAttrList.length==0 || staAttrList.length==0){
                this.buttonBGColor.background = "#C8DCFB";
            }else{
                this.buttonBGColor.background = "#0B55F4";
            };
            if( ["Cifar10-S","CelebA"].indexOf(this.dataname[value]) == -1){
                this.disableImgMehod()
            }else{
                this.ableImgMehod()
                this.buttonBGColor.background = "#0B55F4";
            }
        },

        /* 鼠标移入评估算法解释框显示*/
        checkboxMouseEnter(index, num){
            this.rowkey = index - 1;
            this.colkey = num - 1;
            this.methodDesShow=[false,false,false,false,false,false,false,false];
            this.methodDesShow[this.rowkey]=true;
        },
        /* result 处理*/
        resultPro(res){
            this.result = this.response.model_evaluate
            var that = this;
            
            // 总分判断
            that.result["score"] = parseFloat(res["Overall fairness"]).toFixed(2)*100;
            
            if(that.result.score > 80){
                that.result.score_evaluate = "优秀";
                that.result.score_con = "公平";
            }else if(that.result.score > 60 && that.result.score <=80){
                that.result.score_evaluate = "良好";
                that.result.score_con = "较公平";
            }else{
                that.result.score_evaluate = "差";
                that.result.score_con = "较不公平";
            }
            if ( "Consistency" in that.result){
                that.result["consistency_score"] = parseFloat(res["Overall individual fairness"]).toFixed(2)*100;
                that.result["group_score"] =  parseFloat(res["Overall group fairness"]).toFixed(2)*100;
                that.result["Consistency"]=parseFloat(res.Consistency).toFixed(2) * 100;
                that.result["Proportion"]=res.Proportion;
                
                //得分图
                drawconseva1("conseva",that.result["Consistency"]);
                if( that.result["Consistency"]>0.9 )
                {
                    that.consText="模型的个体公平性得分为"+that.result["Consistency"]+"，高于标准线0.9，故该模型从个体公平性方面分析结果为公平数据集";
                }
                else if( that.result["Consistency"]<=0.9 && that.result["Consistency"]>=0.6 )
                {
                    that.consText="模型的个体公平性得分为"+that.result["Consistency"]+"，高于标准线0.6，故该模型从个体公平性方面分析结果为较公平数据集";
                }
                else( that.result["Consistency"]<0.6 )
                {
                    that.consText="模型的个体公平性得分为"+that.result["Consistency"]+"，低于标准线0.6，故该模型从个体公平性方面分析结果为相对不公平数据集";
                }
                //直方图
                var attrEvaValue={};
                var labels = [];
                // 初始化diflist和ratiolist
                for(let attrTemp of that.senAttrList){
                    attrEvaValue[attrTemp] = [];
                };
                // 群体评估数据整合
                for(var key in res){
                    if (key == "Consistency"|| key == "Proportion" || key == "Corelation coefficients"|| key == "stop" || key.indexOf("Overall") != -1 || key.indexOf("score") != -1){
                        continue;
                    }
                    else{
                        labels.push(key);
                        for (let attrTemp in res[key]){
                            attrEvaValue[attrTemp].push(parseFloat(res[key][attrTemp]).toFixed(2));
                        }
                    }
                }
                // 画图
                for(let attrTemp of that.senAttrList){
                    drawbar(attrTemp,attrEvaValue[attrTemp],labels,"群体公平性评估指标");
                    that.grouptext[attrTemp]="本次测试敏感属性为"+attrTemp+"，目标属性为"+that.tarAttrList.toString()+"\
                    ，直方图根据"+ labels.toString()+"算法评估结果绘制。"
                }
                
                // 热力图
                var personData=[];
                var spearmanData=[];
                var kendallData=[];
                var NMIData=[];
                var pearsonX=[];
                var pearsonY=[];
                var spearmanX=[];
                var spearmanY=[];
                var kendalltauX=[];
                var kendalltauY=[];
                var mutualX=[];
                var mutualY=[];
                for(let temp of this.result["Corelation coefficients"] ){
                    if(temp.values.pearson != null){
                        if(pearsonX.indexOf(temp["attr"]) == -1){
                            pearsonX.push(temp["attr"])
                        }
                        if(pearsonY.indexOf(temp["target"]) == -1){
                            pearsonY.push(temp["target"])
                        }
                        personData.push([pearsonX.indexOf(temp["attr"]), pearsonY.indexOf(temp["target"]) ,parseFloat(temp.values.pearson).toFixed(3)])
                    }
                    if(temp.values.spearman != null){
                        if(spearmanX.indexOf(temp["attr"]) == -1){
                            spearmanX.push(temp["attr"])
                        }
                        if(spearmanY.indexOf(temp["target"]) == -1){
                            spearmanY.push(temp["target"])
                        }
                        spearmanData.push([spearmanX.indexOf(temp["attr"]) ,spearmanY.indexOf(temp["target"]) ,parseFloat(temp.values.spearman).toFixed(3)])
                    }
                    if(temp.values.kendalltau != null){
                        if(kendalltauX.indexOf(temp["attr"]) == -1){
                            kendalltauX.push(temp["attr"])
                        }
                        if(kendalltauY.indexOf(temp["target"]) == -1){
                            kendalltauY.push(temp["target"])
                        }
                        kendallData.push([kendalltauX.indexOf(temp["attr"]), kendalltauY.indexOf(temp["target"]) ,parseFloat(temp.values.kendalltau).toFixed(3)])
                    }
                    if(temp.values.mutual_info != null){
                        if(mutualX.indexOf(temp["attr"]) == -1){
                            mutualX.push(temp["attr"])
                        }
                        if(mutualY.indexOf(temp["target"]) == -1){
                            mutualY.push(temp["target"])
                        }
                        NMIData.push([mutualX.indexOf(temp["attr"]), mutualY.indexOf(temp["target"]), parseFloat(temp.values.mutual_info).toFixed(3)])
                    }
                };
                if (mutualY.length>5){
                    this.heat_height.nmi = 48 * mutualY.length + "px";
                }
                if (kendalltauY.length>5){
                    this.heat_height.kendalltau = 48 * kendalltauY.length + "px";
                }
                if (spearmanY.length>5){
                    this.heat_height.spearman = 48 * spearmanY.length + "px";
                }
                if (pearsonY.length>5){
                    this.heat_height.pearson = 48 * pearsonY.length + "px";
                }
                var NMIColorList=["rgba(206, 221, 253, 1)", "rgba(157, 187, 251, 1)", "rgba(60, 119, 246, 1)", "rgba(11, 85, 244, 1)", "rgba(7, 51, 146, 1)"];
                var spearmanColorList=["rgba(223, 206, 253, 1)", "rgba(191, 157, 251, 1)", "rgba(142, 84, 247, 1)" ,"rgba(94, 11, 244, 1)", "rgba(56, 7, 146, 1)"];
                var kendallColorList=["rgba(253, 227, 206, 1)", "rgba(251, 199, 157, 1)", "rgba(247, 158, 84, 1)", "rgba(244, 116, 11, 1)", "rgba(146, 70, 7, 1)"];
                var personColorList=["rgba(253, 206, 236, 1)", "rgba(251, 157, 218, 1)", "rgba(247, 84, 190, 1)", "rgba(244, 11, 162, 1)", "rgba(195, 9, 130, 1)"];
                // person热力图
                if( NMIData.length > 0 ){
                    this.flag.nmi = true
                    drawCorelationHeat("NMI", mutualX, mutualY, NMIData, NMIColorList);
                }
                if(personData.length > 0){
                    this.flag.pearson = true
                    drawCorelationHeat("person", pearsonX, pearsonY, personData, personColorList);
                }
                if(spearmanData.length > 0){
                    this.flag.spearman = true
                    drawCorelationHeat("spearman", spearmanX, spearmanY, spearmanData, spearmanColorList);
                }
                if(kendallData.length > 0){
                    this.flag.kendalltau = true
                    drawCorelationHeat("Kendall", kendalltauX, kendalltauY, kendallData, kendallColorList);
                }
                // 占比图
                var data = {
                    id: "center_"+that.dataname[that.dataNameValue],
                    label: that.dataname[that.dataNameValue],
                    population: 1,
                    children: []};
                
                for (let key in that.result.Proportion){
                    var second_children={
                        id:"second_"+key,
                        label:key,
                        population:1,
                        children:[]
                    };
                    for( let key1 in that.result.Proportion[key]){
                        var third_children={
                        id:key+'_'+key1,
                        label:key1,
                        population:parseFloat(that.result.Proportion[key][key1]).toFixed(3),
                        isLeaf: true,
                        };
                        second_children["children"].push(third_children);
                    }
                    data["children"].push(second_children);
                }
                
                console.log("centerPng11:",centerPng);
                drawPopGraph("pro_tree", data, centerPng, secondPng)
            }else{
                //直方图
                var attrEvaValue=[];
                var labels = [];
                
                // 群体评估数据整合
                for(var key in res){
                    if (key == "Consistency"|| key == "Proportion" || key == "Corelation coefficients"|| key == "stop" || key.indexOf("Overall") != -1 || key.indexOf("score") != -1){
                        continue;
                    }
                    else{
                        labels.push(key);
                        attrEvaValue.push(parseFloat(res[key]).toFixed(2));
                    }
                }
                // 画图
                drawbar("evaBar", attrEvaValue, labels, "公平性评估指标");
                that.grouptext["evaBar"]="上方式公平性评估指标直方图，根据"+ labels.toString()+"算法评估结果绘制。"
            }
            
            

        },
        initParam(){
            
            this.logtext=[]
            this.percent=0
            this.postData={}
            this.result = {}
            this.resultbef={}
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
            let evaMethod = []
            let modelname="3 Hidden-layer FCN"
            if (["German","Adult","Compas"].indexOf(this.dataname[this.dataNameValue]) > -1){
                evaMethod = this.evaCheckedValues
                /*判断选择*/
                if (this.senAttrList.length ==0 ){
                    this.$message.warning('请在数据集里面至少选择一项敏感属性！',3);
                    return 0;
                };
                if (this.tarAttrList.length ==0 ){
                    this.$message.warning('请在数据集里面选择一项目标属性！',3);
                    return 0;
                };
                if (this.tarAttrList.length >1 ){
                    this.$message.warning('模型公平性评估只能选择一项目标属性！',3);
                    return 0;
                };
                if (this.staAttrList.length ==0 ){
                    this.$message.warning('请在数据集里面至少选择一项统计属性！',3);
                    return 0;
                };
                modelname="3 Hidden-layer FCN"
            }else{
                evaMethod = this.evaImgCheckedValues
                modelname="Resnet50"
            }
            if (evaMethod.length == 0 ){
                this.$message.warning('请在评估算法中至少选择一项评估算法！',3);
                return 0;
            }
            this.logflag = true;
            var that=this;
            that.percent = 20;
            // that.tid = "20230824_1353_c3776a1"
            // that.stidlist =  {"DataFairnessDebias":"S20230825_1420_13ad6a3"};
            // that.tid = "20230824_1354_e2decbd"
            // that.stidlist =  {"DataFairnessDebias":"S20230825_1421_8f3bf6f"};
            // that.postData={
            //     dataname:that.dataname[that.dataNameValue],
            //     senAttrList:JSON.stringify(that.senAttrList),
            //     tarAttrList:that.tarAttrList[0],
            //     staAttrList:JSON.stringify(that.staAttrList),
            //     metrics:JSON.stringify(evaMethod),
            //     modelname:"3 Hidden-layer FCN",
            //     tid:that.tid};
            // that.clk = window.setInterval(() => {
            //     that.update();
            // },6000)
            // return
            /* 调用创建主任务接口 */
            this.$axios.post("/Task/CreateTask",{AttackAndDefenseTask:0}).then((result) => {

                that.tid = result.data.Taskid;
                that.postData={
                dataname:that.dataname[that.dataNameValue],
                senAttrList:JSON.stringify(that.senAttrList),
                tarAttrList:that.tarAttrList[0],
                staAttrList:JSON.stringify(that.staAttrList),
                metrics:JSON.stringify(evaMethod),
                modelname:modelname,
                modelpath:that.modelpath,
                test_mode:that.test_mode,
                tid:that.tid}
                that.percent = 40;
                that.logclk = window.setInterval(() => {
                        that.getLog();
                    },2000)
                that.$axios.post("/ModelFairnessEvaluate",that.postData).then((res) => {
                    console.log(res)
                    /* 同步任务，接口直接返回结果，日志关闭，结果弹窗显示 */
                    that.logflag = true;
                    /* 同步任务，接口直接返回结果，日志关闭，结果弹窗显示 */
                    that.stidlist =  {"ModelFairnessEvaluate":res.data.stid};
                    that.clk = window.setInterval(() => {
                            that.update();
                        },6000)

                }).catch((err) => {
                        console.log(err)
                        window.clearInterval(that.clk)
                        window.clearInterval(that.logclk)
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
.conclusion{
    margin-bottom: 0px;
}
.methodDes{
    width: 1104px;
    /* height: 714px; */
    text-align: center;
}
.checkboxdiv{
    justify-content: center;
    align-items: center;
    padding: 16px 24px;
    gap: 16px;

    width: 360px;
    height: 60px;
    background: #F2F4F9;
    border-radius: 4px;
    font-family: 'HONOR Sans CN';
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 28px;
    color: #000000;
    margin-right: 8px;
}
.checkboxdiv-disabled{
    color: rgba(0,0,0,.25);
    background-color: #f5f5f5;
}
.checkboxdivlen-disabled{
    color: rgba(0,0,0,.25);
    background-color: #f5f5f5;
}
.checkboxdivlen{
    justify-content: center;
    align-items: center;
    padding: 16px 24px;
    gap: 16px;

    width: 544px;
    height: 60px;
    background: #F2F4F9;
    border-radius: 4px;
    font-family: 'HONOR Sans CN';
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 28px;
    color: #000000;
    margin-right: 8px;
}
.ant-checkbox-wrapper-checked .checkboxdiv{
    background: #E7F0FD;
    color: #0B55F4;
}
.ant-checkbox-wrapper-checked .checkboxdivlen{
    background: #E7F0FD;
    color: #0B55F4;
}
/* 复选框间距 */
.ant-checkbox-wrapper{
    margin-bottom: 16px;
}
/* 公式样式 */
.formulaDes{

    margin-bottom: 10px;
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
.formula{
    height:24px;
    width:15px;
    font-family: 'HONOR Sans CN';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
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
flex: none;
order: 0;
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
.denfenseMethod .ant-btn:disabled{
    color: rgba(0,0,0,.25);
    background-color: #f5f5f5;
}
.attr_title_div h3{
    font-family: 'HONORSansCN-Bold';
    flex-direction: column;
    margin-bottom: 0px;
font-size: 28px;
line-height: 36px;
display: flex;
align-items: center;
text-align: center;

color: rgba(0, 0, 0, 0.9);
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
display: flex;
align-items: center;
text-align: center;
color: #6C7385;
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
.model_group_echart{
    width: 960px;
    height: 358px;
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
display: flex;
align-items: center;
text-align: center;
color: rgba(0, 0, 0, 0.9);
flex: none;
order: 0;
flex-grow: 1;
}
/* 热力图画布大小 */
.heat_canvas{
    width: 960px;
}
/* 占比图画布大小 */
#pro_tree{
    width: 960px;
    height: 600px;
}
</style>
