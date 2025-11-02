<template>
  <div class="dialog">
    <!--外层的遮罩 点击事件用来关闭弹窗，isShow控制弹窗显示 隐藏的props-->
    <div class="dialog-cover back" v-if="isShow" @click="closeMyself"></div>
    <!-- transition 这里可以加一些简单的动画效果 -->
    <transition name="drop">
      <!--style 通过props 控制内容的样式 -->
      <div class="dialog-content" v-if="isShow" @click.stop="_stopPropagation($event)">
        <div class="dialog_head back">
          <!--弹窗头部 title-->
          <div class="close_button">
            <a-icon
              type="close"
              @click="closeMyself"
              style="font-size: 20px;color:#6C7385;"
              class="closebutton"
            />
          </div>
          <slot name="header">
            <div class="dialog-title">
              <img src="../../assets/img/modelEvaIcon.png" style="width: 50px; height: 50px;" />攻击机理分析报告
            </div>
          </slot>
        </div>
        <div class="dialog_main" id="pdfDom">
          <!--弹窗的内容-->
          <slot name="main" v-if="mode==='attribution'">
            <div
              v-if="Object.keys(postdata).length > 0"
              style="background: var(--gray-7, #F2F4F9);;width: 100%;padding: 24px;"
            >
              <a-row>
                <a-col :span="2">
                  <div class="grid-content-name" style="color:#6C7385">数据集:</div>
                </a-col>
                <a-col :span="3">
                  <div class="grid-content-value">{{postdata.DatasetParam.name}}</div>
                </a-col>
                <a-col :span="5">
                  <div class="grid-content-name" style="color:#6C7385">特征归因可视化分析方法:</div>
                </a-col>
                <a-col :span="4">
                  <div
                    class="grid-content-value"
                    v-if="postdata.ExMethods.length > 0"
                  >{{defenseShow(postdata.ExMethods)}}</div>
                  <div class="grid-content-value" v-else>未选</div>
                </a-col>
                <a-col :span="2">
                  <div class="grid-content-name" style="color:#6C7385">攻击方法:</div>
                </a-col>
                <a-col :span="8">
                  <div class="grid-content-value">{{defenseShow(postdata.AdvMethods)}}</div>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="2">
                  <div class="grid-content-name" style="color:#6C7385">模型:</div>
                </a-col>
                <a-col :span="3">
                  <div class="grid-content-value">{{postdata.ModelParam.name}}</div>
                </a-col>
                <a-col :span="5">
                  <div class="grid-content-name" style="color:#6C7385">数据分布降维分析方法:</div>
                </a-col>
                <a-col :span="4">
                  <div
                    class="grid-content-value"
                    v-if="postdata['VisMethods'].length > 0 "
                  >{{defenseShow(postdata.VisMethods)}}</div>
                  <div class="grid-content-value" v-else>未选</div>
                </a-col>
                <a-col :span="2" v-if="postdata.Use_layer_explain">
                  <div class="grid-content-name" style="color:#6C7385">模型内部解释算法:</div>
                </a-col>
                <a-col :span="8" v-if="postdata.Use_layer_explain">
                  <div class="grid-content-value">Guided-backpropagation</div>
                </a-col>
              </a-row>
            </div>
            <!-- 总得分 -->
            <div class="result-title" v-if="postdata['ExMethods'].length>0">对抗图像解释</div>
            <!-- 可选择的图像表格 -->
            <div class="selectContent" v-if="postdata['ExMethods'].length>0">请选择展示的图片</div>
            <div style="width: 960px;" v-if="postdata['ExMethods'].length>0">
              <PictureTable
                key="pictable0"
                table-id="table0"
                :header="false"
                :headerRow="false"
                :have-border="true"
                :content="selectPicList"
                :single-output="true"
                :cellWidth="[0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]"
                @pictureSelect="handleSelectPicture"
                class="center-horizon"
                style="height: 100%;width: 960px; margin-bottom: 20px;"
              ></PictureTable>
            </div>
            <div style="width: 960px;" v-if="postdata['ExMethods'].length>0">
              <PictureTable
                key="pictable1"
                table-id="table1"
                :header="true"
                :headerRow="true"
                :have-border="true"
                :content="instanceResultList"
                :single-output="true"
                :cellWidth="advCellWidth"
                :cellHeight="cellHeight"
                class="center-horizon"
                style="height: 100%;width: 960px; margin-bottom: 20px;"
              ></PictureTable>
            </div>

            <!-- 结果展示 箱装图 -->
            <div v-if="postdata['ExMethods'].length>0">
              <div class="result-subtitle">对抗解释图与正常解释图之间的相似度分数</div>
              <div id="myChart1" class="echart" v-if="postdata.ExMethods.indexOf('lrp')>-1"></div>
              <div id="myChart2" class="echart" v-if="postdata.ExMethods.indexOf('gradcam')>-1"></div>
              <div
                id="myChart3"
                class="echart"
                v-if="postdata.ExMethods.indexOf('integrated_grad')>-1"
              ></div>
            </div>
            <div
              class="describe"
              style="width: 960px; line-height: 30px;"
              v-if="postdata['ExMethods'].length>0"
            >
              通过观察可视化后的结果，可以看到对抗样本通常会显著改变模型关注的特征区域（比如无法关注在目标物体上），
              说明模型关注区域发生了偏移；此外通过计算相关系数量化这种差异的程度，相关系数为0-1的实数，越大说明结果越相关（即差异越小），可以看到对抗样本影响下，
              相关指数基本维持在0.6附近，说明对抗样本使模型对特征的关注区域发生了较大偏移。
            </div>
            <div>
              <div
                class="result-subtitle"
                v-if="postdata['ExMethods'].length>0 && postdata.Use_layer_explain"
              >模型内部卷积层解释</div>
              <DropSelect
                v-if="postdata['ExMethods'].length>0 && postdata.Use_layer_explain"
                id="select0"
                :message="'当前展示攻击方法：'+attackMethods[0]"
                :items="attackMethods"
                @SelectClick="selectAdvMethod"
              ></DropSelect>
              <div style="width: 960px;">
                <PictureTable
                  v-if="postdata['ExMethods'].length>0 && postdata.Use_layer_explain"
                  key="pictable2"
                  table-id="table2"
                  :header="true"
                  :headerRow="true"
                  :have-border="true"
                  :content="instanceLayerResultList"
                  :single-output="true"
                  :cellWidth="[0.21, 0.29, 0.29, 0.21]"
                  :cellHeight="cellHeight"
                  class="center-horizon"
                  style="height: 100%;width: 960px; margin-bottom: 20px;"
                ></PictureTable>
                <div
                  v-if="postdata['ExMethods'].length > 0 && postdata.Use_layer_explain"
                  class="describe"
                  style="width: 960px; line-height: 30px;"
                >
                  通过对神经网络逐层提取到的特征进行可视化观察，可以发现对抗噪声从模型浅层就开始破坏图像纹理特征，并随着传播深入最终导致模型分类错误。
                  同时通过计算得到的差异性指数（越大说明对抗扰动造成的特征破坏程度越大〉也可以证明这一点
                </div>
              </div>
            </div>

            <div v-if="postdata['VisMethods'].length> 0">
              <div class="result-subtitle">数据特征分布降维解释</div>
              <div style="width: 960px;">
                <PictureTable
                  key="pictable3"
                  table-id="table3"
                  :header="true"
                  :headerRow="true"
                  :have-border="true"
                  :content="DimReducitonResult"
                  :single-output="true"
                  :cellWidth="dimCellWidth"
                  :cellHeight="chartHeight+'px'"
                  class="center-horizon"
                  style="height: 100%;width: 960px; margin-bottom: 20px;"
                ></PictureTable>
                <div class="describe" style="width: 960px; line-height: 30px;">
                  通过观察降维分布，可以观察到正常样本（图中蓝色区域）和对抗样本（图中红色区域）在空间分布中存在较大差异，
                  说明对抗样本尽管在人眼看来难以区分，但在数字域中是明显可分的，进一步支撑了对抗样本可通过维度差异进行检测过滤的可行性。
                </div>
              </div>
            </div>

            <a-button
              @click="getPdf()"
              style="width:160px;height:40px;margin-bottom:30px;margin-top:10px;
                    font-size:18px;color:white;background-color:rgb(46, 56, 245);border-radius:8px;"
            >导出报告内容</a-button>
          </slot>
          <slot name="main" v-if="mode==='multi-modal'">
            <div
              v-if="Object.keys(postdata).length > 0"
              style="background: var(--gray-7, #F2F4F9);;width: 100%;padding: 24px;"
            >
              <a-row>
                <a-col :span="2">
                  <div class="grid-content-name" style="color:#6C7385">数据集:</div>
                </a-col>
                <a-col :span="3">
                  <div class="grid-content-value">{{postdata.DatasetParam.name}}</div>
                </a-col>
                <a-col :span="5">
                  <div class="grid-content-name" style="color:#6C7385">数据模态:</div>
                </a-col>
                <a-col :span="4">
                  <div class="grid-content-value">{{(postdata.mode)}}</div>
                </a-col>
                <a-col :span="2">
                  <div class="grid-content-name" style="color:#6C7385">攻击方法:</div>
                </a-col>
                <a-col :span="8">
                  <div class="grid-content-value">{{defenseShow(postdata.AdvMethods)}}</div>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="2">
                  <div class="grid-content-name" style="color:#6C7385">模型:</div>
                </a-col>
                <a-col :span="3">
                  <div class="grid-content-value">{{postdata.ModelParam.name}}</div>
                </a-col>
              </a-row>
            </div>
            <!-- 总得分 -->
            <div class="result-title" v-if="postdata['mode'] == 'image'">LIME对抗图像解释</div>
            <div class="result-title" v-else>LIME对抗文本解释</div>
            <!-- 可选择的图像表格 -->
            <div style="width: 960px;" v-if="postdata['mode'] == 'image'">
              <PictureTable
                v-if="postdata['mode'] == 'image'"
                key="pictable4"
                table-id="table4"
                :header="true"
                :headerRow="true"
                :have-border="true"
                :content="instanceLimeResultList"
                :single-output="true"
                :cellWidth="[0.21, 0.29, 0.29, 0.21]"
                :cellHeight="cellHeight"
                class="center-horizon"
                style="height: 100%;width: 960px; margin-bottom: 20px;"
              ></PictureTable>
              <div
                v-if="postdata['mode'] == 'image' "
                class="describe"
                style="width: 960px; line-height: 30px;"
              >
                当LIME解释方法作用于图像数据时，LIME会首先对图像进行超像素（即有一定语义性的连贯图像子区域）分割，
                然后判断这些超像素区域中哪些区域对于当前的分类起到积极或消极作用。绿色表示的是积极影响区域，红色表示的是消极影响区域，
                通过观察可以发现，对抗噪声的出现基本会影响图像中子区域的重要程度，导致模型将注意力迁移到与目标无关的子区域中
              </div>
            </div>

            <div style="width: 960px;" v-else>
              <div class="lime_result" v-for="(method,index) in textResultIdList" :key="'textResult' + index">
                <div v-if="method=='nor'" class="lime_subtitle">正常样本结果</div>
                <div v-else class="lime_subtitle">{{method[0]}}攻击对抗样本结果</div>
                <div
                  class="lime top_div"
                  style="margin-bottom : 10px"
                  :id="'limetext_' + method"
                ></div>
              </div>
              <div class="describe" style="width: 960px; line-height: 30px;">
                当LIME解释方法作用于文本数据时，LIME会对文本中的词组进行随机遮罩，
                然后判断遮罩后的文本（缺少一些词语）对当前的分类所造成的影响，进而提取出对于分类影响效果最重要的词语。
                通过观察可以发现，对抗攻击生成的文本中会出现显著1-2个影响模型决策的词语，即可以通过替换极少数量的词语来影响模型决策。
                可以表明这些尽管某些单词语义相近，但其在模型内部的特征可能差距很大。
              </div>
            </div>
            <a-button
              @click="getPdf()"
              style="width:160px;height:40px;margin-bottom:30px;margin-top:10px;
                    font-size:18px;color:white;background-color:rgb(46, 56, 245);border-radius:8px;"
            >导出报告内容</a-button>
          </slot>
        </div>
      </div>
    </transition>
  </div>
