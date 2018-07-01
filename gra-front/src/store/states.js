import {isLoggedIn,isAdminLoggedIn} from '../utils/jwt'
const states = {
    UserShow:true,
    token:isLoggedIn()||null,
    username:"",
    adminToken:isAdminLoggedIn()||null,
    adminUsername:"",
    adminAvatar:"",
    cartList:[],
    userAvatar:"",
}

export default states;
