var start_clientX;
var end_clientX;
const app = getApp()
var listData = {};
var resizePicModal = {};
const util = require("../../utils/util.js")
const network = require("../../app.js")
//var resizePicModalService = require('../showimg/showimg.js')
Page({
  data: {
    open: false,
    acopen:false,
    isCheckDtl:'false',//是否缩放图片
    title:'综合版1',
    mark: 0,
    newmark: 0,
    startmark: 0,
    endmark: 0,
    windowWidth: wx.getSystemInfoSync().windowWidth,
    staus: 1,
    translate: '',
    currentId: -1,
    curTarId: 4,//当前点击时获取ID,id=-1为时间线,4:综合1
    curPageNum: 1,//当前页码
    achannel: wx.getStorageSync('achannel') || {},//左侧栏目列表
    reqParam: {},
    aPage: {},//右侧数据页面列表
    aPageList: [],//右侧数据页面列表
    aImgList:{},
    images: {},
    settingShow:false,//设置栏状态
    setbar_translate:"",
    viewHeight:2000,
    show: ""
  },
  onLoad:function(){
    console.log('onLoad')
    var that = this
    wx.showLoading({ title: '肥肥发电中…' });
    var achaList = this.getChaList();
    var pageitem = this.getPageList();
    var that = this;
    //resizePicModal = new resizePicModalService.ResizePicModal()
    this.setGlobalCookie();
  },
  toHistory:function(){
    wx.navigateTo({
      url: '../favarticle/favarticle?SList=artHistory'
    })
  },
  toFavorite: function () {
    wx.navigateTo({
      url: '../favarticle/favarticle?SList=artFavorite'
    })
  },
  setGlobalCookie:function(){
    wx.getStorage({
      key: 'smCode',
      success: function (res) {
        if (res.data != null && res.data != "") {
          getApp().globalData.cookie = res.data
        }
      }
    })
  }
  ,
  smClick: function () {
    var that = this;
    var show;
    wx.showModal({
      title: '提示',
      content: '当前版本只支持一个饼干',
      success: function (res) {
        if (res.confirm) {
          wx.scanCode({
            success: (res) => {
              getApp().globalData.cookie = res.result;
              // that.setData({
              //   show: this.show
              // })
              console.log("--result:" + res.result + "--scanType:" + res.scanType + "--charSet:" + res.charSet + "--path:" + res.path)
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 2000
              })
              wx.setStorage({
                key: 'smCode',
                data: JSON.parse(res.result).cookie,
              })
            }
          })
          this.tap_setting();
        }
      }
    })
    
  },
  settingClick: function (e) {
    wx.navigateTo({
      url: '../article/article?id=' + e.currentTarget.id + '&anum=' + e.currentTarget.dataset.anum + '&title=' + this.data.title
    })
  },
  loadImg:function(e){
    wx.previewImage({
      current: e.currentTarget.dataset.lsrc,//此处需要http链接图片
      urls: [e.currentTarget.dataset.lsrc],//http链接图片数组
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  imageOnLoad: function (e) {
    var $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;    //图片的真实宽高比例
    var viewWidth = 120,           //设置图片显示宽度，左右留有16rpx边距
      viewHeight = 120 / ratio;    //计算的高度值
    var image = this.data.images;
    //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
    image[e.target.dataset.index] = {
      width: viewWidth,
      height: viewHeight
    }
    this.setData({
      images: image
    })
  },
  bindPageDown: function(e){
    console.log("bindPageDown")
    this.setData({
      curPageNum: this.data.curPageNum+1,
      viewHeight: 2000 * (this.data.curPageNum+1)
    })
    this.getPageList();
  },
  onPullDownRefresh : function (e) {
    var that = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    setTimeout(function () {
      that.setData({
        aPageList: [],
        curPageNum: 1,
        viewHeight: 2000
      })
      that.getPageList();
      console.log(that.data.aPageList)
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  handleTap:function(e){
    console.log(e);
    if (this.data.currentId == e.currentTarget.id && this.data.acopen==true){
      this.setData({
        currentId: -1,
        acopen: false
      })
    }else{
      this.setData({
        currentId: e.currentTarget.id,
        acopen: true
      })
    }
  },
  tap_setting: function (e) {
    if (this.data.settingShow) {
      this.setData({
        setbar_translate: 'transform: translateY(0vh)'
      })
      this.data.settingShow = false;
    } else {
      this.setData({
        setbar_translate: 'transform: translateY(57vh)'
      })
      this.data.settingShow = true;
    }
  },

  tap_ch: function (e) {
    if (this.data.open) {
      this.setData({
        translate: 'transform: translateX(0px)'
      })
      this.data.open = false;
    } else {
      this.setData({
        translate: 'transform: translateX(' + this.data.windowWidth * 0.5 + 'px)'
      })
      this.data.open = true;
    }
  },
  toArticle:function(e){

      wx.navigateTo({
        url: '../article/article?id=' + e.currentTarget.id + '&anum=' + e.currentTarget.dataset.anum + '&title=' + this.data.title
      })
  },
  toNewChan: function (obj) {
    this.setData({
      curTarId: obj.currentTarget.id,
      curPageNum:1,
      title: obj.currentTarget.dataset.atitle,
      aPageList: [],//右侧数据页面列表
      aPage:{}
    })
    wx.showLoading({ title: '肥肥发电中…'});
    this.getPageList()
  },
  toForm: function(e){
    wx.navigateTo({
      url: '../postform/postform?bid=' + this.data.curTarId //cid是板块ID
    })
  },
  getChaList: function () {
    var that = this;
    var list_api = 'https://nmb.fastmirror.org/Api/getForumList';
    var c = util.getData(list_api,null)
      .then(function (data) {
        console.log(data.data)
        if (that.achannel == undefined) {
          that.listDataCallback(data);
        }
      });
  },
  listDataCallback: function (list) {
    var that = this;
    if (list.data != undefined) {
      this.setData({
        achannel: list.data
      });
      wx.setStorage({
        key: 'achannel',
        data: this.data.achannel,
        success: function (res) { console.log(res.data); },
        fail: function (res) { },
        complete: function (res) { },
      })
      console.log("setStorage")
    }
  },
  getPageList: function () {
    var that = this;
    var list_api = 'https://nmb.fastmirror.org/Api/showf';
    var reqData = {
      id: this.data.curTarId,//获取板块的id,
      page: this.data.curPageNum//分页
    }
    var c = util.getData(list_api,reqData)
      .then(function (data) {
        if (that.aPage == undefined) {
          that.pageDataCallback(data);
        }
        wx.hideLoading()
      });
  },
  pageDataCallback: function (list) {
    if (list.data != undefined) {
      var delHtmlList = list.data;
      for(var i in list.data){
        delHtmlList[i].now = util.setTimeToMin(list.data[i].now)
        delHtmlList[i].content = util.delHtmlTag(list.data[i].content,true);
      }

      this.setData({
        aPageList: this.data.aPageList.concat(delHtmlList)
        // aPageList: this.data.aPageList.concat(delHtmlList)
      });
      console.log("delHtmlList");
      console.log(delHtmlList);
      var that = this;
      var query = wx.createSelectorQuery()
      query.select('#page_list').boundingClientRect(function (res) {
        console.log(res);
        that.setData({
          tabScrollTop: res.top
        })
      }).exec()
    }
  }
})
