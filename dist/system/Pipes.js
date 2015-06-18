System.register(['./steps'], function (_export) {
    'use strict';

    var steps, Pipe;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

    return {
        setters: [function (_steps) {
            steps = _steps;
        }],
        execute: function () {
            Pipe = (function (_steps$Executeable) {
                function Pipe(name) {
                    _classCallCheck(this, Pipe);

                    _steps$Executeable.call(this, name);
                    this.endStep = null;
                }

                _inherits(Pipe, _steps$Executeable);

                Pipe.prototype.addStepTree = function addStepTree(step) {
                    this.endStep = step;
                };

                Pipe.prototype.execute = function execute(input) {
                    return this.call(input);
                };

                Pipe.prototype.call = function call(input) {
                    return Promise.resolve(this.endStep.execute(input));
                };

                return Pipe;
            })(steps.Executeable);

            _export('Pipe', Pipe);
        }
    };
});