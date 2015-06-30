System.register(['./InputSpec'], function (_export) {
    'use strict';

    var InputSpec, Filter, FunctionFilter;

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_InputSpec) {
            InputSpec = _InputSpec['default'];
        }],
        execute: function () {
            Filter = (function () {
                function Filter(name, inputSpec) {
                    _classCallCheck(this, Filter);

                    this.inputObject = null;
                    this.inputSpec = [];

                    this.name = name;
                    this.inputSpec = inputSpec;
                }

                Filter.prototype.execute = function execute(inputObject, args) {
                    return Promise.resolve(true);
                };

                Filter.prototype.buildInputSpec = function buildInputSpec() {
                    return new InputSpec(this.name, this.inputSpec, null);
                };

                return Filter;
            })();

            _export('Filter', Filter);

            FunctionFilter = (function (_Filter) {
                function FunctionFilter(name, toExecute, inputSpec) {
                    _classCallCheck(this, FunctionFilter);

                    _Filter.call(this, name, inputSpec);
                    this.toExecute = toExecute;
                }

                _inherits(FunctionFilter, _Filter);

                FunctionFilter.prototype.execute = function execute(inputObject, args) {
                    return Promise.resolve(this.toExecute.apply(null, arguments));
                };

                return FunctionFilter;
            })(Filter);

            _export('FunctionFilter', FunctionFilter);
        }
    };
});