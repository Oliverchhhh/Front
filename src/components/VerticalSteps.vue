<template>
  <div class="vertical-steps">
    <div class="steps-container">
      <!-- 主步骤循环 -->
      <div v-for="(mainStep, mainIndex) in mainSteps" :key="mainIndex" class="main-step">
        <!-- 主步骤标题和图标 -->
        <div class="main-step-header" 
             :class="{ 
               'active': currentMainStep === mainIndex, 
               'completed': currentMainStep > mainIndex 
             }"
             @click="goToMainStep(mainIndex)">
          <div class="step-number">{{ mainIndex + 1 }}</div>
          <div class="step-title">{{ mainStep.title }}</div>
        </div>
        
        <!-- 子步骤容器 -->
        <div class="sub-steps">
          <div v-for="(subStep, subIndex) in mainStep.subSteps" :key="subIndex" 
               class="sub-step"
               :class="{
                 'active': currentMainStep === mainIndex && currentSubStep === subIndex,
                 'completed': currentMainStep > mainIndex || (currentMainStep === mainIndex && currentSubStep > subIndex)
               }"
               @click="goToSubStep(mainIndex, subIndex, subStep.path)">
            <div class="sub-step-content">
              <div class="sub-step-dot"></div>
              <div class="sub-step-title">{{ subStep.title }}</div>
            </div>
            <div class="sub-step-line" v-if="subIndex < mainStep.subSteps.length - 1"></div>
          </div>
        </div>
        
        <!-- 连接线 -->
        <div class="main-step-line" v-if="mainIndex < mainSteps.length - 1"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VerticalSteps',
  props: {
    currentMainStep: {
      type: Number,
      default: 0
    },
    currentSubStep: {
      type: Number,
      default: 0
    },
    mainSteps: {
      type: Array,
      default: () => [
        {
          title: '准备阶段',
          subSteps: [
            { title: '数据公平性提升', path: '/dataFairnessDebias' },
            { title: '对抗攻击评估', path: '/advAttack' },
            { title: '测试样本自动生成', path: '/concolic' }
          ]
        },
        {
          title: '训练阶段',
          subSteps: [
            { title: '模型公平性提升', path: '/modelFairnessDebias' },
            { title: '模型鲁棒性训练', path: '/robust_advTraining' },
            { title: '异常数据检测', path: '/dataClean' }
          ]
        },
        {
          title: '部署阶段',
          subSteps: [
            { title: '数据公平性评估', path: '/dataFairnessEva' },
            { title: '对抗攻击防御', path: '/advAttackDefense' },
            { title: '后门攻击防御', path: '/backdoorDefense' }
          ]
        }
      ]
    }
  },
  methods: {
    goToMainStep(index) {
      this.$emit('update:currentMainStep', index);
      this.$emit('update:currentSubStep', 0);
    },
    goToSubStep(mainIndex, subIndex, path) {
      this.$emit('update:currentMainStep', mainIndex);
      this.$emit('update:currentSubStep', subIndex);
      if (path) {
        this.$router.push(path);
      }
    }
  }
}
</script>

<style scoped>
.vertical-steps {
  padding: 20px;
  font-family: 'HONOR Sans CN';
}

.steps-container {
  position: relative;
  padding: 0 20px;
}

.main-step {
  position: relative;
  margin-bottom: 40px;
}

.main-step-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #E0E0E0;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 12px;
  transition: all 0.3s ease;
}

.step-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.main-step-header.active .step-number,
.main-step-header.completed .step-number {
  background-color: #0B55F4;
  color: white;
}

.main-step-header.active .step-title,
.main-step-header.completed .step-title {
  color: #0B55F4;
}

.sub-steps {
  margin-left: 48px;
  position: relative;
}

.sub-step {
  position: relative;
  padding-bottom: 20px;
  cursor: pointer;
}

.sub-step-content {
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.sub-step-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #E0E0E0;
  margin-right: 12px;
  transition: all 0.3s ease;
}

.sub-step-title {
  font-size: 16px;
  color: #666;
  transition: all 0.3s ease;
}

.sub-step.active .sub-step-dot,
.sub-step.completed .sub-step-dot {
  background-color: #52C41A;
}

.sub-step.active .sub-step-title,
.sub-step.completed .sub-step-title {
  color: #52C41A;
  font-weight: 500;
}

.sub-step-line {
  position: absolute;
  left: 5px;
  top: 16px;
  width: 2px;
  height: 24px;
  background-color: #E0E0E0;
}

.sub-step.completed .sub-step-line {
  background-color: #52C41A;
}

.main-step-line {
  position: absolute;
  left: 17px;
  top: 36px;
  width: 2px;
  height: calc(100% - 16px);
  background-color: #E0E0E0;
}

.main-step:last-child {
  margin-bottom: 0;
}

.main-step:last-child .main-step-line {
  display: none;
}

/* 添加悬停效果 */
.main-step-header:hover .step-number,
.sub-step:hover .sub-step-dot {
  transform: scale(1.1);
}

.main-step-header:hover .step-title,
.sub-step:hover .sub-step-title {
  color: #0B55F4;
}
</style> 