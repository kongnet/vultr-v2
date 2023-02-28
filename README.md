# vultr-v2

Easy and nice to trans vultr v2 API into **JS Object**, 100 lines of code in one file

# Intro 简介

- Wrap all vultr router to object
- Use routing, http protocol methods, path parameters, etc. to combine into a **JS Class**

# Trans Rules 转换规则

- 1. Routes are escaped into object structures in order
- 2. "**-**" strings in routes are escaped to camelCase
- 3. Routes with n parameters are escaped into sequential parameters in the function in order

## Path param rules 路径参数转换规则

- get => no path param .get() | .getById(param1,data) has one param | .getById(param1,param2mdata) has two param
- post => no path param .post() | .postById(param1,data) has one param | .postById(param1,param2mdata) has two param
- put ...
- patch ...
- delete ...

## Trans Rule Use Case 转换规则用例

- https://api.vultr.com/v2/load-balancers post _Create Load Balancer_
- =>

```js
let myVultr = new Vultr(tokenApi)
let r = await myVultr.loadBalancers.post(data)
```

# Install 安装

```js
npm i vultr-v2
```

# Example 例子

```js
const Vultr = require('vultr-v2')
const tokenApi = 'Your tokenKey'

async function main() {
  let myVultr = new Vultr(tokenApi) // 实例化
  console.log(myVultr.router.length)

  let result = await myVultr.loadBalancers.get() // 获取负载均衡列表
  console.log(result)

  // result = await vultr1.loadBalancers.getById('Your load-balancer-id') // 获取负载均衡详情
  // console.log(result)
}
main()
```

:-)
