// 主模块，里面的所有依赖，子模块都可以用
(function(){
   //依赖放前面先匹配
  var doubanApp = angular.module('doubanApp',['ngRoute','doubanApp.detail','doubanApp.listModule']);

  //路由 每个模块的路由单独放到子模块中配置
  doubanApp.config(['$routeProvider',function($routeProvider){

  	 $routeProvider.
  	 otherwise({
  	 	 redirectTo: '/in_theaters'
  	 })
  }]);

  //定义一个不变的值,将链接都放在一个对象中
  doubanApp.constant('appConfig',{
    listUrl:"https://api.douban.com/v2/movie/",
    detailUrl:"https://api.douban.com/v2/movie/subject/",
    //每页显示的个数
    pageCount:5
  });

  //定义search指令
  doubanApp.directive('search',['$route','$routeParams','$location','$timeout',
    function($route,$routeParams,$location,$timeout){

      return{

        replace: true,
        template: '<form ng-submit="search()" class="navbar-form navbar-right">\
            <input ng-model="input" type="text" class="form-control" placeholder="Search...">\
          </form>',
        link: function($scope,ele,attr,controller){
         //此$scope为$rootscope
          $scope.search = function(){
            // alert(1);

            if($routeParams.cagory){
               console.log('列表页');
               $route.updateParams({cagory:'search',q:$scope.input});
            }else{
              console.log('详情页');
              //到详情页修改路由参数
              $location.path('search');
              $timeout(function(){
               $route.updateParams({cagory:'search',q:$scope.input});

             },0);
            }

          }
        }
      }
    }]);

    //分页
     doubanApp.directive('page',[function(){

       return{
        replace:true,
        template: '<ul class="pagination">\
                     <li ng-class="{disabled:currentPage==1}">\
                        <a ng-click="hundlePage(currentPage-1)">上一页</a></li>\
                    <li ng-repeat="item in pages" ng-class="{active:item==current}" ng-click="selectPage(item)">\
                      <a>{{item}}</a></li>\
                    <li ng-class="{disabled:currentPage==totalPage}">\
                        <a ng-click="hundlePage(currentPage+1)">下一页</a></li>\
               </ul>',
        link: function($scope,ele,attr,controller){
            console.log('link函数先调用');         
              // console.log($scope);
              //用监听的方式
            $scope.$watch('pageConfig',function(n){

              console.log(n);
              //Object { total: 6, current: 3, show: 7, click: $scope.pageConfig.click() }
              if(n){       
                   var total = n.total;
                   var show =n.show;
                   var current =n.current;


                   //左右两边数字的个数
                   var region = Math.floor(show/2); //3
                   //从哪一页开始
                   var begin = current - region;  //9-3=6
      
                   //开始是最小值1
                   begin = Math.max(1,begin);
                   //从第几页结束
                   var end = begin + show; //
 
                if(end >total){ //31 >30
                    end = total + 1; //end = 30
                    begin = end - show; //31-7 = 24  24,25,26,27,28,29,30
                    begin = Math.max(1,begin);
                  }
          
                 // console.log(ele); //ul伪数组

               var pagination = ele[0];//拿到ul

                var pages = [];
                $scope.current = current;
                $scope.pages = pages;
                $scope.selectPage = function(index){
                  // alert(index);
                  //调用控制器传递过来的方法
                  n.click(index);
                }
                 
         

                for(var i = begin;i<end;i++){
                   pages.push(i);
                 }
                console.log(pages);
              }

            })

      
        }

       };

     }]);


})();