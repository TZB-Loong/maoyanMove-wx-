
var app = getApp()  //可以拿到app.js中所定义的函数
var datasource = require('../../models/datasource.js'); //引用数据的获取文件
var api = require('../../models/api.js'); //引用存放数据api的文件
Page({ //index 中所用要是用的函数,全部在这进行定义
  data: {   //index页面上的初始数据,在后面可使用that.setData({}) 来进行更新
   
    films: [], //存放电影的数组(包含很多个对象所以用数组来进行保存y)
    start: 0,  //开始获取数据的位置
    bannerList: api.bannerList, //轮播图地址列表
    hasMore: true, //获取到更多的数据
    showLoading: true, //开始的时候是是否显示
    showing:false,
    
  },
  onLoad: function () {//在渲染的时候就会调用的函数(数据的初始化渲染可以在此进行)
    var that = this //在每个函数中使用that来取代this,以防止this的指向问题 
    /*
    再页面进行加载时,进行电影数据的请求
    继承引入的模块里的函数来进行数据的加载 call()
    call() // a.call(this,a参数一,a参数二) ,就是讲原本函数a的this指向换成当前中的对象中的this
    */
    datasource.fetchFilms.call(that,api.apiList.popular,that.data.statr,api.count);
    console.log(that.data.bannerList)
  },
  onPullDownRefresh: function() { //当屏幕拉到顶的时候
		var that = this
		that.setData({  //把这个页面上需要的数据进行重置
			films: [],
			hasMore: true,
			showLoading: true,
			start: 0
		})
		this.onLoad() //再重新的执行一次onLoad
  },
  onReachBottom: function() { //当下拉到底的时候,再重新开始加载数据
		var that = this
		// if (!that.data.showLoading) {
			datasource.fetchFilms.call(that, api.apiList.popular, that.data.start, api.count)
		// }
  },

  onChange :function(){ //当输入框的内容发生变化时
    var that = this
    that.setData({
      showing:true
    })
  },
 
  viewFilmDetail: function(e) {
    console.log(e,'eee')
		var data = e.currentTarget.dataset;
		wx.navigateTo({
			url: "../filmDetail/filmDetail?id=" + data.id
		})
	},
})
