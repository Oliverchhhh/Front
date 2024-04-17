<template>
  <div class="dialog">
      <!--外层的遮罩 点击事件用来关闭弹窗，isShow控制弹窗显示 隐藏的props-->
      <div class="dialog-cover back"  v-if="isShow" @click="closeMyself"></div>
      <!-- transition 这里可以加一些简单的动画效果 -->
      <transition name="drop">
          <!--style 通过props 控制内容的样式 -->
          <div class="dialog-content" v-if="isShow" @click.stop="_stopPropagation($event)">
              <div class="dialog_head back">
                  <!--弹窗头部 title-->
                  <div class="close_button">
                      <a-icon type="close" @click="closeMyself" style="font-size: 20px;color:#6C7385;" class="closebutton"/>
                  </div>
                  <slot name="header">
                    <div class="dialog-title"><img src="../../assets/img/modelEvaIcon.png" style="width: 50px; height: 50px;">模型公平性提升结果报告</div>
                  </slot>
              </div>
              <div class="dialog_main" id="pdfDom" >
              <!--弹窗的内容-->
                  <slot name="main">
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
                        <a-col :span="4">
                          <div class="grid-content-value">{{defenseShow(postData.metrics)}}</div>
                        </a-col>
                        <a-col :span="2">
                          <div class="grid-content-name" style="color:#6C7385">优化算法:</div>
                        </a-col>
                        <a-col :span="4">
                          <div class="grid-content-value">{{postData.algorithmname}}</div>
                        </a-col>
                      </a-row>
                    </div>
                    <!-- 总评分 -->
                    <div class="result_div_notop">
                        <div class="g_score_content">
                            <div class=" main_top_echarts_con_title ">模型公平性提升效果</div>
                            <div class="debias_res">
                                <div class="debias_res_score">
                                    <img src="../../assets/img/beforeDebias.png" style="width: 360px;margin-top: -40px;"/>
                                    <p class="g_score"> {{res.score.bef}}</p>
                                    <p class="g_score_evaluate"> {{ res.score_evaluate.bef }}</p>
                                    <p class="debias_state">提升前</p>
                                </div>
                                <div class="to_aft">
                                    <img src="../../assets/img/toAfter.svg" style="margin-top: -40px;"/>
                                </div>
                                <div class="debias_res_score">
                                    <img src="../../assets/img/afterDebias.png" style="width: 360px;margin-top: -40px;"/>
                                    <p class="g_score"> {{res.score.aft}}</p>
                                    <p class="g_score_evaluate"> {{ res.score_evaluate.aft }}</p>
                                    <p class="debias_state">提升后</p>
                                </div>
                            </div>
                        </div>
                        <div class="conclusion">
                            <p class="result_text">模型公平性提升后的综合评分为{{res.score.aft}}，是一个{{ res.score_con.aft }}的模型</p>
                            <p class="result_annotation">综合评分计算来源是个体公平性和群体公平性两个维度上的评分</p>
                        </div>
                    </div>
                    <!-- 评分详情 -->
                    <div class="result_div_notop" v-if="['German', 'Adult', 'Compas'].indexOf(postData.dataname) >-1">
                        <div class=" main_top_echarts_con_title ">公平性评分详情</div>
                        <div class="two_score">
                            <div class="left_score_label">
                                <P class="score_text">{{ res.consistency_score.aft }}</P>
                                <p class="score_lable">个体公平性评估</p>
                            </div>
                            <div class="center_score_label">
                                <div class="process_bg" ><div class="left_pro" :style="'width:'+res.consistency_score.aft/100*210 +'px'"></div></div>
                                <div class="process_bg" style="margin-left: -4px;"><div class="right_pro" :style="'width:'+res.group_score.aft/100*210 +'px'"></div></div>
                            </div>
                            <div class="right_score_label">
                                <P class="score_text">{{ res.group_score.aft }}</P>
                                <p class="score_lable">群体公平性评估</p>
                            </div>
                        </div>
                        <div class="conclusion" style="height: 80px;">
                            <div class="score_description">
                                <div class="con_score">{{ res.consistency_score.aft }}</div>
                                <div class="result_text" style="line-height: 24px ;display: inline;font-weight: 500;">模型个体公平性指标为{{ res.Consistency.aft }}</div>
                            </div>
                            
                        </div>
                        <div class="conclusion" style="height: 80px;">
                            <div class="score_description">
                                <div class="con_score">{{ res.group_score.aft }}</div>
                                <div class="result_text" style="line-height: 24px ;display: inline;font-weight: 500;">模型经所选公平性评估算法评估后，综合得分为{{ res.group_score.aft }}</div>
                            </div>
                        </div>
                    </div>
                    <!-- 个体得分图 -->
                    <div class="result_div_notop" v-if="['German', 'Adult', 'Compas'].indexOf(postData.dataname) >-1">
                        
                        <div class="echart_title">
                            
                            <div class=" main_top_echarts_con_title ">个体公平性提升得分</div>
                            <p class="title_annotation">个体公平性是统计数据集中相似的个体是否有相似的标签或预测结果</p>
                            
                        </div>
                        <div>
                            <div class="cons_echart_div">
                                <div id = 'consevaBef'></div>
                                <div id = 'consevaAft'></div>
                            </div>
                            <div class="conclusion">
                                <p class="result_text">{{ res.consText }}</p>
                                <p class="result_annotation">个体公平性指标越接近1，模型越公平。</p>
                            </div>
                        </div>
                        
                    </div>
                    
                    
                    <!-- 群体 -->
                    <div class="result_div_notop" v-if="['German', 'Adult', 'Compas'].indexOf(postData.dataname) >-1">
                        <div class="echart_title">
                            
                            <div class=" main_top_echarts_con_title ">模型群体公平性提升</div>
                            <p class="title_annotation">群体公平性是指：根据敏感属性划分各个群体之间在一些目标属性上的差异</p>
                            
                        </div>
                        <div class="group_echarts_div" >

                            <div v-for="(temp,index) in JSON.parse(postData.senAttrList)" class="attr_echarts_div" :key="index">
                                <div class="attr_title_div">
                                    <h3>{{ temp }}</h3>
                                    <p>敏感属性</p>
                                </div>
                                <div class="group_echart_content">
                                    <div  class="model_group_echart"  :id="temp"></div>
                                </div>
                                <div class="conclusion">
                                    <p class="result_text">{{ res.groupText[temp] }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 图片数据集 -->
                    <div class="result_div" v-if="['Cifar10-S', 'CelebA'].indexOf(postData.dataname) >-1">
                        <div class="echart_title">
                            <div class=" main_top_echarts_con_title ">模型公平性提升效果对比图</div>
                        </div>
                        <div class="group_echarts_div">
                            <div  class="model_group_echart"  id="evaBar"></div>
                            <div class="conclusion">
                                <p class="result_text">{{ res.groupText["evaBar"] }}</p>
                            </div>
                        </div>
                    </div>
                    <!-- <a-divider>With Text</a-divider> -->
                    <!-- 数据占比 -->
                    <div class="result_div_notop" v-if="['German', 'Adult', 'Compas'].indexOf(postData.dataname) >-1">
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
                      <div class="heat_content" v-show="flag.nmi">
                          <h3>互信息系数</h3>
                          <div id="NMI" class="heat_canvas" :style="{height:heat_height.nmi}"></div>
                          <div class="conclusion">
                              <p class="result_text">互信息的值大于等于0，值越大表示两个变量之间的依赖关系越强。互信息为0时，表示两个变量相互独立。但是需要注意的是，互信息值的上限取决于两个变量的熵，因此互信息值本身并不具有直接的对比意义。可以使用归一化互信息（Normalized Mutual Information，NMI）进行归一化处理，将其值映射到0到1之间。</p>
                          </div>
                      </div>
                      <div class="heat_content" v-show="flag.pearson">
                          <h3>Pearson相关系数</h3>
                          <div id="person" class="heat_canvas" :style="{height:heat_height.pearson}"></div>
                          <div class="conclusion">
                              <p class="result_text ">Pearson相关系数的取值范围为-1到1。1表示完全正相关，0表示无关，-1表示完全负相关。</p>
                          </div>
                      </div>
                      <div class="heat_content" v-show="flag.spearman">
                      <h3>Spearman秩相关系数</h3>
                          <div id="spearman" class="heat_canvas" :style="{height:heat_height.spearman}"></div>
                          <div class="conclusion" >
                              <p class="result_text ">Spearman秩相关系数的取值范围也为-1到1。1表示完全正单调关系，0表示无单调关系，-1表示完全负单调关系。</p>
                          </div>
                      </div>
                      <div class="heat_content" v-show="flag.kendalltau">
                          <h3>Kendall Tau相关系数</h3>
                          <div id="Kendall" class="heat_canvas" :style="{height:heat_height.kendalltau}"></div>
                          <div class="conclusion">
                              <p class="result_text ">Kendall Tau相关系数的取值范围也为-1到1。1表示完全正序关系，0表示无序关系，-1表示完全负序关系。</p>
                          </div>
                      </div>
                        
                    </div>
                    <div>
                        <a-button @click="getPdf()" style="width:160px;height:40px;margin-bottom:30px;
                        font-size:18px;color:white;background-color:rgb(46, 56, 245);border-radius:8px;">
                        导出报告内容
                        </a-button>
                        <a-button @click="downloadmodel()" style="width:160px;height:40px;margin-bottom:30px;
                        font-size:18px;color:white;background-color:rgb(46, 56, 245);border-radius:8px;display:inline">
                            下载模型
                        </a-button>
                    </div>
                  </slot>
              </div>
          </div>
      </transition>
  </div>
</template>
<script>
import * as echarts from "echarts";
import {drawconseva1, drawbarimproved, drawCorelationHeat, drawPopGraph} from "../../assets/js/drawEcharts.js"
import centerPng from "../../assets/img/center.png"
import secondPng from "../../assets/img/second.png"
export default {
  name:"modelfairnessdebiasDialog",
  components: {
  },
  props: {
    isShow: {
    //弹窗组件是否显示 默认不显示
    type: Boolean,
    default: false,
    required:true, //必须
    },
    result1:{},
    postData:{
    }
  },
  data() {
    return {
      htmlTitle:"模型公平性提升报告",
      res:{
        // 总评分
        "score":{"bef":null,"aft":null},
        // 个体公平性评分
        "consistency_score":{"bef":null,"aft":null},
        // 群体公平性评分
        "group_score":{"bef":null,"aft":null},
        // 评估结论
        "score_con":{"bef":null,"aft":null},
        // 评分段
        "score_evaluate":{"bef":null,"aft":null},
        // 个体公平性得分
        "Consistency":{"bef":null,"aft":null},
        // 个体公平性结论
        "consText":"",
        // 群体公平性得分
        "attrEvaValue":{
          "bef":{},
          "aft":{}
        },
        // 群体公平性评估算法
        "labels":[],
        // 群体公平性结论
        "groupText":{},
      },
      result:{},
      downloadURL:'',
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
      }
    }
  },
  mounted(){
    console.log('model_debias:',this.result1)
    if ("model_debias" in this.result1){
        this.$nextTick(()=>{this.resultPro()})
      
    }
  },
  watch:{
    result1:{
      handler(newValue, oldValue){
        console.log('model_debias:',this.result1)
        if ("model_debias" in newValue){
            this.$nextTick(()=>{this.resultPro()})
        }
      }
    }
  },
  methods: {
    
    closeMyself() {
      this.$emit("on-close");
      //如果需要传参的话，可以在"on-close"后面再加参数，然后在父组件的函数里接收就可以了。
    },
    _stopPropagation(ev){
      var _this = this;
      ev.stopPropagation();
    },
    defenseShow(method="[]"){
      let param = JSON.parse(method);
      return param.join('、');
    },
    // 下载模型
    downloadmodel(){
      if (confirm("您确认下载模型？") ) {
          let param = new FormData();       // 创建form对象    
          let file = this.downloadURL
          param.append('file', file);       // 通过append向form对象添加数据
          param.append("type", 'dictionary'); // 添加form表单中其他数据
          let post_file = param;
          let config = {
              headers: {'Content-Type': 'multipart/form-data'},
              responseType: "blob"
          };
          this.$axios.post("/Task/DownloadData", post_file, config).then((res)=>{
              console.log(res);
              var zipName = "download.pth"; // 下载的文件名
              // let blob = new Blob([res.data], { type: "application/zip" }); // 下载格式为zip
              let blob = new Blob([res.data], { type: "application/octet-stream" });
              if ("download" in document.createElement("a")) {
                  let elink = document.createElement("a"); // 创建一个<a>标签
                  elink.style.display = "none"; // 隐藏标签
                  elink.href = window.URL.createObjectURL(blob); // 配置href
                  elink.download = zipName;
                  elink.click();
                  URL.revokeObjectURL(elink.href); // 释放URL 对象
                  document.body.removeChild(elink); // 移除<a>标签
              } else {
              //IE10+
              navigator.msSaveBlob(blob, zipName);
              }
          }).catch((err)=>{
              console.log(err)
          })
      }
    },
    resultPro(){
            this.res.labels = []
            if (["German","Adult","Compas"].indexOf(this.postData.dataname) > -1){
              this.result = this.result1.model_debias;
            }else{
                this.result = this.result1
            }
            if ("Consistency" in this.result){
                this.res["score"]["bef"] = parseInt(this.result["Overall fairness"][0]*100);
                this.res["score"]["aft"] = parseInt(this.result["Overall fairness"][1]*100);
                this.downloadURL = this.result["Overall model path"]
            }else{
                this.res["score"]["bef"] = parseInt(this.result["model_evaluate"]["Overall fairness"]*100)
                this.res["score"]["aft"] = parseInt(this.result["model_debias"]["Overall fairness"]*100)
                this.downloadURL = this.result["model_debias"]["Overall model path"]
            }
            // 总分判断
            if(this.res.score.bef > 80){
                this.res.score_evaluate['bef'] = "优秀";
                this.res.score_con['bef'] = "公平";
            }else if(this.res.score.bef > 60 && this.res.score.bef <=80){
                this.res.score_evaluate['bef'] = "良好";
                this.res.score_con['bef'] = "较公平";
            }else{
                this.res.score_evaluate['bef'] = "差";
                this.res.score_con['bef'] = "较不公平";
            }
            // 提升后总分判断
            if(this.res.score.aft > 80){
                this.res.score_evaluate['aft'] = "优秀";
                this.res.score_con['aft'] = "公平";
            }else if(this.res.score.aft > 60 && this.res.score.aft <=80){
                this.res.score_evaluate['aft'] = "良好";
                this.res.score_con['aft'] = "较公平";
            }else{
                this.res.score_evaluate['aft'] = "差";
                this.res.score_con['aft'] = "较不公平";
            }
            if("Consistency" in this.result){
                this.res["consistency_score"]['bef'] = parseFloat(this.result["Overall individual fairness"][0]).toFixed(2)*100;
                this.res["consistency_score"]['aft'] = parseFloat(this.result["Overall individual fairness"][1]).toFixed(2)*100;
                this.res["group_score"]['bef'] =  parseFloat(this.result["Overall group fairness"][0]).toFixed(2)*100;
                this.res["group_score"]['aft'] =  parseFloat(this.result["Overall group fairness"][1]).toFixed(2)*100;
                this.res["Consistency"]['bef']=(parseFloat(this.result.Consistency[0]*100)).toFixed(2);
                this.res["Consistency"]['aft']=(parseFloat(this.result.Consistency[1]*100)).toFixed(2);
                this.res["Proportion"]=this.result.Proportion;
                let cons_sub = (this.res["Consistency"]['aft'] - this.res["Consistency"]['bef']).toFixed(2);
                //得分图
                drawconseva1("consevaBef",this.res["Consistency"]["bef"], '#0B55F4', "Original");
                drawconseva1("consevaAft",this.res["Consistency"]["aft"], '#0B55F4', "Improved");
                
                this.res.consText = "模型个体公平性提升前得分为" + this.res.Consistency.bef + ",提升后的得分为" + this.res.Consistency.aft + "共提升了" + cons_sub + "分。";
            
                //直方图
                // 初始化群体公平性
                for(let attrTemp of JSON.parse(this.postData.senAttrList)){
                    this.res.attrEvaValue['bef'][attrTemp] = [];
                    this.res.attrEvaValue['aft'][attrTemp] = [];
                };
                // 群体评估数据整合
                for(var key in this.result){
                    if (key == "Consistency"|| key == "Proportion" || key == "Corelation coefficients"|| key == "stop" || key.indexOf("Overall") != -1 || key.indexOf("score") != -1){
                        continue;
                    }
                    else{
                        this.res.labels.push(key);
                        for (let attrTemp in this.result[key][0]){
                            this.res.attrEvaValue['bef'][attrTemp].push(parseFloat(this.result[key][0][attrTemp]).toFixed(2));
                        };
                        for (let attrTemp in this.result[key][1]){
                            this.res.attrEvaValue['aft'][attrTemp].push(parseFloat(this.result[key][1][attrTemp]).toFixed(2));
                        }
                    }
                }
                // 画图
                for(let attrTemp of JSON.parse(this.postData.senAttrList)){
                    drawbarimproved(attrTemp, this.res.attrEvaValue['bef'][attrTemp], this.res.attrEvaValue['aft'][attrTemp], this.res.labels, "群体公平性评估指标");
                    this.res.groupText[attrTemp]="本次测试敏感属性为"+attrTemp+"，目标属性为"+this.postData.tarAttrList.toString()+"\
                    ，直方图根据"+ this.res.labels.toString()+"算法评估结果绘制。"
                }
                // 占比图
                var data = {
                    id: "center_"+this.postData.dataname,
                    label: this.postData.dataname,
                    population: 1,
                    children: []};
                
                for (let key in this.result.Proportion){
                    var second_children={
                        id:"second_"+key,
                        label:key,
                        population:1,
                        children:[]
                    };
                    for( let key1 in this.result.Proportion[key]){
                        var third_children={
                        id:key+'_'+key1,
                        label:key1,
                        population:parseFloat(this.result.Proportion[key][key1]).toFixed(3),
                        isLeaf: true,
                        };
                        second_children["children"].push(third_children);
                    }
                    data["children"].push(second_children);
                }
                drawPopGraph("pro_tree", data, centerPng, secondPng)
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
            }
            else{
                this.res.attrEvaValue['bef'] = [];
                this.res.attrEvaValue['aft'] = [];
                // 群体评估数据整合
                for(var key in this.result["model_debias"]){
                    if (key == "Consistency"|| key == "Proportion" || key == "Corelation coefficients"|| key == "stop" || key.indexOf("Overall") != -1 || key.indexOf("score") != -1){
                        continue;
                    }
                    else{
                        this.res.labels.push(key);
                        this.res.attrEvaValue['bef'].push(this.result["model_evaluate"][key].toFixed(2));
                        this.res.attrEvaValue['aft'].push(this.result["model_debias"][key].toFixed(2));
                    }
                }
                // 画图
                drawbarimproved("evaBar", this.res.attrEvaValue['bef'], this.res.attrEvaValue['aft'], this.res.labels, "群体公平性评估指标");
                this.res.groupText["evaBar"]="本次测试结果如上，直方图根据"+ this.res.labels.toString()+"算法评估结果绘制。"
            }
        },
  }
}
</script>

