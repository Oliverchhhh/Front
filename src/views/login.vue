<template >
    <div class="auth-container">
        <!-- 背景装饰 -->
        <div class="background-decoration">
            <div class="floating-shapes">
                <div class="shape shape-1"></div>
                <div class="shape shape-2"></div>
                <div class="shape shape-3"></div>
                <div class="shape shape-4"></div>
            </div>
        </div>

        <div class="auth-wrapper">
            <!-- 登录表单 -->
            <div class="form-card" :class="{ 'slide-out-left': !showLogin }" v-show="showLogin">
                <div class="card-header">
                    <h1 class="form-title">系统登录</h1>
                    <p class="form-subtitle">欢迎回到AI安全风险主动防御加固系统平台</p>
                </div>
                
                <a-form-model :model="userinfo" @submit="login" @submit.native.prevent class="auth-form">
                    <div class="form-group">
                        <label class="form-label">用户名 <span class="required">*</span></label>
                        <div class="input-wrapper">
                            <div class="custom-input-container">
                                <a-icon type="user" class="input-prefix-icon" />
                                <input 
                                    type="text"
                                    v-model="userinfo.username" 
                                    placeholder="请输入用户名"
                                    class="clean-input"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">密码 <span class="required">*</span></label>
                        <div class="input-wrapper">
                            <div class="custom-input-container">
                                <a-icon type="lock" class="input-prefix-icon" />
                                <input 
                                    type="password"
                                    v-model="userinfo.password" 
                                    placeholder="请输入密码"
                                    class="clean-input"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <a-button
                            type="primary"
                            html-type="submit"
                            size="large"
                            class="auth-button login-button"
                            :disabled="userinfo.username === '' || userinfo.password === ''"
                            block
                        >
                            <a-icon type="login" class="button-icon" />
                            登录
                        </a-button>
                    </div>
                </a-form-model>
                
                <div class="form-footer">
                    <span class="switch-form" @click="ToRegister">
                        没有账号？<strong>马上注册</strong>
                    </span>
                </div>
            </div>

            <!-- 注册表单 -->
            <div class="form-card" :class="{ 'slide-out-right': !showRegister }" v-show="showRegister">
                <div class="card-header">
                    <h1 class="form-title">系统注册</h1>
                    <p class="form-subtitle">创建您的账号，开始体验AI安全检测服务</p>
                </div>
                
                <a-form-model :model="registerinfo" :rules="regrules" @submit="register" @submit.native.prevent class="auth-form">
                    <div class="form-group">
                        <label class="form-label">用户名 <span class="required">*</span></label>
                        <div class="input-wrapper">
                            <div class="custom-input-container">
                                <a-icon type="user" class="input-prefix-icon" />
                                <input 
                                    type="text"
                                    v-model="registerinfo.newUsername" 
                                    placeholder="请输入用户名"
                                    class="clean-input"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">密码 <span class="required">*</span></label>
                        <div class="input-wrapper">
                            <div class="custom-input-container">
                                <a-icon type="lock" class="input-prefix-icon" />
                                <input 
                                    type="password"
                                    v-model="registerinfo.newPassword" 
                                    placeholder="请输入密码"
                                    class="clean-input"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <a-button
                            type="primary"
                            size="large"
                            html-type="submit"
                            class="auth-button register-button"
                            :disabled="registerinfo.newUsername === '' || registerinfo.newPassword === ''"
                            block
                        >
                            <a-icon type="user-add" class="button-icon" />
                            注册
                        </a-button>
                    </div>
                </a-form-model>

                <div class="form-footer">
                    <span class="switch-form" @click="ToLogin">
                        已有账号？<strong>马上登录</strong>
                    </span>
                </div>
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
                // this.$axios.post("/login",params).then((res)=>{
                //     console.log(res.data)
                //     console.log(typeof res.data)
                //     if(res.data.code == -1){
                //         this.$message.error("用户名密码错误")
                //     }else if(res.data.code == 1){
                //         this.$message.success( "登录成功")
                //         setCookie("username",this.userinfo.username,1000*60)
                //         setTimeout(function(){
                //             this.$router.push("/homme_menu")
                //         }.bind(this),1000)
                //     }else{
                //         this.$message.error("未知错误")
                //     }
                // })登录
                        this.$message.success( "登录成功")
                        setCookie("username",this.userinfo.username,1000*60)
                        setTimeout(function(){
                            this.$router.push("/homme_menu")
                        }.bind(this),1000)
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
/* ========== 主容器样式 ========== */
.auth-container {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* 背景装饰 */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.floating-shapes {
  position: relative;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 60%;
  right: 10%;
  animation-delay: 2s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  top: 10%;
  right: 20%;
  animation-delay: 4s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 15%;
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* ========== 表单容器样式 ========== */
.auth-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 20px;
}

.form-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 50px 40px;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 12px 30px rgba(0, 0, 0, 0.08),
    0 4px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(0);
}

