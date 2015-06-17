System.register(['./steps'], function (_export) {
    'use strict';

    var steps, Pipe;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_steps) {
            steps = _steps;
        }],
        execute: function () {
            Pipe = (function () {
                function Pipe() {
                    _classCallCheck(this, Pipe);

                    this.steps = [];
                }

                Pipe.prototype.addFunctionStep = function addFunctionStep(name, func) {
                    var s = new steps.FunctionStep(name, func);
                    this.steps.push(s);
                };

                Pipe.prototype.call = function call() {
                    var _this = this;

                    var input = {};
                    var callPromise = new Promise(function (res, rej) {

                        var startNextStep = function startNextStep(step, outputFromLastStep) {

                            var nextStepIndex = _this.steps.indexOf(step) + 1;
                            if (nextStepIndex < _this.steps.length) {
                                var nextStep = _this.steps[nextStepIndex];
                                nextStep.execute(outputFromLastStep).then(function (output) {
                                    startNextStep(nextStep, output);
                                });
                            } else {
                                return res(outputFromLastStep);
                            }
                        };

                        _this.steps[0].execute().then(function (output) {
                            startNextStep(_this.steps[0], output);
                        });
                    });

                    return callPromise;
                };

                return Pipe;
            })();

            _export('Pipe', Pipe);
        }
    };
});