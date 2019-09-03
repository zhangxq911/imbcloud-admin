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
        <a href="javascript:void(0)" @click="setForget()">忘记密码</a>
        <a href="javascript:void(0)" @click="setReg()">注册</a>
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
    }
  },
  data() {
    return {
      form: {
        userName: '',
        password: ''
      }
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
            password: this.form.password
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
}
.footer a {
  padding-left: 10px;
  font-size: 12px;
}
</style>