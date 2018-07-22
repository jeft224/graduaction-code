function CkeckEnviorment(url){
    let imgurl = "";
    if(process.env.NODE_ENV == "production"){
        imgurl = url;
    }else{
        imgurl = `http://localhost:8000/${url}`;
    }
    return imgurl;
}


export function IsVersion(url){
    let urls = [];
    if(Array.isArray(url)){
        url.map((item) =>{
            urls.push(CkeckEnviorment(item));
        })
        return urls;
    }else{
        return CkeckEnviorment(url);
    }
}