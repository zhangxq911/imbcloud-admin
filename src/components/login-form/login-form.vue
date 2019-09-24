<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <Input v-model="form.userName" placeholder="请输入账户">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
    <div class="footer">
      <span class="account-type">
        <a
          href="javascript:void(0)"
          v-for="(item, index) in accountLink"
          :key="index"
          v-if="curKey !== index"
          @click="selectLink(index)"
        >{{item}}登录</a>
      </span>
      <span>
        <a v-show="curKey === 0" href="javascript:void(0)" @click="setForget()">忘记密码</a>
        <a v-show="curKey === 0" href="javascript:void(0)" @click="setReg()">注册</a>
      </span>
    </div>
  </Form>
</template>
<script>
export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: '账号不能为空', trigger: 'blur' }]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    },
    accountLink: {
      type: Array
    }
  },
  data() {
    return {
      form: {
        userName: '',
        password: ''
      },
      curKey: 0
    }
  },
  computed: {
    rules() {
      return {
        userName: this.userNameRules,
        password: this.passwordRules
      }
    }
  },
  methods: {
    selectLink(val) {
      this.curKey = val
      this.$emit('listenTitle', this.curKey)
    },
    setForget() {
      this.$emit('setConfig', 2)
    },
    setReg() {
      this.$emit('setConfig', 3)
    },
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 将用户名放到 store 中
          this.$store.commit('setUserName', this.form.userName)
          this.$emit('on-success-valid', {
            userName: this.form.userName,
            password: this.form.password,
            accountType: this.curKey
          })
        }
      })
    }
  }
}
</script>

<style>
.footer {
  text-align: right;
  display: flex;
  justify-content: space-between;
}
.footer span:nth-child(1) a {
  padding: 0px;
}
.footer a {
  padding-left: 10px;
  font-size: 12px;
}
/* .footer .account-type {
  float: left;
} */
</style>