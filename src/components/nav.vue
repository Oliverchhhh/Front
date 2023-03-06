<template>
    <div class="nav">
        <div class="logo">
            <img src="../assets/img/logo.png">
            <label>LOGO</label>
        </div>
        <div class="top_nav">
            <a-menu v-model="current" mode="horizontal">
                <a-menu-item key="index"> 平台介绍 </a-menu-item>
                <a-menu-item key="join" > <a href="" target="_blank" rel="noopener noreferrer">在线体验 </a></a-menu-item>
            </a-menu>
        </div>
    </div>
</template>

<script>
export default{
    name:"navmodule",
    data() {
        return {
        current: ['join'],
        };
    },
}
</script>

<style scoped>
.nav{
    height:80px;
    min-width: none;
    background: #FFFFFF;
    box-shadow: 0px 2px 6px 0px rgba(137,161,191,0.25);
}
/* 系统logo样式 */
.logo{
    width: 150px;
    margin-left: 160px;
    float: left;
}
/* logo图片样式 */
.logo img{
    width: 42px;
    height: 42px;
    background: #F3F3F8;
    margin: 19px auto;
    border-radius: 50%;
    float: left;
}
/* logo文字的样式 */
.logo label{
    width: 84px;
    height: 33px;
    font-family: PingFangSC-Semibold;
    font-size: 24px;
    color: #B0BDC8;
    letter-spacing: 3.45px;
    font-weight: 600;
    margin: 0px auto 23px 24px;
    float: left;
    text-align: center;
}
/* 导航文字样式 */
.top_nav{
    float: right;
    margin-right: 219px;
    width: 280px;
}
/* 取消组件中的下划线 */
.ant-menu.ant-menu-horizontal{
    border-bottom:none;
}
/* 取消padding */
.ant-dropdown-menu__item, .ant-menu-item{
    padding: 0 0;
}
/* active时的样式 */
.ant-menu-horizontal>.ant-menu-item.is-active{
    color: #0E6FFF ;
    border-bottom: 2px solid #0E6FFF;
}
/* 导航文字样式 */
.ant-menu-item{
    width: 72px;
    height: 36px;
    font-family: PingFangSC-Semibold;
    font-size: 18px;
    color: #555B66;
    letter-spacing: 0;
    line-height: 36px;
    font-weight: 600;
    margin:22px 0 22px 68px;
}
</style>