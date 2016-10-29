var nodegrass = require("nodegrass")
var cheerio = require("cheerio");

var Server = {};


/**
 * 首页推荐专栏
 * @param  limit = 条数 offset  = 起始位置 seed = 66
 * @return {[type]} [description]
 */
Server.getZhuanlan = function(limit,offset,seed,callback) {
	var getLink = "https://zhuanlan.zhihu.com/api/recommendations/columns?limit="+limit+"&offset="+offset+"&seed=66";
	nodegrass.get(getLink,function(data){
		var enddata = JSON.parse(data);
		for(var i=0 ;i<enddata.length; i++) {
			var template = enddata[i].avatar.template;
			var id = enddata[i].avatar.id;
			var reg = /{id}_{size}/g;
			enddata[i].avatar = template.replace(reg, id);
		}
		callback(enddata)
	},"utf-8")
}

/**
 * 首页推荐文章
 * @param  limit = 条数 offset  = 起始位置 seed = 66
 * @return {[type]} [description]
 */
Server.getWenzhang = function(limit,offset,seed,callback) {
	var getLink = "https://zhuanlan.zhihu.com/api/recommendations/posts?limit="+limit+"&offset="+offset+"&seed=66";
	nodegrass.get(getLink,function(data){
		var enddata = JSON.parse(data);
		callback(enddata)
	},"utf-8")
}

/**
 * 专栏详细信息
 * @param  urllink = "专栏后缀 来自于与推荐页 url"
 * @return {[type]} [description]
 */
Server.getZhuanlanInfo = function(urllink,callback) {
	console.log(urllink)
	var getLink = "https://zhuanlan.zhihu.com/api/columns"+urllink;
	nodegrass.get(getLink,function(data){
		var enddata = JSON.parse(data);

		var id = enddata.avatar.id;
		var template = enddata.avatar.template;
		var reg = /{id}_{size}/g;
		endavatar = template.replace(reg, id);
		enddata.avatar = endavatar;
		callback(enddata)
	},"utf-8")
}

/**
 * 专栏文章列表
 * @param  limit = "专栏列表条数"
 * @return {[type]} [description]
 */
Server.getZhuanlanposts = function(sulg,limit,callback) {
	var getLink = "https://zhuanlan.zhihu.com/api/columns/"+sulg+"/posts?limit="+limit;
	nodegrass.get(getLink,function(data){
		var enddata = JSON.parse(data);
		callback(enddata)
	},"utf-8")
}


/**
 * 文章详情
 * @param  Id = "文章编号 来源于列表 url_token" 
 * @return {[type]} [description]
 */
