// vue.config.js
const ZipPlugin = require('zip-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production'
const path = require('path')

// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      '/rest': {
        target: 'http://192.168.10.30:8089', // 服务地址
        onProxyRes: cookiePathRewriter,
        pathRewrite: {
          '^/rest': '/rest',
        },
      },
      '/resource': {
        target: 'http://192.168.10.30:8089', // 服务地址
        onProxyRes: cookiePathRewriter,
        pathRewrite: {
          '^/resource': '/resource',
        },
      },
    },
  },
  configureWebpack: config => {
    if (isProduction) {
      config.plugins.push(
        new ZipPlugin({
          path: path.join(__dirname, './dist_zip'),
          filename: `project_name_build_${Date.now()}.zip`,
        })
      )
    }
  },
}

/**
 * Cookie Path Rewrite Helper
 * how to use: onProxyRes: cookiePathRewriter (in proxyTable items.)
 */
function cookiePathRewriter(proxyRes, req, res) {
  // judge if "set-cookie" is included in the response header
  let cookies = proxyRes.headers['set-cookie']
  if (!cookies || cookies.length === 0) {
    delete proxyRes.headers['set-cookie']
    return
  }

  // rewrite cookie path
  let cookieItems = cookies[0].split(';')
  let newCookie = ''
  for (let i = 0, len = cookieItems.length; i < len; i++) {
    if (newCookie.length > 0) {
      newCookie += ';'
    }
    // judge if start with "path=" or "Path="
    if (cookieItems[i].indexOf('path=') >= 0) {
      newCookie += 'path=/'
    } else if (cookieItems[i].indexOf('Path=') >= 0) {
      newCookie += 'Path=/'
    } else {
      newCookie += cookieItems[i]
    }
  }
  // rewrite the cookie
  proxyRes.headers['set-cookie'] = newCookie
}
