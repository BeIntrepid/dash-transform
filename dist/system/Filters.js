System.register(['./InputSpec', './TransformConfig'], function (_export) {
    'use strict';

    var InputSpec, TransformConfig, Filter, FunctionFilter;

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_InputSpec) {
            InputSpec = _InputSpec.InputSpec;
        }, function (_TransformConfig) {
            TransformConfig = _TransformConfig.TransformConfig;
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

                Filter.prototype.getInputSpec = function getInputSpec() {
                    return this.inputSpec;
                };

                Filter.prototype.getName = function getName() {
                    return this.name;
                };

                Filter.prototype.execute = function execute(inputObject, args) {
                    return Promise.resolve(true);
                };

                Filter.prototype.buildInputSpec = function buildInputSpec() {
                    if (TransformConfig.enableDebugMessages) console.log('Building InputSpec for ' + this.name);

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