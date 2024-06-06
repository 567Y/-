// 创建mockServer.is通过mockjs插件实现模拟数据
/*利用 mockjs 来 mock 数据接口
*/
//mockjs所需要的图片数据都放在public文件夹中
//mockjs是基于正则表达式和占位符的文本生成器。
// 安装mockjs
// npm install --save-dev mockjs
// mockServer.js文件在入口文件中引入(至少需要执行一次，才能模拟数据)
import Mock from 'mockjs'
import banner from "@/mock/banner.json"
import floor from '@/mock/floor.json'
// 提供广告位轮播数据的接口
Mock.mock('/mock/banner', {
    code: 200,
    data: banner
})
// 提供所有楼层数据的接口
Mock.mock('/mock/floor', {
    code: 200,
    data: floor
})