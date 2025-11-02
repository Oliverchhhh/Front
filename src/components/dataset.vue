<template>
    <p class="matchedMethodText"><span>CIFAR10数据集：</span>是由 Hinton 的学生 Alex Krizhevsky 和 Ilya Sutskever 整理的一个用于识别普适物体的小型数据集。一共包含 10 个类别的 RGB 彩色图 片：飞机（ airplane ）、汽车（ automobile ）、鸟类（ bird ）、猫（ cat ）、鹿（ deer ）、狗（ dog ）、蛙类（ frog ）、马（ horse ）、船（ ship ）和卡车（ truck ）。图片的尺寸为 32×32 ，数据集中一共有 50000 张训练圄片和 10000 张测试图片。</p>
    <p class="matchedMethodText">图例：</p>
    <div class="demoData" >
        <div v-for="(item, index) in CIFAR10_imgs" :key="index">
            <img :src="item.imgUrl">
        </div>
    </div>
</template>
<script>
    export default {
        name: "dataset"
    }
</script>

<style>
    
</style>