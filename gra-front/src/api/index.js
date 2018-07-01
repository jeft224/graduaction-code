import axios from 'axios'


const authAxios = axios.create();
//全局axios配置
axios.defaults.timeout = 5000
axios.defaults.headers.post['Content-Type'] = 'application/x-www=form-urlencoded'



//配置http请求拦截器
authAxios.interceptors.request.use((config)=>{
  const token  = localStorage.getItem('jwt');
  if(token){
    //发送需要认证的请求，都需要带上token 后台会校验后再返回 Bearer是JWT的认证头部信息
    config.headers.common['Authorization'] = `Bearer ${token.replace(/(^")|("$)/g,'')}`;
  }
  return config;
},error=>{
  return Promise.reject(error);
})

//配置http响应拦截器
// authAxios.interceptors.response.use(()=>{
//
// })

//前后端分离，调用后端服务
axios.defaults.baseURL = authAxios.defaults.baseURL = 'http://localhost:8000';

//添加修改删除 都需要带上token
function postAxiosApi(apiPath,params){
  // console.log(params);
  return authAxios.post(apiPath,params);
}
function getAxiosApi(apiPath,params){
  return authAxios.get(apiPath,params);
}

export default{
    //关于管理员的api
    adminlogin(data){
      return axios.post('/api/adminLogin',data)
    },
    adminupdate(data){
      return axios.post('/api/adminUpdate',data)
    },
    adminquery(params){
      return axios.get(`/api/adminQuery/${params}`)
    },
    pwdAdminUpdate(params){
      return postAxiosApi(`/api/pwdAdminUpdate`,params)
    },
    // 关于用户的api
    login(data){
      return axios.post('/api/login',data)
    },
    register(params){
      return axios.post('/api/register',params)
    },
    getUsers(params){
      return getAxiosApi(`/api/userQuery/${params}`)
    },
    getUserById(params){
      return getAxiosApi(`/api/userQueryById/${params}`)
    },
    queryUserById(params){
      return authAxios.get(`/api/queryUserById`,params)
    },
    userUpdate(params){
      return postAxiosApi(`/api/userUpdate`,params)
    },
    userEdit(params){
      return postAxiosApi(`/api/userEdit`,params)
    },
    pwdUpdate(params){
      return postAxiosApi(`/api/pwdUpdate`,params)
    },
    deleteUserById(params){
      return postAxiosApi(`/api/deleteUserById`,params)
    },
    //关于商品的api
    upload(params){
      const formdata = new FormData();
      Object.entries(params).forEach(([key,value])=>{
        formdata.append(key,value);
        if(Array.isArray(value)){
            for(let i =0;i<value.length;i++){
              formdata.append(key,value[i])
            }
        }
      })

      return authAxios.post('/api/addGoods',formdata)
    },
    getGoods(params){
      return getAxiosApi(`/api/getGoods/${params}`)
    },
    getGoodsById(params){
      return getAxiosApi(`/api/getGood/${params}`)
    },
    getAllGoods(params){
      return postAxiosApi(`/api/getAllGoods`,params)
    },
    goodUpdate(params){
      return  axios.post('/api/goodUpdate',params)
    },
    goodDelete(params){
      return  axios.post('/api/deleteGood',params)
    },
    getHotGoods(params){
      return getAxiosApi('/api/getHotGoods',params)
    },
    // 关于购物车的api
    addCart(params){
      return postAxiosApi(`/api/addCart`,params)
    },
    getAllCart(params){
      return authAxios.get(`/api/getAllCart`,params)
    },
    deleteCart(params){
      return postAxiosApi(`/api/deleteCart`,params)
    },
    editCart(params){
      return postAxiosApi(`/api/editCart`,params)
    },

    //关于订单的api
    getOrderList(params){
      return authAxios.get('/api/orderQueryById',params)
    },
    getAllOrder(params){
      return getAxiosApi(`/api/orderQueryAll/${params}`)
    },
    getOrderById(params){
      return getAxiosApi(`/api/queryOrderByOrderId/${params}`)
    },
    deleteOrderById(params){
      return  axios.post(`/api/deleteOrderById`,params)
    },
    payMent(params){
      return postAxiosApi(`/api/payment`,params)
    },
    //关于地址的api
    saveAddress(params){
      return  postAxiosApi(`/api/addAddress`,params)
    },
    queryAddressByUserId(params){
      return getAxiosApi(`/api/queryAddressByUserId`,params)
    },
    deleteAddress(params){
      return  axios.post(`/api/deleteAddress`,params)
    },
    queryAddressById(params){
      return getAxiosApi(`/api/queryAddressById/${params}`)
    },
    editAddress(params){
      return  postAxiosApi(`/api/updateAddress`,params)
    },

}

