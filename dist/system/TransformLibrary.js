System.register(['linq-es6', './Pipes'], function (_export) {
    'use strict';

    var Enumerable, TransformNode, TransformLibrary;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_linqEs6) {
            Enumerable = _linqEs6['default'];
        }, function (_Pipes) {
            TransformNode = _Pipes.TransformNode;
        }],
        execute: function () {
            TransformLibrary = (function () {
                function TransformLibrary() {
                    _classCallCheck(this, TransformLibrary);

                    this.filters = [];
                }

                TransformLibrary.prototype.registerFilter = function registerFilter(filter) {
                    this.filters.push(filter);
                };

                TransformLibrary.prototype.getFilter = function getFilter(filterName) {
                    return Enumerable(this.filters).where(function (f) {
                        f.name == filterName;
                    }).single();
                };

                TransformLibrary.prototype.getFilterWrapped = function getFilterWrapped(filterName) {
                    return new TransformNode('', Enumerable(this.filters).where(function (f) {
                        return f.name == filterName;
                    }).single());
                };

                return TransformLibrary;
            })();

            _export('TransformLibrary', TransformLibrary);
        }
    };
});