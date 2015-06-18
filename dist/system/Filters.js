System.register([], function (_export) {
    "use strict";

    var Filter, FunctionFilter;

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    return {
        setters: [],
        execute: function () {
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

            _export("Filter", Filter);

            FunctionFilter = (function (_Filter) {
                function FunctionFilter(name, toExecute) {
                    _classCallCheck(this, FunctionFilter);

                    _Filter.call(this, name);
                    this.toExecute = toExecute;
                }

                _inherits(FunctionFilter, _Filter);

                FunctionFilter.prototype.execute = function execute(inputObject, args) {
                    var _this = this;

                    var executePromise = new Promise(function (res, rej) {
                        var inputPromise = _Filter.prototype.execute.call(_this, inputObject, args);

                        inputPromise.then(function (inputs) {
                            if (inputs.length == 0) {
                                inputs = [args];
                            }

                            Promise.resolve(_this.toExecute.apply(null, [inputObject].concat(inputs))).then(function (i) {
                                res(inputObject, i);
                            });
                        });
                    });

                    return executePromise;
                };

                return FunctionFilter;
            })(Filter);

            _export("FunctionFilter", FunctionFilter);
        }
    };
});