</template>



<script>
import * as echarts from "echarts";
import dataTool from "echarts/extension/dataTool";
import PictureTable from "../../components/pictureTable.vue";
import DropSelect from "../../components/DropSelect.vue";
import {
  Explanation,
  Barchart,
  PredictProba,
  PredictedValue
} from "../../assets/js/lime_js/main.js";

export default {
  name: "resultDialog",
  components: {
    PictureTable: PictureTable,
    DropSelect: DropSelect
  },
  props: {
    isShow: {
      //弹窗组件是否显示 默认不显示
      type: Boolean,
      default: false,
      required: true //必须
    },
    result: {},
    mode: "",
    postData: {},
    //下面这些属性会绑定到div上面 详情参照上面的html结构
    // 如： :style="{top:topDistance+'%',width:widNum+'%'}"
    widNum: {
      //内容宽度
      type: Number,
      default: 50
    },
    leftSite: {
      // 左定位
      type: Number,
      default: 25.2
    },
    topDistance: {
      //top上边距
      type: Number,
      default: 10
    },
    pdt: {
      //上padding
      type: Number,
      default: 22
    },
    pdb: {
      //下padding
      type: Number,
      default: 47
    }
  },

  data() {
    return {
      htmlTitle: "AdvExplainDefenseReport",
      echart_init: false,
      selectedPictureIndex: 0,
      allPictures: {},
      // attackMethods: ["header", "nor", "FGSM", "PGD"],
      selectedMethod: "",
      allDimReduction: {},
      attackMethods: [],
      selectPicList: [],
      instanceResultList: [],
      instanceLayerResultList: [],
      instanceLimeResultList: [],
      DimReducitonResult: [],
      tid: "",
      stidlist: {},
      cellHeight: "200px",
      chartHeight: 220,
      advCellWidth: [],
      postdata: {},
      dimCellWidth: [0.13, 0.29, 0.29, 0.29],
      allLimeTexts: {},
      textResultIdList: [],
      mode_value:'adversarial_analysis'
    };
  },
  // updated:{},
  // props:["is-show","top-distance"],
  methods: {
    defenseShow(method = "[]") {
      // let param = JSON.parse(method);
      return method.join("、");
    },
    closeMyself() {
      this.$emit("on-close");
      //如果需要传参的话，可以在"on-close"后面再加参数，然后在父组件的函数里接收就可以了。
    },
    _stopPropagation(ev) {
      var _this = this;
      ev.stopPropagation();
    },
    // 点击的图片
    selectPicture(index) {
      this.selectedPictureIndex = parseInt(index);
    },
    changeCellHeight(height) {
      this.cellHeight = height;
    },
    splitArr(ar, size = 1) {
      let index = 0;
      let res = [];
      while (index < ar.length) {
        res.push(ar.slice(index, index + size));
        index += size;
      }
      return res;
    },
    selectAdvMethod(method) {
      this.selectedMethod = method;
      this.instanceLayerResultList = this.getInstanceLayerResult(
        this.selectedPictureIndex,
        this.selectedMethod
      );
    },
    getInstanceResult(pictureId) {
      // debugger
      let resultList = [];
      let baseURL = `./static/output/${this.tid}/${this.stidlist[this.mode_value]}/`;
      // 表头
      let tablehead = ["解释方法", "原始样本"];
      let reskey = [];
      // if (this.postdata.ExMethods.length == 1) {
      //   this.advCellWidth = [0.33, 0.33, 0.33];
      // } else if (this.postdata.ExMethods.length == 2) {
      //   this.advCellWidth = [0.25, 0.25, 0.25, 0.25];
      // } else {
      //   this.advCellWidth = [0.2, 0.2, 0.2, 0.2, 0.2];
      // }
      if (this.postdata.ExMethods.indexOf("lrp") > -1) {
        tablehead.push([
          "LRP",
          "图中像素点表示原始图像对应位置每个像素对分类决策的贡献度，颜色越深表示贡献越大，蓝色表示反向贡献度，红色表示正向贡献。"
        ]);
        reskey.push("lrp");
      }
      if (this.postdata.ExMethods.indexOf("gradcam") > -1) {
        tablehead.push([
          "Grad-CAM",
          "图中热力图覆盖目标为模型预测时重点关注的目标，采用jet颜色域，从蓝色到红色表示重要度逐渐变高。"
        ]);
        reskey.push("gradcam");
      }
      if (this.postdata.ExMethods.indexOf("integrated_grad") > -1) {
        tablehead.push([
          "IG",
          "积分梯度法（Integrated Gradients，IG）通过对模型梯度做积分来归因目标样本中对分类起到积极作用的特征，并通过灰度图进行展示。其中白色区域表示产生积极影响的像素，该像素对模型分类的影响作用越大，相应区域的白色越亮。"
        ]);
        reskey.push("ig");
      }
      // resultList.push(["解释方法", "原始样本", "LRP", "Grad-CAM", "IG"])
      // 正常样本
      resultList.push(tablehead);
      let norDict = this.allPictures.nor;
      let norlist = [
        "正常样本 分类标签:\n" + norDict.class_name[pictureId],
        [baseURL + norDict.nor_imgs[pictureId], "pic"]
      ];
      for (let ex_index in reskey) {
        norlist.push([baseURL + norDict[reskey[ex_index]][pictureId], "pic"]);
      }
      resultList.push(norlist);
      // 攻击样本
      let attackMethod = this.allPictures.adv_methods;
      for (let i in attackMethod) {
        let advDict = this.allPictures[attackMethod[i]];
        let advlist = [
          attackMethod[i] + " 分类标签:\n" + advDict.class_name[pictureId],
          [baseURL + advDict.adv_imgs[pictureId], "pic"]
        ];
        for (let ex_index in reskey) {
          advlist.push([baseURL + advDict[reskey[ex_index]][pictureId], "pic"]);
        }
        resultList.push(advlist);
      }
      return resultList;
    },

    getInstanceLayerResult(pictureId, adv_method) {
      // debugger
      let resultList = [];
      let baseURL = `./static/output/${this.tid}/${this.stidlist[this.mode_value]}/`;
      // 表头
      resultList.push(["卷积层", "原始样本结果", "对抗样本结果", "相似性指数"]);
      // 正常样本layer解释
      let norDict = this.allLayerPictures[`img_${pictureId}`]["nor"];
      // 对抗样本layer解释
      let advDict = this.allLayerPictures[`img_${pictureId}`][adv_method];
      // 样本相似性分数
      let score = this.allLayerPictures["value"][adv_method][
        `img_${pictureId}`
      ];
      let i = 0;
      for (var key in norDict) {
        resultList.push([
          key,
          [baseURL + norDict[key], "pic"],
          [baseURL + advDict[key], "pic"],
          [score[i], "text"]
        ]);
        i++;
      }
      return resultList;
    },

    getInstanceLimePicResult() {
      // debugger
      let resultList = [];
      let baseURL = `./static/output/${this.tid}/${this.stidlist[this.mode_value]}/`;
      console.log(this.stidlist[this.mode_value]);
      // 表头
      resultList.push(["分类结果", "样本图片", "样本解释结果", "相似性指数"]);
      // 正常样本layer解释
      let attackMethod = this.allLimePictures["adv_methods"];
      let norDict = this.allLimePictures.nor;
      let norlist = [
        "正常样本 分类标签:\n" + norDict.class_name,
        [baseURL + norDict.image, "pic"],
        [baseURL + norDict.ex_image, "pic"],
        [norDict.kendalltau, "text"]
      ];
      resultList.push(norlist);
      for (let i in attackMethod) {
        let advDict = this.allLimePictures[attackMethod[i]];
        let adv_img_list = [
          attackMethod[i] + " 分类标签：\n" + advDict.class_name,
          [baseURL + advDict.image, "pic"],
          [baseURL + advDict.ex_image, "pic"],
          [advDict.kendalltau, "text"]
        ];
        resultList.push(adv_img_list);
      }
      console.log(resultList);
      return resultList;
    },

    getInstanceLimeTextResult() {
      var attackMethods = this.textResultIdList;
      for (let i in attackMethods) {
        let advDict = this.allLimeTexts[attackMethods[i]];
        var top_div = d3
          .select(`#limetext_${attackMethods[i]}`)
          .classed("lime top_div", true);
        var pp_div = top_div.append("div").classed("lime predict_proba", true);
        var pp_svg = pp_div.append("svg").style("width", "100%");
        var pp = new PredictProba(
          pp_svg,
          advDict.class_names,
          advDict.predictions
        );

        var exp_div;
        var exp = new Explanation(advDict.class_names);

        exp_div = top_div.append("div").classed("lime explanation", true);
        exp.show(advDict.explain_res[0][0], advDict.explain_res[0][1], exp_div);

        var raw_div = top_div.append("div");
        exp.show_raw_text(
          advDict.raw_js[0],
          advDict.raw_js[1],
          advDict.raw_js[2],
          raw_div,
          advDict.raw_js[4]
        );
      }
    },

    handleSelectPicture(indexInfo) {
      // debugger
      let selectedPicture = this.selectPicList[indexInfo[0][0]][
        indexInfo[0][1]
      ][0];
      let index = parseInt(
        selectedPicture
          .split("_")
          .pop()
          .replace(".png", "")
      );
      this.selectPicture(index);
      this.instanceResultList = this.getInstanceResult(
        this.selectedPictureIndex
      );
      this.instanceLayerResultList = this.getInstanceLayerResult(
        this.selectedPictureIndex,
        this.selectedMethod
      );
    },

    getDimReducitonResult() {
      // debugger
      let resultList = [];
      // 表头
      let dimtablehead = ["对抗攻击方法"];
      let reskey = [];
      if (this.postdata.VisMethods.length == 1) {
        this.dimCellWidth = [0.15, 0.85];
      } else if (this.postdata.VisMethods.length == 2) {
        this.dimCellWidth = [0.14, 0.43, 0.43];
      }
      if (this.postdata.VisMethods.indexOf("pca") > -1) {
        dimtablehead.push("PCA");
        reskey.push({ name: "pca", type: "scatterChart" });
      } else {
        this.chartHeight += 20;
      }
      if (this.postdata.VisMethods.indexOf("svm") > -1) {
        dimtablehead.push("SVM");
        reskey.push({ name: "svm", type: "HistogramChart" });
      } else {
        this.chartHeight += 20;
      }
      if (this.postdata.VisMethods.indexOf("tsne") > -1) {
        dimtablehead.push("t-SNE");
        reskey.push({ name: "tsne", type: "scatterChart" });
      } else {
        this.chartHeight += 20;
      }
      resultList.push(dimtablehead);
      for (let i in this.attackMethods) {
        let dimlist = [this.attackMethods[i]];
        for (let j in reskey) {
          dimlist.push([
            this.allDimReduction[this.attackMethods[i]][reskey[j]["name"]],
            reskey[j]["type"]
          ]);
        }
        resultList.push(dimlist);
      }
      console.log("dimlist:", resultList);
      return resultList;
    },

    setBoxchartsOptions(data, methods, ex_method) {
      var option;
      option = {
        title: [
          {
            text: ex_method + "的肯德尔相似系数",
            left: "center",
            textStyle: {
              color: "#333"
            }
          }
        ],
        tooltip: {
          trigger: "item",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          left: "10%",
          right: "10%",
          bottom: "15%"
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          name: "对抗攻击方法",
          nameGap: 30,
          data: methods,
          textStyle: {
            fontSize: 16
          },
          nameTextStyle: {
            color: "#fff"
          },
          axisLabel: {
            color: "fff",
            formatter: "{value}"
          },
          splitArea: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          name: "相似性分数（肯德尔相关系数）",
          splitArea: {
            show: true
          }
        },
        series: [
          {
            name: "数据信息",
            type: "boxplot",
            data: data.boxData,
            itemStlye: {
              color: "fff"
            },
            datasetIndex: 1
          },
          {
            name: "异常点",
            type: "scatter",
            data: data.outliers,
            datasetIndex: 2
          }
        ]
      };
      return option;
    },

    webupdate() {
      if (this.postdata.ExMethods) {
        if (this.postdata.ExMethods.indexOf("lrp") > -1) {
          let lrp_data = [];
          for (let i = 0; i < this.attackMethods.length; i++) {
            lrp_data.push(
              this.allPictures.kendalltau[this.attackMethods[i]].lrp
            );
          }
          var option1 = this.setBoxchartsOptions(
            echarts.dataTool.prepareBoxplotData(lrp_data),
            this.attackMethods,
            "LRP"
          );
          setTimeout(function() {
            // let myChart1= echarts.getInstanceByDom(document.getElementById("myChart1"))
            let myChart1 = echarts.init(document.getElementById("myChart1"));
            window.addEventListener("resize", function() {
              myChart1.resize();
            });
            option1 && myChart1.setOption(option1);
          }, 500);
        }
        if (this.postdata.ExMethods.indexOf("gradcam") > -1) {
          let gradcam_data = [];
          for (let i = 0; i < this.attackMethods.length; i++) {
            gradcam_data.push(
              this.allPictures.kendalltau[this.attackMethods[i]].gradcam
            );
          }
          var option2 = this.setBoxchartsOptions(
            echarts.dataTool.prepareBoxplotData(gradcam_data),
            this.attackMethods,
            "Grad-CAM"
          );
          setTimeout(function() {
            // let myChart2= echarts.getInstanceByDom(document.getElementById("myChart2"))
            let myChart2 = echarts.init(document.getElementById("myChart2"));
            window.addEventListener("resize", function() {
              myChart2.resize();
            });
            option2 && myChart2.setOption(option2);
          }, 500);
        }
        if (this.postdata.ExMethods.indexOf("integrated_grad") > -1) {
          let ig_data = [];
          for (let i = 0; i < this.attackMethods.length; i++) {
            ig_data.push(this.allPictures.kendalltau[this.attackMethods[i]].ig);
          }
          var option3 = this.setBoxchartsOptions(
            echarts.dataTool.prepareBoxplotData(ig_data),
            this.attackMethods,
            "IG"
          );
          setTimeout(function() {
            // let myChart3= echarts.getInstanceByDom(document.getElementById("myChart3"))
            let myChart3 = echarts.init(document.getElementById("myChart3"));
            window.addEventListener("resize", function() {
              myChart3.resize();
            });
            option3 && myChart3.setOption(option3);
          }, 500);
        }
      }
      if (this.postdata.mode == "text") {
        this.getInstanceLimeTextResult();
      }
    }
  },
  watch: {
    result(newValue, oldValue) {
      // debugger
      console.log(newValue);
      if ("tid" in newValue) {
        if(this.mode == 'attribution'){
          this.mode_value = 'adversarial_analysis'
        }else{
          this.mode_value = 'attack_lime'
        }
        this.tid = newValue.tid;
        this.stidlist = newValue.stidlist;
        this.postdata = this.postData;
        this.attackMethods = this.postdata.AdvMethods
        if ("adversarial_analysis" in this.result) {
          let showresult = this.result.adversarial_analysis;
          if ("adv_ex" in showresult) {
            this.allPictures = showresult.adv_ex;
            this.attackMethods = showresult.adv_ex.adv_methods;
            let temp = [];
            for (let i = 0; i < showresult.adv_ex.nor.nor_imgs.length; i++) {
              let url = [
                `./static/output/${this.tid}/${this.stidlist[this.mode_value]}/` +
                  showresult.adv_ex.nor.nor_imgs[i],
                "pic"
              ];
              temp.push(url);
            }
            this.selectedMethod = this.attackMethods[0];
            this.selectPicList = this.splitArr(temp, 10);
            this.instanceResultList = this.getInstanceResult(0);
            if ("layer_ex" in showresult) {
              this.allLayerPictures = showresult.layer_ex;
              this.instanceLayerResultList = this.getInstanceLayerResult(
                0,
                this.selectedMethod
              );
            }
            
          }
          if ("dim_ex" in showresult) {
            this.allDimReduction = showresult.dim_ex;
            this.DimReducitonResult = this.getDimReducitonResult();
          }
          // this.webupdate()
        }
        if ("attack_lime" in this.result) {
          let showresult = this.result.attack_lime;
          console.log(showresult);
          console.log(this.mode);
          if (this.postdata["mode"] == "image") {
            this.allLimePictures = showresult;
            this.instanceLimeResultList = this.getInstanceLimePicResult();
          } else {
            this.allLimeTexts = showresult;
            this.textResultIdList = [];
            this.textResultIdList.push(["nor"]);
            for (let i in showresult.adv_methods){
              this.textResultIdList.push([showresult.adv_methods[i]]);
            }
            
          }
        }
      }
    }
  },
  mounted() {
    this.webupdate();
  },
  created(){
    console.log("create")
    if(this.mode == 'attribution'){
      this.mode_value = 'adversarial_analysis'
    }else{
      this.mode_value = 'attack_lime'
    }
    this.tid = this.result.tid
    this.stidlist = this.result.stidlist
    this.postdata = this.postData
    this.attackMethods = this.postdata.AdvMethods
    if("adversarial_analysis" in this.result){
      if("adv_ex" in  this.result.adversarial_analysis){
        this.allPictures = this.result.adversarial_analysis.adv_ex
      
        this.attackMethods = this.result.adversarial_analysis.adv_ex.adv_methods
        let temp = []
        for(let i=0;i<this.result.adversarial_analysis.adv_ex.nor.nor_imgs.length;i++){
          let url = [`./static/output/${this.tid}/${this.stidlist[this.mode_value]}/` + this.result.adversarial_analysis.adv_ex.nor.nor_imgs[i], 'pic']
          temp.push(url)
        }
        this.selectedMethod = this.attackMethods[0]
        this.selectPicList = this.splitArr(temp, 10)
        this.instanceResultList = this.getInstanceResult(0)
        if("layer_ex" in this.result.adversarial_analysis){
          this.allLayerPictures = this.result.adversarial_analysis.layer_ex
          this.instanceLayerResultList = this.getInstanceLayerResult(0, this.selectedMethod)
        }
      }
      if("dim_ex" in this.result.adversarial_analysis){
        this.allDimReduction = this.result.adversarial_analysis.dim_ex
        this.DimReducitonResult = this.getDimReducitonResult()
      }
    }
    
    if ("attack_lime" in this.result) {
      let showresult = this.result.attack_lime;
      console.log(showresult);
      console.log(this.mode);
      if (this.postdata["mode"] == "image") {
        this.allLimePictures = showresult;
        this.instanceLimeResultList = this.getInstanceLimePicResult();
      } else {
        this.allLimeTexts = showresult;
        this.textResultIdList = [];
        this.textResultIdList.push(["nor"]);
        for (let i in showresult.adv_methods){
          this.textResultIdList.push([showresult.adv_methods[i]]);
        }
        
      }
    }
    this.webupdate()
  },
  updated() {
    // debugger
    //code
    this.webupdate();
  }
};
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
}
.selectContent {
  margin-left: 60px;
  width: 960px;
  display: flex;
  padding: 9px 32px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1 0 0;
  align-self: stretch;
  border-right: 1px solid #e0e3eb;
  border-bottom: 1px solid #e0e3eb;
  background: var(--gray-7, #f2f4f9);
  color: rgba(0, 0, 0, 0.9);
  text-align: center;
  font-family: HONOR Sans CN;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 28px;
}
.close_button {
  height: 60px;
  width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  float: right;
}
/* 内容层 z-index要比遮罩大，否则会被遮盖， */
.dialog-content {
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
  z-index: 1001;
  color: rgb(0, 0, 0);
  overflow: scroll;
  background: #ffffff;
  box-shadow: 0px 8px 20px rgba(44, 51, 67, 0.06);
  border-radius: 8px;
}
/* 标题框样式 */
.dialog_head {
  width: 1080px;
  left: 0px;
  top: 1px;
  height: 88px;
  padding: 24px 18px 24px 24px;
  border-bottom: 1px solid #e0e3eb;
}

.dialog_main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  /* gap: 60px; */

  position: absolute;
  width: 1080px;
  /* height: 8265px; */
  left: 0px;
  top: 89px;
}
.foot_close {
  background: #5196ff;
  border-radius: 4px;
  width: 143px;
  height: 50px;
}
.dialog-title {
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
.result-title {
  margin-top: 68px;
  margin-bottom: 32px;
  font-family: HONOR Sans CN;
  font-style: normal;
  font-size: 28px;
  color: #000;
  letter-spacing: 0;
  font-weight: 700;
  line-height: 36px;
  text-align: center;
}
.describe {
  font-family: HONOR Sans CN;
  font-size: 16px;
  color: #000000;
  letter-spacing: 0;
  text-align: center;
  background-color: #f2f4f9;
  /* margin: 20px 20px; */
  padding: 20px 50px;
}
.result-subtitle {
  margin-top: 60px;
  margin-bottom: 32px;
  font-family: HONOR Sans CN;
  font-size: 28px;
  color: #000;
  font-weight: 700;
  text-align: center;
  font-style: normal;
  line-height: 36px;
}
.echart {
  width: 1000px;
  height: 400px;
  margin-top: 30px;
}
.lime_subtitle{
  margin-top: 10px;
  margin-bottom: 15px;
  font-family: HONOR Sans CN;
  font-size: 20px;
  color: #a0a5b2;
  font-weight: 700;
  text-align: center;
  font-style: normal;
  line-height: 36px;
}
.lime_result{
  border-style:solid;
  border-width:2px;
  border-color: #a2a4a9;
  border-radius: 10px;
  margin-bottom: 20px;
  height: 300px;
}
</style>