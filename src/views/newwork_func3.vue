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
            <div class="func3-intro-block">功能介绍</div>
            <div class="func3-section">
              <div class="func3-label">选择数据集（下拉）</div>
              <a-select v-model="selectedDataset" class="func3-select" style="width: 220px;">
                <a-select-option v-for="item in datasetList" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
              </a-select>
              <span class="func3-or">或</span>
              <a-upload :showUploadList="false" class="func3-upload">
                <a-button type="primary">上传数据集（按钮）</a-button>
              </a-upload>
            </div>
            <div class="func3-section">
              <div class="func3-label">选择模型（下拉）</div>
              <a-select v-model="selectedModel" class="func3-select" style="width: 220px;">
                <a-select-option v-for="item in modelList" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
              </a-select>
              <span class="func3-or">或</span>
              <a-upload :showUploadList="false" class="func3-upload">
                <a-button type="primary">上传模型（按钮）</a-button>
              </a-upload>
            </div>
            <div class="func3-section">
              <div class="func3-label">选择对抗攻击方法（勾选）</div>
              <div class="func3-indicator-row">
                <a-checkbox v-model="allChecked" @change="onCheckAll">全选</a-checkbox>
              </div>
              <div v-for="(item, idx) in methodList" :key="item.value" class="func3-indicator-row">
                <a-checkbox v-model="item.checked">{{ item.label }}</a-checkbox>
                <a-button class="func3-indicator-btn">{{ item.label }}</a-button>
                <span class="func3-indicator-desc">文字介绍</span>
              </div>
            </div>
            <div class="func3-action-row">
              <a-button type="primary" class="func3-action-btn">执行（按钮）</a-button>
            </div>
          </div>
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
import navmodule from '../components/nav_homme.vue';
export default {
  name: 'newwork_func3',
  components: { navmodule },
  data() {
    return {
      selectedDataset: '',
      selectedModel: '',
      datasetList: [
        { value: 'ds1', label: '数据集1' },
        { value: 'ds2', label: '数据集2' },
      ],
      modelList: [
        { value: 'm1', label: '模型1' },
        { value: 'm2', label: '模型2' },
      ],
      allChecked: false,
      methodList: [
        { value: 'mth1', label: '方法1', checked: false },
        { value: 'mth2', label: '方法2', checked: false },
        { value: 'mth3', label: '方法3', checked: false },
        { value: 'mth4', label: '方法4', checked: false },
        { value: 'mth5', label: '方法5', checked: false },
      ],
    };
  },
  methods: {
    onCheckAll(e) {
      const checked = e.target.checked;
      this.methodList.forEach(item => item.checked = checked);
    },
  },
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
.func3-intro-block {
  width: 85%;
  min-width: 500px;
  max-width: 1000px;
  min-height: 100px;
  background: #d1d3d4;
  color: #fff;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 28px;
  margin: 0 auto 48px auto;
  border: 2.5px solid #222;
}
.func3-section {
  margin-bottom: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.func3-label {
  font-size: 1.7rem;
  font-weight: 600;
  margin-right: 36px;
  min-width: 220px;
}
.func3-select {
  margin-right: 24px;
  font-size: 1.3rem;
  height: 48px;
}
.func3-or {
  margin: 0 24px;
  font-size: 1.4rem;
  color: #234;
}
.func3-upload {
  margin-right: 24px;
}
.func3-indicator-row {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  gap: 20px;
}
.func3-indicator-btn {
  background: #19586b;
  color: #fff;
  border: none;
  border-radius: 10px;
  margin-left: 12px;
  min-width: 120px;
  font-size: 1.4rem;
  height: 48px;
}
.func3-indicator-desc {
  margin-left: 24px;
  color: #333;
  font-size: 1.3rem;
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
.func3-indicator-row .ant-checkbox-wrapper,
.func3-indicator-row .ant-checkbox + span,
.func3-indicator-row .ant-checkbox-inner {
  font-size: 1.4rem !important;
}
</style> 