<template>
    <a-transfer
      :data-source="mockData"
      :list-style="{
        width: '650px',
        height: '300px',
      }"
      :target-keys="targetKeys"
      :render="renderItem"
      @change="handleChange"
    />
  </template>
  <script>
  export default {
    props:["mockData","targetKeys"],
    data(){
        return{
            targetKeystemp:this.targetKeys
        }
    },
    methods: {
      renderItem(item) {
        const customLabel = (
          <span class="custom-item">
            {item.title} - {item.description}
          </span>
        );
        return {
          label: customLabel, // for displayed item
          value: item.title, // for title and filter matching
        };
      },
      handleChange(targetKeys, direction, moveKeys) {
        this.targetKeystemp = targetKeys;
        this.$emit('clientTransfer',this.targetKeystemp);
      },
    },
  };
  </script>
<style scoped>
  /* 性别穿梭框文字样式 */




</style>