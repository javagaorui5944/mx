var nodegrass = require("nodegrass")
var http = require('http');
var https = require('https');

//登录知乎
function loginzhihu(callback) {
	GET_XSRF(getlogin,function(login,allcookie,otherxsrf){
		var reg= /Path=\//g;
		var otherxsrfnew = otherxsrf.replace(reg,"");
		var loginnew = login.replace(reg,"");

		var changetokenstr = otherxsrfnew+loginnew;
		changeToken(changetokenstr,function(data){
			console.log(data)
		})
	})
}


//获取_xsrf
function GET_XSRF(getlogin,callback) {
	nodegrass.get("https://www.zhihu.com/",function(data,status,headers){
		//获取所有cookie
		var cookie = headers['set-cookie'];
		var cookieupload = "";
		for(var i=0; i<cookie.length;i++) {
			cookieupload+=cookie[i].replace(/Path=\//g,"").replace(/Domain=zhihu.com;/g,"")
		}
		


		//获取_xsrf
		var str = headers['set-cookie'];
		var reg = /_xsrf/g;
		var _xsrf_str = "";
		var otherxsrf = ""
		for(var i=0;i<str.length;i++) {
			if(reg.test(str[i])){
				_xsrf_str = str[i]
			}else {
				otherxsrf+= str[i];
			}
		}

		var rega = /_xsrf=(\w+)/ig; 
		_xsrf_str.replace(rega, function() { 
			var _xsrf= arguments[1];
			getlogin(_xsrf,cookieupload,otherxsrf,callback)
		}); 
	},"utf-8")
}

//获取login回话权限
function getlogin(xsrf,cookieupload,otherxsrf,callback) {
	var querystring = require('querystring');
	var data=querystring.stringify({password:"*****",remember_me:true,email:"*****",_xsrf:xsrf});
	var opt = {  
        method: "POST",  
        host: "www.zhihu.com",  
        port: 443,  
        path: "/login/email",  
        headers: {
			"User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
        	"Accept":'*/*',
			'Accept-Encoding':'gzip, deflate, br',
			'Accept-Language':'zh-CN,zh;q=0.8,en;q=0.6',
			'Cache-Control':'no-cache',
            'Content-Type':"application/x-www-form-urlencoded",
            "Connection":"keep-alive",
            "Content-Length": data.length,
            "Cookie":cookieupload,
            'Host':"www.zhihu.com",
			'Origin':"https://www.zhihu.com",
			"X-Requested-With":"XMLHttpRequest",
			"Pragma":"no-cache",
			"Referer":"https://www.zhihu.com/"
        }  
	};  
	var req = https.request(opt, function (serverFeedback) { 
        serverFeedback.setEncoding('utf8');
        var endcookir = serverFeedback.headers['set-cookie'];
        var _xsrf_endcookir = "";
        var reg = /login/g;
        var zco = /z_c0/g;
        var a_t = /a_t/g;

        for(var i=0;i<endcookir.length;i++) {
			if(reg.test(endcookir[i])||zco.test(endcookir[i])||a_t.test(endcookir[i])){
				_xsrf_endcookir += endcookir[i]+";";
			}
		}

		if(serverFeedback.statusCode==200) {
        	console.log("主站认证成功")
        }
		//接受相应数据
        serverFeedback.on("data",function(cendata) {
        	var enddata = JSON.parse(cendata);
        	console.log(enddata)
        	callback(_xsrf_endcookir,cookieupload,otherxsrf)
        })

        
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
	});
	req.write(data);
	req.end();
}

//获取个人信息换取回话token
function changeToken(testcookie,callback) {
	var tokencookie = testcookie;
	var newtokencookie = tokencookie.split(";");
	var _xsrf_str = "";
	for(var i =0;i<newtokencookie.length;i++) {
		if(/q_c1/g.test(newtokencookie[i])||/l_cap_id/g.test(newtokencookie[i])||/cap_id/g.test(newtokencookie[i])||/n_c/g.test(newtokencookie[i])||/login/g.test(newtokencookie[i])||/a_t/g.test(newtokencookie[i])||/z_c0/g.test(newtokencookie[i])){
			_xsrf_str = _xsrf_str+newtokencookie[i]+";"
		}
	}
	var opt = {  
        method: "GET",  
        host: "zhuanlan.zhihu.com",  
        port: 443,  
        path: "/api/me",  
        headers: {
			"User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
        	"Accept":'*/*',
			'Accept-Encoding':'gzip, deflate, br',
			'Accept-Language':'zh-CN,zh;q=0.8,en;q=0.6',
			'Cache-Control':'no-cache',
            'Content-Type':"application/x-www-form-urlencoded",
            "Connection":"keep-alive",
            "Cookie":_xsrf_str,
            'Host':"zhuanlan.zhihu.com",
			'Origin':"https://www.zhihu.com",
			"X-Requested-With":"XMLHttpRequest",
			"Pragma":"no-cache",
			"Referer":"https://zhuanlan.zhihu.com/"
        }  
	};  

	var req = https.request(opt, function (serverFeedback) { 
        serverFeedback.setEncoding('utf8');
        if(serverFeedback.statusCode==200) {
        	console.log("跨站点认证成功")
        }

        //获取_xsrf跨站点访问权限
        var reg= /Path=\//g;
        var _xsrfendcookir = serverFeedback.headers['set-cookie'];
        for(var i=0;i<_xsrfendcookir.length;i++) {
        	_xsrf_str+=_xsrfendcookir[i].replace(reg,"")
        }

        console.log(_xsrf_str)
		//接受相应数据
		var _data= ""
        serverFeedback.on("data",function(cendata) {
        	serverFeedback.setEncoding('utf8');
        	_data+=cendata;
        	var enddata = JSON.parse(_data);
        	console.log(enddata)
        })

    }).on('error', function(e) {
      console.log("Got error: " + e.message);
	});
	req.end();
}



module.exports = loginzhihu;