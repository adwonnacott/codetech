'use strict';
/* directives */



app.directive("contenteditable", function() {
    return {
        restrict: "A",
        require: "ngModel",
        link: function(scope, element, attrs, ngModel) {

            function read() {

                var oldhtml = element.html();
                var html = oldhtml.replace(/&lt;/, '<');
                html = html.replace(/&gt;/, '>');
                html = html.replace(/<span\ style=\"color:\w+\">(.*?)<\/span>/g, "$1");

                html = html.replace('yellow', '<span style="color:yellow">yellow</span>');
                html = html.replace('green', '<span style="color:green">green</span>');
                html = html.replace('purple', '<span style="color:purple">purple</span>');
                html = html.replace('blue', '<span style="color:yellow">blue</span>');
                element.html(html || "");
                ngModel.$setViewValue(html);
            }

            ngModel.$render = function() {
                element.html(ngModel.$viewValue || "");
            };

            element.bind("blur keyup change", function() {
                scope.$apply(read);
            });
        }
    };
});

app.directive('svgLink', ['VISUALFORCE', function(VISUALFORCE) {
    return {
        link: function(scope, element, attrs) {
            var path = ((VISUALFORCE && VISUALFORCE.resource_slds) || '') + '/assets/icons/'+(attrs.s || 'utility')+'-sprite/svg/symbols.svg#'+attrs.i;
            attrs.$set('xlink:href',path);
        }
    }
}]);


app.directive('inputToArray', [ function () {
    return {
        restrict: 'AE',
        templateUrl: '/partials/InputToArray.html',
        replace: true,
        scope: {
            value: "=",
            separator: "@",
            label: "@",
            name: "@",
            index: "=",
            required: "=",
            macro: "=",
            "null": "="
        },
        //transclude: false,
        controller: 'InputToArrayController',
        require: '^form',
        link: function (scope, elem, attr, ctrl) {
            scope.form = ctrl;
        }
    }
}]);

app.directive('hoursArray', [ function () {
    return {
        restrict: 'AE',
        templateUrl: '/partials/HoursArray.html',
        replace: true,
        scope: {
            hours: "=",
        },
        //transclude: false,
        controller: 'HoursArrayController',
        link: function (scope, elem, attr, ctrl) {
        }
    }
}]);

app.directive('weekDays', [ function () {
    return {
        restrict: 'AE',
        templateUrl: '/partials/WeekDays.html',
        replace: true,
        scope: {
            days: "=",
        },
        //transclude: false,
        controller: 'WeekDaysController',
        link: function (scope, elem, attr, ctrl) {
        }
    }
}]);

app.directive('resetDays', [ function () {
    return {
        restrict: 'AE',
        templateUrl: '/partials/WeekDays.html',
        replace: true,
        scope: {
            days: "=",
        },
        //transclude: false,
        controller: 'ResetDaysController',
        link: function (scope, elem, attr, ctrl) {
        }
    }
}]);



app.directive('clickOutside', function($document, $parse, $timeout) {
    return {
        restrict: 'A',
        link: function($scope, elem, attr) {
            // postpone linking to next digest to allow for unique id generation
            $timeout(function() {
                var classList = (attr.outsideIfNot !== undefined) ? attr.outsideIfNot.split(/[ ,]+/) : [],
                    fn;

                // add the elements id so it is not counted in the click listening
                if (attr.id !== undefined) {
                    classList.push(attr.id);
                }

                function eventHandler(e) {
                    var i,
                        element,
                        r,
                        id,
                        classNames,
                        l;

                    // check if our element already hidden and abort if so
                    if (angular.element(elem).hasClass("ng-hide")) {
                        return;
                    }

                    // if there is no click target, no point going on
                    if (!e || !e.target) {
                        return;
                    }

                    // loop through the available elements, looking for classes in the class list that might match and so will eat
                    for (element = e.target; element; element = element.parentNode) {
                        id = element.id,
                            classNames = element.className,
                            l = classList.length;

                        // Unwrap SVGAnimatedString classes
                        if (classNames && classNames.baseVal !== undefined) {
                            classNames = classNames.baseVal;
                        }

                        // if there are no class names on the element clicked, skip the check
                        if (classNames || id) {

                            // console.log('classNames: ' + classNames);

                            // loop through the elements id's and classnames looking for exceptions
                            for (i = 0; i < l; i++) {
                                //prepare regex for class word matching
                                r = new RegExp('\\b' + classList[i] + '\\b');

                                //  console.log('classList: ' + classList[i]);

                                // check for exact matches on id's or classes, but only if they exist in the first place
                                if ((id !== undefined && id === classList[i]) || (classNames && r.test(classNames))) {
                                    // now let's exit out as it is an element that has been defined as being ignored for clicking outside
                                    return;
                                }
                            }
                        }
                    }

                    // if we have got this far, then we are good to go with processing the command passed in via the click-outside attribute
                    $scope.$apply(function() {
                        fn = $parse(attr['clickOutside']);
                        fn($scope);
                    });
                }

                // if the devices has a touchscreen, listen for this event
                if (_hasTouch()) {
                    $document.on('touchstart', eventHandler);
                }

                // still listen for the click event even if there is touch to cater for touchscreen laptops
                $document.on('click', eventHandler);

                // when the scope is destroyed, clean up the documents event handlers as we don't want it hanging around
                $scope.$on('$destroy', function() {
                    if (_hasTouch()) {
                        $document.off('touchstart', eventHandler);
                    }

                    $document.off('click', eventHandler);
                });

                // private function to attempt to figure out if we are on a touch device
                function _hasTouch() {
                    // works on most browsers, IE10/11 and Surface
                    return 'ontouchstart' in window || navigator.maxTouchPoints;
                };
            });
        }
    };
});


app.directive('resultSetName', function (uppercaseFilter, $parse) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            var capitalize = function (inputValue) {
                if (inputValue != null) {
                    var capitalized = inputValue.charAt(0).toUpperCase() + inputValue.substring(1);
                    //replace first char if digit
                    capitalized = capitalized.replace(/^\d/, "")
                    //replace non alphanum chars
                    capitalized = capitalized.replace(/[\W_]+/g,"");
                    if (capitalized !== inputValue) {
                        modelCtrl.$setViewValue(capitalized);
                        modelCtrl.$render();
                    }
                    return capitalized;
                }
            };
            var model = $parse(attrs.ngModel);
            modelCtrl.$parsers.push(capitalize);
            capitalize(model(scope));
        }
    };
});