<style scoped>
/* 最外层 设置position定位 */
.dialog {
position: relative;
color: #e7e5e6;
font-size: 16px;
}
/* 遮罩 设置背景层，z-index值要足够大确保能覆盖，高度 宽度设置满 做到全屏遮罩 */
.dialog-cover {
background: rgba(68, 68, 68, 0.8);
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
z-index:1;
}
.close_button{
  height: 40px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  float: right;
}
/* 内容层 z-index要比遮罩大，否则会被遮盖， */
.dialog-content{
position: fixed;
top: 10px;
width: 1080px;
left: 420px;
bottom: 5px;
/* 移动端使用felx布局 */
display: flex;
flex-direction: column;
justify-content: start;
align-items: center;
z-index: 2001;
color: rgb(0, 0, 0);
overflow: scroll;
background: #FFFFFF;
box-shadow: 0px 8px 20px rgba(44, 51, 67, 0.06);
border-radius: 8px;
}
/* 标题框样式 */
.dialog_head{
  width: 1080px;
  left: 0px;
  top: 1px;
  height: 88px;
  padding: 24px 18px 24px 24px;
  border-bottom: 1px solid #E0E3EB;
}
.dialog_main{
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  position: absolute;
  width: 1080px;
  left: 0px;
  top: 89px;
  gap: 60px;
}

