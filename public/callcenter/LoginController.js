var loginController = angular.module('callcenterApplication', ['ngMessages']);

loginController.controller('LoginController', function ($scope, $http) {

  $scope.authyId = false;
  $scope.token = '';

  $scope.reset = function(){
    $scope.loginForm.$setValidity('notFound', true);
    $scope.loginForm.$setValidity('serverError', true);
  };

  $scope.login = function(){

    var endpoint = navigator.userAgent.toLowerCase() + Math.floor((Math.random() * 1000) + 1);

    $http.post('/api/agents/login', { worker: $scope.worker, endpoint: endpoint })

      .then(function onSuccess(response) {
        if(response.data.authyId){
          $scope.authyId = response.data.authyId;
          $scope.worker = response.data.worker;
          SendToken()
        } else {
          window.location.replace('/callcenter/workplace.html');
        }
      }, function onError(response) { 

        if(response.status == 404){
          $scope.loginForm.$setValidity('notFound', false);
        } else {
          $scope.loginForm.$setValidity('serverError', false);
        }

      });
   };

  $scope.verify = function(){

    $http.post('/api/verification/verify-token', { authyId: $scope.authyId, token: $scope.token, worker: $scope.worker })
        .then(function onSuccess(response) {
          window.location.replace('/callcenter/workplace.html');
        }, function onError(response) {
          if(response.status == 404){
            $scope.loginForm.$setValidity('notFound', false);
          } else {
            $scope.loginForm.$setValidity('serverError', false);
          }
        });
  };

  function SendToken() {
    $http.post('/api/verification/request-token', {authyId: $scope.authyId, force: true})
        .then(function onSuccess(response) {
          console.log("SMS request sent");
        }, function onError(response) {
          if (response.status == 404) {
            $scope.loginForm.$setValidity('notFound', false);
          } else {
            $scope.loginForm.$setValidity('serverError', false);
          }
        });
  }

});
