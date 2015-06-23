System.register([], function (_export) {
    'use strict';

    var TransformNode, Pipe;

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

                TransformNode.prototype.addInput = function addInput(ancestor) {
                    this.ancestors.push(ancestor);
                };

                TransformNode.prototype.execute = function execute(inputObject, args) {
                    console.log('Executing ' + this.filter.name);
                    return this.filter.execute.apply(this.filter, [inputObject].concat(args));
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
                    console.log('Executing ' + this.name);
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

                            var nodeExecutionResult = null;

                            if (node instanceof Pipe) {
                                nodeExecutionResult = node.execute.apply(node, inputForFunction);
                            } else {
                                nodeExecutionResult = node.execute(inputObject, extractedInputs);
                            }

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