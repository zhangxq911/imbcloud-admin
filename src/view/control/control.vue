<template>
  <div>
    <Tabs>
      <TabPane label="基础信息">
        <Form :label-width="120" class="basicForm" ref="formValidate" :rules="ruleValidate">
          <Row>
            <Col span="12">
              <FormItem label="名称" span="12" prop="name">
                <Input v-model="curChannelDetail.name"></Input>
              </FormItem>
            </Col>
          </Row>
          <FormItem label="详情">
            <div id="detailEditor" style="width: 660px;"></div>
          </FormItem>
          <Row>
            <Col span="12">
              <FormItem label="在线人数上限">
                <Input v-model="curChannelDetail.ulimit"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="直播录制">
                <i-switch
                  :value="curChannelDetail.record_type ? true : false"
                  @on-change="changeRecordType"
                ></i-switch>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="开始时间">
                <DatePicker
                  v-model="curChannelDetail.start_time"
                  type="datetime"
                  placeholder="开始时间"
                  :editable="false"
                  :transfer="true"
                  style="width: 200px"
                ></DatePicker>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="结束时间">
                <DatePicker
                  v-model="curChannelDetail.end_time"
                  type="datetime"
                  placeholder="结束时间"
                  :transfer="true"
                  :editable="false"
                  style="width: 200px"
                ></DatePicker>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <!-- <FormItem label="所属账户">
                <Input v-model="curChannelDetail.account_name"></Input>
              </FormItem>-->
              <FormItem label="频道所属账户" v-if="defAccount === 'admin'">
                <Input
                  readonly
                  v-model="curChannelDetail.account_name"
                  placeholder="点击选择"
                  @on-focus="getAccount"
                ></Input>
                <Icon class="addIcon" type="md-add" />
              </FormItem>
              <FormItem label="频道所属账户" v-if="defAccount === 'unit'">
                <Input readonly v-model="curChannelDetail.account_name"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <!-- <FormItem label="所属直播设备">
                <Input v-model="curChannelDetail.device_name"></Input>
              </FormItem>-->
              <FormItem label="所属直播设备">
                <Input
                  readonly
                  v-model="curChannelDetail.device_name"
                  placeholder="点击选择"
                  @on-focus="getLive"
                ></Input>
                <Icon class="addIcon" type="md-add" />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </TabPane>
      <TabPane label="基础配置">
        <Form :label-width="120" ref="formValidate" :rules="ruleValidate">
          <Row>
            <Col span="4">
              <FormItem label="倒计时开关">
                <i-switch
                  :value="curChannelDetail.countdown_flag ? true : false"
                  @on-change="changeCountDownFlag"
                ></i-switch>
              </FormItem>
            </Col>
            <Col span="4">
              <FormItem label="引导图开关">
                <i-switch
                  :value="curChannelDetail.guide_flag ? true : false"
                  @on-change="changeGuideFlag"
                ></i-switch>
              </FormItem>
            </Col>
          </Row>
          <FormItem label="引导图片地址" prop="guide_image">
            <Row>
              <Col span="4" class="uploadGroup">
                <img
                  class="hoverBg"
                  :src="curChannelDetail.guide_image"
                  v-show="curChannelDetail.guide_image"
                />
                <div class="hoverBtn" v-show="curChannelDetail.guide_image">
                  <div>
                    <Upload
                      class="upload"
                      :name="upload.name"
                      :headers="{'token': token}"
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png']"
                      :max-size="2048"
                      :on-format-error="handleFormatError"
                      :on-success="sucessGuideUrl"
                      type="drag"
                      :action="upload.url"
                    >
                      <Icon class="cloud" type="md-cloud-upload" />
                    </Upload>
                    <Icon
                      class="eyes"
                      @click="handleImg('引导图片地址', curChannelDetail.guide_image)"
                      type="md-eye"
                    />
                  </div>
                </div>
                <Upload
                  :name="upload.name"
                  v-show="!curChannelDetail.guide_image"
                  :headers="{'token': token}"
                  :show-upload-list="false"
                  :format="['jpg','jpeg','png']"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-success="sucessGuideUrl"
                  type="drag"
                  :action="upload.url"
                >
                  <div style="padding: 20px 0">
                    <Icon type="md-add" />
                  </div>
                </Upload>
                <!-- <Upload type="drag" action="//jsonplaceholder.typicode.com/posts/">
                  <div style="padding: 20px 0">
                    <Icon type="md-add"/>
                  </div>
                </Upload>-->
              </Col>
              <Col span="20">
                <p class="tips">
                  引导图建议尺寸：1080*1920px；
                  <br />图片大小：2M以内；
                  <br />图片格式：png，jpg，jpeg；
                  <br />
                </p>
              </Col>
            </Row>
          </FormItem>
          <Row>
            <Col span="12">
              <FormItem label="LOGO位置">
                <Select v-model="curChannelDetail.logo_pos">
                  <Option :value="0">不显示</Option>
                  <Option :value="1">左上</Option>
                  <Option :value="2">右上</Option>
                  <Option :value="3">左下</Option>
                  <Option :value="4">右下</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <FormItem label="LOGO地址" prop="cover_logo">
            <Row>
              <Col span="4" class="uploadGroup">
                <img
                  class="hoverBg"
                  :src="curChannelDetail.cover_logo"
                  v-show="curChannelDetail.cover_logo"
                />
                <div class="hoverBtn" v-show="curChannelDetail.cover_logo">
                  <div>
                    <Upload
                      class="upload"
                      :name="upload.name"
                      :headers="{'token': token}"
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png']"
                      :max-size="2048"
                      :on-format-error="handleFormatError"
                      :on-success="sucessLogoUrl"
                      type="drag"
                      :action="upload.url"
                    >
                      <Icon class="cloud" type="md-cloud-upload" />
                    </Upload>
                    <Icon
                      class="eyes"
                      @click="handleImg('LOGO地址', curChannelDetail.cover_logo)"
                      type="md-eye"
                    />
                  </div>
                </div>
                <Upload
                  :name="upload.name"
                  v-show="!curChannelDetail.cover_logo"
                  :headers="{'token': token}"
                  :show-upload-list="false"
                  :format="['jpg','jpeg','png']"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-success="sucessLogoUrl"
                  type="drag"
                  :action="upload.url"
                >
                  <div style="padding: 20px 0">
                    <Icon type="md-add" />
                  </div>
                </Upload>
                <!-- <img class="hoverBg" src="../../assets/images/cover_live.png" alt="LOGO地址">
                <div class="hoverBtn">
                  <div>
                    <Upload action="//jsonplaceholder.typicode.com/posts/">
                      <Icon type="md-cloud-upload"/>
                    </Upload>
                    <Icon class="eyes" type="md-eye"/>
                  </div>
                </div>-->
              </Col>
              <Col span="20">
                <p class="tips">
                  LOGO建议尺寸：400*100px；
                  <br />图片大小：2M以内；
                  <br />图片格式：png，jpg，jpeg；
                  <br />
                </p>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="背景地址" prop="live_image">
            <Row>
              <Col span="4" class="uploadGroup">
                <img
                  class="hoverBg"
                  :src="curChannelDetail.live_image"
                  v-show="curChannelDetail.live_image"
                />
                <div class="hoverBtn" v-show="curChannelDetail.live_image">
                  <div>
                    <Upload
                      class="upload"
                      :name="upload.name"
                      :headers="{'token': token}"
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png']"
                      :max-size="2048"
                      :on-format-error="handleFormatError"
                      :on-success="sucessBgUrl"
                      type="drag"
                      :action="upload.url"
                    >
                      <Icon class="cloud" type="md-cloud-upload" />
                    </Upload>
                    <Icon
                      class="eyes"
                      @click="handleImg('背景地址', curChannelDetail.live_image)"
                      type="md-eye"
                    />
                  </div>
                </div>
                <Upload
                  :name="upload.name"
                  v-show="!curChannelDetail.live_image"
                  :headers="{'token': token}"
                  :show-upload-list="false"
                  :format="['jpg','jpeg','png']"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-success="sucessBgUrl"
                  type="drag"
                  :action="upload.url"
                >
                  <div style="padding: 20px 0">
                    <Icon type="md-add" />
                  </div>
                </Upload>
              </Col>
              <Col span="20">
                <p class="tips">
                  播放器背景图尺寸：1920*1080px；
                  <br />图片大小：2M以内；
                  <br />图片格式：png，jpg，jpeg；
                  <br />
                </p>
              </Col>
            </Row>
          </FormItem>
          <Row>
            <Col span="12">
              <FormItem label="观众人数显示开关">
                <Select v-model="curChannelDetail.user_num_flag" :transfer="true">
                  <Option :value="0">不显示</Option>
                  <Option :value="1">显示在线人数</Option>
                  <Option :value="2">显示历史人数</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="观众默认基础人数" prop="user_num_base">
                <InputNumber :min="0" v-model="curChannelDetail.user_num_base"></InputNumber>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </TabPane>
      <TabPane label="微信分享">
        <Form :label-width="120" ref="formValidate" :rules="ruleValidate">
          <Row>
            <Col span="12">
              <FormItem label="微信分享标题" prop="wx_share_title">
                <Input v-model="curChannelDetail.wx_share_title"></Input>
              </FormItem>
            </Col>
          </Row>
          <FormItem label="微信分享缩略图">
            <Row>
              <Col span="4" class="uploadGroup">
                <img
                  class="hoverBg"
                  :src="curChannelDetail.wx_share_image"
                  v-show="curChannelDetail.wx_share_image"
                />
                <div class="hoverBtn" v-show="curChannelDetail.wx_share_image">
                  <div>
                    <Upload
                      class="upload"
                      :name="upload.name"
                      :headers="{'token': token}"
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png']"
                      :max-size="2048"
                      :on-format-error="handleFormatError"
                      :on-success="sucessWxUrl"
                      type="drag"
                      :action="upload.url"
                    >
                      <Icon class="cloud" type="md-cloud-upload" />
                    </Upload>
                    <Icon
                      class="eyes"
                      @click="handleImg('微信分享缩略图', curChannelDetail.wx_share_image)"
                      type="md-eye"
                    />
                  </div>
                </div>
                <Upload
                  :name="upload.name"
                  v-show="!curChannelDetail.wx_share_image"
                  :headers="{'token': token}"
                  :show-upload-list="false"
                  :format="['jpg','jpeg','png']"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-success="sucessWxUrl"
                  type="drag"
                  :action="upload.url"
                >
                  <div style="padding: 20px 0">
                    <Icon type="md-add" />
                  </div>
                </Upload>
              </Col>
              <Col span="20">
                <p class="tips">
                  微信分享缩列图建议尺寸：108*108px；
                  <br />图片大小：2M以内；
                  <br />图片格式：png，jpg，jpeg；
                  <br />
                </p>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="分享下载开关">
            <i-switch
              :value="curChannelDetail.download_flag ? true : false"
              @on-change="changeDownloadFlag"
            ></i-switch>
          </FormItem>
          <Row>
            <Col span="12">
              <FormItem label="微信分享详情" prop="wx_share_msg">
                <Input
                  v-model="curChannelDetail.wx_share_msg"
                  type="textarea"
                  :autosize="{minRows: 2,maxRows: 5}"
                ></Input>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </TabPane>
      <TabPane label="公众号配置">
        <Form :label-width="150" ref="formValidate" :rules="ruleValidate">
          <Row>
            <Col span="12">
              <FormItem label="公众号名称" prop="wx_mp_name">
                <Input v-model="curChannelDetail.wx_mp_name"></Input>
              </FormItem>
            </Col>
          </Row>
          <FormItem label="公众号二维码图片地址">
            <Row>
              <Col span="4" class="uploadGroup">
                <img
                  class="hoverBg"
                  :src="curChannelDetail.wx_mp_image"
                  v-show="curChannelDetail.wx_mp_image"
                />
                <div class="hoverBtn" v-show="curChannelDetail.wx_mp_image">
                  <div>
                    <Upload
                      class="upload"
                      :name="upload.name"
                      :headers="{'token': token}"
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png']"
                      :max-size="2048"
                      :on-format-error="handleFormatError"
                      :on-success="sucessQrcodeUrl"
                      type="drag"
                      :action="upload.url"
                    >
                      <Icon class="cloud" type="md-cloud-upload" />
                    </Upload>
                    <Icon
                      class="eyes"
                      @click="handleImg('公众号二维码图片地址', curChannelDetail.wx_mp_image)"
                      type="md-eye"
                    />
                  </div>
                </div>
                <Upload
                  :name="upload.name"
                  v-show="!curChannelDetail.wx_mp_image"
                  :headers="{'token': token}"
                  :show-upload-list="false"
                  :format="['jpg','jpeg','png']"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-success="sucessQrcodeUrl"
                  type="drag"
                  :action="upload.url"
                >
                  <div style="padding: 20px 0">
                    <Icon type="md-add" />
                  </div>
                </Upload>
                <!-- <img class="hoverBg" src="../../assets/images/cover_live.png" alt="背景地址">
                <div class="hoverBtn">
                  <div>
                    <Upload action="//jsonplaceholder.typicode.com/posts/">
                      <Icon type="md-cloud-upload"/>
                    </Upload>
                    <Icon class="eyes" type="md-eye"/>
                  </div>
                </div>-->
              </Col>
              <Col span="20">
                <p class="tips">
                  公众号二维码图片建议尺寸：258*258px；
                  <br />图片大小：2M以内；
                  <br />图片格式：png，jpg，jpeg；
                  <br />
                </p>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="公众号显示开关">
            <i-switch
              :value="curChannelDetail.wx_mp_flag ? true : false"
              @on-change="changeWxMpFlag"
            ></i-switch>
          </FormItem>
          <FormItem label="自动弹出公众号">
            <i-switch :value="curChannelDetail.wx_mp_pop ? true : false" @on-change="changeWxMpPop"></i-switch>
          </FormItem>
        </Form>
      </TabPane>
      <TabPane label="导播配置">
        <Form :label-width="120">
          <Row>
            <Col span="12">
              <FormItem label="直播推流地址">
                <Input readonly v-model="curChannelDetail.streams.rtmp_push_url">
                  <Button slot="append" v-clipboard="clipOptions">复制</Button>
                  <Button
                    slot="append"
                    @mouseenter.native="changeQrcode('copy3')"
                    @mouseleave.native="changeQrcode(false)"
                  >二维码</Button>
                </Input>
                <VueQrcode
                  class="showQrcode"
                  v-show="isShowQrcode == 'copy3'"
                  :value="curChannelDetail.streams.rtmp_push_url"
                  :options="{ size: 100 }"
                ></VueQrcode>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="导播验证码">
                <Input readonly v-model="curChannelDetail.direct_code"></Input>
              </FormItem>
            </Col>
          </Row>
          <FormItem label="导播推流地址">
            <span style="color: #e74c3c;">(最多添加6个，提交才能生效)</span>
          </FormItem>
          <Table :columns="columns" :data="this.curChannelDetail.direct_streams"></Table>
          <Button @click="addNewDirect" type="primary" style="margin-top: 10px;">新增</Button>
        </Form>
      </TabPane>
      <TabPane label="聊天控制">
        <Form :label-width="120">
          <FormItem label="允许频道聊天">
            <i-switch
              :value="curChannelDetail.chat_allow_flag ? true : false"
              @on-change="changeChatAllowFlag"
            ></i-switch>
          </FormItem>
          <FormItem label="聊天审核">
            <i-switch
              v-model="curChannelDetail.chat_check_flag ? true : false"
              @on-change="changeChatCheckFlag"
            ></i-switch>
          </FormItem>
        </Form>
      </TabPane>
      <TabPane label="自定义菜单">
        <Row>
          <Col span="12">
            <!-- 菜单项 -->
            <Button type="primary" @click="addNewMenu">添加菜单</Button>
            <br />
            <span v-for="(item, index) in curChannelDetail.custom_menu" :key="item.menu_id">
              <Tag
                type="dot"
                closable
                checkable
                :checked="index === curTag"
                @on-change="selectCurTag"
                @on-close="closeTag(index)"
                :name="index"
                color="primary"
              >{{item.menu_name}}</Tag>
            </span>
            <br />
            <Row>
              <Col span="20">
                菜单名称
                <Input v-model="tempMenu.menu_name"></Input>
              </Col>
            </Row>
            <Row>
              <Col span="20">
                菜单分类
                <Select v-model="tempMenu.menu_type" @on-change="changeMenuType">
                  <Option
                    v-for="(item, index) in menuOption"
                    :value="index"
                    :disabled="disableList.includes(index)"
                    :key="index
                  "
                  >{{item}}</Option>
                </Select>
              </Col>
            </Row>
          </Col>
          <Col span="12" style="padding-top: 34px;">
            <!-- 图文可用的富文本编辑 -->
            <div id="menuEditor" v-show="isShowRight === 1"></div>
            <!-- 专题穿梭框 -->
            <Transfer
              v-show="isShowRight === 3"
              :titles="transferTitle"
              :data="leftChannelList"
              :target-keys="targetKeys"
              @on-change="changeTransfer"
            ></Transfer>
            <!-- 照片直播 -->
            <Input
              v-model="curChannelDetail.photoUrl"
              v-show="isShowRight === 7"
              placeholder="请输入照片直播观看地址"
            ></Input>
            <!-- 大屏互动 -->
            <Input
              v-model="curChannelDetail.screenUrl"
              v-show="isShowRight === 8"
              placeholder="请输入大屏互动观看地址"
            ></Input>
          </Col>
        </Row>
      </TabPane>
      <TabPane label="自定义横幅">
        <Form>
          <Button type="primary" @click="addBanner">添加横幅</Button>
          <p>横幅图片建议尺寸：1500*200px；横幅图片大小：2M以内；横幅图片格式：png，jpg，jpeg；</p>

          <div v-for="(item, index) in curChannelDetail.banner_bar" :key="index">
            <Row>
              <Col span="24">
                <RadioGroup class="radioGroup" v-model="item.banner_type">
                  <!-- 切换的时候要重置原来的数据 -->
                  <Radio :label="0">
                    <span>文字</span>
                  </Radio>
                  <Radio :label="1">
                    <span>图片</span>
                  </Radio>
                </RadioGroup>
              </Col>
            </Row>
            <Row>
              <Col span="8" class="bannerItem" v-show="item.banner_type == 0">
                <Input v-model="item.banner_text" placeholder="文字内容"></Input>
              </Col>
              <Col span="8" class="bannerItem" v-show="item.banner_type == 1">
                <div @click="setCurBanner(index)">
                  <Upload
                    class="upload"
                    :name="upload.name"
                    :headers="{'token': token}"
                    :show-upload-list="false"
                    :format="['jpg','jpeg','png']"
                    :max-size="2048"
                    :on-format-error="handleFormatError"
                    :on-success="sucessBannerUrl"
                    type="drag"
                    :action="upload.url"
                  >
                    <div
                      class="uploadBanner"
                      :style="{'background-image': 'url('+ curChannelDetail.banner_bar[index].banner_imgurl + ')'}"
                    >
                      <Icon type="md-add" />点击添加图片
                    </div>
                  </Upload>
                </div>
              </Col>
              <Col span="8" class="bannerItem">
                <Input v-model="item.banner_link" placeholder="链接地址"></Input>
              </Col>
              <Col span="8">
                <Icon @click="delBanner(index)" class="bannerDel" type="ios-remove-circle-outline" />
              </Col>
            </Row>
          </div>
        </Form>
      </TabPane>
      <TabPane label="默认回放">
        <div
          style="padding: 0 20px 20px 0; float:left;"
          v-for="(item, index) in playBackList"
          :key="item.video_id"
          @click="togglePay(item.video_id)"
        >
          <Card style="width:176px;" :class="{'cardActive':isChoose == item.video_id}">
            <p slot="title">
              <span :title="item.title">{{item.title}}</span>
            </p>
            <div style="height: 80px;">
              <img :src="item.cover_url" alt="封面图片" style="width: 100%; height: 100%;" />
            </div>
          </Card>
        </div>
      </TabPane>
    </Tabs>

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

    <Modal :title="imgTitle" v-model="showImg">
      <!-- 图片放大展示 -->
      <img :src="imgUrl" alt="图片加载失败" style="width: 100%; background: #ccc;" />
      <div slot="footer">
        <Button type="primary" @click="closeImg">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Editor from 'wangeditor'
