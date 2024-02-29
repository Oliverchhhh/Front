<template>
    <div>
       <a-layout>
           <!-- 顶部菜单栏 -->
       <a-layout-header>
           <!-- 导航栏 -->
           <navmodule class="llm_nav" :current="current"/>
           <div class="nav_title">  
                <div class="title_block"> 
                    <p class="nav_title_text">AIcert 大模型排行榜</p>
                </div>
                <div class="info_block"> 
                    <div class="info_unit"> 
                        <div class="info_top"> 
                            <p class="info_text1">17</p>
                            <p class="info_text2">个</p>
                        </div>
                        <p class="info_text3">覆盖模型</p>
                    </div>
                    <div class="info_unit"> 
                        <div class="info_top"> 
                            <p class="info_text1">3</p>
                            <p class="info_text2">种</p>
                        </div>
                        <p class="info_text3">攻击维度</p>
                    </div>
                </div>
           </div>
       </a-layout-header>
       <a-layout-content>
           <!-- 排行榜 -->
           <rank  :colunm_data="colunm_data" :sheet_data="sheet_data" @listen_com="getComValue"></rank>
       </a-layout-content>
       <a-layout-footer>

       </a-layout-footer>
       </a-layout>
    </div>
</template>
<script>
/* 引入组件，导航栏 */
import { TagsOutline } from "@ant-design/icons";
import navmodule from "../components/nav_homme.vue";
/* 引入组件，排行榜 */
import rank from "../views/dialog/rank.vue";
/* 引入组件，excel加载 */
import * as XLSX from 'xlsx'

const selectSvg = {
       template:`
       <svg t="1680138013828" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4354" width="128" height="128"><path d="M534.869333 490.496a1403.306667 1403.306667 0 0 0 50.858667-25.813333c16.042667-8.618667 29.013333-15.061333 38.570667-19.029334 9.557333-3.925333 17.066667-6.058667 22.869333-6.058666 9.557333 0 17.749333 3.2 24.917333 10.026666 6.826667 6.826667 10.581333 15.061333 10.581334 25.088 0 5.76-1.706667 11.818667-5.12 17.92-3.413333 6.101333-7.168 10.069333-10.922667 11.861334-35.157333 14.677333-74.410667 25.429333-116.736 31.872 7.850667 7.168 17.066667 17.237333 28.330667 29.781333 11.264 12.544 17.066667 18.986667 17.749333 20.053333 4.096 6.101333 9.898667 13.653333 17.408 22.613334 7.509333 8.96 12.629333 15.786667 15.36 20.778666 2.730667 5.034667 4.437333 11.093333 4.437333 18.304a33.706667 33.706667 0 0 1-9.898666 24.021334 33.834667 33.834667 0 0 1-25.6 10.410666c-10.24 0-22.186667-8.618667-35.157334-25.472-12.970667-16.512-30.037333-46.933333-50.517333-91.050666-20.821333 39.424-34.816 65.962667-41.642667 78.506666-7.168 12.544-13.994667 22.186667-20.48 28.672a30.976 30.976 0 0 1-22.528 9.685334 32.256 32.256 0 0 1-25.258666-11.093334 35.413333 35.413333 0 0 1-9.898667-23.68c0-7.893333 1.365333-13.653333 4.096-17.578666 25.258667-35.84 51.541333-67.413333 78.848-93.568a756.650667 756.650667 0 0 1-61.44-12.544 383.061333 383.061333 0 0 1-57.685333-20.48c-3.413333-1.749333-6.485333-5.717333-9.557334-11.818667a30.208 30.208 0 0 1-5.12-16.853333 32.426667 32.426667 0 0 1 10.581334-25.088 33.152 33.152 0 0 1 24.234666-10.026667c6.485333 0 14.677333 2.133333 24.576 6.101333 9.898667 4.266667 22.186667 10.026667 37.546667 18.261334 15.36 7.893333 32.426667 16.853333 51.882667 26.538666-3.413333-18.261333-6.485333-39.082667-8.874667-62.378666-2.389333-23.296-3.413333-39.424-3.413333-48.042667 0-10.752 3.072-19.712 9.557333-27.264A30.677333 30.677333 0 0 1 512.341333 341.333333c9.898667 0 18.090667 3.925333 24.576 11.477334 6.485333 7.893333 9.557333 17.92 9.557334 30.464 0 3.584-0.682667 10.410667-1.365334 20.48-0.682667 10.368-2.389333 22.570667-4.096 36.906666-2.048 14.677333-4.096 31.146667-6.144 49.834667z" fill="#FF3838" p-id="4355"></path></svg>
       `,
   };
   const selectIcon = {
       template: `
           <a-icon :component="selectSvg" />
       `,
       data() {
           return {
               selectSvg,
           };
       },
   }
