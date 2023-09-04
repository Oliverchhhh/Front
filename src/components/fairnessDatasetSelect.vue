<template>
<div class="datasetselect">
    <p class="mainParamNameNotop"><select-icon :stlye="{width:'4px'}" />请选择数据集</p>
    <!-- 折叠面板 -->
    <template>
        <!-- 单选组件 选中哪个显示哪个数据集信息 -->
        <a-radio-group v-model="value"  @change="onChangeRadio($event,index)"   v-for="(temp,index) in dataname" :key="index">
            <a-radio :style="radioStyle" :value="index">
                {{ temp }}
            </a-radio>
            <!-- 数据集描述 -->
            <div class="datades"  v-show="labelshow[index]">
                <p class="bgInfo" style=" height: auto;"><a :href="datainfo[temp].href">{{ datainfo[temp].name }}</a>：{{ datainfo[temp].text }}</p>
                <datatable :tabledata="datainfo[temp].tabledata"></datatable>
                <p class="paramName"><select-icon :stlye="{width:'4px'}" />请选择敏感属性</p>
                <div>
                    <dataAttrTranfer :mockData="senMockData" :targetKeys="senTargetKeys" @clientTransfer="senClientTransfer"></dataAttrTranfer>
                </div>
                <p class="paramName"><select-icon :stlye="{width:'4px'}" />请选择目标属性</p>
                <div>
                    <dataAttrTranfer :mockData="tarMockData" :targetKeys="tarTargetKeys" @clientTransfer="tarClientTransfer"></dataAttrTranfer>
                </div>
                <p class="paramName"><select-icon :stlye="{width:'4px'}" />请选择统计属性</p>
                <div style="margin-bottom: 24px;">
                    <dataAttrTranfer :mockData="staMockData" :targetKeys="staTargetKeys" @clientTransfer="staClientTransfer"></dataAttrTranfer>
                </div>
            </div>
        </a-radio-group>
    </template>
</div>
</template>



