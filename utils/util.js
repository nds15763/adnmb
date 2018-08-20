const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function getData(url, data, method = 'GET', ctype ='application/json') {
  var tmpCookie = "-%01%18%A0%FFI%08K%12%87V%B9%F2%FA%DB%19d%DA%2B%7F%8E%8F%EAr";
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: {
        'Content-Type': ctype,
        'Cookie': "userhash="+tmpCookie,
      },
      success: function (res) {
        console.log("success")
        resolve(res)
      },
      fail: function (res) {
        reject(res)
        console.log("failed")
      }
    })
  })
}
/**
 * 去掉html标签
 * @params str     待转化数组
 * @params iscut   是否截取过长字符串
 */
function delHtmlTag(str, iscut) {
  str = str.replace("<br/>","\n");
  str = str.replace("<br />", "\n");
  str = str.replace(/<[^>]*>/g, "");
  if (str.length > 187 && iscut){
     str = str.substr(0,187)+"..."
   }
   return str
}
/**
 * 把dateTime转为汉字的时间
 */
function setTimeToMin(DataTime){
  var timeStr = '';
  var tmpstr = DataTime.substring(0, 10) + ' ' + (DataTime.substring(13, DataTime.length))
  var d1 = tmpstr.replace(/\-/g, "/")
  var date1 = new Date(d1)
  var date2 = new Date()
  var saMin = parseInt(date2 - date1) / 1000 / 60;
  // switch(saMin){
  //   case saMin < 60: timeStr = saMin+'分钟前' ; break;
  //   case saMin < 60 * 24: timeStr = parseInt(saMin/60)+'小时前'; break;
  //   case parseInt(saMin / (60 * 24)) > 1: timeStr = parseInt(saMin / (60 * 24))+'天前'; break;
  // }
  if (saMin < 60){
    timeStr = parseInt(saMin) + '分钟前'
    if (parseInt(saMin) == 0) {
      timeStr='刚刚'
    }
  } else if (saMin < 60 * 24){
    timeStr = parseInt(saMin / 60) + '小时前'
  } else if (parseInt(saMin / (60 * 24)) > 1 && parseInt(saMin / (60 * 24)) <=15 ){
    timeStr = parseInt(saMin / (60 * 24)) + '天前'
  } else if (parseInt(saMin / (60 * 24)) > 15) {
    timeStr = DataTime.substring(5,10)
  }
  return timeStr
}
/**
 * 树状的算法
 * @params list     代转化数组
 * @params pFid     起始节点
 */
function getTrees(list, pFid) {
  let items = {};
  // 获取每个节点的直属子节点，*记住是直属，不是所有子节点
  for (let i = 0; i < list.length; i++) {
    let key = list[i].pFid;
    if (items[key]) {
      items[key].push(list[i]);
    } else {
      items[key] = [];
      items[key].push(list[i]);
    }
  }
  return formatTree(items, pFid);
}

/**
 * 利用递归格式化每个节点
 */
function formatTree(items, pFid) {
  let result = [];
  if (!items[pFid]) {
    return result;
  }
  for (let t of items[pFid]) {
    t.pChild = formatTree(items, t.pId)
    result.push(t);
  }
  return result;
}

module.exports = {
  formatTime: formatTime, 
  getData: getData,
  delHtmlTag: delHtmlTag,
  getTrees: getTrees,
  setTimeToMin: setTimeToMin
}
