function base64 (dir, input) {
var publ = {},
    self = this,
    b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

// http://phpjs.org/functions/base64_encode/
publ.encode = function (data) {
    data = data;
    data = unescape(encodeURIComponent( data ));

    if (data === '') return;
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
        ac = 0,
        enc = "",
        tmp_arr = [];

    if (!data) return data;

    do { // pack three octets into four hexets
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);

        bits = o1 << 16 | o2 << 8 | o3;

        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;

        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);

    enc = tmp_arr.join('');

    var r = data.length % 3;

    return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
};

	return input ? publ[dir](input) : dir ? null : publ;
};



var nodegrass = require("nodegrass")
var cheerio = require("cheerio");
var http = require('http');
var https = require('https');
var GETPAGE = {};
var baseinfo_index = 20;
var CategoryID = 9;


var _indexid = 1;



var baseinfo = [];


// url设置
var _getlink = "http://list.mogujie.com/search?callback=jQuery211009319157510612008_1477565841877&_version=1&f=baidusem_kupyj4uq08&sort=pop&_mgjuuid=b1897008-7b45-66dd-91b9-97c30b424753&acm=3.mf.1_0_0.0.0.0.mf_15261_155399-mfs_6&width=220&showH=330&height=330&cKey=pc-wall-v1&page=1&userId=&action=clothing&fcid=51082&ad=0&ptp=1._mf1_1239_15261.0.0.amK5Q&showW=220&ratio=2%3A3&_=1477565841878";

getdatabase();

//获取列表页面
function getdatabase() {
	var getLink = _getlink;
	nodegrass.get(getLink,function(data){
		var newdata =  data.slice(46,data.length-2);
		var enddata = JSON.parse(newdata).result.wall.docs;
		baseinfo = enddata;
		console.log("获取基础数据完成")
  		modlefunbase()
	},"utf-8")
}


//分发页面已获取详情
function modlefunbase() {
	console.log("详细数据以获取:"+Math.floor((baseinfo_index/baseinfo.length)*100)+"%");
	ajaxgetdata(baseinfo[baseinfo_index],function(){
	  	baseinfo_index = baseinfo_index+1;
	  	if(baseinfo_index==baseinfo.length) {
	  		baseinfo_index = 20;
	  		console.log("获取详细数据完成");
	  		console.log("开始获取评论信息");
	  		getcommentmodle()
	  	}else　{
	  		modlefunbase();
	  	}
	 })
}

//获取详情
function ajaxgetdata(data,callback) {
	var _link = "http://shop.mogujie.com/ajax/mgj.pc.detailinfo/v1?_ajax=1&itemId="+ data.tradeItemId;
	nodegrass.get(_link,function(dataa){
		data.fctxiangqing  =  base64().encode(JSON.stringify(JSON.parse(dataa)));
  		callback()
	},"utf-8")
}

//获取评论数据
function getcommentmodle() {
	console.log("评论数据以获取:"+Math.floor((baseinfo_index/baseinfo.length)*100)+"%");
	getcomment(baseinfo[baseinfo_index],function(){
	  	baseinfo_index = baseinfo_index+1;
	  	if(baseinfo_index==baseinfo.length) {
	  		baseinfo_index = 20;
	  		okget()
	  	}else　{
	  		getcommentmodle()
	  	}
	 })
}

//获取评论分发数据
function getcomment(data,callback) {
	var _link = "http://shop.mogujie.com/ajax/pc.rate.ratelist/v1?pageSize=100&sort=1&isNewDetail=1&itemId="+data.tradeItemId+"&type=1"
	nodegrass.get(_link,function(dataa){
		 data.pinglun  =  JSON.stringify(dataa);
  		callback()
	},"utf-8")
}

//数据获取完成
function okget() {
	baseinfo_index = 20;
	console.log("获取评论数据完成");
	console.log("开始插入数据");
	modlefun()
}


