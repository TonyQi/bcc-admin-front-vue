module.exports = {
    devServer: {
        host: '127.0.0.1',
        port: 20000,
        proxy: {
            '/cert': {
                target: 'http://192.168.160.80:8080'
            },
            '/dict':{
                target: 'http://192.168.160.79:8080'
            },
            '/res': {
                target:'http://127.0.0.1:10000'
            },
            '/base': {
                target: 'http://192.168.160.83:8080'
            }
        }
    },
    // 打包时不生成.map文件 避免看到源码
    productionSourceMap: false
}