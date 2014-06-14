'use strict';

var solarApp = angular.module('solarcap-app', [
  'googlechart'
])

solarApp.controller('SearchCtrl', [
  '$scope',
  function ($scope) {
    $scope.parameter = {
      type: 'HOME',
      residents: 3
    };

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
        "isStacked": "true",
        "colors": ['#4A89DC','#2dcff1'],
        "fill": 40,
        'chartArea': {'width': '85%', 'height': '80%'},
        'legend': {'position': 'top'},
        animation: {
          duration: 1000,
          easing: 'out'
        },
        fontName: 'Roboto',
        fontSize: 11,
        "displayExactValues": true,
        "vAxis": {
          "title": "kw/h",
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
      var output = [0, 0, 0, 0.45, 0.86, 0.65, 0, 0, 0];

      for(var i = 0; i <= 8; i++){
        $scope.chartObject.data.rows.push({
          "c": [
            {
              "v": (i*3) + ':00'
            },
            {
              "v": $scope.parameter.residents * consumption[i]
            },
            {
              "v": output[i] * 0.15 // * qm
            }
          ]
        });

        console.log($scope.parameter.residents * consumption[i]);
        console.log(output[i]);
      }
    }

    $scope.generateChartDate();

    $scope.setRatingValue = function(n){
      $scope.parameter.residents = n;
      $scope.$parent.inputData.residents = n;
    }

    $scope.doSearch = function () {
      search($scope.address)
    }

    $scope.$watch("parameter",function(parameter) {
        $scope.$parent.inputData.kind = parameter.type;
    },true);
  }
]);

solarApp.controller('MapCtrl', [
  '$scope',
  function ($scope) {

    initMap(function(data) {
        $scope.$apply(function(){
            $scope.selectedArea = data
        })
    });



    $scope.$watch("selectedArea",function(data) {
        if (data === undefined) return;

        $scope.$parent.inputData.selectedArea = data.selectedArea;
        $scope.$parent.inputData.selectedState = data.selectedState;
    });


  }
]);

solarApp.controller('CalcCtrl', [
  '$scope',
  function ($scope) {
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

        var calculationResult = calculator.calculateSolarCap(data.selectedArea, data.selectedState, data.residents, data.kind)

        $scope.subsidy = calculationResult.yearlySubsidy;
        $scope.acquisitionCosts = calculationResult.acquisitionCosts;
        $scope.amortizationInYears = calculationResult.amortizationInYears;

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


