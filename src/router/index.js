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
    }
  ]
  
})
