<template>
    <div>
        <table>
            <thead>
                <tr>
                    <th v-for="(item, index) in tableHead" :key="index">{{ item }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in tableBody" :key="index">
                    <!-- 判断为html标签就设置为图像格式，为普通字符串就填充表格 -->
                    <td v-for="(it, ind) in item" :key="ind" v-if="checkImg(it)==true"><img class="resultTableImg" :src="it"></td>
                    <td v-for="(it, ind) in item" :key="ind" v-if="checkImg(it)==false">{{ it }}</td>
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
            }
        },
        methods:  {
            checkImg(imgPath) {
                debugger
                var img_list = new Array(".png", ".jpg")
                // debugger;
                console.log(imgPath.slice(-4))
                // if(imgPath[0]=="/") {
                if(imgPath.slice(-4) in img_list) {
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

  thead{
    border: 1px solid #E0E3EB;
    background-color: #E0E3EB;
    height: 50px;
; 
  }

  td {
    border: 1px solid #E0E3EB;
    padding: 10px;
    text-align: center;
  }
  
  .resultTableImg {
    width: 80px;
    height: 80px;
  }

  /* 每个小方格 height 148 width 320 */
  </style>
