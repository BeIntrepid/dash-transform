System.register([], function (_export) {
    'use strict';

    var TransformNode, Pipe, Filter, FunctionFilter;

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [],
        execute: function () {
            TransformNode = (function () {
                function TransformNode(name, filter) {
                    _classCallCheck(this, TransformNode);

                    this.ancestors = [];
                    this.filter = null;
                    this.name = 'unnamed TransformNode';

                    this.name = name;
                    this.filter = filter;
                }

                TransformNode.prototype.extractInputs = function extractInputs(inputs) {
                    var extratedInputs = [];
                    for (var s in inputs) {
                        extratedInputs.push(inputs[s]);
                    }

                    return extratedInputs;
                };

                TransformNode.prototype.addInput = function addInput(ancestor) {
                    this.ancestors.push(ancestor);
                };

                TransformNode.prototype.execute = function execute(inputObject, args) {
                    return this.filter.execute.apply(this.filter, arguments);
                };

                return TransformNode;
            })();

            _export('TransformNode', TransformNode);

            Pipe = (function () {
                function Pipe(name, rootNode) {
                    _classCallCheck(this, Pipe);

                    this.rootNode = [];

                    this.name = name;
                    this.rootNode = rootNode;
                }

                Pipe.prototype.execute = function execute(inputObject, args) {
                    return this.executeNode(this.rootNode, inputObject, args);
                };

                Pipe.prototype.executeAncestors = function executeAncestors(node, inputObject, args) {
                    var executeMethodResults = [];
                    for (var s in node.ancestors) {
                        var ancestorPromise = this.executeNode(node.ancestors[s], inputObject, args);
                        executeMethodResults.push(ancestorPromise);
                    }

                    return Promise.all(executeMethodResults);
                };

                Pipe.prototype.extractInputs = function extractInputs(inputs) {
                    var extratedInputs = [];
                    for (var s in inputs) {
                        extratedInputs.push(inputs[s]);
                    }

                    return extratedInputs;
                };

                Pipe.prototype.executeNode = function executeNode(node, inputObject, args) {
                    var _this = this;

                    var executePromise = new Promise(function (res, rej) {
                        var inputPromise = _this.executeAncestors(node, inputObject, args);

                        inputPromise.then(function (inputs) {
                            var extractedInputs = _this.extractInputs(inputs);
                            var inputForFunction = [inputObject].concat(extractedInputs);

                            var nodeExecutionResult = node.execute.apply(node, inputForFunction);

                            var functionFilterExecutionPromise = Promise.resolve(nodeExecutionResult);

                            functionFilterExecutionPromise.then(function (i) {
                                res(i);
                            });
                        });
                    });

                    return executePromise;
                };

                return Pipe;
            })();

            _export('Pipe', Pipe);

            Filter = (function () {
                function Filter(name) {
                    _classCallCheck(this, Filter);

                    this.inputObject = null;
                    this.ancestors = [];

                    this.name = name;
                }

                Filter.prototype.addInputFilter = function addInputFilter(Filter) {
                    this.ancestors.push(Filter);
                };

                Filter.prototype.execute = function execute(inputObject, args) {
                    var executeMethodResults = [];
                    for (var s in this.ancestors) {
                        var filter = this.ancestors[s];
                        executeMethodResults.push(filter.execute(inputObject, args));
                    }
                    return Promise.all(executeMethodResults);
                };

                return Filter;
            })();

            _export('Filter', Filter);

            FunctionFilter = (function (_Filter) {
                function FunctionFilter(name, toExecute) {
                    _classCallCheck(this, FunctionFilter);

                    _Filter.call(this, name);
                    this.toExecute = toExecute;
                }

                _inherits(FunctionFilter, _Filter);

                FunctionFilter.prototype.extractInputs = function extractInputs(inputs) {
                    var extratedInputs = [];
                    for (var s in inputs) {
                        extratedInputs.push(inputs[s]);
                    }

                    return extratedInputs;
                };

                FunctionFilter.prototype.execute = function execute(inputObject, args) {
                    return Promise.resolve(this.toExecute.apply(null, arguments));
                };

                return FunctionFilter;
            })(Filter);

            _export('FunctionFilter', FunctionFilter);
        }
    };
});