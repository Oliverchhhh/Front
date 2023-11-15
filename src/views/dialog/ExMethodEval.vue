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
                    <div class="dialog-title"><img src="../../assets/img/modelEvaIcon.png" style="width: 50px; height: 50px;">攻击机理分析报告</div>
                  </slot>
              </div>
              <div class="dialog_main" id="pdfDom">
              <!--弹窗的内容-->
                  <slot name="main">
                    <div v-if="Object.keys(postdata).length > 0" style="background: var(--gray-7, #F2F4F9);;width: 100%;padding: 24px;">
                      <a-row >
                        <a-col :span="2">
                          <div class="grid-content-name" style="color:#6C7385">数据集:</div>
        
                        </a-col>
                        <a-col :span="3">
                          <div class="grid-content-value">{{postdata.DatasetParam.name}}</div>

                        </a-col>
                        <a-col :span="5">
                          <div class="grid-content-name" style="color:#6C7385" >特征归因可视化分析方法:</div>

                        </a-col>
                        <a-col :span="4">
                          <div class="grid-content-value" v-if="'ExMethods' in postdata">{{defenseShow(postdata.ExMethods)}}</div>
                          <div class="grid-content-value" v-else>未选</div>
 
                        </a-col>
                        <a-col :span="2">
                          <div class="grid-content-name" style="color:#6C7385">攻击方法:</div>
     
                        </a-col>
                        <a-col :span="8">
                          <div class="grid-content-value">{{defenseShow(postdata.AdvMethods)}}</div>
                        </a-col>
                      </a-row>
                      <a-row >
                        <a-col :span="2">
                          <div class="grid-content-name" style="color:#6C7385">模型:</div>
        
                        </a-col>
                        <a-col :span="3">
                          <div class="grid-content-value">{{postdata.ModelParam.name}}</div>

                        </a-col>
                        <a-col :span="5">
                          <div class="grid-content-name" style="color:#6C7385" >数据分布降维分析方法:</div>

                        </a-col>
                        <a-col :span="4">
                          <div class="grid-content-value" v-if="'VisMethods' in postdata ">{{defenseShow(postdata.VisMethods)}}</div>
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
                    <div class="result-title" v-if="'ExMethods' in postdata">对抗图像解释</div>
                    <!-- 可选择的图像表格 -->
                    <div class="selectContent" v-if="'ExMethods' in postdata">请选择展示的图片</div>
                    <div style="width: 960px;">
                      <PictureTable key="pictable0" table-id="table0" :header="false" :headerRow="false" :have-border="true" :content="selectPicList"
                          :single-output="true" :cellWidth="[0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]"  @pictureSelect="handleSelectPicture" 
                          :selectedPicutre="['table0_0_0']" class="center-horizon" style="height: 100%;width: 960px; margin-bottom: 20px;">
                      </PictureTable>
                    </div>
                    <div style="width: 960px;" v-if="'ExMethods' in postdata">
                    <PictureTable key="pictable1" table-id="table1" :header="true" :headerRow="true" :have-border="true" :content="instanceResultList"
                        :single-output="true" :cellWidth="advCellWidth" :cellHeight="cellHeight" class="center-horizon" style="height: 100%;width: 960px; margin-bottom: 20px;">
                    </PictureTable>
                    </div>
                    
                    <!-- 结果展示 箱装图 -->
                    <div v-if="'ExMethods' in postdata">
                      <div class="result-subtitle" >对抗解释图与正常解释图之间的相似度分数 </div>
                      <div id="myChart1" class="echart" v-if="postdata.ExMethods.indexOf('lrp')>-1"></div>
                      <div id="myChart2" class="echart" v-if="postdata.ExMethods.indexOf('gradcam')>-1"></div>
                      <div id="myChart3" class="echart" v-if="postdata.ExMethods.indexOf('integrated_grad')>-1"></div>
                    </div>
                    <div class="describe" style="width: 960px; line-height: 30px;" v-if="'ExMethods' in postdata">
                      通过观察可视化后的结果，可以看到对抗样本通常会显著改变模型关注的特征区域（比如无法关注在目标物体上），
                      说明模型关注区域发生了偏移；此外通过计算相关系数量化这种差异的程度，相关系数为0-1的实数，越大说明结果越相关（即差异越小），可以看到对抗样本影响下，
                      相关指数基本维持在0.6附近，说明对抗样本使模型对特征的关注区域发生了较大偏移。
                    </div>
                    <div>
                      <div class="result-subtitle" v-if="'ExMethods' in postdata && postdata.Use_layer_explain" >模型内部卷积层解释 </div>
                      <DropSelect v-if="'ExMethods' in postdata && postdata.Use_layer_explain" Id="select0" :message="'当前展示攻击方法：'+attackMethods[0]" :items="attackMethods" @SelectClick="selectAdvMethod"></DropSelect>
                      <div style="width: 960px;">
                      <PictureTable v-if="'ExMethods' in postdata && postdata.Use_layer_explain" key="pictable2" table-id="table2" :header="true" :headerRow="true" :have-border="true" :content="instanceLayerResultList"
                        :single-output="true" :cellWidth="[0.21, 0.29, 0.29, 0.21]" :cellHeight="cellHeight" class="center-horizon" style="height: 100%;width: 960px; margin-bottom: 20px;">
                      </PictureTable>
                      <div v-if="'ExMethods' in postdata && postdata.Use_layer_explain" class="describe" style="width: 960px; line-height: 30px;">通过对神经网络逐层提取到的特征进行可视化观察，可以发现对抗噪声从模型浅层就开始破坏图像纹理特征，并随着传播深入最终导致模型分类错误。
                        同时通过计算得到的差异性指数（越大说明对抗扰动造成的特征破坏程度越大〉也可以证明这一点</div>
                      </div>                      
                    </div>

                    <div v-if="'VisMethods' in postdata">
                      <div class="result-subtitle">数据特征分布降维解释 </div>
                      <div style="width: 960px;">
                      <PictureTable key="pictable3" table-id="table3" :header="true" :headerRow="true" :have-border="true" :content="DimReducitonResult"
                        :single-output="true" :cellWidth="dimCellWidth" :cellHeight="chartHeight+'px'"  class="center-horizon" style="height: 100%;width: 960px; margin-bottom: 20px;">
                      </PictureTable>     
                      <div class="describe" style="width: 960px; line-height: 30px;">通过观察降维分布，可以观察到正常样本（图中蓝色区域）和对抗样本（图中红色区域）在空间分布中存在较大差异，
                        说明对抗样本尽管在人眼看来难以区分，但在数字域中是明显可分的，进一步支撑了对抗样本可通过维度差异进行检测过滤的可行性。</div>
                      </div>                 
                    </div>
                    
                    <a-button @click="getPdf()" style="width:160px;height:40px;margin-bottom:30px;margin-top:10px;
                    font-size:18px;color:white;background-color:rgb(46, 56, 245);border-radius:8px;">
                      导出报告内容
                    </a-button>
                    
                  </slot>
              </div>
          </div>
      </transition>
  </div>
