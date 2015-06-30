System.register(['./Filters', './Pipes', './Nodes'], function (_export) {
    'use strict';

    var filters, Pipe, TransformNode, Stream;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_Filters) {
            filters = _Filters;
        }, function (_Pipes) {
            Pipe = _Pipes.Pipe;
        }, function (_Nodes) {
            TransformNode = _Nodes.TransformNode;
        }],
        execute: function () {
            Stream = (function () {
                function Stream(pipe) {
                    _classCallCheck(this, Stream);

                    this.busy = false;
                    this.pipe = null;
                    this.input = {};
                    this.output = {};
                    this.status = 'stopped';
                    this.subscriptions = [];
                    this.bindedInputChanged = this.inputChanged.bind(this);
                    this.subscriptionTimeout = null;

                    var wrappedPipe = undefined;
                    if (pipe instanceof TransformNode) {
                        wrappedPipe = pipe;
                    } else if (pipe instanceof filters.Filter || pipe instanceof Pipe) {
                        wrappedPipe = new TransformNode('', pipe);
                    }

                    this.pipe = wrappedPipe;
                    this.setInput(this.input);
                }

                Stream.prototype.setInput = function setInput(newInput) {
                    this.setObservable(newInput, this.input);
                    this.input = newInput;
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

                Stream.prototype.execute = function execute(args) {
                    var _this = this;

                    this.busy = true;
                    var streamPromise = new Promise(function (res, rej) {
                        var executePromise = _this.pipe.execute(args == null ? _this.input : args);
                        executePromise.then(_this.onPipeExecuted.bind(_this));
                        executePromise.then(function (i) {
                            _this.busy = false;
                            res(i);
                        });
                    });

                    return streamPromise;
                };

                Stream.prototype.buildInputSpec = function buildInputSpec() {
                    return this.pipe.buildInputSpec();
                };

                return Stream;
            })();

            _export('Stream', Stream);
        }
    };
});