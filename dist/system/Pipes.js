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

                    this.endStep = null;
                }

                Pipe.prototype.addStepTree = function addStepTree(step) {
                    this.endStep = step;
                };

                Pipe.prototype.call = function call(input) {
                    return Promise.resolve(this.endStep.execute(input));
                };

                return Pipe;
            })();

            _export('Pipe', Pipe);
        }
    };
});