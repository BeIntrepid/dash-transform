System.register(['linq-es6'], function (_export) {
    'use strict';

    var Enumerable, InputResolver;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_linqEs6) {
            Enumerable = _linqEs6['default'];
        }],
        execute: function () {
            InputResolver = (function () {
                function InputResolver(mappedInputs) {
                    _classCallCheck(this, InputResolver);

                    this.mappedInputs = mappedInputs;
                }

                InputResolver.prototype.getInputOverrides = function getInputOverrides(node) {
                    var _this = this;

                    var matchingInput = null;

                    Object.getOwnPropertyNames(this.mappedInputs).forEach(function (miName) {
                        var mi = _this.mappedInputs[miName];
                        if (mi.nodeRef == node) {
                            matchingInput = mi;
                        }
                    });

                    return matchingInput;
                };

                return InputResolver;
            })();

            _export('InputResolver', InputResolver);
        }
    };
});