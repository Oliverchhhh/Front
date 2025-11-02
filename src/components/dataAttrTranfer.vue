<template>
    <a-transfer
      :data-source="mockData"
      :list-style="{
        width: '493px',
        height: '240px',
      }"
      :target-keys="targetKeys"
      :render="renderItem"
      @change="handleChange"
    >
    <a-button
      class="reSelect"
      slot="footer"
      slot-scope="props"
      size="small"
      @click="reSelectMock"
    >
      重置
    </a-button>
    </a-transfer>
  </template>
  <script>
  export default {
    props:["mockData","targetKeys"],
    data(){
        return{
            targetKeysSource:this.targetKeys,
            targetKeystemp:this.targetKeys
        }
    },
    mounted(){
    },
    methods: {
      renderItem(item) {
        const customLabel = (
          <span class="custom-item">
            {item.title} | {item.description}
          </span>
        );
        return {
          label: customLabel, // for displayed item
          value: item.title, // for title and filter matching
        };
      },
      handleChange(targetKeys) {
        if ( this.targetKeysSource.length == 0 ){
          this.targetKeysSource = this.targetKeys
        };
        this.targetKeystemp = targetKeys;
        this.$emit('clientTransfer',this.targetKeystemp);
      },
      reSelectMock(){
        if ( this.targetKeysSource.length == 0 ){
          this.targetKeys = this.targetKeys;
          this.targetKeystemp = this.targetKeys;
          this.$emit('clientTransfer',this.targetKeystemp);
        }else{
          this.targetKeys = this.targetKeysSource
          this.targetKeystemp = this.targetKeys;
          this.$emit('clientTransfer',this.targetKeystemp);
        }
        
      },
    },
  };
  </script>
<style scoped>
/* 穿梭框头样式 */
.ant-transfer-list-header{
  padding: 9px 12px 9px 16px;
  height: 40px;
  background: #F2F4F9;
}
  /* 重置按钮样式 */
.reSelect{
  float:left;
  margin: 8px; 
  padding: 2px 10px;
  width: 48px; 
  height: 24px;
  border: 1px solid #0B55F4;
  border-radius: 2px;
  color: #0B55F4;
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;

  align-items: center;
}



</style>