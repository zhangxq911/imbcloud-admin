<template>
  <!-- <Modal v-model="modalAccount" :scrollable="true" title="账户选择">
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
  </Modal>-->
  <Modal v-model="modal1" title="Common Modal dialog box title">
    <p>Content of dialog</p>
    <p>Content of dialog</p>
    <p>Content of dialog</p>
  </Modal>
</template>

<script>
export default {
  data() {
    return {
      modal1: false
    }
  }
}
</script>
