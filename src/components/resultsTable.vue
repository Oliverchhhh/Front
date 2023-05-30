<template>
    <div id="sampletable">
      <table>
        <tr class="firstrow">
          <td>原始样本</td>
          <td>二值化差异</td>
          <td>动态符号测试生成样本</td>
        </tr>
        <!-- <tr>
          <td  v-for="(item, index) in list" :key="index">
            <img :src="item">
            </td>
        </tr> -->
        <tr>
          <td v-for="(item, index) in Group_0" :key="index">
            <img :src="item.imgUrl" :alt="item.name">
        </td>
        </tr>
        <tr>
          <td  v-for="(item, index) in Group_1" :key="index">
            <img :src="item.imgUrl" :alt="item.name">
            </td>
        </tr>
        <tr>
          <td v-for="(item, index) in Group_2" :key="index">
            <img :src="item.imgUrl" :alt="item.name">
            </td>
        </tr>
        <tr>
          <td v-for="(item, index) in Group_3" :key="index">
            <img :src="item.imgUrl" :alt="item.name">
        </td> 
        </tr>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SampleTable',
    // props: ["list"],
    data() {
        return{
            Group_0:[
                {imgUrl:require('../../static/img/sample00.png'),name:'0_init'},
                {imgUrl:require("../../static/img/sample01.png"),name:'0_diff'},
                {imgUrl:require("../../static/img/sample02.png"),name:'0_new'}
            ],
            Group_1:[
                {imgUrl:require('../../static/img/sample10.png'),name:'1_init'},
                {imgUrl:require("../../static/img/sample11.png"),name:'1_diff'},
                {imgUrl:require("../../static/img/sample12.png"),name:'1_new'}
            ],
            Group_2:[
                {imgUrl:require('../../static/img/sample20.png'),name:'2_init'},
                {imgUrl:require("../../static/img/sample21.png"),name:'2_diff'},
                {imgUrl:require("../../static/img/sample22.png"),name:'2_new'}
            ],
            Group_3:[
                {imgUrl:require('../../static/img/sample30.png'),name:'3_init'},
                {imgUrl:require("../../static/img/sample31.png"),name:'3_diff'},
                {imgUrl:require("../../static/img/sample32.png"),name:'3_new'}
            ]
        }
    }
  }
  </script>
  
  <style scoped>
  table {
    font-family: 'HONOR Sans CN';
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
    border-collapse: collapse;
    width: 100%;
    table-layout: fixed;
  }
  .firstrow{
   background-color: #F2F4F9; 
  }
  td {
    border: 1px solid #E0E3EB;
    padding: 10px;
    text-align: center;
  }
  
  img {
    width: 100px;
    height: 100px;
  }

  /* 每个小方格 height 148 width 320 */
  </style>
