<style lang="less">
@import './login.less';
</style>

<template>
  <div class="login">
    <div class="header"></div>
    <div v-if="isShow == 1" class="login-con">
      <Card icon="log-in" title="账号登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit" @setConfig="getConfig"></login-form>
        </div>
      </Card>
    </div>
    <div v-if="isShow == 2" class="forget-con1">
      <Card icon="log-in" title="忘记密码" :bordered="false">
        <Form ref="forgetForm" :model="forgetForm" :rules="ruleValidate">
          <FormItem prop="name">
            <Input placeholder="账号" v-model="forgetForm.name">
              <Icon type="ios-contact" slot="prefix" />
            </Input>
            <Input v-show="false"></Input>
          </FormItem>
          <FormItem>
            <Button style="width: 100%;" type="primary" @click="forgetPwd1">下一步</Button>
          </FormItem>
          <FormItem>
            <Button style="width: 100%;" @click="isShow = 1">返回登录</Button>
          </FormItem>
        </Form>
      </Card>
    </div>
    <div v-show="isShow == 4" class="forget-con2">
      <Card icon="log-in" title="忘记密码" :bordered="false">
        <Form ref="forgetForm2" :model="forgetForm2" :rules="ruleValidate">
          <FormItem>
            <Input :value="forgetForm2.tel" disabled>
              <Icon type="ios-phone-portrait" slot="prefix" />
            </Input>
          </FormItem>
          <FormItem prop="newpasswd">
            <Input placeholder="新密码" v-model="forgetForm2.newpasswd" type="password">
              <Icon type="ios-lock-outline" slot="prefix" />
            </Input>
          </FormItem>
          <FormItem prop="confirmpasswd">
            <Input placeholder="新密码确认" v-model="forgetForm2.confirmpasswd" type="password">
              <Icon type="ios-lock-outline" slot="prefix" />
            </Input>
          </FormItem>
          <FormItem prop="code">
            <Row>
              <Col span="16">
                <Input placeholder="验证码" v-model="forgetForm2.code">
                  <Icon type="ios-mail-outline" slot="prefix" />
                </Input>
              </Col>
              <Col span="8">
                <Button
                  v-if="isShowBtn"
                  style="width: 90%; margin-left: 10%;"
                  type="success"
                  @click="sendMsg2"
                >{{btntxt}}</Button>
                <div
                  style="width: 100%; text-align: center; color: red;"
                  v-if="!isShowBtn"
                >{{btntxt}}</div>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Button style="width: 100%;" type="primary" @click="forgetPwd2">确认</Button>
          </FormItem>
          <FormItem>
            <Button style="width: 100%;" @click="clearReg">返回登录</Button>
          </FormItem>
        </Form>
      </Card>
    </div>
    <div v-if="isShow == 3" class="reg-con">
      <Card icon="log-in" title="注册" :bordered="false">
        <Form ref="formValidate" :model="regForm" :rules="ruleValidate">
          <FormItem prop="nickName">
            <Input placeholder="昵称" v-model="regForm.nickName">
              <Icon type="ios-person" slot="prefix" />
            </Input>
          </FormItem>
          <FormItem prop="userName">
            <Input placeholder="账号" v-model="regForm.userName">
              <Icon type="ios-card" slot="prefix" />
            </Input>
          </FormItem>
          <FormItem prop="passwd">
            <Input placeholder="密码" v-model="regForm.passwd" type="password">
              <Icon type="ios-lock-outline" slot="prefix" />
            </Input>
          </FormItem>
          <FormItem prop="newPwd">
            <Input placeholder="密码确认" v-model="regForm.newPwd" type="password">
              <Icon type="ios-lock-outline" slot="prefix" />
            </Input>
          </FormItem>
          <FormItem prop="tel">
            <Input placeholder="手机号" v-model="regForm.tel">
              <Icon type="ios-phone-portrait" slot="prefix" />
            </Input>
          </FormItem>
          <FormItem prop="code">
            <Row>
              <Col span="16">
                <Input placeholder="验证码" v-model="regForm.code">
                  <Icon type="ios-mail-outline" slot="prefix" />
                </Input>
              </Col>
              <Col span="8">
                <Button
                  v-if="isShowBtn"
                  style="width: 90%; margin-left: 10%;"
                  type="success"
                  @click="sendMsg"
                >{{btntxt}}</Button>
                <div
                  style="width: 100%; text-align: center; color: red;"
                  v-if="!isShowBtn"
                >{{btntxt}}</div>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Button style="width: 100%;" type="primary" @click="regSub">注册</Button>
          </FormItem>
          <FormItem>
            <Button style="width: 100%;" @click="clearReg">返回登录</Button>
          </FormItem>
        </Form>
      </Card>
    </div>
    <div class="footer">
      <a
        target="_blank"
        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33011002013427"
        style="display:inline-block;text-decoration:none;height:20px;line-height:20px;"
      >
        <p
          style="float:left;height:20px;line-height:20px;margin: 0px 5px 0px 0px; color:#939393; cursor: default;"
          onclick="return false;"
        >杭州美播云科技有限公司 版权所有 浙ICP备18023523号</p>
        <img src="../../assets/images/mark.png" style="float:left;" />
        <p
          style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;"
        >浙公网安备 33011002013427号</p>
      </a>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import {
  sendVerifiCode,
  registerByTel,
  getTEL,
  forgetPassword
} from '@/api/data'
export default {
  components: {
    LoginForm
  },
  data() {
    const validateNick = (rule, value, callback) => {
      const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
      if (!value) {
        callback(new Error('这是必填字段'))
      } else if (!reg.test(value) || value.length < 4 || value.length > 16) {
        callback(new Error('长度在4-16之间的字符,数字,字母,中文和下划线'))
      } else {
        callback() // 不管结果如何都要返回一个值，不然就一直校验中，无法提交了。
      }
    }

    const validateAccount = (rule, value, callback) => {
      const reg = /^[a-zA-Z][a-zA-Z0-9_]*$/
      if (!value) {
        callback(new Error('这是必填字段'))
      } else if (!reg.test(value) || value.length < 6 || value.length > 16) {
        callback(new Error('字母开头,长度在6-16之间的字符,数字和下划线'))
      } else {
        callback()
      }
    }

    const validatePwd = (rule, value, callback) => {
      const reg = /^[a-zA-Z][a-zA-Z0-9_]*$/
      if (!value) {
        callback(new Error('这是必填字段'))
      } else if (!reg.test(value) || value.length < 6 || value.length > 16) {
        callback(new Error('字母开头,长度在6-16之间的字符,数字和下划线'))
      } else {
        callback()
      }
    }

    const validatePass2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('密码确认不能为空'))
      } else if (
        value === this.regForm.passwd ||
        value === this.forgetForm2.newpasswd
      ) {
        callback()
      } else {
        callback(new Error('两次输入密码不一致!'))
      }
    }

    const validateMobile = (rule, value, callback) => {
      const reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/
      if (!value) {
        callback(new Error('请输入手机号码'))
      } else if (!reg.test(value)) {
        callback(new Error('手机号格式不正确'))
      } else {
        callback()
      }
    }

    return {
      isShow: 1,
      time: 0,
      isShowBtn: true,
      btntxt: '发送',
      regForm: {},
      forgetForm: {},
      forgetForm2: {},
      localURI: '',
      ruleValidate: {
        nickName: [{ validator: validateNick, trigger: 'blur' }],
        userName: [{ validator: validateAccount, trigger: 'blur' }],
        passwd: [{ validator: validatePwd, trigger: 'blur' }],
        newPwd: [{ validator: validatePass2, trigger: 'blur' }],
        tel: [{ validator: validateMobile, trigger: 'blur' }],
        code: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
        newpasswd: [{ validator: validatePwd, trigger: 'blur' }],
        confirmpasswd: [{ validator: validatePass2, trigger: 'blur' }]
      },
      ruleValidate2: {
        newpasswd: [{ validator: validatePwd, trigger: 'blur' }],
        confirmpasswd: [{ validator: validatePass2, trigger: 'blur' }],
        code: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    forgetPwd2() {
      // 判断是否有点击发送按钮，点击验证码发送后才能获取pageid
      if (!this.forgetForm2.pageId) {
        return this.$Message.info('请先获取验证码')
      }
      // 修改密码提交
      this.ruleValidate.code[0].required = true
      this.$refs['forgetForm2'].validate(valid => {
        if (valid) {
          // 这里不知道要不要先校验短信信息
          forgetPassword(this.forgetForm2).then(res => {
            if (res.data.msg === 'true' || res.data.result === 'true') {
              this.$Message.success(res.data.msg)
              // 返回登录页，清楚 regForm
              window.location.href = '/login'
              this.forgetForm2 = {}
              this.$refs['forgetForm2'].resetFields()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    },
    forgetPwd1() {
      // 忘记密码账号填写后下一步
      this.$refs['forgetForm'].validate(valid => {
        if (valid) {
          // 获取手机号
          let data = {
            userName: this.forgetForm.name
          }
          getTEL(data).then(res => {
            if (res.data.result === 'succ') {
              this.forgetForm2.tel = res.data.reason
              this.forgetForm2.name = this.forgetForm.name
              this.isShow = 4
            } else {
              this.$Message.error(res.data.reason)
            }
          })
        }
      })
    },
    timer() {
      if (this.time > 0) {
        this.time--
        this.btntxt = this.time + 's后重新获取'
        setTimeout(this.timer, 1000)
      } else {
        this.time = 0
        this.btntxt = '发送'
        this.isShowBtn = true
      }
    },
    sendMsg2() {
      // 验证码不校验
      this.ruleValidate.code[0].required = false
      this.$refs['forgetForm2'].validate(valid => {
        if (valid) {
          this.time = 60
          this.isShowBtn = false
          this.timer()
          let pageid = new Date().getTime()
          let data = {
            tel: this.forgetForm2.tel,
            type: 'mod',
            pageId: pageid
          }
          this.forgetForm2.pageId = pageid
          sendVerifiCode(data).then(res => {
            if (res.data.result === 'succ') {
              this.$Message.success('短信发送成功')
            } else {
              this.$Message.error(res.data.reason)
            }
          })
        } else {
          console.log('校验失败，短信未发送')
        }
      })
    },
    sendMsg() {
      // 验证码不校验
      this.ruleValidate.code[0].required = false
      this.$refs['formValidate'].validate(valid => {
        if (valid) {
          this.time = 60
          this.isShowBtn = false
          this.timer()
          let pageid = new Date().getTime()
          let data = {
            tel: this.regForm.tel,
            type: 'check',
            pageId: pageid
          }
          this.regForm.pageId = pageid
          sendVerifiCode(data).then(res => {
            if (res.data.result === 'succ') {
              this.$Message.success('短信发送成功')
            } else {
              this.$Message.error(res.data.reason)
            }
          })
        } else {
          console.log('校验失败，短信未发送')
        }
      })
    },
    clearReg() {
      this.isShow = 1
      this.regForm = {}
      this.forgetForm = {}
    },
    regSub() {
      // 提交注册信息
      this.ruleValidate.code[0].required = true
      this.$refs['formValidate'].validate(valid => {
        if (valid) {
          // 这里不知道要不要先校验短信信息
          registerByTel(this.regForm).then(res => {
            if (res.data.result === 'succ') {
              this.$Message.success('注册成功')
              // 返回登录页，清楚 regForm
              window.location.href = '/login'
              this.regForm = {}
            } else {
              this.$Message.error(res.data.reason)
            }
          })
        }
      })
    },
    ...mapActions(['handleLogin']),
    handleSubmit({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
        if (res.data.result == true) {
          this.$router.push({
            name: this.$config.homeName
          })
        } else {
          this.$Message.info(res.data.msg)
        }
      })
    },
    getConfig(data) {
      this.isShow = data
    }
  }
}
</script>

<style scoped>
.footer {
  position: absolute;
  bottom: 4vh;
  left: 50%;
  transform: translate(-50%);
}
.header {
  background: url('../../assets/images/logo.png') no-repeat 0 center;
  background-size: 200px 50px;
  background-position-x: 2%;
  height: 60px;
}
.forget-con1,
.forget-con2,
.reg-con {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
}
</style>
