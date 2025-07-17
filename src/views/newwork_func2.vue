<template>
  <div>
    <a-layout>
      <a-layout-header>
        <navmodule />
      </a-layout-header>
      <a-layout-content class="func2-content">
        <div class="main-container">
          <div class="paramCon">
            <div class="func2-title">功能2：对抗样本检测</div>
            <div class="func2-intro-container">
              <div class="func2-intro-header">功能介绍</div>
              <div class="func2-intro-content">
                对抗样本检测功能可以评估模型对各种对抗攻击的防御能力，通过分析检测结果来提高AI系统的安全性和鲁棒性。
              </div>
            </div>
            <div class="func2-section">
              <div class="func2-label">选择数据集</div>
              <div class="func2-controls">
                <a-select v-model="selectedDataset" class="func2-select" style="width: 220px !important; height: 56px !important; font-size: 1.6rem !important;">
                <a-select-option v-for="item in datasetList" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
              </a-select>
              <a-upload 
                v-if="selectedDataset === 'custom'" 
                :showUploadList="false"
                :before-upload="() => false"
                @change="handleDatasetFileChange"
                class="func2-upload"
              >
                  <a-button type="primary" style="width: 220px !important; height: 60px !important; line-height: 60px !important; font-size: 1.6rem !important;">上传数据集</a-button>
              </a-upload>
              <span v-if="selectedDataset === 'custom' && customDatasetFile" class="file-name-display">{{ customDatasetFile.name }}</span>
              </div>
            </div>
            <div class="func2-section">
              <div class="func2-label">选择模型</div>
              <div class="func2-controls">
                <a-select v-model="selectedModel" class="func2-select" style="width: 220px !important; height: 56px !important; font-size: 1.6rem !important;">
                <a-select-option v-for="item in modelList" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
              </a-select>
              <a-upload 
                v-if="selectedModel === 'custom'" 
                :showUploadList="false"
                :before-upload="() => false"
                @change="handleModelFileChange"
                class="func2-upload"
              >
                  <a-button type="primary" style="width: 220px !important; height: 60px !important; line-height: 60px !important; font-size: 1.6rem !important;">上传模型</a-button>
              </a-upload>
              <span v-if="selectedModel === 'custom' && customModelFile" class="file-name-display">{{ customModelFile.name }}</span>
              </div>
            </div>
            <div class="func2-section">
              <div class="func2-indicators-header">
                <div class="func2-label">选择对抗攻击方法</div>
                <a-checkbox 
                  v-model="allChecked" 
                  @change="onCheckAll" 
                  class="func2-all-check"
                >全选</a-checkbox>
              </div>
              <div class="func2-indicators-container">
                <div v-for="(item, idx) in methodList" :key="item.value" class="func2-indicator-item">
                  <a-checkbox v-model="item.checked" @change="updateAllChecked">{{ item.label }}</a-checkbox>
                  <div class="func2-indicator-desc">{{ item.description || '该攻击方法用于生成对抗样本，测试模型的鲁棒性和安全性。' }}</div>
                </div>
              </div>
            </div>
            <div class="func2-action-row">
              <a-button type="primary" class="func2-action-btn" :loading="loading" @click="executeDetection">
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
              <h2>对抗样本检测结果</h2>
              <div class="dataset-info">
                <span class="label">数据集:</span>
                <span class="value">{{ results.dataset }}</span>
                <span class="label" style="margin-left: 40px;">模型:</span>
                <span class="value">{{ results.model }}</span>
              </div>
            </div>
            
            <!-- 图表展示区域 -->
            <div class="chart-container">
              <div ref="tprChart" class="tpr-chart"></div>
              <div class="chart-legend">
                <div class="legend-item">
                  <div class="legend-color" style="background-color: #5470c6;"></div>
                  <div class="legend-text">TPR (FPR@0.05)</div>
                </div>
                <div class="legend-item">
                  <div class="legend-color" style="background-color: #91cc75;"></div>
                  <div class="legend-text">TPR (FPR@0.1)</div>
                </div>
              </div>

              <!-- 新增的 example 展示区域 -->
              <div v-if="results && results.example && results.example.length" class="example-container">
                <h3 class="example-title">对抗样本示例</h3>
                <div v-for="(item, index) in results.example" :key="index" class="example-card">
                  <div class="example-images">
                    <div class="example-image-item">
                      <img :src="`data:image/png;base64,${item.image1}`" alt="示例图片1" />
                      <span>原始图片</span>
                    </div>
                    <div class="example-image-item">
                      <img :src="`data:image/png;base64,${item.image2}`" alt="示例图片2" />
                      <span>扰动</span>
                    </div>
                    <div class="example-image-item">
                      <img :src="`data:image/png;base64,${item.image3}`" alt="示例图片3" />
                      <span>对抗样本</span>
                    </div>
                  </div>
                  <div class="example-texts">
                    <p>{{ item.text1 }}</p>
                    <p>{{ item.text2 }}</p>
                  </div>
                </div>
              </div>
              
              <div ref="radarChart" class="radar-chart"></div>
            </div>
            
          </div>
          <div v-else class="no-result">暂无结果数据</div>
        </a-modal>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
