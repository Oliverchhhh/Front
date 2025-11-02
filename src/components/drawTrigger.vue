<template>
    <div>
      <div class="tool-box">
        <p style="margin-bottom: 10px;">自定义后门区域</p>
        <a-row :gutter="16" style="margin-bottom: 10px;">
          
          <a-col span="2" >
            <p class="triggerName">坐标x:</p>
          </a-col>
          <a-col span="2">
            <a-input-number size="small" :min="0" :max="canvasWidth" :step="1" v-model:value="x" @change="changeTrigger"></a-input-number>
          </a-col>
          <a-col span="2">
            <p class="triggerName">坐标y:</p>
          </a-col>
          <a-col span="2">
            <a-input-number size="small"  :min="0" :max="canvasWidth" :step="1" v-model:value="y" @change="changeTrigger"></a-input-number>
          </a-col>
          <a-col span="2">
            <p class="triggerName">宽度l:</p>
          </a-col>
          <a-col span="2">
            <a-input-number size="small"  :min="0" :max="canvasWidth" :step="1" v-model:value="l" @change="changeTrigger"></a-input-number>
          </a-col>
          <a-col span="2">
            <p class="triggerName">颜色:</p>
          </a-col>
          <a-col span="4">
            <a-radio-group v-model:value="color" default-value="0" size="small" button-style="solid" @change="changeColor">
              <a-radio-button value="0" >黑色</a-radio-button>
              <a-radio-button value="1" >白色</a-radio-button>
            </a-radio-group>
          </a-col>  
          <a-col span="6">
            <a-button size="small"  :type="isDrawing ? 'warning' : 'primary'" @click="startDraw">绘制区域</a-button>
            <a-button size="small" type="danger" :disabled="isDrawing" @click="clearAll">全部清除</a-button>
            <a-button size="small" type="success" :disabled="isDrawing" @click="savePoints">保存</a-button>
          </a-col>
        </a-row>  
      </div>
      <div class="canvasDiv">
        <div class="canvas-wrap">
            <canvas :id="'imgCanvas'+indexInParent" ref="canvaxbox"></canvas>
            <!--用来和鼠标进行交互操作的canvas-->
            <canvas :id="'drawCanvas'+indexInParent" ref="canvas" :style="{cursor: isDrawing?'crosshair': 'default'}"> </canvas>
            <!--存储已生成的点线，避免被清空-->
            <canvas :id="'saveCanvas'+indexInParent" ref="canvasSave"></canvas>
        </div>
      </div>
    </div>
  </template>
  <script>
