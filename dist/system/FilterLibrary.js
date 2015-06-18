System.register(['linq-es6'], function (_export) {
    'use strict';

    var Enumerable, FilterLibrary;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_linqEs6) {
            Enumerable = _linqEs6['default'];
        }],
        execute: function () {
            FilterLibrary = (function () {
                function FilterLibrary() {
                    _classCallCheck(this, FilterLibrary);

                    this.filters = [];
                }

                FilterLibrary.prototype.registerFilter = function registerFilter(filter) {
                    this.filters.push(filter);
                };

                FilterLibrary.prototype.getFilter = function getFilter(filterName) {
                    return Enumerable(this.filters).where(function (f) {
                        f.name == filterName;
                    }).single();
                };

                return FilterLibrary;
            })();

            _export('FilterLibrary', FilterLibrary);
        }
    };
});