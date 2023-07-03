import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path:"/",
      // 重定向
      redirect:'/dataFairnessEva'
    },
    // 组装的数据公平性评估页面
    {
      path: '/dataFairnessEva',
      name: 'datafairnesseva',
      component: () => import('../views/dataFairnessEva.vue')
    },
    // 组装的模型公平性评估页面
    {
      path: '/modelFairnessEva',
      name: 'modelfairnesseva',
      component: () => import('../views/modelFairnessEva.vue')
    },
    // 组装的对抗攻击页面
    {
      path: '/advAttack',
      name: 'advAttack',
      component: () => import('../views/advAttack.vue')
    },
    // 组装的后门攻击页面
    {
      path: '/backdoor',
      name: 'backdoor',
      component: () => import('../views/backdoor.vue')
    },
    // 组装的测试样本生成页面
    {
      path: '/concolic',
      name: 'concolic',
      component: () => import('../views/concolic.vue')
    },
    // 组装的异常数据检测页面
    {
      path: '/dataClean',
      name: 'dataClean',
      component: () => import('../views/dataClean.vue')
    },
    // 组装的系统环境检测页面
    {
      path: '/envTest',
      name: 'envTest',
      component: () => import('../views/envTest.vue')
    },
    // 组装的单神经元覆盖准则页面
    {
      path: '/coverage_neural',
      name: 'coverage_neural',
      component: () => import('../views/coverage_neural.vue')
    },
    {
      path: '/coverage_layer',
      name: 'coverage_layer',
      component: () => import('../views/coverage_layer.vue')
    },
    // 组装的攻击机理分析页面
    {
      path: '/exMethod',
      name: 'exMethod',
      component: () => import('../views/exMethod.vue')
    },
    // 组装的鲁棒性形式化验证页面
    {
      path: '/robustFormalVerification',
      name: 'robustFormalVerification',
      component: () => import('../views/robustFormalVerification.vue')
    }

    
  ]
  
})
