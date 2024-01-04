<template>
    <div>
        <table class='conclic_table'>
            <thead class='conclic_thead' v-if="tableHead.length > 0">
                <tr>
                    <th v-for="(item, index) in tableHead" :key="index">{{ item }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in tableBody" :key="index">
                    <!-- 判断为html标签就设置为图像格式，为普通字符串就填充表格 -->
                    <td :class="imgstyle[0] != 80 ?'conclic_td1':'conclic_td'" v-for="(it, ind) in item" :key="ind" >
                        <div v-if="checkImg(it)==false">{{ it }}</div>
                        <div v-else>
                            <img class="resultTableImg" :style="'width:' + imgstyle[0] +'px;height:' + imgstyle[1] +'px;'" :src="it">
                        </div>
                    </td>
                </tr>

            </tbody>
        </table>
    </div>
</template>

<script>
// import func from 'vue-editor-bridge'
    export default{
        name: "resultTable",
        props: {
            tableHead: {
                type: Array,
                default: ["1", "2", "3", "4"]
            },
            tableBody: {
                type: Array,
                default: []
            },
            imgstyle :{
                type:Array,
                default:[80,80]
            }
        },
        methods:  {
            checkImg(imgPath) {
                // debugger
                var img_list = new Array(".png", ".jpg")
                if(img_list.includes(imgPath.slice(-4))) {
                    // console.log('here!');
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
</script>

<style>
  .conclic_table {
    font-family: 'HONOR Sans CN';
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
    border-collapse: collapse;
    width: 100%;
    table-layout: fixed;
  }

  .conclic_thead{
    border: 1px solid #E0E3EB;
    background-color: #E0E3EB;
    height: 50px;
; 
  }

  .conclic_td {
    border: 1px solid #E0E3EB;
    padding: 10px;
    text-align: center;
  }
  .conclic_td1{
    border: 1px solid #282D3F;
    padding: 10px;
    text-align: center;
    color: white;
    word-wrap: break-word;
    word-break: break-all;
    line-height: 12px;
    font-size: 10px;
  }
  .resultTableImg {
    width: 80px;
    height: 80px;
  }

  /* 每个小方格 height 148 width 320 */
  </style>
