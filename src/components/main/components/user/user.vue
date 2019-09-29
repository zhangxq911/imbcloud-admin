<template>
  <div class="user-avator-dropdown">
    <Dropdown trigger="click" @on-click="handleClick">
      <!-- <Badge :dot="!!messageUnreadCount"> -->
      <Badge>
        <!-- <Avatar :src="userAvator"/> -->
        <Avatar style="background-color: #999999" icon="ios-person" />
        {{ userName }}
      </Badge>

      <Icon v-if="!freeSecret" :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu v-if="!freeSecret" slot="list">
        <DropdownItem v-if="accountSource === 0" name="changePwd">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Modal v-model="modal" title="修改密码">
      <Form ref="formPwd" :model="formPwd" :rules="ruleValidate" :label-width="120">
        <FormItem label="账户名称">{{this.$store.state.user.accountName}}</FormItem>
        <FormItem label="原密码" prop="oldPassword">
          <Input type="password" v-model="formPwd.oldPassword" placeholder="请输入原密码"></Input>
        </FormItem>
        <FormItem label="新密码" prop="newPassword">
          <Input type="password" v-model="formPwd.newPassword" placeholder="请输入新密码"></Input>
        </FormItem>
        <FormItem label="确认新密码" prop="confirmPassword">
          <Input type="password" v-model="formPwd.confirmPassword" placeholder="请确认新密码"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="submit">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import { modifyPassword } from '@/api/data'
export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    const newPassword = (rule, value, callback) => {
      const reg = /^[a-zA-Z][a-zA-Z0-9_]*$/
      if (value === undefined) {
        callback(new Error('这是必填字段'))
      } else if (!reg.test(value) || value.length < 6 || value.length > 16) {
        callback(new Error('字母开头,长度在6-16之间的字符,数字和下划线'))
      } else {
        callback()
      }
    }

    const confirmPassword = (rule, value, callback) => {
      if (value === undefined) {
        callback(new Error('密码确认不能为空'))
      } else if (
        value === this.formPwd.newPassword ||
        value === this.formPwd.confirmPassword
      ) {
        callback()
      } else {
        callback(new Error('两次输入密码不一致!'))
      }
    }

    return {
      freeSecret: false,
      userName: '',
      accountSource: -1,
      modal: false,
      formPwd: {},
      ruleValidate: {
        oldPassword: [
          { required: true, message: '原密码不能为空', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, validator: newPassword, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: confirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.userName = this.$store.state.user.accountName
    this.accountSource = this.$store.state.user.accountSource
    this.freeSecret = this.$store.state.user.freeSecret
  },
  methods: {
    submit() {
      this.formPwd.accountId = this.$store.state.user.accountId
      this.formPwd.accountName = this.$store.state.user.accountName
      this.$refs['formPwd'].validate(valid => {
        if (valid) {
          modifyPassword(this.formPwd).then(res => {
            if (res.data.result) {
              this.$Message.success(res.data.msg)
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    },
    changePwd() {
      this.modal = true
    },
    ...mapActions(['handleLogOut']),
    logout() {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    handleClick(name) {
      switch (name) {
        case 'logout':
          this.logout()
          break
        case 'changePwd':
          this.changePwd()
          break
      }
    }
  }
}
</script>