Server.getWenzhangText= function(Id,callback) {
	var getLink = "https://zhuanlan.zhihu.com/api/posts/"+Id;
	nodegrass.get(getLink,function(data){
		var enddata = JSON.parse(data);
        
		//处理文章作者头像问题
		var id = enddata.author.avatar.id;
		var template = enddata.author.avatar.template;
		var reg = /{id}_{size}/g;
		endavatar = template.replace(reg, id);
		enddata.author.avatar = endavatar;

		//处理点赞人头
		for(var i=0,laster = enddata.lastestLikers;i<laster.length; i++) {
			var template = laster[i].avatar.template;
			var id = laster[i].avatar.id;
			var reg = /{id}_{size}/g;
			laster[i].avatar = template.replace(reg, id);
		}
		var reg=new RegExp(/(<img src=")/g);
        var newstr = enddata.content.replace(reg,"$1http://127.0.0.1:3000/geturl?q="); 
        enddata.content = newstr;
		callback(enddata)
	},"utf-8")
}
/**
 * 文章评论
 * @param  Id = "文章编号 来源于列表 url_token limit限制条数" 
 * @return {[type]} [description]
 */
Server.getWenzhangTextcomments = function(Id,limit,callback) {
	var getLink = "https://zhuanlan.zhihu.com/api/posts/"+Id+"/comments?limit="+limit;
	nodegrass.get(getLink,function(data){
		var enddata = JSON.parse(data);
		for(var i=0;i<enddata.length; i++) {
			var template = enddata[i].author.avatar.template;
			var id = enddata[i].author.avatar.id;
			var reg = /{id}_{size}/g;
			enddata[i].author.avatar = template.replace(reg, id);
		}
		callback(enddata)
	},"utf-8")
}


/**
 * 文章被专刊收录
 * @param  Id = "文章编号 来源于列表 url_token " 
 * @return {[type]} [description]
 */
Server.getWenzhangTextcontributed= function(Id,callback) {
	var getLink = "https://zhuanlan.zhihu.com/api/posts/"+Id+"/contributed";
	nodegrass.get(getLink,function(data){
		var enddata = JSON.parse(data);
		callback(enddata)
	},"utf-8")
}

/**
 * 文章点赞用户列表
 * @param  Like = "文章编号 来源于列表 url_token " 
 * @return {[type]} [description]
 */
Server.getWenzhangTextLike= function(Id,callback) {
	var getLink = "https://zhuanlan.zhihu.com/api/posts/"+Id+"/likers";
	nodegrass.get(getLink,function(data){
		var enddata = JSON.parse(data);
		callback(enddata)
	},"utf-8")
}

/**
 * 推荐阅读列表
 * @param  limit 条数限制 seed 获取id(任意)
 */

Server.getrecommendations = function(limit,seed,callback) {
	var getLink = "https://zhuanlan.zhihu.com/api/recommendations/posts?limit=2&seed=61";
	nodegrass.get(getLink,function(data){
		var enddata = JSON.parse(data);
		callback(enddata)
	},"utf-8")
}

/**
 * 图片中转路径
 * @type {[type]}
 */
Server.transferImg = function(url,callback) {
	nodegrass.get(url,function(data){
		callback(data)
	},"binary")
}


//美丽说数据抓取
var tempdata = [];

// function geturl() {
// 	var getLink = "http://www.meilishuo.com/search/catalog/10057053?ptp=1.9Hyayb.0.0.rKojt&acm=3.mce.2_10_182yi.14354.0.HE3q0OLWeil.m_188513&mt=12.14354.r130506.18023&action=bags&page=2&cpc_offset=0";
// 	nodegrass.get(getLink,function(data){
// 		$ = cheerio.load(data,{decodeEntities: false});
// 		var list = $(".product .product-list ");
// 		var reg = new RegExp("\\((.| )+?\\)","igm");
// 		for(var i = 0; i<list.length;i++) {
// 			var senddata = {
// 				"ProductName":"",
// 				"ProductImage":"",
// 				"ProductIntroduction":"",
// 				"ShelfDate":"",
// 				"ProductPrice":"",
// 				"Productstock":"",
// 			};
// 			var nicai = $(list[i]).find(".img-link").attr('style').match(reg)[0].slice(1,-1);
// 			senddata['ProductName'] =  $(list[i]).find(".text-link").text().replace(/(^\s+)|(\s+$)/g,"").replace(/\s/g,"");
// 			senddata['ProductImage'] = nicai;
// 			senddata['ProductIntroduction'] = $(list[i]).find(".text-link").text().replace(/(^\s+)|(\s+$)/g,"").replace(/\s/g,"");
// 			senddata['ShelfDate'] = "2013-01-12";
// 			senddata['ProductPrice'] = $(list[i]).find(".price-n").text();
// 			senddata['Productstock'] = $(list[i]).find(".fav-n").text();
// 			tempdata.push(senddata);
// 		}
// 		console.log(tempdata)
// 		modlefun()
// 	},"utf-8")
// }
// geturl();

// var _index = 0;

// function senddata(data,callback) {
// 	var samlldata = "CategoryID=14&ProductName="+data.ProductName+"&ProductImage="+data.ProductImage+"&ProductIntroduction="+data.ProductIntroduction+"&ShelfDate="+data.ShelfDate+"&ProductPrice="+data.ProductPrice+"&Productstock="+data.Productstock+""
// 	samlldata = encodeURI(samlldata)
// 	var url = "http://113.251.165.99:7078/api/AddCategory?"+samlldata;
// 	console.log(url)
// 	nodegrass.get(url,function(data){
// 		console.log(_index)
// 		if(data) {
// 			console.log(data)
// 			callback()
// 		}
// 	},"utf-8")
// }
 
// function modlefun() {
//   senddata(tempdata[_index],function(){
//   	_index = _index+1
//   	modlefun()
//   })
// }


// function geturl() {
// 	var getLink = "http://mce.mogucdn.com/jsonp/multiget/3?callback=jsonp15408&pids=15408";
// 	nodegrass.get(getLink,function(data){
// 		var newdata =  data.slice(11,data.length-1);
// 		var enddata = JSON.parse(newdata).data['15408'].list;
// 		// $ = cheerio.load(data,{decodeEntities: false});
// 		// var list = $(".product .product-list ");
// 		// var reg = new RegExp("\\((.| )+?\\)","igm");
// 		for(var i = 0; i<enddata.length;i++) {
// 			var senddata = {
// 				"ProductName":"",
// 				"ProductImage":"",
// 				"ProductIntroduction":"",
// 				"ShelfDate":"",
// 				"ProductPrice":"",
// 				"Productstock":"",
// 			};
// 			senddata['ProductName'] =  enddata[i]['title'];
// 			senddata['ProductImage'] =  enddata[  i]['image'];
// 			senddata['ProductIntroduction'] = enddata[i]['title'];
// 			senddata['ShelfDate'] = "2013-01-12";
// 			senddata['ProductPrice'] =  enddata[i]['price'];
// 			senddata['Productstock'] = enddata[i]['itemSale'];
// 			tempdata.push(senddata);
// 		}
// 		modlefun()
// 	},"utf-8")
// }
// geturl();

// var _index = 0;

// function senddata(data,callback) {
// 	var samlldata = "CategoryID=1&ProductName="+data.ProductName+"&ProductImage="+data.ProductImage+"&ProductIntroduction="+data.ProductIntroduction+"&ShelfDate="+data.ShelfDate+"&ProductPrice="+data.ProductPrice+"&Productstock="+data.Productstock+""
// 	samlldata = encodeURI(samlldata)
// 	var url = "http://113.251.165.99:7078/api/AddCategory?"+samlldata;
// 	console.log(url)
// 	nodegrass.get(url,function(data){
// 		console.log(_index)
// 		if(data) {
// 			console.log(data)
// 			callback()
// 		}
// 	},"utf-8")
// }
 
// function modlefun() {
//   senddata(tempdata[_index],function(){
//   	_index = _index+1
//   	modlefun()
//   })
// }



// 京东数据获取
function geturl() {
	var getLink = "http://list.mogujie.com/search?callback=jQuery211009319157510612008_1477565841877&_version=1&f=baidusem_kupyj4uq08&sort=pop&_mgjuuid=b1897008-7b45-66dd-91b9-97c30b424753&acm=3.mf.1_0_0.0.0.0.mf_15261_155399-mfs_6&width=220&showH=330&height=330&cKey=pc-wall-v1&page=1&userId=&action=clothing&fcid=51082&ad=0&ptp=1._mf1_1239_15261.0.0.amK5Q&showW=220&ratio=2%3A3&_=1477565841878";
	nodegrass.get(getLink,function(data){
		var newdata =  data.slice(46,data.length-2);
		var enddata = JSON.parse(newdata).result.wall.docs;
		for(var i = 0; i<enddata.length;i++) {
			var senddata = {
				"ProductName":"",
				"ProductImage":"",
				"ProductIntroduction":"",
				"ShelfDate":"",
				"ProductPrice":"",
				"Productstock":"",
			};
			senddata['ProductName'] =  enddata[i]['title'];
			senddata['ProductImage'] =  enddata[i]['img'];
			senddata['ProductIntroduction'] = enddata[i]['title'];
			senddata['ShelfDate'] = "2016-10-30";
			senddata['ProductPrice'] =  enddata[i]['price'];
			senddata['Productstock'] = enddata[i]['itemMarks'];
			tempdata.push(senddata);
		}
		modlefun()
	},"utf-8")
}

var _index = 0;

function senddata(data,callback) {
	var samlldata = "CategoryID=9&ProductName="+data.ProductName+"&ProductImage="+data.ProductImage+"&ProductIntroduction="+data.ProductIntroduction+"&ShelfDate="+data.ShelfDate+"&ProductPrice="+data.ProductPrice+"&Productstock="+data.Productstock+""
	samlldata = encodeURI(samlldata)
	var url = "http://113.251.165.99:7078/api/AddCategory?"+samlldata;
	console.log(url)
	nodegrass.get(url,function(data){
		console.log(_index)
		if(data) {
			console.log(data)
			callback()
		}
	},"utf-8")
}
 
function modlefun() {
  senddata(tempdata[_index],function(){
  	_index = _index+1
  	modlefun()
  })
}

module.exports = Server;
