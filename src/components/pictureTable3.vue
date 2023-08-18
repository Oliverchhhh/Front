<template>
    <div :id="tableId">
        <!-- 表格 -->
        <el-row>
            <el-col v-for="(rows, row_index) in content">
                <!-- entity: 可以是图片的src, 也可以是文字 -->
                <div style="display:flex; justify-content: center; align-items: center;">
                    <template v-for="(entity, col_index) in rows">
                        <!-- 表头 表头只能是文字-->
                        <div v-if="header && row_index == 0" class="border-box"
                            :id="tableId + '_' + 'border' + '_' + row_index + '_' + col_index" style="height: 100px;"
                            :style="{ 'width': colWidth[col_index], 'border-right': haveBorder && col_index == rows.length - 1 ? '1px solid black' : '' }">
                            <div class="header center-horizen"
                                style="display:flex; justify-content: center; align-items: center;"> {{ entity }} </div>
                        </div>
                        <!-- 表格内容 -->
                        <div v-if="!header || row_index != 0" class="border-box"
                            :id="tableId + '_' + 'border' + '_' + row_index + '_' + col_index"
                            :style="{ 'width': colWidth[col_index], 'height': cellHeight, 'border-right': haveBorder && col_index == rows.length - 1 ? '1px solid black' : '', 'border-bottom': haveBorder && row_index == content.length - 1 ? '1px solid black' : '' }">
                            <!-- 首列 存在于有表头的情况 列首也只能是文字-->
                            <template v-if="header && col_index == 0">
                                <div class="text-cotent center-horizen"
                                    style="display:flex; justify-content: center; align-items: center;"
                                    :style="{ 'width': pixModify(colWidth[col_index], -10), 'height': cellHeight }">{{ entity
                                    }}</div>
                            </template>
                            <!-- 实际的内容 -->
                            <template v-if="!header || col_index != 0">
                                <!-- 文字类型 -->
                                <div v-if="entity[1] == 'text'" class="text-content center-horizen"
                                    style="display:flex; justify-content: center; align-items: center;"
                                    :style="{ 'width': pixModify(colWidth[col_index], -10), 'height': cellHeight }">
                                    <p>{{ entity[0] }}</p>
                                </div>
                                <!-- 图片类型 -->
                                <img v-if="entity[1] == 'pic'" :id="tableId + '_' + row_index + '_' + col_index" class="picture"
                                    :src="entity[0]"
                                    style="left: 50%; top: 50%; transform: translate(-50%, -50%); position: relative;"
                                    @click="pictureClick(tableId + '_' + row_index + '_' + col_index)"
                                    :style="{ 'width': pixModify(cellHeight, -30), 'height': pixModify(cellHeight, -30) }">
                                <!-- 图表类型 -->
                                <!-- 折线图 -->
                                <LinearChart v-if="entity[1] == 'lineChart'" :id="tableId + '_' + row_index + '_' + col_index"
                                    class="chart-content"
                                    style="left: 50%; top: 50%; transform: translate(-50%, -50%); position: relative;"
                                    :style="{ 'width': pixModify(cellHeight, -30), 'height': pixModify(cellHeight, -30) }"
                                    :refresh-width="chartRefresh"></LinearChart>
                            </template>
                        </div>
                    </template>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
  
<script setup>
import { onMounted, ref, onUpdated } from 'vue';
import LinearChart from './charts/LinearChart.vue';

