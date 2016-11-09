
(function(){
//用自执行函数，不会污染全局变量
	var listModule = angular.module('doubanApp.listModule',['toubanApp.service']);
	
    //将各自的路由配置放在自己的模块下面
    listModule.config(['$routeProvider',function($routeProvider){

     $routeProvider.
     when('/:cagory/:page?',{
         templateUrl : 'list/list.html',
         controller: 'ListController'
     })
  }]);

    listModule.controller('ListController',['$scope','$timeout',
        'JsonService','$routeParams','$route','$rootScope','appConfig',
        function($scope,$timeout,JsonService,$routeParams,$route,$rootScope,appConfig){
        //如果要用系统的jsonp,就要注入$http 

        //给根作用域设置当前的分类信息，控制左侧三个分类按钮的选中
        // index.html中的数据不属于ListController的 $scope 管理,所有只能加到$rootScope上
        //定义一个根作用域的一个参数，用来选择 = 路由参数中的一个参数，a链接     
        $rootScope.category = $routeParams.cagory;

        // //搜索框
        // $rootScope.search = function(){
        //     // console.log($rootScope.input);
        //     //如果路由表中没有配置q参数，则会自动加到?后
        //     $route.updateParams({cagory:'search',q:$rootScope.input})

        // }

        var count = appConfig.pageCount;
        //得到当前的页码
        var currentPage = parseInt($routeParams.page||1);
        $scope.currentPage = currentPage;

        //从第几条开始请求,count不变始终为5
        var start = (currentPage-1)*count;

        //跨域请求豆瓣数据
		JsonService.jsonp(appConfig.listUrl+$routeParams.cagory,
            {count:count,start:start,q:$routeParams.q},function(res){
            // console.log(res);
            //Object { count: 10, start: 0, total: 35, subjects: Array[10], title: "正在上映的电影-北京" }
            $scope.subjects = res.subjects;

            //标题
             $scope.title = res.title;

            //数据的总条数
            $scope.total = res.total;

            //共有几页
            $scope.totalPage = Math.ceil($scope.total/count);

        ///配置分页控件，数据请求完毕后,pageConfig才有值
              console.log('数据请求完成');
          $scope.pageConfig = {total:$scope.totalPage,current:currentPage,
                show:7,click:function(index){
                    //alert(index);
                    //更改路由的参数,控制分页,需要用到$route
                    $route.updateParams({page:index})

                    // //刷新路由,因为用的是onclick点击的时候就刷新页面,如果是ng-click就不用刷新了
                    // $route.reload();
                }};

            //告诉angular刷新界面上的数据
            $scope.$apply();

           $scope.hundlePage = function(page){
            // 1、循环做
            // if(page<1 || page>$scope.totalPage){
            //     return;
            // }

          
            // if(page>8){
            //     page=8;
            // }
            // if(page<1){
            //     page=1;
            // }
            
            //2、用函数做
            page = Math.min(Math.max(page,1),$scope.totalPage);

           //用updateParams方法更改路由的参数，控制分页，需要用到$route
           $route.updateParams({page:page}); 
          }

        });


       /*
        setTimeout(function(){
            $scope.name = '张三';
            //告诉angular刷新界面上的数据
            $scope.$apply();
        },3000)

        //anuglar 会自动同步界面上的数据
        $timeout(function(){
            $scope.name = 'zhangsan';
        },3000);
        */
	}])


})()

// 此种方式污染了全局环境
    // function fun(data) {
    // 	console.log(data)
    // }