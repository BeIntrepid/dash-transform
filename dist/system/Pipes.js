System.register(['./TransformLibrary', './Filters', './Nodes', './TransformConfig', './InputSpec'], function (_export) {
    'use strict';

    var TransformLibrary, FunctionFilter, Filter, TransformNode, TransformConfig, InputSpec, Pipe;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_TransformLibrary) {
            TransformLibrary = _TransformLibrary.TransformLibrary;
        }, function (_Filters) {
            FunctionFilter = _Filters.FunctionFilter;
            Filter = _Filters.Filter;
        }, function (_Nodes) {
            TransformNode = _Nodes.TransformNode;
        }, function (_TransformConfig) {
            TransformConfig = _TransformConfig.TransformConfig;
        }, function (_InputSpec) {
            InputSpec = _InputSpec.InputSpec;
        }],
        execute: function () {
            Pipe = (function () {
                function Pipe(name, rootNode) {
                    _classCallCheck(this, Pipe);

                    this.rootNode = [];

                    this.name = name;
                    this.rootNode = rootNode;
                }

                Pipe.prototype.getName = function getName() {
                    return this.name;
                };

                Pipe.prototype.add = function add(filterObj) {

                    var n = null;
                    if (filterObj instanceof Function) {
                        n = new TransformNode(null, new FunctionFilter('Implicit Pipe', filterObj));
                    } else if (filterObj instanceof TransformNode) {
                        n = filterObj;
                    } else if (filterObj instanceof Filter) {
                        n = new TransformNode(null, filterObj);
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
                    if (TransformConfig.enableDebugMessages) console.log('Executing pipe ' + this.name);
                    return this.executeNode(this.rootNode, inputObject, args);
                };

                Pipe.prototype.buildNodeInputSpec = function buildNodeInputSpec(parentSpec, node, f) {
                    var _this = this;

                    if (node.ancestors != null) {
                        node.ancestors.forEach(function (a) {
                            _this.traverseAncestors(node, a);
                        });

                        f(node);
                    }
                };

                Pipe.prototype.flattenPipeSpec = function flattenPipeSpec(spec) {

                    return spec;
                };

                Pipe.prototype.buildInputSpec = function buildInputSpec(parentSpec, node) {
                    var _this2 = this;

                    if (TransformConfig.enableDebugMessages) console.log('Building InputSpec for ' + this.name);

                    if (node == null) {
                        node = this.rootNode;
                    }

                    var nodeSpec = new InputSpec(node.pipe.name, [], []);

                    node.ancestors.forEach(function (a) {
                        nodeSpec.ancestors.push(_this2.buildInputSpec(nodeSpec, a));
                    });

                    var inputSpec = node.buildInputSpec(nodeSpec, node);

                    inputSpec.inputs.forEach(function (inSpec) {
                        nodeSpec.inputs.push(inSpec);
                    });

                    return nodeSpec;
                };

                Pipe.prototype.executeAncestors = function executeAncestors(node, inputObject, args) {
                    var _this3 = this;

                    if (TransformConfig.enableDebugMessages) console.log('Executing ancestors for ' + this.name);

                    var executeMethodResults = [];

                    if (node.ancestors != null) {

                        node.ancestors.forEach(function (a) {
                            var ancestorPromise = _this3.executeNode(a, inputObject, args);
                            executeMethodResults.push(ancestorPromise);
                        });
                    }

                    if (TransformConfig.enableDebugMessages) console.log('Finished ancestors for ' + this.name);

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
                    var _this4 = this;

                    var executePromise = new Promise(function (res, rej) {
                        var inputPromise = _this4.executeAncestors(node, inputObject, args);

                        inputPromise.then(function (inputs) {
                            if (inputs.length == 0 && args != null) {
                                inputs.push(args);
                            }

                            var extractedInputs = _this4.extractInputs(inputs);
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