import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path:"/",
      // 重定向
      redirect:'/inject'
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
