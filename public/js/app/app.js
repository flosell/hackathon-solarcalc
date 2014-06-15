'use strict';

var solarApp = angular.module('solarcap-app', [
  'googlechart',
  'ui.bootstrap',
  'ngAnimate'
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
      $scope.yearlySavings = calculationResult.yearlySavings;
      $scope.yearlyMoney = calculationResult.yearlyMoney;
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
        "title": "Daily Energy Production / Consumption",
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
    };

    $scope.generateChartDate = function(){
      var consumption = [0.033, 0.028, 0.023, 0.021, 0.019, 0.018, 0.017, 0.017, 0.016, 0.016, 0.018, 0.020, 0.023, 0.031, 0.047, 0.051, 0.054, 0.054, 0.056, 0.055, 0.052, 0.051, 0.052, 0.054, 0.061, 0.063, 0.062, 0.059, 0.056, 0.054, 0.052, 0.050, 0.047, 0.047, 0.046, 0.051, 0.056, 0.066, 0.073, 0.075, 0.078, 0.070, 0.061, 0.056, 0.051, 0.048, 0.047, 0.038];
      var output = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 0.02, 0.09, 0.11, 0.14, 0.16, 0.18, 0.20, 0.21, 0.21, 0.22, 0.21, 0.20, 0.19, 0.18, 0.16, 0.12, 0.11, 0.07, 0.03, 0.02, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      $scope.chartObject.data.rows = [];

      for(var i = 0; i <= consumption.length - 1; i++){
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

solarApp.directive('tooltip', function () {
  return {
    restrict: 'A',
    link: function ($scope, $element, $attributes) {
      $element.tooltip({});
    }
  }
});


