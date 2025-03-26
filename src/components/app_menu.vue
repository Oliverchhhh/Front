<template>
    <div class="hold">
        <a-divider style="border-color: #7cb305" dashed />
        <div class="box-container">
            <div class="funcs">
                <ifreme @click.native="goFuncPage('/advAttackDefense')">
                    <div slot="func_icon">
                        <img class="icon_img" src="../assets/img/advDefenseIcon.png">
                    </div>
                    <div slot="header" class="func_name">对抗攻击防御</div>
                    <div slot="des_func" class="func_des">从对抗样本检测、对抗噪声擦除和模型防御力增强等三个角度阻截对抗样本的攻击，并使神经网络模型在面对对抗样本时仍能发挥正常功能</div>
                </ifreme>
                <ifreme @click.native="goFuncPage('/backdoorDefense')">
                    <div slot="func_icon">
                        <img class="icon_img" src="../assets/img/bkDefenseIcon.png">
                    </div>
                    <div slot="header" class="func_name">后门攻击防御</div>
                    <div slot="des_func" class="func_des">后门攻击防御包括后门检测和后门逆向，力求做到发现后门并还原后门的效果，使后门攻击的威胁大大降低</div>
                </ifreme>
            </div>
        </div>
    </div>
</template>

<script>
import ifreme_chart from './ifreme.vue';
export default {
    name: "app_menu",
    components: {
        ifreme: ifreme_chart
    },
    methods: {
        goFuncPage(path) {
            if (path == '') {
                this.$message.warning('功能开发中，敬请期待！', 3);
            } else {
                this.$router.push(path);
            }
        }
    }
}
</script>

<style scoped>
/* 复用 eva_menu.vue 的样式 */
.ant-layout-content {
    background-color: #F5F8FF;
}

.hold {
    width: 100%;
    margin: 0 auto;
}

/* 调整功能卡片的居中 */
.funcs {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-content: flex-start;
    gap: 10px;
    margin: 10px 0;
}

.func_name {
    font-family: HONOR Sans CN;
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    letter-spacing: 0px;
    text-align: left;
    margin-left: 5%;
}

.func_des {
    font-family: HONOR Sans CN;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0px;
    text-align: left;
    margin: 1% 5% 5% 5%;
}

.icon_img {
    width: 68px;
    height: 68px;
}

.box-container {
    display: flex;
    justify-content: space-around;
    margin-bottom: 30px;
    padding: 0 20px;
}
</style> 