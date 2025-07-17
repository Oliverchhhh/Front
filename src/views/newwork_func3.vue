<template>
  <div>
    <a-layout>
      <a-layout-header>
        <navmodule />
      </a-layout-header>
      <a-layout-content class="func3-content">
        <div class="main-container">
          <div class="paramCon">
            <div class="func3-title">功能3：主动防御算法</div>
            <div class="func3-intro-container">
              <div class="func3-intro-header">功能介绍</div>
              <div class="func3-intro-content">
                主动防御算法功能可以评估和增强模型对抗攻击的防御能力，通过多种防御策略提高AI系统的安全性和鲁棒性。
              </div>
            </div>
            <div class="func3-section">
              <div class="func3-label">选择数据集</div>
              <div class="func3-controls">
                <a-select v-model="selectedDataset" class="func3-select" style="width: 220px !important; height: 56px !important; font-size: 1.6rem !important;">
                  <a-select-option v-for="item in datasetList" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
                </a-select>
                <a-upload 
                  v-if="selectedDataset === 'custom'" 
                  :showUploadList="false"
                  :before-upload="() => false"
                  @change="handleDatasetFileChange"
                  class="func3-upload"
                >
                  <a-button type="primary" style="width: 220px !important; height: 60px !important; line-height: 60px !important; font-size: 1.6rem !important;">上传数据集</a-button>
                </a-upload>
                <span v-if="selectedDataset === 'custom' && customDatasetFile" class="file-name-display">{{ customDatasetFile.name }}</span>
              </div>
            </div>
            <div class="func3-section">
              <div class="func3-label">选择模型</div>
              <div class="func3-controls">
                <a-select v-model="selectedModel" class="func3-select" style="width: 220px !important; height: 56px !important; font-size: 1.6rem !important;">
                  <a-select-option v-for="item in modelList" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
                </a-select>
                <a-upload 
                  v-if="selectedModel === 'custom'" 
                  :showUploadList="false"
                  :before-upload="() => false"
                  @change="handleModelFileChange"
                  class="func3-upload"
                >
                  <a-button type="primary" style="width: 220px !important; height: 60px !important; line-height: 60px !important; font-size: 1.6rem !important;">上传模型</a-button>
                </a-upload>
                <span v-if="selectedModel === 'custom' && customModelFile" class="file-name-display">{{ customModelFile.name }}</span>
              </div>
            </div>
            <div class="func3-section">
              <div class="func3-indicators-header">
                <div class="func3-label">选择对抗攻击方法</div>
                <a-checkbox 
                  v-model="allChecked" 
                  @change="onCheckAll" 
                  class="func3-all-check"
                >全选</a-checkbox>
              </div>
              <div class="func3-indicators-container">
                <div v-for="(item, idx) in methodList" :key="item.value" class="func3-indicator-item">
                  <a-checkbox v-model="item.checked" @change="updateAllChecked">{{ item.label }}</a-checkbox>
                  <div class="func3-indicator-desc">{{ item.description || '该防御算法用于增强模型抵抗对抗攻击的能力，提高模型的鲁棒性。' }}</div>
                </div>
              </div>
            </div>
            <div class="func3-action-row">
              <a-button type="primary" class="func3-action-btn" :loading="loading" @click="executeDefense">
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
              <h2>主动防御算法评估结果</h2>
              <div class="dataset-info">
                <span class="label">数据集:</span>
                <span class="value">{{ results.dataset }}</span>
                <span class="label" style="margin-left: 40px;">模型:</span>
                <span class="value">{{ results.model }}</span>
              </div>
            </div>
            
            <div class="chart-container">
              <div ref="defenseChart" class="defense-chart"></div>
              <div class="chart-legend">
                <div class="legend-item">
                  <div class="legend-color" style="background-color: #5470C6;"></div>
                  <div class="legend-text">防御前准确率</div>
                </div>
                <div class="legend-item">
                  <div class="legend-color" style="background-color: #91CC75;"></div>
                  <div class="legend-text">防御后准确率</div>
                </div>
              </div>

              <!-- 对抗样本示例 -->
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
  name: 'newwork_func3',
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
          label: '对抗训练', 
          checked: false,
          description: '通过在训练过程中加入对抗样本，增强模型对对抗攻击的鲁棒性，是最常用的防御方法之一。'
        },
        { 
          value: 'mth2', 
          label: '特征压缩', 
          checked: false,
          description: '通过压缩输入特征空间，减少对抗扰动的影响，同时保持模型对正常样本的分类精度。'
        },
        { 
          value: 'mth3', 
          label: '随机化防御', 
          checked: false,
          description: '在模型输入或网络层中引入随机性，打破对抗攻击依赖的梯度信息，提高防御效果。'
        },
        { 
          value: 'mth4', 
          label: '输入变换', 
          checked: false,
          description: '对输入数据进行预处理变换（如JPEG压缩、高斯模糊等），破坏精心设计的对抗扰动。'
        },
        { 
          value: 'mth5', 
          label: '集成防御', 
          checked: false,
          description: '结合多种防御策略或多个模型的预测结果，通过投票或加权平均等方式提高整体防御能力。'
        },
      ],
      loading: false,
      showResults: false,
      results: null,
      barChart: null,
      radarChart: null,
    };
  },
  computed: {
    isDevelopment() {
      return process.env.NODE_ENV === 'development';
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
    executeDefense() {
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
        this.$message.error('请至少选择一个防御方法');
        return;
      }
      
      // 显示加载状态
      this.loading = true;
      
      // 获取选中方法的实际名称
      const selectedMethods = this.methodList
        .filter(item => item.checked)
        .map(item => item.label);  // 使用label而不是value，因为后端需要实际的攻击方法名称
      
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
        console.log('发送请求到 /func_3 (FormData):');
      } else {
        // 使用普通JSON请求
        const selectedDatasetObj = this.datasetList.find(item => item.value === this.selectedDataset);
        const selectedModelObj = this.modelList.find(item => item.value === this.selectedModel);
        
        requestData = {
          dataset: selectedDatasetObj ? selectedDatasetObj.label : this.selectedDataset,
          model: selectedModelObj ? selectedModelObj.label : this.selectedModel,
          methods: selectedMethods
        };
      
        console.log('发送请求到 /func_3:', requestData);
      }
      
      // 发送请求
      this.$axios.post('/func_3', requestData, config)
        .then(response => {
          // 处理成功响应
          console.log('请求成功:', response.data);
          this.results = response.data;
          this.showResults = true;
          this.$nextTick(() => {
            setTimeout(() => {
              this.initCharts();
            }, 300);
          });
        })
        .catch(error => {
          // 处理错误
          console.error('请求失败:', error);
          this.$message.error('防御评估失败: ' + ((error.response && error.response.data && error.response.data.message) || (error.message) || '未知错误'));
        })
        .finally(() => {
          this.loading = false;
        });
    },
    initCharts() {
      console.log('开始初始化图表');
      setTimeout(() => {
        this.initBarChart();
        this.initRadarChart();
      }, 300); // 添加延时，确保模态框完全显示
    },
    initBarChart() {
      if (!this.results || !this.$refs.defenseChart) {
        console.error('initBarChart: 缺少必要数据或DOM元素', {
          results: !!this.results,
          defenseChartRef: !!this.$refs.defenseChart
        });
        return;
      }
      
      console.log('初始化柱状图', {
        defenseChartRef: this.$refs.defenseChart,
        defenseChartSize: {
          width: this.$refs.defenseChart.clientWidth,
          height: this.$refs.defenseChart.clientHeight
        },
        attackMethods: this.getAttackMethods(),
        resultKeys: Object.keys(this.results.result)
      });
      
      // 销毁之前的图表实例
      if (this.barChart) {
        this.barChart.dispose();
      }
      
      // 初始化图表
      this.barChart = echarts.init(this.$refs.defenseChart);
      
      // 准备数据
      const attackMethods = ['无攻击', ...this.getAttackMethods()];
      const beforeAccData = [];
      const afterAccData = [];
      
      // 添加无攻击（clean accuracy）数据
      beforeAccData.push(this.results.result.before_clean_acc);
      afterAccData.push(this.results.result.after_clean_acc);
      
      // 添加各攻击方法的数据
      const resultKeys = Object.keys(this.results.result);
      
      this.getAttackMethods().forEach(method => {
        // 尝试直接匹配
        if (this.results.result[method]) {
          beforeAccData.push(this.results.result[method].before_robust_acc);
          afterAccData.push(this.results.result[method].after_robust_acc);
        } 
        // 尝试匹配不带空格的键名（例如 "attack_method 1" -> "attack_method1"）
        else {
          const methodNoSpace = method.replace(/\s+/g, '');
          const matchedKey = resultKeys.find(key => key.replace(/\s+/g, '') === methodNoSpace);
          
          if (matchedKey && this.results.result[matchedKey]) {
            beforeAccData.push(this.results.result[matchedKey].before_robust_acc);
            afterAccData.push(this.results.result[matchedKey].after_robust_acc);
          } else {
            console.warn(`未找到方法 "${method}" 的数据，使用默认值 0`);
            beforeAccData.push(0);
            afterAccData.push(0);
          }
        }
      });
      
      console.log('柱状图数据:', {
        attackMethods,
        beforeAccData,
        afterAccData
      });
      
      // 设置图表选项
      const option = {
        title: {
          text: '模型防御效果对比',
          left: 'center',
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(params) {
            const methodName = params[0].axisValue;
            let result = `<div style="font-weight:bold;margin-bottom:5px;">${methodName}</div>`;
            params.forEach(item => {
              const colorSpan = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${item.color};"></span>`;
              result += `${colorSpan}${item.seriesName}: ${(item.value * 100).toFixed(2)}%<br/>`;
            });
            return result;
          }
        },
        legend: {
          show: false
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: attackMethods,
          axisLabel: {
            interval: 0,
            rotate: 0,
            fontSize: 13,
            formatter: function(value) {
              // 如果文本太长就截断
              if (value.length > 10) {
                return value.substring(0, 10) + '...';
              }
              return value;
            }
          }
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 1,
          interval: 0.1,
          axisLabel: {
            formatter: function(value) {
              return (value * 100).toFixed(0) + '%';
            }
          }
        },
        series: [
          {
            name: '防御前准确率',
            type: 'bar',
            data: beforeAccData,
            itemStyle: {
              color: '#5470C6'
            },
            barGap: '0%',
            barWidth: '18%',
            emphasis: {
              focus: 'series'
            },
            label: {
              show: true,
              position: 'top',
              formatter: function(params) {
                return (params.value * 100).toFixed(1) + '%';
              }
            }
          },
          {
            name: '防御后准确率',
            type: 'bar',
            data: afterAccData,
            itemStyle: {
              color: '#91CC75'
            },
            barGap: '0%',
            barWidth: '18%',
            emphasis: {
              focus: 'series'
            },
            label: {
              show: true,
              position: 'top',
              formatter: function(params) {
                return (params.value * 100).toFixed(1) + '%';
              }
            }
          }
        ]
      };
      
      // 调试日志
      console.log('defenseChart ref:', this.$refs.defenseChart);
      console.log('attackMethods', attackMethods);
      console.log('beforeAccData', beforeAccData);
      console.log('afterAccData', afterAccData);
      
      // 渲染图表
      this.barChart.setOption(option);
      
      // 响应窗口大小变化
      window.addEventListener('resize', () => {
        if (this.barChart) {
          this.barChart.resize();
        }
      });
    },
    initRadarChart() {
        const attackMethods = this.getAttackMethods();
        if (!this.results || !this.results.result || !this.$refs.radarChart || attackMethods.length < 3) {
            if (attackMethods.length < 3) {
                console.warn('雷达图需要至少3个攻击方法才能渲染。');
            }
            return;
        }

        if (this.radarChart) {
            this.radarChart.dispose();
        }
        this.radarChart = echarts.init(this.$refs.radarChart);

        const indicators = attackMethods.map(method => ({ name: method, max: 1 }));
        const resultKeys = Object.keys(this.results.result);

        const beforeData = attackMethods.map(method => {
            const methodNoSpace = method.replace(/\s+/g, '');
            const matchedKey = resultKeys.find(key => key.replace(/\s+/g, '') === methodNoSpace);
            if (matchedKey && this.results.result[matchedKey]) {
                return this.results.result[matchedKey].before_robust_acc;
            }
            console.warn(`雷达图：未找到方法 "${method}" 的数据，使用默认值 0`);
            return 0;
        });

        const afterData = attackMethods.map(method => {
            const methodNoSpace = method.replace(/\s+/g, '');
            const matchedKey = resultKeys.find(key => key.replace(/\s+/g, '') === methodNoSpace);
            if (matchedKey && this.results.result[matchedKey]) {
                return this.results.result[matchedKey].after_robust_acc;
            }
            console.warn(`雷达图：未找到方法 "${method}" 的数据，使用默认值 0`);
            return 0;
        });

        const option = {
            title: {
                text: '各类攻击下的模型鲁棒性',
                left: 'center',
                textStyle: { fontSize: 18, fontWeight: 'bold' }
            },
            tooltip: { trigger: 'item' },
            legend: {
                data: ['防御前', '防御后'],
                bottom: 0,
                textStyle: { fontSize: 14, fontWeight: 'bold' }
            },
            radar: {
                indicator: indicators,
                radius: '60%',
                center: ['50%', '55%'],
                axisName: { color: '#000', fontWeight: 'bold' }
            },
            series: [{
                name: '模型准确率',
                type: 'radar',
                data: [
                    { value: beforeData, name: '防御前', areaStyle: { color: 'rgba(84, 112, 198, 0.4)' } },
                    { value: afterData, name: '防御后', areaStyle: { color: 'rgba(145, 204, 117, 0.4)' } }
                ]
            }]
        };

        this.radarChart.setOption(option);
        window.addEventListener('resize', () => {
            if (this.radarChart) {
                this.radarChart.resize();
            }
        });
    },
    getAttackMethods() {
      if (!this.results || !this.results.attack_method) return [];
      return this.results.attack_method;
    },
    formatPercentage(value) {
      return (value * 100).toFixed(2) + '%';
    },
    formatChange(change) {
      const sign = change >= 0 ? '+' : '';
      return sign + (change * 100).toFixed(2) + '%';
    },
    getChangeClass(change) {
      if (change > 0.01) return 'positive-change';
      if (change < -0.01) return 'negative-change';
      return 'neutral-change';
    }
  },
  watch: {
    showResults(val) {
      if (val) {
        console.log('showResults变为true，准备初始化图表');
        this.$nextTick(() => {
          setTimeout(() => {
            console.log('延时后初始化图表');
            this.initCharts();
          }, 300);
        });
      }
    }
  },
  beforeDestroy() {
    if (this.barChart) {
      this.barChart.dispose();
      this.barChart = null;
    }
    if (this.radarChart) {
      this.radarChart.dispose();
      this.radarChart = null;
    }
    
    window.removeEventListener('resize', () => {
      if (this.barChart) this.barChart.resize();
      if (this.radarChart) this.radarChart.resize();
    });
  }
};
</script>

