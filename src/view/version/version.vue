<template>
  <div style="background:#fff;">
    <div class="nav">
      <div class="navLeft">
        <Button @click="modal = true">添加版本</Button>
      </div>
      <div class="navRight">
        <Icon @click="refresh" class="refresh" type="md-refresh-circle" />
      </div>
    </div>
    <div style="padding: 10px;">
      <Table border :columns="columns" :data="tableData"></Table>
    </div>
    <Modal v-model="modal" title="添加版本" width="500">
      <Form ref="formValidate" :model="formItem" :label-width="120" :rules="ruleValidate">
        <FormItem prop="name" label="软件名称">
          <RadioGroup v-model="formItem.name">
            <Radio label="view">互动</Radio>
            <Radio label="direct">导播</Radio>
            <Radio label="device">直播机</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem prop="system" label="系统类别">
          <RadioGroup v-model="formItem.system">
            <Radio label="Android">Android</Radio>
            <Radio label="IOS">IOS</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem prop="ver" label="版本号">
          <Input v-model="formItem.ver"></Input>
        </FormItem>
        <FormItem label="升级内容">
          <Input type="textarea" v-model="formItem.content"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="ok">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getVersionList, addVersion, delVersion } from '@/api/data'

export default {
  name: 'version_page',
  data() {
    return {
      modal: false,
      formItem: {},
      tableData: [],
      columns: [
        {
          title: '编号',
          align: 'center',
          key: 'id'
        },
        {
          title: '软件名称',
          align: 'center',
          key: 'name',
          render(h, params) {
            let text = ''
            switch (params.row.name) {
              case 'view':
                text = '互动'
                break
              case 'direct':
                text = '导播'
                break
              case 'device':
                text = '直播机'
                break
              default:
                text = ''
            }
            return h('div', text)
          }
        },
        {
          title: '系统类别',
          align: 'center',
          key: 'system'
        },
        {
          title: '版本号',
          align: 'center',
          key: 'ver'
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'date'
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
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '信息',
                        content: '<p>确定删除？</p>',
                        onOk: () => {
                          this.remove(params.row.id)
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
      ruleValidate: {
        name: [
          {
            required: true,
            message: '这是必填字段',
            trigger: 'blur'
          }
        ],
        system: [
          {
            required: true,
            message: '这是必填字段',
            trigger: 'blur'
          }
        ],
        ver: [
          {
            required: true,
            message: '这是必填字段',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 刷新
    refresh() {
      this.getVersion()
      this.$Message.success('刷新成功')
    },
    // 删除
    remove(id) {
      let data = {id: id}
      delVersion(data).then(res => {
        this.$Message.success(res.data.msg)
        if (res.data.result == true) {
          this.getVersion()
        }
      })
    },
    // 添加提交
    ok() {
      this.$refs['formValidate'].validate(valid => {
        if (valid) {
          addVersion(this.formItem).then(res => {
            this.$Message.success(res.data.msg)
            if (res.data.result == true) {
              this.modal = false
              this.getVersion()
              this.$refs['formValidate'].resetFields()
            }
          })
        }
      })
    },
    // 获取列表信息
    getVersion(page = 1) {
      const data = { page: page }
      getVersionList(data).then(res => {
        this.tableData = res.data
      })
    }
  },
  mounted() {
    this.getVersion()
  }
}
</script>
