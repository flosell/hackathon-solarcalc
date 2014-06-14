var solarApp = angular.module('solarcap-app', []);

solarApp.controller('SearchCtrl', [
  '$scope',
  function($scope){
    $scope.doSearch = function() {
        search($scope.address)
    }
  }
]);

solarApp.directive();



