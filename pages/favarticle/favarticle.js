const util = require('../../utils/util.js')

Page({
  data: {
    title:'',
    pageList:[]
  },
  onLoad: function (e) {
    // this.setData({
    //   SList: e.SList
    // })
    this.setData({
      pageList: wx.getStorageSync(e.SList) || []//历史浏览数组
    })
    var stitle="";
    switch(e.SList){
      case "artHistory": stitle='历史浏览';break;
      case "artFavorite": stitle = '我的收藏'; break;
      case "artComment": stitle = '我的发言'; break;
      default: stitle="编码错误";break;
    }
    this.setData({
      title:stitle
    })
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
  toArticle: function (e) {
    wx.navigateTo({
      url: '../article/article?id=' + e.currentTarget.dataset.anum
    })
  },
})