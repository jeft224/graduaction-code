<template>
	<div class="top-banner clearfix">
		<div class="site-category"
			@mouseleave="evtSideLeave">
			<div class="top-side-left">
				<ul class="side-left">
					<li class="side-item"
						@mouseenter="evtSideEnter(item.type)"
						v-for="item in sideItems">
						{{item.content}}
					</li>
				</ul>
			</div>
			<div class="site-category-detail"
				v-show="goodsStatus">
				<ul class="category-items" v-for="goods in filterCurrGoods">
					<li class="category-goods" v-for="item in goods">
            <router-link  class="goods-link" :to="'goodsDetails?productId='+item.productId">
							<img :src="item.imgUrl" alt="" style="width:40px;height: 40px"/>
							<div class="text-name">
								{{item.name}}
							</div>
						</router-link>
						<router-link class="goods-buy-link"
							v-show="item.buyStatus"
							to='/goodlist'>
								选购
						</router-link>
					</li>
				</ul>
			</div>
		</div>
		<slide :banners="banners"></slide>
	</div>
</template>

<script>
import slide from './Slide.vue'
import api from '../api'
export default {
	data () {
		return {
		  goods:[],
			currGoods: [],
			goodsStatus: false,
			sideItems: [
				{type: 'phones', content: '手机 电话卡'},
				{type: 'computer', content: '笔记本 平板'},
				{type: 'box', content: '电视 盒子'},
				{type: 'router', content: '路由器 智能硬件'},
				{type: 'power', content: '移动电源 电池 插线板'},
				{type: 'headset', content: '耳机 音响'},
				{type: 'foil', content: '保护套 贴膜'},
				{type: 'line', content: '线材 支架 存储卡'},
				{type: 'bags', content: '箱包 服饰'},
				{type: 'rabbit', content: '兔米 生活周边'}],
			banners: [
				{imgUrl: 'http://i3.mifile.cn/a4/bc62a28f-de64-4eee-853b-36772a97f67e'},
				{imgUrl: 'http://i3.mifile.cn/a4/ba4939c9-fc0a-4916-bddc-726fa00f7e9b'},
				{imgUrl: 'http://i3.mifile.cn/a4/9ced2c9e-f685-4918-9b2a-402af2d2039f'},
				{imgUrl: 'http://i3.mifile.cn/a4/f4bee59d-85a5-498f-ae57-a2cabe6aeb5b'},
				{imgUrl: 'http://i3.mifile.cn/a4/98fc8a58-c35c-475e-89cb-b8fe1659817f'}
			],
			phones: [],
			computer: [],
			box: [],
			router: [],
			power: [],
			headset: [],
			foil: [
				{sourceUrl: '//list.mi.com/9', imgUrl: 'http://c1.mifile.cn/f/i/15/goods/sidebar/tiemo.jpg?width=40&height=40', name: '贴膜', buyStatus: false},
				{sourceUrl: '//list.mi.com/8', imgUrl: 'http://c1.mifile.cn/f/i/15/goods/sidebar/baohu.jpg?width=40&height=40', name: '保护套/保护壳', buyStatus: false},
				{sourceUrl: '//list.mi.com/2', imgUrl: 'http://c1.mifile.cn/f/i/15/goods/sidebar/hougai.jpg?width=40&height=40', name: '后盖', buyStatus: false},
				{sourceUrl: '//list.mi.com/3', imgUrl: 'http://c1.mifile.cn/f/i/g/2015/video/tiezhi80.jpg?width=40&height=40', name: '背贴', buyStatus: false}
			],
			line: [
				{sourceUrl: '//list.mi.com/16', imgUrl: 'http://c1.mifile.cn/f/i/15/goods/sidebar/xiancai.jpg?width=40&height=40', name: '线材', buyStatus: false},
				{sourceUrl: '//search.mi.com/search_%E8%87%AA%E6%8B%8D%E6%9D%86', imgUrl: 'http://c1.mifile.cn/f/i/15/goods/sidebar/zipaigan.jpg?width=40&height=40', name: '自拍杆', buyStatus: false},
				{sourceUrl: '//list.mi.com/5', imgUrl: 'http://c1.mifile.cn/f/i/15/goods/sidebar/zhijia.jpg?width=40&height=40', name: '手机支架', buyStatus: false},
				{sourceUrl: '//list.mi.com/27', imgUrl: 'http://c1.mifile.cn/f/i/15/goods/sidebar/cunchu.jpg?width=40&height=40', name: '存储卡', buyStatus: false}
			],
			bags: [
				{sourceUrl: '//list.mi.com/23', imgUrl: 'http://c1.mifile.cn/f/i/g/2015/cn-index/xiangbao-80.jpg?width=40&height=40', name: '箱包', buyStatus: false},
				{sourceUrl: '//search.mi.com/search_%E6%97%85%E8%A1%8C%E7%AE%B1', imgUrl: 'http://c1.mifile.cn/f/i/15/goods/sidebar/lvxingxiang.jpg?width=40&height=40', name: '90分旅行箱', buyStatus: false},
				{sourceUrl: '//list.mi.com/22', imgUrl: 'http://c1.mifile.cn/f/i/g/2015/cn-index/fuzhuang-80.jpg?width=40&height=40', name: '服饰', buyStatus: false}
			],
			rabbit: [
				{sourceUrl: 'http://mitu.mi.com/', imgUrl: 'http://c1.mifile.cn/f/i/g/2015/cn-index/mitu-80.jpg?width=40&height=40', name: '米兔玩偶', buyStatus: false},
				{sourceUrl: '//list.mi.com/59', imgUrl: 'http://c1.mifile.cn/f/i/g/2015/cn-index/shubiaodian-80.jpg?width=40&height=40', name: '鼠标垫', buyStatus: false},
				{sourceUrl: '//list.mi.com/24', imgUrl: 'http://c1.mifile.cn/f/i/15/goods/sidebar/zhoubian1.jpg?width=40&height=40', name: '生活周边', buyStatus: false},
				{sourceUrl: '//www.mi.com/zazhi/index.html', imgUrl: 'http://c1.mifile.cn/f/i/g/2015/cn-index/zazhi-80-80.jpg?width=40&height=40', name: '《小米》杂志', buyStatus: false}
			]
		}
	},
	mounted () {
	  api.getAllGoods().then((res)=>{
	    this.goods = res.data.result.goods;
	    this.goods.forEach((item)=>{
	      if(item.tag === 'phones'){
          let paramPhones = {
              productId:'',
              imgUrl:'',
              name:'',
              buyStatus:true
          };
          paramPhones.productId = item.productId;
          paramPhones.imgUrl = item.productImageSmall[0];
          paramPhones.name = item.productName;
	        this.phones.push(paramPhones)
        }else if(item.tag === 'computer'){
          let paramComputer = {
            productId:'',
            imgUrl:'',
            name:'',
            buyStatus:true
          };
          paramComputer.productId = item.productId;
          paramComputer.imgUrl = item.productImageSmall[0];
          paramComputer.name = item.productName;
	        this.computer.push(paramComputer)
        }else if(item.tag === 'headset'){
          let paramComputer = {
            productId:'',
            imgUrl:'',
            name:'',
            buyStatus:true
          };
          paramComputer.productId = item.productId;
          paramComputer.imgUrl = item.productImageSmall[0];
          paramComputer.name = item.productName;
          this.headset.push(paramComputer)
        }else if(item.tag === 'router'){
          let paramComputer = {
            productId:'',
            imgUrl:'',
            name:'',
            buyStatus:true
          };
          paramComputer.productId = item.productId;
          paramComputer.imgUrl = item.productImageSmall[0];
          paramComputer.name = item.productName;
          this.router.push(paramComputer)
        }else if(item.tag === 'power'){
          let paramComputer = {
            productId:'',
            imgUrl:'',
            name:'',
            buyStatus:true
          };
          paramComputer.productId = item.productId;
          paramComputer.imgUrl = item.productImageSmall[0];
          paramComputer.name = item.productName;
          this.power.push(paramComputer)
        }else if(item.tag === 'box'){
          let paramComputer = {
            productId:'',
            imgUrl:'',
            name:'',
            buyStatus:true
          };
          paramComputer.productId = item.productId;
          paramComputer.imgUrl = item.productImageSmall[0];
          paramComputer.name = item.productName;
          this.box.push(paramComputer)
        }
      })
    })
	},
	computed: {
		filterCurrGoods: function () {
			let filterGoods = [[], [], [], [], []]
      // console.log(this.currGoods)
			this.currGoods.forEach(function (item, index) {
				let goodsIndex = Math.floor(index / 6)
				filterGoods[goodsIndex].push(item)
			})
      // console.log(filterGoods)
			return filterGoods
		}
	},
	methods: {
		evtSideEnter (currType) {
			this.currGoods = this[currType]
			this.goodsStatus = true
		},
		evtSideLeave () {
			this.goodsStatus = false
		}
	},
	components: {
		slide
	}
}
</script>

