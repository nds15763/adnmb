//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    curId: 14092488,
    curPageNum: 1,
    aPageTitle: {},
    aPageRep: [],
    poid: '',
    viewHeight: 2000,
    isLastPage:false,
    isLoading:false,
    pageInfoList:[],
    pageInfo:{
      pId:'',
      pContent:'',
      pChild:[],
      pImg:'',
      pFid:''
    },
  },
  onLoad: function (e) {
    //先读取串所有内容，存到storage里，storage大小限制10M
    this.setPageToStorage();
  },
  setPageToStorage:function(e){
    wx.showLoading({ title: '肥肥发电中…' });
    this.getPageInfo()
  },
  setListPId:function(res) {
    var tempList = [];
    console.log(res);
    //获取所有reply里的content信息，进行树状转换
    var tempTitle = {//不算回复层的标题
        pId: '1',
        pContent: res.content,
        pImg: res.img + res.ext,
        pFid: '0'//父ID
    }
    tempList.push(tempTitle)
    for (var item in res.replys) {
      var titem = res.replys[item];
      var rId = '';
      var fId = ''
      if (titem.title.split(':')[0] == 'RE') {
        rId = titem.title.split('_')[1];
        if (rId.length == 2) {//如果是第一层回复 也就是 RE:串id_01。这个时候rId就是01 fId是上一级的pid也就是1，然后下一级的rId就是0101，fid就是01
          fId = '1'
        } else {
          fId = rId.substr(0, rId.length - 2)
        }
      var tempItem = {
          pId: rId,
          pContent: titem.content,
          pImg: titem.img + titem.ext,
          pFid: fId
        }
      tempList.push(tempItem)
      }
    }
    console.log("tempList")
    console.log(tempList)
    var resultTree = util.getTrees(tempList,"0");
    console.log("resultTree")
    console.log(resultTree)
  },
  getPageInfo: function () {
    this.setData({
      isLoading: true
    })
    var that = this;
    var list_api = 'https://nmb.fastmirror.org/Api/thread';
    var reqData = {
      id: this.data.curId,//获取板块的id,
      page: this.data.curPageNum//分页
    }
    var c = util.getData(list_api, reqData)
      .then(function (data) {
        if (that.aPageInfo == undefined) {
          that.pageInfoCallback(data);
        }
      });
  },
  pageInfoCallback: function (list) {
    var that = this;
    if (list.data != undefined && !this.data.isLastPage) {
      var delHtmlTitle = list.data;
      delHtmlTitle.content = util.delHtmlTag(list.data.content);
      this.setData({
        aPageTitle: delHtmlTitle,
        poid: list.data.userid
      });
      if (list.data.replys.length>0) {
        var delHtmlRepList = list.data.replys;
        for (var i in list.data.replys) {
          delHtmlRepList[i].content = util.delHtmlTag(list.data.replys[i].content);
        }
        this.setData({
          aPageRep: this.data.aPageRep.concat(delHtmlRepList),
          curPageNum:this.data.curPageNum+1
        });
        // wx.setStorage("aPageRep", this.data.aPageRep);
        wx.setStorage({
          key: 'listData',
          data: list.data,
        })
        this.getPageInfo()
      }
      else{
        //请求到最后一页
        this.setData({
          isLastPage: true,
          isLoading: false
        })
        wx.getStorage({
          key: 'listData',
          success: function (res) {
            that.setListPId(res.data);
          },fail:function(e){
            wx.hideLoading();
          }
        })
        wx.hideLoading();
      }
      //
    }
  }
})

