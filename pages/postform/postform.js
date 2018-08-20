const util = require('../../utils/util.js')

Page({
  data: {
    isreply: false,
    translate: '',
    emojiOpen:false,//表情栏是否处于打开状态
    content:'',
    bid:'',//板块ID
    cid:'',//串ID
    cookie: getApp().globalData.cookie,
    onFocusUp:false,//是否处于输入状态，输入的时候footbar上升
    tempInput:''//emoji保存值
  },
  onLoad: function (e) {
    if (e.bid!=null){
      this.setData({
        bid: e.bid
      })
    }
    if (e.cid != null) {
      this.setData({
        cid: e.cid
      })
    }
  },
  formSubmit: function(e){
      if (this.data.content==''){
        wx.showToast({
          title: '正文内容不能为空',
          duration: 2000
        })
        return false;
      }
      if (getApp().globalData.cookie == '') {
        wx.showToast({
          title: '请扫码获取饼干',
          duration: 2000
        })
        return false;
      }
      var that = this;
      var tmpCookie = "-%01%18%A0%FFI%08K%12%87V%B9%F2%FA%DB%19d%DA%2B%7F%8E%8F%EAr"
      var reqData = {}
      reqData = {
        resto: this.data.cid,
        fid: this.data.bid,
        name: '',
        email: '',
        title: '',
        content: this.data.content,
        water: "true",
        image: ''
      }
      var reply_api = 'https://nmb.fastmirror.org/Home/Forum/doReplyThread.html'
      var post_api = 'https://nmb.fastmirror.org/Home/Forum/doPostThread.html';
      var c = util.getData(reply_api1, reqData, 'POST', ctype ='application/x-www-form-urlencoded')
       .then(function (data) {
           that.pageDataCallback(data);
        });
  },
  pageDataCallback: function (list) {
    if (list.data != undefined) {

    }
  },
  tap_emoji: function (e) {
    console.log("tap_emoji");
    var that = this
    this.setData({
      tempInput: e.target.dataset.value
    })
    this.setData({
      content: that.data.content + that.data.tempInput,
    })
    //会有二次提交
    this.setData({
      tempInput: '',
    })
  },
  openEmojibar:function(e){
    this.setData({
      translate: 'transform: translateY(-50vh)',
      emojiOpen : true
    })
  },
  tap_close: function (e) {
    this.setData({
      translate: 'transform: translateY(0px)',
      emojiOpen : false
    })
  },
  footbarUP:function(e){//表情栏上升
    console.log("footbarUP")
    console.log(!this.data.onFocusUp)
    //这部分逻辑就是说，当软键盘没有展开时，点击笑脸会弹起emoji框，
    //打开软键盘时，emoji框会被遮蔽，也就同时收起emoji框
  },
  emojiUpBlock:function(e){
    console.log("emojiUpBlock")
    if (!this.data.onFocusUp) {
      var upHeight = e.detail.value
      this.setData({
        onFocusUp: true
      })
      this.tap_close()
    }
  },
  saveContent:function(e){
    var that = this
    this.setData({
      content: e.detail.value + that.data.tempInput,
    })
    this.setData({
      tempInput: '',
      onFocusUp: false
    })
  },
})