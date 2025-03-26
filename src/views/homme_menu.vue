<template>
    <div>
       <a-layout>
           <!-- 顶部菜单栏 -->
       <a-layout-header>
           <!-- 导航栏 -->
           <navmodule :current="current"/>
       </a-layout-header>
       <a-layout-content>
            <!-- <div class="pro_bottom">人工智能安全理论及验证平台功能</div> -->
            <!-- 功能介绍 -->
           <func_menu></func_menu>
           
       </a-layout-content>
       <!-- <a-layout-footer>

       </a-layout-footer> -->
       </a-layout>
    </div>
</template>
<script>
/* 引入组件，导航栏 */
import navmodule from "../components/nav_homme.vue";

/* 引入组件，单项功能介绍 */
import func_menu from "../components/menu.vue"
import {delCookie} from '../assets/js/cookie.js'
export default {
   name:"homme_menu",
   components:{
       /* 注册组件 */
       navmodule:navmodule,
       func_menu:func_menu 
   },
   data(){
    return {
        current:['join']
    }
   },
   created() {
       document.title = '功能在线体验';
       },
   methods: {
    loginout(){
            delCookie("username")
            setTimeout(function(){
                this.$router.push("/")
            }.bind(this),1000)
        },
   }
}
</script>

<style scoped>
.ant-layout-content {
    background: #F3F7FF;
}

.pro_bottom{
    font-family: HONOR Sans CN;
    font-size: 36px;
    font-weight: 600;
    line-height: 90px;
    letter-spacing: 0px;
    text-align: center;
    color:#000;

    /* Rectangle 295 */
    position: absolute;
    width: 1920px;
    height: 88px;
    left: 0px;
    top: 550px;
}

</style>
