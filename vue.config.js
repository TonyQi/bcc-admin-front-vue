module.exports = {
    devServer: {
        host: '127.0.0.1',
        port: 20000,
        proxy: {
            '/cert': {
                target: 'http://10.54.121.219:8082'
            },
            '/dict':{
                target: 'http://10.54.121.219:8083'
            },
            '/res': {
                target:'http://10.54.121.219:8084'
            },
            '/base': {
                target: 'http://10.54.121.219:8081'
            }
        }
    },
    // 打包时不生成.map文件 避免看到源码
    productionSourceMap: false
}