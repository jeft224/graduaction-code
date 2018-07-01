
function isLoggedIn(){ //关闭网页后再次访问 取出token
  let token = localStorage.getItem('jwt');
  if(token){
    // 取出jwtpayload部分(jwt由.分割的三部分组成)
    // base64解码后 是json string格式 再通过JSON.parse 转成对象
    const payload = JSON.parse(window.atob(token.split('.')[1]));

    // 前端判断token是否过期，如果过期了访问时候会路由到login页面
    if(payload.exp>Date.now()/1000){
      return token;
    }
  }else{
    return false;
  }
}
function isAdminLoggedIn(){ //关闭网页后再次访问 取出token
  let token = localStorage.getItem('admin_jwt');
  console.log(token)
  if(token){
    // 取出jwtpayload部分(jwt由.分割的三部分组成)
    // base64解码后 是json string格式 再通过JSON.parse 转成对象
    const payload = JSON.parse(window.atob(token.split('.')[1]));

    // 前端判断token是否过期，如果过期了访问时候会路由到login页面
    if(payload.exp>Date.now()/1000){
      return token;
    }
  }else{
    return false;
  }
}

function exportUser() {
  let token = localStorage.getItem('jwt');
  if(token) {
    const payload = JSON.parse(window.atob(token.split('.')[1]));
    return payload.username;
  }else{
    return null;
  }
}
function exportAdmin() {
  let token = localStorage.getItem('admin_jwt');
  if(token) {
    let payload = JSON.parse(window.atob(token.split('.')[1]));
    return payload;
  }else{
    return null;
  }
}
function exportAdminID() {
  let token = localStorage.getItem('admin_jwt');
  if(token) {
    const payload = JSON.parse(window.atob(token.split('.')[1]));
    return payload.userId;
  }else{
    return null;
  }
}
export  {
  isLoggedIn,
  isAdminLoggedIn,
  exportUser,
  exportAdmin,
  exportAdminID
}
