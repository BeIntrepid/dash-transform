System.register(['./TransformLibrary', './Filters', './TransformConfig', './Pipes', 'linq-es6'], function (_export) {
    'use strict';

    var TransformLibrary, FunctionFilter, Filter, TransformConfig, Pipe, Enumerable, TransformNode;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_TransformLibrary) {
            TransformLibrary = _TransformLibrary.TransformLibrary;
        }, function (_Filters) {
            FunctionFilter = _Filters.FunctionFilter;
            Filter = _Filters.Filter;
        }, function (_TransformConfig) {
            TransformConfig = _TransformConfig.TransformConfig;
        }, function (_Pipes) {
            Pipe = _Pipes.Pipe;
        }, function (_linqEs6) {
            Enumerable = _linqEs6['default'];
        }],
        execute: function () {
            TransformNode = (function () {
                function TransformNode(name, filter) {
                    _classCallCheck(this, TransformNode);

                    this.ancestors = [];
                    this.pipe = null;
                    this.name = 'unnamed TransformNode';

                    this.name = name;
                    this.pipe = filter;
                }

                TransformNode.prototype.addInput = function addInput(ancestor) {
                    this.ancestors.push(ancestor);
                };

                TransformNode.prototype.getNodeName = function getNodeName() {
                    return this.name != null ? this.name : this.pipe.name;
                };

                TransformNode.prototype.getName = function getName() {
                    return this.pipe.name;
                };

                TransformNode.prototype.mapInputs = function mapInputs(scope, inputMapping) {
                    var _this = this;

                    var allTopLevelNodes = [];
                    this.addSelfAndAncestorsToArray(allTopLevelNodes, this);

                    allTopLevelNodes.forEach(function (n) {

                        if (n.pipe instanceof Filter) {
                            var _ret = (function () {
                                var nodeInputSpec = n.pipe.getInputSpec(scope, inputMapping);
                                if (nodeInputSpec == null) {
                                    return {
                                        v: undefined
                                    };
                                }
                                nodeInputSpec.forEach(function (nodeInput) {

                                    if (inputMapping[_this.buildInputName(scope, n.getNodeName())] == null) {
                                        inputMapping[_this.buildInputName(scope, n.getNodeName())] = { inputSpec: nodeInputSpec,
                                            nodeRef: n,
                                            inputs: [],
                                            forInput: function forInput(name) {
                                                return Enumerable(this.inputs).single(function (i) {
                                                    return i.name == name;
                                                });
                                            }
                                        };
                                    }

                                    inputMapping[_this.buildInputName(scope, n.getNodeName())].inputs.push({ name: nodeInput.name, value: null });
                                });
                            })();

                            if (typeof _ret === 'object') return _ret.v;
                        } else if (n.pipe instanceof Pipe) {
                            n.pipe.rootNode.mapInputs(_this.buildInputName(scope, n.getNodeName()), inputMapping);
                        }
                    });
                };

                TransformNode.prototype.buildInputName = function buildInputName(scopeName, inputName) {
                    return (scopeName.length > 0 ? scopeName + '_' : '') + inputName;
                };

                TransformNode.prototype.incrementNodeName = function incrementNodeName(currentNames, nodeName) {
                    var i = 1;
                    while (true) {
                        var incrementedScopeName = nodeName + i;
                        if (currentNames[incrementedScopeName] == null) {
                            return incrementedScopeName;
                        }

                        i = i + 1;
                    }
                };

                TransformNode.prototype.addSelfAndAncestorsToArray = function addSelfAndAncestorsToArray(ancestorArray, node) {
                    var _this2 = this;

                    ancestorArray.push(node);

                    node.ancestors.forEach(function (n) {
                        _this2.addSelfAndAncestorsToArray(ancestorArray, n);
                    });
                };

                TransformNode.prototype.cloneTree = function cloneTree() {

                    var newName = this.name == '' ? this.pipe.name : this.name;

                    var newNode = new TransformNode(newName, this.pipe);

                    if (this.pipe instanceof Pipe) {
                        this.pipe.rootNode = this.pipe.rootNode.cloneTree();
                    }

                    this.ancestors.forEach(function (n) {
                        newNode.addInput(n.cloneTree());
                    });

                    return newNode;
                };

                TransformNode.prototype.makeNodeNamesUnique = function makeNodeNamesUnique() {
                    var _this3 = this;

                    var allTopLevelNodes = [];
                    var currentLevelNodeNames = {};
                    this.addSelfAndAncestorsToArray(allTopLevelNodes, this);

                    allTopLevelNodes.forEach(function (n) {

                        var nodeName = n.getNodeName();
                        if (currentLevelNodeNames[nodeName] != null) {
                            nodeName = _this3.incrementNodeName(currentLevelNodeNames, nodeName);
                            n.name = nodeName;
                        }

                        currentLevelNodeNames[nodeName] = 1;

                        if (n.pipe instanceof Pipe) {
                            n.pipe.rootNode.makeNodeNamesUnique();
                        }
                    });
                };

                TransformNode.prototype.execute = function execute(inputObject, args) {

                    var inputOverrides = inputObject.__inputResolver.getInputOverrides(this);

                    if (inputOverrides != null) {
                        for (var i = 0; i < inputOverrides.inputs.length; i++) {

                            var inputOverride = inputOverrides.inputs[i];
                            if (inputOverride.value != null) {
                                var value = inputOverride.value;
                                if (inputOverride.value instanceof Function) {
                                    value = inputOverride.value();
                                } else {
                                    value = inputOverride.value;
                                }

                                args[i] = inputOverride.value;
                            }
                        }
                    }

                    var inputArgs = [inputObject].concat(args);
                    return this.pipe.execute.apply(this.pipe, inputArgs);
                };

                return TransformNode;
            })();

            _export('TransformNode', TransformNode);
        }
    };
});