<template>
  <div style="background: #ededed; padding-bottom: 20px">
    <div class="goods-page" >
      <div class="nav">
          <div class="w">
            <a href="javascript:;" :class="{active:sortType===1}" @click="reset()">综合排序</a>
            <a href="javascript:;" @click="sort(1)" :class="{active:sortType===2}">价格从低到高</a>
            <a href="javascript:;" @click="sort(-1)" :class="{active:sortType===3}">价格从高到低</a>
            <div class="price-interval">
              <input type="number" class="input" placeholder="价格" v-model="params.min">
              <span style="margin: 0 5px"> - </span>
              <input type="number" placeholder="价格" v-model="params.max">
              <input type="button" class="main-btn" @click="reset" style="margin-left: 10px;" value="确定">
            </div>
          </div>
      </div>

      <div class="goods-box">
        <mall-goods v-for="(item,i) in computer" :key="i" :msg="item"></mall-goods>
      </div>

      <div v-show="!busy"
           class="w load-more"
           v-infinite-scroll="loadMore"
           infinite-scroll-disabled="busy"
           infinite-scroll-distance="100">
        正在加载中...
      </div>

    </div>
  </div>
</template>

<script>
  import MallGoods from '../components/mallGoods'
  import api from '../api'
    export default {
        name: "goodslist",
        data(){
          return {
            computer: [],
            busy: false,
            timer: null,
            sortType: 1,
            windowHeight: null,
            windowWidth: null,
            params: {
              page: 1,  // 页码
              sort: '', // 排序
              min: '',  // 最小价格
              max: ''
            }
          }
        },
        methods:{
          getAllGoods(flag){
            const {page, sort, min, max} = this.params
            let params = {
              page,
              sort,
              priceGt: min,
              priceLte: max
            }
            api.getAllGoods(params).then((res)=>{
              console.log(res.data.result.goods)
              if(res.data.code ===1){
                if(res.data.result.goods.length !== 0){
                  let data = res.data.result.goods
                  if (flag) {
                    this.computer = this.computer.concat(data)
                  } else {
                    this.computer = data
                  }
                }else{
                  clearTimeout(this.timer)
                  this.busy = true
                }
              }else{
                this.$Message.error(res.data.result.message)
              }
            })
          },
          reset(){
            this.sortType = 1
            this.params.sort = ''
            this.params.page = 1
            this.busy = false
            this.getAllGoods()
          },
          sort(param){
            param === 1 ? this.sortType = 2 : this.sortType = 3
            this.params.sort = param
            this.params.page = 1
            this.busy = false
            this.getAllGoods()
          },
          // 加载更多
          loadMore () {
            this.busy = true
            this.timer = setTimeout(() => {
              this.params.page++
              this.getAllGoods(true)
              this.busy = false
            }, 500)
          }
        },
        created(){
          this.getAllGoods();
        },
        mounted () {
          this.windowHeight = window.innerHeight
          this.windowWidth = window.innerWidth
        },
        components:{
          MallGoods
        },
    }
</script>

<style lang="scss" scoped>
  .goods-page{
    padding-top: 104px;
    width: 1220px;
    margin: 0 auto;
    padding-bottom: 20px;
  }
  .nav {
    height: 60px;
    line-height: 60px;
    > div {
      display: flex;
      align-items: center;
      a {
        padding: 0 15px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #999;
        &.active {
          color: #5683EA;
        }
        &:hover {
          color: #5683EA;
        }
      }
      input {
        width: 80px;
        height: 30px;
        border: 1px solid #ccc;
      }
      input + input {
        margin-left: 10px;
      }
    }
    .price-interval {
      padding: 0 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      input[type=number] {
        border: 1px solid #ccc;
        text-align: center;
        background: none;
        border-radius: 5px;
      }
    }
  }

  .goods-page .load-more {
    width: 100%;
    text-align: center;
    background: #fff
  }

  .goods-box {
    > div {
      float: left;
      border: 1px solid #efefef;
    }
  }

  .main-btn {
    border: 1px solid #5c81e3;
    border-radius: 4px;
    font-size: 12px;
    color: #fff;
    background-color: #678ee7;
    background-image: linear-gradient(180deg,#678ee7,#5078df);
    text-align: center;
    line-height: 28px;
    vertical-align: middle;
    cursor: pointer;
  }
  .main-btn:hover {
    background-color: #6c8cd4;
    background-image: linear-gradient(180deg,#6c8cd4,#4769c2);
  }
</style>
