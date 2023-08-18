<template>
  <div>
    <!-- 按钮 -->
    <a-radio style="width: 100%;" :checked="checked" @click="selectDataset">{{ name }}</a-radio>
    <div v-if="checked" class="describe_con"> <!-- 只有在被选中的时候才会打印信息 -->
      <!-- 介绍 -->
      <div class="describe"> <span>{{ name }}数据集</span>：{{ description }} </div>
      <!-- 图例 -->
      <div class="picture describe">
      <!-- <a-row class="describe" style="margin-top: 24px;">
        <a-col class="picture" :span="pictureSrcs.length == 1 ? 24 : 8" v-for="(srcs, index) in pictureSrcs" :key="index"> -->
        <div>图例：</div>
        <div class="picContent">
          <img v-for="(src, index) in pictureSrcs[0]"
          :id="'Picture' + index" style="width: 80px; height: 80px;" :src="src">
        </div>
      </div>
        <!-- </a-col>
      </a-row> -->
    </div>
  </div>
</template>

<script>
export default {
  props : {
    name: {
      default: "MNIST"
    },
    description: {
      default: "是一个手写体数字的图片数据集，该数据集来由美国国家标准与技术研究所（National Institute of Standards and Technology (NIST)）发起整理，一共统计了来自250个不同的人手写数字图片，其中50%是高中生，50%来自人口普查局的工作人员。该数据集的收集目的是希望通过算法，实现对手写数字的识别。"
    },
    pictureSrcs: {
      default: () => [
        [require('../../assets/img/mnist0.jpg'),
        require('../../assets/img/mnist1.jpg'),
        require('../../assets/img/mnist2.jpg'), 
        require('../../assets/img/mnist3.jpg'), 
        require('../../assets/img/mnist4.jpg'), 
        require('../../assets/img/mnist5.jpg'), 
        require('../../assets/img/mnist6.jpg'),
        require('../../assets/img/mnist7.jpg'),
        require('../../assets/img/mnist8.jpg'),
        require('../../assets/img/mnist9.jpg')]
      ]
    },
    checked: {
      default: true
    },
    indexInParent: 0,
  },
  methods: {
    selectDataset: function() {
      this.$emit("selectDataset", this.indexInParent)
    }
  }
}
</script> 

<style scoped>
.describe {
  margin-left: 30px;
  margin-right: 30px;
}
.ant-radio-wrapper {
  margin: 0px 0px;
}
.describe span {
  color: RoyalBlue;
}
.picture {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
.picContent{
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.describe_con{
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
}
</style>