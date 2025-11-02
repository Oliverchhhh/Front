<template>
    <div class="ifreme_block" @click="clickFunc" @mouseenter="showarrow()" @mouseleave="hidearrow()"> 
    <!-- <div class="ifreme_block">  -->
        <div class="icon"> 
            <slot name="func_icon" class="icon_img"></slot>
            <a-icon v-show="arrowshow" type="arrow-right" style="color: #0B55F4; font-size: 40px;"/>
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
    data(){
        return{
            arrowshow:false
    }
    },
    methods: {
        clickFunc(){
            this.$emit('click');
        },
        showarrow(){
            this.arrowshow = true
        },
        hidearrow(){
            this.arrowshow = false
        }
    }
}
</script>
<style scoped>
.ifreme_block{
    width: 100%; /* 改为100%自适应宽度 */
    max-width: 520px; /* 设置最大宽度 */
    min-width: 280px; /* 设置最小宽度 */
    height: fit-content;
    background: linear-gradient(135deg, #ffffff 0%, #fbfcff 100%);
    border: none;
    border-radius: 18px;
    padding: 20px; /* 调整内边距 */
    margin: 12px 0; /* 调整外边距 */
    box-shadow: 
        0 8px 25px rgba(11, 85, 244, 0.06),
        0 3px 12px rgba(11, 85, 244, 0.03),
        0 1px 3px rgba(0, 0, 0, 0.02);
    border: 1px solid rgba(11, 85, 244, 0.06);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    cursor: pointer;
    box-sizing: border-box; /* 确保padding包含在宽度内 */
}

.ifreme_block::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(11, 85, 244, 0.02) 0%, rgba(124, 185, 232, 0.02) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
}

.ifreme_block:hover {
    transform: translateY(-4px);
    box-shadow: 
        0 15px 35px rgba(11, 85, 244, 0.1),
        0 8px 20px rgba(11, 85, 244, 0.06),
        0 3px 8px rgba(11, 85, 244, 0.03);
    border-color: rgba(11, 85, 244, 0.12);
}

.ifreme_block:hover::before {
    opacity: 1;
}

.ifreme_block > * {
    position: relative;
    z-index: 1;
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

/* ========== 响应式设计 ========== */

/* 中等屏幕 (768px - 1023px) */
@media (max-width: 1023px) and (min-width: 768px) {
  .ifreme_block {
    width: 100%;
    max-width: 480px;
    padding: 18px;
    margin: 10px 0;
  }
}

/* 手机屏幕 (767px以下) */
@media (max-width: 767px) {
  .ifreme_block {
    width: 100%;
    max-width: 100%;
    min-width: 260px;
    padding: 16px;
    margin: 8px 0;
    border-radius: 16px;
  }
  
  .icon {
    margin: 3%;
  }
}

/* 超小屏幕 (480px以下) */
@media (max-width: 480px) {
  .ifreme_block {
    width: 100%;
    max-width: 100%;
    min-width: 240px;
    padding: 14px;
    margin: 6px 0;
    border-radius: 14px;
  }
  
  .icon {
    margin: 2%;
  }
}

/* 极小屏幕 (320px以下) */
@media (max-width: 320px) {
  .ifreme_block {
    width: 100%;
    max-width: 100%;
    min-width: 220px;
    padding: 12px;
    margin: 5px 0;
    border-radius: 12px;
  }
  
  .icon {
    margin: 1.5%;
  }
}

/* 超极小屏幕 (240px以下) */
@media (max-width: 240px) {
  .ifreme_block {
    width: 100%;
    max-width: 100%;
    min-width: 200px;
    padding: 10px;
    margin: 4px 0;
    border-radius: 10px;
  }
  
  .icon {
    margin: 1%;
  }
}
    
</style>
