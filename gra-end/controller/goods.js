const Goods = require('../model/Goods');
const path = require('path');
const fs = require('fs');
require('../utils/date')

const {
    handleError,
    handleSuccess
} = require("../utils/handle")

class GoodsController{
    // 添加商品
    static async AddGoods(ctx){
        const obj = ctx.request.body.fields;
        let files =  ctx.request.body.files.file;
        if(!Array.isArray(files)){
            files = ctx.request.body.files;
        }

        const filespath = []
        for(var item in files) {

            var tmpath = files[item]['path'];
            var tmparr = files[item]['name'].split('.');
            var ext = '.' + tmparr[tmparr.length - 1];
            var newpath = path.join('public/upload', parseInt(Math.random() * 100) + Date.parse(new Date()).toString() + ext);

            let filepath ="http://localhost:8000/"+ newpath.replace(/\\/g,"/").substring(7)

            filespath.push(filepath)
            var stream = fs.createWriteStream(newpath);//创建一个可写流
            fs.createReadStream(tmpath).pipe(stream);//可读流通过管道写入可写流
        }
        let platform = '2518';
        let r1 = Math.floor(Math.random() * 10);
        let r2 = Math.floor(Math.random() * 10);
        let sysDate = new Date().Format('yyyyMMddhhmmss');
        let productId = platform + r1 + sysDate + r2;
        const goods = new Goods({
            productId:productId,
            salePrice:obj.salePrice,
            productName:obj.productName,
            stock:obj.stock,
            sub_title:obj.sub_title,
            limit_num:10,
            createTime:obj.createTime,
            hot:obj.hot,
            tag:obj.tag,
            productImageSmall:filespath
        })
        const good = await goods.save().catch((err)=> ctx.throw(500,err,'服务器内部错误'))
        if(good){
            handleSuccess({ctx,result:{goods},message:"商品添加成功！！！"})
        }else{
            handleError({ctx,message:"商品添加失败！！！"})
        }
    }
    // 获取商品(后台管理)
    static async getGoods(ctx){
        const page = ctx.params.page;
        const pageSize = 10;
        const total = await Goods.find({dr:0}).count().catch((err)=>{
            ctx.throw(500,err,'服务器内部错误');
        })
        const goods = await Goods.find({dr:0},{},{ skip: (page - 1) * pageSize,
            limit: pageSize}).catch((err)=>{
            ctx.throw(500,err,'服务器内部错误');
        })

        if(goods){
            handleSuccess({ ctx,result:{goods,total}, message: '查询商品成功！' })
        }else{
            handleError({ctx,message:'查询商品失败！'})
        }
    }
    // 根据商品id查询
    static async getGood(ctx){
        const goodId = ctx.params.goodId;
        const good = await Goods.findOne({productId:goodId,dr:0}).catch((err)=>{
            ctx.throw(500,err,'服务器内部错误');
        })
        if(good){
            handleSuccess({ ctx,result:{good}, message: '查询商品成功！' })
        }else{
            handleError({ctx,message:'查询商品失败！'})
        }
    }
    //删除商品
    static async deleteGood(ctx){
        const productId = ctx.request.body.productId;
        console.log(productId)
        const goods = Goods.update({productId}, {dr:1}).catch((err)=>{
            ctx.throw(500,err,'服务器内部错误');
        })
        if(goods){
            handleSuccess({ ctx, message: '删除商品成功！' })
        }else{
            handleError({ctx,message:'删除商品失败！'})
        }

    }
    // 查询全部的商品
    static async getAllGoods(ctx){
        let arr = Object.keys(ctx.request.body);
        let goods;
        if(arr.length===0){
            goods = await Goods.find({dr:0}).catch((err)=>{
                ctx.throw(500,err,'服务器内部错误');
            })
        }else{
            let sort = ctx.request.body.sort || '';
            let page = +ctx.request.body.page || 1;
            let pageSize = +ctx.request.body.pageSize || 8;
            let priceGt = +ctx.request.body.priceGt || ''; // 大于
            let priceLte = +ctx.request.body.priceLte || ''; // 小于
            let skip = (page - 1) * pageSize;//跳过多少条
            let params = {dr:0}
            if (priceGt || priceLte) {
                if (priceGt && priceLte) {
                    if (priceGt > priceLte) {
                        var l = priceLte, g = priceGt
                        priceGt = l
                        priceLte = g
                    }
                    params = {
                        'salePrice': {
                            $gt: priceGt,
                            $lte: priceLte
                        },
                        'dr':0
                    }
                } else {
                    params = {
                        'salePrice': {
                            $gt: priceGt || 0,
                            $lte: priceLte || 99999
                        },
                        'dr':0
                    }
                }
            }
            //升序 1  降序 -1
            //sort && goods.sort({'salePrice': sort})
            if(sort){
                if(sort===1){
                    goods = await Goods.find(params).skip(skip).limit(pageSize).sort({'salePrice': 1}).catch((err)=>{
                        ctx.throw(500,err,'服务器内部错误');
                    })
                }else{
                    goods = await Goods.find(params).skip(skip).limit(pageSize).sort({'salePrice': -1}).catch((err)=>{
                        ctx.throw(500,err,'服务器内部错误');
                    })
                }
            }else{
                goods = await Goods.find(params).skip(skip).limit(pageSize).catch((err)=>{
                    ctx.throw(500,err,'服务器内部错误');
                })
            }
        }

        if(goods){
            handleSuccess({ ctx,result:{goods}, message: '查询商品成功！' })
        }else{
            handleError({ctx,message:'查询商品失败！'})
        }
    }
    //商品更新
    static async GoodUpdate(ctx){
        const {salePrice, productName,stock,sub_title,createTime,tag,_id,hot} = ctx.request.body;
        const goods = await Goods.update({_id:_id},{salePrice, productName,stock,sub_title,createTime,tag,hot})
            .catch(err => handleError({ctx, message: err}))

        if (goods) {
            handleSuccess({ctx, message: "修改成功"});
        }
    }

    static async getHotGoods(ctx){
        const goods = await Goods.find({dr:0,hot:true})
            .catch(err => handleError({ctx, message: err}))

        if (goods) {
            handleSuccess({ctx,result:goods,message: "查询热门商品成功"});
        }
    }
}

module.exports = GoodsController;