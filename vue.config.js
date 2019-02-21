module.exports = {
    devServer: {
        host: '127.0.0.1',
        port: 20000,
        proxy: {
            '/cert': {
                target: 'http://192.168.253.191:8080'
            },
            '/dict':{
                target: 'http://192.168.253.192:8080'
            },
            '/res': {
                target:'http://192.168.253.190:8080'
            },
            '/base': {
                target: 'http://192.168.253.189:8080'
            }
        }
    },
    // 打包时不生成.map文件 避免看到源码
    productionSourceMap: false
}