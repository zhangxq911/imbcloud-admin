<template>
  <div class="item">
    <div
      class="item-cont"
      @click="selectItem(channel_id)"
      v-bind:class="{ active: this.selectList.indexOf(this.index) > -1 , live: isLive, prev: isPrev, end: isEnd}"
    >
      <img width="250" src="../../assets/images/cover_live_small.png">
      <h2 :title="name" class="channelMsg">{{ channel_id }} | {{ modifyName?modifyName:name }}</h2>
      <h3>{{ start_time }}</h3>
      <div class="person">
        <img src="../../assets/icons/user.png" width="12">
        <span>{{ online_user_num }}</span>
      </div>
      <div
        class="controlBar"
        v-show="this.selectList.indexOf(this.index) > -1 && !this.isDelStatus"
      >
        <div class="controlBox">
          <div @click.stop="startLiveTip = true" v-show="!isLive">
            <span>
              <img src="../../assets/images/video.png" alt>
            </span>
            <span>开播</span>
          </div>
          <div @click.stop="stopLiveTip = true" v-show="isLive">
            <span>
              <img src="../../assets/images/stop.png" alt>
            </span>
            <span>停播</span>
          </div>
          <div @click.stop="getChannelDetail">
            <span>
              <img src="../../assets/images/setting.png" alt>
            </span>
            <span>控制</span>
          </div>
          <div @click.stop="backPlay">
            <span>
              <img src="../../assets/images/word.png" alt>
            </span>
            <span>回放</span>
          </div>
          <div @click.stop="showData()">
            <span>
              <img src="../../assets/images/data.png" alt>
            </span>
            <span>数据</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 开播确认对话框 -->
    <Modal v-model="startLiveTip" title="信息" @on-ok="beginLive">
      <p>确认开始直播吗？</p>
    </Modal>
    <!-- 停播确认对话框 -->
    <Modal v-model="stopLiveTip" title="信息" @on-ok="stopLive">
      <p>确认停止直播吗？</p>
    </Modal>
    <!-- 控制对话框 -->
    <Modal
      v-model="controlModal"
      :mask-closable="false"
      :title="modifyName? modifyName :name"
      :width="1024"
      :styles="{top: '20px'}"
      :scrollable="true"
    >
      <control ref="ch" v-if="controlModal" :channelDetail="channelDetail"></control>
      <div v-show="isShare" class="shareBox">
        <p class="shareBoxTitle">手机观看二维码</p>
        <div class="shareBoxCode">
          <VueQrcode class="shareQrcode" :value="shareURI" :options="{ size: 160 }"></VueQrcode>
        </div>
        <Input readonly v-model="shareURI">
          <Button slot="append" v-clipboard="clipOptions">复制</Button>
        </Input>
      </div>
      <div slot="footer" class="controlFooter">
        <p @click="shareLive" class="shareURI">
          <Icon type="md-share"/>分享直播
        </p>
        <Button type="primary" @click="updateMsg">提交</Button>
      </div>
    </Modal>
    <Modal v-model="backPlayModal" title="直播回放" :width="1024" :styles="{top: '20px'}">
      <Row>
        <Col span="16">
          <div
            v-show="!showVedio"
            id="video-container"
            style="width: 100%; background-color: black; height: 400px;"
          ></div>
          <video
            style="width: 100%; height: 400px; background: rgba(0, 0, 0, .9); outline: none;"
            v-show="showVedio"
            :src="playUrl"
            controls="controls"
            autoplay="autoplay"
            :poster="playImg"
          ></video>
        </Col>
        <Col span="8" style="height: 400px; overflow: auto;">
          <!-- {{playBackList}} -->
          <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
            <Row style="padding: 6px 0;" v-for="item in playBackList" :key="item.video_id">
              <Col span="10" class="playListLeft">
                <div class="boxDiv">
                  <Checkbox class="boxDis" v-show="isDel || isMerge" :label="item.video_id"></Checkbox>
                </div>
                <img
                  class="backCover"
                  @click="playVedio(item.video_url, item.cover_url)"
                  :src="item.cover_url"
                  alt="回放封面"
                >
              </Col>
              <Col span="14">
                <p class="nowarp">
                  <a
                    href="javascript:void(0)"
                    @click="showPlayDetail(item)"
                    :title="item.create_time + '_' + item.end_time"
                  >{{item.create_time}}_{{item.end_time}}</a>
                </p>
                <p class="nowarp">开始时间:{{item.create_time}}</p>
                <p class="nowarp">
                  时长:{{item.timeLast}}
                  <a
                    herf="javascript:void(0)"
                    @click="showBackPlayClip(item.video_id)"
                  >[剪辑]</a>
                </p>
              </Col>
            </Row>
          </CheckboxGroup>
        </Col>
      </Row>
      <div slot="footer" class="controlFooter">
        <div>
          回放上传:
          <Button type="primary" @click="vExampleAdd">上传视频</Button>
          <form ref="vExample">
            <input type="file" style="display:none;" ref="vExampleFile" @change="vExampleUpload">
          </form>
        </div>
        <div>
          <Checkbox
            :indeterminate="indeterminate"
            :value="checkAll"
            @click.prevent.native="handleCheckAll"
            v-show="isDel || isMerge"
          >全选</Checkbox>
          <Button v-show="isDel" type="success" @click="delPlayback">确定</Button>
          <Button v-show="isDel" type="primary" @click="isDel = !isDel">取消</Button>
          <Button v-show="isMerge" type="primary" @click="mergePlayback = true">确定</Button>
          <Button v-show="isMerge" type="success" @click="isMerge = !isMerge">取消</Button>
          <Button v-show="!isDel && !isMerge" type="primary" @click="isDel = !isDel">批量删除</Button>
          <Button v-show="!isDel && !isMerge" type="primary" @click="isMerge = !isMerge">合并</Button>
        </div>
      </div>
    </Modal>
    <!-- 上传进度条 -->
    <Modal v-model="uploadProgress" :closable="false">
      <Progress :percent="progress" status="active"/>
      <div slot="footer">
        视频上传中，请稍后...
        <!-- <Button type="primary" @click="uploaderInfo.cancel()">取消</Button> -->
      </div>
    </Modal>
    <!-- 回放剪辑 -->
    <Modal v-model="backPlayClip" title="回放剪辑" :width="760" :styles="{top: '20px'}">
      <div style="height: 500px; overflow: auto;">
        <Row>
          <video
            :src="playClipData.video_url"
            controls="controls"
            :poster="playClipData.cover_url"
            :style="{width: '100%'}"
          ></video>
        </Row>
        <Row>
          <Form :label-width="80">
            <Row>
              <Col span="12">
                <FormItem label="设为开始">
                  <InputNumber v-model="playClipData.start_time" style="width: 100%;"></InputNumber>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="设为结束">
                  <InputNumber v-model="playClipData.end_time" style="width: 100%;"></InputNumber>
                </FormItem>
              </Col>
            </Row>
            <FormItem label="视频名称">
              <Input :value="playOldName"></Input>
            </FormItem>
            <FormItem label="新名称">
              <Input v-model="playClipData.title"></Input>
            </FormItem>
            <FormItem label="详细信息">
              <div id="clipEditor"></div>
            </FormItem>
          </Form>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary">播放剪辑</Button>
        <Button type="success" @click="updateClip">提交</Button>
      </div>
    </Modal>
    <!-- 合并视频确认 -->
    <Modal v-model="mergePlayback" title="输入合并名称，并确认" @on-ok="sumbitMerge">
      <Input v-model="mergeTitle"></Input>
      <div slot="footer">
        <Button type="primary" @click="sumbitMerge">确定</Button>
        <Button @click="mergePlayback = false">取消</Button>
      </div>
    </Modal>
    <!-- 回放视频详情 -->
    <Modal v-model="isDetail" :title="curDetail.title + ' 详情'" :width="760" :styles="{top: '20px'}">
      <Form :label-width="80">
        <FormItem label="视频名称">
          <Input v-model="curDetail.title"></Input>
        </FormItem>
        <Row>
          <Col span="12">
            <FormItem label="视频大小">{{curDetail.video_size_MB }} MB</FormItem>
          </Col>
          <Col span="12">
            <FormItem label="视频时长">{{curDetail.timeLast}}</FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="开始时间">{{curDetail.start_time}}</FormItem>
          </Col>
          <Col span="12">
            <FormItem label="结束时间">{{curDetail.end_time}}</FormItem>
          </Col>
        </Row>
        <FormItem label="回放状态">
          <RadioGroup v-model="curDetail.status">
            <Radio :label="1">
              <span>显示</span>
            </Radio>
            <Radio :label="2">
              <span>不显示</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="回放详情">
          <div id="clipEditor"></div>
        </FormItem>
        <FormItem label="原画">
          <Input :readonly="true" :value="curDetail.video_url">
            <Button slot="append" @click="downloadFile(curDetail.video_url, curDetail.title)">下载</Button>
            <Button slot="append" @click="transcoding = true">转码</Button>
          </Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="success" @click="detailSub">提交</Button>
        <Button type="error" @click="delCur(curDetail.video_id)">删除</Button>
      </div>
    </Modal>
    <!-- 视频转码 -->
    <Modal v-model="transcoding" title="视频转码（耗时较长，提交后请过段时间查看）" @on-ok="tranSub">
      <Form :label-width="80">
        <FormItem label="转码模版">
          <RadioGroup v-model="definition">
            <Radio label="210">
              <span>流畅(FLU)</span>
            </Radio>
            <Radio label="220">
              <span>标清(SD)</span>
            </Radio>
            <Radio label="230">
              <span>高清(HD)</span>
            </Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    </Modal>
    <!-- 数据视图 -->
    <Modal v-model="isData" title="数据分析" :width="1024" :styles="{top: '20px'}">
      <div style="height: 500px; overflow: auto;">
        <Form :label-width="80" inline>
          <FormItem label="开始时间">
            <DatePicker
              v-model="startTime"
              placeholder="开始时间"
              style="width: 200px"
              :editable="false"
            ></DatePicker>
          </FormItem>
          <FormItem label="结束时间">
            <DatePicker v-model="endTime" placeholder="结束时间" style="width: 200px" :editable="false"></DatePicker>
          </FormItem>
          <Button type="primary" @click="showDetailData(startTime, endTime)">查询</Button>
        </Form>
        <Card>
          <p slot="title">直播概况</p>
          <div style="display: flex">
            <div
              style="flex: 1 1 0%;display: flex;align-items: center;border-right: 1px solid #ccc;justify-content: center;"
            >
              <div style="padding: 0px 6px;">
                <div class="boxLabel" style="background: #e74c3c;">
                  <Icon class="iconLabel" type="ios-pulse"/>
                </div>
              </div>
              <div style=" display: flex; flex-direction: column;">
                <div style="color: #ccc;">最高并发（人）</div>
                <div style="font-size: 30px;">{{liveSummary.maximumConcurrent}}</div>
              </div>
            </div>
            <div
              style="flex: 1 1 0%;display: flex;align-items: center;border-right: 1px solid #ccc;justify-content: center;"
            >
              <div style="padding: 0px 6px;">
                <div class="boxLabel" style="background: #2D8cF0;">
                  <Icon class="iconLabel" type="md-eye"/>
                </div>
              </div>
              <div style=" display: flex; flex-direction: column;">
                <div style="color: #ccc;">累计直播次数（次）</div>
                <div style="font-size: 30px;">
                  {{liveSummary.cumulativeLiveNum}}
                  <span class="smallLabel">直播</span>
                  {{liveSummary.cumulativePlaybackNum}}
                  <span class="smallLabel">回放</span>
                </div>
              </div>
            </div>
            <div style="flex: 1 1 0%;display: flex;align-items: center; justify-content: center;">
              <div style="padding: 0px 6px;">
                <div class="boxLabel" style="background: #f90;">
                  <Icon class="iconLabel" type="md-people"/>
                </div>
              </div>
              <div style=" display: flex; flex-direction: column;">
                <div style="color: #ccc;">累计观众人数（人）</div>
                <div style="font-size: 30px;">
                  {{liveSummary.cumulativeWatchNum}}
                  <span class="smallLabel">访问总数</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
        <Row>
          <Col span="12" style="padding: 20px 20px 0 0;">
            <Card>
              <p slot="title">观看并发分析</p>
              <ChartLine
                style="width: 100%; height: 300px;"
                v-if="isWatchConcurrentDOs"
                :value="watchConcurrentDOs"
              ></ChartLine>
            </Card>
          </Col>
          <Col span="12" style="padding: 20px 0 0 20px;">
            <Card>
              <p slot="title">观众数据分析</p>
              <ChartLine
                style="width: 100%; height: 300px;"
                v-if="isVisiterDataDO"
                :value="visiterDataDO"
              ></ChartLine>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span="12" style="padding: 20px 20px 0 0;">
            <Card>
              <p slot="title">观看终端</p>
              <chart-pie
                v-if="isTerminalInfoDOs"
                style="width: 100%; height: 300px;"
                :value="terminalInfoDOs"
              ></chart-pie>
            </Card>
          </Col>
          <Col span="12" style="padding: 20px 0 0 20px;">
            <Card>
              <p slot="title">地址位置</p>
              <chart-pie
                v-if="isTerminalInfoDOs"
                style="width: 100%; height: 300px;"
                :value="regionInfoDOs"
              ></chart-pie>
            </Card>
          </Col>
        </Row>
        <Card style="margin-top: 20px;">
          <p slot="title">分享排行</p>
          <chart-bar
            v-if="isShareInfoDOs"
            style="width: 100%; height: 200px;"
            :value="shareInfoDOs"
          ></chart-bar>
        </Card>
      </div>
      <div slot="footer">
        <Button @click="isData = !isData">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  startChannel,
  stopChannel,
  showChannelControlDetail,
  getSignature,
  addPlayback,
  channel_playback_list,
  batchDelPlayback,
  playback_clip,
  clipPlayback,
  concatPlayback,
  modPlayback,
  transcode,
  getChartAnalyseInfo,
  getChannelLiveSummary,
  modifyChannel
} from '@/api/data'
import control from '../control/control'
import { getToken } from '@/libs/util'
import TcVod from 'vod-js-sdk-v6'
import Editor from 'wangeditor'
import { ChartPie, ChartBar } from '_c/charts'
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import ChartLine from '../line/line'
import { parseTime } from '@/libs/tools'
import VueQrcode from '@xkeshi/vue-qrcode'
import { Base64 } from 'js-base64'

