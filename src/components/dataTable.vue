<template>
    <div class="dataInfo">
        <table>
            <tbody >
                <tr v-for="i in Math.ceil(tabledata.length/3)" :key="i" >
                    
                    <td class="colname" v-if="(i-1)*3 < tabledata.length">{{ tabledata[(i-1)*3].name }}：</td>
                    <td class="colvalue" v-if="(i-1)*3 < tabledata.length">{{ tabledata[(i-1)*3].value }}</td>
                    <td class="colname" v-if="(i-1)*3+1 < tabledata.length">{{ tabledata[(i-1)*3+1].name }}：</td>
                    <td class="colvalue" v-if="(i-1)*3+1 < tabledata.length">{{ tabledata[(i-1)*3+1].value }}</td>
                    <td class="colname" v-if="(i-1)*3+2 < tabledata.length">{{ tabledata[(i-1)*3+2].name }}：</td>
                    <td class="colvalue" v-if="(i-1)*3+2 < tabledata.length">{{ tabledata[(i-1)*3+2].value }}</td>
                </tr>
            </tbody>
            
        </table>
        <!-- <table>
            <thead>
                <tr>
                    <th class="colname" width="50px">序号</th>
                    <th class="colname" :width="item.width" v-for="(item,index) in  tableheader" :key="index">
                    {{ item.title }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row,num) in tabledata">
                <td> {{ num+1 }}</td>
                <td v-for="(key,Ind) in tableheader">
                {{ row[key.indexname] }}
                </td>
                </tr>
            </tbody>
        </table> -->
    </div>
</template>

<script>


export default {
    name:"datatable",
    props:["tabledata"],
    data(){
        return{
            j:0,
        }
    }
}
</script>
<style>
.dataInfo{
    margin-bottom: 15px;
}

.colname{
    height:48px;
    width: 180px;
    font-family: PingFangSC-Semibold;
    font-size: 18px;
    color: #f1f1f1;
    letter-spacing: 0;
    line-height: 36px;
    font-weight: 400;
    text-align: center;
    background-color: rgba(81,150,255,1);
    border: 2px solid #c7c5c58e;;
}
.colvalue{
    width: 180px;
    text-align: center;
    border: 2px solid #c7c5c58e;
    font-size: 16px;
    font-family: PingFangSC-Semibold;
    line-height: 36px;
    font-weight: 400;
}
/* .dataInfo{
    margin: 0 73px;
} */

</style>