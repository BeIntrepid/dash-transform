System.register([], function (_export) {
    "use strict";

    var Step, FunctionStep;

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    return {
        setters: [],
        execute: function () {
            Step = (function () {
                function Step(name) {
                    _classCallCheck(this, Step);

                    this.ancestors = [];

                    this.name = name;
                }

                Step.prototype.addInputStep = function addInputStep(step) {
                    this.ancestors.push(step);
                };

                Step.prototype.execute = function execute() {
                    var executeMethodResults = [];
                    for (var s in this.ancestors) {
                        var step = this.ancestors[s];
                        executeMethodResults.push(step.execute());
                    }
                    return Promise.all(executeMethodResults);
                };

                return Step;
            })();

            _export("Step", Step);

            FunctionStep = (function (_Step) {
                function FunctionStep(name, toExecute) {
                    _classCallCheck(this, FunctionStep);

                    _Step.call(this, name);
                    this.toExecute = toExecute;
                }

                _inherits(FunctionStep, _Step);

                FunctionStep.prototype.execute = function execute(i) {
                    var _this = this;

                    var executePromise = new Promise(function (res, rej) {
                        var inputPromise = _Step.prototype.execute.call(_this, i);
                        inputPromise.then(function (inputs) {

                            Promise.resolve(_this.toExecute.apply(null, inputs)).then(function (i) {
                                res(i);
                            });
                        });
                    });

                    return executePromise;
                };

                return FunctionStep;
            })(Step);

            _export("FunctionStep", FunctionStep);
        }
    };
});