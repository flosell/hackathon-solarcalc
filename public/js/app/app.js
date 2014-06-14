'use strict';

var solarApp = angular.module('solarcap-app', [
  'googlechart'
])

solarApp.controller('SearchCtrl', [
  '$scope',
  function ($scope) {
    $scope.parameter = {
      type: 'house',
      residents: 1
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
      var consumption = [
        0.131, 0.113, 0.090, 0.083,
        0.064, 0.064, 0.071, 0.079,
        0.094, 0.124, 0.188, 0.203, 0.203
      ];


      // 500 grundlast + n*1000


      for(var i = 0; i <= 12; i++){
        $scope.chartObject.data.rows.push({
          "c": [
            {
              "v": (i*2) + ':00'
            },
            {
              "v": consumption[i]
            },
            {
              "v": 1
            }
          ]
        });
      }
    }

    $scope.generateChartDate();

    $scope.setRatingValue = function(n){
      $scope.parameter.residents = n;
    }

    $scope.doSearch = function () {
      search($scope.address)
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
    });



    $scope.$watch("selectedArea",function(data) {
        if (data === undefined) return;

        console.log('DEBUG: ', sunCalculator());
        console.log('updatedMap: ',data);
        var calculator = sunCalculator();
        var sqm = data.selectedArea;
        var state = data.selectedState;
        var KWP = calculator.calculateKWP(sqm);
        var subsidy = calculator.calculateSubsidy(KWP, state, 0);
        console.log('DEBUG: ',subsidy);
    })
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



