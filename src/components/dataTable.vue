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


.colname{
    width: 180px;
    height: 40px;
    padding: 9px 20px;
    /* display: flex;
    flex-direction: column; */
    align-items: flex-start;
    box-sizing: border-box;
    font-family: 'Microsoft YaHei';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    text-align: left;
    color: #3E4453;
    background: #F2F4F9;
    border: 1px solid #E0E3EB;
}
.colvalue{
    box-sizing: border-box;
    /* display: flex;
    flex-direction: column; */
    align-items: flex-start;
    padding: 9px 20px;
    width: 180px;
    height: 40px;
    background: #FFFFFF;
    border: 1px solid #E0E3EB;
    font-family: 'Microsoft YaHei';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    text-align: left;
    color: #000000;
}
/* .dataInfo{
    margin: 0 73px;
} */

</style>