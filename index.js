const $ = require('meeko')
const { routerObj, baseURL } = require('./vultr-v2.json')
function bindFunc (tokenKey, path, method, paramCount) {
  if (paramCount === 0) {
    //console.log(method)
    return async function (data) {
      let rst = await vultrFetch(baseURL + path, tokenKey, method, data)
      return rst
    }
  }

  let pathAry = path.split('/')
  let count = 0
  for (let i = 0; i < pathAry.length; i++) {
    if (pathAry[i].at(0) === '{') {
      pathAry[i] = `{${count}}`
      count++
    }
  }
  if (count === 1) {
    return async function (path1, data) {
      let rst = await vultrFetch((baseURL + pathAry.join('/')).format(path1), tokenKey, method, data)
      return rst
    }
  }
  if (count === 2) {
    return async function (path1, path2, data) {
      let rst = await vultrFetch((baseURL + pathAry.join('/')).format(path1, path2), tokenKey, method, data)
      return rst
    }
  }
  // console.log(baseURL + pathAry.join('/'))
}
function routerList2Obj (routerObjAry, key) {
  let methodObj = {}
  routerObjAry.map(x => {
    let path = x.url.split('/')
    let paramCount = 0 //how many path param
    let point = {}
    for (let i = 1; i < path.length; i++) {
      let item = path[i].camelize()
      if (item.at(0) === '{') {
        paramCount++
        continue
      }
      //path[0]
      if (i === 1) {
        if (!methodObj[item]) {
          methodObj[item] = {}
        }
        point = methodObj[item]
      } else {
        if (!point[item]) {
          point[item] = {}
        }
        point = point[item]
      }
    }
    point[x.method + (paramCount ? 'ById' : '')] = bindFunc(key, x.url, x.method.toUp(), paramCount)
  })
  //$.dir(methodObj)
  return methodObj
}
async function vultrFetch (url, authStr, method = 'GET', body = null) {
  let rst = await fetch(url, {
    headers: {
      Authorization: 'Bearer ' + authStr,
      accept: 'application/json;application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      'sec-ch-ua': '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1'
    },
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: body ? JSON.stringify(body) : null,
    method
  })
  let r
  try {
    r = await rst.json() // some respond is blank
  } catch (e) {
    r = {}
  }
  return r
}
class Vultr {
  constructor (key) {
    this.apiKey = key
    this.router = routerObj
    Object.assign(this, routerList2Obj(routerObj, key))
  }
  get tokenApi () {
    return this.apiKey
  }
  set tokenApi (apiKey) {
    this.apiKey = apiKey
    return this.apiKey
  }
}
module.exports = Vultr
