# genshinmirror

## Documention

### 云服务

#### 1. 访客模式

数据存储在本地

#### 2. 登录模式

数据存储在本地（缓存）和云端，通过时间戳进行同步

静态数据 动态数据

### 圣遗物序列化

```js
paddingLeft(base62(id),4)
base62(main)base62(level)
base62(attrtype1)paddingLeft(base62(attrvalue1),3)
base62(attrtype2)paddingLeft(base62(attrvalue2),3)
base62(attrtype3)paddingLeft(base62(attrvalue3),3)
base62(attrtype4)paddingLeft(base62(attrvalue4),3)
```

如 20 级魔女头 id 为 80530 主属性暴击伤害

- 元素精通+19
- 生命值+209
- 元素充能效率+10.4%
- 暴击率+17.1%

```js
base62(80530)=>"Kws"
base62(20)=>"K"
```

查表得:

1. 暴击伤害=13=>base62(13)=>"D"
2. 元素精通=>"B" 对应数值 base62 为"J"
3. 生命值=>"4" 数值同上,为"3N"
4. 元素充能效率=>"A" 对应数值因为是小数所以乘 10 之后再 base62, 为"1g"
5. 暴击率=>"C" 数值同上,为"2l"
   因此最后结果为

Kws-DK-BJ-43N-A1g-C2l
然后按照 4-2-3-3-3-3 的长度对长度不足的补上 0, 其中副属性的类型占一位 数值占两位 比如这里的 B0J 就是 B+J 数值 J 因为只有一位所以补 0 变为 B0J
0Kws-DK-B0J-43N-A1g-C2l
最后连起来就是
0KwsDKB0J43NA1gC2l

对于不足 4 个属性的则填 0 处理, 比如上面那个圣遗物去掉暴击率词条就是 0KwsDK0BJ43N000

当然像 0KwsDKB0J43N 这样直接去掉也是可以的 因为读取的时候会自动补 0

最后可得

附: 属性对应表

```
4  = 4 = 生命值,
5  = 5 = 生命百分比,
6  = 6 = 攻击值,
7  = 7 = 攻击百分比,
8  = 8 = 防御值,
9  = 9 = 防御百分比,
10 = A = 元素充能效率,
11 = B = 元素精通,
12 = C = 暴击率,
13 = D = 暴击伤害,
19 = J = 火元素伤害加成,
21 = L = 水元素伤害加成,
23 = N = 草元素伤害加成,
25 = P = 雷元素伤害加成,
27 = R = 风元素伤害加成,
29 = T = 冰元素伤害加成,
31 = V = 岩元素伤害加成,
33 = X = 物理伤害加成,
```

序列化实现

```ts
get code() {
  return this.attrs.reduce(
    (r, v) => r + (base62(v.type) + base62(v.type in ARTIFACT.ENCODE_RATIO ? v.value : v.value * 1e3, 2)),
    `${base62(this.typeId, 4)}${base62(this.main)}${base62(this.level)}`
  );
}
```

### 技术选型

- 语言: Typescript
- 前端渲染和 SSR: Nuxt.js (host by fastify Programmatically)
- API: Apollo GraphQL type-graphql
  - 使用Apollo codegen生成前端代码
- 状态持久化: localforage
- DB & ORM: mongodb & mongoose (typegoose)
- 缓存: redis

## Build Setup

```bash
# change git config
git config core.ignorecase false --global
git clone xxx --recurse-submodules

# install dependencies
$ yarn install

# serve with hot reload at localhost:7333
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

```
