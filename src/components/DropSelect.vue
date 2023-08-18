<template>
  <div>
    <div class="team-list">
      <div class="team-name" @click="nameClick()">
        <div>{{message}}</div>
        <img src="@/assets/img/uploadicon.png" class='team-xiala' v-show='showNum==0'>
        <img src="@/assets/img/third.png" class='team-shouqi' v-show='showNum==1'>
      </div>

      <ul class="team-form" v-show="showNum==1" @click="ulClick()">
        <li v-for="(item,index) in items" :key="index" @click="changeClick(item)">{{item}}</li>
      </ul>
    </div>
  </div>
</template>

 

<script>
export default {
  name: "DropSelect",
    props: {
        Id: {
          type: String,
          default: Math.random().toString()
        },
        items: {
            type: Array,
            default: () => ["a","b","c","d","e"]
        }
    },
  data() {
    return {
      message:"请选择",
      showNum: "0",
      selected:""
    };
  },

  mounted() {
  },

  methods: {
    nameClick() {
      this.showNum = 1;
    },

    ulClick() {
      this.showNum = 0;
    },

    changeClick(item) {
      this.message = "当前展示攻击方法：" + item;
      this.selected = item
      this.$emit("SelectClick", item)
    }
  }
};
</script>

<style scoped lang='less'>
.team-list {
  width: 100%;
  color: rgb(58, 57, 57);
  border: 1px solid rgb(173, 171, 171);
  font-size: 22px;
  line-height: 32px;
  padding: 5px;
  border-radius: 5px;
  margin-right: 20px;


  .team-name {
    display: flex;
    justify-content: space-between;
    padding-left: 5px;

    .team-xiala,
    .team-shouqi {
      width: 18px;
      height: 18px;
      margin-right: 5px;
      margin-top: 8px;
    }
  }

  .team-form {
    border: 1px solid rgb(168, 167, 167);
    font-size: 24px;
    border-radius: 5px;
    margin-left: -6px;
    margin-top: 6px;
    max-height: 240px;
    padding-top: 10px;
    padding-bottom: 10px;
    overflow: auto;

    li {
      height: 50px;
      line-height: 50px;
      list-style: none;
      text-align: left;
    }
  }
}
</style>
