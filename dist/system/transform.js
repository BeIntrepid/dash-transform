System.register(['jquery'], function (_export) {
    'use strict';

    var $, transform;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_jquery) {
            $ = _jquery['default'];
        }],
        execute: function () {
            transform = (function () {
                function transform() {
                    _classCallCheck(this, transform);
                }

                transform.prototype.transform = function transform(a) {
                    var pipe = $.Deferred();
                    var prom = pipe.then(function () {
                        console.log('1');
                    });
                    prom = pipe.then(function () {
                        console.log('2');
                    });
                    pipe.resolve();
                };

                return transform;
            })();

            _export('transform', transform);
        }
    };
});