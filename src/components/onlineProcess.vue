<template>
    <div class="dialog">
        <!--外层的遮罩 点击事件用来关闭弹窗，isShow控制弹窗显示 隐藏的props-->
        <div class="dialog-cover back"  v-if="isShow" @click="closeMyself"></div>
        <!-- transition 这里可以加一些简单的动画效果 -->
        <transition name="drop">
            <!--style 通过props 控制内容的样式 -->
            <div  class="dialog-content" v-if="isShow" @click.stop="_stopPropagation($event)">
                <div class="dialog_head back">
                    <!--弹窗头部 title-->
                    <div class="close_button">
                        <a-icon type="close" @click="closeMyself" style="font-size: 20px;color:#6C7385;" class="closebutton"/>
                    </div>
                    <slot name="header">结果报告</slot>
                </div>
                <div class="dialog_main" >
                <!--弹窗的内容-->
                    <slot name="main">弹窗内容</slot>
                    
                </div>
                
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    name:"onlineProcess",
    props: {
        isShow: {
        //弹窗组件是否显示 默认不显示
        type: Boolean,
        default: false,
        required:true, //必须
        },
        //下面这些属性会绑定到div上面 详情参照上面的html结构
        // 如： :style="{top:topDistance+'%',width:widNum+'%'}"
        widNum:{
        //内容宽度
        type: Number,
        default:50
        },
        leftSite:{
        // 左定位
        type: Number,
        default:25.2
        },
        topDistance: {
        //top上边距
        type: Number,
        default:10
        },
        pdt:{
        //上padding
        type: Number,
        default:22
        },
        pdb:{
        //下padding
        type: Number,
        default:47
        }
        },
    // props:["is-show","top-distance"],
    methods: {
        closeMyself() {
        this.$emit("on-close");
        //如果需要传参的话，可以在"on-close"后面再加参数，然后在父组件的函数里接收就可以了。
        },
        _stopPropagation(ev){
            var _this = this;
            ev.stopPropagation();
        }
    }
}

</script>

<style scoped>
 /* 最外层 设置position定位 */
 .dialog {
 position: relative;
 color: #e7e5e6;
 font-size: 16px;
 }
  /* 遮罩 设置背景层，z-index值要足够大确保能覆盖，高度 宽度设置满 做到全屏遮罩 */
 .dialog-cover {
 background: rgba(68, 68, 68, 0.8);
 position: fixed;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 }
.close_button{
    /* height: 40px;
    width: 40px; */
    display: flex;
    justify-content: center;
    align-items: center;
    float: right;
}
/* 内容层 z-index要比遮罩大，否则会被遮盖， */
 .dialog-content{
position: fixed;
top: 400px;
width: 500px;
height: 330px;
left: 720px;
 /* bottom: 5px; */
  /* 移动端使用felx布局 */
 display: flex;
 flex-direction: column;
 justify-content: start;
 align-items: center;
 z-index: 2001;
 color: rgb(0, 0, 0);
overflow: scroll;
background: #FFFFFF;
box-shadow: 0px 8px 20px rgba(44, 51, 67, 0.06);
border-radius: 8px;
 }
 /* 标题框样式 */
 .dialog_head{
    width: 500px;
    left: 0px;
    top: 1px;
    height: 88px;
    padding: 24px;
    /* border-bottom: 1px solid #E0E3EB; */
 }
 
 .dialog_main{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px;
    gap: 60px;

    position: absolute;
    width: 500px;
    /* height: 8265px; */
    left: 0px;
    top: 89px;

 }
 .foot_close{
    background: #5196FF;
    border-radius: 4px;
    width: 143px;
    height: 50px;
 }

 
</style>