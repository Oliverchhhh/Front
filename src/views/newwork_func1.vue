<template>
  <div>
    <a-layout>
      <a-layout-header>
        <navmodule />
      </a-layout-header>
      <a-layout-content class="func1-content">
        <div class="main-container">
          <div class="paramCon">
            <div class="func1-title">功能1：异常训练数据检测与安全性评估</div>
            <div class="func1-intro-container">
              <div class="func1-intro-header">功能介绍</div>
              <div class="func1-intro-content">
                快速梯度符号法(Fast Gradient Sign Method)是一种简单有效的对抗攻击方法，通过在输入数据的方向上添加扰动来生成对抗样本。
              </div>
            </div>
            <div class="func1-section">
              <div class="func1-label">选择数据集</div>
              <div class="func1-controls">
                <a-select v-model="selectedDataset" class="func1-select" style="width: 220px !important; height: 56px !important; font-size: 1.6rem !important;">
                <a-select-option v-for="item in datasetList" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
              </a-select>
              <a-upload
                v-if="selectedDataset === 'custom'"
                :showUploadList="false"
                :before-upload="() => false"
                @change="handleFileChange"
                class="func1-upload"
              >
                  <a-button type="primary" style="width: 220px !important; height: 60px !important; line-height: 60px !important; font-size: 1.6rem !important;">选择文件</a-button>
              </a-upload>
              <span v-if="selectedDataset === 'custom' && customDatasetFile" class="file-name-display">{{ customDatasetFile.name }}</span>
              </div>
            </div>
            <div class="func1-section">
              <div class="func1-indicators-header">
                <div class="func1-label">选择安全性指标（勾选、多选）</div>
                <a-checkbox 
                  v-model="allChecked" 
                  @change="onCheckAll" 
                  class="func1-all-check"
                >全选</a-checkbox>
              </div>
              <div class="func1-indicators-container">
                <div v-for="(item, idx) in indicatorList" :key="item.value" class="func1-indicator-item">
                  <a-checkbox v-model="item.checked" @change="updateAllChecked">{{ item.label }}</a-checkbox>
                  <div class="func1-indicator-desc">{{ item.description || '该指标用于评估数据集的安全性能，包括完整性、一致性等方面的检测。' }}</div>
                </div>
              </div>
            </div>
            <div class="func1-action-row">
              <a-button type="primary" class="func1-action-btn" :loading="loading" @click="executeEvaluation">
                {{ loading ? '执行中...' : '执行' }}
              </a-button>
            </div>
          </div>
        </div>
        
        <!-- 结果展示区域 -->
        <a-modal
          v-model="showResults"
          title=""
          width="1200px"
          :footer="null"
          class="results-modal"
          @cancel="showResults = false"
        >
          <div v-if="results" class="results-container">
            <div class="results-header">
              <h2>异常训练数据检测与安全性评估结果</h2>
              <div class="dataset-name">
                <span class="label">数据集:</span>
                <span class="value">{{ results.dataset }}</span>
              </div>
            </div>
            
            <div class="results-details">
              <div v-for="(metric, idx) in results.metrics" :key="idx" class="metric-detail-card">
              <div class="metric-image">
                  <img 
                    v-for="(image, img_idx) in results.result[metric].images" :key="img_idx"
                    :src="`data:image/png;base64,${image.image_base64}`" 
                    alt="指标图" 
                    @click="showLargeImage(image.image_base64)"
                  />
                </div>
                <div class="metric-content">
                  <h3 class="metric-name">{{ metric }}</h3>
                  <span class="metric-score" :class="getScoreClass(results.result[metric].score)">
                    {{ formatScore(results.result[metric].score) }}
                  </span>
                </div>
              </div>
            </div>
            <div ref="radarChart" class="radar-chart" v-if="results && results.metrics && results.metrics.length >= 3"></div>
          </div>
          <div v-else class="no-result">暂无结果数据</div>
        </a-modal>
        
        <!-- 图片放大查看 -->
        <a-modal
          v-model="showLargeImageModal"
          :footer="null"
          width="90%"
          class="large-image-modal"
        >
          <img v-if="currentLargeImage" :src="`data:image/png;base64,${currentLargeImage}`" alt="放大图" class="large-image" />
        </a-modal>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
