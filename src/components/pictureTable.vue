<template>
    <div :id="tableId">
        <!-- 表格 -->
        <a-row>
            <a-col v-for="(rows, row_index) in content" :key="row_index">
                <!-- entity: 可以是图片的src, 也可以是文字 -->
                <div style="display:flex; justify-content: center; align-items: center;">
                    <template v-for="(entity, col_index) in rows" >
                        <!-- 表头 表头只能是文字-->
                        <div v-if="headerRow && header && row_index == 0" class="border-box"
                            :id="tableId + '_' + 'border' + '_' + row_index + '_' + col_index" style="height: 70px;"
                            :style="{
                                width: colWidth[col_index],
                                'border-right':
                                    haveBorder && col_index == rows.length - 1 ? '1px solid #d1d3d7' : '',
                            }">
                            <div v-if="typeof(entity)=='string'" class="header center-horizen"
                                style="display:flex; justify-content: center; align-items: center;">
                                {{ entity }}
                            </div>
                            <div v-else class="header center-horizen" 
                            style="display:flex; justify-content: center; align-items: center;">{{entity[0]}}
                                <a-popover trigger="click" >
                                    <template slot="content" >
                                        <p>{{entity[1]}}</p>
                                    </template>
                                    <a-icon  type="question-circle" />
                                </a-popover>
                            </div>
                        </div>
                        <!-- 表格内容 -->
                        <div v-if="!header || row_index != 0" class="border-box"
                            :id="tableId + '_' + 'border' + '_' + row_index + '_' + col_index" :style="{
                                width: colWidth[col_index],
                                height: cellHeight,
                                'border-right':
                                    haveBorder && col_index == rows.length - 1 ? '1px solid #d1d3d7' : '',
                                'border-bottom':
                                    haveBorder && row_index == content.length - 1 ? '1px solid #d1d3d7' : '',
                            }">
                            <!-- 首列 存在于有表头的情况 列首也只能是文字-->
                            <template v-if="header &&headerColumn&& col_index == 0">
                                <div class="text-cotent center-horizen"
                                    style="display:flex; justify-content: center; align-items: center;width: 150px;"
                                    :style="{  height: cellHeight }">
                                    <p class="wrap">{{ entity }}</p>
                                    
                                </div>
                            </template>
                            <!-- 实际的内容 -->
                            <template v-if="!header || col_index != 0||!headerColumn">
                                <!-- 文字类型 -->
                                <div v-if="entity[1] == 'text'" class="text-content center-horizen"
                                    style="display:flex; justify-content: center; align-items: center;"
                                    :style="{ width: pixModify(colWidth[col_index], -10), height: cellHeight }">
                                    <p >{{ entity[0] }}</p>
                                </div>
                                <!-- button类型 -->
                                <div v-if="entity[1] == 'download'" class="text-content center-horizen"
                                    style="display:flex; justify-content: center; align-items: center;"
                                    :style="{ width: pixModify(colWidth[col_index], -10), height: cellHeight }">
                                    <button @click="downloadData(entity[0])" ><a-icon type="download" />下载</button>
                                </div>
                                <!-- 图片类型 -->
                                <img @error="noExistImg" v-if="entity[1] == 'pic'" :id="tableId + '_' + row_index + '_' + col_index"
                                    class="picture" :src="entity[0]" style="
                                                left: 50%;
                                                top: 50%;
                                                transform: translate(-50%, -50%);
                                                position: relative;
                                                " @click="
                                                    pictureClick(tableId + '_' + row_index + '_' + col_index)
                                                "
                                    :style="{ width: pixModify(cellHeight, -30), height: pixModify(cellHeight, -30) }" />
                                <!-- 图片有图注类型 -->
                                <div v-if="entity[1] == 'picWithText'" style="
                                                left: 50%;
                                                top: 50%;
                                                transform: translate(-50%, -50%);
                                                position: relative;
                                                text-align: center;
                                                ">
                                    <img @error="noExistImg" v-if="entity[1] == 'picWithText'" :id="tableId + '_' + row_index + '_' + col_index"
                                        class="picture" :src="entity[0][0]" @click="
                                            pictureClick(tableId + '_' + row_index + '_' + col_index)"
                                        :style="{ width: pixModify(cellHeight, -30), height: pixModify(cellHeight, -30) }" />

                                    <p v-if="entity[1] == 'picWithText'" style="text-align: center;">{{ entity[0][1] }}</p>
                                </div>
                                <!-- 图表类型 -->
                                <!-- 折线图 -->
                                <LinearChart v-if="entity[1] == 'lineChart'"
                                    :id="tableId + '_' + row_index + '_' + col_index" class="chart-content" style="
                                                left: 50%;
                                                top: 50%;
                                                transform: translate(-50%, -50%);
                                                position: relative;
                                                "
                                    :style="{ width: pixModify(cellHeight, -30), height: pixModify(cellHeight, -30) }"
                                    :refreshWidth.sync="chartRefresh"></LinearChart>
                                <!-- 散点图 -->
                                <ScatterChart v-if="entity[1] == 'scatterChart'" :inputData="entity[0]"
                                    :id="tableId + '_' + row_index + '_' + col_index" class="chart-content" style="
                                                left: 50%;
                                                top: 50%;
                                                transform: translate(-50%, -50%);
                                                position: relative;
                                                "
                                    :style="{ width: pixModify(cellHeight, -30), height: pixModify(cellHeight, -30) }"
                                    :refreshWidth.sync="chartRefresh"></ScatterChart>
                                <!-- 散点图 -->
                                <HistogramChart v-if="entity[1] == 'HistogramChart'" :inputData="entity[0]"
                                    :id="tableId + '_' + row_index + '_' + col_index" class="chart-content" style="
                                                left: 50%;
                                                top: 50%;
                                                transform: translate(-50%, -50%);
                                                position: relative;
                                                "
                                    :style="{ width: pixModify(cellHeight, -30), height: pixModify(cellHeight, -30) }"
                                    :refreshWidth.sync="chartRefresh"></HistogramChart>    
                            </template>
                        </div>
                    </template>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import LinearChart from "./charts/LinearCharts.vue";
