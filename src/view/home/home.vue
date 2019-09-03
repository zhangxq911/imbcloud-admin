<template>
  <div>
    <div class="top">
      <h2>
        直播概述
        <Icon style="font-size: 30px;" @click="refresh" class="refresh" type="md-refresh-circle"/>
      </h2>
      <div class="flex">
        <div class="txt">
          <h3>最高并发</h3>
          <h4>
            <!-- <count-to
              style="display: inline-block;"
              :end="maximumConcurrent "
              count-class="count-style"
            />人-->
            {{maximumConcurrent}} 人
          </h4>
        </div>
        <div class="txt">
          <h3>累计直播次数</h3>
          <h4>
            <!-- <count-to
              style="display: inline-block;"
              :end="cumulativeLiveNum "
              count-class="count-style"
            />个-->
            {{cumulativeLiveNum}} 个
          </h4>
        </div>
        <div class="txt">
          <h3>累计观众人数</h3>
          <h4>
            <!-- <count-to
              style="display: inline-block;"
              :end="cumulativeWatchNum "
              count-class="count-style"
            />人-->
            {{cumulativeWatchNum}} 人
          </h4>
        </div>
        <Chart-bar
          v-if="isBarData"
          style="width:400px;height:230px;"
          :value="barData"
          text="最近直播观众人数"
        />
      </div>
    </div>
    <div class="bottom">
      <h2>正在直播</h2>
      <div class="flex" style="margin-top:20px;">
        <videoItem
          v-for="(item, index) in channelList"
          @sendSelectList="getSelectList"
          :key="item.channel_id"
          :start_time="item.start_time"
          :channel_id="item.channel_id"
          :name="item.name"
          :online_user_num="item.online_user_num"
          :live_status="item.live_status"
          :index="index"
          :selectList="selectList"
        />
        <Page
          v-show="channelList.length != 0"
          :current.sync="pageData.page"
          :page-size="pageData.perPage"
          :total="pageData.totalCount"
          @on-change="changePage"
        />
        <h3
          style="width: 100%; text-align: center; height: 30px; color: #ccc;"
          v-show="channelList.length === 0"
        >当前没有直播信息！</h3>
      </div>
    </div>
  </div>
</template>
<script>
import { ChartBar } from '_c/charts'
import videoItem from '../video-item/video-item'
import { getLiveSummaryInfo, getChannelPage } from '@/api/data'
import CountTo from '_c/count-to'
export default {
  name: 'home',
  components: {
    ChartBar,
    videoItem,
    CountTo
  },
  data() {
    return {
      barData: {},
      isBarData: false,
      maximumConcurrent: 0,
      cumulativeLiveNum: 0,
      cumulativeWatchNum: 0,
      pageData: {},
      channelList: [],
      selectList: []
    }
  },
  methods: {
    refresh() {
      this.getLiveSummary()
      this.$Message.success('刷新成功')
    },
    // 修改选中项
    getSelectList(params) {
      this.selectList = params
    },
    getChannel(filter = '', live = 1, page = 1) {
      // filter 频道号码 live 直播状态 page 页码
      const data = { page, filter, live }
      getChannelPage(data).then(res => {
        this.pageData = res.data.pageData
        this.channelList = res.data.channelList
      })
    },
    changePage(res) {
      this.getChannel('', 1, res)
    },
    getLiveSummary() {
      getLiveSummaryInfo(this.$store.state.user.token).then(res => {
        res.data.maximumConcurrent
          ? (this.maximumConcurrent = res.data.maximumConcurrent)
          : 0
        res.data.cumulativeLiveNum
          ? (this.cumulativeLiveNum = res.data.cumulativeLiveNum)
          : 0
        res.data.cumulativeWatchNum
          ? (this.cumulativeWatchNum = res.data.cumulativeWatchNum)
          : 0
        // this.cumulativeLiveNum = res.data.cumulativeLiveNum
        // this.cumulativeWatchNum = res.data.cumulativeWatchNum
        // 最近直播观众人数
        if (res.data.liveInfoVOs !== null) {
          for (let item of res.data.liveInfoVOs) {
            this.barData[item.liveTime] = item.cumulativeWatchNum
          }
        }
        this.isBarData = true
      })
    }
  },
  mounted() {
    this.getLiveSummary()
    // 获取正在直播信息
    this.getChannel()
  }
}
</script>
<style scoped>
.top {
  /* height: 240px; */
  background: #fff;
  padding-top: 20px;
  padding-left: 30px;
}

.top h2,
.top h3,
.bottom h2 {
  font-weight: normal;
}

.flex {
  display: flex;
  flex-wrap: wrap;
}

.txt {
  text-align: center;
  height: 80px;
  flex: 1;
  margin: 36px 18px;
  min-width: 100px;
}

.txt h3 {
  margin-bottom: 26px;
}

.txt h4 {
  color: #0361a9;
  font-size: 20px;
  font-weight: normal;
}

.bottom {
  background: #fff;
  padding-top: 20px;
  padding-left: 30px;
  margin-top: 15px;
}
.ivu-page {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 30px;
}
</style>