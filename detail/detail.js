
(function(){

	var detailModule = angular.module('doubanApp.detail',['toubanApp.service']);

   detailModule.config(['$routeProvider',function($routeProvider){

  	 $routeProvider.
     when('/detail/:movieId',{
       templateUrl:'detail/detail.html',
       controller:'DetailController'
     })
   }])

	detailModule.controller('DetailController',['$scope','$routeParams',
		'JsonService','appConfig',
		function($scope,$routeParams,JsonService,appConfig){

			$scope.loading = false;
		JsonService.jsonp(appConfig.detailUrl+$routeParams.movieId,{},function(res){
			console.log(res);
			$scope.movie = res;
			$scope.loading = true;
			$scope.$apply();
		})
	}])
})()