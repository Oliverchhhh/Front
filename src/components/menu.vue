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
        <span class="stage-title">训练数据生成</span>
      </div>
      <div class="stage-box">
        <span class="stage-title">训练算法设计</span>
      </div>
      <div class="stage-box">
        <span class="stage-title">模型性能稳定性优化</span>
      </div>
    </div>

    <!-- 功能卡片容器 -->
    <div class="box-container">
      <!-- 第一个矩形方框 (准备阶段) -->
      <div class="box">
        <div class="funcs">
          <!-- 数据公平性评估 -->
          <ifreme  @click.native="goFuncPage('/dataFairnessEva')">
            <div slot="func_icon">
              <img class="icon_img" src="../assets/img/dataFairEvalIcon.png">
            </div>
            <div slot="header" class="func_name">数据公平性评估</div>
            <div slot="des_func" class="func_des">针对数据集存在偏见的现象，通过数据公平性评估算法，对数据集整体进行评估，可视化展示数据群体、个体、属性占比、属性相关性的评估结果</div>
          </ifreme>
          <ifreme @click.native="goFuncPage('/advAttack')">
            <div slot="func_icon">
              <img class="icon_img" src="../assets/img/advAttackEvalIcon.png">
            </div>
            <div slot="header" class="func_name">对抗性数据生成</div>
            <div slot="des_func" class="func_des">汇集多种主流对抗攻击方法，包括黑盒对抗攻击、白盒对抗攻击，探索深度学习模型在对抗攻击方面的鲁棒性下限，可视化展示攻击对模型的影响</div>
          </ifreme>
        </div>
      </div>
      <!-- 第二个矩形方框 (当前标题: 模型性能稳定性优化) -->
      <!-- 将显示原"训练算法设计"的卡片 -->
      <div class="box">
        <div class="funcs">
        <!-- 数据公平性提升 -->
        <ifreme @click.native="goFuncPage('/dataFairnessDebias')"> 
          <div slot="func_icon">
            <img class="icon_img" src="../assets/img/dataFairDebiasIcon.png">
          </div>
          <div slot="header" class="func_name">数据公平性提升</div>
          <div slot="des_func" class="func_des">基于公平表征学习和数据重赋权等方法对数据集进行纠偏，从群体和个体公平性两个维度对提升前后的数据集进行评估对比</div>
        </ifreme>
        <!-- 模型鲁棒性训练 -->
        <ifreme  @click.native="goFuncPage('robust_advTraining')">
            <div slot="func_icon">
              <img class="icon_img" src="../assets/img/robustTrainingIcon.png">
            </div>
            <div slot="header" class="func_name">对抗性训练算法</div>
            <div slot="des_func" class="func_des">通过可认证鲁棒训练、对抗训练等方式来对AI模型进行安全加固，提升模型在对抗样本攻击下的鲁棒性</div>
          </ifreme>
        </div>
      </div>
      <!-- 第三个矩形方框 (当前标题: 训练算法设计) -->
      <!-- 将显示原"模型性能稳定性优化"的卡片 -->
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
        </div>
      </div>
    </div>

    <!-- 将分割线和第二个走马灯移到 box-container 外面 -->
    <!-- 暂时注释掉第二个轮播模块 -->
    <!--
    <a-divider style="border-color: #7cb305" dashed />
    
    <!-- 第二个走马灯 -->
    <!--
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
    -->
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
          videoSrc: require('../../static/img/architecture.mp4'),
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
          // 暂时注释掉第二个轮播图的数据源
          /*
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
          */
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
    // 暂时注释掉第二个轮播图的控制方法
    /*
    prevSlide2() {
      this.$refs.carousel2.prev();
    },
    nextSlide2() {
      this.$refs.carousel2.next();
    }
    */
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
  background: linear-gradient(180deg, #f8fbff 0%, #ffffff 50%, #f8fbff 100%);
  min-height: 100vh;
  padding: 20px 0;
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

/* 调整功能卡片的居中 - 确保完全展示 */
.funcs {
  display: flex;
  flex-wrap: nowrap; /* 防止换行 */
  flex-direction: column; /* 垂直排列 */
  justify-content: flex-start; /* 顶部对齐 */
  align-items: center; /* 水平居中 */
  gap: 20px; /* 增加间距 */
  margin: 0; /* 移除外边距 */
  padding: 10px 0; /* 添加内边距 */
  background-color: transparent;
  width: 100%;
  min-height: fit-content; /* 确保高度适应内容 */
}

/* 修改每个矩形框的样式 - 现代化设计 */
.box {
  width: calc(33.33% - 27px); /* 调整宽度以适应新的gap */
  background: linear-gradient(135deg, #ffffff 0%, #f8fbff 50%, #e8f4fd 100%);
  padding: 30px 20px;
  border-radius: 24px;
  box-shadow: 
    0 10px 30px rgba(11, 85, 244, 0.08),
    0 4px 15px rgba(11, 85, 244, 0.04),
    0 1px 3px rgba(0, 0, 0, 0.02);
  margin: 0;
  border: 1px solid rgba(11, 85, 244, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: visible;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 移除固定高度设置，让flexbox的stretch生效 */
}

.box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #0B55F4, #4A90E2, #7CB9E8);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.box:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 25px 50px rgba(11, 85, 244, 0.15),
    0 10px 30px rgba(11, 85, 244, 0.08),
    0 5px 15px rgba(11, 85, 244, 0.05);
  border-color: rgba(11, 85, 244, 0.15);
}

.box:hover::before {
  opacity: 1;
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

/* 修改 box-container 的样式 - 响应式布局 */
.box-container {
  display: flex;
  justify-content: center;
  align-items: stretch; /* 让所有box高度保持一致 */
  flex-wrap: wrap; /* 允许换行 */
  margin: 30px auto 40px auto; /* 增加与标题框和底部的间距 */
  padding: 0 20px;
  gap: 40px; /* 增加列间距 */
  width: 90%;
  max-width: 1400px;
}

/* 修改 stage-container 的样式 - 响应式布局 */
.stage-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 40px auto 30px auto; /* 增加与轮播的间距 */
  width: 90%;
  max-width: 1400px;
  gap: 40px; /* 与box-container保持一致的间距 */
}

.stage-box {
  width: calc(33.33% - 27px); /* 调整宽度以适应新的gap */
  background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 50%, #e8f4fd 100%);
  padding: 20px 10px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 
    0 8px 25px rgba(11, 85, 244, 0.08),
    0 3px 12px rgba(11, 85, 244, 0.04),
    0 1px 3px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(11, 85, 244, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stage-box::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #0B55F4, #4A90E2, #7CB9E8);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stage-box:hover {
  transform: translateY(-3px);
  box-shadow: 
    0 15px 35px rgba(11, 85, 244, 0.12),
    0 8px 20px rgba(11, 85, 244, 0.06),
    0 3px 8px rgba(11, 85, 244, 0.03);
  border-color: rgba(11, 85, 244, 0.15);
}

.stage-box:hover::before {
  opacity: 1;
}

.stage-title {
  font-family: HONOR Sans CN;
  font-size: 40px;
  font-weight: 600;
  color: #0B55F4;
}
.video-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 30px 0; /* 使用padding而不是固定高度 */
  margin: 0 auto;
}

.video {
  width: 80%; /* 适中的宽度，不占满也不会太小 */
  max-width: 1000px; /* 设置合理的最大宽度 */
  height: auto; /* 保持宽高比 */
  border-radius: 16px; /* 添加圆角 */
  box-shadow: 0 8px 30px rgba(11, 85, 244, 0.15); /* 添加阴影效果 */
  transition: all 0.3s ease; /* 平滑过渡效果 */
}

.video:hover {
  box-shadow: 0 12px 40px rgba(11, 85, 244, 0.2); /* 悬停时增强阴影 */
  transform: scale(1.02); /* 轻微放大效果 */
}
.image_4 {
  width: 100%; /* 根据需求设置视频宽度 */
  height: auto; /* 自动调整高度 */
}

/* 轮播图容器样式 - 自适应高度 */
.carousel-container {
  width: 80%;
  margin: 40px auto 20px auto; /* 调整上下边距，与视频和标题框保持合适间距 */
  min-height: 400px;
  height: auto; /* 改为自适应高度 */
}

/* 轮播卡片样式 - 现代化设计 */
.carousel-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffffff 0%, #f8fbff 50%, #e8f4fd 100%);
  border-radius: 24px;
  padding: 40px 30px;
  margin: 0 30px;
  min-height: 320px;
  height: auto; /* 改为自适应高度 */
  box-shadow: 
    0 12px 35px rgba(11, 85, 244, 0.08),
    0 6px 20px rgba(11, 85, 244, 0.04),
    0 2px 8px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(11, 85, 244, 0.08);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.carousel-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #0B55F4, #4A90E2, #7CB9E8);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.carousel-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, rgba(11, 85, 244, 0.02) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 0;
}

.carousel-card:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 25px 60px rgba(11, 85, 244, 0.15),
    0 12px 35px rgba(11, 85, 244, 0.08),
    0 6px 15px rgba(11, 85, 244, 0.05);
  border-color: rgba(11, 85, 244, 0.15);
}