//发送商品信息
function modlefun() {
  console.log("插入数据:"+Math.floor((baseinfo_index/baseinfo.length)*100)+"%");
  senddata(baseinfo[baseinfo_index],function(){
  	baseinfo_index = baseinfo_index+1;
  	if(baseinfo_index==baseinfo.length) {
  		baseinfo_index = 20;
  		console.log("商品信息发送完成")
  		sendcommnetmodle()
  	}else　{
  		modlefun()
  	}
  	
  })
}

//发送商品
function senddata(datakk,callback) {
	var querystring = require('querystring');
	var data = querystring.stringify({
		"PID": baseinfo_index+_indexid,
		"CategoryID": CategoryID,
		"ProductName": datakk.title,
		"ProductImage": datakk.img,
		"ProductIntroduction": datakk.fctxiangqing,
		"ShelfDate":"2016-10-21",
		'ProductPrice':datakk.price,
		'Productstock':datakk.cfav
	});
	var opt = {  
        method: "POST",  
        host: "113.251.174.98",  
        port: 7078,  
        path: "/api/AddCategory",  
        headers: {
            "User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
        	"Accept":'*/*',
			'Accept-Encoding':'gzip, deflate, br',
			'Accept-Language':'zh-CN,zh;q=0.8,en;q=0.6',
			'Cache-Control':'no-cache',
            'Content-Type':"application/x-www-form-urlencoded",
            "Connection":"keep-alive",
            'Host':"zhuanlan.zhihu.com",
			"X-Requested-With":"XMLHttpRequest",
			"Pragma":"no-cache"
        }  
	};  
	var req = http.request(opt, function (serverFeedback) { 
        serverFeedback.setEncoding('utf8');
        var endcookir = serverFeedback.headers['set-cookie'];
        if(serverFeedback.statusCode==200) {
        	console.log("数据插入成功")
        }
		//接受相应数据
        serverFeedback.on("data",function(cendata) {
        	if(cendata) {
        		callback()
        	}
        })

    }).on('error', function(e) {
      console.log("报错了: " + e.message);
	});
	req.write(data);
	req.end();
}


var commentlist_index = 0;

//循环发送评论数据
function sendcommnetmodle() {
	console.log("插入评论数据:"+Math.floor((baseinfo_index/baseinfo.length)*100)+"%");
	var nicai = JSON.parse(baseinfo[baseinfo_index].pinglun);
	var list = JSON.parse(nicai).data.list;
	var datakk = list[commentlist_index];
	sendcommnet(datakk,function(){
		commentlist_index = commentlist_index + 1;
		if(commentlist_index==list.length) {
			commentlist_index = 0;
			baseinfo_index = baseinfo_index+1;
		}
		sendcommnetmodle()
	})
}

//发送评论数据
function sendcommnet(datall,callback) {
	var querystring = require('querystring');
	var data = querystring.stringify({
		"p_id": baseinfo_index+_indexid,
		"u_name": datall.userInfo.uname,
		"c_content": datall.content,
		"c_date":  datall.formatDate,
		"u_img": datall.userInfo.avatar
	});
	var opt = {  
        method: "POST",  
        host: "113.251.174.98",  
        port: 7078,  
        path: "/api/AddComment",  
        headers: {
            "User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
        	"Accept":'*/*',
			'Accept-Encoding':'gzip, deflate, br',
			'Accept-Language':'zh-CN,zh;q=0.8,en;q=0.6',
			'Cache-Control':'no-cache',
            'Content-Type':"application/x-www-form-urlencoded",
            "Connection":"keep-alive",
            'Host':"zhuanlan.zhihu.com",
			"X-Requested-With":"XMLHttpRequest",
			"Pragma":"no-cache"
        }  
	};  
	var req = http.request(opt, function (serverFeedback) { 
        serverFeedback.setEncoding('utf8');
        var endcookir = serverFeedback.headers['set-cookie'];
        if(serverFeedback.statusCode==200) {
        	console.log("评论数据插入成功")
        }
		//接受相应数据
        serverFeedback.on("data",function(cendata) {
        	if(cendata) {
        		callback()
        	}
        })
    }).on('error', function(e) {
      console.log("报错了: " + e.message);
	});
	req.write(data);
	req.end();
}




module.exports = GETPAGE;