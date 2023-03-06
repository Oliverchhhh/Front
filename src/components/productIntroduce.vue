<template>
    <div class="top_product" height="484px">
        <!-- 产品介绍 -->
        <div class="product_text">
            <h1>人工智能安全理论及验证平台</h1>
            <p>聚焦人工智能系统面临的安全问题，提供人工智能系统全生命周期一站式检测和一体化安全防御方案,适用于安防、交通、金融行业广泛应用的的人脸识别、目标检测等人工智能场景</p>
            <button class="join">立即体验</button>
        </div>
        <div class="product_img">
        </div>
    </div>
</template>
<script>
    export default{
        name:"top_product"
    }
</script>
<style scoped>
/* 产品介绍样式 */
.top_product{
    height: 480px;
    width: 1800px;
}
/* 平台介绍文字的样式 */
.product_text{
    width: 649px;
    margin-left: 250px;
    text-align: left;
    float: left;
}
/* 平台名称样式 */
.product_text h1{
    height: 180px;
    font-family: PingFangSC-Semibold;
    font-size: 60px;
    color: #404040;
    letter-spacing: 0;
    line-height: 90px;
    font-weight: 600;
    margin: 114px auto auto auto;
}
.product_text p{
    height: 100px;
    font-family: PingFangSC-Regular;
    font-size: 24px;
    color: #717171;
    letter-spacing: 0;
    line-height: 40px;
    font-weight: 400;
    margin-top: 16px;
}
/* 立即体验按钮样式 */
.join{
    width: 161px;
    height: 60px;
    background: #3672F5;
    border:none;
    border-radius: 4px;
    font-family: PingFangSC-Medium;
    font-size: 24px;
    color: #FFFFFF;
    letter-spacing: 0;
    font-weight: 500;
    padding: 14px -10px 13px  33px;
    margin-top: 31px;
}
/* 平台图片样式 */
.product_img{
    background: #3672F5;
    margin:73px auto auto 60px;
    height: 411px;
    width: 840.68px;
    float: left;

}

</style>