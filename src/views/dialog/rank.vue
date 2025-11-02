<template>
    <div class="body">
        <!-- 表头：筛选 -->
        <!-- <div class="table ">
            <div class="ratio_group">
                <span class="ratio_title"> 攻击方法 </span>
                <a-radio-group  v-for="(item, index) in options_atk" :key="index" v-model="value_atk" @change="onChangeAtk" button-style="solid">
                    <a-radio-button :value="item.value">{{ item.label }}</a-radio-button>
                </a-radio-group>
            </div>
            <div class="ratio_group">
                <span class="ratio_title"> 展示方式 </span>
                <a-radio-group v-for="(item, index) in options_show" :key="index" v-model="value_show" @change="onChangeShow" button-style="solid">
                    <a-radio-button :value="item.value">{{ item.label }}</a-radio-button>
                </a-radio-group>
            </div>
        </div> -->
        <!-- <div class="table" >
            <a-form class="ratio_group" v-for="(item, label) in form_data" :key="label">
                <a-form-item :label="item.label" :label-col="{span: 1}" :wrapper-col="{span: 10}" :colon="false" >
                    <a-radio-group v-for="(it, i) in item.data" :key="i" >
                        <a-radio-button :value="i" @click="handleFormChange" :checked="true"> {{ it }} </a-radio-button>
                    </a-radio-group>
                </a-form-item>
            </a-form>  
        </div> -->
        <!-- 表体：数据列表 -->
        <div v-if="value_show=='List'" class="table table_title" >
            <p class="title_text">排行榜</p>
            <!-- <p>*注：Acc为无/有对抗攻击下的任务准确率，其中Nor Attack指无对抗攻击下的任务准确率、UT Acc指Universal Triggers攻击下的任务准确率，GCG Acc指Greedy Coordinate Gradient攻击下任务准确率。</p> -->
            <!-- <a-table :columns="colunm_data" :data-source="sheet_data"  :scroll="{x:'120%'}" :bordered="true" @change="handleChange" /> -->
            <p style="text-align: left;">*注：从字符级别、单词级别、句子级别3个攻击维度，采用TextBugger、TextFooler等4种对抗攻击方法对17个主流开源大语言模型在初等数学、逻辑运算等57个主题任务上进行了全面的鲁棒性评估，模型规模超亿级。评估结果如上表所示，这些大模型的准确率平均下降了8.8%，反映出大模型在不同程度上存在鲁棒性不足和对微小输入变化的敏感性较强的问题。</p>
            <a-table :columns="colunm_data" :data-source="sheet_data" :bordered="true" @change="handleChange" />
            
        </div>
        <!-- 表体：柱状图 -->
        <div v-if="value_show=='Echart'" class="table" style="height: 74%;"> 暂未确认形式
            <div class="echart" id="rank_bar"></div>
            <!-- <div>{{ sheet_data }}</div> -->
        </div>
    </div>
</template>
<script>
import { Draw_LM_Rank } from "../../assets/js/drawEcharts.js"
export default {
    props:{
        sheet_data: Array,
        colunm_data: Array,
    },
    components:{
        // MathJax,
        Draw_LM_Rank
    },
    data() {
        return {
            value_atk: 'all',
            value_show: "List",
            filteredInfo: null,
            sortedInfo: null,
            options_atk: [
                {label:'All Attack', value: "all"},
                {label: 'Universal Triggers', value: 'ut'},
                {label: 'Greedy Coordinate Gradient', value: 'gcg'},
            ],
            options_show: [
                {label:'列表', value: "List"},
                {label: '柱状图', value: 'Echart'},
            ],
            form_data: [
                // {'label':'攻击方法', 'data': ['Universal Triggers', 'Greedy Coordinate Gradient']},
                // {'label':'数据集', 'data': ['SST-2', 'SNLI', 'BoolQ', 'MMLU']},
                {'label':'展示方式', 'data': ['列表', '柱状图']},],
        };
    },
    created() {
        document.title = '大模型排行榜';
        },
    methods: {
        onChangeAtk(e) {
            this.value_atk = e.target.value;
            // console.log(`checked = ${e.target.value}`);
            this.$emit('listen_com',e.target.value);
            // console.log(this.colunm_data);
        },
        onChangeShow(e) {
            this.value_show = e.target.value;
            console.log(`checked = ${e.target.value}`);
            // if(e.target.value == 'Echart'){
            //     // 表格展示方式暂未确定
            //     let x = ['SST-2', 'SNLI', 'BoolQ', 'MMLU'];
            //     let legend = ['Nor', 'UT', 'GCG'];
            //     let y1 = [1, 2, 3, 4];
            //     let y2 = [10, 10, 13, 12];
            //     let y3 = [40, 40, 30, 50];
            //     let data = [
            //         {
            //         name: 'Nor',
            //         type: 'bar',
            //         tooltip: {
            //         valueFormatter: function (value) {
            //             return value + ' %';
            //         }
            //         },
            //         data: y1
            //     },
            //     {
            //         name: 'UT',
            //         type: 'bar',
            //         tooltip: {
            //         valueFormatter: function (value) {
            //             return value + ' %';
            //         }
            //         },
            //         data: y2
            //     },
            //     {
            //         name: 'GCG',
            //         type: 'bar',
            //         tooltip: {
            //         valueFormatter: function (value) {
            //             return value + ' %';
            //         }
            //         },
            //         data: y3
            //     }
            //     ]
            //     Draw_LM_Rank('rank_bar', legend, x, data);
            // }
        },
        handleFormChange(e) {
            // 筛选功能
            console.log(e.checked);
        },
        handleChange(pagination, filters, sorter) {
            console.log('Various parameters', pagination, filters, sorter);
            this.filteredInfo = filters;
            this.sortedInfo = sorter;
        },
    },
};
</script>
<style scoped>
.body{
    position: absolute;
    height: -webkit-fill-available;
    width: 100%;
    background-color: #f3f7ff;
    scrollbar-width: thin;
}

.table {
    width: 98%;
    height: max-content;
    margin: 1%;
    padding: 1%;
    background-color: white;
}

.echart {
    /* width: 70%; */
    height: 100%;
    margin: auto;
}

/* .ant-table table{
    border-spacing: 1ch;
} */
.ant-radio {
    display: none;
  }

.ant-table td { 
    white-space: nowrap; 
}

.table_title{
    display: flex;
    padding: 20px 24px 24px 24px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 8px;
}

.title_text{
    color: #000;
    font-family: MiSans;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 32px; /* 133.333% */
}

.ratio_group{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: baseline;
    width: 100%;
    padding: 0.2% 0;
}

.ratio_title {
    color: #000;
    font-family: MiSans;
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    width: 5%;
    text-align: left;
}


.ant-form-item {
  margin-bottom: 0.2%;
  padding: 0.1% 0;
}

.ant-form-item label {
    /* position: relative; */
    text-align: left  !important;
    float: left;
}

/* ::-webkit-scrollbar {
  width: 10px;
} */

/* 
.ant-form-item-control {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

/* label样式 */
/* 
.ant-form-item-label {
  color: #000;
  font-family: MiSans;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  width: 5%;
  text-align: left;
} */
.ant-table {
    padding: 2px 24px;
    color: #000;
    font-family: MiSans;
    font-size: 14px;
    font-style: normal;
    font-weight: 380;
    line-height: 22px; 
}


/* .ant-table-body  ::-webkit-scrollbar {
    height: 12px;
    width: 0px; 
    overflow-y: auto;
} */




.table-operations {
margin-bottom: 16px;
}

.table-operations > button {
margin-right: 8px;
}
</style>
  