const mutations = {
  USER_SIGNIN(state,param){
    //登录成功 存放token到localstorage 同时改变全局数据
    localStorage.setItem('jwt',param.token);
    state.token = param.token;
  },
  ADMIN_SIGNIN(state,param){
    //登录成功 存放token到localstorage 同时改变全局数据
    localStorage.setItem('admin_jwt',param.token);
    state.adminToken = param.token;
  },
  ADMIN_LOGOUT(state){
    localStorage.removeItem("admin_jwt");
    state.adminToken = null;
  },
  User_SetStatus(state,param){
    state.UserShow = param;
  },
  USER_LOGOUT(state){
    localStorage.removeItem("jwt");
    state.token = null;
  },
  SET_USERNAME(state,param){
    state.username = param
  },
  SET_AMDMINUASERNAME(state,param){
    state.adminUsername = param
  },
  SET_CARTLIST(state,param){
      state.cartList = param;
  },
  REDUCE_CART(state, {productId}) {
    let cart = state.cartList
    cart.forEach((item, i) => {
      if (item.productId === productId) {
          cart.splice(i, 1)
      }
    })
    state.cartList = cart
  },
  EDIT_CART(state, {productId, productNum, checked}) {
    let cart = state.cartList
    if (productNum) {
      cart.forEach((item, i) => {
        if (item.productId === productId) {
          item.productNum = productNum
          item.checked = checked
        }
      })
    } else if (productId) {
      cart.forEach((item, i) => {
        if (item.productId === productId) {
          cart.splice(i, 1)
        }
      })
    } else {
      cart.forEach((item) => {
        item.checked = checked ? '1' : '0'
      })
    }
    state.cartList = cart
  },
  SET_USERAVATAR(state,params){
    state.userAvatar = params;
  },
  SET_ADMINAVATAR(state,params){
    state.adminAvatar = params;
  }
}

export default mutations;
