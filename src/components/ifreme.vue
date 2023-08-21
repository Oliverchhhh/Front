<template>
    <div class="ifreme_block" @click="clickFunc"> 
    <!-- <div class="ifreme_block">  -->
        <div class="icon"> 
            <slot name="func_icon" class="icon_img"></slot>
            <a-icon type="arrow-right" style="color: #0B55F4; font-size: 40px;"/>
        </div>
        <slot name= "header" class="header_title">功能名称</slot>
        <slot name="des_func">功能描述</slot>
    </div>
</template>
<script>
export default {
    name: "ifreme_chart",
    props: {
        // click: {
        //     type: Function
        // }
    },
    methods: {
        clickFunc(){
            this.$emit('click');
        }
    }
}
</script>
<style scoped>
.ifreme_block{
    width: 560px;
    height: fit-content;
    background: white;
    border: none;
    /* border-left: 4px solid #DBE1F0 */
}

.ifreme_block div:hover {
    opacity: 1; 
    transition: 1s; 
    transform: scale(1.01);
}

.icon {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 5%;
}



.header_title {
    font-family: HONOR Sans CN;
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    letter-spacing: 0px;
    text-align: left;
    color: #0B55F4;

}
    
</style>
