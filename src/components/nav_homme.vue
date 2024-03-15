<template>
    <div class="banner">
        <!-- 导航栏 -->
        <div class="nav">
            <div class="icon_title"> 
                <!-- <img :src="require('../assets/img/index_icon.png')"> -->
                <svg width="160" height="40" viewBox="0 0 451 106" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M123.199 98V8H143.199V98H123.199Z" fill="url(#paint0_linear_307_1611)"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M62.44 8L114.81 98H91.45L62.45 48.23L33.45 98H10L62.44 8Z" fill="url(#paint1_linear_307_1611)"/>
                    <path d="M247.489 57.95H202.879L197.499 78H242.129L236.769 98H172.969L189.039 38H252.879L247.489 57.95Z" fill="url(#paint2_linear_307_1611)"/>
                    <path d="M318.509 73.559H275.509L274.349 77.8789H317.349L312.009 97.8789H248.879L264.959 37.8789H328.069L318.509 73.559ZM281.299 51.8389L279.129 59.929H302.049L304.219 51.8389H281.299Z" fill="url(#paint3_linear_307_1611)"/>
                    <path d="M400.789 25.9609H421.129L417.889 38.041H442.949L437.579 58.041H412.579L407.199 78.111H438.469L433.149 97.981H381.469L400.789 25.9609Z" fill="url(#paint4_linear_307_1611)"/>
                    <path d="M379.05 57.8904L381.47 57.7305L385.47 37.7305L383.05 37.8904C374.625 38.5101 366.359 40.5066 358.58 43.8005L360.15 37.9604H340.15L324.07 97.9604H344.07L352.33 67.1205C360.315 61.838 369.507 58.6627 379.05 57.8904Z" fill="url(#paint5_linear_307_1611)"/>
                    <defs>
                    <linearGradient id="paint0_linear_307_1611" x1="130.459" y1="35.9" x2="142.279" y2="109.76" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#0042EB"/>
                    <stop offset="1" stop-color="#17D5FB"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear_307_1611" x1="50.14" y1="57.21" x2="76.14" y2="143.65" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#0042EB"/>
                    <stop offset="1" stop-color="#17D5FB"/>
                    </linearGradient>
                    <linearGradient id="paint2_linear_307_1611" x1="218.41" y1="49.1" x2="218.878" y2="108.463" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#0042EB"/>
                    <stop offset="1" stop-color="#17D5FB"/>
                    </linearGradient>
                    <linearGradient id="paint3_linear_307_1611" x1="293.97" y1="48.9889" x2="294.438" y2="108.352" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#0042EB"/>
                    <stop offset="1" stop-color="#17D5FB"/>
                    </linearGradient>
                    <linearGradient id="paint4_linear_307_1611" x1="422.935" y1="39.2309" x2="423.967" y2="110.371" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#0042EB"/>
                    <stop offset="1" stop-color="#17D5FB"/>
                    </linearGradient>
                    <linearGradient id="paint5_linear_307_1611" x1="360.736" y1="48.8605" x2="361.54" y2="108.353" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#0042EB"/>
                    <stop offset="1" stop-color="#17D5FB"/>
                    </linearGradient>
                    </defs>
                </svg>
                <!-- <p class="title_des"> AI安全理论及验证平台</p> -->
            </div>
            <div class="top_nav">
                <a-menu v-model="current" mode="horizontal">
                    <a-menu-item key="index" class='menu-item'> <a href="/" >平台介绍</a> </a-menu-item>
                    <a-menu-item key="join" class='menu-item'> <router-link to="/homme_menu" target="_blank" rel="noopener noreferrer">在线体验 </router-link></a-menu-item>
                    <!-- <a-menu-item key="llm" class='menu-item'> <router-link  to="/llm" rel="noopener noreferrer">大模型排行榜 </router-link></a-menu-item> -->
                    <a-menu-item v-show="username==''" class='menu-item' key="login" @click="clicklogin()">登录/注册</a-menu-item>
                    <a-sub-menu  class='menu-item' v-show="username != ''" >
                        <span slot="title" class='menu-item sub-title' ><span>{{username}}</span></span>
                        <a-menu-item key='taskList' class='sub-menu-item' ><router-link to="/taskList" >任务中心</router-link></a-menu-item>
                        <a-menu-item key='loginout' class='sub-menu-item' @click="loginout()">注销</a-menu-item>
                    </a-sub-menu>
                </a-menu>
            </div>
        </div>
        <!-- 平台介绍 -->
        <div class="pro_des">
            <!-- 产品介绍 -->
            <div class="product_text">
                <h1>人工智能<br/>安全理论及验证平台</h1>
                <p>聚焦人工智能系统全链路安全威胁，提供一站式安全检测和多维度评估，助力人工智能系统安全防护。</p>
                <!-- <a-button type="primary" class="join">立即体验</a-button> -->
                <div class="pro_bottom"></div>
            </div>
            
        </div>
        <loginDialog @on-close="closeLoginDialog" :isShow="loginShow" v-show="loginShow" @clientUserlogin="clientUserlogin"></loginDialog>
    </div>
</template>

<script>
import loginDialog from "../components/loginDialog.vue"
import {getCookie,delCookie} from '../assets/js/cookie.js'
export default{
    name:"navmodule",
    props:{
        current:[]
    },
    components:{
            loginDialog
        },
    data() {
        return {
        loginShow:true,
        username:'',
        };
    },
    mounted(){
        this.username = getCookie("username")
        console.log("nav username",this.username)
        console.log("current",this.current)
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
        loginout(){
            delCookie("username")
            setTimeout(function(){
                this.$router.push("/")
            }.bind(this),1000)
        },
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
    width: 425px;
}
/* 导航文字样式 */
/* .ant-menu-item{
    
    width: 72px;
    height: 26px;
    font-family: 'Microsoft YaHei';
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 26px;
    margin:21px 0 21px 48px;

    color: #000000;

    flex: none;
    order: 0;
    flex-grow: 0;
} */
.menu-item{
    /* 平台介绍 */
    width: 72px;
    height: 26px;
    font-family: 'Microsoft YaHei';
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 26px;
    margin:21px 0 21px 48px;
}
.menu-item:hover {
    color: #0B55F4;
    border-bottom: none;
    font-weight: 700;
}
.menu-item{
    border-bottom: none;
}
/* .ant-menu-horizontal > .ant-menu-item:hover, .ant-menu-horizontal > .ant-menu-submenu:hover, .ant-menu-horizontal > .ant-menu-item-active, .ant-menu-horizontal > .ant-menu-submenu-active, .ant-menu-horizontal > .ant-menu-item-open, .ant-menu-horizontal > .ant-menu-submenu-open, .ant-menu-horizontal > .ant-menu-item-selected, .ant-menu-horizontal > .ant-menu-submenu-selected {
    color: #0B55F4;
    border-bottom: none;
    font-weight: 700;
}
.ant-menu-horizontal > .ant-menu-item, .ant-menu-horizontal > .ant-menu-item-selected{
    border-bottom: none;
} */
/* 取消组件中的下划线 */
.ant-menu.ant-menu-horizontal{
    border-bottom:none;
}
/* 取消padding */
/* .ant-dropdown-menu__item, .ant-menu-item{
    padding: 0 0;
} */
/* 取消padding */
.menu-item{
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
/* .sub-title{
    line-height:60px
} */
.ant-menu-submenu-selected{
    color:#0B55F4;
    border-bottom:0px;
}
.ant-menu-submenu-title:hover {
    color:#0B55F4;
    border-bottom:0px;
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