<style scoped lang="scss">
.top-banner {
	position: relative;
	width: 1226px;
	height: auto;
  margin: 61px auto 0 auto;
}
.site-category {
	position: absolute;
	left: 0;
	top: 0;
	width: 235px;
	height: auto;
	padding: 20px 0;
	background: rgba(0, 0, 0, 0.3);
	z-index: 10;
}

.side-left {
	margin: 0;
	padding: 0;
	width: 235px;
	height: 420px;
	list-style: none;
	.side-item {
		width: 100%;
		height: 42px;
		line-height: 42px;
		font-size: 14px;
		color: #fff;
		text-align: center;
		cursor: pointer;
		&:hover {
			background: #ff6700;
		}
	}
}

.site-category-detail {
	position: absolute;
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-start;
	left: 235px;
	top: 0;
	z-index: 10;
	border: 1px solid #e0e0e0;
	box-shadow: 3px 8px 16px rgba(0,0,0,0.18);
	.category-items {
		width: auto;
		height: 460px;
		margin: 0;
		padding: 0;
		list-style: none;
		background: #fff;
	}
	.category-goods {
		display: flex;
		flex-flow: row nowrap;
		justify-content: flex-start;
		align-items: center;
		width: 265px;
		height: 76.6px;
		padding: 0 20px 0 20px;
		box-sizing: border-box;
		background: #fff;
		cursor: pointer;
		.goods-link {
			display: flex;
			flex-flow: row nowrap;
			justify-content: flex-start;
			align-items: center;
			width: 170px;
		}
		.text-name {
			padding-left: 10px;
			font-size: 14px;
		}
		.goods-buy-link {
			display: block;
			width: 58px;
			height: 22px;
			line-height: 24px;
			font-size: 12px;
			text-align: center;
			color: #ff6700;
			border: 1px solid #ff6700;
			&:hover {
				color: #fff;
				background: #ff6700;
			}
		}
	}
}
</style>
