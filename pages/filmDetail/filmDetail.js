
var app = getApp()  //可以拿到app.js中所定义的函数
var datasource = require('../../models/datasource.js'); //引用数据的获取文件
var api = require('../../models/api.js'); //引用存放数据api的文件
Page({ //index 中所用要是用的函数,全部在这进行定义
  data: {   //index页面上的初始数据,在后面可使用that.setData({}) 来进行更新
   
  filmDetail: {},
  showLoading: true,
  showContent: false
    
  },
  onLoad: function (options) {//在渲染的时候就会调用的函数(数据的初始化渲染可以在此进行)
    console.log(options,'options')
    var that = this //在每个函数中使用that来取代this,以防止this的指向问题 
    var id = options.id
    /*
    再页面进行加载时,进行电影数据的请求
    继承引入的模块里的函数来进行数据的加载 call()
    call() // a.call(this,a参数一,a参数二) ,就是讲原本函数a的this指向换成当前中的对象中的this
    */
    datasource.fetchFilmDetail.call(that,api.apiList.filmDetail,id,function(data){
        console.log(data)
    });
    
  }
})
