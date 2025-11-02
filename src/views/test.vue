<template>
  <div class="test-container">
    <h1 class="page-title">进度条组件演示</h1>
    
    <div class="progress-container">
      <vertical-steps
        v-model:currentMainStep="currentMainStep"
        v-model:currentSubStep="currentSubStep"
      />
    </div>
    
    <div class="controls">
      <div class="current-step-info">
        <p>当前主步骤: {{ currentMainStep + 1 }}</p>
        <p>当前子步骤: {{ currentSubStep + 1 }}</p>
      </div>
      
      <div class="navigation-buttons">
        <a-button 
          type="primary" 
          @click="prevStep" 
          :disabled="isFirstStep"
          class="nav-button"
        >
          上一步
        </a-button>
        <a-button 
          type="primary" 
          @click="nextStep" 
          :disabled="isLastStep"
          class="nav-button"
        >
          下一步
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import VerticalSteps from '@/components/VerticalSteps.vue'

export default {
  name: 'TestView',
  components: {
    VerticalSteps
  },
  data() {
    return {
      currentMainStep: 0,
      currentSubStep: 0
    }
  },
  computed: {
    isFirstStep() {
      return this.currentMainStep === 0 && this.currentSubStep === 0
    },
    isLastStep() {
      return this.currentMainStep === 2 && this.currentSubStep === 2
    }
  },
  methods: {
    nextStep() {
      if (this.currentSubStep < 2) {
        this.currentSubStep++
      } else if (this.currentMainStep < 2) {
        this.currentMainStep++
        this.currentSubStep = 0
      }
    },
    prevStep() {
      if (this.currentSubStep > 0) {
        this.currentSubStep--
      } else if (this.currentMainStep > 0) {
        this.currentMainStep--
        this.currentSubStep = 2
      }
    }
  }
}
</script>

<style scoped>
.test-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'HONOR Sans CN';
}

.page-title {
  text-align: center;
  color: #0B55F4;
  font-size: 32px;
  margin-bottom: 40px;
}

.progress-container {
  background-color: #F5F8FF;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #F5F8FF;
  border-radius: 12px;
  padding: 20px 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.current-step-info {
  font-size: 18px;
  color: #333;
}

.current-step-info p {
  margin: 5px 0;
}

.navigation-buttons {
  display: flex;
  gap: 20px;
}

.nav-button {
  height: 40px;
  font-size: 16px;
  border-radius: 8px;
  background-color: #0B55F4;
  border-color: #0B55F4;
}

.nav-button:hover {
  background-color: #0A4CD9;
  border-color: #0A4CD9;
}

.nav-button:disabled {
  background-color: #D9D9D9;
  border-color: #D9D9D9;
  color: rgba(0, 0, 0, 0.25);
}
</style>
