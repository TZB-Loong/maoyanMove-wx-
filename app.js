//app.js 是用来处理整个小程序的配置,也就是说,相当于是一个全局配置,全局变量,全局函数,创建的地方
var api = require('./models/api.js')
App({
  /*
  小程序初始化要获取内容
  {
    1,用户信息
    2,定位(在index页面渲染之前开始定位,也就是说定位的优先级要大于index的渲染)
    3,初始化的数据(最开始要展现的数据)
  }
  */

  globalData: { //初始化数据
    userInfo: null,
    // location:null
  },
  onLaunch: function() {
    var that = this
    that.getUserInfo()  // 获取用户信息 ,在小程序打开时,直接获取到用户的登录信息
    // that.initStorage() // 初始化缓存
    that.getCity();
    console.log(api.city,'api.city')
  },
  getUserInfo:function(cb){  //将用户信息更新到本地
    var that = this
    wx.login({
      success: function () {
        wx.getUserInfo({
          success: function (res) {
            that.globalData.userInfo = res.userInfo
            typeof cb == "function" && cb(that.globalData.userInfo) //把登录信息直接保存到uerInfo
          }
        })
      }
    })
  },

  getCity: function(cb) { //定位并保存位置 定位的话使用内置定位接口
    var that = this
    wx.getLocation({
      type: 'gcj02',
      success: function (res) { //res 中包含当前的地理位置及一些信息 返回的是一个纬度
        console.log('res',res) 
        var locationParam = res.latitude + ',' + res.longitude + '1'
        wx.request({  //request 就是一个异步的ajax请求
          url: 'https://api.map.baidu.com/geocoder/v2/', //调用百度地图api
          data: { //ak是百度地图上的key
            ak: 'Y1R5guY8Y2GNRdDpLz7SUeM3QgADAXec',
            location: locationParam,
            output: 'json',
            pois: '1'
          },
          method: 'GET',
          success: function(res){   //把在这里获取到的地址传给api.city

            api.city = res.data.result.addressComponent.city
            typeof cb == "function" && cb(res.data.result.addressComponent.city)
          },
          fail: function(res) {
            // 重新定位
            that.getCity();
          }
        })
      }
    })
  }
// 用一个东西来判断是否将代码往后执行


})
