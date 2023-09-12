<template>
    <div class="dialog">
        <!--外层的遮罩 点击事件用来关闭弹窗，isShow控制弹窗显示 隐藏的props-->
        <div class="dialog-cover back"  v-if="isShow" @click="closeMyself"></div>
        <!-- transition 这里可以加一些简单的动画效果 -->
        <transition name="drop">
            <!--style 通过props 控制内容的样式 -->
            <div  class="dialog-content" v-if="isShow" @click.stop="_stopPropagation($event)">
                <div class="dialog_head back">
                    <!--弹窗头部 title-->
                    <div class="close_button">
                        <a-icon type="close" @click="closeMyself" style="font-size: 20px;color:#6C7385;" class="closebutton"/>
                    </div>
                    <slot name="header">
                        <div class="dialog_title"  v-show="showLogin">
                            <p class="titleName">登录</p>
                            
                        </div>
                        <div class="dialog_title "  v-show="showRegister">
                            <p class="titleName">注册</p>
                                
                        </div>
                    </slot>
                </div>
                <div class="dialog_main" >
                <!--弹窗的内容-->
                    <slot name="main">
                        <div class="login-wrap" v-show="showLogin">
                            <a-form-model :model="userinfo"  @submit="login" 
                            :label-col="labelCol"
                            :wrapper-col="wrapperCol"
                            @submit.native.prevent>
                                <a-form-model-item label="用户名">
                                    <a-input size="large" v-model="userinfo.username" placeholder="请输入用户名">
                                        <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
                                    </a-input>
                                </a-form-model-item>
                                <a-form-model-item label="密码">
                                    <a-input size="large" v-model="userinfo.password" type="password" placeholder="请输入密码">
                                        <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
                                    </a-input>
                                </a-form-model-item>
                                <a-form-model-item :wrapperCol="{'span':24}">
                                    <a-button
                                        type="primary"
                                        html-type="submit"
                                        size="large"
                                        :disabled="userinfo.username === '' || userinfo.password === ''"
                                    >
                                        登入
                                    </a-button>
                                </a-form-model-item>
                            </a-form-model>
                            <span v-on:click="ToRegister">没有账号?马上注册</span>
                        </div>
                        <div class="register-wrap" v-show="showRegister">
                            <a-form-model  :model="registerinfo" :rules="regrules" 
                            :label-col="labelCol"
                            :wrapper-col="wrapperCol"
                            @submit="register" @submit.native.prevent>
                                <a-form-model-item ref="name" label="用户名" prop="newUsername">
                                    <a-input size="large" v-model="registerinfo.newUsername" placeholder="请输入用户名"
                                    @blur="() => {
                                            $refs.name.onFieldBlur();
                                    }">
                                        <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
                                    </a-input>
                                </a-form-model-item>
                                <a-form-model-item label="密码" prop="newPassword">
                                    <a-input size="large" v-model="registerinfo.newPassword" type="password" placeholder="请输入密码">
                                        <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
                                    </a-input>
                                </a-form-model-item>
                                <a-form-model-item :wrapperCol="{'span':24}" >
                                    <a-button
                                    type="primary"
                                        size="large"
                                        html-type="submit"
                                        :disabled="registerinfo.newUsername === '' || registerinfo.newPassword === ''"
                                    >
                                        注册
                                    </a-button>
                                </a-form-model-item>
                            </a-form-model>

                            <span v-on:click="ToLogin">已有账号?马上登入</span>
                        </div>
                    </slot>
                    
                </div>
                
            </div>
        </transition>
    </div>
</template>
<script>
import {setCookie,getCookie} from '../assets/js/cookie.js'

