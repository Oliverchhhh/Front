<template>
     <div>
        <a-layout>
            <!-- 顶部菜单栏 -->
        <a-layout-header>
            <!-- 导航栏 -->
            <div class="nav">
            <div class="icon_title"> 
                <img :src="require('../assets/img/index_icon.png')">
                <p class="title_des"> AI安全理论及验证平台</p>
            </div>
            <div class="top_nav">
                <a-menu v-model="current" mode="horizontal">
                    <a-menu-item key="index" class='menu-item'> <a href="/" >平台介绍</a> </a-menu-item>
                    <a-menu-item key="join" class='menu-item'> <router-link to="/homme_menu" target="_blank" rel="noopener noreferrer">在线体验 </router-link></a-menu-item>
                    <a-menu-item class='menu-item' v-show="username==''" key="login" @click="clicklogin()">登录/注册</a-menu-item>
                    <a-sub-menu v-show="username != ''" >
                        <span slot="title" class='menu-item sub-title' ><span>{{username}}</span></span>
                        <a-menu-item key='taskList' class='sub-menu-item' ><router-link to="/taskList" >任务中心</router-link></a-menu-item>
                        <a-menu-item key='loginout' class='sub-menu-item' @click="loginout()">注销</a-menu-item>
                    </a-sub-menu>
                </a-menu>
            </div>
        </div>
        </a-layout-header>
        <a-layout-content>
            <template>
                <div class="tasktable">
                    <a-table :columns="columns" 
                    :data-source="info" 
                    :scroll="{ x: 1080, y: 600 }"
                    >
                        <div
                            slot="filterDropdown"
                            slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                            style="padding: 8px"
                            >
                            <a-input
                                v-ant-ref="c => (searchInput = c)"
                                :placeholder="`Search ${column.dataIndex}`"
                                :value="selectedKeys[0]"
                                style="width: 188px; margin-bottom: 8px; display: block;"
                                @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                                @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
                            />
                            <a-button
                                type="primary"
                                icon="search"
                                size="small"
                                style="width: 90px; margin-right: 8px"
                                @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
                            >
                                Search
                            </a-button>
                            <a-button size="small" style="width: 90px" @click="() => handleReset(clearFilters)">
                                Reset
                            </a-button>
                        </div>
                        <a-icon
                            slot="filterIcon"
                            slot-scope="filtered"
                            type="search"
                            :style="{ color: filtered ? '#108ee9' : undefined }"
                        />
                        <template slot="customRender" slot-scope="text, record, index, column">
                            <span v-if="searchText && searchedColumn === column.dataIndex">
                                <template
                                v-for="(fragment, i) in text
                                    .toString()
                                    .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
                                >
                                <mark
                                    v-if="fragment.toLowerCase() === searchText.toLowerCase()"
                                    :key="i"
                                    class="highlight"
                                    >{{ fragment }}</mark
                                >
                                <template v-else>{{ fragment }}</template>
                                </template>
                            </span>
                            <template v-else>
                                {{ text }}
                            </template>
                        </template>
                        <span slot="action" slot-scope="text,record">
                            <a-button size="small" @click="getResult(record)">评估结果</a-button>
                            <a-divider type="vertical" />
                            <a-button size="small" @click="getLog(record)">日志</a-button>
                            <a-divider type="vertical" />
                            <a-button size="small" @click="deleteRecord(record)">删除</a-button>                        
                        </span>
                    </a-table>
                    <a-tooltip placement="bottom">
                        <template slot="title">
                            刷新
                        </template>
                        <a-button shape="circle" icon="redo" style="top:-47px;right: -519px;" @click="queryTask()" />
                    </a-tooltip>
                    
                    <!-- <a-button shape="circle" icon="redo" size="small" style="top:-50px;right: -140px;" @click="queryTask()"/> -->
                </div>
            </template>
            <a-modal
                title="日志"
                :visible="logshow"
                @ok="() => setlogshow(false)"
                @cancel="() => setlogshow(false)"
                >
                <div v-for="(temp,subid) in logtext">
                    <span>{{subid}}</span>
                    <p v-for="text in temp"> {{ text }}</p>
                </div>
            </a-modal>
            <AdvAttackEval v-if="'adv_attack' in result" :is-show="resultshow" :result="result" :postData="postData" @on-close="() => { resultshow = !resultshow }">
            </AdvAttackEval>
            <LLMAttackEval v-if="'LLM_attack' in result" :is-show="resultshow" :result="result" :postData="postData" @on-close="() => { resultshow = !resultshow }">
            </LLMAttackEval>
            <CrowdDefenseEval v-if="'Defense_Ensemble' in result" :is-show="resultshow" :result="result" :postData="postData" @on-close="() => { resultshow = !resultshow }">
            </CrowdDefenseEval>
            <AdvAttackDefenseEval v-if="'attack_defense' in result" :is-show="resultshow" :result="result" :postData="postData" @on-close="() => { resultshow = !resultshow }">
            </AdvAttackDefenseEval>
            <autoAdvAttackEval v-if="'Auto_Attack' in result" :is-show="resultshow" :result="result" :postData="postData" @on-close="() => { resultshow = !resultshow }">
            </autoAdvAttackEval>
            <BackdoorEval v-if="'backdoor_attack' in result" :is-show="resultshow" :result="result" :postData="postData" @on-close="() => { resultshow = !resultshow }">
            </BackdoorEval>
            <ModelFairnessEvaEval v-if="'model_evaluate' in result && !('model_debias' in result)" :is-show="resultshow" :result1="result" :postData="postData" @on-close="() => { resultshow = !resultshow }">
            </ModelFairnessEvaEval>
            <ModelFairnessDebiasEval v-if="'model_debias' in result" :is-show="resultshow" :result1="result" :postData="postData" @on-close="() => { resultshow = !resultshow }">
            </ModelFairnessDebiasEval>
            <DateFairnessDebiasEval v-if="'data_debias' in result" :is-show="resultshow" :result1="result" :postData="postData" @on-close="() => { resultshow = !resultshow }">
            </DateFairnessDebiasEval>
            <ModelReachEval v-if="'model_reach' in result" :is-show="resultshow" :result="result" :postData="postData" @on-close="() => { resultshow = !resultshow }">
            </ModelReachEval>
            <DateFairnessEvaEval v-if="'date_evaluate' in result" :is-show="resultshow" :result1="result" :postData="postData" @on-close="() => { resultshow = !resultshow }">
            </DateFairnessEvaEval>
            <ModelConsistencyEval v-if="'model_consistency' in result" :is-show="resultshow" :result="result" :postData="postData" @on-close="() => { resultshow = !resultshow }">
            </ModelConsistencyEval>
            <ModelAutoVerifyEval v-if="'auto_verify' in result" :is-show="resultshow" :result="result" :postData="postData" @on-close="() => { resultshow = !resultshow }">
            </ModelAutoVerifyEval>
            <ConcolicEval v-if="'Concolic' in result" :is-show="resultshow" :result="result" :postData="postData" @on-close="() => { resultshow = !resultshow }">
            </ConcolicEval>
            <EnvTestEval v-if="'EnvTest' in result" :is-show="resultshow" :result="result" :postData="postData" @on-close="() => { resultshow = !resultshow }">
            </EnvTestEval>
            <DataCleanEval v-if="'DataClean' in result" :is-show="resultshow" :result="result" :postData="postData" @on-close="() => { resultshow = !resultshow }">
            </DataCleanEval>
            <CoverageNeuralEval v-if="'CoverageNeural' in result" :is-show="resultshow" :result="result" :postData="postData" @on-close="() => { resultshow = !resultshow }">
            </CoverageNeuralEval>
            <CoverageLayerEval v-if="'CoverageLayer' in result" :is-show="resultshow" :result="result" :postData="postData" @on-close="() => { resultshow = !resultshow }">
            </CoverageLayerEval>
            <CoverageImportanceEval v-if="'CoverageImportance' in result" :is-show="resultshow" :result="result" :postData="postData" @on-close="() => { resultshow = !resultshow }">
            </CoverageImportanceEval>
            <DeepSstEval v-if="'DeepSst' in result" :is-show="resultshow" :result="result" :postData="postData" @on-close="() => { resultshow = !resultshow }">
            </DeepSstEval>
            <DeepLogicEval v-if="'DeepLogic' in result" :is-show="resultshow" :result="result" :postData="postData" @on-close="() => { resultshow = !resultshow }">
            </DeepLogicEval>
            <FrameworkTestEval v-if="'FrameworkTest' in result" :is-show="resultshow" :result="result" :postData="postData" @on-close="() => { resultshow = !resultshow }">
            </FrameworkTestEval>
            <ModelMeasureEval v-if="'ModelMeasure' in result" :is-show="resultshow" :result="result" :postData="postData" @on-close="() => { resultshow = !resultshow }">
            </ModelMeasureEval>
            <ExMethodEval v-if="'attack_dim_reduciton' in result || 'attack_attrbution_analysis' in result" :is-show="resultshow" :result="result" :postData="postData" @on-close="() => { resultshow = !resultshow }">
            </ExMethodEval>
            <ModularDevelopEval v-if="'ModularDevelop' in result" :is-show="resultshow" :result="result" :postData="postData" @on-close="() => { resultshow = !resultshow }">
            </ModularDevelopEval>
            <SideEval v-if="'side' in result" :is-show="resultshow" :result="result" :postData="postData" @on-close="() => { resultshow = !resultshow }">
            </SideEval>
            <modelRobustVerifyEval v-if="'formal_verification' in result" :is-show="resultshow" :result="result" :postData="postData" @on-close="() => { resultshow = !resultshow }">
            </modelRobustVerifyEval>
            <backdoorDefenseEval v-if="'backdoor_defense' in result" :is-show="resultshow" :result="result" :postData="postData" @on-close="() => { resultshow = !resultshow }">
            </backdoorDefenseEval>
            <!-- 关键参数微调鲁棒性训练 -->
            <resultDialog  @on-close="() => { resultshow = !resultshow }"
               :isShow="resultshow" 
               v-if="'RiFT' in result"
               >
                <div slot="header">
                    <div class="dialog_title">
                        <img class="paramIcom" src="../assets/img/robustTrainingIcon.png" >
                        <h1>关键参数微调鲁棒性训练</h1>
                    </div>
                </div>
                <div class="dialog_publish_main" slot="main" id="pdfDom">
                    <!-- 图表 -->
                    <div class="result_div">
                        <div class="conclusion_info">
                            <!-- 显示输入信息：检测类型、数据集/清洗类型 -->
                            <p class="result_annotation">数据集：{{ postData.dataset }}</p>
                            <p class="result_annotation">模型：{{ postData.modelname }}</p>
                            <p class="result_annotation">对抗训练方法：{{ postData.attack_method }}</p>
                            <p class="result_annotation">攻击方法：{{ postData.evaluate_methods }}</p>
                            <p class="result_annotation">正常训练次数：{{ postData.train_epoch }}</p>
                            <p class="result_annotation">训练时的批量大小：{{ postData.at_epoch }}</p>
                            <p class="result_annotation">对抗训练次数：{{ postData.batchsize }}</p>
                        </div>
                        <div class=" main_top_echarts_con_title ">关键参数微调鲁棒性训练效果</div>
                        <div id="rdeva">
                            <div style="width: 1000px; height: 500px;" id="adv_robust_result"></div>
                            <div class="conclusion">
                                <p class="result_text">{{ postData.modelname }}模型、{{ postData.dataset }}数据集，用关键参数微调鲁棒性训练方法提高模型鲁棒性，模型分类精度得到明显提升。</p>
                            </div>
                        </div>
                    </div>
                    <a-button @click="getPdf()" style="width:160px;height:50px;margin-bottom:30px;margin-top:10px;
                    font-size:18px;color:white;background-color:rgb(46, 56, 245);border-radius:8px;">
                      导出报告内容
                    </a-button>
                </div>
            </resultDialog>
            <resultDialog  @on-close="() => { resultshow = !resultshow }"
               :isShow="resultshow" 
               v-if="'FeatureScatter' in result"
               >
                <div slot="header">
                    <div class="dialog_title">
                        <img class="paramIcom" src="../assets/img/robustTrainingIcon.png" >
                        <h1>特征散射鲁棒性训练</h1>
                    </div>
                </div>
                <div class="dialog_publish_main" slot="main" id="pdfDom">
                    <!-- 图表 -->
                    <div class="result_div">
                        <div class="conclusion_info">
                            <!-- 显示输入信息：检测类型、数据集/清洗类型 -->
                            <p class="result_annotation">数据集：{{ postData.dataset }}</p>
                            <p class="result_annotation">模型：{{ postData.modelname }}</p>
                            <p class="result_annotation">学习率：{{ postData.lr }}</p>
                            <p class="result_annotation">学习率衰减的轮数：{{ postData.decay_epoch }}</p>
                            <p class="result_annotation">学习率衰减的速率：{{ postData.decay_rate }}</p>
                            <p class="result_annotation">最大训练轮数：{{ postData.max_epoch }}</p>
                            <p class="result_annotation">训练时的批量大小：{{ postData.batch_size }}</p>
                        </div>
                        <div class=" main_top_echarts_con_title ">特征散射鲁棒性训练效果</div>
                        <div id="rdeva">
                            <div style="width: 800px; height: 500px;" id="adv_robust_result"></div>
                            <div class="conclusion">
                                <p class="result_text">{{ postData.modelname }}模型、{{ postData.dataset }}数据集，用Feature Scatter方法进行模型鲁棒性训练后模型鲁棒性增强。</p>
                            </div>
                        </div>
                    </div>
                    <a-button @click="getPdf()" style="width:160px;height:50px;margin-bottom:30px;margin-top:10px;
                    font-size:18px;color:white;background-color:rgb(46, 56, 245);border-radius:8px;">
                      导出报告内容
                    </a-button>
                </div>
            </resultDialog>
            <resultDialog  @on-close="() => { resultshow = !resultshow }"
               :isShow="resultshow" 
               v-if="'CNN_AT' in result"
               >
                <div slot="header">
                    <div class="dialog_title">
                        <img class="paramIcom" src="../assets/img/robustTrainingIcon.png" alt="">
                        <h1>CNN对抗训练</h1>
                    </div>
                </div>
                <div class="dialog_publish_main" slot="main" id="pdfDom">
                    <!-- 图表 -->
                    <div class="result_div">
                        <div class="conclusion_info">
                            <!-- 显示输入信息：检测类型、数据集/清洗类型 -->
                            <p class="result_annotation">数据集：{{ postData.dataset }}</p>
                            <p class="result_annotation">模型：{{ postData.modelname }}</p>
                            <p class="result_annotation">对抗训练方法：{{ postData.attackmethod }}</p>
                            <p class="result_annotation">攻击方法：</p>
                            <div class="result_annotation" style="word-wrap: break-word; display: flex; flex-direction: row; flex-wrap: nowrap; justify-content: flex-start;align-items: center;gap: 10px;"> 
                                <p  v-for="(item, index) in postData.evaluate_methods" :key="index">{{ item }}</p>
                            </div>
                            
                        </div>
                        <div class=" main_top_echarts_con_title ">模型对抗训练效果</div>
                        <p class=" echart_title ">训练前后模型受攻击分类准确率</p>
                        <div id="rdeva">
                            <div style="width: 1000px;height: 500px;" id="adv_robust_result1"></div>
                        </div>
                        <p class=" echart_title ">训练前后模型攻击成功率</p>
                        <div id="rdeva">
                            <div style="width: 1000px;height: 500px;" id="adv_robust_result2"></div>
                            <div class="conclusion">
                                <p class="result_text">{{ postData.modelname }}模型、{{ postData.dataset }}数据集，用{{ postData.attackmethod }}对抗训练方法对模型鲁棒性进行提升。</p>
                            </div>
                        </div>
                    </div>
                    <a-button @click="getPdf()" style="width:160px;height:50px;margin-bottom:30px;margin-top:10px;
                    font-size:18px;color:white;background-color:rgb(46, 56, 245);border-radius:8px;">
                      导出报告内容
                    </a-button>
                </div>
            </resultDialog>
            <resultDialog  @on-close="() => { resultshow = !resultshow }"
               :isShow="resultshow" 
               v-if="'SEAT' in result"
               >
                <div slot="header">
                    <div class="dialog_title">
                        <img class="paramIcom" src="../assets/img/robustTrainingIcon.png" alt="">
                        <h1>自我整合鲁棒性训练</h1>
                    </div>
                </div>
                <div class="dialog_publish_main" slot="main" id="pdfDom">
                    <!-- 图表 -->
                    <div class="result_div">
                        <div class="conclusion_info">
                            <!-- 显示输入信息：检测类型、数据集/清洗类型 -->
                            <p class="result_annotation">数据集：{{ postData.dataset }}</p>
                            <p class="result_annotation">模型：{{ postData.modelname }}</p>
                            <p class="result_annotation">学习率：{{ postData.lr }}</p>
                            <p class="result_annotation">训练轮数：{{ postData.epsilon }}</p>
                            <p class="result_annotation">扰动系数：{{ postData.max_epoch }}</p>
                        </div>
                        <div class=" main_top_echarts_con_title ">自我整合鲁棒性训练效果</div>
                        <div id="rdeva">
                            <div style="width: 1000px; height: 500px;" id="adv_robust_result"></div>
                            <div class="conclusion">
                                <p class="result_text">{{ postData.modelname }}模型、{{ postData.dataset }}数据集，用自我整合训练方法进行模型鲁棒性训练，受到对抗样本攻击时模型分类准确率提升。</p>
                            </div>
                        </div>
                    </div>
                    <a-button @click="getPdf()" style="width:160px;height:50px;margin-bottom:30px;margin-top:10px;
                    font-size:18px;color:white;background-color:rgb(46, 56, 245);border-radius:8px;">
                      导出报告内容
                    </a-button>
                </div>
            </resultDialog>
            <resultDialog @on-close="() => { resultshow = !resultshow }"
               :isShow="resultshow" 
               v-if="'AdvTraining_GNN' in result"
               >
                <div slot="header">
                    <div class="dialog_title">
                        <img class="paramIcom" src="../assets/img/robustTrainingIcon.png" alt="">
                        <h1>GCN可信鲁棒训练</h1>
                    </div>
                </div>
                <div class="dialog_publish_main" slot="main" id="pdfDom">
                    <!-- 图表 -->
                    <div class="result_div">
                        <div class="conclusion_info">
                            <!-- 显示输入信息：检测类型、数据集/清洗类型 -->
                            <p class="result_annotation">数据集：{{ postData.dataset }}</p>
                            <p class="result_annotation">批处理大小：{{ postData.batch_size }}</p>
                            <p class="result_annotation">训练集比例：{{ postData.train_size }}</p>
                            <p class="result_annotation">测试集比例：{{ postData.test_size }}</p>
                            <p class="result_annotation">验证集比例：{{ postData.val_size }}</p>  <br>
                            <p class="result_annotation">随机数种子：{{ postData.random_state }}</p>
                            <p class="result_annotation">模型：GCN</p>
                            <p class="result_annotation">最大迭代次数：{{ postData.n_iters }}</p>
                            <p class="result_annotation">全局扰动数量：{{ postData.train_Q }}</p>
                            <p class="result_annotation">鲁棒损失梯度迭代次数：{{ postData.margin_iters }}</p>
                            <p class="result_annotation">属性扰动数量：{{ postData.q_ratio }}</p>
                            <p class="result_annotation">未优化鲁棒损失迭代次数：{{ postData.burn_in }}</p>
                        </div>
                        <div class=" main_top_echarts_con_title ">GCN可认证鲁棒训练效果</div>
                        <div style="width: 1000px; height: 450px;" id="adv_robust_result"></div>
                        <!-- <div class=" main_top_echarts_con_title ">非鲁棒性训练</div> -->
                        <div style="width: 1000px; height: 400px;" id="unadv_robust_result"></div>
                        <div class="conclusion">
                            <p class="result_text">通过鲁棒性训练，系统中抗扰动节点与总节点数量的比例得到提升，表明本鲁棒性训练算法能极大提升系统的鲁棒性和抗攻击性。GNN模型、{{ postData.dataset  }}数据集，用可信鲁棒训练方法进行GCN模型鲁棒性训练，鲁棒性提升了{{result.up}}%。</p>
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
import resultDialog from "../components/resultDialog.vue"
import navmodule from "../components/nav_homme.vue";
import loginDialog from "../components/loginDialog.vue"
import {getCookie} from '../assets/js/cookie.js'
import AdvAttackEval from "./dialog/AdvAttackEval.vue"
import LLMAttackEval from "./dialog/LLMAttackEval.vue"
import CrowdDefenseEval from "./dialog/CrowdDefenseEval.vue"
import AdvAttackDefenseEval from "./dialog/AdvAttackDefenseEval.vue"
import autoAdvAttackEval from "./dialog/autoAdvAttackEval.vue"
import BackdoorEval from "./dialog/BackdoorEval.vue"
import ExMethodEval from "../views/dialog/ExMethodEval.vue"
import ModelFairnessEvaEval from "../views/dialog/ModelFairnessEvaEval.vue"
import ModelFairnessDebiasEval from "../views/dialog/ModelFairnessDebiasEval.vue"
import DateFairnessDebiasEval from "../views/dialog/DateFairnessDebiasEval.vue"
import DateFairnessEvaEval from "../views/dialog/DateFairnessEvaEval.vue"
import ModelReachEval from "../views/dialog/ModelReachEval.vue"
import ModelConsistencyEval from "../views/dialog/ModelConsistencyEval.vue"
import ModelAutoVerifyEval from "../views/dialog/ModelAutoVerifyEval.vue"
import ConcolicEval from "../views/dialog/ConcolicEval.vue"
import EnvTestEval from "../views/dialog/EnvTestEval.vue"
import DataCleanEval from "../views/dialog/DataCleanEval.vue"
import CoverageNeuralEval from "../views/dialog/CoverageNeuralEval.vue"
import CoverageLayerEval from "../views/dialog/CoverageLayerEval.vue"
import CoverageImportanceEval from "../views/dialog/CoverageImportanceEval.vue"
import DeepSstEval from "../views/dialog/DeepSstEval.vue"
import DeepLogicEval from "../views/dialog/DeepLogicEval.vue"
import FrameworkTestEval from "../views/dialog/FrameworkTestEval.vue"
import ModularDevelopEval from "../views/dialog/ModularDevelopEval.vue"
import ModelMeasureEval from "../views/dialog/ModelMeasureEval.vue"
import SideEval from "../views/dialog/SideEval.vue"
import modelRobustVerifyEval from "../views/dialog/modelRobustVerifyEval.vue"
import backdoorDefenseEval from "../views/dialog/backdoorDefenseEval.vue"
import {delCookie} from '../assets/js/cookie.js'
import {DrawRobustBar,initGraph1, initGraph2} from "../assets/js/drawEcharts.js"
export default {
    name:"taskList",
    components:{
        /* 注册组件 */
        navmodule:navmodule,
        loginDialog,
        AdvAttackEval,
        LLMAttackEval,CrowdDefenseEval,AdvAttackDefenseEval,autoAdvAttackEval,BackdoorEval,
        ExMethodEval,ModelFairnessEvaEval,ModelFairnessDebiasEval,DateFairnessDebiasEval,DateFairnessEvaEval,
        ModelReachEval,ModelConsistencyEval,ModelAutoVerifyEval,ConcolicEval,DataCleanEval,
        CoverageNeuralEval,CoverageLayerEval,CoverageImportanceEval,DeepSstEval,ModelMeasureEval,
        DeepLogicEval,FrameworkTestEval,ModularDevelopEval, SideEval,modelRobustVerifyEval,EnvTestEval,
        backdoorDefenseEval,resultDialog,DrawRobustBar
    },
    data(){
        return{
            htmlTitle:"任务中心",
            columns:[
                { title: '任务编号', width: 200, dataIndex: 'taskid', key: 'age', 
                    scopedSlots: {
                        filterDropdown: 'filterDropdown',
                        filterIcon: 'filterIcon',
                        customRender: 'customRender',
                    },
                    onFilter: (value, record) =>
                        record.taskid
                        .toString()
                        .toLowerCase()
                        .includes(value.toLowerCase()),
                    onFilterDropdownVisibleChange: visible => {
                        if (visible) {
                        setTimeout(() => {
                            this.searchInput.focus();
                            }, 0);
                        }
                    }
                },
                { title: '任务状态', dataIndex: 'state', key: '1', width: 120,
                    scopedSlots: {
                        filterDropdown: 'filterDropdown',
                        filterIcon: 'filterIcon',
                        customRender: 'customRender',
                    },
                    onFilter: (value, record) =>
                        record.state
                        .toString()
                        .toLowerCase()
                        .includes(value.toLowerCase()),
                    onFilterDropdownVisibleChange: visible => {
                        if (visible) {
                        setTimeout(() => {
                            this.searchInput.focus();
                            }, 0);
                        }
                    }
                },
                { title: '创建时间', dataIndex: 'createtime', key: '2', width: 100 },
                
                { title: '任务类型', dataIndex: 'tasktype', key: '3',width: 150 , ellipsis:true,
                    scopedSlots: {
                        filterDropdown: 'filterDropdown',
                        filterIcon: 'filterIcon',
                        customRender: 'customRender',
                    },
                    onFilter: (value, record) =>
                        record.tasktype
                        .toString()
                        .toLowerCase()
                        .includes(value.toLowerCase()),
                    onFilterDropdownVisibleChange: visible => {
                        if (visible) {
                        setTimeout(() => {
                            this.searchInput.focus();
                            }, 0);
                        }
                    }
                },
                { title: '任务信息',  dataIndex: 'taskinfo',  key: '4', ellipsis:true,},
                {
                    title: '任务操作',
                    key: 'operation',
                    
                    // width: 180,
                    scopedSlots: { customRender: 'action' },
                },
            ],
            info:[],
            searchText: '',
            searchInput: null,
            searchedColumn: '',
            result:{},
            taskinfo:{},
            logtext:[],
            username:'',
            current: ['taskList'],
            logshow:false,
            resultshow:false,
            postData:{
                DatasetParam:{"name":''},
                ModelParam:{"name":'',"ckpt":null},
                AutoMethod:'flow',
                AdvMethods:[],
                Taskid:''
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
    mounted(){
        this.username = getCookie("username")
        this.queryTask()
    },
    created() {
        document.title = '任务中心';
        },
    methods: { 
        resultProRiFT(res){
            debugger;
            console.log(res)
            let data_ori = res.RiFT.ori;
            let data_rift = res.RiFT.rift;
            data_ori.robust_acc["No Attack"] = data_ori.test_acc;
            data_rift.robust_acc["No Attack"] = data_rift.test_acc;
            DrawRobustBar("adv_robust_result", ["Normal Training", "Robust Training"], Object.keys(data_rift.robust_acc), Object.values(data_ori.robust_acc), Object.values(data_rift.robust_acc))
            // this.result.up = 
        },
        resultProSEAT(res){
            debugger;
            let data = res.SEAT;
            let legend = ["Normal Training", "Robust Training"];
            let xAxis = Object.keys(data);
            xAxis.pop('stop');
            let data_ori = [];
            let data_seat = [];
            for(let i in xAxis){
                data_ori.push(data[xAxis[i]].at);
                data_seat.push(data[xAxis[i]].seat);
            }
            DrawRobustBar("adv_robust_result", legend, xAxis, data_ori, data_seat);
        },
        loginout(){
            delCookie("username")
            setTimeout(function(){
                this.$router.push("/")
            }.bind(this),1000)
        },
        handleSearch(selectedKeys, confirm, dataIndex) {
            confirm();
            this.searchText = selectedKeys[0];
            this.searchedColumn = dataIndex;
        },
        handleReset(clearFilters) {
            clearFilters();
            this.searchText = '';
        },
        setlogshow(flag){
            this.logshow = flag
        },
        setresultshow(flag){
            this.resultshow = flag
        },
        getResult(record){
            this.result={}
            
            var that = this;
            that.$axios.get('/output/Resultdata', {params:{ Taskid: record.taskid }}).then((data)=>{
                that.result=data.data.result;
                that.postData = {}
                for(let temp in data.data.result.param ){
                    for(let item in data.data.result.param[temp]){
                        if (!(item in that.postData)){
                            that.postData[item] =  data.data.result.param[temp][item]
                        }
                    }
                }
                console.log("data.data",data.data.result)
                var stopflag = 1
                for (let temp in data.data.result){
                    if (temp !='tid' && 'stop' in data.data.result[temp] && data.data.result[temp].stop != 1){
                        console.log( 'result stop',data.data.result[temp].stop)
                        stopflag = data.data.result[temp].stop
                        that.$message.warning('所选任务未执行成果！',3);
                        return
                    }
                }
                console.log('stopflag:',stopflag)
                
                if('RiFT' in data.data.result){
                    that.resultProRiFT( data.data.result)
                }
                if('FeatureScatter' in data.data.result){
                    that.resultProFeatureScatter(data.data.result)
                }
                if('CNN_AT' in data.data.result){
                    that.resultProAT(data.data.result)
                }
                if('SEAT' in data.data.result){
                    that.resultProSEAT(data.data.result)
                }
                if('AdvTraining_GNN' in data.data.result){
                    that.resultProAdvTraining_GNN(data.data.result)
                }
                that.setresultshow(stopflag==1)
            });
            
            
        },
        getLog(record){
            var that = this;
            that.$axios.get('/Task/QueryLog', { params: { Taskid:  record.taskid  } }).then((data) => {
                console.log("log:",data);
                that.logtext = data.data.Log
                console.log("logtext:",that.logtext)
            });
            this.setlogshow(true)
            // console.log("logtext1:",this.logtext)
        },
        deleteRecord(record){
            var that = this;
            that.$axios.delete('/Task/DeleteTask', { params: { Taskid:  record.taskid  } }).then((data) => {
                console.log('delete',data)
                if(data.data.code == 1){
                    that.queryTask()
                }
            });
            
        },
        proResult(){
            this.info = []
            const statedict={
                0: "未开始",
                1: "执行中",
                2: "执行成功",
                3: "执行失败"
            }
            const funcinfo ={
                model_evaluate:'模型公平性评估',
                date_evaluate:'数据集公平性评估',
                data_debias:'数据集公平性提升',
                model_debias:'模型公平性提升',
                adv_attack:'对抗攻击评估',
                backdoor_attack:'后门攻击评估',
                attack_dim_reduciton:'数据降维分布解释',
                model_reach:'模型可达性形式化验证',
                model_consistency:'模型一致性形式化验证',
                auto_verify:'模型安全性形式化验证',
                attack_attrbution_analysis:'对抗图像归因解释',
                attack_lime:'多模态黑盒解释',
                attack_defense:'对抗攻击防御',
                Concolic:'测试样本自动生成',
                EnvTest:'系统环境分析与框架适配',
                DataClean:'异常数据检测',
                CoverageNeural:'单神经元覆盖测试准则',
                CoverageLayer:'神经层覆盖测试准则',
                CoverageImportance:'重要神经元覆盖测试准则',
                DeepSst:'敏感神经元测试准则',
                DeepLogic:'逻辑神经元测试准则',
                FrameworkTest:'开发框架安全结构度量',
                ModelMeasure:'模型安全度量',
                ModularDevelop:'模型模块化开发',
                side:'侧信道分析',
                formal_verification:'模型鲁棒性形式化验证',
                Defense_Ensemble:'模型群智化防御',
                Auto_Attack:'模型对抗性测试',
                LLM_attack:'大模型对抗攻击',
                backdoor_defense:'后门攻击防御',
                CNN_AT:'对抗鲁棒训练',
                AdvTraining_GNN:'可认证鲁棒性训练',
                FeatureScatter:'特征散射鲁棒性训练',
                SEAT:'自我整合鲁棒性训练',
                RiFT:'关键参数微调鲁棒性训练'
            }
            let num = 1
            for (let taskid in this.taskinfo){
                let task_time = this.taskinfo[taskid]["createtime"]
                let time_info = task_time.substr(0,4)+"-"+task_time.substr(4,2)+"-"+task_time.substr(6,2)+" "+task_time.substr(8,2)+":"+task_time.substr(10,2)+""
                let children=[]
                let functype = ''
                let functext =''
                for(let func in this.taskinfo[taskid]['function']){
                    functype += funcinfo[this.taskinfo[taskid]['function'][func]['type']] + ' '
                    if ('model' in this.taskinfo[taskid]['function'][func]){
                        functext += '模型：'+ this.taskinfo[taskid]['function'][func]['model'] + ' '
                    }
                    if ('dataset' in this.taskinfo[taskid]['function'][func]){
                        functext += '数据集：'+ this.taskinfo[taskid]['function'][func]['dataset'] + ' '
                    }
                    if ('method' in this.taskinfo[taskid]['function'][func]){
                        functext += '执行算法：'+ this.taskinfo[taskid]['function'][func]['method'] + ' '
                    }
                    if ('def_method' in this.taskinfo[taskid]['function'][func]){
                        functext += '防御算法：'+ this.taskinfo[taskid]['function'][func]['def_method'] + ' '
                    }
                    functext += '\n'
                }
                let temp={key:num,
                    taskid:taskid,
                    state:statedict[this.taskinfo[taskid]['state']],
                    createtime:time_info,
                    tasktype:functype,
                    taskinfo:functext
                 }
                num += 1
                this.info.push(temp)
            }
        },
        resultProFeatureScatter(res){
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
        resultProAT(res){
            debugger;
            let data_ori = res.CNN_AT.Normal;
            let data_robust = res.CNN_AT.Enhance;
            let legend = ["Normal Training", "Robust Training"];
            let xAxis =  Object.keys(data_ori.atk_acc);
            let data_acc_ori = Object.values(data_ori.atk_acc);
            let data_acc_enh = Object.values(data_robust.atk_acc);
            let data_asr_ori = Object.values(data_ori.atk_asr);
            let data_asr_enh = Object.values(data_robust.atk_asr);
            DrawRobustBar("adv_robust_result1", legend, xAxis, data_acc_ori, data_acc_enh);
            DrawRobustBar("adv_robust_result2", legend, xAxis, data_asr_ori, data_asr_enh);
        },
        resultProAdvTraining_GNN(res){
            debugger;
            initGraph1("adv_robust_result",res.AdvTraining_GNN); 
            initGraph2("unadv_robust_result",res.AdvTraining_GNN);
            this.result.up = (res.AdvTraining_GNN.data.robust_test_result.robust_method-res.AdvTraining_GNN.data.robust_test_result.normal_method).toFixed(2)
        },
        /* 获取tasklist */ 
        queryTask(){
            var that = this;
            let postData = {
            }
            that.$axios.get('/Task/QueryTask', {params:postData}).then((data)=>{
                console.log("dataget:",data);
                that.result = data.data;
                that.taskinfo = data.data.TaskList;
                that.proResult()
                
            });
        },
        clicklogin(){
            this.loginShow = true
        },
        clientUserlogin(name, showFlag){
            this.loginShow = showFlag
            this.username = name
            console.log(this.username)
        },
        closeLoginDialog(){
            this.loginShow=false;
        //把绑定的弹窗数组 设为false即可关闭弹窗
        },
    }
}
</script>
<!-- <style  scoped> -->
<style scoped>
.table_head{
    background-color: rgba(70, 79, 111, 1);
    height: 48px;
}
.tasktable{
    width: 1080px;
    height:752px;
    margin-left:400px;
    margin-top:24px
}
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}
.head_text{
    color: rgba(255, 255, 255, 1);
    font-size: 16px;
    font-family: SourceHanSansCN-Medium;
    font-weight: 500;
    text-align: center;
    white-space: nowrap;
    line-height: 21px;
    margin: 15px 0 0 0;
}
.nav{
    /* 导航栏 */
    position: absolute;
    width: 1920px;
    height: 68px;
    left: 0px;
    top: 0px;
    background: rgba(255, 255, 255, 0.6);
    /* 添加icon */
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
}

.icon_title{
    margin-left: 400px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    gap: 15px;
}

.title_des {
    font-family: MiSans;
    font-size: 22px;
    font-weight: 600;
    line-height: 30px;
    letter-spacing: 0px;
    text-align: left;
    color: #0B55F4;
    /* background: #0B55F4; */
}

/* 导航文字样式 */
.top_nav{
    float: right;
    margin-right: 400px;
    width: 280px;
}
.ant-layout-header{
    height:100px
}
/* 导航文字样式 */
.menu-item{
    /* 平台介绍 */
    width: 72px;
    height: 26px;
    font-family: 'Microsoft YaHei';
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 26px;
    margin:21px 0 21px 48px;
}

.menu-item:hover {
    color: #0B55F4;
    border-bottom: none;
    font-weight: 700;
}
.menu-item{
    border-bottom: none;
}
/* 取消组件中的下划线 */
.ant-menu.ant-menu-horizontal{
    border-bottom:none;
}
/* 取消padding */
.menu-item{
    padding: 0 0;
}
.ant-menu-horizontal > .ant-menu-item-selected > a {
    color: #0B55F4;
    font-weight: 700;
}
.ant-menu-item-selected > a, .ant-menu-item-selected > a:hover {
    color: #0B55F4;
}
.menu-item:hover{
    color: #0B55F4;
}
.sub-title{
    line-height:60px
}
.ant-menu-submenu-selected{
    color:#0B55F4;
    border-bottom:0px;
}
.ant-menu-submenu-title:hover {
    color:#0B55F4;
    border-bottom:0px;
}
/* active时的样式 */
.ant-menu-horizontal>.menu-item.is-active{
    color: #0B55F4 ;
    border-bottom: 2px solid #0B55F4;
    font-weight: 700;
} 
.ant-menu{
    background: none;
}
.result_div{
    margin-top: 0;
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
.echart_title{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px 0px;
    gap: 10px;
    isolation: isolate;

    /* width: 960px; */
    height: auto;
    /* Inside auto layout */
    flex: none;
    order: 1;
    flex-grow: 0;
}
</style>
