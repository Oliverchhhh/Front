<template>
  <div class="modelStyle">
    <!-- 按钮 -->
    <a-radio style="width: 100%;" :checked="checked" :disabled="disabled" @click="selectModel">{{ name }}</a-radio>
    <!-- 子模型 -->
    <a-row  v-if="checked && subset.length!=0" class="subModelGroup">
      <a-radio-group v-model:value="selected"  class="subModelGroupdiv" >
        <a-radio-button v-for="(subModel, index) in subset" 
          :key="subModel" 
          :value="index"
         >{{ subModel }}</a-radio-button>
      </a-radio-group>
    </a-row>
  </div>
</template>

<script>
export default {
  props : {
    name: {
      default: "VGG"
    },  
    disabled:{
      default:false
    },
    checked: {
      default: true
    },
    subset: {
      default: () => []
    },
    upload: {
      default: false
    },
    indexInParent: 0,
  },
  methods: {
    selectModel: function() {
      this.$emit("selectModel", this.indexInParent, this.selected)
    },
  },
  data(){
    return {
      selected: 0,
    }
  },
  watch: {
    selected: {
      handler(v){
        this.$emit("selectModel", this.indexInParent, this.selected)
      } 
    }
  }
}
</script>
<style  scoped>
.modelStyle{
  display: flex;
  width: 1104px;
  flex-direction: column;
  align-items: flex-start;
}
.ant-radio-wrapper{
  margin: 0px 0px;
}
.subModelGroup{
  display: flex;
  padding: 12px 24px;
  flex-direction: column;
  align-items: flex-start;
  /* gap: 10px; */
}
.subModelGroupdiv{
  display: flex;
  padding: 4px;
  align-items: center;
  border-radius: 4px;
  background: var(--gray-7, #F2F4F9);
}
.subModelButton{
  /* display: flex; */
  padding: 4px 16px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 2px;
  border-color: var(--gray-7, #F2F4F9);
  /* border: 0px; */
  color: #000;
  text-align: center;
  font-family: HONOR Sans CN;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
}
</style>