import navmodule from '../components/nav_homme.vue';
import * as echarts from 'echarts';
export default {
  name: 'newwork_func1',
  components: { navmodule },
  data() {
    return {
      selectedDataset: 'cifar100',
      datasetList: [
        { value: 'cifar100', label: 'CIFAR-100' },
        { value: 'celeba', label: 'CelebA' },
        { value: 'coco', label: 'Coco' },
        { value: 'custom', label: '自定义' },
      ],
      allChecked: false,
      indicatorList: [
        { 
          value: 'ind1', 
          label: '数据完整性检测', 
          checked: false,
          description: '检测数据集是否存在缺失值、异常值或不完整记录，确保训练数据的完整性。'
        },
        { 
          value: 'ind2', 
          label: '数据一致性评估', 
          checked: false,
          description: '评估数据集内部的一致性，检查是否存在矛盾或冲突的数据记录。'
        },
        { 
          value: 'ind3', 
          label: '数据分布异常检测', 
          checked: false,
          description: '分析数据分布是否存在异常，识别可能被篡改或投毒的数据区域。'
        },
        { 
          value: 'ind4', 
          label: '标签噪声检测', 
          checked: false,
          description: '检测训练数据中可能存在的标签错误或噪声，提高模型训练质量。'
        },
        { 
          value: 'ind5', 
          label: '后门攻击脆弱性评估', 
          checked: false,
          description: '评估数据集对后门攻击的脆弱性，检测潜在的恶意样本。'
        },
      ],
      loading: false,
      showResults: false,
      results: null,
      radarChart: null,
      showLargeImageModal: false,
      currentLargeImage: null,
      customDatasetFile: null,
    };
  },
  watch: {
    showResults(val) {
      if (val) {
        this.$nextTick(() => {
          this.initRadarChart();
        });
      }
    }
  },
  methods: {
    onCheckAll(e) {
      const checked = e.target.checked;
      this.indicatorList.forEach(item => item.checked = checked);
    },
    updateAllChecked() {
      this.allChecked = this.indicatorList.every(item => item.checked);
    },
    handleFileChange(info) {
      this.customDatasetFile = info.file;
      this.$message.success(`已选择文件: ${info.file.name}`);
    },
    executeEvaluation() {
      // 验证是否选择了数据集和至少一个指标
      if (!this.selectedDataset) {
        this.$message.error('请选择数据集');
        return;
      }
      
      if (this.selectedDataset === 'custom' && !this.customDatasetFile) {
        this.$message.error('请选择一个自定义数据集文件');
        return;
      }
      
      if (!this.indicatorList.some(item => item.checked)) {
        this.$message.error('请至少选择一个安全性指标');
        return;
      }
      
      this.loading = true;
      
      const selectedIndicators = this.indicatorList
        .filter(item => item.checked)
        .map(item => item.label);
      
      let requestData;
      const config = {};

      if (this.selectedDataset === 'custom') {
        requestData = new FormData();
        requestData.append('file', this.customDatasetFile, this.customDatasetFile.name);
        requestData.append('dataset', 'custom');
        requestData.append('indicators', JSON.stringify(selectedIndicators));
        
        config.headers = { 'Content-Type': 'multipart/form-data' };
        console.log('发送请求到 /func_1 (FormData):');

      } else {
        const selectedDatasetObj = this.datasetList.find(item => item.value === this.selectedDataset);
        const datasetName = selectedDatasetObj ? selectedDatasetObj.label : this.selectedDataset;
        requestData = {
        dataset: datasetName,
        indicators: selectedIndicators
      };
      console.log('发送请求到 /func_1:', requestData);
      }
      
      this.$axios.post('/func_1', requestData, config)
        .then(response => {
          // 处理成功响应
          console.log('请求成功:', response.data);
          this.results = response.data;
          this.showResults = true;
        })
        .catch(error => {
          // 处理错误
          console.error('请求失败:', error);
          this.$message.error('评估失败: ' + ((error.response && error.response.data && error.response.data.message) || (error.message) || '未知错误'));
        })
        .finally(() => {
          this.loading = false;
        });
    },
    formatScore(score) {
      return (score * 100).toFixed(0) + '%';
    },
    getScoreClass(score) {
      if (score >= 0.8) return 'score-high';
      if (score >= 0.6) return 'score-medium';
      return 'score-low';
    },
    showLargeImage(imageBase64) {
      this.currentLargeImage = imageBase64;
      this.showLargeImageModal = true;
    },
    initRadarChart() {
      if (!this.results || !this.results.metrics || this.results.metrics.length < 3) {
        return;
      }
      if (this.radarChart) {
        this.radarChart.dispose();
      }
      this.radarChart = echarts.init(this.$refs.radarChart);
      const indicators = this.results.metrics.map(metric => ({ name: metric, max: 1 }));
      const scores = this.results.metrics.map(metric => this.results.result[metric].score);

      const option = {
        title: {
          text: '安全性指标雷达图',
          left: 'center',
          textStyle: {
            color: '#19586b',
            fontSize: 20,
            fontWeight: 'bold',
          }
        },
        tooltip: {},
        legend: {
          show: false
        },
        radar: {
          indicator: indicators,
          radius: '60%',
          center: ['50%', '55%'],
          axisName: {
            color: '#000',
            fontWeight: 'bold',
            fontSize: 14,
          }
        },
        series: [{
          name: '安全性评分',
          type: 'radar',
          data: [{
            value: scores,
            name: '安全性评分',
            areaStyle: {
              color: 'rgba(84, 112, 198, 0.4)'
            }
          }]
        }]
      };
      this.radarChart.setOption(option);
      window.addEventListener('resize', () => {
        if (this.radarChart) {
          this.radarChart.resize();
        }
      });
    },
  },
  beforeDestroy() {
    if (this.radarChart) {
      this.radarChart.dispose();
      this.radarChart = null;
    }
     window.removeEventListener('resize', this.radarChart && this.radarChart.resize);
  }
};
</script>

