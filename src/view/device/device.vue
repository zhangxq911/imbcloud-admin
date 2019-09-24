<template>
  <div style="background:#fff;">
    <div class="nav">
      <div class="navLeft">
        <Button @click="modal = true">添加直播机</Button>
      </div>
      <div class="navRight">
        <Input
          v-model="search"
          @on-enter="handleSearch"
          placeholder="输入设备编号"
          style="width:200px; margin-right:10px;"
        />
        <Button type="primary" icon="ios-search" @click="handleSearch">搜索</Button>
        <Icon @click="refresh" class="refresh" type="md-refresh-circle" />
      </div>
    </div>
    <div style="padding: 10px;">
      <Table v-if="showTable" border :columns="columns" :data="tableData"></Table>
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
    <Modal v-model="modal" title="添加直播机" width="500">
      <Form ref="formValidate" :model="formItem" :label-width="120" :rules="ruleValidate">
        <FormItem label="直播机名称" prop="device_name">
          <Input v-model="formItem.device_name" placeholder="直播机名称"></Input>
        </FormItem>
        <FormItem label="直播机设备编号" prop="device_number">
          <Input v-model="formItem.device_number" placeholder="直播机设备编号"></Input>
        </FormItem>
        <FormItem label="频道所属账户" v-if="defAccount === 'admin'">
          <Select v-model="formItem.account" label-in-value @on-change="handleChange">
            <Option
              v-for="item in accountList"
              :key="item.account_id"
              :value="item.account_id"
            >{{ item.name }}</Option>
          </Select>
        </FormItem>
        <Input v-show="false" v-model="formItem.account" v-if="defAccount === 'unit'"></Input>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="ok">确定</Button>
      </div>
    </Modal>

    <Modal v-model="modal1" title="修改直播机" width="500">
      <Form ref="formValidate1" :model="formItem1" :label-width="120" :rules="ruleValidate">
        <FormItem label="直播机名称" prop="device_name">
          <Input v-model="formItem1.device_name" placeholder="直播机名称"></Input>
        </FormItem>
        <FormItem label="直播机设备编号" prop="device_number">
          <Input v-model="formItem1.device_number" placeholder="直播机设备编号"></Input>
        </FormItem>
        <FormItem label="频道所属账户">
          <Select v-model="formItem1.account_id" label-in-value @on-change="handleChange">
            <Option
              v-for="item in accountList"
              :key="item.account_id"
              :value="item.account_id"
            >{{ item.name }}</Option>
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
  getDevicePage,
  delDevice,
  getAccount,
  addDevice,
  modifyDevice
} from '@/api/data'
export default {
  name: 'device',
  data() {
    return {
      showTable: true,
      device_id: '',
      defAccount: '',
      formItem: {
        name: '',
        access_key_id: '',
        account: '',
        account_id: '',
        account_name: ''
      },
      formItem1: {
        name: '',
        access_key_id: '',
        account: '',
        account_id: '',
        account_name: ''
      },
      modal: false,
      modal1: false,
      search: '',
      columns: [
        {
          title: '直播机名称',
          align: 'center',
          key: 'device_name'
        },
        {
          title: '设备编号',
          align: 'center',
          key: 'device_number'
        },
        {
          title: '所属账户',
          align: 'center',
          key: 'account_name'
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'create_time'
        },
        {
          title: '设备状态',
          align: 'center',
          key: 'device_status',
          render(h, params) {
            let text = ''
            switch (params.row.device_status) {
              case 0:
                text = '离线'
                break
              case 1:
                text = '在线'
                break
              case 2:
                text = '直播中'
                break
              case -1:
                text = '禁用'
                break
              default:
                text = ''
            }
            return h('div', text)
          }
        },
        {
          title: '操作',
          align: 'center',
          key: 'account_id',
          render: (h, params) => {
            return h('div', [
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
                          this.remove(params.row.device_id)
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
        device_name: [
          {
            required: true,
            message: '这是必填字段',
            trigger: 'blur'
          }
        ],
        device_number: [
          {
            required: true,
            message: '这是必填字段',
            trigger: 'blur'
          }
        ]
      },
      accountList: []
    }
  },
  created() {
    let access = this.$store.state.user.access
    if (access.includes('admin')) {
      this.defAccount = 'admin'
    } else if (access.includes('unit')) {
      this.defAccount = 'unit'
    }
  },
  methods: {
    refresh() {
      this.getDevice()
      this.$Message.success('刷新成功')
    },
    changePage(page) {
      this.getDevice(page, '')
    },
    handleChange(data) {
      this.account_id = data.value
      this.account_name = data.label
    },
    getAccountList() {
      const data = { page: 1, validateCode: '' }
      getAccount(data).then(res => {
        this.accountList = res.data.accountList
        if (this.defAccount === 'unit') {
          this.formItem.account = this.accountList[0].account_id
          this.account_id = this.accountList[0].account_id
          this.account_name = this.accountList[0].name
          // this.formItem.account_name = this.accountList[0].name
        }
      })
    },
    handleSearch() {
      this.getDevice(1, this.search)
    },
    getDevice(page = 1, search = '') {
      const data = { page: page, deviceNumber: search }
      getDevicePage(data).then(res => {
        this.showTable = false
        this.$nextTick(() => {
          this.tableData = res.data.deviceLst
          this.pageData = res.data.PageInfo
          this.showTable = true
        })
      })
    },
    remove(id) {
      const arr = [id]
      const data = { deviceIds: arr }
      delDevice(data).then(res => {
        if (res.data.result == true) {
          this.$Message.success('删除成功')
          this.getDevice()
        }else {
          this.$Message.error(res.data.msg)
          this.getDevice()
        }
      })
    },
    edit(row) {
      const copyData = JSON.parse(JSON.stringify(row))
      copyData.device_name = `${copyData.device_name}`
      copyData.device_number = `${copyData.device_number}`
      copyData.account_id = `${copyData.account_id}`
      copyData.account_name = `${copyData.account_name}`
      this.formItem1 = copyData
      this.device_id = copyData.device_id
      this.modal1 = true
    },
    submitModify() {
      this.$refs['formValidate1'].validate(valid => {
        if (valid) {
          const formItem = this.formItem1
          const data = {
            device_name: formItem.device_name,
            device_number: formItem.device_number,
            account_id: formItem.account_id,
            account_name: formItem.account_name,
            device_id: this.device_id
          }
          modifyDevice(data).then(res => {
            this.$Message.success(res.data.msg)
            if (res.data.result == true) {
              this.modal1 = false
              this.getDevice()
            }
          })
        }
      })
    },
    ok() {
      this.$refs['formValidate'].validate(valid => {
        if (valid) {
          const formItem = this.formItem
          let data = {
            device_name: formItem.device_name,
            device_number: formItem.device_number,
            account_id: this.account_id,
            account_name: this.account_name
          }
          addDevice(data).then(res => {
            this.$Message.success(res.data.msg)
            if (res.data.result == true) {
              this.modal = false
              this.getDevice()
              this.$refs['formValidate'].resetFields()
            }
          })
        }
      })
    }
  },
  mounted() {
    this.getDevice()
    this.getAccountList()
  }
}
</script>
<style scoped>
footer {
  text-align: center;
  padding-top: 20px;
}
.nav {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #f4f4f4;
}
.nav button {
  margin-right: 10px;
}
</style>
