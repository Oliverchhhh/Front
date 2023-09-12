<template>
    <div class="banner">
        <!-- 导航栏 -->
        <div class="nav">
            <div class="icon_title"> 
                <img :src="require('../assets/img/index_icon.png')">
                <p class="title_des"> AI安全理论及验证平台</p>
            </div>
            <div class="top_nav">
                <a-menu v-model="current" mode="horizontal">
                    <a-menu-item key="index"> <a href="/" >平台介绍</a> </a-menu-item>
                    <a-menu-item key="join" > <router-link to="/homme_menu" target="_blank" rel="noopener noreferrer">在线体验 </router-link></a-menu-item>
                    <a-menu-item v-show="username==''" key="login" @click="clicklogin()">登录/注册</a-menu-item>
                    <a-menu-item v-show="username != ''" key="user" >{{username}}</a-menu-item>
                </a-menu>
            </div>
        </div>
        <!-- 平台介绍 -->
        <div class="pro_des">
            <!-- 产品介绍 -->
            <div class="product_text">
                <h1>人工智能<br/>安全理论及验证平台</h1>
                <p>聚焦人工智能系统面临的安全问题，提供人工智能系统全生命周期一站式检测和一体化安全防御方案，适用于安防、交通、金融行业广泛应用的的人脸识别、目标检测等人工智能场景。</p>
                <!-- <a-button type="primary" class="join">立即体验</a-button> -->
                <div class="pro_bottom"></div>
            </div>
            
        </div>
        <loginDialog @on-close="closeLoginDialog" :isShow="loginShow" v-show="loginShow" @clientUserlogin="clientUserlogin"></loginDialog>
    </div>
</template>

<script>
import loginDialog from "../components/loginDialog.vue"
import {getCookie} from '../assets/js/cookie.js'
export default{
    name:"navmodule",
    components:{
            loginDialog
        },
    data() {
        return {
        current: ['join'],
        loginShow:false,
        username:'',
        };
    },
    mounted(){
        this.username = getCookie("username")
        console.log("nav username",this.username)
    },
    watch:{
        /* 判断弹框是否显示，如果true显示结果弹框，并且底层滚动取消*/
        loginShow:{
            immediate:true,
            handler(v){
                if(v){
                    this.noScroll();
                }else{
                    this.canScroll();
                }
            }
        }
    },
    methods:{
        closeLoginDialog(){
            this.loginShow=false;
        //把绑定的弹窗数组 设为false即可关闭弹窗
        },
        clicklogin(){
            this.loginShow = true
        },
        clientUserlogin(name, showFlag){
            this.loginShow = showFlag
            this.username = name
            console.log(this.username)
        }

    }
}
</script>

<style scoped>
.banner{
    position: absolute;
    width: 1920px;
    height: 564px;
    left: 0px;
    top: 0px;
    /* background: linear-gradient(270deg, #E6EFFF 0%, #F5F8FF 100%); */
}
.nav{
    /* 导航栏 */
    position: absolute;
    width: 1920px;
    height: 68px;
    left: 0px;
    top: 0px;
    background: rgba(255, 255, 255, 0.6);
    /* 添加icon */
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
}

.icon_title{
    margin-left: 400px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    gap: 15px;
}

.title_des {
    font-family: MiSans;
    font-size: 22px;
    font-weight: 600;
    line-height: 30px;
    letter-spacing: 0px;
    text-align: left;
    color: #0B55F4;
    /* background: #0B55F4; */
}

/* 导航文字样式 */
.top_nav{
    float: right;
    margin-right: 400px;
    width: 280px;
}
/* 导航文字样式 */
.ant-menu-item{
    /* 平台介绍 */
    width: 72px;
    height: 26px;
    font-family: 'Microsoft YaHei';
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 26px;
    margin:21px 0 21px 48px;
    /* identical to box height, or 144% */
    color: #000000;
    /* Inside auto layout */
    flex: none;
    order: 0;
    flex-grow: 0;
}

.ant-menu-horizontal > .ant-menu-item:hover, .ant-menu-horizontal > .ant-menu-submenu:hover, .ant-menu-horizontal > .ant-menu-item-active, .ant-menu-horizontal > .ant-menu-submenu-active, .ant-menu-horizontal > .ant-menu-item-open, .ant-menu-horizontal > .ant-menu-submenu-open, .ant-menu-horizontal > .ant-menu-item-selected, .ant-menu-horizontal > .ant-menu-submenu-selected {
    color: #0B55F4;
    border-bottom: none;
    font-weight: 700;
}
.ant-menu-horizontal > .ant-menu-item, .ant-menu-horizontal > .ant-menu-item-selected{
    border-bottom: none;
}
/* 取消组件中的下划线 */
.ant-menu.ant-menu-horizontal{
    border-bottom:none;
}
/* 取消padding */
.ant-dropdown-menu__item, .ant-menu-item{
    padding: 0 0;
}
.ant-menu-horizontal > .ant-menu-item-selected > a {
    color: #0B55F4;
    font-weight: 700;
}
.ant-menu-item-selected > a, .ant-menu-item-selected > a:hover {
    color: #0B55F4;
}
/* active时的样式 */
.ant-menu-horizontal>.ant-menu-item.is-active{
    color: #0B55F4 ;
    border-bottom: 2px solid #0B55F4;
    font-weight: 700;
} 
.ant-menu{
    background: none;
}
.pro_des{
    width: 1920px;
    height: 496px;
    margin-top:68px;
    background-image: url("~@/assets/img/bg.png");
    background-size: 1920px 496px;
    background-repeat:no-repeat;
}
.pro_bottom{
    font-family: HONOR Sans CN;
    font-size: 36px;
    font-weight: 600;
    line-height: 90px;
    letter-spacing: 0px;
    text-align: center;

    /* Rectangle 295 */
    position: absolute;
    width: 1920px;
    height: 88px;
    left: 0px;
    top: 480px;
    /* background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 83.29%); */
}
/* 平台介绍文字的样式 */
.product_text{
    /* 人工智能安全理论及验证平台 */
    width: 584px;
    text-align: left;
    margin-left: 360px;
}
/* 平台名称样式 */
.product_text h1{
    /* height: 112px; */
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 500;
    font-size: 48px;
    line-height: 56px;
    /* or 117% */
    color: #0D0D0D;
    /* Inside auto layout */
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
    padding: 76px 0 0 0;
    margin-bottom: 18px
}
.product_text p{
    /* 适用于大规模人工智能系统的评估与验证 */
    width: 584px;
    height: 84px;
    /* padding:18px 0 0 0; */
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 28px;
    /* or 140% */
    color: #3E4453;
    /* Inside auto layout */
    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
}
/* 立即体验按钮样式 */
.join{
    /* Auto layout */

    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 10px 32px;
    gap: 4px;

    width: 160px;
    height: 54px;

    background: #0B55F4;
    border-radius: 4px;

    /* Inside auto layout */

    flex: none;
    order: 1;
    flex-grow: 0;
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 34px;
    margin-top: 48px;
}
</style>