.carousel-card:hover::before,
.carousel-card:hover::after {
  opacity: 1;
}

.carousel-card > * {
  position: relative;
  z-index: 1;
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

/* 这个样式被下面的响应式样式覆盖，用于向后兼容 */

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
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 8px 25px rgba(11, 85, 244, 0.08),
    0 4px 12px rgba(11, 85, 244, 0.04),
    0 1px 3px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(11, 85, 244, 0.08);
  backdrop-filter: blur(10px);
}

.custom-slick-arrow:hover {
  background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%);
  box-shadow: 
    0 12px 35px rgba(11, 85, 244, 0.15),
    0 8px 20px rgba(11, 85, 244, 0.08),
    0 3px 8px rgba(11, 85, 244, 0.04);
  border-color: rgba(11, 85, 244, 0.15);
  transform: scale(1.05);
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

/* ========== 响应式设计 ========== */

/* 大屏幕 (1400px以上) */
@media (min-width: 1400px) {
  .box {
    width: calc(33.33% - 27px);
  }
  .stage-box {
    width: calc(33.33% - 27px);
  }
  .box-container {
    gap: 40px;
  }
}

/* 中等屏幕 (1024px - 1399px) */
@media (max-width: 1399px) and (min-width: 1024px) {
  .box {
    width: calc(33.33% - 27px);
  }
  .stage-box {
    width: calc(33.33% - 27px);
  }
  .box-container {
    width: 95%;
    gap: 40px;
    margin: 25px auto 35px auto; /* 调整大屏幕间距 */
  }
  .stage-container {
    width: 95%;
    gap: 40px;
    margin: 35px auto 25px auto; /* 调整大屏幕间距 */
  }
}

