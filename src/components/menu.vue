<template>
  <div class="hold"  >
    <!-- 功能划分：数据 -->
    <div class="video-container">
      <video class="video" loop autoplay muted>
        <source :src="videoSrc" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>

    <!-- 添加流水灯轮播组件 -->
    <div class="carousel-container">
      <a-carousel arrows ref="carousel">
        <template #prevArrow>
          <div class="custom-slick-arrow" style="left: 10px; z-index: 1" @click="prevSlide">
            <span class="arrow-text">‹</span>
          </div>
        </template>
        <template #nextArrow>
          <div class="custom-slick-arrow" style="right: 10px" @click="nextSlide">
            <span class="arrow-text">›</span>
          </div>
        </template>
        <div v-for="(card, index) in carouselCards" :key="index">
          <div class="carousel-card" @click="goFuncPage(card.path)">
            <div class="func-icon">
              <img class="icon_img" :src="card.iconSrc">
            </div>
            <div class="func_name">{{ card.title }}</div>
            <div class="func_des">{{ card.description }}</div>
          </div>
        </div>
      </a-carousel>
    </div>

    <a-divider style="border-color: #7cb305" dashed />
    <!-- 小矩形块区域 -->
    <div class="stage-container">
      <div class="stage-box">
        <span class="stage-title">准备阶段</span>
      </div>
      <div class="stage-box">
        <span class="stage-title">训练阶段</span>
      </div>
      <div class="stage-box">
        <span class="stage-title">部署阶段</span>
      </div>
    </div>

    <!-- 功能卡片容器 -->
    <div class="box-container">
      <!-- 第一个矩形方框 -->
      <div class="box">
        <div class="funcs">
          <ifreme @click.native="goFuncPage('/dataFairnessDebias')"> 
            <div slot="func_icon">
              <img class="icon_img" src="../assets/img/dataFairDebiasIcon.png">
            </div>
            <div slot="header" class="func_name">数据公平性提升</div>
            <div slot="des_func" class="func_des">基于公平表征学习和数据重赋权等方法对数据集进行纠偏，从群体和个体公平性两个维度对提升前后的数据集进行评估对比</div>
          </ifreme>
          <ifreme @click.native="goFuncPage('/advAttack')">
            <div slot="func_icon">
              <img class="icon_img" src="../assets/img/advAttackEvalIcon.png">
            </div>
            <div slot="header" class="func_name">对抗攻击评估</div>
            <div slot="des_func" class="func_des">汇集多种主流对抗攻击方法，包括黑盒对抗攻击、白盒对抗攻击，探索深度学习模型在对抗攻击方面的鲁棒性下限，可视化展示攻击对模型的影响</div>
          </ifreme>
        </div>
      </div>
      <!-- 第二个矩形方框 -->
      <div class="box">
        <div class="funcs">
          <ifreme  @click.native="goFuncPage('/modelFairnessDebias')">
            <div slot="func_icon">
              <img class="icon_img" src="../assets/img/modelFairDebiasIcon.png">
            </div>
            <div slot="header" class="func_name">模型公平性提升</div>
            <div slot="des_func" class="func_des">模型决策会存在偏见，通过公平性提升算法，提升模型的公平性，减少偏见，可视化展示提升前后对比</div>
          </ifreme>
          <ifreme  @click.native="goFuncPage('robust_advTraining')">
            <div slot="func_icon">
              <img class="icon_img" src="../assets/img/robustTrainingIcon.png">
            </div>
            <div slot="header" class="func_name">模型鲁棒性训练</div>
            <div slot="des_func" class="func_des">通过可认证鲁棒训练、对抗训练等方式来对AI模型进行安全加固，提升模型在对抗样本攻击下的鲁棒性</div>
          </ifreme>
        </div>
      </div>
      <!-- 第三个矩形方框 -->
      <div class="box">
        <div class="funcs">
          <ifreme  @click.native="goFuncPage('/modelFairnessDebias')">
            <div slot="func_icon">
              <img class="icon_img" src="../assets/img/modelFairDebiasIcon.png">
            </div>
            <div slot="header" class="func_name">模型公平性提升</div>
            <div slot="des_func" class="func_des">模型决策会存在偏见，通过公平性提升算法，提升模型的公平性，减少偏见，可视化展示提升前后对比</div>
          </ifreme>
          <ifreme @click.native="goFuncPage('/advAttackDefense')">
            <div slot="func_icon">
              <img class="icon_img" src="../assets/img/advDefenseIcon.png">
            </div>
            <div slot="header" class="func_name">对抗攻击防御</div>
            <div slot="des_func" class="func_des">从对抗样本检测、对抗噪声擦除和模型防御力增强等三个角度阻截对抗样本的攻击，并使神经网络模型在面对对抗样本时仍能发挥正常功能</div>
          </ifreme>
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

    <!-- 将分割线和第二个走马灯移到 box-container 外面 -->
    <a-divider style="border-color: #7cb305" dashed />
    
    <!-- 第二个走马灯 -->
    <div class="carousel-container">
      <a-carousel arrows ref="carousel2">
        <template #prevArrow>
          <div class="custom-slick-arrow" style="left: 10px; z-index: 1" @click="prevSlide2">
            <span class="arrow-text">‹</span>
          </div>
        </template>
        <template #nextArrow>
          <div class="custom-slick-arrow" style="right: 10px" @click="nextSlide2">
            <span class="arrow-text">›</span>
          </div>
        </template>
        <div v-for="(card, index) in carouselCards2" :key="index">
          <div class="carousel-card" @click="goFuncPage(card.path)">
            <div class="func-icon">
              <img class="icon_img" :src="card.iconSrc">
            </div>
            <div class="func_name">{{ card.title }}</div>
            <div class="func_des">{{ card.description }}</div>
          </div>
        </div>
      </a-carousel>
    </div>
  </div>