import Clipboard from 'clipboard'
import VueQrcode from '@xkeshi/vue-qrcode'
import { getToken } from '@/libs/util'
import config from '@/config'
import { Base64 } from 'js-base64'

import {
  getChannelPage,
  getSpecialPage,
  addSpecial,
  delSpecial,
  channel_playback_list,
  getAccount,
  getDevicePage
} from '@/api/data'

export default {
  name: 'control',
  props: ['channelDetail'],
  components: {
    Editor,
    VueQrcode
  },
  data() {
    const validateTitle = (rule, value, callback) => {
      let val = this.curChannelDetail.wx_share_title
      if (!val) {
        callback(new Error('这是必填字段'))
      } else {
        callback()
      }
    }

    const validateDetail = (rule, value, callback) => {
      let val = this.curChannelDetail.wx_share_msg
      if (!val) {
        callback(new Error('这是必填字段'))
      } else {
        callback()
      }
    }

    const validateName = (rule, value, callback) => {
      let val = this.curChannelDetail.wx_mp_name
      if (!val) {
        callback(new Error('这是必填字段'))
      } else {
        callback()
      }
    }

    return {
      curBanner: 0,
      imgTitle: '',
      showImg: false,
      imgUrl: '',
      liveList: [],
      pageLiveData: {},
      accountList: [],
      pageAccountData: {},
      modalAccount: false,
      modalLive: false,
      defAccount: '',
      tempMenu: {},
      curTag: 0,
      curOption: '',
      // isShowEditor: false,
      isChoose: -1,
      isShowRight: '',
      disableList: [],
      transferTitle: ['频道标题  频道ID', '频道标题  频道ID'],
      leftPageData: {},
      rightPageData: {},
      leftChannelList: [],
      targetKeys: [], // 自定义菜单专题右侧不显示数据
      isShowQrcode: '',
      token: '',
      playBackList: [],
      editor: null,
      upload: {
        name: 'file',
        url: ''
      },
      directSelect: [
        { value: 'PULL', label: '网络拉流' },
        { value: 'PUSH', label: '网络推流' },
        { value: 'HDMI', label: '本地HDMI推流' },
        { value: 'USB', label: '本地USB推流' },
        { value: 'PHONE', label: '本地手机推流' }
      ],
      columns: [
        {
          title: '编号',
          key: 'direct_rtmp_id',
          width: 60
        },
        {
          title: '类型',
          key: 'direct_rtmp_type',
          width: 200,
          render: (h, params) => {
            return h(
              'Select',
              {
                props: {
                  value: this.curChannelDetail.direct_streams[params.index]
                    .direct_rtmp_type
                },
                on: {
                  'on-change': value => {
                    this.curChannelDetail.direct_streams[
                      params.index
                    ].direct_rtmp_type = value
                  }
                }
              },
              this.directSelect.map(obj => {
                return h('Option', {
                  props: { value: obj.value, label: obj.label }
                })
              })
            )
          }
        },
        {
          title: '导播预监推流地址',
          key: 'direct_rtmp_push_url',
          type: 'expend',
          render: (h, params) => {
            return h(
              'Input',
              {
                props: {
                  value: params.row.direct_rtmp_push_url
                },
                class: {
                  groupInput: true
                },
                attrs: {
                  id: 'copy1' + params.row.direct_rtmp_id
                }
              },
              [
                h(
                  'Button',
                  {
                    attrs: {
                      // 普通html属性
                      'data-clipboard-target':
                        '#copy1' + params.row.direct_rtmp_id
                    },
                    on: {
                      click: () => {
                        this.copy()
                      }
                    },
                    class: {
                      copyBtn: true
                    },
                    ref: 'copy',
                    slot: 'append'
                  },
                  '复制'
                ),
                h(
                  'Button',
                  {
                    props: {
                      // 组件属性
                    },
                    attrs: {
                      // 普通html属性
                      // 'v-clipboard': 'clipOptions'
                    },
                    on: {
                      'mouseenter.native': () => {
                        this.changeQrcode('copy1' + params.row.direct_rtmp_id)
                      }
                    },
                    slot: 'append'
                  },
                  '二维码'
                ),
                //  <VueQrcode
                //   class="showQrcode"
                //   v-show="isShowQrcode == 'copy3'"
                //   :value="curChannelDetail.streams.rtmp_push_url"
                //   :options="{ size: 100 }"
                // ></VueQrcode>
                h('VueQrcode', {
                  class: {
                    showQrcode: true
                  },
                  attrs: {
                    // 'v-show': 'isShowQrcode ==' + 'copy1' + params.row.direct_rtmp_id,
                    ':value': params.row.direct_rtmp_push_url,
                    ':option': { size: 100 }
                  }
                })
              ]
            )
          }
        },
        {
          title: '导播预监播放rtmp地址',
          key: 'direct_rtmp_play_url',
          render: (h, params) => {
            return h(
              'Input',
              {
                props: {
                  value: params.row.direct_rtmp_play_url
                },
                class: {
                  groupInput: true
                },
                attrs: {
                  id: 'copy2' + params.row.direct_rtmp_id
                }
              },
              [
                h(
                  'Button',
                  {
                    attrs: {
                      // 普通html属性
                      'data-clipboard-target':
                        '#copy2' + params.row.direct_rtmp_id
                    },
                    on: {
                      click: () => {
                        this.copy()
                      }
                    },
                    class: {
                      copyBtn: true
                    },
                    ref: 'copy',
                    slot: 'append'
                  },
                  '复制'
                ),
                h(
                  'Button',
                  {
                    props: {
                      // 组件属性
                    },
                    attrs: {
                      // 普通html属性
                      // 'v-clipboard': 'clipOptions'
                    },
                    slot: 'append'
                  },
                  '二维码'
                )
              ]
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 100,
          align: 'center',
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
                      this.removeRow(params.row.direct_rtmp_id)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      menuOption: [
        '简介',
        '图文',
        '聊天',
        '专题',
        '榜单',
        '回放',
        '成员',
        '照片直播',
        '大屏互动'
      ],
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
                    this.curChannelDetail.device_name = params.row.device_name
                    this.curChannelDetail.device_id = params.row.device_id
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
                    this.curChannelDetail.account_id = params.row.account_id
                    this.curChannelDetail.account_name = params.row.name
                    this.modalAccount = false
                  }
                }
              },
              '选择'
            )
          }
        }
      ],
      curChannelDetail: {
        wx_share_title: '',
        wx_share_msg: '',
        wx_mp_name: '',
        streams: {},
        custom_menu: [{}, {}, {}, {}, {}],
        banner_bar: [
          {
            banner_type: 0,
            banner_imgurl: ''
          }
        ]
      },
      ruleValidate: {
        // name: [
        //   {
        //     required: true,
        //     message: '这是必填字段',
        //     trigger: 'blur'
        //   }
        // ],
        // account_name: [
        //   {
        //     required: true,
        //     message: '这是必填字段',
        //     trigger: 'blur'
        //   }
        // ],
        // device_name: [
        //   {
        //     required: true,
        //     message: '这是必填字段',
        //     trigger: 'blur'
        //   }
        // ],
        // guide_image: [
        //   {
        //     required: true,
        //     message: '这是必填字段',
        //     trigger: 'blur'
        //   }
        // ],
        // cover_logo: [
        //   {
        //     required: true,
        //     message: '这是必填字段',
        //     trigger: 'blur'
        //   }
        // ],
        // live_image: [
        //   {
        //     required: true,
        //     message: '这是必填字段',
        //     trigger: 'blur'
        //   }
        // ],
        // user_num_base: [
        //   {
        //     required: true,
        //     message: '这是必填字段',
        //     trigger: 'blur',
        //     type: 'number'
        //   }
        // ],
        wx_share_title: [
          {
            required: true,
            // message: '这是必填字段',
            validator: validateTitle,
            trigger: 'change'
          }
        ],
        wx_share_msg: [
          {
            required: true,
            validator: validateDetail,
            // message: '这是必填validateDetail字段',
            trigger: 'change'
          }
        ],
        wx_mp_name: [
          {
            required: true,
            validator: validateName,
            // message: '这是必填字段',
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    errorWxUrl() {
      this.$Message.error('添加失败')
    },
    clipOptions() {
      return {
        value: this.curChannelDetail.streams.rtmp_push_url,
        success: e => {
          this.$Message.success('复制成功')
        },
        error: () => {
          this.$Message.error('复制失败')
        }
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

    const baseUrl =
      process.env.NODE_ENV === 'development'
        ? config.baseUrl.dev
        : config.baseUrl.pro
    this.upload.url = baseUrl + 'console/uploadLogo.do'
  },
  methods: {
    // 关闭图片展示窗口
    closeImg() {
      this.showImg = false
    },
    // 图片放大预览
    handleImg(title, url) {
      this.imgTitle = title
      this.imgUrl = url
      this.showImg = true
    },
    changeLivePage(res) {
      this.getDevice(res)
    },
    getDevice(page = 1) {
      // 直播机选择分页
      const data = { page: page, deviceNumber: '' }
      getDevicePage(data).then(res => {
        this.liveList = res.data.deviceLst
        this.pageLiveData = res.data.PageInfo
      })
    },
    getLive() {
      // 频道直播机获取
      this.modalLive = true
      this.getDevice()
    },
    changeAccountPage(res) {
      // 账户选择分页
      this.getAccountPage('', '', res)
    },
    getAccountPage(page = 1) {
      // 获取账户列表
      const data = { page: page }
      getAccount(data).then(res => {
        this.accountList = res.data.accountList
        this.pageAccountData = res.data.pageData
        if (this.defAccount === 'unit') {
          this.curChannelDetail.account_id = res.data.accountList[0].account_id
          this.curChannelDetail.account_name = res.data.accountList[0].name
        }
      })
    },
    getAccount() {
      // 频道所属账户获取
      this.modalAccount = true
      this.getAccountPage()
    },
    togglePay(videoId) {
      // 默认回放设置
      if (videoId == this.isChoose) {
        this.isChoose = -1
        this.curChannelDetail.live_video_id = ''
      } else {
        this.isChoose = videoId
        this.curChannelDetail.live_video_id = videoId
      }
    },
    getVedioList(page = '1') {
      // 获取回放列表
      let data = {
        channel_id: this.channelDetail.channel_id,
        page: page
      }
      channel_playback_list(data).then(res => {
        this.playBackList = res.data.playbackLst
        console.log('获取回放列表')
      })
    },
    delBanner(index) {
      // 删除横幅
      this.curChannelDetail.banner_bar.splice(index, 1)
    },
    addBanner() {
      // 添加横幅
      let data = {
        banner_type: 0,
        banner_imgurl: '',
        banner_text: '',
        banner_link: ''
      }
      this.curChannelDetail.banner_bar.push(data)
    },
    handleFormatError() {
      // 文件上传类型校验失败
      this.$Message.error('仅支持以下图片格式：png，jpg，jpeg')
    },
    setCurBanner(index) {
      this.curBanner = index
    },
    sucessBannerUrl(res) {
      // 自定义横幅图片添加
      this.curChannelDetail.banner_bar[this.curBanner].banner_imgurl =
        res.filePathName
      this.$Message.success('添加成功')
    },
    sucessQrcodeUrl(res) {
      // 图片文件上传成功处理 	公众号二维码图片地址
      this.curChannelDetail.wx_mp_image = res.filePathName
      this.$Message.success('添加成功')
    },
    sucessGuideUrl(res) {
      // 图片文件上传成功处理 引导图片地址
      this.curChannelDetail.guide_image = res.filePathName
      this.$Message.success('添加成功')
    },
    sucessLogoUrl(res) {
      // 图片文件上传成功处理 LOGO地址
      this.curChannelDetail.cover_logo = res.filePathName
      this.$Message.success('添加成功')
    },
    sucessBgUrl(res) {
      // 图片文件上传成功处理 背景地址
      this.curChannelDetail.live_image = res.filePathName
      this.$Message.success('添加成功')
    },
    sucessWxUrl(res) {
      // 图片文件上传成功处理 微信分享缩略图
      this.curChannelDetail.wx_share_image = res.filePathName
      this.$Message.success('添加成功')
    },
    addNewDirect() {
      // 新增导播推流地址
      let obj = {
        direct_rtmp_id: '',
        direct_rtmp_play_url: '',
        direct_rtmp_push_url: '',
        direct_rtmp_type: ''
      }
      let length = this.curChannelDetail.direct_streams.length
      if (length > 5) {
        this.$Message.warning('最多添加6个')
        return
      }
      if (!length) {
        obj.direct_rtmp_id = 1
      } else {
        obj.direct_rtmp_id = length + 1
      }
      this.curChannelDetail.direct_streams.push(obj)
      console.log('新增导播推流地址')
    },
    removeRow(index) {
      // 删除导播推流地址
      let tempArr = this.curChannelDetail.direct_streams
      tempArr.forEach((el, i) => {
        if (el.direct_rtmp_id == index) {
          tempArr.splice(i, 1)
        }
      })
      // 重新编号排序
      tempArr.forEach((el, i) => {
        el.direct_rtmp_id = i + 1
      })
    },
    changeQrcode(param) {
      this.isShowQrcode = param
    },
    copy() {
      const clipboard = new Clipboard('.copyBtn')
      clipboard.on('success', e => {
        e.clearSelection()
        this.$Message.success('复制成功')
        // 处理成功后要销毁 clipboard
        if (clipboard) {
          clipboard.destroy()
        }
      })
      //失败回调
      clipboard.on('error', function(e) {
        this.$Message.error('复制失败')
      })
    },
    changeRecordType(status) {
      // 直播类型选择
      this.curChannelDetail.record_type = status ? 1 : 0
    },
    changeCountDownFlag(status) {
      // 倒计时开关
      this.curChannelDetail.countdown_flag = status ? 1 : 0
    },
    changeGuideFlag(status) {
      // 引导图开关
      this.curChannelDetail.guide_flag = status ? 1 : 0
    },
    changeDownloadFlag(status) {
      // 分享下载开关
      this.curChannelDetail.download_flag = status ? 1 : 0
    },
    changeWxMpFlag(status) {
      // 公众号显示开关
      this.curChannelDetail.wx_mp_flag = status ? 1 : 0
    },
    changeWxMpPop(status) {
      // 自动弹出公众号开关
      this.curChannelDetail.wx_mp_pop = status ? 1 : 0
    },
    changeChatAllowFlag(status) {
      // 允许频道聊天
      this.curChannelDetail.chat_allow_flag = status ? 1 : 0
    },
    changeChatCheckFlag(status) {
      // 聊天审核
      this.curChannelDetail.chat_check_flag = status ? 1 : 0
    },
    addNewMenu() {
      // 添加菜单
      if (this.curChannelDetail.custom_menu.length >= 5) {
        this.$Message.warning('最多5个')
        return
      }
      let data = {
        menu_id: this.curChannelDetail.custom_menu.length + 1,
        menu_name: '菜单名称',
        menu_type: '',
        menu_detail: ''
      }
      this.curChannelDetail.custom_menu.push(data)
      // console.log(this.curChannelDetail.custom_menu)
      // 选中当前菜单
      this.curTag = this.curChannelDetail.custom_menu.length - 1
      console.log('添加菜单')
    },
    selectCurTag(checked, name) {
      // 菜单tag切换
      // 这里的name用来存储当前选中项的序号,用这个来改变临时显示的值
      this.curTag = name
      this.tempMenu = this.curChannelDetail.custom_menu[name]
      // 清空或还原数据
      if (this.tempMenu.menu_type === 1) {
        this.editorContent = this.tempMenu.menu_detail
      } else {
        this.editorContent = ''
      }
      this.isShowRight = this.tempMenu.menu_type

      // 更新 select 选中值
      this.curOption = this.tempMenu.menu_type
      // editor 编辑框销毁
      if (this.tempMenu.menu_detail) {
        // let tempHtml = '' + Base64.decode(this.tempMenu.menu_detail)
        this.editor.txt.html(this.tempMenu.menu_detail)
      }
    },
    closeTag(index) {
      // 释放被禁用的select 选项
      // console.log(this.curChannelDetail.custom_menu, this.disableList)
      let i = this.disableList.length
      while (i--) {
        // 移除 disabled 队列
        if (
          this.disableList[i] ===
          this.curChannelDetail.custom_menu[index].menu_type
        ) {
          this.disableList.splice(i, 1)
        }
      }
      // 删除 tag
      this.curChannelDetail.custom_menu.splice(index, 1)
      // 更新当前显示为第一个
      if (this.curChannelDetail.custom_menu.length > 0) {
        this.tempMenu = this.curChannelDetail.custom_menu[0]
      } else {
        this.tempMenu = {
          menu_id: '',
          menu_name: '',
          menu_type: '',
          menu_detail: ''
        }
      }
      // 更新当前序号
      for (let item in this.curChannelDetail.custom_menu) {
        this.curChannelDetail.custom_menu[item].menu_id = item
      }
    },
    changeMenuType(value) {
      // 菜单分类 select 切换
      // 菜单分类改变， value 为改变后的值, curOption 为当前select 的值
      let i = this.disableList.length
      while (i--) {
        // 移除 disabled 队列
        if (this.disableList[i] === this.curOption) {
          this.disableList.splice(i, 1)
        }
      }
      // 更新选中值
      this.curOption = value
      // 加入 disabled 队列
      this.isShowRight = this.tempMenu.menu_type
      if (value !== 1) {
        this.disableList.push(value)
        this.editorContent = this.tempMenu.menu_detail
      }
    },
    getLeftProjectList(page = 1, filter = '', live = '') {
      // 自定义菜单专题左侧所有频道数据
      const data = { page, filter, live }
      getChannelPage(data).then(res => {
        this.leftPageData = res.data.pageData
        let arr = []
        // this.leftChannelList = res.data.channelList
        res.data.channelList.forEach(function(el) {
          let label = el.name + '(' + el.channel_id + ')'
          let obj = { key: el.channel_id, label: label }
          arr.push(obj)
        })
        this.leftChannelList = arr
      })
    },
    getRightProjectList() {
      // 自定义菜单右侧
      let data = { channel_id: this.channelDetail.channel_id, page: 1 }
      getSpecialPage(data).then(res => {
        this.rightPageData = res.data.page
        let arr = []
        res.data.data.forEach(function(el) {
          arr.push(el.special_channel_id)
        })
        this.targetKeys = arr
      })
    },
    changeTransfer(targetKeys, direction, moveKeys) {
      // 自定义菜单频道数据切换
      if (moveKeys.length > 1) {
        this.$Message.warning('每次只能操作一条数据')
        return
      }
      let data = {
        channel_id: this.channelDetail.channel_id,
        special_channel_id: moveKeys[0]
      }
      if (direction === 'left') {
        // 删除右侧
        delSpecial(data).then(res => {
          if (res.data.result === true) {
            this.$Message.success('删除成功')
            this.targetKeys = targetKeys
          } else {
            this.$Message.error('删除失败')
          }
        })
      } else if (direction === 'right') {
        // 添加右侧
        addSpecial(data).then(res => {
          if (res.data.result === true) {
            this.$Message.success('添加成功')
            this.targetKeys = targetKeys
          } else {
            this.$Message.error('添加失败')
          }
        })
      } else {
        // 错误
        this.$Message.warning('操作错误')
      }
    }
  },
  mounted() {
    // 初始化获取的值
    this.curChannelDetail = this.channelDetail
    // 初始化默认显示的菜单项
    this.tempMenu = this.curChannelDetail.custom_menu[0]
    // 菜单分类除图文外均只有一个选择项，添加 disabled 属性
    let arr = []
    this.curChannelDetail.custom_menu.forEach(el => {
      if (el.menu_type !== 1) {
        arr.push(el.menu_type)
      }
      if (el.menu_type === 7) {
        this.curChannelDetail.photoUrl = el.menu_detail
      }
      if (el.menu_type === 8) {
        this.curChannelDetail.screenUrl = el.menu_detail
      }
    })
    this.curOption = arr[0]
    this.disableList = arr
    // 判断类型是否为图文，展示右侧的富文本框
    if (this.tempMenu.menu_type === 1) {
      this.isShowEditor = true
    }
    // 初始化 wangeditor
    this.editor = new Editor('#menuEditor')
    this.editor.customConfig.onchange = html => {
      this.curChannelDetail.editorContent = html
      // 存到对应的菜单项中，类型改变的话，在提交时统一剔除处理
      this.curChannelDetail.custom_menu[this.curTag].menu_detail = html
    }
    this.editor.create()
    // 判断是否第一个默认是图文类型，默认为图文的话，展示编辑框并加载内容
    if (this.curChannelDetail.custom_menu[0].menu_type === 1) {
      this.isShowRight = 1
      this.editor.txt.html(this.curChannelDetail.custom_menu[0].menu_detail)
    } else {
      this.isShowRight = this.curChannelDetail.custom_menu[0].menu_type
    }
    let editor2 = new Editor('#detailEditor')
    editor2.customConfig.onchange = html => {
      this.curChannelDetail.detail = html
    }
    editor2.create()
    editor2.txt.html(this.curChannelDetail.detail)

    // 获取自定义菜单专题列表
    this.getLeftProjectList()
    this.getRightProjectList()
    // 获取 token
    this.token = getToken()
    // 获取 回放列表
    this.getVedioList()
  }
}
</script>

<style scoped>
#detailEditor {
  position: relative;
  z-index: 1;
}
.basicForm input {
  width: 300px !important;
}
.doubleBox {
  display: inline-block;
  width: 50%;
}
.tips {
  padding-left: 10px;
  line-height: 24px;
}

.uploadGroup .ivu-upload i {
  color: #ccc;
  font-size: 24px;
}
.uploadGroup .ivu-upload:hover i {
  color: #2d8cf0;
}
.hoverBg {
  width: 100%;
  height: 72px;
  background: #ccc;
}
.hoverBtn {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 72px;
  background: #000;
  opacity: 0;
}
.hoverBtn:hover {
  cursor: pointer;
  opacity: 1;
  background: rgba(0, 0, 0, 0.4);
}
.hoverBtn div {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
}
.hoverBtn i {
  color: #ccc;
  font-size: 24px;
}
.hoverBtn i:hover {
  color: #2d8cf0;
}
.hoverBtn .eyes {
  position: relative;
  top: 2px;
}
.showQrcode {
  position: absolute;
  top: 36px;
  right: -22px;
  z-index: 9;
  background: #fff;
  border: 1px solid #ccc;
}
.uploadImg {
  width: 100%;
  height: 74px;
}
.uploadBanner {
  background-size: cover;
  background-repeat: no-repeat;
  background-color: #eaeaea;
  padding: 6px 0;
  color: #c5c5c5;
}
.uploadBanner:hover {
  color: #2d8cf0;
}
.bannerDel {
  font-size: 32px;
  color: #ccc;
}
.bannerDel:hover {
  color: #e74c3c;
  cursor: pointer;
}
.radioGroup {
  padding: 8px 0;
}
.bannerItem {
  padding-right: 10px;
}
.cardActive {
  border: 1px solid #2d8cf0;
}
.cardActive::before {
  content: '\F16E';
  position: absolute;
  bottom: -5px;
  right: -5px;
  font-size: 36px;
  color: #2d8cf0;
  font-family: Ionicons;
  /* speak: none; */
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  text-rendering: auto;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  vertical-align: middle;
}
.addIcon {
  position: absolute;
  font-size: 20px;
  color: #ccc;
  right: 4px;
  top: 6px;
}
</style>