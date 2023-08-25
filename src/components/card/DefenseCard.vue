<template>
  <div>
    <!-- 按钮 -->
    <a-radio style="width: 100%;" :checked="checked" @click="selectedDefense">{{ name }}</a-radio>
    <div v-if="checked" class="describe_con"> <!-- 只有在被选中的时候才会打印信息 -->
      <img style="width: fit-content; " :src="src">
    </div>
  </div>
</template>

<script>
export default {
  props : {
    name: {
      default: "Nash博弈"
    },
    src: {
      default: require('../../assets/img/NashBalanceImg.png')
    },
    checked: {
      default: true
    },
    indexInParent: 0,
  },
  methods: {
    selectedDefense: function() {
      this.$emit("selectedDefense", this.indexInParent, !this.checked)
    }
  }
}
</script> 

<style scoped>
.describe_con{
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
}
</style>