.form-card.slide-out-left {
  transform: translateX(-100%);
  opacity: 0;
}

.form-card.slide-out-right {
  transform: translateX(100%);
  opacity: 0;
}

/* ========== 卡片头部样式 ========== */
.card-header {
  text-align: center;
  margin-bottom: 40px;
}

.form-title {
  font-family: HONOR Sans CN, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
  font-size: 32px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 12px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-subtitle {
  font-size: 16px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

/* ========== 表单样式 ========== */
.auth-form {
  width: 100%;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-family: HONOR Sans CN;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.required {
  color: #ff4757;
}

.input-wrapper {
  position: relative;
}

/* 自定义输入框容器 */
.custom-input-container {
  position: relative;
  display: flex;
  align-items: center;
  height: 52px;
  border-radius: 12px;
  border: 2px solid #e1e8ed;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0 15px;
}

.custom-input-container:hover {
  border-color: #667eea;
  background: rgba(255, 255, 255, 1);
}

.custom-input-container:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: rgba(255, 255, 255, 1);
}

/* 前缀图标 */
.input-prefix-icon {
  color: #667eea;
  font-size: 18px;
  margin-right: 12px;
  flex-shrink: 0;
}

/* 纯净输入框 */
.clean-input {
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  font-family: inherit;
  color: #333;
  padding: 0;
}

.clean-input::placeholder {
  color: #999;
  font-size: 16px;
}

/* ========== 按钮样式 ========== */
.form-actions {
  margin: 32px 0 24px 0;
}

.auth-button {
  height: 52px !important;
  border-radius: 12px !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  border: none !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative !important;
  overflow: hidden !important;
}

.login-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

.register-button {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
}

.auth-button:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15) !important;
}

.auth-button:active {
  transform: translateY(0) !important;
}

.auth-button:disabled {
  background: #e1e8ed !important;
  color: #999 !important;
  transform: none !important;
  box-shadow: none !important;
}

.button-icon {
  margin-right: 8px !important;
  font-size: 16px !important;
}

/* ========== 表单底部样式 ========== */
.form-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.switch-form {
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
  padding: 8px 0;
}

.switch-form:hover {
  color: #667eea;
}

.switch-form strong {
  color: #667eea;
  font-weight: 600;
}

.switch-form strong:hover {
  color: #764ba2;
}

/* ========== 响应式设计 ========== */
@media (max-width: 768px) {
  .auth-wrapper {
    padding: 15px;
  }
  
  .form-card {
    padding: 40px 30px;
    border-radius: 20px;
    margin: 20px 0;
  }
  
  .form-title {
    font-size: 28px;
  }
  
  .form-subtitle {
    font-size: 14px;
  }
  
  .custom-input-container {
    height: 48px;
    padding: 0 12px;
  }
  
  .clean-input {
    font-size: 15px;
  }
  
  .auth-button {
    height: 48px !important;
    font-size: 15px !important;
  }
}

@media (max-width: 480px) {
  .auth-container {
    padding: 0;
  }
  
  .auth-wrapper {
    padding: 10px;
  }
  
  .form-card {
    padding: 30px 20px;
    border-radius: 16px;
    margin: 10px 0;
  }
  
  .form-title {
    font-size: 24px;
  }
  
  .form-subtitle {
    font-size: 13px;
  }
  
  .card-header {
    margin-bottom: 30px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .custom-input-container {
    height: 44px;
    padding: 0 10px;
  }
  
  .clean-input {
    font-size: 14px;
  }
  
  .auth-button {
    height: 44px !important;
    font-size: 14px !important;
  }
}

/* ========== 去除 Ant Design 默认样式 ========== */
.ant-form-item {
  margin-bottom: 0 !important;
}

.ant-form-item-label {
  display: none !important;
}

.ant-form-item-control {
  line-height: normal !important;
}

/* 禁用状态 */
.custom-input-container.disabled {
  background: #f5f5f5;
  border-color: #d9d9d9;
  cursor: not-allowed;
}

.custom-input-container.disabled .clean-input {
  cursor: not-allowed;
  color: #999;
}

.custom-input-container.disabled .input-prefix-icon {
  color: #999;
}
</style>