export default {
   name:"envTest",
   components:{
       /* 注册组件 */
       navmodule:navmodule,
       rank:rank, XLSX,
       selectIcon,
   },
   data(){
       return{
            current: ['llm'],
            colunm_data:[],
            sheet_data:[],
            rank_num: 0,
            attack_type: null,
            test_var:false
        }
       },
   created() {
        document.title = '大模型排行榜';
        this.$nextTick(()=>{
            // console.log('Loaded Excel !');
            this.resultPro("static/output/test1.xlsx");
            })
        },
    methods: {
        /* result 处理*/
        resultPro(file_path){
            //加载excel
            this.$axios.get(file_path,{responseType:'arraybuffer'}).then((res)=>{
                let data = new Uint8Array(res.data);
                let wb = XLSX.read(data, {type: "array"});
                let sheets = wb.Sheets;
                this.transformSheets(sheets);
            }) .catch( err=>{
                this.err = err
            })
        },
        // excel转换json，处理表头、表体数据
        transformSheets(sheets){
            let content = []
            let tmplist = []
            for (let key in sheets){
                //参考https://github.com/SheetJS/js-xlsx#utility-functions
                tmplist.push(XLSX.utils.sheet_to_json(sheets[key]).length);
                content.push(XLSX.utils.sheet_to_json(sheets[key]));
            }
            // 排行榜模型数量
            this.rank_num = tmplist[0];
            // 表头
            this.colunm_data = [
                {
                    title: "模型名称",
                    dataIndex: "Name",
                    key:"Name",
                    width:'300px',
                    // fixed:'left'
                },{
                    title: "参数规模",
                    dataIndex: "Size",
                    key:"size",
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.Size - b.Size,
                    width:'200px',
                    // fixed:'left'
                },{
                    title: "组织机构",
                    dataIndex: "Institution",
                    key:"Institution",
                    width:'300px',
                    // fixed:'left'
                },{
                    title: "支持语言",
                    dataIndex: "Language",
                    key:"Language",
                    width:'200px',
                    // fixed:'left'
                },
                // 宣传稿版本大模型界面
                {
                    title: "BoolQ/扰动前",
                    dataIndex: "BoolQ_nor",
                    key:"BoolQ_nor",
                    width:'200px',
                    sorter: (a, b) => a.BoolQ_nor - b.BoolQ_nor,
                },
                {
                    title: "BoolQ/扰动后",
                    dataIndex: "BoolQ",
                    key:"BoolQ",
                    width:'200px',
                    sorter: (a, b) => a.BoolQ - b.BoolQ,
                },
                {
                    title: "MMLU/扰动前",
                    dataIndex: "MMLU_nor",
                    key:"MMLU_nor",
                    width:'200px',
                    sorter: (a, b) => a.MMLU_nor - b.MMLU_nor,
                },
                {
                    title: "MMLU/扰动前",
                    dataIndex: "MMLU",
                    key:"MMLU",
                    width:'200px',
                    sorter: (a, b) => a.MMLU - b.MMLU,
                },
                // 原版大模型界面
                // {
                //     title: "SST-2",
                //     children:[
                //         {  
                //             title: "Nor Attack Acc",
                //             dataIndex: "sst_nor",
                //             key:"sst_nor",
                //             sorter: (a, b) => a.sst_nor - b.sst_nor,
                //             // width:'7%'
                //         },
                //         {
                //             title: "UT Acc",
                //             dataIndex: "sst_ut",
                //             key:"sst_ut",
                //             sorter: (a, b) => a.sst_ut - b.sst_ut,
                //             id: 'ut',
                //             // className:'tableHidden',
                //             // colSpan: 0,
                //             // customRender: (value, row, index) => {
                //             //     console.log('hahaha:',value, row, index)
                //             // }
                            
                //             // this.attack_type!='gcg'?'tableShow':
                //         },{
                //             title: "GCG Acc",
                //             dataIndex: "sst_gcg",
                //             key:"sst_gcg",
                //             sorter: (a, b) => a.sst_gcg - b.sst_gcg,
                //             id: 'gcg',

                //             // width:'7%'
                //         }
                //         ]
                // },{
                //     title: "SNLI",
                //     children:[
                //         {  
                //             title: "Nor Attack Acc",
                //             dataIndex: "snli_nor",
                //             key:"snli_nor",
                //             sorter: (a, b) => a.snli_nor - b.snli_nor,
                //             // width:'7%'
                //         },{
                //             title: "UT Acc",
                //             dataIndex: "snli_ut",
                //             key:"snli_ut",
                //             sorter: (a, b) => a.snli_ut - b.snli_ut,
                //             id: 'ut',
                //             // width:'7%'
                //         },{
                //             title: "GCG Acc",
                //             dataIndex: "snli_gcg",
                //             key:"snli_gcg",
                //             sorter: (a, b) => a.snli_gcg - b.snli_gcg,
                //             id: 'gcg',
                //             // width:'7%'
                //             // width:'max-content'
                //         }
                //         ]
                // },{
                //     title: "BoolQ",
                //     children:[
                //         {  
                //             title: "Nor Attack Acc",
                //             dataIndex: "boolq_nor",
                //             key:"boolq_nor",
                //             sorter: (a, b) => a.boolq_nor - b.boolq_nor,
                //             // width:'7%'
                //         },{
                //             title: "UT Acc",
                //             dataIndex: "boolq_ut",
                //             key:"boolq_ut",
                //             sorter: (a, b) => a.boolq_ut - b.boolq_ut,
                //             id: 'ut',
                //             // width:'7%'
                //         },{
                //             title: "GCG Acc",
                //             dataIndex: "boolq_gcg",
                //             key:"boolq_gcg",
                //             sorter: (a, b) => a.boolq_gcg - b.boolq_gcg,
                //             id: 'gcg',
                //             // width:'7%'
                //             // width:'max-content'
                //         }
                //         ]
                // },{
                //     title: "MMLU",
                //     children:[
                //         {  
                //             title: "Nor Attack Acc",
                //             dataIndex: "mmlu_nor",
                //             key:"mmlu_nor",
                //             sorter: (a, b) => a.mmlu_nor - b.mmlu_nor,
                //             // width:'7%'
                //         },{
                //             title: "UT Acc",
                //             dataIndex: "mmlu_ut",
                //             key:"mmlu_ut",
                //             sorter: (a, b) => a.mmlu_ut - b.mmlu_ut,
                //             id: 'ut',
                //             // width:'7%'
                //             // width:'max-content'
                //         },{
                //             title: "GCG Acc",
                //             dataIndex: "mmlu_gcg",
                //             key:"mmlu_gcg",
                //             sorter: (a, b) => a.mmlu_gcg - b.mmlu_gcg,
                //             id: 'gcg',
                //             // width:'7%'
                //             // width:'max-content'
                //         }
                //         ]
                // },
            ]
            this.sheet_data = content[0];
            for(var i=0;i<this.rank_num;i++){
                // console.log(i);
                // console.log(this.sheet_data[i]);
                this.sheet_data[i].key=i+1;
            } 
            },
        getComValue(value) {
            // console.log('组件传值成功：', value);
            this.attack_type = value,
            console.log('attack_type=',this.attack_type)
        }
    }
}
</script>
<!-- <style  scoped> -->
<style lang="scss" scoped>
@import '../assets/css/index.scss'; 
// .ant-layout{
//     background-color: #F3F7FF;
// }

