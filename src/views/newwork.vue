<template>
  <div>
    <a-layout>
      <!-- 顶部导航栏 -->
      <a-layout-header style="background: transparent;">
        <navmodule />
      </a-layout-header>
      <a-layout-content class="newwork-content">
        <!-- 按钮底板区域，包含标题和描述 -->
        <div class="btn-board">
          <div class="page-title">平台核心功能</div>
          <div class="page-desc">聚焦AI安全，提供全流程的智能检测与防护能力</div>
          <div class="func-btn-row">
            <div class="func-btn func1" @click="goFunc1">
              <div class="func-icon"><i class="iconfont icon-data"></i></div>
              <div class="func-title">异常训练数据检测与安全性评估</div>
              <div class="func-sub">(button)</div>
              <div class="glow-bg"></div>
            </div>
            <div class="func-btn func2" @click="goFunc2">
              <div class="func-icon"><i class="iconfont icon-shield"></i></div>
              <div class="func-title">对抗样本检测</div>
              <div class="func-sub">(button)</div>
              <div class="glow-bg"></div>
            </div>
            <div class="func-btn func3" @click="goFunc3">
              <div class="func-icon"><i class="iconfont icon-rocket"></i></div>
              <div class="func-title">主动防御算法</div>
              <div class="func-sub">(button)</div>
              <div class="glow-bg"></div>
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
  name: 'newwork',
  components: { navmodule },
  methods: {
    goFunc1() {
      this.$router.push('/newwork_func1');
    },
    goFunc2() {
      this.$router.push('/newwork_func2');
    },
    goFunc3() {
      this.$router.push('/newwork_func3');
    }
  }
}
</script>

<style scoped>
@import url('//at.alicdn.com/t/c/font_4323436_2w6k2k8k8k.css'); /* 示例iconfont，可替换为你项目的iconfont */

.newwork-content {
  min-height: 100vh;
  background: linear-gradient(135deg, #f3f7ff 60%, #e6f0fa 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;
}
.btn-board {
  background: rgba(255,255,255,0.65);
  border-radius: 56px;
  box-shadow: 0 12px 60px 0 rgba(120, 200, 255, 0.13), 0 4px 16px rgba(162,89,255,0.10);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 72px 0 72px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80px;
  min-width: 1800px;
  max-width: 98vw;
}
.page-title {
  font-size: 3.6rem;
  font-weight: 700;
  color: #2a3b5c;
  margin-bottom: 18px;
  letter-spacing: 2.5px;
  text-align: center;
}
.page-desc {
  font-size: 1.7rem;
  color: #6b7a99;
  margin-bottom: 64px;
  text-align: center;
  letter-spacing: 1.2px;
}
.func-btn-row {
  display: flex;
  justify-content: center;
  gap: 96px;
  margin: 0;
}
.func-btn {
  position: relative;
  width: 480px;
  height: 300px;
  background: linear-gradient(135deg, #4F8CFF 0%, #1FC8DB 100%);
  box-shadow: 0 12px 48px 0 rgba(79,140,255,0.13);
  border-radius: 56px;
  border: none;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition: box-shadow 0.25s, transform 0.22s, background 0.3s;
  overflow: visible;
}
.func-btn:hover {
  box-shadow: 0 24px 72px 0 #4F8CFF55, 0 8px 32px #1fc8db33;
  transform: translateY(-12px) scale(1.065);
  background: linear-gradient(135deg, #3576e0 0%, #17b8c7 100%);
}
.func-icon {
  font-size: 4.2rem;
  margin-bottom: 32px;
  margin-top: 12px;
  color: #fff;
  z-index: 2;
  text-shadow: 0 4px 24px #4F8CFFF0;
}
.func-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 16px;
  z-index: 2;
}
.func-sub {
  font-size: 1.3rem;
  opacity: 0.85;
  z-index: 2;
}
.glow-bg {
  position: absolute;
  left: 50%;
  top: 80%;
  width: 260px;
  height: 90px;
  background: radial-gradient(ellipse at center, #aeefff 0%, rgba(79,140,255,0.12) 80%, transparent 100%);
  filter: blur(18px);
  opacity: 0.7;
  transform: translate(-50%, 0);
  z-index: 1;
  pointer-events: none;
}
/* 可根据实际iconfont类名替换 */
.icon-data:before { content: "\e6a1"; }
.icon-shield:before { content: "\e6b5"; }
.icon-rocket:before { content: "\e6b7"; }
</style> 