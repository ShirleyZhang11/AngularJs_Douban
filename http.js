(function(){

  var serviceModule = angular.module('toubanApp.service',[]);

  serviceModule.service('JsonService',['$window',function($window){

  	this.jsonp = function(url,params,fn){

  		var queryString = '?';
	     //1、拼接参数
	     for(key in params){
	     	queryString += key +'='+params[key]+'&&';
	     }

	     // console.log(queryString);

        //生成函数名my_callback124992930
	     var funName ='my_callback'+ new Date().getTime();
	     queryString += 'callback' + '='  + funName;
	     // console.log(queryString);

	     //挂载函数
	     $window[funName] = function(res){
	     	console.log('请求成功')
	     	fn(res);

	     	//删除之前添加的script标签,防止创建太多的script标签，占内存
	     	$window.document.body.removeChild(script);
	     }

	     //要向页面添加script标签
	     //设置src ="www.baidu.com?callback=fun"
	     var script = document.createElement('script');
	     script.src = url + queryString;

	     $window.document.body.appendChild(script);

    }
 }])

})()