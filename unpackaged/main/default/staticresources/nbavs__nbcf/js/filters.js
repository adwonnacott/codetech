'use strict';
/* filters */

app.filter('currentDate',['$filter',  function($filter) {
    return function(input, format) {
        return $filter('date')(new Date(), format);
    };
}]);

app.filter('uniqueField', function() {
    return function (arr, field) {
        var o = {}, i, l = arr.length, r = [];
        for(i=0; i<l;i+=1) {
            o[arr[i][field]] = arr[i];
        }
        for(i in o) {
            r.push(o[i]);
        }
        return r;
    };
});

app.filter('unique', function() {
    return function (arr) {
        return arr ? arr.reduce(function(p, c) {
            if (p.indexOf(c) < 0) p.push(c);
            return p;
        }, []) : [];
    };
});

app.filter('toArray', [ function () {
    return function (obj, addKey) {
        if (!angular.isObject(obj)) return obj;
        if ( addKey === false ) {
            return Object.keys(obj).map(function(key) {
                return obj[key];
            });
        } else {
            return Object.keys(obj).map(function (key) {
                var value = obj[key];
                return angular.isObject(value) ?
                    Object.defineProperty(value, '$key', { enumerable: false, value: key}) :
                { $key: key, $value: value };
            });
        }
    };
}]);

app.filter('notInArray', [ '$filter', function($filter) {
    return function (list, arrayFilter, element) {
        if (arrayFilter) {
            return $filter("filter")(list, function (listItem) {
                for (var i = 0; i < arrayFilter.length; i++) {
                    if (arrayFilter[i][element] == listItem[element]) {
                        return false;
                    }
                }
                return true;
            });
        }
    }
}]);


app.filter('inArray', [ '$filter', function($filter) {
    return function (list, arrayFilter, element) {
        if (arrayFilter) {
            return $filter("filter")(list, function (listItem) {
                for (var i = 0; i < arrayFilter.length; i++) {
                    if (listItem[element] == arrayFilter[i][element] ) {
                        return true;
                    }
                }
                return false;
            });
        }
    }
}]);

app.filter('notOwnObject', [ '$filter',  'VISUALFORCE', function($filter, VISUALFORCE) {
    var underscorePrefix = VISUALFORCE.hasOwnProperty('namespacePrefix') ? VISUALFORCE.namespacePrefix.replace('.','__') : '';
    return function (array) {
        return $filter("filter")(array, function (item) {
            if (underscorePrefix != '' &&  item.name.indexOf(underscorePrefix) == 0 ) {
                return false;
            }
        return true;
        });
    }
}]);

app.filter('selectPublicNumbers', [ '$filter', function($filter) {
    return function (array, arrayFilter) {
        if (array && arrayFilter) {
            angular.forEach(arrayFilter, function(valueFilter, keyFilter) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i].Number__c == valueFilter.variables.publicNumber) {
                        array[i].selected = true;
                        if (array[i].CallFlow__r == null) {
                            array[i].CallFlow__r = {"Name": null};
                        }
                        array[i].CallFlow__r.Name = 'current Policy';
                        break;
                    }
                }
            }, null);
            return array;
        }
    }
}]);

app.filter('disableOtherPublicNumbersAndDDI', [ '$filter', function($filter) {
    return function (array, arrayFilter, thisCallFlowId) {
        if (array && arrayFilter) {
            //disable numbers from other nodes
            for (var k = 0; k < arrayFilter.length; k++) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i].Number__c == arrayFilter[k].variables.publicNumber) {
                        array[i].disabled = true;
                        if (array[i].CallFlow__r == null) {
                            array[i].CallFlow__r = {"Name": null};
                        }
                        array[i].CallFlow__r.Name = 'current Policy';
                        break;
                    }
                }
            };

            //disable other CallFlows public Numbers
            //disable DDI numbers
            for (var i = 0; i < array.length; i++) {
                if (array[i].CallFlow__c != null) {
                    if (array[i].CallFlow__c != thisCallFlowId) {
                        array[i].disabled = true;
                    } else {
                        array[i].CallFlow__r.Name = 'current Policy';
                    }
                }
                if (array[i].DDI_Number__c == true) {
                    array[i].disabled = true;
                }
            }
            return array;
        }
    }
}]);