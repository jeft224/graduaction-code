'user strict'


exports.APP = {
    ROOT_PATH: '/api',
    LIMIT: 16,
    PORT: 8000
}

exports.MONGODB = {
    url: `mongodb://127.0.0.1:27017/vue-mall`
}

exports.User = {
    jwtTokenSecret:  'vue-mall',
    defaultUsername:  'admin',
    defaultPassword:  '123456',
    defaultAvatar:'https://i.loli.net/2017/08/21/599a521472424.jpg'
}


exports.INFO = {
    name: 'vue-mall',
    version: '1.0.0',
    author: 'jkchao',
    site: 'https://jkchao.cn',
    powered: ['Vue2', 'Nuxt.js', 'Node.js', 'MongoDB', 'koa', 'Nginx']
}