export default {
  name: 'video-item',
  props: [
    'start_time',
    'name',
    'online_user_num',
    'channel_id',
    'live_status',
    'clearActive',
    'isDelStatus',
    'selectList',
    'index',
    'delChannelList'
  ],
  components: {
    control,
    Editor,
    ChartPie,
    ChartBar,
    InforCard,
    CountTo,
    ChartLine,
    VueQrcode
  },
  data() {
    return {
      modifyName: '',
      isShare: false,
      isLive: false,
      isPrev: false,
      isEnd: false,
      isActive: false,
      isDel: false,
      isMerge: false,
      backPlayClip: false,
      startLiveTip: false,
      stopLiveTip: false,
      controlModal: false,
      backPlayModal: false,
      mergePlayback: false,
      isDetail: false,
      isData: false,
      curDetail: {},
      sign: '',
      token: '',
      uploaderInfos: [],
      uploadProgress: false,
      progress: 0,
      playBackList: [],
      playUrl: '',
      playImg: '',
      showVedio: false,
      checkAll: false,
      checkAllGroup: [],
      indeterminate: true,
      transcoding: false,
      upload: {
        name: 'file',
        url: 'http://192.168.1.25:8080/imb_web/console/uploadLogo.do'
      },
      channelDetail: {},
      channelParams: {
        id: '',
        status: false
      },
      playClipData: {},
      playOldName: '',
      editor: null,
      showClipDetail: false,
      mergeTitle: '',
      definition: '210',
      visiterDataDO: { name: '', xAxis: [], yAxis: [] },
      isVisiterDataDO: false,
      watchConcurrentDOs: {
        name: '',
        xAxis: [],
        yAxis: []
      },
      isWatchConcurrentDOs: false,
      regionInfoDOs: [],
      isRegionInfoDOs: false,
      terminalInfoDOs: [],
      isTerminalInfoDOs: false,
      shareInfoDOs: {},
      isShareInfoDOs: false,
      liveSummary: {},
      startTime: '',
      endTime: '',
      shareURI: ''
    }
  },
  computed: {
    clipOptions() {
      return {
        value: this.shareURI,
        success: e => {
          this.$Message.success('复制成功')
        },
        error: () => {
          this.$Message.error('复制失败')
        }
      }
    }
  },
  methods: {
    shareLive() {
      // 分享直播
      this.shareURI =
        'https://' +
        window.location.host +
        '/access/h5/share/channel?hls=1&share_type=wx&channel_id=' +
        this.channel_id
      this.isShare = !this.isShare
    },
    tranSub() {
      // 转码提交
      let data = {
        channel_id: this.channel_id,
        video_id: this.curDetail.video_id,
        definition: this.definition
      }
      transcode(data).then(res => {
        if (res.data.result) {
          this.$Message.success('提交成功，请稍后查看...')
        } else {
          this.$Message.error('转码失败')
        }
      })
    },
    downloadFile(url, filename = '') {
      // 解决跨域下载问题
      this.$Message.success('下载中，请稍后...')
      fetch(url, {
        headers: new Headers({
          Origin: location.origin
        }),
        mode: 'cors'
      })
        .then(res => res.blob())
        .then(blob => {
          const blobUrl = window.URL.createObjectURL(blob)
          this.download(blobUrl, filename)
          window.URL.revokeObjectURL(blobUrl)
        })
    },
    download(href, filename = '') {
      // 常规a标签下载处理 chrome 会直接打开一个新的tab页，如果浏览器支持的话
      const a = document.createElement('a')
      a.download = filename
      a.href = href
      document.body.appendChild(a)
      a.click()
      a.remove()
    },
    detailSub() {
      // 回放详情
      let data = {
        channel_id: this.curDetail.channel_id,
        video_id: this.curDetail.video_id,
        title: this.curDetail.title,
        status: this.curDetail.status,
        detail: this.editor.txt.html()
      }
      modPlayback(data).then(res => {
        if (res.data.result) {
          this.isDetail = false
          this.$Message.success('修改成功')
        } else {
          this.$Message.error('修改失败')
        }
      })
    },
    delCur(videoId) {
      // 删除当前回放
      let data = {
        channel_id: this.channel_id,
        video_ids: [videoId]
      }
      batchDelPlayback(data).then(res => {
        if (res.data.result) {
          this.$Message.success('删除成功')
          this.isDetail = false
          // 重新拉取数据
          this.getVedioList()
        } else {
          this.$Message.error('删除失败')
        }
      })
    },
    showPlayDetail(item) {
      // 获取当前点击回放的详情
      this.curDetail = item
      this.isDetail = true
      this.editor.txt.html(this.curDetail.detail)
    },
    sumbitMerge() {
      // 合并确认
      if (!this.mergeTitle) {
        this.$Message.error('请输入合并名称')
        return
      }
      let data = {
        channel_id: this.channel_id,
        video_ids: this.checkAllGroup,
        title: this.mergeTitle
      }
      concatPlayback(data).then(res => {
        if (res.data.result) {
          this.mergePlayback = false
          this.$Message.success('合并中，请稍后刷新...')
          // 重新拉取数据
          this.getVedioList()
        } else {
          this.$Message.error('合并失败')
        }
      })
    },
    updateClip() {
      // 裁剪内容提交
      let data = {
        channel_id: this.channel_id,
        video_id: this.playClipData.video_id,
        newFileName: this.playClipData.title,
        startTimeOffset: this.playClipData.start_time,
        endTimeOffset: this.playClipData.end_time,
        detail: this.editor.txt.html()
      }
      clipPlayback(data).then(res => {
        if (res.data.result) {
          // 重新拉取数据
          this.getVedioList()
          this.backPlayClip = false
          this.editor.txt.html('')
          this.$Message.success(res.data.msg)
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    delPlayback() {
      // 批量删除直播回放
      let data = {
        channel_id: this.channel_id,
        video_ids: this.checkAllGroup
      }
      batchDelPlayback(data).then(res => {
        if (res.data.result) {
          this.$Message.success('删除成功')
          // 重新拉取数据
          this.getVedioList()
        } else {
          this.$Message.error('删除失败')
        }
      })
    },
    handleCheckAll() {
      // 全选
      if (this.indeterminate) {
        this.checkAll = false
      } else {
        this.checkAll = !this.checkAll
      }
      this.indeterminate = false
      if (this.checkAll) {
        let arr = []
        for (let item of this.playBackList) {
          arr.push(item.video_id)
        }
        this.checkAllGroup = arr
      } else {
        this.checkAllGroup = []
      }
    },
    checkAllGroupChange(data) {
      // 单选改变
      if (data.length === this.playBackList.length) {
        this.indeterminate = false
        this.checkAll = true
      } else if (data.length > 0) {
        this.indeterminate = true
        this.checkAll = false
      } else {
        this.indeterminate = false
        this.checkAll = false
      }
    },
    showBackPlayClip(videoId) {
      // 回放剪辑
      this.editor.txt.html(this.playClipData.detail)
      let data = {
        channel_id: this.channel_id,
        video_id: videoId
      }
      playback_clip(data).then(res => {
        this.playClipData = res.data
        this.playOldName = res.data.title
        this.playClipData.start_time = 0
        this.playClipData.end_time = 0
        this.playClipData.title = ''
        this.backPlayClip = true
      })
    },
    playVedio(url, img) {
      // 播放视频
      this.playUrl = url
      this.playImg = img
      this.showVedio = true
    },
    getVedioList(page = '1') {
      let data = {
        channel_id: this.channel_id,
        page: page
      }
      channel_playback_list(data).then(res => {
        this.playBackList = res.data.playbackLst
        console.log('获取回放列表')
      })
    },
    vExampleAdd() {
      // vExample示例。添加视频
      this.$refs.vExampleFile.click()
      let data = {}
      // 回放
      getSignature(data).then(res => {
        if (res.status === 200) {
          this.backPlayModal = true
          this.sign = res.data
          console.log('获取签名成功')
        } else {
          this.$Message.error('获取签名失败')
          return
        }
      })
    },
    vExampleUpload: function(cancel) {
      // vExample示例。上传视频过程。
      // https://cloud.tencent.com/document/product/266/9239
      var self = this
      var mediaFile = this.$refs.vExampleFile.files[0]
      // 通过 import 引入的话，new TcVod(opts) 即可。
      // new TcVod.default(opts) 是 script 引入 的用法
      const tcVod = new TcVod({
        getSignature: () => {
          return this.sign
        } // 前文中所述的获取上传签名的函数
      })
      this.uploadProgress = true
      var uploader = tcVod.upload({
        mediaFile: mediaFile // 媒体文件（视频或音频或图片），类型为 File
      })
      // 上传进度
      uploader.on('media_progress', info => {
        this.progress = Math.floor(info.percent * 100) // 进度
      })
      // 视频上传完成时
      uploader.on('media_upload', info => {
        uploaderInfo.isVideoUploadSuccess = true
        this.uploadProgress = false
        this.progress = 0
        this.getVedioList()
        console.log('上传完成，请稍后刷新...')
      })
      var uploaderInfo = {
        videoInfo: uploader.videoInfo,
        isVideoUploadSuccess: false,
        isVideoUploadCancel: false,
        progress: 0,
        fileId: '',
        videoUrl: '',
        cancel: function() {
          uploaderInfo.isVideoUploadCancel = true
          uploader.cancel()
          console.log('取消上传')
        }
      }
      this.uploaderInfos.push(uploaderInfo)
      // 上传完成后处理
      uploader.done().then(doneResult => {
        // deal with doneResult
        let data = {
          channel_id: this.channel_id,
          title: mediaFile.name,
          video_id: doneResult.fileId,
          detail: ''
        }
        addPlayback(data).then(res => {
          if (res.data.result) {
            this.$Message.success('上传成功，请稍后刷新...')
          } else {
            this.$Message.error('上传失败')
            return
          }
        })
        self.$refs.vExample.reset()
      })
    },
    showTag() {
      switch (this.live_status) {
        case 1:
          this.isLive = true
          break
        case 0:
          this.isPrev = true
          break
        case -1:
          this.isEnd = true
          break
        default:
          break
      }
    },
    selectItem(channel_id) {
      let tempArr = [] // 选中状态数组
      let delArr = [] // 删除数组
      if (this.isDelStatus) {
        // 删除状态，可多选，不显示菜单项
        tempArr = JSON.parse(JSON.stringify(this.selectList))
        delArr = JSON.parse(JSON.stringify(this.delChannelList))
        if (tempArr.indexOf(this.index) > -1) {
          let inx = tempArr.indexOf(this.index)
          let inx2 = delArr.indexOf(channel_id)
          tempArr.splice(inx, 1)
          delArr.splice(inx2, 1)
        } else {
          tempArr.push(this.index)
          delArr.push(channel_id)
        }
        // this.isActive = !this.isActive
        // this.channelParams.id = channel_id  // 获取当前选中id
        // this.channelParams.status = this.index // 获取当前选中状态
        this.$emit('sendChannelIdsList', delArr) // 发送到父元素
      } else {
        // 非删除状态，不可多选，显示菜单
        tempArr.push(this.index)
      }
      this.$emit('sendSelectList', tempArr) // 发送到父元素
    },
    beginLive() {
      // 开始直播
      let data = {
        channelId: this.channel_id
      }
      startChannel(data).then(res => {
        this.startLiveTip = false
        this.$Message.success(res.data.msg)
        if (res.data.result == true) {
          // 成功后改变状态标签
          this.isPrev = false
          this.isEnd = false
          this.isLive = true
        }
      })
    },
    backPlay() {
      this.backPlayModal = true
      this.getVedioList()
    },
    getSign() {
      let data = {}
      // 回放
      getSignature(data).then(res => {
        if (res.status === 200) {
          this.backPlayModal = true
          console.log(res.data)
          return res.data
        } else {
          this.$Message.error('获取签名失败')
          return
        }
      })
    },
    showData() {
      this.isData = true
      this.showDetailData()
    },
    showDetailData(startTime, endTime) {
      if (startTime) {
        startTime = parseTime(startTime)
      } else {
        startTime = '2000-01-01 00:00:00'
      }
      let date = new Date()
      if (endTime) {
        endTime = parseTime(endTime)
      } else {
        endTime = parseTime(date)
      }
      // 数据
      let data = {
        channelId: this.channel_id,
        startTime: startTime,
        endTime: endTime
      }
      // 顶部数据
      getChannelLiveSummary(data).then(res => {
        this.liveSummary = res.data
      })
      // 图表
      getChartAnalyseInfo(data).then(res => {
        if (res.status == 200) {
          let that = this
          this.isVisiterDataDO = false
          this.isWatchConcurrentDOs = false
          this.isRegionInfoDOs = false
          this.isTerminalInfoDOs = false
          this.isShareInfoDOs = false
          this.visiterDataDO = { name: '', xAxis: [], yAxis: [] }
          this.watchConcurrentDOs = {
            name: '',
            xAxis: [],
            yAxis: []
          }
          this.regionInfoDOs = []
          this.terminalInfoDOs = []
          this.shareInfoDOs = {}
          // 观看并发分析处理
          if (res.data.watchConcurrentDOs.length > 0) {
            for (let item of res.data.watchConcurrentDOs) {
              this.watchConcurrentDOs.xAxis.push(item.entryTime)
              this.watchConcurrentDOs.yAxis.push(item.maximumConcurrent)
            }
            this.watchConcurrentDOs.name = '观看并发'
            this.isWatchConcurrentDOs = true
          }
          // 观众数据分析处理
          if (res.data.visiterDataDO != null) {
            Object.keys(res.data.visiterDataDO).forEach(function(key) {
              that.visiterDataDO.yAxis.push(res.data.visiterDataDO[key])
              switch (key) {
                case 'oneCycle':
                  key = '第一周期'
                  break
                case 'twoCycle':
                  key = '第二周期'
                  break
                case 'threeCycle':
                  key = '第三周期'
                  break
                case 'fourCycle':
                  key = '第四周期'
                  break
                case 'fiveCycle':
                  key = '第五周期'
                  break
                case 'sixCycle':
                  key = '第六周期'
                  break
                case 'sevenCycle':
                  key = '第七周期'
                  break
                case 'eigthCycle':
                  key = '第八周期'
                  break
                case 'nineCycle':
                  key = '第九周期'
                  break
                case 'tenCycle':
                  key = '第十周期'
                  break
                case 'elevenCycle':
                  key = '第十一周期'
                  break
                case 'twelveCycle':
                  key = '第十二周期'
                  break
                default:
                  key
              }
              that.visiterDataDO.xAxis.push(key)
            })
            this.visiterDataDO.name = '观众数量'
            this.isVisiterDataDO = true
          }
          // 地理位置处理
          if (res.data.regionInfoDOs.length > 0) {
            for (let item of res.data.regionInfoDOs) {
              let tempRegionObj = {}
              tempRegionObj.name = item.regionName
              tempRegionObj.value = item.userNum
              this.regionInfoDOs.push(tempRegionObj)
            }
            this.isRegionInfoDOs = true
          }
          // 观看终端处理
          if (res.data.terminalInfoDOs.length > 0) {
            for (let item of res.data.terminalInfoDOs) {
              let tempTerminalObj = {}
              tempTerminalObj.name = item.terminalType
              tempTerminalObj.value = item.userNum
              this.terminalInfoDOs.push(tempTerminalObj)
            }
            this.isTerminalInfoDOs = true
          }
          // 分享排行处理
          if (res.data.shareInfoDOs.length > 0) {
            let tempShareInfoDOs = {}
            for (let item of res.data.shareInfoDOs) {
              tempShareInfoDOs[item.visitName] = item.scoreNum
            }
            this.shareInfoDOs = tempShareInfoDOs
            this.isShareInfoDOs = true
          }
        } else {
          this.$Message.error('无数据分析')
        }
      })
    },
    stopLive() {
      // 停止直播
      let data = {
        channelId: this.channel_id
      }
      stopChannel(data).then(res => {
        this.stopLiveTip = false
        this.$Message.success(res.data.msg)
        if (res.data.result == true) {
          // 成功后改变状态标签
          this.isPrev = false
          this.isLive = false
          this.isEnd = true
        }
      })
    },
    getChannelDetail() {
      // 控制对话框展现
      let data = {
        channelId: this.channel_id
      }
      showChannelControlDetail(data).then(res => {
        // 将所有自定义菜单的detail encode
        res.data.custom_menu.forEach(item => {
          if(item.menu_detail) {
            item.menu_detail = Base64.decode(item.menu_detail)
          }
        })
        this.channelDetail = res.data
        this.controlModal = true
      })
    },
    updateMsg() {
      // 更新频道信息
      let chil = this.$refs.ch
      let obj = chil.curChannelDetail
      // 判断名称
      if(!obj.name){
        this.$Message.error('频道名称为必填项！')
        return
      }
      if(obj.name.length > 16) {
        this.$Message.error('频道名称不能超过16个字符！')
        return
      }
      // 自定义菜单提交前要处理一下，如果菜单类型不是图文的话，详情删除
      for (let item of obj.custom_menu) {
        if (item.menu_type !== 1) {
          item.menu_detail = ''
        }else {
          item.menu_detail = Base64.encode(item.menu_detail)
        }
        if (item.menu_type === 7) {
          item.menu_detail = obj.photoUrl
        }
        if (item.menu_type === 8) {
          item.menu_detail = obj.screenUrl
        }
      }
      // 自定义横幅提交前处理一下
      for (let item of obj.banner_bar) {
        if (item.banner_type === 0) {
          item.banner_imgurl = ''
        }
      }
      // 自定义横幅字段添加
      let data = {
        channel_id: obj.channel_id,
        name: obj.name,
        detail: Base64.encode(obj.detail),
        ulimit: obj.ulimit,
        record_type: obj.record_type,
        device_id: obj.device_id,
        account_id: obj.account_id,
        countdown_flag: obj.countdown_flag,
        logo_pos: obj.logo_pos,
        guide_flag: obj.guide_flag,
        user_num_flag: obj.user_num_flag,
        user_num_base: obj.user_num_base,
        start_time: parseTime(obj.start_time),
        end_time: parseTime(obj.end_time),
        wx_share_title: obj.wx_share_title,
        download_flag: obj.download_flag,
        wx_share_msg: obj.wx_share_msg,
        guide_image: obj.guide_image,
        cover_logo: obj.cover_logo,
        live_image: obj.live_image,
        wx_share_image: obj.wx_share_image,
        wx_mp_image: obj.wx_mp_image,
        wx_mp_name: obj.wx_mp_name,
        wx_mp_flag: obj.wx_mp_flag,
        wx_mp_pop: obj.wx_mp_pop,
        chat_allow_flag: obj.chat_allow_flag,
        chat_check_flag: obj.chat_check_flag,
        directStream: JSON.stringify(obj.direct_streams),
        customMenus: JSON.stringify(obj.custom_menu),
        bannerBars: JSON.stringify(obj.banner_bar),
        live_video_id: obj.live_video_id
      }
      modifyChannel(data).then(res => {
        if (res.data.result === true) {
          this.$Message.success(res.data.msg)
          this.controlModal = false
          this.modifyName = obj.name
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    }
  },
  mounted() {
    // 显示左上角标签
    this.showTag()
    // 获取 token
    this.token = getToken()
    // 初始化 wangeditor
    this.editor = new Editor('#clipEditor')
    this.editor.customConfig.onchange = html => {
      this.playBackList.detail = html
    }
    this.editor.create()
  }
}
</script>

<style scoped>
.item {
  width: 260px;
  padding: 10px;
}
.item-cont {
  width: 100%;
  /* height: 200px; */
  padding: 10px;
  border: 1px solid #bdc3c7;
  position: relative;
}
.item-cont:hover {
  border: 1px solid #e74c3c;
}
.item-cont > img {
  width: 100%;
  height: 120px;
}
.active {
  border: 1px solid #e74c3c;
  box-shadow: 0px 0px 2px red;
}
.item h2,
.item h3 {
  font-weight: normal;
}
.item h2 {
  font-size: 14px;
}
.item h3 {
  color: #b3b3b3;
}
.channelMsg {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.person {
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: flex;
  align-items: center;
}
.controlBar {
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
}
.controlBox {
  display: flex;
  padding: 14px 0;
}
.controlBox div {
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}
.controlBox span {
  display: flex;
  align-items: center;
}
.controlBox div:hover {
  color: #fff;
  cursor: pointer;
}
.controlBox img {
  width: 20px;
  height: 20px;
  padding: 2px;
}
.live::before {
  content: '直播';
  position: absolute;
  left: 10px;
  top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  width: 30px;
  height: 18px;
  background: #e74c3c;
}
.prev::before {
  content: '预约';
  position: absolute;
  left: 10px;
  top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  width: 30px;
  height: 18px;
  background: #3498db;
}
.end::before {
  content: '结束';
  position: absolute;
  left: 10px;
  top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  width: 30px;
  height: 18px;
  background: #7f8c8d;
}
.controlFooter {
  display: flex;
  justify-content: space-between;
  /* padding: 0 50px; */
}
.nowarp {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.backCover {
  width: 80%;
  padding: 4px 6px 0;
}
.backCover:hover {
  cursor: pointer;
}
.boxDiv {
  width: 20%;
  padding-left: 10px;
}
.playListLeft {
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.smallLabel {
  font-size: 14px;
  color: #ccc;
  padding-right: 20px;
}
.iconLabel {
  color: #fff;
  font-size: 20px;
}
.boxLabel {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.shareBox {
  position: absolute;
  background: rgb(204, 204, 204);
  border-radius: 4px;
  bottom: 80px;
  width: 360px;
  padding: 0 20px 20px;
}
.shareBoxTitle {
  font-size: 16px;
  padding: 4px;
  color: #fff;
  text-align: center;
}
.shareBoxCode {
  text-align: center;
}
.shareURI:hover {
  cursor: pointer;
  text-decoration: underline;
}
</style>