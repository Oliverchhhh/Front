<template>
  <div>
    <!-- 按钮 -->
    <a-radio style="width: 100%;" :checked="checked" @click="changeSelect">{{ name }}</a-radio>
    <div v-if="checked">
    <!-- 介绍 -->
    <div class="describe"> {{ description }} </div>
    <!-- Attribute -->
    <div class="describe" v-if="attributes.length > 0">
      <a-row :gutter="16" style="margin-bottom: 10px;" v-for="(attrs, i) in attributes" :key="i">
        <a-col :span="24 / attrs.length" v-for="(attr_dict, j) in attrs" :key="j">
          <div style="margin-bottom: 8px;">{{ attr_dict.name }}</div>
          <a-input v-if="attributesValues[i][j].type == 'input'" style="background-color:#F2F4F9;"
            v-model:value="attributesValues[i][j].number" 
            :placeholder="attr_dict.defaultNumber.toString()" 
            @change="updateAttributes"/>
          <a-input-number v-if="attributesValues[i][j].type == 'inputNumber'" style="background-color:#F2F4F9; width: 100%;"
            v-model:value="attributesValues[i][j].number" 
            :min="attributesValues[i][j].min"
            :max="attributesValues[i][j].max"
            :step="attributesValues[i][j].step"
            :placeholder="attr_dict.defaultNumber.toString()" 
            @change="updateAttributes"/>
          <a-radio-group v-if="attributesValues[i][j].type == 'selectgroup'" 
          v-model:value="attributesValues[i][j].number" 
          button-style="solid"
          :size="attack_type=='backdoor'?'large':'default'"
          @change="selectgroupChange"
          >
            <a-radio-button v-for="(temp,index) in attributesValues[i][j].valuelist" :value="temp" :key="'radiobutton'+index">{{ temp }}</a-radio-button>
          </a-radio-group>
          <a-radio-button v-if="attributesValues[i][j].type == 'select'" style="width: 100%; background-color:#F2F4F9"
            @click="changeSelectAttribute(i,j)" :checked="attributesValues[i][j].number">
            {{ attributesValues[i][j].name }}
          </a-radio-button>
          <!-- <div>图例：</div>
          <img v-for="(src, index) in srcs"
            :id="'Picture' + index" style="width: 60px; height: 60px;" :src="src"> -->
        </a-col>
      </a-row>
      <div v-if="attack_type=='backdoor'"> 
        <drawTrigger :dataset="dataset" :indexInParent="indexInParent" @updataTrigger="updataTriggerClient"></drawTrigger>
      <!-- 后门样式设置 -->
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import drawTrigger from '../drawTrigger.vue';
export default {
  components:{
    drawTrigger:drawTrigger
  },
  props : {
    name: {
      default: "FGSM"
    },
    checked: {
      default: true
    },
    description: {
      default: "Fast Gradient Sign MethodFGSM快速梯度符号法是一种简单而有效的生成对抗样本的方法，其工作方式如下：在给定输入数据后，利用已训练的模型输出预测并计算损失函数的梯度，然后使用梯度的符号来创建使损失最大化的新数据"
    },
    attributes: {
      default: () => [
        [{name: "arg0",  key:"arg0", defaultNumber: 0.156, number: 0.0, type: "input"}, {name: "arg1", key:"arg1", defaultNumber: 0.156, number: 0.0, type: "input"}, 
        {name: "arg2", key:"arg2", defaultNumber: 0.156, number: 0.0, min:0, max: 1, step:0.001, type: "inputNumber"}],
        [{name: "arg3", key:"arg3", defaultNumber: 0.156, number: 0.0, type: "input"}, {name: "arg4", key:"arg4", defaultNumber: 0.156, number: 0.0, type: "input"}],
        [{ name: "arg5", key:"arg5", defaultNumber: 0, number: 0, type: "selectgroup", valuelist:['0','1','2','3','4','5','6','7','8','9'] }]
      ]
    },
    indexInParent: 0, 
    attack_type:{
      default:"advAttack"
    },
    dataset:0
  },
  data(){
    return {
      attributesValues: [
        [{name: "arg0", key:"arg0", defaultNumber: 0.156}, {name: "arg1", key:"arg1", defaultNumber: 0.156}, {name: "arg2", key:"arg2", defaultNumber: 0.156}],
        [{name: "arg3", key:"arg3", defaultNumber: 0.156}, {name: "arg4", key:"arg4", defaultNumber: 0.156}]
      ],
    }
  },
  methods: {
    changeSelect() {
      // this.checked = !this.checked
      this.$emit("selectMethod", this.indexInParent, !this.checked)
    },
    updateAttributes() {
      // 生成当前的参数列表并返回给父组件
      debugger
      let attributes_dict = {}
      if (this.checked) {
        for(let i = 0; i < this.attributesValues.length; i++) {
          for(let j = 0; j < this.attributesValues[i].length; j++) {
            attributes_dict[this.attributesValues[i][j].key] = this.attributesValues[i][j].number
          }
        }
      }
      if (!("trigger" in attributes_dict) && this.attack_type=="backdoor"){
        attributes_dict["trigger"]=[0, 0, 4, 0]
      }
      this.$emit("updateAttributes", this.indexInParent, attributes_dict)
    },
    selectgroupChange(e){
      console.log(e)
        this.updateAttributes()
    },
    changeSelectAttribute(i,j) {
      attributesValues[i][j].number = !attributesValues[i][j].number
      this.updateAttributes()
    },
    updataTriggerClient(index, x, y, l, color){
      let attributes_dict = {}
      for(let i = 0; i < this.attributesValues.length; i++) {
        for(let j = 0; j < this.attributesValues[i].length; j++) {
          if ( this.attack_type=='advAttack' && this.attributesValues[i][j].type ==  "selectgroup"){
            attributes_dict[this.attributesValues[i][j].key] = this.attributesValues[i][j].valuelist[this.attributesValues[i][j].number]
          }else{
            attributes_dict[this.attributesValues[i][j].key] = this.attributesValues[i][j].number
          }
        }
      }
      attributes_dict["trigger"]=[x, y, l, parseInt(color)]
      this.$emit("updateAttributes", this.indexInParent, attributes_dict)
    }
  },
  mounted() {
    this.attributesValues = Array.from(this.attributes)
    for(let i = 0; i < this.attributesValues.length; i++) {
      for(let j = 0; j < this.attributesValues[i].length; j++) {
        this.attributesValues[i][j].number = this.attributesValues[i][j].defaultNumber
      }
    }
  }
}
</script> 

<style scoped>
.describe {
  /* margin-left: 30px;
  margin-right: 30px; */
  padding: 0 24px 24px 24px;
}
</style>