<style scoped>
.func1-content {
  background: #fff;
  min-height: 100vh;
  padding: 64px 0 100px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.main-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 48px;
  margin-bottom: 48px;
}
.paramCon {
  width: 100%;
  max-width: 1400px;
  min-width: 900px;
  background: #fff;
  border: 2px solid #e0e3eb;
  box-shadow: 0 12px 36px rgba(44, 51, 67, 0.10);
  border-radius: 32px;
  padding: 72px 80px 56px 80px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.func1-title {
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  width: 100%;
  margin-bottom: 48px;
}
.func1-intro-container {
  width: 85%;
  min-width: 500px;
  max-width: 1000px;
  margin: 0 auto 48px auto;
  display: flex;
  flex-direction: column;
}
.func1-intro-header {
  font-size: 1.7rem;
  font-weight: 600;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 15px;
}
.func1-intro-content {
  padding: 0 0 15px 0;
  color: #333;
  font-size: 1.4rem;
  line-height: 1.6;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}
.func1-section {
  margin-bottom: 40px;
  width: 100%;
  text-align: left;
}
.func1-label {
  font-size: 1.7rem;
  font-weight: 600;
  margin-right: 36px;
  min-width: 220px;
  margin-bottom: 10px;
}
.func1-controls {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}
.file-name-display {
  margin-left: 16px;
  font-size: 1.4rem;
  color: #555;
  font-style: italic;
}
.func1-select {
  margin-right: 24px;
  font-size: 1.6rem !important;
  height: 40px !important;
  width: 220px !important;
  box-sizing: border-box !important;
}
.func1-select :deep(.ant-select-selector) {
  height: 40px !important;
  display: flex;
  align-items: center;
  border-radius: 4px !important;
  box-sizing: border-box !important;
  width: 100% !important;
  font-size: 1.6rem !important;
}
.func1-select :deep(.ant-select-selection-selected-value) {
  font-size: 1.6rem !important;
  display: flex;
  align-items: center;
}
.func1-or {
  margin: 0 24px;
  font-size: 1.4rem;
  color: #234;
}
.func1-upload {
  margin-right: 24px;
  box-sizing: border-box !important;
}
.func1-upload :deep(.ant-btn) {
  height: 60px !important;
  width: 220px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem !important;
  border-radius: 4px;
  box-sizing: border-box !important;
  padding: 0 !important; /* 移除内边距 */
}

/* 新的指标选择样式 */
.func1-indicators-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}
.func1-all-check {
  font-size: 1.4rem;
  margin-left: auto;
}
.func1-indicators-container {
  width: 100%;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
}
.func1-indicator-item {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}
.func1-indicator-item:last-child {
  border-bottom: none;
}
.func1-indicator-item:hover {
  background-color: #f9f9f9;
}
.func1-indicator-item .ant-checkbox-wrapper {
  display: flex;
  align-items: center;
  width: 250px;
  font-size: 1.5rem;
  font-weight: 500;
}
.func1-indicator-item .ant-checkbox {
  margin-right: 30px;
  top: 0;
}
.func1-indicator-item .ant-checkbox + span {
  padding-left: 0;
  padding-right: 0;
}
.func1-indicator-desc {
  flex: 1;
  color: #666;
  font-size: 1.3rem;
  line-height: 1.5;
  padding-left: 40px;
  border-left: 1px solid #f0f0f0;
  text-align: left;
}