const props = defineProps({
    tableId: {
        type: String,
        default: Math.random().toString()
    },
    header: {
        type: Boolean,
        default: true
    },
    content: {
        type: Array,
        default: [
            ["0", "1", "2", "3", "4"],
            ["M1", [new URL("@/assets/Lena.png", import.meta.url).href, "pic"], [new URL("@/assets/Lena.png", import.meta.url).href, "pic"], [new URL("@/assets/Lena.png", import.meta.url).href, "pic"], [new URL("@/assets/Lena.png", import.meta.url).href, "pic"]],
            ["M2", [new URL("@/assets/Lena.png", import.meta.url).href, "pic"], [new URL("@/assets/Lena.png", import.meta.url).href, "pic"], [new URL("@/assets/Lena.png", import.meta.url).href, "pic"], [new URL("@/assets/Lena.png", import.meta.url).href, "pic"]],
            ["M3", [new URL("@/assets/Lena.png", import.meta.url).href, "pic"], [new URL("@/assets/Lena.png", import.meta.url).href, "pic"], [new URL("@/assets/Lena.png", import.meta.url).href, "pic"], [new URL("@/assets/Lena.png", import.meta.url).href, "pic"]]
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
        default: [0.1, 0.2, 0.3, 0.2, 0.2]
    }
})

const emit = defineEmits(['pictureSelect'])


const chartRefresh = ref("200px")

const colWidth = ref([]) // 单元格的宽度
const cellHeight = ref("0px") // 单元格的高度
// defineExpose({
//   "21312":cellHeight.value,
// })
onMounted(() => {
    if (!props.haveBorder) {
        for (var i = 0; i < props.content.length; i++) {
            let columns = props.content[i]
            for (var j = 0; j < columns.length; j++) {
                let boxBorder = document.getElementById(props.tableId + "_" + "border" + "_" + i + "_" + j)
                boxBorder.style.border = "0px"
                let height = boxBorder.style.height
                boxBorder.style.width = "210px"
                if (height != "100px") { // 不是表头数据
                    boxBorder.style.height = "210px"
                }
            }
        }
    }

    // 处理每一列的长度和宽度
    const tableLen = parseInt(document.getElementById(props.tableId).style.width.replace("px", ""))
    for (var i in props.cellWidth) {
        colWidth.value.push((props.cellWidth[i] * tableLen - 2) + "px")
        if (props.content.length >= 1) {
            if (props.content[1][i].length == 2 && props.content[1][i][1] == "pic") { // 图片类型
                cellHeight.value = colWidth.value[i]
            }
        }
    }

    // 处理图像数据
    for (var i in props.content) {
        if (props.header && i == 0) continue
        for (var j in props.content[i]) {
            if (props.header && j == 0) continue
            if (props.content[i][j][1].includes("Chart")) {
                // 这个变化是用来触发图的刷新的 不然图不会刷新
                chartRefresh.value = pixModify(cellHeight.value, -30)
            }
        }
    }
})

// 这个函数是用来修改px大小的
const pixModify = (origin, delta) => {
    let target = "0px"
    if (typeof (origin) == typeof ("") && typeof (delta) == typeof (0)) {
        target = parseInt(origin.replace("px", "")) + delta + "px"
    }
    return target
}

// 图片点击
const selectedPicutre = ref([])

const pictureClick = (clickId) => {
    if (props.singleOutput && selectedPicutre.value.length == 1) {
        if (clickId != selectedPicutre.value[0]) {
            let picture = document.getElementById(selectedPicutre.value[0])
            picture.classList.remove("selected")
            selectedPicutre.value[0] = clickId;
        }
    } else {
        if (!selectedPicutre.value.includes(clickId)) selectedPicutre.value.push(clickId)
    }

    for (var i = 0; i < selectedPicutre.value.length; i++) {
        let id = selectedPicutre.value[i]
        let picture = document.getElementById(id)
        if (id == clickId && picture.classList.contains("selected") && props.selectedAble) {
            picture.classList.remove("selected")
            selectedPicutre.value.splice(selectedPicutre.value.findIndex((e) => e == clickId), 1)
        } else if (!picture.classList.contains("selected") && props.selectedAble) {
            picture.classList.add("selected")
        }
    }

    if (selectedPicutre.value.length != 0) {
        let indexInfo = []
        for (var i in selectedPicutre.value) {
            let index = selectedPicutre.value[i].split("_")
            indexInfo.push([parseInt(index[1]), parseInt(index[2])])
        }
        emit("pictureSelect", indexInfo)
    }
};
</script>
  
<style scoped>
.picture {
    width: 200px;
    height: 200px;
    border: 0px;

    /* &:hover {
        border: 5px solid rgb(141, 139, 139);
    } */
}

.selected,
.selected:hover {
    border: 5px solid black;
    width: 190px;
    height: 190px;
    margin-left: 10px;
    margin-right: 10px;
}

.header {
    width: 100%;
    height: 100px;
    text-align: center;

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
    width: 230px;
    height: 230px;
    border-top: 1px solid black;
    border-left: 1px solid black;
}

.center-vertical {
    top: 50%;
    position: relative;
    transform: translate(0%, -50%);
}

.center-horizen {
    left: 50%;
    position: relative;
    transform: translate(-50%, 0%);
}
</style>