/* 小屏幕 (768px - 1023px) */
@media (max-width: 1023px) and (min-width: 768px) {
  .box {
    width: calc(50% - 20px); /* 两列布局时调整宽度 */
    margin-bottom: 30px;
    padding: 25px 15px;
  }
  .stage-box {
    width: calc(50% - 20px);
  }
  .box-container {
    width: 100%;
    padding: 0 15px;
    gap: 30px; /* 适中的间距 */
    align-items: stretch; /* 确保所有box高度一致 */
    margin: 20px auto 30px auto; /* 平板设备间距 */
  }
  .stage-container {
    width: 100%;
    padding: 0 15px;
    gap: 30px;
    margin: 30px auto 20px auto; /* 平板设备间距 */
  }
  .stage-title {
    font-size: 32px;
  }
  .funcs {
    gap: 15px;
    padding: 5px 0;
  }
  .video-container {
    padding: 25px 0;
  }
  .video {
    width: 85%; /* 平板设备稍大一些 */
    max-width: 800px;
  }
}

/* 手机屏幕 (767px以下) */
@media (max-width: 767px) {
  .box {
    width: 100%;
    margin-bottom: 25px;
    padding: 25px 15px;
    min-height: auto;
    align-items: center;
  }
  .stage-box {
    width: 100%;
    margin-bottom: 15px;
  }
  .box-container {
    width: 100%;
    padding: 0 10px;
    gap: 25px; /* 单列时也保持合适间距 */
    align-items: stretch;
    margin: 15px auto 25px auto; /* 手机端间距 */
  }
  .stage-container {
    width: 100%;
    padding: 0 10px;
    gap: 25px;
    margin: 25px auto 15px auto; /* 手机端间距 */
  }
  .stage-title {
    font-size: 24px;
  }
  .func_name {
    font-size: 20px;
    line-height: 28px;
  }
  .func_des {
    font-size: 13px;
    line-height: 20px;
  }
  .icon_img {
    width: 56px;
    height: 56px;
  }
  .funcs {
    gap: 18px;
    padding: 8px 0;
    width: 100%;
  }
  .video-container {
    padding: 20px 0;
  }
  .video {
    width: 90%; /* 手机端宽度 */
    max-width: 600px;
    border-radius: 12px; /* 稍小的圆角 */
  }
}

