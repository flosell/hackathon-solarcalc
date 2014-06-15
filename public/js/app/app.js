'use strict';

var solarApp = angular.module('solarcap-app', [
  'googlechart',
  'ui.bootstrap'
])

solarApp.controller('CalcCtrl', [
  '$rootScope',
  '$scope',
  function ($rootScope, $scope) {

    $scope.inputData = {
      selectedArea: 0,
      selectedState: "Berlin",
      kind: "HOME",
      residents: 1,
      withBattery: false
    };

    $scope.recommendations = [];

    $scope.subsidy = "";
    $scope.acquisitionCosts = "";
    $scope.showResult = false;

    $scope.$watch("inputData",function(data) {
      var calculator = sunCalculator();
      calculator.setBattery(data.withBattery);
      var calculationResult = calculator.calculateSolarCap(data.selectedArea, data.selectedState, data.residents, data.kind)

      $scope.subsidy = calculationResult.yearlySubsidy;
      $scope.acquisitionCosts = calculationResult.acquisitionCosts;
      $scope.amortizationInYears = calculationResult.amortizationInYears;
      $scope.savingFromBattery = calculationResult.savingFromBattery;
      $scope.CO2Savings = calculationResult.CO2Savings;
      $scope.KWHPerYear = calculationResult.KWHPerYear;

      if (calculationResult.amortizationInYears > 30 || calculationResult.error ===  'negative subsidy') {
        $scope.errorMessage = "Your panel size is inefficient!";
      }else {
        $scope.errorMessage = "";
      }

      $scope.generateChartDate();
      if('argument missing' === calculationResult.error){
        $scope.showResult = false;
      } else {
        $scope.showResult = true;
      }
    },true);



    $scope.chartObject = {
      "type": "AreaChart",
      "displayed": true,
      "data": {
        "cols": [
          {
            "id": "time",
            "label": "Time",
            "type": "string",
            "p": {}
          },
          {
            "id": "consumption",
            "label": "Consumption",
            "type": "number",
            "p": {}
          },
          {
            "id": "solar-output",
            "label": "Solar Output",
            "type": "number",
            "p": {}
          }
        ],
        "rows": []
      },
      "options": {
        "title": "Graph",
        "isStacked": "false",
        "colors": ['#4A89DC','#2dcff1'],
        "fill": 40,
        'chartArea': {'width': '75%', 'height': '80%'},
        'legend': {'position': 'top'},
        animation: {
          duration: 1000,
          easing: 'out'
        },
        fontName: 'Roboto',
        fontSize: 11,
        "displayExactValues": true,
        "vAxis": {
          "title": "kwh",
          "gridlines": {
            "count": 10
          }
        },
        "hAxis": {
          "title": "Time"
        }
      },
      "formatters": {}
    }

    $scope.generateChartDate = function(){
      var consumption = [ 0.033, 0.017, 0.023, 0.056, 0.061, 0.052, 0.056, 0.061, 0.033 ];
      var output = [0, 0, 0, 0.11, 0.21, 0.16, 0, 0, 0];

      $scope.chartObject.data.rows = [];

      for(var i = 0; i <= 8; i++){
        $scope.chartObject.data.rows.push({
          "c": [
            {
              "v": (i*3) + ':00'
            },
            {
              "v": $scope.inputData.residents * consumption[i]
            },
            {
              "v": $scope.inputData.selectedArea * output[i] * 0.15
            }
          ]
        });
      }
    }

    $scope.generateChartDate();

    $scope.setRatingValue = function(n){
      $scope.inputData.residents = n;
    }

    $scope.doSearch = function () {
      search($scope.address);
    }

    $scope.setAddress = function(addr){
       $scope.address = addr;
    }

    $scope.doRecommend = function() {
      $scope.map.recommend($scope.address,function(recommendations) {
          $scope.$apply(function() {
            $scope.recommendations = recommendations;
          });
      });
    }

    $scope.map = initMap(function(data) {
        $scope.$apply(function(){
            $scope.inputData.selectedArea = data.selectedArea;
            $scope.inputData.selectedState = data.selectedState;
        })
    });

    $scope.resetMap = function() {
      $scope.map.reset();
      $scope.showResult = false;
    }
  }
]);

solarApp.controller('MapCtrl', [
  '$rootScope',
  '$scope',
  function ($rootScope, $scope) {

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