</template>
 
<script>
import ifreme_chart from './ifreme.vue';
export default {
  name: "func_menu",
  components: {
    ifreme: ifreme_chart
  },
  data() {
        return {
          videoSrc: require('D:/Front/AIcert-web/static/img/architecture.mp4'),
          carouselCards: [
            {
              iconSrc: require('@/assets/img/advAttackEvalIcon.png'),
              title: '对抗攻击评估',
              description: '汇集多种主流对抗攻击方法，包括黑盒对抗攻击、白盒对抗攻击，探索深度学习模型在对抗攻击方面的鲁棒性下限，可视化展示攻击对模型的影响',
              path: '/advAttack'
            },
            {
              iconSrc: require('@/assets/img/bkAttackEvalIcon.png'),
              title: '后门攻击评估',
              description: '集成多种主流投毒攻击方法，对深度学习数据和模型进行攻击，评估模型在后门攻击层面上的应变能力，可视化评估投毒攻击影响',
              path: '/backdoor'
            },
            {
              iconSrc: require('@/assets/img/advTestIcon.png'),
              title: '模型对抗性测试',
              description: '基于攻防战技知识图谱和规则集自动化生成特定场景下的AI模型对抗测试方案，从而对AI模型的鲁棒性进行评估',
              path: '/autoAttack'
            },
            {
              iconSrc: require('@/assets/img/modelFairEvalIcon.png'),
              title: '模型公平性评估',
              description: '针对深度学习模型预测存在偏见的现象，通过30+种模型公平性评估算法，对模型进行评估，从个体公平性和群体公平性可视化展示评估结果',
              path: '/modelFairnessEva'
            }
          ],
          carouselCards2: [
            {
              iconSrc: require('@/assets/img/advDefenseIcon.png'),
              title: '对抗攻击防御',
              description: '从对抗样本检测、对抗噪声擦除和模型防御力增强等三个角度阻截对抗样本的攻击，并使神经网络模型在面对对抗样本时仍能发挥正常功能',
              path: '/advAttackDefense'
            },
            {
              iconSrc: require('@/assets/img/bkDefenseIcon.png'),
              title: '后门攻击防御',
              description: '后门攻击防御包括后门检测和后门逆向，力求做到发现后门并还原后门的效果，使后门攻击的威胁大大降低',
              path: '/backdoorDefense'
            }
          ]
        };
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
    },
    prevSlide() {
      this.$refs.carousel.prev();
    },
    nextSlide() {
      this.$refs.carousel.next();
    },
    prevSlide2() {
      this.$refs.carousel2.prev();
    },
    nextSlide2() {
      this.$refs.carousel2.next();
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
  background-color: transparent; /* 移除白色背景 */
}

/* 修改每个矩形框的样式 */
.box {
  width: calc(33.33% - 40px);
  background-color: #E0F2FF;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 0;
}

/* 修改 ifreme 组件的样式 */
.funcs >>> .ifreme-container {
  background-color: transparent !important; /* 移除 ifreme 组件的背景色 */
}

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

/* 修改 box-container 的样式 */
.box-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: nowrap; /* 防止换行 */
  margin: 20px auto;
  padding: 0 20px;
  gap: 20px;
  width: 80%;
}