<script>
    /* 引入组件，数据集表格 */
    import datatable from "../components/dataTable.vue"
    /* 引入组件，属性选择 */
    import dataAttrTranfer from "../components/dataAttrTranfer.vue"
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
    export default{
        name:"fairnessDataset",
        components:{
            /* 注册组件 */
            datatable:datatable,
            dataAttrTranfer:dataAttrTranfer,
            selectIcon,
            },
        props:{
            dataname:{
                default: () =>["German","Adult","Compas","Cifar10-S","CelebA"]},
        },
        data(){
                return{
                    labelshow:[true,false,false],
                /* 单选框默认选中 */
                
                value: 0,
                /* 单选按钮样式 */
                radioStyle: {
                    display: 'block',
                    lineHeight: '30px',
                },
                /* 每个数据集可选属性列表 type:sta--统计属性 tar--目标属性 sen--敏感属性 */
                dataAttrlist:{
                German:[
                {title:"status",description:"现有支票账户的状态 ",chosen:false,type:"sta"},
                {title:"month",description:"贷款期限（以月计） ",chosen:false,type:"sta"},
                {title:"credit_history",description:"以前的信用记录和信贷经验",chosen:false,type:"sta"},
                {title:"purpose",description:"申请贷款的原因 ",chosen:false,type:"sta"},
                {title:"credit_amount",description:"申请贷款的金额 ",chosen:true,type:"tar"},
                {title:"savings",description:"储蓄账户和债券的状态 ",chosen:false,type:"sta"},
                {title:"employment",description:"客户现在的工作时长 ",chosen:false,type:"sta"},
                {title:"investment_as_income_percentage",description:"分期付款所占收入的百分比 ",chosen:false,type:"sta"},
                {title:"personal_status",description:"客户的个人状况和性别 ",chosen:false,type:"sta"},
                {title:"sex",description:"客户的性别 ",chosen:false,type:"sen"},
                {title:"other_debtors",description:"是否有其他债务人或担保人 ",chosen:false,type:"sta"},
                {title:"residence_since",description:"客户现在的住址所在地的居住时长 ",chosen:false,type:"sta"},
                {title:"property",description:"客户的财产状况 ",chosen:false,type:"sta"},
                {title:"age",description:"客户的年龄 ",chosen:true,type:"sen"},
                {title:"installment_plans",description:"客户是否有其他分期付款计划 ",chosen:false,type:"sta"},
                {title:"housing",description:"客户的住房状况 ",chosen:false,type:"sta"},
                {title:"number_of_credits",description:"客户在该银行的现有信贷数量 ",chosen:false,type:"sta"},
                {title:"skill_level",description:"客户的职业 ",chosen:false,type:"tar"},
                {title:"people_liable_for",description:"客户需要供养的人数 ",chosen:false,type:"sta"},
                {title:"telephone",description:"客户是否有电话 ",chosen:false,type:"sta"},
                {title:"foreign_worker",description:"客户是否为外籍工人 ",chosen:false,type:"sta"},
                {title:"credit",description:"银行是否批准贷款 ",chosen:false,type:"tar"},
            ],
                Adult:[
                {title:"age",description:"年龄",chosen:false, type:"sta"},
                {title:"workclass",description:"工作类型",chosen:false, type:"sta"},
                {title:"fnlwgt",description:"最终权重",chosen:false, type:"sta"},
                {title:"education",description:"受教育程度 ",chosen:false, type:"sta"},
                {title:"education-num",description:"受教育年数 ",chosen:false, type:"sta"},
                {title:"marital-status",description:"婚姻状况",chosen:false, type:"sta"},
                {title:"occupation",description:"职业",chosen:false, type:"sta"},
                {title:"relationship",description:"家庭关系",chosen:false, type:"sta"},
                {title:"race",description:"种族",chosen:true, type:"sen"},
                {title:"sex",description:"性别",chosen:false, type:"sen"},
                {title:"capital-gain",description:"资本收益",chosen:true, type:"tar"},
                {title:"capital-loss",description:"资本损失",chosen:false, type:"tar"},
                {title:"hours-per-week",description:"每周工作时长",chosen:false, type:"sta"},
                {title:"native-country",description:"国籍",chosen:false, type:"sta"},
                {title:"income-per-year",description:"年收入",chosen:false, type:"tar"},
            ],
            
                Compas:[
                {title:"age",description:"被告的年龄",chosen:false, type:"sta"},
                {title:"c_charge_degree",description:"被告的罪名程度。F: 重罪，M: 轻罪",chosen:false, type:"sta"},
                {title:"race",description:"被告的种族",chosen:true, type:"sen"},
                {title:"age_cat",description:"被告的年龄类别",chosen:false, type:"sta"},
                {title:"score_text",description:"被告的得分类别",chosen:true, type:"tar"},
                {title:"sex",description:"被告的性别",chosen:false, type:"sen"},
                {title:"priors_count",description:"被告之前的犯罪记录数",chosen:false, type:"sta"},
                {title:"two_year_recid",description:"二元变量，表示被告是否在两年内再次被逮捕",chosen:false, type:"tar"},
                {title:"juv_fel_count",description:"未成年人犯罪数量",chosen:false, type:"sta"},
                {title:"juv_misd_count",description:"未成年人轻罪数量",chosen:false, type:"sta"},
                {title:"juv_other_count",description:"未成年人除了重罪或轻罪之外的罪行数量",chosen:false, type:"sta"},
                ],
            CelebA:[
                {title:"5_o_Clock_Shadow",description:"是否有五点钟阴影（下巴上的短须）",chosen:false, type:"tar"},
                {title:"Arched_Eyebrows",description:"是否有拱形眉毛",chosen:false, type:"tar"},
                {title:"Attractive",description:"是否吸引人",chosen:false, type:"tar"},
                {title:"Bags_Under_Eyes",description:"是否眼袋明显",chosen:false, type:"tar"},
                {title:"Bald",description:"是否秃头",chosen:false, type:"tar"},
                {title:"Bangs",description:"是否有刘海",chosen:false, type:"tar"},
                {title:"Big_Lips",description:"是否嘴唇丰满",chosen:false, type:"tar"},
                {title:"Big_Nose",description:"是否鼻子大",chosen:false, type:"tar"},
                {title:"Black_Hair",description:"是否有黑发",chosen:false, type:"tar"},
                {title:"Blond_Hair",description:"是否有金发",chosen:false, type:"tar"},
                {title:"Blurry",description:"图片是否模糊",chosen:false, type:"tar"},
                {title:"Brown_Hair",description:"是否有棕发",chosen:false, type:"tar"},
                {title:"Bushy_Eyebrows",description:"是否眉毛浓密",chosen:false, type:"tar"},
                {title:"Chubby",description:"	是否圆胖",chosen:false, type:"tar"},
                {title:"Double_Chin",description:"是否有双下巴",chosen:false, type:"tar"},
                {title:"Eyeglasses",description:"是否戴眼镜",chosen:false, type:"tar"},
                {title:"Goatee",description:"是否有山羊胡",chosen:false, type:"tar"},
                {title:"Gray_Hair",description:"是否有灰发",chosen:false, type:"tar"},
                {title:"Heavy_Makeup",description:"是否化妆浓重",chosen:false, type:"tar"},
                {title:"High_Cheekbones",description:"是否颧骨高",chosen:false, type:"tar"},
                {title:"Male",description:"性别是否为男",chosen:true, type:"sen"},
                {title:"Mouth_Slightly_Open",description:"是否微张嘴",chosen:false, type:"tar"},
                {title:"Mustache",description:"是否有胡子",chosen:false, type:"tar"},
                {title:"Narrow_Eyes",description:"是否眼睛狭长",chosen:false, type:"tar"},
                {title:"No_Beard",description:"是否没有胡须",chosen:false, type:"tar"},
                {title:"Oval_Face",description:"是否脸形为椭圆形",chosen:false, type:"tar"},
                {title:"Pale_Skin",description:"是否皮肤苍白",chosen:false, type:"tar"},
                {title:"Pointy_Nose",description:"是否鼻子尖",chosen:false, type:"tar"},
                {title:"Receding_Hairline",description:"是否发际线后移",chosen:false, type:"tar"},
                {title:"Rosy_Cheeks",description:"是否面颊红",chosen:false, type:"tar"},
                {title:"Sideburns",description:"是否有鬓角",chosen:false, type:"tar"},
                {title:"Smiling",description:"是否在微笑",chosen:false, type:"tar"},
                {title:"Straight_Hair",description:"是否直发",chosen:false, type:"tar"},
                {title:"Wavy_Hair",description:"是否波浪型发型",chosen:false, type:"tar"},
                {title:"Wearing_Earrings",description:"是否戴耳环",chosen:false, type:"tar"},
                {title:"Wearing_Hat",description:"是否戴帽子",chosen:false, type:"tar"},
                {title:"Wearing_Lipstick",description:"是否涂口红",chosen:false, type:"tar"},
                {title:"Wearing_Necklace",description:"是否戴项链",chosen:false, type:"tar"},
                {title:"Wearing_Necktie",description:"是否戴领带",chosen:false, type:"tar"},
                {title:"Young",description:"是否年轻",chosen:true, type:"tar"},
            ],
            "Cifar10-S":[
                {title:"domain",description:"图片的所属领域，灰度图片或彩色图片",chosen:true, type:"sen"},
                {title:"class",description:"图片中物体类别，10分类包括飞机、轿车、鸟、鹿、青蛙、船只、猫、狗、卡车、马",chosen:true, type:"tar"},
            ]
                },
                /* 敏感属性 */
                senMockData:[],
                senTargetKeys:[],
                /* 目标属性 */
                tarMockData:[],
                tarTargetKeys:[],
                /* 统计属性 */
                staMockData:[],
                staTargetKeys:[],
                /* 数据集信息 */
                datainfo:{
                    German:{
                        name:"German数据集",
                        text:"是一个用于信用评估的数据集。该数据集包含各种个人信息，包括性别、年龄、工作类型、信用记录等等。这些信息被用于预测个人的信用违约概率，以便银行等金融机构能够做出更好的贷款决策。",
                        href:"https://archive.ics.uci.edu/ml/datasets/statlog+(german+credit+data)",
                        tabledata:[
                            {name:"数据集特征",value:"多元统计"},
                            {name:"示例个数",value:"1,000"},
                            {name:"所属领域",value:"财经"},
                            {name:"属性类型",value:"连续型，离散型"},
                            {name:"属性数量",value:"20"},
                            {name:"创建日期",value:"1994-11-17"},
                            {name:"相关任务",value:"分类"},
                            {name:"是否缺失",value:"否"}
                        ]
                    },
                    Adult:{
                        name:"Adult数据集",
                        text:"Adult数据集是一个用于预测个人收入是否超过50000美元的数据集。该数据集包含各种个人信息，包括年龄、教育程度、职业、婚姻状况等等。",
                        href:"https://archive.ics.uci.edu/ml/datasets/adult",
                        tabledata:[
                            {name:"数据集特征",value:"多元统计"},
                            {name:"示例个数",value:"48842"},
                            {name:"所属领域",value:"财经/社会"},
                            {name:"属性类型",value:"连续型，离散型"},
                            {name:"属性数量",value:"14"},
                            {name:"创建日期",value:"1996-05-01"},
                            {name:"相关任务",value:"分类"},
                            {name:"是否缺失",value:"是"}
                        ],
                    },
                    Compas:{
                        name:"Compas数据集",
                        text:"是一个用于犯罪风险评估的数据集。该数据集包含各种犯罪嫌疑人的个人信息，包括性别、年龄、种族、前科记录等等。这些信息被用于预测嫌疑人的未来犯罪行为的概率，以便法院能够在决定是否对其进行拘留或释放时做出更好的判断。",
                        href:"https://www.propublica.org/datastore/dataset/compas-recidivism-risk-score-data-and-analysis",
                        tabledata:[
                            {name:"数据集特征",value:"多元统计"},
                            {name:"示例个数",value:"6172"},
                            {name:"所属领域",value:"社会"},
                            {name:"属性特征",value:"连续型，离散型"},
                            {name:"属性数量",value:"12"},
                            {name:"创建日期",value:"2016-5-23"},
                            {name:"相关任务",value:"分类"},
                            {name:"是否缺失",value:"否"}
                        ],
                    },
                    "Cifar10-S":{
                        name:"Cifar10-S数据集",
                        text:"CIFAR-10S数据集是CIFAR-10数据集的修改版本，包含50,000张32x32的图像，这些图像均匀分布在10个对象类别中。在CIFAR-10S中，每个原始的10个类别都被细分为两个新的领域子类，对应于该类别内的颜色和灰度领域。每个类别的5,000个训练图像在两个领域之间分割为95%到5%；五个类别是95%的颜色，五个类别是95%的灰度。因此，分配给每个领域的图像总数是平衡的。对于测试，创建了标准CIFAR-10测试集的两个副本：一个是颜色（COLOR），一个是灰度（GRAY）。",
                        href:"https://github.com/princetonvisualai/DomainBiasMitigation",
                        tabledata:[
                            {name:"样本数",value:"60000"},
                            {name:"所属领域",value:"物体识别"},
                            {name:"分类类型",value:"10分类"},
                            {name:"标签属性数",value:1},
                            {name:"发布时间",value:"2020-9"},
                            {name:"相关任务",value:"分类"},
                            {name:"是否缺失",value:"否"}
                        ]
                    },
                    "CelebA":{
                        name:"Cifar10-S数据集",
                        text:"CelebA数据集是一个大规模的面部属性数据集，包含超过200,000张名人图像，每张图像都有40个属性注释。此数据集的图像覆盖了大的姿态变化和背景杂乱。CelebA具有大的多样性，大量的数量和丰富的注释。",
                        href:"https://mmlab.ie.cuhk.edu.hk/projects/CelebA.html",
                        tabledata:[
                            {name:"样本数",value:"202599"},
                            {name:"所属领域",value:"人脸识别"},
                            {name:"分类类型",value:"2分类"},
                            {name:"标签属性数",value:40},
                            {name:"发布时间",value:"2015-12"},
                            {name:"相关任务",value:"分类"},
                            {name:"是否缺失",value:"是"}
                        ]
                    }
                },
            }
        },
        mounted(){
            let that = this;
            that.onChangeRadio();
        },
        methods:{
            /* 传值给父组件*/
            sendSelect(){
                var senAttrList = [];
                var tarAttrList = [];
                var staAttrList = [];
                for(let i = 0;i < this.senTargetKeys.length; i++){
                    senAttrList.push(this.dataAttrlist[this.dataname[this.value]][this.senTargetKeys[i]].title)
                }
                for(let i = 0;i < this.tarTargetKeys.length; i++){
                    tarAttrList.push(this.dataAttrlist[this.dataname[this.value]][this.tarTargetKeys[i]].title)
                }
                for(let i = 0;i < this.staTargetKeys.length; i++){
                    staAttrList.push(this.dataAttrlist[this.dataname[this.value]][this.staTargetKeys[i]].title)
                }
                this.$emit('clientDatasetSelect', this.value, senAttrList, tarAttrList, staAttrList);
            },
            /* 数据集单选改变，属性选择穿梭框的内容改变 */
            onChangeRadio(e, value) {
                /* 敏感属性 */
                const senMockData = [];
                const senTargetKeys = [];
                /* 目标属性 */
                const tarMockData = [];
                const tarTargetKeys = [];
                /* 统计属性 */
                const staMockData = [];
                const staTargetKeys = [];
                const dataAttrlist = this.dataAttrlist[this.dataname[this.value]]
                for (let index in dataAttrlist) {
                    const data = {
                        key: index,
                        title: dataAttrlist[index].title,
                        description: dataAttrlist[index].description,
                        chosen: dataAttrlist[index].chosen,
                    };
                    switch(dataAttrlist[index].type){
                        case "sen":senMockData.push(data);
                        if (data.chosen) {
                            senTargetKeys.push(data.key);
                        }
                        break;
                        case "tar":tarMockData.push(data);
                        if (data.chosen) {
                            tarTargetKeys.push(data.key);
                        }
                        break;
                    }
                    if (data.chosen) {
                        staTargetKeys.push(data.key);
                    }
                    staMockData.push(data);
                }
                this.senMockData = senMockData;
                this.senTargetKeys = senTargetKeys;
                this.tarMockData = tarMockData;
                this.tarTargetKeys = tarTargetKeys;
                this.staMockData = staMockData;
                this.staTargetKeys = staTargetKeys;
                this.sendSelect();
                console.log("print e:",e);
                if(e){
                    this.showDataDes(e, value);
                }
                
                // e.preventDefault();
            },
            /* 监听敏感属性选择 */
            senClientTransfer(targetKeys){
                for(let i = 0;i<this.senTargetKeys.length;i++){
                    if( targetKeys.indexOf(this.senTargetKeys[i]) == -1){
                        this.staTargetKeys.splice(this.staTargetKeys.indexOf(this.senTargetKeys[i]), 1)
                    }
                };
                this.senTargetKeys=targetKeys;
                for(let i = 0;i<targetKeys.length;i++){
                    if( this.staTargetKeys.indexOf(targetKeys[i]) == -1){
                        this.staTargetKeys.push(targetKeys[i])
                    }
                };
                this.sendSelect();
            },
            showDataDes(e,index){
                // debugger;
                console.log(e);
                console.log(index);
                var srcStatus;
                srcStatus = this.labelshow[index];
                this.labelshow=[false, false, false];
                this.labelshow[index] = !srcStatus;
                e.preventDefault();
            },

            /* 监听目标属性选择 */
            tarClientTransfer(targetKeys){
                for(let i = 0;i<this.tarTargetKeys.length;i++){
                    if( targetKeys.indexOf(this.tarTargetKeys[i]) == -1){
                        this.staTargetKeys.splice(this.staTargetKeys.indexOf(this.tarTargetKeys[i]), 1)
                    }
                };
                this.tarTargetKeys=targetKeys;
                for(let i = 0;i<targetKeys.length;i++){
                    if( this.staTargetKeys.indexOf(targetKeys[i]) == -1){
                        this.staTargetKeys.push(targetKeys[i])
                    }
                };
                this.sendSelect();
            },
            /* 监听统计属性选择 */
            staClientTransfer(targetKeys){
                this.staTargetKeys=targetKeys;
                this.sendSelect();
            },
        },
    }
        
  
</script>
<style scoped>

.datasetselect{
    width: 1104px;
}

.radiobackground:hover .ant-radio-wrapper{
    color:#0B55F4;
}

/* 输入名样式 */
.paramName{
    height: 24px;
    font-family: 'Microsoft YaHei';
    font-style: normal;
    font-size: 16px;
    color: #000000;
    letter-spacing: 0;
    line-height: 24px;
    font-weight: 400;
    margin: 24px 0px 12px 0px;
}

.ant-radio-group{
    width: 100%;
}

/* 数据集描述 */
.datades{
    margin: 0 24px;
}
.bgInfo{
    width: 1056px;
    font-family: 'Microsoft YaHei';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: #6C7385;
}
</style>