/* 超小屏幕 (480px以下) */
@media (max-width: 480px) {
  .box {
    padding: 20px 12px;
    margin-bottom: 20px;
    align-items: center;
  }
  .stage-box {
    padding: 15px 10px;
  }
  .stage-title {
    font-size: 20px;
  }
  .func_name {
    font-size: 18px;
    line-height: 26px;
  }
  .func_des {
    font-size: 12px;
    line-height: 18px;
  }
  .funcs {
    gap: 15px;
    padding: 6px 0;
  }
  .video-container {
    padding: 15px 0;
  }
  .video {
    width: 95%; /* 小屏幕更大宽度 */
    max-width: 500px;
    border-radius: 10px;
  }
}

/* 轮播组件响应式设计 */
@media (max-width: 1023px) {
  .carousel-container {
    width: 95%;
    margin: 40px auto 8px auto; /* 调整平板设备的间距 */
    min-height: 350px;
    height: auto;
  }
  .carousel-card {
    min-height: 280px;
    height: auto;
    padding: 30px 20px;
    margin: 0 15px;
  }
  .carousel-card .func_name {
    font-size: 24px;
    line-height: 32px;
  }
  .carousel-card .func_des {
    font-size: 14px;
    line-height: 22px;
  }
  .carousel-card .icon_img {
    width: 70px;
    height: 70px;
  }
}

@media (max-width: 767px) {
  .carousel-container {
    width: 100%;
    min-height: 320px;
    height: auto;
    margin: 35px auto 8px auto; /* 增加手机端上边距 */
  }
  .carousel-card {
    min-height: 250px;
    height: auto;
    padding: 25px 15px;
    margin: 0 10px;
  }
  .carousel-card .func_name {
    font-size: 20px;
    line-height: 28px;
    margin: 12px 0;
  }
  .carousel-card .func_des {
    font-size: 13px;
    line-height: 20px;
    margin: 8px 15px;
  }
  .carousel-card .icon_img {
    width: 60px;
    height: 60px;
  }
}

/* 修复轮播组件在极端缩放下的显示问题 */
.ant-carousel :deep(.slick-slide) {
  text-align: center;
  min-height: 300px;
  height: auto !important; /* 强制自适应高度 */
  line-height: normal;
  overflow: visible; /* 确保内容不被裁剪 */
  background: transparent;
}