<style scoped>
.func3-content {
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
.func3-title {
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  width: 100%;
  margin-bottom: 48px;
}
.func3-intro-container {
  width: 85%;
  min-width: 500px;
  max-width: 1000px;
  margin: 0 auto 48px auto;
  display: flex;
  flex-direction: column;
}
.func3-intro-header {
  font-size: 1.7rem;
  font-weight: 600;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 15px;
}
.func3-intro-content {
  padding: 0 0 15px 0;
  color: #333;
  font-size: 1.4rem;
  line-height: 1.6;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}
.func3-section {
  margin-bottom: 40px;
  width: 100%;
  text-align: left;
}
.func3-label {
  font-size: 1.7rem;
  font-weight: 600;
  margin-right: 36px;
  min-width: 220px;
  margin-bottom: 10px;
}
.func3-controls {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}
.func3-select {
  margin-right: 24px;
  font-size: 1.6rem !important;
  height: 40px !important;
  width: 220px !important;
  box-sizing: border-box !important;
}
.func3-select :deep(.ant-select-selector) {
  height: 40px !important;
  display: flex;
  align-items: center;
  border-radius: 4px !important;
  box-sizing: border-box !important;
  width: 100% !important;
  font-size: 1.6rem !important;
}
.func3-select :deep(.ant-select-selection-selected-value) {
  font-size: 1.6rem !important;
  display: flex;
  align-items: center;
}
.func3-or {
  margin: 0 24px;
  font-size: 1.4rem;
  color: #234;
}
.func3-upload {
  margin-right: 24px;
  box-sizing: border-box !important;
}
.func3-upload :deep(.ant-btn) {
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
.func3-indicators-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}
.func3-all-check {
  font-size: 1.4rem;
  margin-left: auto;
}
.func3-indicators-container {
  width: 100%;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
}
.func3-indicator-item {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}
.func3-indicator-item:last-child {
  border-bottom: none;
}
.func3-indicator-item:hover {
  background-color: #f9f9f9;
}
.func3-indicator-item .ant-checkbox-wrapper {
  display: flex;
  align-items: center;
  width: 250px;
  font-size: 1.5rem;
  font-weight: 500;
}
.func3-indicator-item .ant-checkbox {
  margin-right: 30px;
  top: 0;
}
.func3-indicator-item .ant-checkbox + span {
  padding-left: 0;
  padding-right: 0;
}
.func3-indicator-desc {
  flex: 1;
  color: #666;
  font-size: 1.3rem;
  line-height: 1.5;
  padding-left: 40px;
  border-left: 1px solid #f0f0f0;
  text-align: left;
}

.func3-action-row {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 36px;
}
.func3-action-btn {
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

.defense-chart {
  width: 100%;
  height: 400px;
  margin-bottom: 20px;
}

.radar-chart {
  width: 100%;
  height: 400px;
  margin-top: 30px;
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

/* 示例容器样式 */
.example-container {
  width: 100%;
  margin: 30px 0;
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

@media (max-width: 1200px) {
  .defense-chart {
    height: 300px;
  }
  .radar-chart {
    height: 300px;
  }
}
</style> 