import mnistimg from '../assets/img/mnist0.jpg'
  export default {
    name:"drawTrigger",
    props: {
        dataset:0,
        indexInParent:0
    },
    // mixins: [OldJs],
    data() {
      return {
        color:"0",
        x:0,
        y:0,
        l:20,
        imgUrl: mnistimg,
        isDrawing: false, // 是否正在绘制
        ratio: 1,
        imgWidth: 28,
        imgHeight: 28,
        wrapWidth: 160,
        wrapHeight: 160,
        canvasWidth: 300,
        canvasHeight: 300,
        drawingPoints: [],
        drawedPoints: [[[0, 0],[20, 0],[20, 20],[0, 20]]],
        imgCanvas: null,
        imgCtx: null,
        drawCanvas: null,
        drawCtx: null,
        saveCanvas: null,
        saveCtx: null,
        submitData: [{"polygon":{"x1":0,"x2":4,"x3":4,"x4":0, "y1":0, "y2":0, "y3":4, "y4":4}}
        ]
      }
    },
    watch:{
      dataset(newValue, oldValue){
        // console.log(`newvalue:${newValue}`)
        // console.log(`oldvalue:${oldValue}`)
        this.getImage()
      }
    },
    mounted() {
        setTimeout(()=>{
            // let element1 = document.getElementById("imgCanvas0")
            let element1 = document.getElementById(`imgCanvas${this.indexInParent}`)
            console.log(element1)
            this.initCanvas()
            this.getImage()
        },500)
      
      
    },
    methods: {
      initCanvas() { // 初始化canvas画布
        // debugger
        let canvasWrap = document.getElementsByClassName('canvas-wrap')
        this.wrapWidth = canvasWrap [0].clientWidth
        this.wrapHeight = canvasWrap [0].clientHeight

        this.imgCanvas = document.getElementById(`imgCanvas${this.indexInParent}`)
        this.imgCtx = this.imgCanvas.getContext('2d')
   
        // 绘制canvas
        this.drawCanvas = document.getElementById(`drawCanvas${this.indexInParent}`)
        this.drawCtx = this.drawCanvas.getContext('2d')
   
        // 保存绘制区域 saveCanvas
        this.saveCanvas = document.getElementById(`saveCanvas${this.indexInParent}`)
        this.saveCtx = this.saveCanvas.getContext('2d')
        // this.initImgCanvas()
      },
      initImgCanvas() {
        // 计算宽高比
        // debugger
        let ww = this.wrapWidth // 画布宽度
        let wh = this.wrapHeight // 画布高度
        let iw = this.imgWidth // 图片宽度
        let ih = this.imgHeight // 图片高度
   
        if (iw/ih < ww/wh) { // 以高为主
          this.ratio = ih / wh
          this.canvasHeight = wh
          this.canvasWidth = wh * iw/ih
        } else { // 以宽为主
          this.ratio = iw / ww
          this.canvasWidth = ww
          this.canvasHeight = ww * ih/iw
        }
        // 初始化画布大小
        this.imgCanvas.width = this.canvasWidth
        this.imgCanvas.height = this.canvasHeight
        this.drawCanvas.width = this.canvasWidth
        this.drawCanvas.height = this.canvasHeight
        this.saveCanvas.width = this.canvasWidth
        this.saveCanvas.height = this.canvasHeight
   
        // 图片加载绘制
        let img = document.createElement('img')
        img.src = this.imgUrl
        img.onload = () => {
          console.log('图片已加载')
          this.imgCtx.drawImage(img, 0, 0, this.canvasWidth, this.canvasHeight)
          this.renderDatas() // 渲染原有数据
        }
      },
      startDraw() { // 绘制区域
        // debugger
        if (this.isDrawing) return
        this.isDrawing = true
        this.clearAll()
        // 绘制逻辑
        this.drawCanvas.addEventListener("click", this.drawImageClickFn)
        // this.drawCanvas.addEventListener("dblclick", this.drawImageDblClickFn)
        this.drawCanvas.addEventListener("mousemove", this.drawImageMoveFn)
      },
      clearAll() { // 清空所有绘制区域
        this.saveCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.drawedPoints = []
      },
      getImage() { // 请求图片
        if (this.dataset == 0){
            this.imgUrl = require("../assets/img/mnist0.jpg")
            this.imgWidth = 28
            this.imgHeight = 28
        }else if (this.dataset == 1){
            this.imgUrl = require("../assets/img/cifar100.jpg")
            this.imgWidth = 32
            this.imgHeight = 32
        }else if(this.dataset == 2){
            this.imgUrl = require("../assets/img/ImageNet0.png")
            this.imgWidth = 224
            this.imgHeight = 224
        }
          this.imgUrl && this.initImgCanvas()
      },
      drawImageClickFn(e) {
        // debugger
        let drawCtx = this.drawCtx
        if (e.offsetX || e.layerX) {
          let pointX = e.offsetX == undefined ? e.layerX : e.offsetX;
          let pointY = e.offsetY == undefined ? e.layerY : e.offsetY;
          let lastPoint = this.drawingPoints[this.drawingPoints.length-1] || []
          // if (lastPoint[0] !== pointX || lastPoint[1] !== pointY) {
          //   this.drawingPoints.push([pointX, pointY])
          // }

          if (this.drawingPoints.length < 2){
            if (lastPoint[0] !== pointX || lastPoint[1] !== pointY) {
              
              if(this.drawingPoints.length == 1){
                let w = pointX - this.drawingPoints[0][0]
                let h = pointY-this.drawingPoints[0][1]
                let l = Math.abs(w)>=Math.abs(h) ?Math.abs(w):Math.abs(h)
                let point2 = [0, 0]
                let point3 = [0, 0]
                let point4 = [0, 0]
                if (w >= 0 && (this.drawingPoints[0][0] + l)< this.canvasWidth ){
                  point2[0] = this.drawingPoints[0][0] + l
                  point2[1] = this.drawingPoints[0][1]
                  point3[0] = this.drawingPoints[0][0] + l
                  point4[0] = this.drawingPoints[0][0]
                }else if (w < 0 && (this.drawingPoints[0][0] - l) > 0){
                  point2[0] =  this.drawingPoints[0][0] - l
                  point2[1] = this.drawingPoints[0][1]
                  point3[0] = this.drawingPoints[0][0] - l
                  point4[0] = this.drawingPoints[0][0]
                }else{
                  l = Math.abs(w)>Math.abs(h) ?Math.abs(h):Math.abs(w)
                  point2[0] = pointX
                  point2[1] = this.drawingPoints[0][1]
                  point3[0] = pointX
                  point3[1] = h > 0 ? (this.drawingPoints[0][1]+l) : (this.drawingPoints[0][1]-l) 
                  point4[0] = this.drawingPoints[0][0]
                  point4[1] = point3[1]
                  this.drawingPoints.push(point2)
                  this.drawingPoints.push(point3)
                  this.drawingPoints.push(point4)
                  // 清空绘制图层
                  drawCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                  // 绘制区域至保存图层
                  this.drawedPoints.push(this.drawingPoints)
                  this.drawSaveArea(this.drawingPoints)
            
                  this.drawingPoints = []
                  this.isDrawing = false
                  // this.l = Math.round(l * this.ratio)
                  this.l = l

                  // 绘制结束逻辑
                  this.drawCanvas.removeEventListener("click", this.drawImageClickFn)
                  // this.drawCanvas.removeEventListener("dblclick", this.drawImageDblClickFn)
                  this.drawCanvas.removeEventListener("mousemove", this.drawImageMoveFn)
                  return
                }
                if (h >=0 && (this.drawingPoints[0][1] + l)< this.canvasHeight ){
                  point3[1] = this.drawingPoints[0][1] + l
                  point4[1] = point3[1]
                }else if (h < 0 && (this.drawingPoints[0][1] - l) > 0){
                  point3[1] = this.drawingPoints[0][1] - l
                  point4[1] = point3[1]
                }else{
                  l = Math.abs(w)>Math.abs(h) ?Math.abs(h):Math.abs(w)
                  point2[0] = w > 0 ? (this.drawingPoints[0][0]+l) : (this.drawingPoints[0][0]-l)
                  point2[1] = this.drawingPoints[0][1]
                  point3[0] = point2[0]
                  point3[1] = pointY
                  point4[0] = this.drawingPoints[0][0]
                  point4[1] = point3[1]
                }
                this.drawingPoints.push(point2)
                this.drawingPoints.push(point3)
                this.drawingPoints.push(point4)
                // 清空绘制图层
                drawCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                // 绘制区域至保存图层
                this.drawedPoints.push(this.drawingPoints)
                this.drawSaveArea(this.drawingPoints)
                
                this.drawingPoints = []
                this.isDrawing = false
                // this.l = Math.round(l * this.ratio)
                this.l = l          
                // 绘制结束逻辑
                this.drawCanvas.removeEventListener("click", this.drawImageClickFn)
                // this.drawCanvas.removeEventListener("dblclick", this.drawImageDblClickFn)
                this.drawCanvas.removeEventListener("mousemove", this.drawImageMoveFn)
              }else{
                // this.x = Math.round(pointX * this.ratio)
                // this.y = Math.round(pointY * this.ratio)
                this.x = pointX
                this.y = pointY
                this.drawingPoints.push([pointX, pointY])
              }
              
            }else{
              this.$message.warning('所画点与上一点重合，请重新选择点位',3);
            }
          }else{
            this.$message.warning('矩形框已绘制，如需修改，请先点击全部清除，再重新画框',3);
          } 
        }
      },
      drawImageMoveFn(e) {
        // debugger
        let drawCtx = this.drawCtx
        if (e.offsetX || e.layerX) {
          let pointX = e.offsetX == undefined ? e.layerX : e.offsetX;
          let pointY = e.offsetY == undefined ? e.layerY : e.offsetY;
          // 绘制
          drawCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
   
          // 绘制点
          drawCtx.fillStyle = 'blue'
          this.drawingPoints.forEach((item, i) => {
            drawCtx.beginPath();
            drawCtx.arc(...item, 6, 0, 180)
            drawCtx.fill(); //填充
          })
   
          // 绘制动态区域
          drawCtx.save()
          drawCtx.beginPath();
          this.drawingPoints.forEach((item, i) => {
            drawCtx.lineTo(...item)
          })
          drawCtx.lineTo(pointX, pointY)
          drawCtx.lineWidth = "3";
          drawCtx.strokeStyle= "blue";
          drawCtx.fillStyle = 'rgba(255, 0, 0, 0.3)'
          drawCtx.stroke();
          drawCtx.fill(); //填充
          drawCtx.restore()
        }
      },
      drawSaveArea(points) {
        // debugger
        if(!points instanceof Array || points.length === 0) return
        this.saveCtx.save()
        this.saveCtx.beginPath();
        points.forEach((item, i) => {
          this.saveCtx.lineTo(...item)
        })
        this.saveCtx.closePath()
        this.saveCtx.lineWidth="2";
        
        if (this.color == "0"){
          this.saveCtx.fillStyle = 'rgba(255,255, 255, 0.3)'
          this.saveCtx.strokeStyle= "black";
        }else{
          this.saveCtx.fillStyle = 'rgba(0,0,0, 0.3)'
          this.saveCtx.strokeStyle= "white";
        }
        this.saveCtx.stroke();
        this.saveCtx.fill(); //填充
        this.saveCtx.restore();
        this.savePoints();
      },
   
      savePoints() { // 将画布坐标数据转换成提交数据
        // debugger
        let objectPoints = []
        if (this.drawedPoints.length == 0){
          this.$message.warning('请先绘制后门区域',3);
          return
        }
        // "object": [{"polygon": {"x1":700,"y1":273,"x2":975,"y2":278,"x3":1107,"y3":368,"x4":718,"y4":354} }]
        objectPoints = this.drawedPoints.map(area => {
          let polygon = {}
          area.forEach((point, i) => {
            polygon[`x${i+1}`] = Math.round(point[0] * this.ratio)
            polygon[`y${i+1}`] = Math.round(point[1] * this.ratio)
          })
          return {
            "polygon": polygon
          }
        })
        this.submitData = objectPoints
        let x = objectPoints[0].polygon.x1
        let y = objectPoints[0].polygon.y1
        let l = Math.abs(objectPoints[0].polygon.x2-objectPoints[0].polygon.x1)
        this.$emit("updataTrigger", this.indexInParent, x, y, l, this.color)
        console.log('最终提交数据', this.submitData)
      },
      renderDatas() { // 将提交数据数据转换成画布坐标
        // debugger
        this.drawedPoints = this.submitData.map(item => {
          let polygon = item.polygon
          let points = []
          for(let i=1; i< Object.keys(polygon).length/2 + 1; i++) {
            if (!isNaN(polygon[`x${i}`]) && !isNaN(polygon[`y${i}`])) {
              points.push([polygon[`x${i}`]/this.ratio, polygon[`y${i}`]/this.ratio])
            }
          }
          this.drawSaveArea(points)

          return points
        })
        this.savePoints();
      },
      changeTrigger(){
        // debugger
        let points =[]
        this.clearAll()
        if (this.l != 0 && this.drawedPoints.length == 0){
          if ((this.x + this.l) < this.canvasWidth && (this.y + this.l) <this.canvasHeight){
            points.push([this.x, this.y])
            points.push([this.x + this.l, this.y])
            points.push([this.x + this.l, this.y + this.l])
            points.push([this.x, this.y + this.l])
          }else{
            this.$message.warning('后门区域超出图片范围，请重新设置x，y，l',3);
            return
          }
          this.drawedPoints.push(points)
          this.drawSaveArea(points)
        }
        
      },
      changeColor(){
        // debugger
        // let drawCtx = this.drawCtx
        if (this.drawedPoints.length > 0){
          // 清空绘制图层
          this.saveCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
          // 绘制区域至保存图层
          this.drawSaveArea(this.drawedPoints[0])
        }
      }
    }
  };
  </script>
  <style scoped>
  .tool-box {
    width: 1056px;
    height: 70px;
    padding: 5px 0px;
    margin: 20px auto 0;
    box-sizing: border-box;
    /* text-align: right; */
  }
  .canvasDiv{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 1056px;
    height: 224px;
    background: #F2F4F9;
    padding: 32px 56px;
  }
  .canvas-wrap {
    width: 160px;
    height: 160px;
    margin: 0px auto;
    /* background-color: #7a3a3a; */
    border: 3px;
    border-color: #242323;
    position: relative;
  }
  #imgCanvas0, #imgCanvas1, #imgCanvas2, #imgCanvas3, #imgCanvas4, #imgCanvas5, 
  #drawCanvas0, #drawCanvas1, #drawCanvas2, #drawCanvas3, #drawCanvas4, #drawCanvas5, 
  #saveCanvas0, #saveCanvas1, #saveCanvas2, #saveCanvas3, #saveCanvas4, #saveCanvas5 {
    background: rgba(255, 0, 255, 0);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  #drawCanvas0, #drawCanvas1, #drawCanvas2, #drawCanvas3, #drawCanvas4, #drawCanvas5 {
    z-index: 2;
  }
  .triggerName{
    /* color: var(--gray-2, #3E4453); */
    text-align: center;
    font-family: HONOR Sans CN;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    text-align: right;
  }
  </style>