@media (max-width: 480px) {
  .carousel-container {
    min-height: 300px;
    height: auto;
    width: 95%;
    margin: 30px auto 6px auto; /* 调整小屏幕间距 */
  }
  .carousel-card {
    min-height: 230px;
    height: auto;
    padding: 20px 10px;
    margin: 0 5px;
  }
  .carousel-card .func_name {
    font-size: 18px;
    line-height: 26px;
    margin: 10px 0;
  }
  .carousel-card .func_des {
    font-size: 12px;
    line-height: 18px;
    margin: 6px 10px;
  }
  .carousel-card .icon_img {
    width: 50px;
    height: 50px;
  }
}

/* 极小屏幕优化 (320px以下) */
@media (max-width: 320px) {
  .box {
    padding: 18px 8px;
    margin-bottom: 15px;
    border-radius: 20px;
    align-items: center;
  }
  .stage-box {
    padding: 12px 8px;
    border-radius: 16px;
  }
  .stage-title {
    font-size: 16px;
  }
  .func_name {
    font-size: 16px;
    line-height: 24px;
    margin-left: 3%;
  }
  .func_des {
    font-size: 11px;
    line-height: 16px;
    margin: 1% 3% 3% 3%;
  }
  .icon_img {
    width: 48px;
    height: 48px;
  }
  .funcs {
    gap: 12px;
    padding: 5px 0;
  }
  .carousel-container {
    min-height: 280px;
    width: 98%;
    margin: 25px auto 5px auto; /* 调整极小屏幕间距 */
  }
  .carousel-card {
    min-height: 210px;
    padding: 15px 8px;
    margin: 0 3px;
    border-radius: 20px;
  }
  .carousel-card .func_name {
    font-size: 16px;
    line-height: 22px;
    margin: 8px 0;
  }
  .carousel-card .func_des {
    font-size: 11px;
    line-height: 16px;
    margin: 5px 8px;
  }
  .carousel-card .icon_img {
    width: 45px;
    height: 45px;
  }
  .video-container {
    padding: 12px 0;
  }
  .video {
    width: 95%; /* 极小屏幕宽度 */
    max-width: 400px;
    border-radius: 8px;
  }
}

/* 超极小屏幕优化 (240px以下) - 处理极端缩放情况 */
@media (max-width: 240px) {
  .box {
    padding: 15px 6px;
    margin-bottom: 12px;
    border-radius: 16px;
    align-items: center;
  }
  .stage-box {
    padding: 15px 8px;
    margin-bottom: 12px;
    border-radius: 16px;
  }
  .stage-title {
    font-size: 14px;
  }
  .func_name {
    font-size: 14px;
    line-height: 20px;
  }
  .func_des {
    font-size: 10px;
    line-height: 14px;
  }
  .icon_img {
    width: 40px;
    height: 40px;
  }
  .funcs {
    gap: 10px;
    padding: 3px 0;
  }
  .carousel-container {
    min-height: 250px;
    width: 100%;
    margin: 20px auto 5px auto; /* 调整最小屏幕间距 */
  }
  .carousel-card {
    min-height: 180px;
    padding: 12px 6px;
    margin: 0 2px;
    border-radius: 16px;
  }
  .carousel-card .func_name {
    font-size: 14px;
    line-height: 20px;
    margin: 6px 0;
  }
  .carousel-card .func_des {
    font-size: 10px;
    line-height: 14px;
    margin: 4px 6px;
  }
  .carousel-card .icon_img {
    width: 36px;
    height: 36px;
  }
  .video-container {
    padding: 10px 0;
  }
  .video {
    width: 98%; /* 超极小屏幕宽度 */
    max-width: 300px;
    border-radius: 6px;
  }
}
</style>
