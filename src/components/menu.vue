<template>
  <div class="hold"  >
    <!-- 跳转到指定模块 -->
    <div class="btn-box" ref="div_box">
      <button @click="goAssignBlock('block'+ 0,50)">数据</button>
      <button @click="goAssignBlock('block'+ 1,50)">模型</button>
      <button @click="goAssignBlock('block'+ 2,50)">算法</button>
      <button @click="goAssignBlock('block'+ 3,50)">开发框架</button>
      <button @click="goAssignBlock('block'+ 4,50)">操作系统</button>
      <button @click="goAssignBlock('block'+ 5,50)">硬件</button>
      <a-button type="primary" shape="circle" class="onceConf" @click="goFuncPage('/dataClean')">一键<br/>配置</a-button>     
    </div>
    <!-- 功能划分：数据 -->
    <div class="block" ref="block0">
      <p class="block_title">数据</p>
      <!-- 数据类功能block -->
      <div class="funcs">
        <!-- 异常数据检测 -->
        <ifreme @click.native="goFuncPage('/dataClean')">
          <div slot="func_icon">
            <!-- 图片 -->
            <img class="icon_img" src="../assets/img/dataCleanIcon.png">
          </div>
          <!-- 功能名 -->
          <div slot="header" class="func_name">异常数据检测</div>
          <!-- 功能描述 -->
          <div slot="des_func" class="func_des">分析AI系统常见异常数据来源及类型，基于置信学习等多种技术修复异常数据，实现自动化的数据集清洗及量化评估，生成异常检测效果分析报告及清洁的数据集</div>
        </ifreme>

        <!-- 测试样本自动生成 -->
        <ifreme @click.native="goFuncPage('/concolic')">
          <div slot="func_icon">
            <!-- 图片 -->
            <img class="icon_img" src="../assets/img/concolicIcon.png">
          </div>
          <!-- 功能名 -->
          <div slot="header" class="func_name">测试样本自动生成</div>
          <!-- 功能描述 -->
          <div slot="des_func" class="func_des">基于动态符号执行，通过执行具体输入用例获取模型神经元状态，并通过模拟模型计算原理构造约束变量，计算能激活特定未被激活过的新神经元的测试用例</div>
        </ifreme>
        <!-- 数据公平性评估 -->
        <ifreme  @click.native="goFuncPage('')">
          <div slot="func_icon">
            <img class="icon_img" src="../assets/img/dataEvaIcon.png">
          </div>
          <div slot="header" class="func_name">数据公平性评估</div>
          <div slot="des_func" class="func_des">数据集和深度学习模型预测会存在偏见，通过公平性评估算法，对数据集和模型的公平性进行评估，可视化展示评估结果</div>
        </ifreme>
        <!-- 数据公平性提升 -->
        <ifreme>
          <div slot="func_icon">
            <img class="icon_img" src="../assets/img/数据集提升.png">
          </div>
          <div slot="header" class="func_name">数据公平性提升</div>
          <div slot="des_func" class="func_des">基于公平表征学习和数据重赋权等方法对数据集进行纠偏，从群体和个体公平性两个维度对提升前后的数据集进行评估对比</div>
        </ifreme>
      </div>
      
    </div>
    <div class="block" ref="block1">
      <p class="block_title">模型</p>
      <p class="block_subtitle">评估</p>
      <!-- 模型类功能block -->
      <div class="funcs">
        <ifreme>
          <div slot="func_icon">
            <img class="icon_img" src="../assets/img/modularDevelop.png">
          </div>
          <a-icon ></a-icon>
          <div slot="header" class="func_name">AI模型模块化开发</div>
          <div slot="des_func" class="func_des">基于模块化的思想，为给定任务功能进行组件式构建、自动化训练并保存模型，并可视化显示模型的各项性能指标</div>
        </ifreme>
        <ifreme>
          <div slot="func_icon">
            <img class="icon_img" src="">
          </div>
          <div slot="header" class="func_name">形式化验证</div>
          <div slot="des_func" class="func_des">【描述占位】占位占位占位占位占位占位占位占位占位占位占位占位占位占位占位占位</div>
        </ifreme>
        <ifreme>
          <div slot="func_icon">
            <img class="icon_img" src="../assets/img/modelEvaIcon.png">
          </div>
          <a-icon ></a-icon>
          <div slot="header" class="func_name">模型公平性评估</div>
          <div slot="des_func" class="func_des">【描述占位】占位占位占位占位占位占位占位占位占位占位占位占位占位占位占位占位</div>
        </ifreme>
        <ifreme>
          <div slot="func_icon">
            <img class="icon_img" src="">
          </div>
          <div slot="header" class="func_name">模型对抗性测试</div>
          <div slot="des_func" class="func_des">【描述占位】占位占位占位占位占位占位占位占位占位占位占位占位占位占位占位占位</div>
        </ifreme>
        <ifreme>
          <div slot="func_icon">
            <img class="icon_img" src="../assets/img/modelMeasure.png">
          </div>
          <a-icon ></a-icon>
          <div slot="header" class="func_name">AI模型安全度量</div>
          <div slot="des_func" class="func_des">分析AI系统常见异常数据来源及类型，基于置信学习等多种技术修复异常数据，实现自动化的数据集清洗及量化评估，生成异常检测效果分析报告及清洁的数据集</div>
        </ifreme>
        <ifreme>
          <div slot="func_icon">
            <img class="icon_img" src="">
          </div>
          <div slot="header" class="func_name">后门攻击评估</div>
          <div slot="des_func" class="func_des">【描述占位】占位占位占位占位占位占位占位占位占位占位占位占位占位占位占位占位</div>
        </ifreme>
        <ifreme>
          <div slot="func_icon">
            <img class="icon_img" src="">
          </div>
          <a-icon ></a-icon>
          <div slot="header" class="func_name">对抗攻击评估</div>
          <div slot="des_func" class="func_des">【描述占位】占位占位占位占位占位占位占位占位占位占位占位占位占位占位占位占位</div>
        </ifreme>
      </div>

      <p class="block_subtitle">加固</p>
      <div class="funcs">
        <ifreme>
          <div slot="func_icon">
            <img class="icon_img" src="">
          </div>
          <a-icon ></a-icon>
          <div slot="header" class="func_name">模型公平性提升</div>
          <div slot="des_func" class="func_des">【描述占位】占位占位占位占位占位占位占位占位占位占位占位占位占位占位占位占位</div>
        </ifreme>
        <ifreme>
          <div slot="func_icon">
            <img class="icon_img" src="">
          </div>
          <div slot="header" class="func_name">模型鲁棒性训练</div>
          <div slot="des_func" class="func_des">【描述占位】占位占位占位占位占位占位占位占位占位占位占位占位占位占位占位占位</div>
        </ifreme>
        <ifreme>
          <div slot="func_icon">
            <img class="icon_img" src="">
          </div>
          <a-icon ></a-icon>
          <div slot="header" class="func_name">后门攻击防御</div>
          <div slot="des_func" class="func_des">【描述占位】占位占位占位占位占位占位占位占位占位占位占位占位占位占位占位占位</div>
        </ifreme>
        <ifreme>
          <div slot="func_icon">
            <img class="icon_img" src="">
          </div>
          <div slot="header" class="func_name">对抗攻击防御</div>
          <div slot="des_func" class="func_des">【描述占位】占位占位占位占位占位占位占位占位占位占位占位占位占位占位占位占位</div>
        </ifreme>
        <ifreme>
          <div slot="func_icon">
            <img class="icon_img" src="">
          </div>
          <a-icon ></a-icon>
          <div slot="header" class="func_name">模型群智化防御</div>
          <div slot="des_func" class="func_des">【描述占位】占位占位占位占位占位占位占位占位占位占位占位占位占位占位占位占位</div>
        </ifreme>
      </div>
    </div>
    <div class="block" ref="block2">
      <p class="block_title">算法</p>
      <!-- 算法类功能block -->
      <div class="funcs">
        <ifreme>
          <div slot="func_icon">
            <img class="icon_img" src="../assets/img/coverageneuralIcon.png">
          </div>
          <a-icon ></a-icon>
          <div slot="header" class="func_name">标准化单元测试</div>
          <div slot="des_func" class="func_des">分析AI系统常见异常数据来源及类型，基于置信学习等多种技术修复异常数据，实现自动化的数据集清洗及量化评估，生成异常检测效果分析报告及清洁的数据集</div>
        </ifreme>
        <ifreme>
          <div slot="func_icon">
            <img class="icon_img" src="">
          </div>
          <div slot="header" class="func_name">攻击机理分析</div>
          <div slot="des_func" class="func_des">【描述占位】占位占位占位占位占位占位占位占位占位占位占位占位占位占位占位占位</div>
        </ifreme>
      </div>
    </div>
    <div class="block" ref="block3">
      <p class="block_title">开发框架</p>
      <!-- 开发框架类功能block -->
      <div class="funcs">
        <!-- AI开发框架安全结构度量 -->
        <ifreme>
          <div slot="func_icon">
            <!-- 图片 -->
            <img class="icon_img" src="../assets/img/frameworkTestIcon.png">
          </div>
          <a-icon ></a-icon>
          <!-- 功能名 -->
          <div slot="header" class="func_name">AI开发框架安全结构度量</div>
          <!-- 功能描述 -->
          <div slot="des_func" class="func_des">检测存在安全漏洞的的开发框架，进一步检测分析，定位开发框架漏洞在模型中的具体层</div>
        </ifreme>
      </div>
    </div>
    <div class="block" ref="block4">
      <p class="block_title">操作系统</p>
      <!-- 开发框架类功能block -->
      <div class="funcs">
        <!-- AI开发框架安全结构度量 -->
        <ifreme>
          <div slot="func_icon">
            <!-- 图片 -->
            <img class="icon_img" src="../assets/img/envTestIcon.png">
          </div>
          <a-icon ></a-icon>
          <!-- 功能名 -->
          <div slot="header" class="func_name">系统环境分析与框架适配</div>
          <!-- 功能描述 -->
          <div slot="des_func" class="func_des">采集目标模型在目标平台上运行产生的功耗/电磁信息，形成曲线数据。输入功耗或电磁曲线数据文件，分别进行不同的侧信道攻击分析</div>
        </ifreme>
      </div>
    </div>

    <div class="block" ref="block5">
      <p class="block_title">硬件</p>
      <!-- 硬件类功能block -->
      <div class="funcs">
        <!-- 侧信道分析 -->
        <ifreme>
          <div slot="func_icon">
            <!-- 图片：待替换 -->
            <img class="icon_img" src="../assets/img/slidechannelAnalysisIcon.png"> 
          </div>
          <a-icon ></a-icon>
          <!-- 功能名 -->
          <div slot="header" class="func_name">侧信道分析</div>
          <!-- 功能描述 -->
          <div slot="des_func" class="func_des">采集目标模型在目标平台上运行产生的功耗/电磁信息，形成曲线数据。输入功耗或电磁曲线数据文件，分别进行不同的侧信道攻击分析</div>
        </ifreme>
        <!-- 故障注入 -->
        <ifreme>
          <div slot="func_icon">
            <!-- 图片：待替换 -->
            <img class="icon_img" src="../assets/img/FaultInjectIcon.png">
          </div>
          <!-- 功能名 -->
          <div slot="header" class="func_name">故障注入</div>
          <!-- 功能描述 -->
          <div slot="des_func" class="func_des">利用高精度、变强度时钟毛刺故障对多种深度学习模型进行攻击，高精度故障注入评估过程使用可视化方式，展示故障攻击对深度学习模型输出的影响</div>
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
      this.$router.push(path);
      
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

.funcs {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  align-content: flex-start;
  gap: 10px;
  margin: 10px;
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


</style>