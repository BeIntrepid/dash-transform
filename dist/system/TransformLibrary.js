System.register(['linq-es6', './Nodes'], function (_export) {
    'use strict';

    var Enumerable, TransformNode, TransformLibrary;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_linqEs6) {
            Enumerable = _linqEs6['default'];
        }, function (_Nodes) {
            TransformNode = _Nodes.TransformNode;
        }],
        execute: function () {
            TransformLibrary = (function () {
                function TransformLibrary() {
                    _classCallCheck(this, TransformLibrary);
                }

                TransformLibrary.prototype.registerFilter = function registerFilter(filter) {
                    TransformLibrary.filters.push(filter);
                    return filter;
                };

                TransformLibrary.prototype.getFilter = function getFilter(filterName) {
                    return Enumerable(TransformLibrary.filters).where(function (f) {
                        f.name == filterName;
                    }).single();
                };

                TransformLibrary.prototype.getFilterWrapped = function getFilterWrapped(filterName) {
                    return new TransformNode('', Enumerable(TransformLibrary.filters).where(function (f) {
                        return f.name == filterName;
                    }).single());
                };

                TransformLibrary.prototype.registerPipe = function registerPipe(pipe) {
                    TransformLibrary.pipes.push(pipe);
                };

                TransformLibrary.prototype.getPipe = function getPipe(pipeName) {
                    return Enumerable(TransformLibrary.pipes).where(function (f) {
                        f.name == pipeName;
                    }).single();
                };

                TransformLibrary.prototype.getPipeWrapped = function getPipeWrapped(pipeName) {
                    return new TransformNode('', Enumerable(TransformLibrary.pipes).where(function (f) {
                        return f.name == pipeName;
                    }).single());
                };

                _createClass(TransformLibrary, null, [{
                    key: 'filters',
                    value: [],
                    enumerable: true
                }, {
                    key: 'pipes',
                    value: [],
                    enumerable: true
                }]);

                return TransformLibrary;
            })();

            _export('TransformLibrary', TransformLibrary);
        }
    };
});