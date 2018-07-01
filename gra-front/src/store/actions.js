const actions = {
  UserLogin({commit},param){
    commit('USER_SIGNIN',param)
  },
  UserStatus({commit},param){
    commit('User_SetStatus',param)
  },
  UserLogOut({commit}){
    commit('USER_LOGOUT')
  },
  SetUserName({commit},param){
    commit('SET_USERNAME',param)
  },
  AdminLogin({commit},param){
    commit('ADMIN_SIGNIN',param)
  },
  AdminLogOut({commit},param){
    commit('ADMIN_LOGOUT',param)
  },
  SetAdminUserName({commit},param){
    commit('SET_AMDMINUASERNAME',param)
  },
  SetCartList({commit},param){
    commit('SET_CARTLIST',param)
  },
  ReduceCartList({commit},param){
    commit('REDUCE_CART',param)
  },
  SetUserAvatar({commit},param){
    commit('SET_USERAVATAR',param)
  },
  SetAdminAvatar({commit},param){
    commit('SET_ADMINAVATAR',param)
  }

}

export default actions;
