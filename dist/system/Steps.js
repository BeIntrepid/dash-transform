System.register([], function (_export) {
    "use strict";

    var Executeable, FunctionStep;

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    return {
        setters: [],
        execute: function () {
            Executeable = (function () {
                function Executeable(name) {
                    _classCallCheck(this, Executeable);

                    this.ancestors = [];

                    this.name = name;
                }

                Executeable.prototype.addInputStep = function addInputStep(step) {
                    this.ancestors.push(step);
                };

                Executeable.prototype.execute = function execute(input) {
                    var executeMethodResults = [];
                    for (var s in this.ancestors) {
                        var step = this.ancestors[s];
                        executeMethodResults.push(step.execute(input));
                    }
                    return Promise.all(executeMethodResults);
                };

                return Executeable;
            })();

            _export("Executeable", Executeable);

            FunctionStep = (function (_Executeable) {
                function FunctionStep(name, toExecute) {
                    _classCallCheck(this, FunctionStep);

                    _Executeable.call(this, name);
                    this.toExecute = toExecute;
                }

                _inherits(FunctionStep, _Executeable);

                FunctionStep.prototype.execute = function execute(i) {
                    var _this = this;

                    var executePromise = new Promise(function (res, rej) {
                        var inputPromise = _Executeable.prototype.execute.call(_this, i);

                        inputPromise.then(function (inputs) {

                            Promise.resolve(_this.toExecute.apply(null, inputs)).then(function (i) {
                                res(i);
                            });
                        });
                    });

                    return executePromise;
                };

                return FunctionStep;
            })(Executeable);

            _export("FunctionStep", FunctionStep);
        }
    };
});