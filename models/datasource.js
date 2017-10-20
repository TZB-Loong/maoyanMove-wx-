var api = require('./api.js') //把前面的config自定义好的内容引用过来,来进行使用
// 获取电影列表

function fetchFilms(url, start, count, cb, fail_cb) {
  /*
  
  {
    url:api地址或者,数据存放地址
    start:数据开始的位置
    count:返回数据的数量
    cb:请求成功后的回调函数
    fail_cb:请求失败的回调函数
  }
*/
var that = this;
    wx.request({
      url: url,
      data: {
        city: api.city,
        start: start,
        count: count
      },
      method: 'GET', 
      header: {
        "Content-Type": "application/json,application/json"
      },
      success: function(res){
        /**
         * concat() 链接连数组,返回链接之后的数组
         */
          console.log('数据获取成功',res.data.subjects,api.city)
          that.setData({
            films: that.data.films.concat(res.data.subjects),
            start: that.data.start + res.data.subjects.length,
          })
        wx.stopPullDownRefresh() //停止下拉刷新
        typeof cb == 'function' && cb(res.data)
      },
      fail: function() {
        console.log('网络网络开小差')
        wx.stopPullDownRefresh()  //同样的停止刷新
        typeof fail_cb == 'function' && fail_cb()
      }
    })
}

// 获取电影详情
function fetchFilmDetail(url, id, cb) {
  /*
  {
    url:Api地址(数据来源)
    id:要获取到的电影的id
    cb:请求成功好的回调函数
  }
  */
  var that = this;
  // message.hide.call(that)
  console.log('id',id)
  wx.request({
    url: url + id, //在进行ajax的异步请求时加上要要请求的id来获取到改电影的详细情况
    method: 'GET',
    header: {
      "Content-Type": "application/json,application/json"   //返回的是json文件
    },
    success: function(res){
      that.setData({ //返回成功后更新数据
        filmDetail: res.data,  
        // showLoading: false,
        // showContent: true
      })
      wx.setNavigationBarTitle({ //跳转页面的组件
          title: res.data.title
      })
      wx.stopPullDownRefresh()
      typeof cb == 'function' && cb(res.data)
    },
    fail: function() { //返回失败所执行的函数
      that.setData({
          showLoading: false
      })
      message.show.call(that,{
        content: '网络开小差了',
        icon: 'offline',
        duration: 3000
      })
    }
  })
}

// 获取人物详情
function fetchPersonDetail(url, id, cb) {
  /*
  {
    url:api地址
    id:电影的Id
    cb:数据获取成功后的回调函数
  }
  */
  var that = this;
  message.hide.call(that)
  wx.request({ //发起的ajax请求
    url: url + id,  //拼接成的api地址
    method: 'GET', 
    header: {
      "Content-Type": "application/json,application/json" //返回的json数据
    },
    success: function(res){ //请求成功后所执行的函数
      that.setData({
        personDetail: res.data,
        showLoading: false,
        showContent: true
      })
      wx.setNavigationBarTitle({
          title: res.data.name
      })
      wx.stopPullDownRefresh()
      typeof cb == 'function' && cb(res.data)
    },
    fail: function() {
      that.setData({
          showLoading: false
      })
      message.show.call(that,{
        content: '网络开小差了',
        icon: 'offline',
        duration: 3000
      })
    }
  })
}

// 搜索（关键词或者类型）
function search(url, keyword, start, count, cb){
  /*
  {
    url:数据地址
    keyword:搜索的关键字
    statr:开始的位置
    count:返回的数据的数量
    cb:数据请求成功后执行的函数
  }
  */
  var that = this
  message.hide.call(that)
  var url = decodeURIComponent(url)
  if (that.data.hasMore) {
    wx.request({
      url: url + keyword,
      data: {
        start: start,
        count: count
      },
      method: 'GET',
      header: {
        "Content-Type": "application/json,application/json"
      },
      success: function(res){
        if(res.data.subjects.length === 0){
          that.setData({
            hasMore: false,
            showLoading: false
          })
        }else{
          that.setData({
            films: that.data.films.concat(res.data.subjects),
            start: that.data.start + res.data.subjects.length,
            showLoading: false
          })
          wx.setNavigationBarTitle({
              title: keyword
          })
        }
        wx.stopPullDownRefresh()
        typeof cb == 'function' && cb(res.data)
      },
      fail: function() {
        that.setData({
            showLoading: false
        })
        message.show.call(that,{
          content: '网络开小差了',
          icon: 'offline',
          duration: 3000
        })
      }
    })
  }
}
module.exports = {  
  //模块化声明,是把函数当做一个个模块来进行声明
  //在之后的js文件引用就相当于是引用这个函数,(直接调用这个函数)
  fetchFilms: fetchFilms,
  fetchFilmDetail: fetchFilmDetail,
  fetchPersonDetail: fetchPersonDetail,
  search: search
}
