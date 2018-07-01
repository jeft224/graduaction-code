<template>
    <div class="home">
      <v-header></v-header>

      <router-view class="main"></router-view>

      <v-footer></v-footer>
    </div>
</template>

<script>
    import VHeader from './VHeader'
    import VFooter from './VFooter'
    import TopBanner from './TopBanner'
    import VMain from '../Page/VMain'
    export default {
        name: "home",
        components:{
          VHeader,
          VFooter,
          TopBanner,
          VMain
        }
    }
</script>

<style lang="scss" scoped>
  .main {
    min-height: calc(100vh - 454px);
    background: #ededed;
    overflow: hidden;
    width: 100%;
  }
</style>