export default {
    name:"loginDialog",
    props: {
        isShow: {
        //弹窗组件是否显示 默认不显示
        type: Boolean,
        default: false,
        required:true, //必须
        },
        //下面这些属性会绑定到div上面 详情参照上面的html结构
        // 如： :style="{top:topDistance+'%',width:widNum+'%'}"
        widNum:{
        //内容宽度
        type: Number,
        default:50
        },
        leftSite:{
        // 左定位
        type: Number,
        default:25.2
        },
        topDistance: {
        //top上边距
        type: Number,
        default:10
        },
        pdt:{
        //上padding
        type: Number,
        default:22
        },
        pdb:{
        //下padding
        type: Number,
        default:47
        }
        },
    // props:["is-show","top-distance"],
    data(){
        let validatePass = (_, value, callback) =>{
            const reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![_]+$)[\da-zA-Z_]{6,20}$/;
            if (reg.test(value)) {
                callback();
            } else {
                callback(new Error("数字、字母、下划线任意两种组合，且不能少于6位大于20位"));
            }
        };
        return{
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
            userinfo:{
                username: '',
                password: '',
            },
            registerinfo:{
                newUsername: '',
                newPassword: '',
            },
            regrules:{
                newUsername:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 5, message: '字符长度3 到8 位', trigger: 'blur' },
                    ],
                newPassword:[{ required: true, message: '请输入密码', trigger: 'blur' },
                    { validator: validatePass, trigger: 'blur' }],

            },
            showLogin: true,
            showRegister: false
        }
    },
    mounted(){
        this.userinfo.username = getCookie("username")
        if(getCookie("username")){
            this.$emit('clientUserlogin', this.userinfo.username, false)
        }
    },

    methods: {
        
        closeMyself() {
            this.$emit("on-close");
        //如果需要传参的话，可以在"on-close"后面再加参数，然后在父组件的函数里接收就可以了。
        },
        _stopPropagation(ev){
            var _this = this;
            ev.stopPropagation();
        },
        login(){
            if(this.userinfo.username==""||this.userinfo.password==""){
                this.$message.error("请输入用户名或者密码")
                return -1
            }else{
                let params = new URLSearchParams();
                params.append('username', this.userinfo.username);
                params.append('password', this.userinfo.password);
                console.log(params)
                this.$axios.post("/login",params).then((res)=>{
                    console.log(res.data)
                    console.log(typeof res.data)
                    if(res.data.code == -1){
                        this.$message.error("用户名密码错误")
                    }else if(res.data.code == 1){
                        this.$message.success( "登入成功")
                        setCookie("username",this.userinfo.username,1000*60)
                        setTimeout(function(){
                            this.$emit('clientUserlogin', this.userinfo.username, false)
                        }.bind(this),1000)
                    }else{
                        this.$message.error("未知错误")
                    }
                })
            }
        },
        ToRegister(){
            this.showRegister = true
            this.showLogin = false
        },
        ToLogin(){
            this.showRegister = false
            this.showLogin = true
        },
        register(){
            if(this.registerinfo.newUsername==""||this.registerinfo.newPassword==""){
                this.$message.error("请输入用户名或者密码")
                return -1
            }else{
                let params = new URLSearchParams();
                params.append('username', this.registerinfo.newUsername);
                params.append('password', this.registerinfo.newPassword);
                this.$axios.post("/register",params).then((res)=>{
                    console.log(res)
                    console.log(res.data)
                    if(res.data.code == 1){
                        this.$message.success("注册成功")
                        this.registerinfo.newUsername=""
                        this.registerinfo.newPassword=""
                        setTimeout(function(){
                            this.showRegister = false
                            this.showLogin = true
                        }.bind(this),1000)
                    }else if(res.data.code == -1){
                        this.$message.error("用户名已存在")
                    }
                })
            }
        }
    }
}

</script>

<style scoped>

.login-wrap{
    text-align:center;
    margin-top: 70px;
}
.register-wrap{
    text-align:center;
    margin-top: 70px;
}
.titleName{
    word-wrap: break-word;
    color: rgba(0,0,0,.85);
    font-size: 20px;
    font-weight: 500;
    line-height: 45px;
    margin: 0;
}
    input{display:block; width:250px; height:40px; line-height:40px; margin:0 auto; margin-bottom: 35px; outline:none; border:1px solid #888; padding:10px; box-sizing:border-box;}

    .loginButton{display:block; width:250px; height:40px; line-height: 40px; margin:0 auto; border:none; background-color:#0B55F4; color:#fff; font-size:16px; margin-bottom:10px;}
    span{cursor:pointer;}
    span:hover{color:#0B55F4;}
 /* 最外层 设置position定位 */
 .dialog {
 position: relative;
 color: #e7e5e6;
 font-size: 16px;
 }
  /* 遮罩 设置背景层，z-index值要足够大确保能覆盖，高度 宽度设置满 做到全屏遮罩 */
 .dialog-cover {
    background: rgba(68, 68, 68, 0.8);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
 }
.close_button{
    height: 40px;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    float: right;
}
/* 内容层 z-index要比遮罩大，否则会被遮盖， */
 .dialog-content{
    position: fixed;
    width: 450px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 480px;
    align-items: center;
    z-index: 2001;
    color: rgb(0, 0, 0);
    overflow: scroll;
    background: #FFFFFF;
    box-shadow: 0px 8px 20px rgba(44, 51, 67, 0.06);
    border-radius: 8px;
 }
 /* 标题框样式 */
 .dialog_head{
    width: 450px;
    left: 0px;
    top: 1px;
    height: 88px;
    padding: 24px 18px 24px 24px;
    border-bottom: 1px solid #E0E3EB;
 }
 
 .dialog_main{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px;
    gap: 60px;

    position: absolute;
    width: 450px;
    /* height: 8265px; */
    left: 0px;
    top: 89px;

 }
 .foot_close{
    background: #5196FF;
    border-radius: 4px;
    width: 143px;
    height: 50px;
 }

 
</style>