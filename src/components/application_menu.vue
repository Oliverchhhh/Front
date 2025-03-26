<template>
    <div class="hold">
      <div class="stage-header">
        <h1>应用模块</h1>
      </div>
      <a-divider style="border-color: #7cb305" dashed />
      <div class="box-container">

          <div class="funcs">
            <ifreme @click.native="goFuncPage('/advAttackDefense')">
            <div slot="func_icon">
            <img class="icon_img" src="../assets/img/advDefenseIcon.png">
            </div>
            <div slot="header" class="func_name">对抗攻击防御</div>
            <div slot="des_func" class="func_des">从对抗样本检测、对抗噪声擦除和模型防御力增强等三个角度阻截对抗样本的攻击，并使神经网络模型在面对对抗样本时仍能发挥正常功能</div>
        </ifreme>
          </div>
          <div class="funcs">
            <ifreme @click.native="goFuncPage('/backdoorDefense')">
                <div slot="func_icon">
                <img class="icon_img" src="../assets/img/bkDefenseIcon.png">
                </div>
                <div slot="header" class="func_name">后门攻击防御</div>
                <div slot="des_func" class="func_des">后门攻击防御包括后门检测和后门逆向，力求做到发现后门并还原后门的效果，使后门攻击的威胁大大降低</div>
            </ifreme>
          </div>
        </div>

    </div>
  </template>
   
  <script>
  import ifreme_chart from './ifreme.vue';
  export default {
    name: "func_menu",
    components: {
      ifreme:ifreme_chart
    },
    methods: {
      //el 标签  speed 滚动速率 此处是50px 值越大滚动的越快
      goAssignBlock(el, speed) {
        let _this = this;
        let windowH = window.innerHeight; //浏览器窗口高度
        let h = this.$refs[el].offsetHeight; //模块内容高度
        let t = this.$refs[el].offsetTop; //模块相对于内容顶部的距离
        // let top = t - (windowH - h) / 2; //需要滚动到的位置，若改为 t 则滚动到模块顶部位置，此处是滚动到模块相对于窗口垂直居中的位置
        let top = t;
        let scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop; //滚动条距离顶部高度
        let currentTop = scrollTop; //默认滚动位置为当前滚动条位置，若改为0，则每次都会从顶部滚动到指定位置
        let requestId;
        //采用requestAnimationFrame，平滑动画
        function step() {
          //判断让滚动条向上滚还是向下滚
          if (scrollTop < top) {
            if (currentTop <= top) {
              //   window.scrollTo(x,y) y为上下滚动位置
              window.scrollTo(0, currentTop);
              requestId = window.requestAnimationFrame(step);
            } else {
              window.cancelAnimationFrame(requestId);
            }
            //向下滚动
            currentTop += speed;
          } else {
            if (top <= currentTop) {
              //注：此处 - speed 是解决居中时存在的问题，可自行设置或去掉
              window.scrollTo(0, currentTop - speed);
              requestId = window.requestAnimationFrame(step);
            } else {
              window.cancelAnimationFrame(requestId);
            }
            //向上滚动
            currentTop -= speed;
          }
        }
        window.requestAnimationFrame(step);
      },
      // 获取页面滚动距离，设定导航栏位置
      handleScroll () {
        const that = this;
        that.$nextTick(()=> {
          let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
              // console.log(scrollTop, '滚动距离');
            if(scrollTop>300) {
              that.$refs.div_box.style = 'top:'+150+'px';
            } else {
              that.$refs.div_box.style = 'top: 60%';
            }
        })  
          },
        // 滚动重置
      beforeDestroy () {
          window.removeEventListener('scroll', this.handleScroll);
      },
      goFuncPage(path){
        if (path==''){
          this.$message.warning('功能开发中，敬请期待！',3);
        }else{
          this.$router.push(path);
        }
        
        // alert(path);
        // console.log(path);
      }
    }, 
    mounted() {
      window.addEventListener('scroll', this.handleScroll);
    }
  }
  </script>
   
  <style scoped>
  .ant-layout-content {
      background-color: #F5F8FF;
    }
  
  .hold {
    width: 100%;
    margin: 0 auto;
  ;
  }
  .btn-box {
    position: fixed;
    left: 10%;
    top: 60%;
    transition-property: top;
    transition-duration: 1s;
    z-index: 500;
  }
  
  .btn-box button {
    display: block;
    width: 160px;
    height: 50px;
    background:transparent;
    border: none;
    border-left: 4px solid #DBE1F0;
    cursor: pointer;
    padding-left: 15px;
    font-family: HONOR Sans CN;
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
    letter-spacing: 2px;
    text-align: left;
    color: #0B55F4;
  
  }
  .btn-box button:hover {
    border-left: 4px solid hsl(221, 98%, 68%);;
    /* background: hsl(221, 98%, 68%); */
  }
  .onceConf {
    position: fixed;
    height: 80px  !important;
    width: 80px !important;
    background: #0B55F4 !important;
    color: aliceblue !important;
    word-wrap: break-word;
    white-space: normal;
    word-break: break-all;
    border: none !important;
    text-align: center !important;
    right: 200px;
    bottom: 50px;
    padding: unset !important;
  }
  
  .ant-btn:hover {
    opacity: 1 !important; 
    transition: 1s !important;
    transform: scale(1.05) !important;
  }
  
  .block {
    width: 60%;
    height: fit-content;
    margin: 3%  auto;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    color: black;
    box-sizing: border-box;
  }
  
  .block_title{
      font-family: HONOR Sans CN;
      font-size: 28px;
      font-weight: 600;
      /* line-height: 32px; */
      letter-spacing: 1px;
      /* color: #0B55F4; */
      text-align: left;
      margin: 1% 0;
  }
  
  .block_subtitle{
      font-family: HONOR Sans CN;
      font-size: 22px;
      font-weight: 550;
      /* line-height: 32px; */
      letter-spacing: 1px;
      /* color: #0B55F4; */
      text-align: left;
      margin: 1% 0;
  }
  
  /* .funcs {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    align-content: flex-start;
    gap: 10px;
    margin: 10px;
  } */
  .func_name {
    font-family: HONOR Sans CN;
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    letter-spacing: 0px;
    text-align: left;
    /* color: #0B55F4; */
    margin-left: 5%;
  }
  
  .func_des {
    font-family: HONOR Sans CN;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0px;
    text-align: left;
    margin: 1% 5% 5% 5%;
  }
  
  .icon_img{
      width: 68px;
      height: 68px;
  }
  
  /* 给 .box-container 添加空隙 */
  .box-container {
    display: flex;
    justify-content: space-around; /* 或者使用 space-between 以调整间距 */
    margin-bottom: 30px;
    padding: 0 20px; /* 在两侧添加间距 */
  }
  
  /* 调整每个矩形框的宽度 */
  .box {
    width: 26%; /* 调整为较小的宽度 */
    background-color: #E0F2FF;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin: 0 10px; /* 给每个矩形框添加左右间距 */
  }
  
  /* 调整功能卡片的居中 */
  .funcs {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column; /* 改为垂直排列 */
    justify-content: center; /* 居中对齐 */
    align-items: center; /* 居中对齐 */
    align-content: flex-start;
    gap: 10px;
    margin: 10px 0; /* 添加上下间距 */
  }
  
  .arrow {
    text-align: center;
    font-size: 24px;
    color: #0B55F4;
    margin-bottom: 20px;
  }
  
  .custom-divider {
    font-size: 48px;  /* 设置字体大小 */
  }
  .bottom-box {
    padding: 20px;
  }
  
  .funcs {
    display: flex;
    justify-content: space-between; /* 水平排列，间距均匀 */
    gap: 20px; /* 卡片间距 */
    flex-wrap: wrap; /* 如果容器宽度不足时自动换行 */
  }
  
  .func-card {
    width: 30%; /* 设置每个卡片的宽度，可以根据需要调整 */
    min-width: 250px; /* 设置最小宽度，确保卡片不会过于拥挤 */
    border: 1px solid #ddd; /* 设置边框，类似矩形框 */
    border-radius: 8px; /* 设置圆角 */
    padding: 16px; /* 内边距 */
    background-color: #fff; /* 背景颜色 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加阴影 */
    cursor: pointer;
    transition: transform 0.3s ease; /* 添加动画效果 */
  }
  
  .func-card:hover {
    transform: translateY(-5px); /* 鼠标悬停时轻微上移 */
  }
  
  .func-name {
    font-size: 18px;
    font-weight: bold;
    margin-top: 12px;
  }
  
  .func-des {
    font-size: 14px;
    color: #555;
    margin-top: 8px;
  }
  
  /* 小矩形块样式 */
  .stage-container {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;
    }
  
    .stage-box {
      width: 25%;
      background-color: #E0F2FF;
      padding: 10px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  
    .stage-title {
      font-family: HONOR Sans CN;
      font-size: 40px;
      font-weight: 600;
      color: #0B55F4;
    }
  
  .stage-header {
    background-color: #E6EFFF;
    padding: 20px;
    margin: 20px auto;
    width: 80%;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .stage-header h1 {
    color: #0B55F4;
    font-family: 'HONOR Sans CN';
    font-size: 32px;
    font-weight: 600;
    margin: 0;
  }
  </style>
  