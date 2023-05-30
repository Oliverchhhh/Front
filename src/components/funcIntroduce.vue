<template>
    <div id="funcDes">
        <!-- 功能描述 -->
        <div style="height: 80px;">
            <!-- title -->
            <h2 class="subTitle">功能介绍</h2>
            <p class="destext">{{ funcDesText.destext }}</p>
        </div>
        <div class="funcBody" :style="{backgroundImage:'url('+funcDesText.bgimg+')'}">
            <!-- 介绍主体 -->
            <div class="functitle">
                <!-- icon展示 -->
                <img class="paramIcom" :src="funcDesText.imgpath" :alt="funcDesText.name">
                <!-- 功能名称 -->
                <h3>{{ funcDesText.name }}</h3>
            </div>
            <div class="proInfo" >
                <!-- 背景介绍 -->
                <p class="bgInfo">{{ funcDesText.backinfo}}</p>
                <!-- 亮点介绍 -->
                <template >
                    <ul>
                        <li v-for="(item,index) in funcDesText.highlight" :key="index" class="HLInfo">
                        {{ item }}
                        </li>
                    </ul>
                
                </template>
                
            </div>
            
        </div>
    </div>
</template>
<script>

  export default{
      name:"func_introduce",
      props:["funcDesText"],
  }
</script>
<style scoped>
/* 背景图设置 */
#funcDes{
width: 1200px;
margin: 80px auto auto auto;
margin-left: 360px;
margin-right: 360px;
/* background-image: url("../assets/img/funcBackground.png"); */
background-image: url("~@/assets/img/funcBackground.png");
background-color: #FFFFFF;
background-position: 122px 43px;
background-size: 1000px 538px;
background-repeat:no-repeat;
height: 670px;
}

/* 功能总介绍 */
.destext{
height: 32px;
font-family: PingFangSC-Regular;
font-size: 24px;
color: #79828F;
letter-spacing: 6px;
line-height: 32px;
font-weight: 400;
width: 1200px;
margin-top: 72px;
position: absolute;

}
/* 功能介绍正文样式设置 */
.funcBody{
box-shadow: 13px 13px 51px 0px rgba(111,118,138,0.2);
width: 1200px;
height: 355px;
border-radius: 8px; 
margin-top: 48px;
background-color: #FFFFFF;
background-position: 967px 127px;
background-size: 210px 229px;
background-repeat:no-repeat;
}
/* 功能标题样式 */
.functitle{
    height:74px;
    padding: 38px 0 0 0;
    margin-left: 36.31px;
    text-align: left;
}



/* 功能标题正文样式 */
.functitle h3{
    display: inline;
    margin-top: 38px;
    width: 279px;
    height: 36px;
    font-family: PingFangSC-Semibold;
    font-size: 24px;
    color: #333333;
    letter-spacing: 0;
    line-height: 36px;
    font-weight: 600;
}
/* 正文介绍样式 */
.proInfo{
    margin: 18px 32px;
    text-align: left;

    

}
/* 背景介绍样式 */
ul{
    padding: 0px 0px 0px 0px;
}
.HLInfo{
    /* width: 160px; */
    height: 36px;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #5A7DA9;
    letter-spacing: 0;
    line-height: 36px;
    font-weight: 400;
    margin: 4px 16px;
}


</style>