import ScatterChart from "./charts/ScatterChart.vue";
import HistogramChart from "./charts/HistogramChart.vue";
import errorImg from "../assets/img/errorimg.svg"
export default {
    props: {
       
        tableId: {
            type: String,
            default: Math.random().toString()
        },
        header: {
            type: Boolean,
            default: true
        },
        headerRow: {
            type: Boolean,
            default: true //true就是保留首行的header
        },
        headerColumn: {
            type: Boolean,
            default: true //true就是保留首列的header
        },
        content: {
            type: Array,
            default: () => [
                ["0", "1", "2", "3", "4"],
                ["M1", [require("@/assets/img/logo.png"), "pic"], [require("@/assets/img/logo.png"), "pic"], [require("@/assets/img/logo.png"), "pic"], [require("@/assets/img/logo.png"), "pic"]],
                ["M2", [require("@/assets/img/logo.png"), "pic"], [require("@/assets/img/logo.png"), "pic"], [require("@/assets/img/logo.png"), "pic"], [require("@/assets/img/logo.png"), "pic"]],
                ["M3", [require("@/assets/img/logo.png"), "pic"], [require("@/assets/img/logo.png"), "pic"], [require("@/assets/img/logo.png"), "pic"], [require("@/assets/img/logo.png"), "pic"]]
            ]
        },
        singleOutput: {
            type: Boolean,
            default: false
        },
        selectedAble: {
            type: Boolean,
            default: true
        },
        haveBorder: {
            type: Boolean,
            default: true
        },
        cellWidth: {
            type: Array,
            default: () => [0.12, 0.22, 0.22, 0.22, 0.22]
        },
        cellHeight: {
            type: String,
            default: "120px"
        },
        selectedPicutre: {
            type:Array,
            default:() => []
        }
    },
    components: {
        LinearChart,
        ScatterChart,
        HistogramChart
    },
    data() {
        return {
            errorImg:errorImg,
            chartRefresh: "190px",
            selectPicList: [],
            colWidth: [],
        }
    },
    mounted() {
        if (!this.haveBorder) {
            for (var i = 0; i < this.content.length; i++) {
                let columns = this.content[i]
                for (var j = 0; j < columns.length; j++) {
                    let boxBorder = document.getElementById(this.tableId + "_" + "border" + "_" + i + "_" + j)
                    boxBorder.style.border = "0px"
                    let height = boxBorder.style.height
                    boxBorder.style.width = "210px"
                    if (height != "70px") { // 不是表头数据
                        boxBorder.style.height = "210px"
                    }
                }
            }
        }
        console.log(this.content)
        // 处理图像数据
        for (var i in this.content) {
            if (this.header && i == 0) continue
            for (var j in this.content[i]) {
                if (this.header && j == 0) continue
                if (this.content[i][j][1].includes("Chart")) {
                    // 这个变化是用来触发图的刷新的 不然图不会刷新
                    this.chartRefresh = this.pixModify(this.cellHeight, -30)
                }
            }
        }
    },
    methods: {
        downloadData(path){
            debugger
            if (confirm("您确认下载生成测试样本？") ) {
                let param = new FormData();       // 创建form对象    
                let file = path
                param.append('file', file);       // 通过append向form对象添加数据
                param.append("type", 'dictionary'); // 添加form表单中其他数据
                let post_file = param;
                let config = {
                    headers: {'Content-Type': 'multipart/form-data'},
                    responseType: "blob"
                };
                this.$axios.post("/Task/DownloadData", post_file, config).then((res)=>{
                    console.log(res);
                    var zipName = "download"; // 下载的文件名
                    // let blob = new Blob([res.data], { type: "application/zip" }); // 下载格式为zip
                    let blob = new Blob([res.data], { type: "application/octet-stream" });
                    if ("download" in document.createElement("a")) {
                        let elink = document.createElement("a"); // 创建一个<a>标签
                        elink.style.display = "none"; // 隐藏标签
                        elink.href = window.URL.createObjectURL(blob); // 配置href
                        elink.download = zipName;
                        elink.click();
                        URL.revokeObjectURL(elink.href); // 释放URL 对象
                        document.body.removeChild(elink); // 移除<a>标签
                    } else {
                    //IE10+
                    navigator.msSaveBlob(blob, zipName);
                    }
                }).catch((err)=>{
                    console.log(err)
                })
            }
        },
        noExistImg(e){
            // debugger
            e.target.src=this.errorImg;
        },
        pixModify(origin, delta) {
            let target = "0px"
            if (typeof (origin) == typeof ("") && typeof (delta) == typeof (0)) {
                target = parseInt(origin.replace("px", "")) + delta + "px"
            }
            return target
        },
        pictureClick(clickId) {
            // debugger
            if (this.singleOutput && this.selectedPicutre && this.selectedPicutre.length == 1) {
                if (clickId != this.selectedPicutre[0]) {
                    let picture = document.getElementById(this.selectedPicutre[0])
                    picture.classList.remove("selected")
                    this.selectedPicutre[0] = clickId;
                }
            } else {
                if (this.selectedPicutre && !this.selectedPicutre.includes(clickId)) this.selectedPicutre.push(clickId)
            }

            if (this.selectedPicutre) {
                for (var i = 0; i < this.selectedPicutre.length; i++) {
                    let id = this.selectedPicutre[i]
                    let picture = document.getElementById(id)
                    if (id == clickId && picture.classList.contains("selected") && this.selectedAble) {
                        picture.classList.remove("selected")
                        this.selectedPicutre.splice(this.selectedPicutre.findIndex((e) => e == clickId), 1)
                    } else if (!picture.classList.contains("selected") && this.selectedAble) {
                        picture.classList.add("selected")
                    }
                }
            }

            if (this.selectedPicutre && this.selectedPicutre.length != 0) {
                let indexInfo = []
                for (var i in this.selectedPicutre) {
                    let index = this.selectedPicutre[i].split("_")
                    indexInfo.push([parseInt(index[1]), parseInt(index[2])])
                }
                this.$emit("pictureSelect", indexInfo)
            }
        }
    },
    watch: {
        content: {
            handler() {
                // 处理每一列的长度和宽度
                // debugger
                const tableLen = parseInt(document.getElementById(this.tableId).style.width.replace("px", ""))
                for (var i in this.cellWidth) {
                    this.colWidth.push((this.cellWidth[i] * tableLen - 2) + "px")
                    if (this.content.length >= 1) {
                        if (this.content[1][i] && this.content[1][i].length == 2 && this.content[1][i][1] == "pic") { // 图片类型
                            this.$emit("changeCellHeight",this.colWidth[i])
                        }
                        if (this.content[1][i] && this.content[1][i].length == 2 && this.content[1][i][1] == "picWithText") { // 图片类型
                            // this.cellHeight = this.colWidth[i]
                            this.$emit("changeCellHeight",this.colWidth[i])
                        }
                    }
                }
            }
        }
    }
}

</script>


<style scoped>
.picture {
    width: 200px;
    height: 200px;
    border: 0px;
}

.picture:hover {
    border: 5px solid rgb(141, 139, 139);
}

.selected,
.selected:hover {
    border: 5px solid #0B55F4;
    background: var(--bule-7, #E7F0FD);
    width: 190px;
    height: 190px;
    /* margin-left: 10px;
    margin-right: 10px; */
}

.header {
    width: 100%;
    height: 70px;
    text-align: center;
    background-color: #F2F4F9;
    color: rgba(0, 0, 0, 0.90);
    text-align: center;
    font-family: HONOR Sans CN;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
}

.chart-content {
    width: 200px;
    height: 200px;
}

.text-cotent {
    width: 200px;
    height: 200px;
}

.border-box {
    width: 960px;
    height: 230px;
    border: 1px solid #d1d3d7;
}

.center-vertical {
    top: 50%;
    position: relative;
    transform: translate(0%, -50%);
}
.wrap{
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-wrap;
}
.center-horizen {
    left: 50%;
    position: relative;
    transform: translate(-50%, 0%);
}
</style>