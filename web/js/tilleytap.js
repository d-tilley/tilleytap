/*global angular*/
(function () {
    'use strict';
    
    function Randomizer($scope, $window) {
        //var COLOR_ARRAY = ['#6ed3cf', '#008f95', '#9068be'];
        var COLOR_ARRAY = ['#008f95', '#9068be'];
            
        $scope.init = function () {
            $scope.backgroundColor = '#f53240';
            $scope.stripes = $scope.getStripes();
            
            $scope.render();
            
            angular.element($window).bind('resize', function () {
                $scope.render();
                $scope.$digest();
            });
            
            
            $scope.userAgent = $window.navigator.userAgent;
            console.log('user agent: ' + $scope.userAgent);
        };
        
        $scope.render = function () {
            var width = $(document).width(),
                canvas = document.getElementById('bgCanvas');
            
            canvas.width = width;
    	    canvas.height = 50;
    	    
    	    canvas.patternizer({
                'stripes': $scope.stripes,
                'bg': $scope.backgroundColor
            });
        };

        $scope.getStripes = function () {
            var width = $(document).width(),
                slim = width <= 720,
                stripes = new Array();
                
            while (COLOR_ARRAY.length > 0) {
                var stripe = {
                    'color': $scope.getRandomColor(),
                    'rotation': $scope.getRandomPosition(360),
                    'opacity': 50,
                    'mode': 'plaid',
                    'width': $scope.getRandomPosition(200),
                    'gap': $scope.getRandomPosition(200),
                    'offset': $scope.getRandomPosition(400)
                };
                
                stripes.push(stripe);
            }
            
            return stripes; 
        };
        
        $scope.getRandomColor = function () {
            var pos = $scope.getRandomPosition(COLOR_ARRAY.length),
                color = COLOR_ARRAY[pos];
            
            COLOR_ARRAY.splice(pos, 1);
            
            return color;
        };
        
        $scope.getRandomPosition = function (size) {
            return Math.floor(Math.random() * size);
        };
        
        $scope.init();
    }
    
    function OnTap($scope, $http) {
        var PINT_OZ = 16,
            CORNY_KEG_OZ = 640;
        
        $scope.init = function () {
            $http({
                url: "../php/getOnTap.php",
                method: "GET",
                params: {}
            }).then(function (response) {
                $scope.onTap = response.data;
                $scope.setPints($scope.onTap.tap.weight);
            }, function (response) {
                console.log("error yo");
            });
        }
        
        $scope.setPints = function (ounces) {
            var good = '#3c763d',
                info = '#31708f',
                warning = '#8a6d3b',
                danger = '#a94442',
                barColor;
            
            if (ounces < 0) {
                ounces = 0.01;
            }
            
            $scope.pints = Array(Math.ceil(ounces / PINT_OZ));
            $scope.percent = Math.ceil(ounces / CORNY_KEG_OZ * 100);
            
            if ($scope.percent >= 80) {
                barColor = good;
            } else if ($scope.percent > 35) {
                barColor = info;
            } else if ($scope.percent > 25) {
                barColor = warning;
            } else {
                barColor = danger;
            }
            
            angular.element('#percent-circle').circliful({
                animationStep: 5,
                foregroundBorderWidth: 15,
                foregroundColor: barColor,
                backgroundBorderWidth: 15,
                backgroundColor: '#f5f5f5',
                percent: $scope.percent,
                fontColor: '#333',
                icon: 'f0a0',
                iconSize: '40',
                iconPosition: 'middle',
            });
            
        };
        
        $scope.drawGraph = function () {
            angular.element('#percent-circle').circliful({
                animationStep: 5,
                foregroundBorderWidth: 15,
                foregroundColor: barColor,
                backgroundBorderWidth: 15,
                backgroundColor: '#f5f5f5',
                percent: $scope.percent,
                fontColor: '#333',
                icon: 'f0a0',
                iconSize: '40',
                iconPosition: 'middle',
            });
        };
        
        $scope.init();
    }
    
    function ElementLoad($parse) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                var fn = $parse(attrs.elementLoad);
                elem.on('load', function (event) {
                    scope.$apply(function() {
                        fn(scope, { $event: event });
                    });
                });
            }
        };
    }
    
    Randomizer.$inject = ['$scope', '$window'];
    OnTap.$inject = ['$scope', '$http'];
    ElementLoad.$inject = ['$parse'];
    
    angular.module('tilleyTap', [])
        .controller('Randomizer', Randomizer)
        .controller('OnTap', OnTap)
        .directive('elementLoad', ElementLoad);
}());