/* 修改 stage-container 的样式 */
.stage-container {
  display: flex;
  justify-content: center;
  margin: 20px auto;
  width: 80%;
  gap: 20px;
}

.stage-box {
  width: calc(33.33% - 40px);
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
.video-container {
  display: flex; /* 可以选择用 flexbox 来布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 100vh; /* 万一需要全屏，可以设置高度 */
}
.image_4 {
  width: 100%; /* 根据需求设置视频宽度 */
  height: auto; /* 自动调整高度 */
}

/* 轮播图容器样式 */
.carousel-container {
  width: 80%;
  margin: 20px auto; /* 将上下边距从 40px 减小到 20px */
  height: 400px;
}

/* 轮播卡片样式 */
.carousel-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #E0F2FF;
  border-radius: 8px;
  padding: 30px;
  margin: 0 30px;
  height: 300px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.carousel-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.carousel-card .func_name {
  font-family: HONOR Sans CN;
  font-size: 28px; /* 从 24px 增加到 28px */
  font-weight: 600;
  line-height: 36px; /* 相应调整行高 */
  letter-spacing: 0px;
  text-align: center;
  margin: 15px 0;
}

.carousel-card .func_des {
  font-family: HONOR Sans CN;
  font-size: 16px; /* 从 14px 增加到 16px */
  font-weight: 400;
  line-height: 24px; /* 相应调整行高 */
  letter-spacing: 0px;
  text-align: center;
  margin: 10px 20px;
}

.carousel-card .icon_img {
  width: 80px; /* 从 68px 增加到 80px */
  height: 80px;
}

.ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
  width: 40px;
  height: 40px;
  font-size: 40px;
  color: #0B55F4;
  background-color: rgba(31, 45, 61, 0.11);
  opacity: 0.7;
  z-index: 1;
  cursor: pointer;
}

.ant-carousel :deep(.slick-arrow.custom-slick-arrow:hover) {
  opacity: 1;
  background-color: rgba(31, 45, 61, 0.2);
}

.ant-carousel :deep(.slick-slide) {
  text-align: center;
  height: 400px;
  line-height: normal;
  overflow: hidden;
  background: transparent;
}

.func-icon {
  margin-bottom: 15px;
}

.arrow-icon {
  font-size: 24px;
  font-weight: bold;
  color: #0B55F4;
  line-height: 40px;
}

.custom-slick-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.custom-slick-arrow:hover {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.custom-slick-arrow i {
  font-size: 24px;
  color: #0B55F4;
}

.arrow-text {
  font-size: 36px;
  font-weight: bold;
  color: #0B55F4;
  line-height: 36px;
}
</style>
