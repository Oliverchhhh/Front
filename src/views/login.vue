<template >
    <div class="dialog">
        <div class="content">
            <div class="login-wrap" v-show="showLogin">
                <h1>系统登录</h1>
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
                            登录
                        </a-button>
                    </a-form-model-item>
                </a-form-model>
                
                <span v-on:click="ToRegister">没有账号?马上注册</span>
            </div>
            <div class="register-wrap" v-show="showRegister">
                <h1>系统注册</h1>
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

                <span v-on:click="ToLogin">已有账号?马上登录</span>
            </div>
        </div>
    </div>
</template>
<script>
import loginDialog from "../components/loginDialog.vue"
import {setCookie,getCookie} from '../assets/js/cookie.js'
export default{
    name:"login",
    components:{
        loginDialog
    },
    data() {
        let validatePass = (_, value, callback) =>{
            const reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![_]+$)[\da-zA-Z_]{6,20}$/;
            if (reg.test(value)) {
                callback();
            } else {
                callback(new Error("数字、字母、下划线任意两种组合，且不能少于6位大于20位"));
            }
        };
        return {
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
        };
    },
    mounted(){
        this.username = getCookie("username")
        if (this.username!=''){
            this.$router.push('/homme_menu')
        }
    },
    methods:{
        login(){
            if(this.userinfo.username==""||this.userinfo.password==""){
                this.$message.error("请输入用户名或者密码")
                return -1
            }else{
                let params = new URLSearchParams();
                params.append('username', this.userinfo.username);
                params.append('password', this.userinfo.password);
                console.log(params)
                this.$axios.post("/api/login",params).then((res)=>{
                    console.log(res.data)
                    console.log(typeof res.data)
                    if(res.data.code == -1){
                        this.$message.error("用户名密码错误")
                    }else if(res.data.code == 1){
                        this.$message.success( "登录成功")
                        setCookie("username",this.userinfo.username,1000*60)
                        setTimeout(function(){
                            this.$router.push("/homme_menu")
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
}
.register-wrap{
    text-align:center;
}

span{cursor:pointer;}
span:hover{color:#0B55F4;}
.content{
    position: fixed;
    width: 450px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 480px;
    align-items: center;
    
    }
.dialog{
    background-color: #f3f7ff;
    width: 100%;
    height: 100%;
}
</style>