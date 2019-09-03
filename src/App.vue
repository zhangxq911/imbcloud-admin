<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store") ) {
        this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem("store"))))
    } 

    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload",()=>{
        sessionStorage.setItem("store",JSON.stringify(this.$store.state))
    })

    // 判断是否是华为平板，需要调整缩放比例
    
  }
}
</script>

<style lang="less">
@media (min-width: 600px){
  #app {
    zoom: .8;
  }
}
@media (min-width: 1024px){
  #app {
    zoom: .9;
  }
}
@media (min-width: 1440px){
  #app {
    zoom: 1;
  }
}
@media (min-width: 1920px){
  #app {
    zoom: 1.2;
  }
}
.size{
  width: 100%;
  height: 100%;
}
html,body{
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
.groupInput {
  top: 0 !important;
}
.uploadGroup .upload .ivu-upload {
  background: none;
  border: none;
  font-size: 24px;
}
// 控制 wangeditor 的内容区域高度
.w-e-text-container {
  height: 160px !important;
}
// 直播回放的checkbox 隐藏 label
.boxDis>span:nth-child(2) {
  display: none;
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
.refresh {
  color: #c5c5c5;
  font-size: 32px;
}
.refresh:hover {
  cursor: pointer;
  color: #19be6b;
}
</style>