.dialog-title{
  width: 350px;
  height: 36px;
  font-family: 'HONOR Sans CN';
  font-size: 24px;
  color: #333333;
  letter-spacing: 0;
  line-height: 48px;
  font-weight: 600;
}
.result-title {
  margin-top: 30px;
  font-family: 'HONOR Sans CN';
  font-size: 28px;
  color: #000;
  letter-spacing: 0;
  font-weight: 700;
  text-align: center;
}
.content_div{
  display: flex;
  gap: 40px;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
}
.g_score_content{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    align-self: stretch;
}
.g_score{
    margin-top: -280px;
}
.g_score_evaluate{
    margin-left: 156px;
}
.debias_res{
    display: flex;
    width: 814px;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    row-gap: 20px;
    flex-wrap: wrap;
}
.debias_res_score{
    width: 360px;
    height: 321px;
    flex-shrink: 0;
}
.to_aft{
    width: 78px;
    height: 35px;
    flex-shrink: 0;
}
.debias_state{
    color: #000;
    text-align: center;
    font-family: HONOR Sans CN;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    margin-top: 100px;
}
.conclusion{
    margin-bottom: 0px;
}
#consevaBef{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;
    height: 320px;
}
#consevaAft{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;
    height: 320px;
}
.model_group_echart{
    width: 960px;
    height: 358px;
}
/* 占比图画布大小 */
#pro_tree{
    width: 960px;
    height: 600px;
    /* min-height: 200px;
    max-height: 600px; */
}
/* 热力图画布大小 */
.heat_canvas{
    width: 960px;
}
.cons_echart_div{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 84px;
    align-self: stretch;
}
.dialog_publish_main{
align-items: center;
flex-direction: column;
position: absolute;
display: flex;
width: 1080px;
gap: 60px;
}
</style>