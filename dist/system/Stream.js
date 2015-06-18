System.register(['./Filters'], function (_export) {
    'use strict';

    var filters, Stream;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_Filters) {
            filters = _Filters;
        }],
        execute: function () {
            Stream = (function () {
                function Stream(filter) {
                    _classCallCheck(this, Stream);

                    this.filter = null;
                    this.input = {};
                    this.output = {};

                    this.filter = filter;
                }

                Stream.prototype.execute = function execute(args) {
                    return this.filter.execute(args, input);
                };

                return Stream;
            })();

            _export('Stream', Stream);
        }
    };
});