</template>
<script>
import * as echarts from "echarts";
import dataTool  from "echarts/extension/dataTool";
import PictureTable from "../../components/pictureTable.vue";
import DropSelect from "../../components/DropSelect.vue"

export default {
  name:"resultDialog",
  components: {
    PictureTable: PictureTable,
    DropSelect: DropSelect
  },
  props: {
      isShow: {
      //弹窗组件是否显示 默认不显示
      type: Boolean,
      default: false,
      required:true, //必须
      },
      result:{},
      postData:{},
      //下面这些属性会绑定到div上面 详情参照上面的html结构
      // 如： :style="{top:topDistance+'%',width:widNum+'%'}"
      widNum:{
      //内容宽度
      type: Number,
      default:50
      },
      leftSite:{
      // 左定位
      type: Number,
      default:25.2
      },
      topDistance: {
      //top上边距
      type: Number,
      default:10
      },
      pdt:{
      //上padding
      type: Number,
      default:22
      },
      pdb:{
      //下padding
      type: Number,
      default:47
      }
      },
      
  data() {
    return {
      htmlTitle: 'AdvExplainDefenseReport',
      echart_init: false,
      selectedPictureIndex: 0,
      allPictures: {},
      // attackMethods: ["header", "nor", "FGSM", "PGD"],
      selectedMethod:"",
      allDimReduction:{},
      attackMethods: [],
      selectPicList: [],
      instanceResultList:[],
      instanceLayerResultList:[],
      DimReducitonResult:[],
      tid:"",
      stidlist:{},
      cellHeight:"200px",
      chartHeight:220,
      advCellWidth:[0.2, 0.2, 0.2, 0.2, 0.2],
      postdata:{},
      dimCellWidth:[0.13, 0.29, 0.29, 0.29]
    }
  },
  // updated:{},
  // props:["is-show","top-distance"],
  methods: {
    defenseShow(method=[]){
            // let param = JSON.parse(method);
            return method.join('、');
        },
      closeMyself() {
        this.$emit("on-close");
        //如果需要传参的话，可以在"on-close"后面再加参数，然后在父组件的函数里接收就可以了。
      },
      _stopPropagation(ev){
          var _this = this;
          ev.stopPropagation();
      },
    // 点击的图片
    selectPicture(index) {
      this.selectedPictureIndex = parseInt(index)
    },
    changeCellHeight(height){
      this.cellHeight = height
    },
    splitArr(ar, size = 1) {
      let index = 0;
      let res = [];
      while (index < ar.length) {
          res.push(ar.slice(index, (index+size)));
          index += size;
      }
      return res;
    },
    selectAdvMethod(method){
      this.selectedMethod = method
      this.instanceLayerResultList = this.getInstanceLayerResult(this.selectedPictureIndex, this.selectedMethod)
    },
    getInstanceResult(pictureId){
      // debugger
      let resultList = []
      let baseURL = `./static/output/${this.tid}/${this.stidlist.attack_attrbution_analysis}/`
      // 表头
      let tablehead = ["解释方法", "原始样本"]
      let reskey = [];
      if(this.postdata.ExMethods.length == 1){
        this.advCellWidth=[0.2, 0.4, 0.4]
      }else if(this.postdata.ExMethods.length == 2){
        this.advCellWidth=[0.25, 0.25, 0.25,0.25]
      }else{
        this.advCellWidth=[0.2, 0.2, 0.2,0.2, 0.2]
      }
      if(this.postdata.ExMethods.indexOf("lrp")>-1){
        tablehead.push(["LRP","图中像素点表示原始图像对应位置每个像素对分类决策的贡献度，颜色越深表示贡献越大，蓝色表示反向贡献度，红色表示正向贡献。"])
        reskey.push("lrp")
      }
      if(this.postdata.ExMethods.indexOf("gradcam")>-1){
        tablehead.push(["Grad-CAM", "图中热力图覆盖目标为模型预测时重点关注的目标，采用jet颜色域，从蓝色到红色表示重要度逐渐变高。"])
        reskey.push("gradcam")
      }
      if(this.postdata.ExMethods.indexOf("integrated_grad")>-1){
        tablehead.push(["IG","积分梯度法（Integrated Gradients，IG）通过对模型梯度做积分来归因目标样本中对分类起到积极作用的特征，并通过灰度图进行展示。其中白色区域表示产生积极影响的像素，该像素对模型分类的影响作用越大，相应区域的白色越亮。"])
        reskey.push("ig")
      }
      // resultList.push(["解释方法", "原始样本", "LRP", "Grad-CAM", "IG"])
      // 正常样本
      resultList.push(tablehead)
      let norDict = this.allPictures.nor
      let norlist = ["正常样本 分类标签:\n"+norDict.class_name[pictureId], [baseURL + norDict.nor_imgs[pictureId],'pic']]
      for(let ex_index in reskey ){
        norlist.push([baseURL + norDict[reskey[ex_index]][pictureId],'pic'])
      }
      resultList.push(norlist)
      // 攻击样本
      let attackMethod = this.allPictures.adv_methods
      for (let i in attackMethod) {
        let advDict = this.allPictures[attackMethod[i]]
        let advlist=[attackMethod[i] + " 分类标签:\n"+advDict.class_name[pictureId], [baseURL + advDict.adv_imgs[pictureId],'pic']]
        for(let ex_index in reskey ){
          advlist.push([baseURL + advDict[reskey[ex_index]][pictureId],'pic'])
        }
        resultList.push(advlist)
      }
      return resultList
    },

    getInstanceLayerResult(pictureId, adv_method){
      // debugger
      let resultList = []
      let baseURL = `./static/output/${this.tid}/${this.stidlist.attack_attrbution_analysis}/`
      // 表头
      resultList.push(["卷积层", "原始样本结果", "对抗样本结果", "相似性指数"])
      // 正常样本layer解释
      let norDict = this.allLayerPictures[`img_${pictureId}`]["nor"]
      // 对抗样本layer解释
      let advDict = this.allLayerPictures[`img_${pictureId}`][adv_method]
      // 样本相似性分数
      let score = this.allLayerPictures["value"][adv_method][`img_${pictureId}`]
      let i = 0;
      for (var key in norDict) {
        resultList.push([key, [baseURL + norDict[key],'pic'], [baseURL + advDict[key],'pic'], [score[i],'text']])
        i++;
      }
      return resultList
    },

    handleSelectPicture(indexInfo){
      // debugger
      let selectedPicture = this.selectPicList[indexInfo[0][0]][indexInfo[0][1]][0]
      let index = parseInt(selectedPicture.split("_").pop().replace(".png", ""))
      this.selectPicture(index)
      this.instanceResultList = this.getInstanceResult(this.selectedPictureIndex)
      this.instanceLayerResultList = this.getInstanceLayerResult(this.selectedPictureIndex, this.selectedMethod)
    },

    getDimReducitonResult(){
      // debugger
      let resultList = []
      // 表头
      let dimtablehead = ["对抗攻击方法"]
      let reskey = []
      if(this.postdata.VisMethods.length == 1){
        this.dimCellWidth = [0.15,0.85]
      }else if(this.postdata.VisMethods.length == 2){
        this.dimCellWidth = [0.14,0.43,0.43]
      }
      if(this.postdata.VisMethods.indexOf("pca")>-1){
        dimtablehead.push("PCA")
        reskey.push({"name":"pca","type":"scatterChart"})
      }else{
        this.chartHeight += 20
      }
      if(this.postdata.VisMethods.indexOf("svm")>-1){
        dimtablehead.push("SVM")
        reskey.push({"name":"svm","type":"HistogramChart"})
      }else{
        this.chartHeight += 20
      }
      if(this.postdata.VisMethods.indexOf("tsne")>-1){
        dimtablehead.push("t-SNE")
        reskey.push({"name":"tsne","type":"scatterChart"})
      }else{
        this.chartHeight += 20
      }
      resultList.push(dimtablehead)
      for(let i in this.attackMethods){
        let dimlist = [this.attackMethods[i]]
        for(let j in reskey){
          dimlist.push([this.allDimReduction[this.attackMethods[i]][reskey[j]["name"]],reskey[j]["type"]])
        }
        resultList.push(dimlist)
      }
      console.log("dimlist:",resultList)
      return resultList
    },

    setBoxchartsOptions(data, methods, ex_method){
        var option;
        option = {
          title: [
            {
              text: ex_method + '的肯德尔相似系数',
              left: 'center',
              textStyle:{
                color:"#333"
              }
            }
          ],
          tooltip: {
            trigger: 'item',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '10%',
            right: '10%',
            bottom: '15%'
          },
          xAxis: {
            type: 'category',
            boundaryGap: true,
            name:"对抗攻击方法",
            nameGap: 30,
            data: methods,
            textStyle: {
                fontSize: 16,
            },
            nameTextStyle: {
                color: "#fff"
            },
            axisLabel: {
                color: "fff",
                formatter:"{value}"
            },
            splitArea: {
              show: false
            },
            splitLine: {
              show: false
            }
          },
          yAxis: {
            type: 'value',
            name: '相似性分数（肯德尔相关系数）',
            splitArea: {
              show: true
            }
          },
          series: [
            {
              name: '数据信息',
              type: 'boxplot',
              data: data.boxData,
              itemStlye:{
                color:"fff"
              },
              datasetIndex: 1,
            },
            {
              name: '异常点',
              type: 'scatter',
              data: data.outliers,
              datasetIndex: 2
            }
          ]
        };
        return option
    },

    webupdate(){
      if(this.postdata.ExMethods.indexOf("lrp")>-1){
        let lrp_data = []
        for(let i=0; i<this.attackMethods.length;i++){
          lrp_data.push(this.allPictures.kendalltau[this.attackMethods[i]].lrp)
        }
        var option1 = this.setBoxchartsOptions(echarts.dataTool.prepareBoxplotData(lrp_data),this.attackMethods,"LRP")
        setTimeout(function(){
          // let myChart1= echarts.getInstanceByDom(document.getElementById("myChart1"))
          let myChart1 = echarts.init(document.getElementById("myChart1"));
            window.addEventListener("resize", function () {
              myChart1.resize()});
              option1 && myChart1.setOption(option1);
        },500)
    }
    if(this.postdata.ExMethods.indexOf("gradcam")>-1){
      let gradcam_data = []
      for(let i=0; i<this.attackMethods.length;i++){
        gradcam_data.push(this.allPictures.kendalltau[this.attackMethods[i]].gradcam)
      }
      var option2 = this.setBoxchartsOptions(echarts.dataTool.prepareBoxplotData(gradcam_data),this.attackMethods,"Grad-CAM")
      setTimeout(function(){
          // let myChart2= echarts.getInstanceByDom(document.getElementById("myChart2"))
          let myChart2 = echarts.init(document.getElementById("myChart2"));
            window.addEventListener("resize", function () {
              myChart2.resize()});
              option2 && myChart2.setOption(option2);
        },500)
    }
    if(this.postdata.ExMethods.indexOf("integrated_grad")>-1){
      let ig_data = []
      for(let i=0; i<this.attackMethods.length;i++){
        ig_data.push(this.allPictures.kendalltau[this.attackMethods[i]].ig)
      }
      var option3 = this.setBoxchartsOptions(echarts.dataTool.prepareBoxplotData(ig_data), this.attackMethods,"IG")
      setTimeout(function(){
          // let myChart3= echarts.getInstanceByDom(document.getElementById("myChart3"))
          let myChart3 = echarts.init(document.getElementById("myChart3"));
            window.addEventListener("resize", function () {
              myChart3.resize()});
              option3 && myChart3.setOption(option3);
        },500)
    }
    }

  },
  watch:{
    result(newValue,oldValue){
      // debugger
      if( "tid" in newValue){
        this.tid = newValue.tid
        this.stidlist = newValue.stidlist
        this.postdata = this.postData
        this.attackMethods = this.postdata.AdvMethods
        if("attack_attrbution_analysis" in this.result){
          this.allPictures = this.result.attack_attrbution_analysis.adv_ex
          
          this.attackMethods = this.result.attack_attrbution_analysis.adv_ex.adv_methods
          let temp = []
          for(let i=0;i<this.result.attack_attrbution_analysis.adv_ex.nor.nor_imgs.length;i++){
            let url = [`./static/output/${this.tid}/${this.stidlist.attack_attrbution_analysis}/` + this.result.attack_attrbution_analysis.adv_ex.nor.nor_imgs[i], 'pic']
            temp.push(url)
          }
          this.selectedMethod = this.attackMethods[0]
          this.selectPicList = this.splitArr(temp, 10)
          this.instanceResultList = this.getInstanceResult(0)
          if("layer_ex" in this.result.attack_attrbution_analysis){
            this.allLayerPictures = this.result.attack_attrbution_analysis.layer_ex
            this.instanceLayerResultList = this.getInstanceLayerResult(0, this.selectedMethod)
          }
        }
        if("attack_dim_reduciton" in this.result){
          this.allDimReduction = this.result.attack_dim_reduciton
          this.DimReducitonResult = this.getDimReducitonResult()
        }
        this.webupdate()
      }
    }
  },
  created(){
    console.log("create")
    this.tid = this.result.tid
    this.stidlist = this.result.stidlist
    this.postdata = this.postData
    this.attackMethods = this.postdata.AdvMethods
    if("attack_attrbution_analysis" in this.result){
      this.allPictures = this.result.attack_attrbution_analysis.adv_ex
      
      this.attackMethods = this.result.attack_attrbution_analysis.adv_ex.adv_methods
      let temp = []
      for(let i=0;i<this.result.attack_attrbution_analysis.adv_ex.nor.nor_imgs.length;i++){
        let url = [`./static/output/${this.tid}/${this.stidlist.attack_attrbution_analysis}/` + this.result.attack_attrbution_analysis.adv_ex.nor.nor_imgs[i], 'pic']
        temp.push(url)
      }
      this.selectedMethod = this.attackMethods[0]
      this.selectPicList = this.splitArr(temp, 10)
      this.instanceResultList = this.getInstanceResult(0)
      if("layer_ex" in this.result.attack_attrbution_analysis){
        this.allLayerPictures = this.result.attack_attrbution_analysis.layer_ex
        this.instanceLayerResultList = this.getInstanceLayerResult(0, this.selectedMethod)
      }
    }
    if("attack_dim_reduciton" in this.result){
      this.allDimReduction = this.result.attack_dim_reduciton
      this.DimReducitonResult = this.getDimReducitonResult()
    }
    this.webupdate()
  },
  // mounted(){
  //   this.webupdate()
  // },
  // updated(){
  //   // debugger
  //   //code
  //   this.webupdate()
  // },
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
}
.selectContent{
  margin-left: 60px;
  width: 960px;
  display: flex;
  padding: 9px 32px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1 0 0;
  align-self: stretch;
  border-right: 1px solid #E0E3EB;
  border-bottom: 1px solid #E0E3EB;
  background: var(--gray-7, #F2F4F9);
  color: rgba(0, 0, 0, 0.90);
  text-align: center;
  font-family: HONOR Sans CN;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 28px;
}
.close_button{
  height: 60px;
  width: 60px;
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
z-index: 1001;
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
  /* gap: 60px; */

  position: absolute;
  width: 1080px;
  /* height: 8265px; */
  left: 0px;
  top: 89px;

}
.foot_close{
  background: #5196FF;
  border-radius: 4px;
  width: 143px;
  height: 50px;
}
.dialog-title{
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
.echart{
  width:  1000px; 
  height: 400px;
  margin-top: 30px;
}
</style>