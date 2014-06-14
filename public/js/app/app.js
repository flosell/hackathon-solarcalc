var solarApp = angular.module('solarcap-app', []);

solarApp.controller('SearchCtrl', [
  '$scope',
  function ($scope) {
    $scope.parameter = {
      type: 'house',
      residents: 1
    };

    $scope.setRatingValue = function(n){
      $scope.parameter.residents = n;
    }

    $scope.doSearch = function () {
      search($scope.address)
      $scope.$parent.subsidy = "blubb"
    }
  }
]);

solarApp.controller('MapCtrl', [
  '$scope',
  function ($scope) {

    initMap(function(data) {
        $scope.$apply(function(){
            $scope.selectedArea = data
        })
    })

    $scope.$watch("selectedArea",function(data) {
        if (data === undefined) return;

        $scope.$parent.inputData.selectedArea = data.selectedArea;
        $scope.$parent.inputData.selectedState = data.selectedState;



    })
  }
]);

solarApp.controller('CalcCtrl', [
  '$scope',
  function ($scope) {

    initMap(function(data) {
        $scope.$apply(function(){
            $scope.selectedArea = data
        })
    })

    $scope.inputData = {
        selectedArea: 0,
        selectedState: "Berlin",
        kind: "HOME",
        residents: 1
    }

    $scope.subsidy = ""
    $scope.acquisitionCosts = ""

    $scope.$watch("inputData",function(data) {

        var calculator = sunCalculator();

//        var sqm = data.selectedArea;
//        var state = data.selectedState;
//        var KWP = calculator.calculateKWP(sqm);
//        var subsidy = calculator.calculateSubsidy(KWP, state, 0);

        var calculationResult = calculator.calculateSolarCap(data.selectedArea, data.selectedState, data.residents, data.kind)

        $scope.subsidy = calculationResult.yearlySubsidy;
        $scope.acquisitionCosts = calculationResult.acquisitionCosts;

    },true);

  }
]);

solarApp.directive('radio', function ($timeout) {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function ($scope, $element, $attributes, ngModel) {
      var value = $attributes.radio;

      $timeout(function () {
        if (ngModel.$modelValue == value) {
          $element.addClass('active');
        }
      });

      $element.on('click', function () {
        $('.btn-group .btn').each(function () {
          $(this).removeClass('active');
        });

        $element.addClass('active');

        if (ngModel) {
          $scope.$apply(function () {
            ngModel.$setViewValue(value);
          });
        }
      });
    }
  }
});