app.directive('macro', [function() {
    return {
        link: function(scope, element, attrs) {
            /*
            $rootScope.$on('add', function(e, val) {
                var domElement = element[0];

                if (document.selection) {
                    domElement.focus();
                    var sel = document.selection.createRange();
                    sel.text = val;
                    domElement.focus();
                } else if (domElement.selectionStart || domElement.selectionStart === 0) {
                    var startPos = domElement.selectionStart;
                    var endPos = domElement.selectionEnd;
                    var scrollTop = domElement.scrollTop;
                    domElement.value = domElement.value.substring(0, startPos) + val + domElement.value.substring(endPos, domElement.value.length);
                    domElement.focus();
                    domElement.selectionStart = startPos + val.length;
                    domElement.selectionEnd = startPos + val.length;
                    domElement.scrollTop = scrollTop;
                } else {
                    domElement.value += val;
                    domElement.focus();
                }

            });
            */
        },
        controller: function($scope, $element, $attrs) {

            $scope.insertText = function(text) {
                var input = $element;
                if (input == undefined) { return; }
                var scrollPos = input.scrollTop;
                var pos = 0;
                var browser = ((input.selectionStart || input.selectionStart == "0") ?
                    "ff" : (document.selection ? "ie" : false ) );
                if (browser == "ie") {
                    input.focus();
                    var range = document.selection.createRange();
                    range.moveStart ("character", -input.value.length);
                    pos = range.text.length;
                }
                else if (browser == "ff") { pos = input.selectionStart };

                var front = (input.value).substring(0, pos);
                var back = (input.value).substring(pos, input.value.length);
                input.value = front+text+back;
                pos = pos + text.length;
                if (browser == "ie") {
                    input.focus();
                    var range = document.selection.createRange();
                    range.moveStart ("character", -input.value.length);
                    range.moveStart ("character", pos);
                    range.moveEnd ("character", 0);
                    range.select();
                }
                else if (browser == "ff") {
                    input.selectionStart = pos;
                    input.selectionEnd = pos;
                    input.focus();
                }
                input.scrollTop = scrollPos;
                angular.element(input).trigger('input');
            }
        }
    }
}])

app.directive('stringToInteger', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function(value) {
                return parseInt(value);
            });
            ngModel.$formatters.push(function(value) {
                return parseInt(value);
            });
        }
    };
});
