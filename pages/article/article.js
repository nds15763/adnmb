//answer.js
const util = require('../../utils/util.js')
const network = require("../../app.js")
var app = getApp()
Page({
  data: {
    title: '综合版1',
    curId : 0,
    curPageNum :1,
    aPageTitle : {},
    aTitle: {},
    aPageRep: [],
    poid:'',
    viewHeight: 2000,
    loadMore: true,
    hisListCount:10,//历史浏览条数
    hisList: wx.getStorageSync('artHistory') || [],//历史浏览数组
    favListCount: 10,//历史浏览条数
    favList: wx.getStorageSync('artHistory') || []//历史浏览数组
  },
  onLoad: function (obj) {
    this.setData({
      curId : obj.id,
      title:obj.title
    })
    var pageInfo = this.getPageInfo();
  }, 
  onShareAppMessage: function (e) {//对，你就是那个败类
    console.log("onShareAppMessage")
    return {
      title: 'AC匿名版，最具人气的二次元萌妹聊天版！',
      path: '/article/article?id=' + this.data.curId,
      imageUrl:'/src/img/timg.jpg',
      success: function (res) {
        // 转发成功
      },
    }
  },
  swapItems:function (arr,obj) {
    if (arr.length > this.data.hisListCount){
      arr.splice(arr.length-1, 1)
    }
    arr.splice(0,0,obj);
    return arr;
  },
  setHistory:function(obj){
    this.setData({
      hisList: wx.getStorageSync('artHistory') || []
    })
    wx.setStorage({
      key: 'artHistory',
      data: this.swapItems(this.data.hisList,obj)
    })
  },
  addFav: function (obj) {
    this.setData({
      favList: wx.getStorageSync('artFavorite') || []
    })
    wx.setStorage({
      key: 'artFavorite',
      data: this.swapItems(this.data.favList, this.data.aTitle)
    })
  },
  onPullDownRefresh:function(e){
    var that = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    setTimeout(function () {
      that.setData({
        aPageTitle: {},
        aPageRep: [],
        curPageNum: 1,
        viewHeight: 2000
      })
      that.getPageInfo();
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  bindPageDown: function (e) {
    if (this.data.loadMore){
      this.setData({
        curPageNum: this.data.curPageNum + 1,
        viewHeight: 2000 * (this.data.curPageNum+1),
        loadMore:false
      })
      this.getPageInfo();
    }
  },
  loadImg: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.lsrc,//此处需要http链接图片
      urls: [e.currentTarget.dataset.lsrc],//http链接图片数组
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  toForm: function (e) {
    wx.navigateTo({
      url: '../postform/postform?cid=' + this.data.curId //cid是板块ID
    })
  },
  getPageInfo: function () {
    console.log("getPage")
    var that = this;
    var list_api = 'https://nmb.fastmirror.org/Api/thread';
    var reqData = {
      id: this.data.curId,//获取板块的id,
      page: this.data.curPageNum//分页
    }
    var c = util.getData(list_api, reqData)
      .then(function (data) {
        console.log(data)
        if (that.aPageInfo == undefined) {
          that.pageInfoCallback(data);
        }
      });
  },
  pageInfoCallback: function (list) {
    if (list.data != undefined){
      var delHtmlTitle = list.data;
      delHtmlTitle.content = util.delHtmlTag(list.data.content);
      //只保存标题
      this.setHistory(delHtmlTitle);
      this.setData({
        aTitle: delHtmlTitle,
      });
      //
      delHtmlTitle.now = util.setTimeToMin(list.data.now)
      this.setData({
        aPageTitle: delHtmlTitle,
        poid:list.data.userid
      });

      if (list.data.replys != undefined) {
        var delHtmlRepList = list.data.replys;
        for (var i in list.data.replys) {
          delHtmlRepList[i].now = util.setTimeToMin(list.data.replys[i].now);
          delHtmlRepList[i].content = util.delHtmlTag(list.data.replys[i].content);
        }
        this.setData({
          aPageRep: this.data.aPageRep.concat(delHtmlRepList),
          loadMore: true
        });
      }
    }
  }
})