import navmodule from '../components/nav_homme.vue';
import * as echarts from 'echarts';

export default {
  name: 'newwork_func2',
  components: { navmodule },
  data() {
    return {
      selectedDataset: 'cifar100',
      selectedModel: 'vgg',
      customDatasetFile: null,
      customModelFile: null,
      datasetList: [
        { value: 'cifar100', label: 'CIFAR-100' },
        { value: 'celeba', label: 'CelebA' },
        { value: 'coco', label: 'Coco' },
        { value: 'custom', label: '自定义' },
      ],
      modelList: [
        { value: 'vgg', label: 'VGG' },
        { value: 'resnet', label: 'ResNet' },
        { value: 'custom', label: '自定义' },
      ],
      allChecked: false,
      methodList: [
        { 
          value: 'mth1', 
          label: 'FGSM攻击', 
          checked: false,
          description: '快速梯度符号法(Fast Gradient Sign Method)是一种简单有效的对抗攻击方法，通过在输入数据的方向上添加扰动来生成对抗样本。'
        },
        { 
          value: 'mth2', 
          label: 'PGD攻击', 
          checked: false,
          description: '投影梯度下降(Projected Gradient Descent)是一种迭代攻击方法，通过多步梯度更新和投影操作生成更强的对抗样本。'
        },
        { 
          value: 'mth3', 
          label: 'DeepFool攻击', 
          checked: false,
          description: 'DeepFool通过迭代找到最小扰动，使样本越过决策边界，生成高质量的对抗样本。'
        },
        { 
          value: 'mth4', 
          label: 'C&W攻击', 
          checked: false,
          description: 'Carlini & Wagner攻击是一种优化基础的攻击方法，通过求解优化问题生成低扰动的高质量对抗样本。'
        },
        { 
          value: 'mth5', 
          label: '黑盒攻击', 
          checked: false,
          description: '黑盒攻击不需要访问模型内部结构，只通过查询模型输出来生成对抗样本，适用于真实世界场景。'
        },
      ],
      loading: false,
      showResults: false,
      results: null,
      barChart: null,
      radarChart: null,
    };
  },
  watch: {
    showResults(val) {
      if (val) {
        this.$nextTick(() => {
          this.initCharts();
        });
      }
    }
  },
  methods: {
    onCheckAll(e) {
      const checked = e.target.checked;
      this.methodList.forEach(item => item.checked = checked);
    },
    updateAllChecked() {
      this.allChecked = this.methodList.every(item => item.checked);
    },
    handleDatasetFileChange(info) {
      this.customDatasetFile = info.file;
      this.$message.success(`已选择数据集文件: ${info.file.name}`);
    },
    handleModelFileChange(info) {
      this.customModelFile = info.file;
      this.$message.success(`已选择模型文件: ${info.file.name}`);
    },
    executeDetection() {
      // 验证是否选择了数据集、模型和至少一个方法
      if (!this.selectedDataset) {
        this.$message.error('请选择数据集');
        return;
      }
      
      if (this.selectedDataset === 'custom' && !this.customDatasetFile) {
        this.$message.error('请选择一个自定义数据集文件');
        return;
      }
      
      if (!this.selectedModel) {
        this.$message.error('请选择模型');
        return;
      }
      
      if (this.selectedModel === 'custom' && !this.customModelFile) {
        this.$message.error('请选择一个自定义模型文件');
        return;
      }
      
      if (!this.methodList.some(item => item.checked)) {
        this.$message.error('请至少选择一个对抗攻击方法');
        return;
      }
      
      // 显示加载状态
      this.loading = true;
      
      // 获取选中方法的实际名称
      const selectedMethods = this.methodList
        .filter(item => item.checked)
        .map(item => item.label);
      
      let requestData;
      const config = {};
      
      // 判断是否使用FormData（当有文件上传时）
      if (this.selectedDataset === 'custom' || this.selectedModel === 'custom') {
        requestData = new FormData();
        
        // 添加数据集文件或数据集名称
        if (this.selectedDataset === 'custom') {
          requestData.append('dataset_file', this.customDatasetFile, this.customDatasetFile.name);
          requestData.append('dataset', 'custom');
        } else {
          const selectedDatasetObj = this.datasetList.find(item => item.value === this.selectedDataset);
          const datasetName = selectedDatasetObj ? selectedDatasetObj.label : this.selectedDataset;
          requestData.append('dataset', datasetName);
        }
        
        // 添加模型文件或模型名称
        if (this.selectedModel === 'custom') {
          requestData.append('model_file', this.customModelFile, this.customModelFile.name);
          requestData.append('model', 'custom');
        } else {
          const selectedModelObj = this.modelList.find(item => item.value === this.selectedModel);
          const modelName = selectedModelObj ? selectedModelObj.label : this.selectedModel;
          requestData.append('model', modelName);
        }
        
        // 添加选择的方法
        requestData.append('methods', JSON.stringify(selectedMethods));
        
        config.headers = { 'Content-Type': 'multipart/form-data' };
        console.log('发送请求到 /func_2 (FormData):');
      } else {
        // 使用普通JSON请求
        const selectedDatasetObj = this.datasetList.find(item => item.value === this.selectedDataset);
        const selectedModelObj = this.modelList.find(item => item.value === this.selectedModel);
        
        requestData = {
          dataset: selectedDatasetObj ? selectedDatasetObj.label : this.selectedDataset,
          model: selectedModelObj ? selectedModelObj.label : this.selectedModel,
          methods: selectedMethods
        };
        
        console.log('发送请求到 /func_2:', requestData);
      }
      
      // 发送请求
      this.$axios.post('/func_2', requestData, config)
        .then(response => {
          // 处理成功响应
          console.log('请求成功:', response.data);
          this.results = response.data;
          this.showResults = true;
        })
        .catch(error => {
          // 处理错误
          console.error('请求失败:', error);
          this.$message.error('检测失败: ' + ((error.response && error.response.data && error.response.data.message) || (error.message) || '未知错误'));
          
          // 测试数据 - 仅用于开发
          this.mockResults();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    mockResults() {
      // 模拟后端返回的数据格式，仅用于开发测试
      this.results = {
        dataset: "CIFAR-100",
        model: "ResNet",
        attack_method: ["FGSM攻击", "PGD攻击", "DeepFool攻击"],
        result: {
          "FGSM攻击": { "fpr0.05": 0.78, "fpr0.1": 0.84 },
          "PGD攻击": { "fpr0.05": 0.65, "fpr0.1": 0.75 },
          "DeepFool攻击": { "fpr0.05": 0.82, "fpr0.1": 0.91 }
        },
        example: [
          {
            image1: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
            image2: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
            image3: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
            text1: "这是一个示例文本1",
            text2: "这是一个示例文本2"
          },
          {
            image1: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
            image2: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
            image3: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
            text1: "这是一个示例文本1",
            text2: "这是一个示例文本2"
          }
        ]
      };
      this.showResults = true;
    },
    initCharts() {
      this.initBarChart();
      this.initRadarChart();
    },
    initBarChart() {
      if (!this.results || !this.results.result) return;
      
      if (this.barChart) {
        this.barChart.dispose();
      }
      
      this.barChart = echarts.init(this.$refs.tprChart);
      
      const methods = Object.keys(this.results.result);
      const fpr005Data = methods.map(method => this.results.result[method]["fpr0.05"]);
      const fpr01Data = methods.map(method => this.results.result[method]["fpr0.1"]);
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(params) {
            const method = params[0].name;
            let html = `<div style="font-weight:bold;margin-bottom:5px;">${method}</div>`;
            params.forEach(param => {
              const color = param.color;
              const seriesName = param.seriesName;
              const value = (param.value * 100).toFixed(2) + '%';
              html += `<div style="display:flex;align-items:center;margin:3px 0;">
                        <div style="width:10px;height:10px;background:${color};margin-right:5px;"></div>
                        <div>${seriesName}: ${value}</div>
                      </div>`;
            });
            return html;
          }
        },
        legend: {
          show: false
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '8%',
          top: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: methods,
          axisLabel: {
            interval: 0,
            rotate: 0,
            fontSize: 13,
            color: '#333'
          }
        },
        yAxis: {
          type: 'value',
          name: 'TPR',
          nameTextStyle: {
            fontSize: 14,
            color: '#333'
          },
          min: 0,
          max: 1,
          interval: 0.2,
          axisLabel: {
            formatter: '{value}',
            fontSize: 12,
            color: '#333'
          }
        },
        series: [
          {
            name: 'TPR (FPR@0.05)',
            type: 'bar',
            data: fpr005Data,
            itemStyle: {
              color: '#5470c6'
            },
            barGap: '0%',
            barWidth: '18%',
            label: {
              show: true,
              position: 'top',
              formatter: function(params) {
                return (params.value * 100).toFixed(0) + '%';
              },
              fontSize: 12
            }
          },
          {
            name: 'TPR (FPR@0.1)',
            type: 'bar',
            data: fpr01Data,
            itemStyle: {
              color: '#91cc75'
            },
            barGap: '0%',
            barWidth: '18%',
            label: {
              show: true,
              position: 'top',
              formatter: function(params) {
                return (params.value * 100).toFixed(0) + '%';
              },
              fontSize: 12
            }
          }
        ]
      };
      
      this.barChart.setOption(option);
      
      window.addEventListener('resize', () => {
        if (this.barChart) {
          this.barChart.resize();
        }
      });
    },
    initRadarChart() {
      if (!this.results || !this.results.result || Object.keys(this.results.result).length < 3) {
        return;
      }
      
      if (this.radarChart) {
        this.radarChart.dispose();
      }
      this.radarChart = echarts.init(this.$refs.radarChart);
      
      const methods = Object.keys(this.results.result);
      const fpr005Data = methods.map(method => this.results.result[method]["fpr0.05"]);
      const fpr01Data = methods.map(method => this.results.result[method]["fpr0.1"]);
      const indicators = methods.map(method => ({ name: method, max: 1 }));
      
      const option = {
        title: {
          text: '对抗攻击方法检测雷达图',
          left: 'center',
          top: '5%',
          textStyle: {
            color: '#19586b',
            fontSize: 20,
            fontWeight: 'bold',
          }
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          data: ['TPR (FPR@0.05)', 'TPR (FPR@0.1)'],
          bottom: '5%',
          textStyle: {
            fontSize: 14
          }
        },
        radar: {
          indicator: indicators,
          radius: '60%',
          center: ['50%', '55%'],
          splitArea: {
            areaStyle: {
              color: ['rgba(250,250,250,0.3)', 'rgba(230,230,230,0.3)'],
            }
          },
          axisName: {
            color: '#000',
            fontWeight: 'bold',
            fontSize: 14,
          }
        },
        series: [
          {
            name: '对抗攻击检测结果',
            type: 'radar',
            data: [
              {
                value: fpr005Data,
                name: 'TPR (FPR@0.05)',
                areaStyle: {
                  color: 'rgba(84, 112, 198, 0.4)'
                }
              },
              {
                value: fpr01Data,
                name: 'TPR (FPR@0.1)',
                areaStyle: {
                  color: 'rgba(145, 204, 117, 0.4)'
                }
              }
            ]
          }
        ]
      };
      
      this.radarChart.setOption(option);
      
      window.addEventListener('resize', () => {
        if (this.radarChart) {
          this.radarChart.resize();
        }
      });
    },
    getDatasetLabel(value) {
      const dataset = this.datasetList.find(item => item.value === value);
      return dataset ? dataset.label : value;
    },
    getModelLabel(value) {
      const model = this.modelList.find(item => item.value === value);
      return model ? model.label : value;
    },
    getMethodLabel(value) {
      const method = this.methodList.find(item => item.value === value);
      return method ? method.label : value;
    },
    formatPercentage(value) {
      return (value * 100).toFixed(2) + '%';
    },
    getTprClass(value) {
      if (value >= 0.8) return 'tpr-high';
      if (value >= 0.5) return 'tpr-medium';
      return 'tpr-low';
    }
  },
  beforeDestroy() {
    // 清理图表实例
    if (this.barChart) {
      this.barChart.dispose();
      this.barChart = null;
    }
    if (this.radarChart) {
      this.radarChart.dispose();
      this.radarChart = null;
    }
    
    // 移除事件监听器
    window.removeEventListener('resize', this.barChart && this.barChart.resize);
    window.removeEventListener('resize', this.radarChart && this.radarChart.resize);
  }
};
</script>

<style scoped>
.func2-content {
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
.func2-title {
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  width: 100%;
  margin-bottom: 48px;
}
.func2-intro-container {
  width: 85%;
  min-width: 500px;
  max-width: 1000px;
  margin: 0 auto 48px auto;
  display: flex;
  flex-direction: column;
}
.func2-intro-header {
  font-size: 1.7rem;
  font-weight: 600;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 15px;
}
.func2-intro-content {
  padding: 0 0 15px 0;
  color: #333;
  font-size: 1.4rem;
  line-height: 1.6;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}
.func2-section {
  margin-bottom: 40px;
  width: 100%;
  text-align: left;
}
.func2-label {
  font-size: 1.7rem;
  font-weight: 600;
  margin-right: 36px;
  min-width: 220px;
  margin-bottom: 10px;
}
.func2-controls {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}
.func2-select {
  margin-right: 24px;
  font-size: 1.6rem !important;
  height: 40px !important;
  width: 220px !important;
  box-sizing: border-box !important;
}
.func2-select :deep(.ant-select-selector) {
  height: 40px !important;
  display: flex;
  align-items: center;
  border-radius: 4px !important;
  box-sizing: border-box !important;
  width: 100% !important;
  font-size: 1.6rem !important;
}
.func2-select :deep(.ant-select-selection-selected-value) {
  font-size: 1.6rem !important;
  display: flex;
  align-items: center;
}
.func2-or {
  margin: 0 24px;
  font-size: 1.4rem;
  color: #234;
}
.func2-upload {
  margin-right: 24px;
  box-sizing: border-box !important;
}
.func2-upload :deep(.ant-btn) {
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
.func2-indicators-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}
.func2-all-check {
  font-size: 1.4rem;
  margin-left: auto;
}
.func2-indicators-container {
  width: 100%;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
}
.func2-indicator-item {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}
.func2-indicator-item:last-child {
  border-bottom: none;
}
.func2-indicator-item:hover {
  background-color: #f9f9f9;
}
.func2-indicator-item .ant-checkbox-wrapper {
  display: flex;
  align-items: center;
  width: 250px;
  font-size: 1.5rem;
  font-weight: 500;
}
.func2-indicator-item .ant-checkbox {
  margin-right: 30px;
  top: 0;
}
.func2-indicator-item .ant-checkbox + span {
  padding-left: 0;
  padding-right: 0;
}
.func2-indicator-desc {
  flex: 1;
  color: #666;
  font-size: 1.3rem;
  line-height: 1.5;
  padding-left: 40px;
  border-left: 1px solid #f0f0f0;
  text-align: left;
}

.func2-action-row {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 36px;
}
.func2-action-btn {
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

.dataset-info {
  font-size: 18px;
  margin: 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.label {
  font-weight: bold;
  margin-right: 10px;
}

.value {
  color: #19586b;
  font-weight: 500;
}

/* 图表容器样式 */
.chart-container {
  width: 100%;
  margin: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tpr-chart {
  width: 100%;
  height: 400px;
  margin-bottom: 20px;
}

.radar-chart {
  width: 100%;
  height: 400px;
  margin-bottom: 20px;
}

.chart-legend {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin: 0 15px;
}

.legend-color {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  border-radius: 3px;
}

.legend-text {
  font-size: 14px;
  color: #666;
  font-weight: bold;
}

.no-result {
  text-align: center;
  padding: 50px;
  color: #999;
  font-size: 18px;
  background: #f9f9f9;
  border-radius: 8px;
}

.file-name-display {
  margin-left: 16px;
  font-size: 1.4rem;
  color: #555;
  font-style: italic;
}

/* 新增对抗样本示例样式 */
.example-container {
  width: 100%;
  margin-top: 30px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.example-title {
  font-size: 20px;
  color: #19586b;
  margin-bottom: 20px;
  text-align: center;
}

.example-card {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.example-images {
  display: flex;
  align-items: center;
  margin-right: 20px;
  flex-shrink: 0;
}

.example-image-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 15px;
}

.example-image-item img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 8px;
}

.example-image-item span {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.example-texts {
  flex: 1;
}

.example-texts p {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  margin-bottom: 5px;
}

@media (max-width: 1200px) {
  .tpr-chart {
    height: 300px;
  }
  .radar-chart {
    height: 300px;
  }
}
</style> 