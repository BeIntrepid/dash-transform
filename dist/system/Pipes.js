System.register(['./TransformLibrary', './Filters', './Nodes', './TransformConfig'], function (_export) {
    'use strict';

    var TransformLibrary, FunctionFilter, TransformNode, TransformConfig, Pipe;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_TransformLibrary) {
            TransformLibrary = _TransformLibrary.TransformLibrary;
        }, function (_Filters) {
            FunctionFilter = _Filters.FunctionFilter;
        }, function (_Nodes) {
            TransformNode = _Nodes.TransformNode;
        }, function (_TransformConfig) {
            TransformConfig = _TransformConfig.TransformConfig;
        }],
        execute: function () {
            Pipe = (function () {
                function Pipe(name, rootNode) {
                    _classCallCheck(this, Pipe);

                    this.rootNode = [];

                    this.name = name;
                    this.rootNode = rootNode;
                }

                Pipe.prototype.add = function add(filterObj) {

                    var n = null;
                    if (filterObj instanceof Function) {
                        n = new TransformNode('NoName', new FunctionFilter('Implicit Pipe', filterObj));
                    } else if (filterObj instanceof TransformNode) {
                        n = filterObj;
                    } else if (typeof filterObj == 'string') {
                        var tl = new TransformLibrary();
                        n = tl.getFilterWrapped(filterObj);
                    }

                    if (this.rootNode != null) {
                        var rn = this.rootNode;
                        this.rootNode = n;
                        this.rootNode.addInput(rn);
                    } else {
                        this.rootNode = n;
                    }

                    return this;
                };

                Pipe.prototype.execute = function execute(inputObject, args) {
                    if (TransformConfig.enableDebugMessages) console.log('Executing ' + this.name);
                    return this.executeNode(this.rootNode, inputObject, args);
                };

                Pipe.prototype.executeAncestors = function executeAncestors(node, inputObject, args) {
                    var _this = this;

                    var executeMethodResults = [];

                    if (node.ancestors != null) {

                        node.ancestors.forEach(function (a) {
                            var ancestorPromise = _this.executeNode(a, inputObject, args);
                            executeMethodResults.push(ancestorPromise);
                        });
                    }
                    return Promise.all(executeMethodResults);
                };

                Pipe.prototype.extractInputs = function extractInputs(inputs) {
                    var extratedInputs = [];
                    inputs.forEach(function (s) {
                        extratedInputs.push(s);
                    });

                    return extratedInputs;
                };

                Pipe.prototype.executeNode = function executeNode(node, inputObject, args) {
                    var _this2 = this;

                    var executePromise = new Promise(function (res, rej) {
                        var inputPromise = _this2.executeAncestors(node, inputObject, args);

                        inputPromise.then(function (inputs) {
                            if (inputs.length == 0 && args != null) {
                                inputs.push(args);
                            }

                            var extractedInputs = _this2.extractInputs(inputs);
                            var inputForFunction = [inputObject].concat(extractedInputs);

                            var nodeExecutionResult = node instanceof Pipe ? node.execute.apply(node, inputForFunction) : nodeExecutionResult = node.execute(inputObject, extractedInputs);

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
        }
    };
});