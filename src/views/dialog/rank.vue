<template>
    <div class="body">
        <!-- 表头：筛选 -->
        <div class="table" >
            <!-- <div class="ratio_group" v-for="(item, label) in form_data" :key="label"> 
                <rankheader :inputLabel="item.label" :inputData="item.data" @listen="getValue"></rankheader>
            </div> -->
            <!-- <div class="ratio_group" > 
                <a-form v-for="(item, label) in form_data" :key="label">
                    <a-form-item :label="item.label" :label-col="{span: 1}" :wrapper-col="{span: 10}" :colon="false" >
                        <a-radio-group v-for="it in item.data" :key="it.id" @change="handleFormChange">
                            <a-radio-button :value="it"> {{ it }} </a-radio-button>
                        </a-radio-group>
                    </a-form-item>
                </a-form>  
            </div> -->
            <a-form class="ratio_group" v-for="(item, label) in form_data" :key="label">
                <a-form-item :label="item.label" :label-col="{span: 1}" :wrapper-col="{span: 10}" :colon="false" >
                    <a-radio-group v-for="it in item.data" :key="it.id" @change="handleFormChange">
                        <a-radio-button :value="it"> {{ it }} </a-radio-button>
                    </a-radio-group>
                </a-form-item>
            </a-form>  
        </div>
        <!-- 表体：数据列表 -->
        <div class="table" >
            <div class=""></div>
            <a-table :columns="columns" :data-source="data" @change="handleChange" />
        </div>
        <!-- 表体：柱状图 -->
        <div class="table">
            
        </div>
    </div>
</template>
<script>
const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
    },
    {
        key: '4',
        name: 'Jim Red',
        age: 32,
        address: 'London No. 2 Lake Park',
    },
    ];

export default {
    props:{
        sheet_data: Array,
        colunm_data: Array,
    },
    data() {
        return {
            data,
            filteredInfo: null,
            sortedInfo: null,
            form_data: [
                {'label':'攻击方法', 'data': ['Universal Triggers', 'LLM Attack']},
                {'label':'数据集', 'data': ['SST-2', 'SNLI', 'BoolQ', 'MMLU']},
                {'label':'展示方式', 'data': ['列表', '柱状图']},],
        };
    },
    computed: {
        columns() {
        let { sortedInfo, filteredInfo } = this;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        const columns = [
            {

            },

            {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            filters: [
                { text: 'Joe', value: 'Joe' },
                { text: 'Jim', value: 'Jim' },
            ],
            filteredValue: filteredInfo.name || null,
            onFilter: (value, record) => record.name.includes(value),
            sorter: (a, b) => a.name.length - b.name.length,
            sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
            ellipsis: true,
            },
            {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            sorter: (a, b) => a.age - b.age,
            sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
            },
            {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            filters: [
                { text: 'London', value: 'London' },
                { text: 'New York', value: 'New York' },
            ],
            filteredValue: filteredInfo.address || null,
            onFilter: (value, record) => record.address.includes(value),
            sorter: (a, b) => a.address.length - b.address.length,
            sortOrder: sortedInfo.columnKey === 'address' && sortedInfo.order,
            ellipsis: true,
            },
        ];
        return columns;
        },
    },
    methods: {
        getValue(msg){
            console.log('get value:', msg)
        },
        handleFormChange(e) {
            console.log(e.target.value);
            this.$emit('listen', e.target.value);
        },
        handleChange(pagination, filters, sorter) {
            console.log('Various parameters', pagination, filters, sorter);
            this.filteredInfo = filters;
            this.sortedInfo = sorter;
        },
        clearFilters() {
            this.filteredInfo = null;
        },
        clearAll() {
            this.filteredInfo = null;
            this.sortedInfo = null;
        },
        setAgeSort() {
            this.sortedInfo = {
            order: 'descend',
            columnKey: 'age',
            };
        },
    },
};
</script>
<style scoped>
.body{
    position: absolute;
    height: -webkit-fill-available;
    background-color: #f3f7ff;
}

.table {
    width: 98%;
    height: max-content;
    margin: 1%;
    padding: 1%;
    background-color: white;
}

.ratio_group{
    color: #000;
    font-family: MiSans;
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    /* width: 5%; */
    text-align: left;
}

.ant-form-item {
  margin-bottom: 0.2%;
  padding: 0.1% 0;
}

.ant-form-item-label > label  {
    /* position: relative; */
    text-align: left  !important;
    float: left;
}

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

.table-operations {
margin-bottom: 16px;
}

.table-operations > button {
margin-right: 8px;
}
</style>
  