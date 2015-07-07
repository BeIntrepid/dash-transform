System.register(['./Filters', './Pipes', './Nodes', './InputResolver'], function (_export) {
    'use strict';

    var filters, Pipe, TransformNode, InputResolver, StreamModel, Stream;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_Filters) {
            filters = _Filters;
        }, function (_Pipes) {
            Pipe = _Pipes.Pipe;
        }, function (_Nodes) {
            TransformNode = _Nodes.TransformNode;
        }, function (_InputResolver) {
            InputResolver = _InputResolver.InputResolver;
        }],
        execute: function () {
            StreamModel = (function () {
                function StreamModel(stream, mappedInputs) {
                    _classCallCheck(this, StreamModel);

                    this.stream = null;
                    this.mappings = {};
                    this.bindedInputChanged = this.inputChanged.bind(this);

                    this.mappedInputs = mappedInputs;
                    this.stream = stream;
                    this.start();
                }

                StreamModel.prototype.start = function start() {
                    this.setObservable(this);
                };

                StreamModel.prototype.stop = function stop() {
                    Object.unobserve(this, this.bindedInputChanged);
                };

                StreamModel.prototype.addMapping = function addMapping(niceName, inputToMap) {
                    this.mappings[niceName] = inputToMap;
                    this[niceName] = inputToMap.value;
                };

                StreamModel.prototype.setObservable = function setObservable(obs) {
                    Object.observe(obs, this.bindedInputChanged);
                };

                StreamModel.prototype.inputChanged = function inputChanged(changes) {
                    var _this = this;

                    changes.forEach(function (change) {
                        if (change.type == 'update') {
                            _this.mappings[change.name].value = _this[change.name];
                        }
                    });

                    if (this.stream.status != 'started') {
                        return;
                    }

                    this.stream.execute();
                };

                return StreamModel;
            })();

            _export('StreamModel', StreamModel);

            Stream = (function () {
                function Stream(pipe) {
                    _classCallCheck(this, Stream);

                    this.busy = false;
                    this.pipe = null;
                    this.mappedInputs = null;
                    this.triggers = {};
                    this.output = {};
                    this.status = 'stopped';
                    this.subscriptions = [];
                    this.bindedInputChanged = this.inputChanged.bind(this);
                    this.subscriptionTimeout = null;
                    this.hasBeenBuilt = false;
                    this.streamModel = null;

                    var wrappedPipe = pipe;
                    if (pipe instanceof TransformNode) {
                        wrappedPipe = new Pipe('StreamGeneratedPipe', pipe);
                    } else if (pipe instanceof filters.Filter) {
                        wrappedPipe = new Pipe('StreamGeneratedPipe', new TransformNode('StreamGeneratedTransformNode', pipe));
                    }

                    this.pipe = wrappedPipe;
                    this.setTriggers(this.triggers);
                }

                Stream.prototype.setTriggers = function setTriggers(newInput) {
                    this.setObservable(newInput, this.triggers);
                    this.triggers = newInput;
                };

                Stream.prototype.setObservable = function setObservable(obs, oldObs) {
                    if (oldObs != null) {
                        Object.unobserve(oldObs, this.bindedInputChanged);
                    }

                    Object.observe(obs, this.bindedInputChanged);
                };

                Stream.prototype.inputChanged = function inputChanged(changes) {
                    if (this.status != 'started') {
                        return;
                    }

                    this.execute();
                };

                Stream.prototype.start = function start(startArgs) {
                    this.status = 'started';

                    if (startArgs != null) {
                        if (startArgs.input != null) {
                            this.setInput(startArgs.input);
                        }

                        if (startArgs.interval != null) {

                            this.execute.bind(this)();

                            this.subscriptionTimeout = setInterval(this.execute.bind(this), startArgs.interval);
                        }
                    }
                };

                Stream.prototype.stop = function stop() {
                    this.status = 'stopped';
                    if (this.subscriptionTimeout != null) {
                        clearInterval(this.subscriptionTimeout);
                    }
                };

                Stream.prototype.onPipeExecuted = function onPipeExecuted(i) {
                    this.output = i;
                    this.subscriptions.forEach(function (f) {
                        f.call(null, i);
                    });
                };

                Stream.prototype.subscribe = function subscribe(subscription) {
                    this.subscriptions.push(subscription);
                };

                Stream.prototype.build = function build() {
                    this.cloneTree();
                    this.makeNodeNamesUnique();
                    var inputs = this.getMapInputs();
                    this.streamModel = new StreamModel(this, inputs);

                    this.hasBeenBuilt = true;
                };

                Stream.prototype.getMapInputs = function getMapInputs() {
                    if (this.mappedInputs == null) {
                        var spec = {};
                        this.pipe.rootNode.mapInputs('', spec);
                        this.mappedInputs = spec;
                    }
                    return this.mappedInputs;
                };

                Stream.prototype.cloneTree = function cloneTree() {
                    this.pipe.rootNode = this.pipe.rootNode.cloneTree();
                };

                Stream.prototype.makeNodeNamesUnique = function makeNodeNamesUnique() {
                    this.pipe.rootNode.makeNodeNamesUnique();
                };

                Stream.prototype.execute = function execute(args) {
                    var _this2 = this;

                    if (!this.hasBeenBuilt) {
                        throw 'Stream hasn\'t been built before executing';
                    }

                    this.busy = true;
                    var streamPromise = new Promise(function (res, rej) {

                        var inputObject = args == null ? {} : args;

                        inputObject.__inputResolver = new InputResolver(_this2.mappedInputs);

                        var executePromise = _this2.pipe.execute(inputObject);

                        executePromise.then(_this2.onPipeExecuted.bind(_this2));
                        executePromise.then(function (i) {
                            _this2.busy = false;
                            res(i);
                        });
                    });

                    return streamPromise;
                };

                Stream.prototype.buildInputSpec = function buildInputSpec() {
                    var spec = {};
                    this.pipe.rootNode.mapInputs('', spec);
                    console.log(JSON.parse(JSON.stringify(spec)));
                    return spec;
                };

                return Stream;
            })();

            _export('Stream', Stream);
        }
    };
});