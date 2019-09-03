<template>
  <div style="background:#fff;">
    <div class="nav">
      <div class="navLeft">
        <Button @click="modal = true">添加账户</Button>
      </div>
      <div class="navRight">
        <Input
          v-model="search"
          @on-enter="handleSearch"
          placeholder="输入校验ID"
          style="width:200px; margin-right:10px;"
        />
        <Button type="success" icon="ios-search" @click="handleSearch">搜索</Button>
        <Icon @click="refresh" class="refresh" type="md-refresh-circle" />
      </div>
    </div>
    <div style="padding: 10px;">
      <Table border :columns="columns" :data="tableData"></Table>
      <footer>
        <Page
          v-show="tableData.length != 0"
          :current.sync="pageData.page"
          :page-size="pageData.perPage"
          :total="pageData.totalCount"
          @on-change="changePage"
        />
      </footer>
    </div>
    <Modal v-model="modal" title="添加账户" width="600">
      <div style="max-height: 458px; overflow: auto;">
        <Form ref="formValidate" :model="formItem" :label-width="100" :rules="ruleValidate">
          <FormItem label="账户名称" prop="name">
            <Input v-model="formItem.name" placeholder="账户名称"></Input>
          </FormItem>
          <FormItem label="校验ID" prop="access_key_id">
            <Input v-model="formItem.access_key_id" placeholder="校验ID"></Input>
          </FormItem>
          <FormItem label="校验码" prop="access_key_secret">
            <Input v-model="formItem.access_key_secret" placeholder="校验码"></Input>
          </FormItem>
          <FormItem label="手机号码" prop="mobile">
            <Input v-model="formItem.mobile" placeholder="手机号码"></Input>
          </FormItem>
          <FormItem prop="email" label="邮箱">
            <Input v-model="formItem.email" placeholder="邮箱"></Input>
          </FormItem>
          <FormItem label="直播人数上限" prop="ver_ulimit">
            <Input v-model="formItem.ver_ulimit" placeholder="直播人数上限"></Input>
          </FormItem>
          <FormItem label="频道并发上限" prop="channel_ulimit">
            <Input v-model="formItem.channel_ulimit" placeholder="频道并发上限"></Input>
          </FormItem>
          <FormItem label="起始日期" prop="ver_start_date">
            <DatePicker
              v-model="formItem.ver_start_date"
              :start-date="startDate"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              placeholder="起始日期"
              :editable="false"
              style="width: 200px"
              :options="options"
              @on-ok="datePickerOk('formItem', 'ver_start_date')"
            ></DatePicker>
          </FormItem>
          <FormItem label="截至日期" prop="ver_end_date">
            <DatePicker
              v-model="formItem.ver_end_date"
              :start-date="startDate"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              placeholder="截至日期"
              :options="options"
              :editable="false"
              style="width: 200px"
              @on-ok="datePickerOk('formItem', 'ver_end_date')"
            ></DatePicker>
          </FormItem>
          <FormItem label="认证类型">
            <Select v-model="formItem.identity">
              <Option value="0">未认证</Option>
              <Option value="1">个人认证</Option>
              <Option value="2">企业认证</Option>
            </Select>
          </FormItem>
          <FormItem label="账户版本">
            <Select v-model="formItem.version">
              <Option value="-1">试用版</Option>
              <Option value="0">基础版</Option>
              <Option value="1">标准版</Option>
              <Option value="2">企业版</Option>
            </Select>
          </FormItem>
          <FormItem label="账户类型">
            <Select v-model="formItem.type">
              <Option value="unit">注册用户</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" @click="ok">确定</Button>
      </div>
    </Modal>

    <Modal v-model="modal1" title="编辑账户" width="600">
      <Form ref="formValidate1" :model="formItem1" :label-width="100" :rules="ruleValidate1">
        <FormItem label="账户名称" prop="name">
          <Input v-model="formItem1.name" placeholder="账户名称"></Input>
        </FormItem>
        <FormItem label="校验ID">
          <Input disabled v-model="formItem1.access_key_id" placeholder="校验ID"></Input>
        </FormItem>
        <FormItem label="校验码" prop="access_key_secret">
          <Input v-model="formItem1.access_key_secret" placeholder="校验码"></Input>
        </FormItem>
        <FormItem label="手机号码" prop="mobile">
          <Input v-model="formItem1.mobile" placeholder="手机号码"></Input>
        </FormItem>
        <FormItem prop="email" label="邮箱">
          <Input v-model="formItem1.email" placeholder="邮箱"></Input>
        </FormItem>
        <FormItem label="直播人数上限" prop="ver_ulimit">
          <Input v-model="formItem1.ver_ulimit" placeholder="直播人数上限"></Input>
        </FormItem>
        <FormItem label="频道并发上限" prop="channel_ulimit">
          <Input v-model="formItem1.channel_ulimit" placeholder="频道并发上限"></Input>
        </FormItem>
        <FormItem label="起始日期" prop="ver_start_date">
          <DatePicker
            v-model="formItem1.ver_start_date"
            :start-date="startDate"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            :editable="false"
            placeholder="起始日期"
            :options="options"
            @on-ok="datePickerOk('formItem1', 'ver_start_date')"
            style="width: 200px"
          ></DatePicker>
        </FormItem>
        <FormItem label="截至日期" prop="ver_end_date">
          <DatePicker
            v-model="formItem1.ver_end_date"
            :start-date="startDate"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            placeholder="截至日期"
            :editable="false"
            :options="options"
            @on-ok="datePickerOk('formItem1', 'ver_end_date')"
            style="width: 200px"
          ></DatePicker>
        </FormItem>
        <FormItem label="认证类型">
          <Select v-model="formItem1.identity">
            <Option value="0">未认证</Option>
            <Option value="1">个人认证</Option>
            <Option value="2">企业认证</Option>
          </Select>
        </FormItem>
        <FormItem label="账户版本">
          <Select v-model="formItem1.version">
            <Option value="-1">试用版</Option>
            <Option value="0">基础版</Option>
            <Option value="1">标准版</Option>
            <Option value="2">企业版</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="submitModify">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  getAccount,
  stopAccount,
  startAccount,
  delAccount,
  addAccount,
  modifyAccount
} from '@/api/data'
import { parseTime } from '@/libs/tools.js'
export default {
  name: 'user',
  data() {
    const validateLimit = (rule, value, callback) => {
      if (value === undefined || value === '') {
        callback(new Error('这是必填字段'))
      } else {
        callback()
      }
    }

    const validateMobile = (rule, value, callback) => {
      const reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/
      if (value === undefined || value === '') {
        callback(new Error('这是必填字段'))
      } else if (!reg.test(value)) {
        callback(new Error('手机号格式不正确'))
      } else {
        callback()
      }
    }

    const validateEmail = (rule, value, callback) => {
      // 邮箱校验 只允许英文字母、数字、下划线、英文句号、以及中划线组成
      const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      // ^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$
      // 名称允许汉字、字母、数字，域名只允许英文域名
      if (value && !reg.test(value)) {
        callback(new Error('邮箱格式不正确'))
      } else {
        callback()
      }
    }

    const validateId = (rule, value, callback) => {
      const reg = /^[a-zA-Z][a-zA-Z0-9_]*$/
      if (value === undefined) {
        callback(new Error('这是必填字段'))
      } else if (!reg.test(value) || value.length < 6 || value.length > 16) {
        callback(new Error('字母开头,长度在6-16之间的字符,数字和下划线'))
      } else {
        callback()
      }
    }

    const validateName = (rule, value, callback) => {
      const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
      if (value === undefined) {
        callback(new Error('这是必填字段'))
      } else if (!reg.test(value) || value.length < 4 || value.length > 16) {
        callback(new Error('长度在4-16之间的字符,数字,字母,中文和下划线'))
      } else {
        callback() // 不管结果如何都要返回一个值，不然就一直校验中，无法提交了。
      }
    }

    const validateSecret = (rule, value, callback) => {
      const reg = /^[a-zA-Z][a-zA-Z0-9_]*$/
      if (value === undefined) {
        callback(new Error('这是必填字段'))
      } else if (!reg.test(value) || value.length < 6 || value.length > 16) {
        callback(new Error('字母开头,长度在6-16之间的字符,数字和下划线'))
      } else {
        callback()
      }
    }

    return {
      startDate: new Date(),
      options: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      secret_old: '',
      formItem: {
        name: '',
        access_key_id: '',
        access_key_secret: '',
        mobile: '',
        email: '',
        ver_ulimit: 100,
        channel_ulimit: '',
        ver_start_date: '',
        ver_end_date: '',
        version: '-1',
        identity: '0',
        type: 'unit'
      },
      formItem1: {
        name: '',
        access_key_id: '',
        access_key_secret: '',
        mobile: '',
        email: '',
        ver_ulimit: '',
        channel_ulimit: '',
        ver_start_date: '',
        ver_end_date: '',
        version: '',
        identity: '',
        type: ''
      },
      modal: false,
      modal1: false,
      search: '',
      columns: [
        {
          title: '账户名称',
          align: 'center',
          key: 'name'
        },
        {
          title: '校验id',
          align: 'center',
          key: 'access_key_id'
        },
        {
          title: '账户类型',
          align: 'center',
          key: 'type',
          render(h, params) {
            let text = ''
            switch (params.row.type) {
              case 'admin':
                text = '管理员'
                break
              case 'unit':
                text = '注册用户'
                break
              case 'user':
                text = '普通用户'
                break
              case 'direct':
                text = '导播用户'
                break
              case 'device':
                text = '直播机账户'
                break
              default:
                text = ''
            }
            return h('div', text)
          }
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'create_time'
        },
        {
          title: '起始时间',
          key: 'ver_start_date',
          align: 'center'
        },
        {
          title: '截至时间',
          key: 'ver_end_date',
          align: 'center'
        },
        {
          title: '账户版本',
          key: 'version',
          align: 'center',
          render(h, params) {
            let text = ''
            switch (params.row.version) {
              case -1:
                text = '试用版'
                break
              case 0:
                text = '基础版'
                break
              case 1:
                text = '标准版'
                break
              case 2:
                text = '企业版'
                break
              default:
                text = ''
            }
            return h('div', text)
          }
        },
        {
          title: '认证类型',
          align: 'center',
          key: 'identity',
          render(h, params) {
            let text = ''
            switch (params.row.identity) {
              case 0:
                text = '未认证'
                break
              case 1:
                text = '个人认证'
                break
              case 2:
                text = '企业认证'
                break
              default:
                text = ''
            }
            return h('div', text)
          }
        },
        {
          title: '账户状态',
          key: 'status',
          align: 'center',
          render(h, params) {
            let text = ''
            switch (params.row.status) {
              case 0:
                text = '停用'
                break
              case 1:
                text = '启用'
                break
              default:
                text = ''
            }
            return h(
              'Button',
              {
                props: {
                  type: params.row.status == 1 ? 'success' : 'error',
                  size: 'small'
                },
                style: {
                  cursor: 'default'
                }
              },
              text
            )
          }
        },
        {
          title: '操作',
          align: 'center',
          key: 'account_id',
          width: 168,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: params.row.status == 1 ? 'warning' : 'success',
                    size: 'small'
                  },
                  style: {
                    marginRight: '3px'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '信息',
                        content:
                          params.row.status == 1
                            ? '<p>确定停用？</p>'
                            : '<p>确定启用？</p>',
                        onOk: () => {
                          params.row.status == 1
                            ? this.stop(params.row.account_id)
                            : this.start(params.row.account_id)
                        },
                        onCancel: () => {
                          return
                        }
                      })
                    }
                  }
                },
                params.row.status == 1 ? '停用' : '启用'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  style: {
                    marginRight: '3px'
                  },
                  on: {
                    click: () => {
                      this.edit(params.row)
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '信息',
                        content: '<p>确定删除？</p>',
                        onOk: () => {
                          this.remove(params.row.account_id)
                        },
                        onCancel: () => {
                          return
                        }
                      })
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      tableData: [],
      pageData: {},
      ruleValidate: {
        name: [
          {
            required: true,
            validator: validateName,
            trigger: 'blur'
          }
        ],
        access_key_id: [
          {
            required: true,
            validator: validateId,
            trigger: 'blur'
          }
        ],
        access_key_secret: [
          {
            required: true,
            validator: validateSecret,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            validator: validateMobile,
            trigger: 'blur'
          }
        ],
        ver_ulimit: [
          { required: true, validator: validateLimit, trigger: 'blur' }
        ],
        email: [{ validator: validateEmail, trigger: 'blur' }],
        channel_ulimit: [
          {
            required: true,
            message: '这是必填字段',
            trigger: 'blur'
          }
        ],
        ver_start_date: [
          {
            required: true,
            type: 'date',
            message: '这是必填字段',
            trigger: 'change'
          }
        ],
        ver_end_date: [
          {
            required: true,
            type: 'date',
            message: '这是必填字段',
            trigger: 'change'
          }
        ]
      },
      ruleValidate1: {
        name: [
          {
            required: true,
            validator: validateName,
            trigger: 'blur'
          }
        ],
        access_key_secret: [
          {
            required: true,
            validator: validateSecret,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            validator: validateMobile,
            trigger: 'blur'
          }
        ],
        ver_ulimit: [
          {
            required: true,
            message: '这是必填字段',
            trigger: 'blur'
          }
        ],
        email: [{ validator: validateEmail, trigger: 'blur' }],
        channel_ulimit: [
          {
            required: true,
            message: '这是必填字段',
            trigger: 'blur'
          }
        ],
        ver_start_date: [
          {
            required: true,
            type: 'date',
            message: '这是必填字段',
            trigger: 'change'
          }
        ],
        ver_end_date: [
          {
            required: true,
            type: 'date',
            message: '这是必填字段',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    // 刷新
    refresh() {
      this.getAccountPage()
      this.$Message.success('刷新成功')
    },
    // 默认时间确认
    datePickerOk(key, name) {
      if (!this[key][name]) {
        this[key][name] = this.startDate
      }
    },
    // 分页修改
    changePage(page) {
      this.getAccountPage(page, '')
    },
    handleSearch() {
      this.getAccountPage(1, this.search)
    },
    getAccountPage(page = 1, search = '') {
      const data = { page: page, validateCode: search }
      getAccount(data).then(res => {
        this.tableData = res.data.accountList
        this.pageData = res.data.pageData
      })
    },
    stop(id) {
      const data = { account_id: id }
      stopAccount(data).then(res => {
        if (res.data.result == true) {
          this.$Message.success('停用成功')
          this.getAccountPage()
        }
      })
    },
    start(id) {
      const data = { account_id: id }
      startAccount(data).then(res => {
        if (res.data.result == true) {
          this.$Message.success('启用成功')
          this.getAccountPage()
        }
      })
    },
    remove(id) {
      const arr = [id]
      const data = { accountIds: arr }
      delAccount(data).then(res => {
        if (res.data.result == true) {
          this.$Message.success('删除成功')
          this.getAccountPage()
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    edit(row) {
      const copyData = JSON.parse(JSON.stringify(row))
      copyData.identity = `${copyData.identity}`
      copyData.version = `${copyData.version}`
      copyData.ver_ulimit = `${copyData.ver_ulimit}`
      copyData.channel_ulimit = `${copyData.channel_ulimit}`
      this.secret_old = copyData.access_key_secret
      this.formItem1 = copyData
      this.modal1 = true
    },
    submitModify() {
      this.$refs['formValidate1'].validate(valid => {
        if (valid) {
          const formItem = this.formItem1
          const data = {
            name: formItem.name,
            access_key_secret: formItem.access_key_secret,
            mobile: formItem.mobile,
            email: formItem.email,
            ver_ulimit: formItem.ver_ulimit,
            channel_ulimit: formItem.channel_ulimit,
            ver_start_date: parseTime(formItem.ver_start_date),
            ver_end_date: parseTime(formItem.ver_end_date),
            version: formItem.version,
            identity: formItem.identity,
            secret_old: formItem.secret_old,
            account_id: formItem.account_id,
            access_key_id: formItem.access_key_id
          }
          modifyAccount(data).then(res => {
            this.$Message.success(res.data.msg)
            if (res.data.result == true) {
              this.modal1 = false
              this.getAccountPage()
            }
            this.formItem1 = {}
          })
        }
      })
    },
    ok() {
      this.$refs['formValidate'].validate(valid => {
        if (valid) {
          const formItem = this.formItem
          let data = {
            name: formItem.name,
            access_key_id: formItem.access_key_id,
            access_key_secret: formItem.access_key_secret,
            mobile: formItem.mobile,
            email: formItem.email,
            ver_ulimit: formItem.ver_ulimit,
            channel_ulimit: formItem.channel_ulimit,
            ver_start_date: parseTime(formItem.ver_start_date),
            ver_end_date: parseTime(formItem.ver_end_date),
            version: formItem.version,
            identity: formItem.identity,
            type: formItem.type
          }
          addAccount(data).then(res => {
            this.$Message.success(res.data.msg)
            if (res.data.result == true) {
              this.modal = false
              this.getAccountPage()
              this.$refs['formValidate'].resetFields()
            }
          })
        }
      })
    }
  },
  mounted() {
    this.getAccountPage()
  }
}
</script>
<style scoped>
footer {
  text-align: center;
  padding-top: 20px;
}
</style>
