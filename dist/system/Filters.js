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

                    this.name = name;
                }

                Filter.prototype.addInputFilter = function addInputFilter(Filter) {
                    this.ancestors.push(Filter);
                };

                Filter.prototype.execute = function execute(inputObject, args) {
                    return Promise.resolve(true);
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
                    return Promise.resolve(this.toExecute.apply(null, arguments));
                };

                return FunctionFilter;
            })(Filter);

            _export("FunctionFilter", FunctionFilter);
        }
    };
});