.ant-layout-header{
    height: 284px;
}

.llm_nav{
    height: 284px !important; 
    width: 100% !important;
}
.llm_nav >>> .pro_des {
    width: 100%;
    height: 216px;
    background-size: 100%;
    background-image: url('~@/assets/img/llm_bg.png');
}

.llm_nav >>> .pro_des .product_text {
    display: none;
}

.nav_title {
    position: absolute;
    top: 8%;
    width: 100%;
    height: 20%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
}
// .llm_nav >>> .pro_des .product_text p {
//     display: none;
// }

.title_block {
    width: 50%;
    // background-color: aqua;

}
.info_block {
    width: 50%;
    // background-color: black;
    display: flex;
    justify-content: flex-start;
    flex-wrap: nowrap;
    gap: 7%;
}

.info_unit {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
}

.nav_title_text {
    color: #FFF;
    font-family: MiSans;
    font-size: 30px;
    font-style: normal;
    font-weight: 600;
    // width: 5%;
    text-align: center;
}

.info_top {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: baseline;
}

.info_text1 {
    color: var(--gray-8, #FFF);
    font-family: MiSans;
    font-size: 60px;
    font-style: normal;
    font-weight: 600;
    line-height: 68px; /* 113.333% */
    padding: 0 10px;
}
.info_text2 {
    color: var(--gray-8, #FFF);
    font-family: MiSans;
    font-size: 24px;
    font-style: normal;
    font-weight: 380;
    line-height: 52px; /* 216.667% */
}

.info_text3 {
    color: var(--gray-8, #FFF);
    font-family: MiSans;
    font-size: 20px;
    font-style: normal;
    font-weight: 380;
    line-height: 24px; /* 120% */
    }


.tableHiddle {
    display: none !important;
}
.tableShow{
    display: revert !important;
}

.ant-layout-footer {
    display: none;
}
</style>