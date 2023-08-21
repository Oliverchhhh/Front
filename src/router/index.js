import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path:"/",
      // 重定向
      redirect:'/homme_menu'
    },
    // 组装的homme_index页面
    // {
    //   path: '/homme_index',
    //   name: 'homme_index',
    //   component: () => import('../views/homme_index.vue')
    // },
    // 组装的homme_menu页面
    {
      path: '/homme_menu',
      name: 'homme_menu',
      component: () => import('../views/homme_menu.vue')
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
    // 组装的模型公平性提升页面
    {
      path: '/modelFairnessDebias',
      name: 'modelfairnessdebias',
      component: () => import('../views/modelFairnessDebias.vue')
    },
    // 组装的模型公平性提升页面
    {
      path: '/dataFairnessDebias',
      name: 'datafairnessdebias',
      component: () => import('../views/dataFairnessDebias.vue')
    },
    // 组装的对抗攻击页面
    {
      path: '/advAttack',
      name: 'advAttack',
      component: () => import('../views/advAttack.vue')
    },
    // 组装的对抗防御页面
    {
      path: '/advAttackDefense',
      name: '/advAttackDefense',
      component: () => import('../views//advAttackDefense.vue')
    },
    // 组装的后门攻击页面
    {
      path: '/backdoor',
      name: 'backdoor',
      component: () => import('../views/backdoor.vue')
    },
    // 组装的后门防御页面
    {
      path: '/backdoorDefense',
      name: '/backdoorDefense',
      component: () => import('../views//backdoorDefense.vue')
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
    // 组装的神经层覆盖准则页面
    {
      path: '/coverage_layer',
      name: 'coverage_layer',
      component: () => import('../views/coverage_layer.vue')
    },
    // 组装的重要神经元覆盖准则页面
    {
      path: '/coverage_importance',
      name: 'coverage_importance',
      component: () => import('../views/coverage_importance.vue')
    },
    // 组装的敏感神经元测试准则页面
    {
      path: '/deepsst',
      name: 'deepsst',
      component: () => import('../views/deepsst.vue')
    },
    // 组装的逻辑神经元测试准则页面
    {
      path: '/deeplogic',
      name: 'deeplogic',
      component: () => import('../views/deeplogic.vue')
    },
    // 组装的开发框架安全结构度量
    {
      path: '/frameworkTest',
      name: 'frameworkTest',
      component: () => import('../views/frameworkTest.vue')
    },
    // 组装的模型模块化开发
    {
      path: '/modularDevelop',
      name: 'modularDevelop',
      component: () => import('../views/modularDevelop.vue')
    },
    // 组装的模型安全度量
    {
      path: '/modelMeasure',
      name: 'modelMeasure',
      component: () => import('../views/modelMeasure.vue')
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
    },
  // 组装的故障注入页面
  {
    path: '/inject',
    name: 'inject',
    component: () => import('../views/inject.vue')
  },
  // 组装的形式化验证页面
  {
    path: '/FormalVerfy',
    name: 'FormalVerfy',
    component: () => import('../views/FormalVerfy.vue')
  },
  ]
  
})
