<template>
  <div style="background:#fff;">
    <div class="nav">
      <div class="navLeft" v-show="!delBar">
        <Button @click="addChannelNew">添加直播</Button>
        <Button @click="showDel">删除</Button>
      </div>
      <div class="navRight" v-show="!delBar">
        <Button @click="handleLive()" :type="live === '' ? 'success' : 'default'">全部</Button>
        <Button @click="handleLive(1)" :type="live === 1 ? 'success' : 'default'">正在直播</Button>
        <Button @click="handleLive(0)" :type="live === 0 ? 'success' : 'default'">预约直播</Button>
        <Button @click="handleLive(-1)" :type="live === -1 ? 'success' : 'default'">直播结束</Button>
        <Input
          v-model="value"
          placeholder="输入频道id"
          style="width:200px;margin-right:10px;"
          @on-enter="handleSearch"
        />
        <Button type="success" icon="ios-search" @click="handleSearch">搜索</Button>
        <Icon @click="refresh" class="refresh" type="md-refresh-circle" />
      </div>
      <!-- 删除 bar -->
      <div class="navLeft" v-show="delBar">
        <Button @click="delAllChannel">删除选中</Button>
        <Button @click="showNoraml">关闭</Button>
        <span>
          已选中
          <span class="selectNum">{{ selectNum }}</span>个直播
        </span>
      </div>
    </div>
    <div class="con">
      <videoItem
        @sendChannelIdsList="getChannelIdsList"
        @sendSelectList="getSelectList"
        v-for="(item, index) in channelList"
        :key="item.channel_id"
        :start_time="item.start_time"
        :channel_id="item.channel_id"
        :name="item.name"
        :online_user_num="item.online_user_num"
        :live_status="item.live_status"
        :isDelStatus="isDelStatus"
        :selectList="selectList"
        :index="index"
        :delChannelList="delChannelList"
      />
      <Page
        v-show="channelList.length != 0"
        :current.sync="pageData.page"
        :page-size="pageData.perPage"
        :total="pageData.totalCount"
        @on-change="changePage"
      />
      <h3 v-show="channelList.length == 0">当前没有频道内容哦，请选择其他条件查看！</h3>
    </div>
    <Modal v-model="modal" title="添加直播" width="700">
      <Form ref="formValidate" :model="formChannel" :label-width="200" :rules="ruleValidate">
        <FormItem label="频道id">
          <InputNumber style="width: 100%;" :min="1" :max="9999999999" v-model="formChannel.channel_id" placeholder="频道id为空时自动生成"></InputNumber>
        </FormItem>
        <FormItem label="频道名称" prop="name">
          <Input v-model="formChannel.name" placeholder="频道名称"></Input>
        </FormItem>
        <FormItem label="开始时间" prop="start_time">
          <DatePicker
            v-model="formChannel.start_time"
            :start-date="startDate"
            :editable="false"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            placeholder="开始时间"
            style="width: 200px"
            @on-ok="datePickerOk('formChannel', 'start_time')"
          ></DatePicker>
        </FormItem>
        <FormItem label="结束时间" prop="end_time">
          <DatePicker
            v-model="formChannel.end_time"
            :start-date="startDate"
            :editable="false"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            placeholder="结束时间"
            @on-ok="datePickerOk('formChannel', 'end_time')"
            style="width: 200px"
          ></DatePicker>
        </FormItem>
        <FormItem label="频道所属账户" prop="account_name" v-if="defAccount === 'admin'">
          <Input
            readonly
            v-model="formChannel.account_name"
            placeholder="点击选择"
            @on-focus="getAccount"
          ></Input>
          <Icon class="addIcon" type="md-add"/>
        </FormItem>
        <Input v-show="false" v-if="defAccount === 'unit'" v-model="formChannel.account_name"></Input>
        <FormItem label="频道所属直播机设备" prop="device_name">
          <Input readonly v-model="formChannel.device_name" placeholder="点击选择" @on-focus="getLive"></Input>
          <Icon class="addIcon" type="md-add"/>
        </FormItem>
      </Form>
      <!-- 官方提供的on-ok方法会导致modal自动关闭，校验出错也关闭，手动写 -->
      <div slot="footer">
        <Button type="primary" @click="ok">确定</Button>
      </div>
    </Modal>
    <Modal v-model="modalAccount" :scrollable="true" title="账户选择">
      <Table style="margin-top:20px;" border :columns="accountColumns" :data="accountList"></Table>
      <h3 v-show="accountList.length == 0">当前没有账户可进行选择，请选择先添加账户！</h3>
      <div slot="footer">
        <Page
          v-show="accountList.length != 0"
          :current.sync="pageAccountData.page"
          :page-size="pageAccountData.perPage"
          :total="pageAccountData.totalCount"
          @on-change="changeAccountPage"
        />
      </div>
    </Modal>
    <Modal v-model="modalLive" :scrollable="true" title="直播机选择">
      <Table style="margin-top:20px;" border :columns="liveColumns" :data="liveList"></Table>
      <h3 v-show="liveList.length == 0">当前没有直播机可进行选择，请选择先添加直播机！</h3>
      <div slot="footer">
        <Page
          v-show="liveList.length != 0"
          :current.sync="pageLiveData.page"
          :page-size="pageLiveData.perPage"
          :total="pageLiveData.totalCount"
          @on-change="changeLivePage"
        />
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  getChannelPage,
  addChannel,
  delChannel,
  getAccount,
  getDevicePage
} from '@/api/data'
import videoItem from '../video-item/video-item'
import { parseTime } from '@/libs/tools.js'
// import accountSelect from '../components/account-select/account-select'
export default {
  name: 'channel',
  components: {
    videoItem
  },
  data() {
    const validateName = (rule, value, callback) => {
      if (value && value.length > 16) {
        callback(new Error('最多16个字符'))
      }else if(!value) {
        callback(new Error('这是必填字段'))
      } else {
        callback()
      }
    }

    return {
      isDelStatus: false,
      selectList: [],
      startDate: new Date(),
      value: '',
      live: '',
      channelList: [],
      delChannelList: [],
      modal: false,
      selectNum: 0,
      pageData: {},
      pageAccountData: {},
      pageLiveData: {},
      symbol: '',
      delBar: false,
      modalAccount: false,
      modalLive: false,
      liveList: [],
      accountList: [],
      formChannel: {
        channel_id: null,
        name: '',
        start_time: '',
        end_time: '',
        account_id: '',
        account_name: '',
        device_id: '',
        device_name: ''
      },
      defAccount: '',
      liveColumns: [
        {
          title: '直播机名称',
          key: 'device_name'
        },
        {
          title: '设备编号',
          key: 'device_number'
        },
        {
          title: '设备状态',
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
          render: (h, params) => {
            return h(
              'Button',
              {
                on: {
                  click: () => {
                    // 选择当前信息后关闭模态框
                    this.formChannel.device_name = params.row.device_name
                    this.formChannel.device_id = params.row.device_id
                    this.modalLive = false
                  }
                }
              },
              '选择'
            )
          }
        }
      ],
      accountColumns: [
        {
          title: '账户名称',
          key: 'name'
        },
        {
          title: '校验id',
          key: 'access_key_secret'
        },
        {
          title: '账户类型',
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
          title: '操作',
          render: (h, params) => {
            return h(
              'Button',
              {
                on: {
                  click: () => {
                    // 选择当前信息后关闭模态框
                    this.formChannel.account_id = params.row.account_id
                    this.formChannel.account_name = params.row.name
                    this.modalAccount = false
                  }
                }
              },
              '选择'
            )
          }
        }
      ],
      ruleValidate: {
        name: [
          {
            required: true,
            validator: validateName,
            trigger: 'blur'
          }
        ],
        start_time: [
          {
            required: true,
            type: 'date',
            message: '这是必填字段',
            trigger: 'change'
          }
        ],
        end_time: [
          {
            required: true,
            type: 'date',
            message: '这是必填字段',
            trigger: 'change'
          }
        ],
        account_name: [
          {
            required: true,
            message: '这是必填字段',
            trigger: 'change'
          }
        ],
        device_name: [
          {
            required: true,
            message: '这是必填字段',
            trigger: 'change'
          }
        ]
      }
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
    // 刷新
    refresh() {
      this.getChannel('', this.live, 1)
      this.$Message.success('刷新成功')
    },
    // 修改选中项
    getSelectList(params) {
      this.selectList = params
    },
    // 默认时间确认
    datePickerOk(key, name) {
      if (!this[key][name]) {
        this[key][name] = this.startDate
      }
    },
    addChannelNew() {
      // 添加直播，加载账户分页
      this.modal = true
      this.getAccountPage()
    },
    getDevice(page = 1) {
      // 直播机选择分页
      const data = { page: page, deviceNumber: '' }
      getDevicePage(data).then(res => {
        this.liveList = res.data.deviceLst
        this.pageLiveData = res.data.PageInfo
      })
    },
    changeAccountPage(res) {
      // 账户选择分页
      this.getAccountPage('', '', res)
    },
    changeLivePage(res) {
      this.getDevice(res)
    },
    getAccountPage(page = 1) {
      // 获取账户列表
      const data = { page: page }
      getAccount(data).then(res => {
        this.accountList = res.data.accountList
        this.pageAccountData = res.data.pageData
        if (this.defAccount === 'unit') {
          this.formChannel.account_id = res.data.accountList[0].account_id
          this.formChannel.account_name = res.data.accountList[0].name
        }
      })
    },
    getLive() {
      // 频道直播机获取
      this.modalLive = true
    },
    getAccount() {
      // 频道所属账户获取
      this.modalAccount = true
    },
    getChannel(filter = '', live = '', page = 1) {
      // filter 频道号码 live 直播状态 page 页码
      const data = { page, filter, live }
      getChannelPage(data).then(res => {
        this.pageData = res.data.pageData
        this.channelList = res.data.channelList
      })
    },
    handleSearch() {
      this.live = ''
      this.getChannel(this.value)
    },
    handleLive(live = '') {
      this.live = live
      this.getChannel('', live)
      // 清空选中数据
      this.delChannelList = []
      this.selectNum = 0
    },
    ok() {
      this.$refs['formValidate'].validate(valid => {
        if (valid) {
          const formChannel = this.formChannel
          let data = {
            channel_id: formChannel.channel_id ? formChannel.channel_id : '',
            name: formChannel.name,
            start_time: parseTime(formChannel.start_time),
            end_time: parseTime(formChannel.end_time),
            account_id: formChannel.account_id,
            account_name: formChannel.account_name,
            device_id: formChannel.device_id,
            device_name: formChannel.device_name
          }
          addChannel(data).then(res => {
            this.$Message.success(res.data.msg)
            if (res.data.result == true) {
              this.modal = false
              this.getChannel()
              this.$refs['formValidate'].resetFields()
            }
          })
        } else {
          this.$Message.error('校验失败，请重新填写！')
        }
      })
    },
    getChannelIdsList(channelParams) {
      this.delChannelList = channelParams
      this.selectNum = this.delChannelList.length
    },
    delAllChannel() {
      let data = { channelIds: this.delChannelList }
      if (this.delChannelList.length === 0) {
        this.$Message.error('请选择要删除的频道！')
        return
      }
      delChannel(data).then(res => {
        this.$Message.success(res.data.msg)
        if (res.data.result == true) {
          this.getChannel()
          // 清空选中数组
          this.selectNum = 0
          this.selectList = []
        }
      })
    },
    changePage(res) {
      this.getChannel('', '', res)
    },
    showDel() {
      this.delChannelList = []
      this.selectNum = 0
      this.selectList = []
      this.isDelStatus = true
      this.delBar = !this.delBar
    },
    showNoraml() {
      this.selectNum = 0
      this.delChannelList = []
      this.isDelStatus = false
      this.selectList = []
      this.delBar = !this.delBar
    }
  },
  mounted() {
    this.getChannel()
    // this.getAccountPage()
    this.getDevice()
  }
}
</script>
<style scoped>
.selectNum {
  color: #e74c3c;
  padding: 0 4px;
}
.con {
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
}
.con > h3 {
  width: 100%;
  text-align: center;
  color: #ccc;
}
.con .ivu-page {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.addIcon {
  position: absolute;
  font-size: 20px;
  color: #ccc;
  right: 4px;
  top: 6px;
}
</style>