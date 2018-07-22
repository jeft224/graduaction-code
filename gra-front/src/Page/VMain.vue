<template>
  <div>
    <top-banner></top-banner>
      <section class="w mt30 clearfix">
        <y-shelf title="热门商品">
          <div slot="content" class="hot">
            <mall-goods :msg="item" v-for="(item,i) in hot" :key="i"></mall-goods>
          </div>
        </y-shelf>
      </section>
      <section class="w mt30 clearfix" v-for="(item,i) in floors" :key="i">
        <y-shelf :title="item.title">
          <div slot="content" class="floors">
            <div class="imgbanner">
              <img v-lazy="floors[i].img" :alt="item.title">
            </div>
            <mall-goods :msg="tab" v-for="(tab,i) in item.tab" :key="i"></mall-goods>
          </div>
        </y-shelf>
      </section>
  </div>
</template>

<script>
  import YShelf from '../components/shelf'
  import MallGoods from '../components/mallGoods'
  import TopBanner from '../components/TopBanner'
  import {IsVersion} from '../utils/enviroment.js'
  import api from '../api'
    export default {
        name: "vmain",
        data(){
          return{
            num:0,
            floors: [],
            hot: [],
            router:{
              title:'路由器 智能硬件',
              tab:[],
              img:''
            },
            computer:{
              title:'笔记本 平板',
              tab:[],
              img:''
            },
            power:{
              title:'移动电源 电池 插线板',
              tab:[],
              img:''
            }
          }
        },
        mounted () {
          api.getAllGoods().then(res => {
            res.data.result.goods.forEach((item)=>{
                this.tagList(item)
            })
          })
          api.getHotGoods().then(res=>{
            res.data.result.forEach((item)=>{
              this.addhot(item)
            })
          })
          this.floors.push(this.router)
          this.floors.push(this.computer)
          this.floors.push(this.power)
        },
      components:{
        YShelf,
        MallGoods,
        TopBanner
      },
      methods:{
        addhot(item){
          this.num += 1;
          if(this.num>=5){
            return ;
          }
          this.hot.push(item)
        },
        tagList(item){
            if(item.tag === 'router'){
              if(this.router.tab.length>=2){
                return ;
              }
              this.router.img= IsVersion(item.productImageSmall[0])
              this.router.tab.push(item)
            }else if(item.tag === 'computer') {
              if (this.computer.tab.length >= 2) {
                return;
              }
              this.computer.img = IsVersion(item.productImageSmall[0])
              this.computer.tab.push(item)
            }else if(item.tag === 'power') {
              if (this.power.tab.length >= 2) {
                return;
              }
              this.power.img = IsVersion(item.productImageSmall[0])
              this.power.tab.push(item)
            }
          }

      }


    }
</script>

<style scoped lang="scss">

  .clearfix {
  }
  .w {
    width: 1230px;
    margin: 0 auto;
  }
  ul.box {
    display: flex;
  li {
    flex: 1;
  img {
    display: block;
    width: 305px;
    height: 200px;
  }
  }
  }
  .mt30 {
    margin-top: 10px;
  }
  .hot {
    display: flex;
  > div {
    flex: 1;
    width: 25%;
  }
  }
  .floors {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  .imgbanner {
    width: 50%;
    height: 430px;
  }
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
  }
</style>
