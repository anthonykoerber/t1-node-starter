const https = require('https')

module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname + '/build',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /(bower_components|node_modules)/,
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    devServer: {
        proxy: {
            /*
                Configuration: https://github.com/chimurai/http-proxy-middleware#options
            */
            "/api": {
                target: "https://t1qa10.mediamath.com/",
                changeOrigin: true,
            },
            "/appsapi/": {
                target: "https://t1qa10.mediamath.com/t1-apps/",
                changeOrigin: true,
                pathRewrite: {"^/appsapi": ""}
            },
            "/reporting/": {
                target: "https://t1qa10.mediamath.com/reporting/",
                changeOrigin: true,
            },
            "/saved_reports/": {
                target: "https://t1qa10.mediamath.com/saved_reports/",
                changeOrigin: true,
            },
            "/video/": {
                target: "https://t1qa10.mediamath.com/video/",
                changeOrigin: true,
            },
            "/uniques/": {
                target: "https://t1qa10.mediamath.com/uniques/",
                changeOrigin: true,
            },
            "/toast/": {
                target: "https://t1qa10.mediamath.com/toast/",
                changeOrigin: true,
            },
            "/fbx/": {
                target: "https://t1qa10.mediamath.com/fbx/", 
                changeOrigin: true,
            },
            "/app/t1apps/": {
                target: "https://t1qa10.mediamath.com/app/t1apps/",
                changeOrigin: true,
            },
            "/app/t1apps/local/": {
                target: "http://10.0.2.2:3004/app/t1apps/",
                changeOrigin: true,
                pathRewrite: {"^/local": ""}
            },
            "/api/local": {
                target: "https://10.76.189.10/api/",
                changeOrigin: true,
                pathRewrite: {"^/local": ""}
            },
            "/static_data/": {
                target: "https://t1qa10.mediamath.com/static_data/",
                changeOrigin: true,
            },
            "/classification/": {
                target: "https://t1qa10.mediamath.com/classification/",
                changeOrigin: true,
            },
            "/t1-apps/": {
                target: "https://t1qa10.mediamath.com/t1-apps/",
                changeOrigin: true,
            },
            "/toast-dot-go": {
                target: "http://54.221.175.166:8080/",
                changeOrigin: true,
                pathRewrite: {"^/toast-dot-go": ""}
            }
        }
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        dns: 'empty',
        'crypto': 'empty'
    },
    devtool: 'inline-source-map'
}