.func1-action-row {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 36px;
}
.func1-action-btn {
  background: #19586b;
  color: #fff;
  font-size: 1.7rem;
  border-radius: 10px;
  min-width: 180px;
  height: 60px;
}
/**** 放大checkbox字体 ****/
.ant-checkbox-wrapper,
.ant-checkbox + span {
  font-size: 1.4rem !important;
}

/* 新增结果展示样式 */
.results-modal :deep(.ant-modal-content) {
  border-radius: 16px;
  overflow: hidden;
}

.results-modal :deep(.ant-modal-header) {
  background: #19586b;
  padding: 16px 24px;
  border-bottom: none;
}

.results-modal :deep(.ant-modal-title) {
  color: white;
  font-size: 20px;
  font-weight: 600;
}

.results-modal :deep(.ant-modal-close) {
  color: white;
}

.results-container {
  padding: 0 16px;
}

.results-header {
  text-align: center;
  margin-bottom: 30px;
}

.results-header h2 {
  font-size: 24px;
  color: #19586b;
  margin-bottom: 16px;
}

.dataset-name {
  font-size: 18px;
  margin: 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dataset-name .label {
  font-weight: bold;
  margin-right: 10px;
}

.dataset-name .value {
  color: #19586b;
  font-weight: 500;
}

.results-details {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 24px;
}

.metric-detail-card {
  width: calc(50% - 12px);
  margin-bottom: 0;
  border: 1px solid #e8e8e8;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
}

.metric-detail-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.metric-image {
  padding: 0;
  text-align: center;
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
  height: auto;
  display: flex;
  justify-content: space-around;
}

.metric-image img {
  width: auto;
  height: 250px;
  object-fit: contain;
  cursor: pointer;
  transition: opacity 0.2s;
  border: none;
  border-radius: 0;
  max-width: 33%;
}

.metric-image img:hover {
  transform: none;
  opacity: 0.9;
}

.metric-content {
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 0;
}

.metric-score {
  font-size: 20px;
  font-weight: bold;
  padding: 4px 12px;
  border-radius: 8px;
  color: white;
}

.score-high {
  background-color: #4CAF50;
}

.score-medium {
  background-color: #FF9800;
}

.score-low {
  background-color: #F44336;
}

.large-image-modal {
  text-align: center;
}

.large-image {
  max-width: 100%;
  max-height: 80vh;
}

.no-result {
  text-align: center;
  padding: 50px;
  color: #999;
  font-size: 18px;
  background: #f9f9f9;
  border-radius: 8px;
}

@media (max-width: 1200px) {
  .metric-detail-card {
    width: 100%;
  }
}
.radar-chart {
  width: 100%;
  height: 400px;
  margin-top: 30px;
}
</style> 