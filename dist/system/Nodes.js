System.register(['./TransformLibrary', './Filters', './TransformConfig'], function (_export) {
    'use strict';

    var TransformLibrary, FunctionFilter, TransformConfig, TransformNode;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_TransformLibrary) {
            TransformLibrary = _TransformLibrary.TransformLibrary;
        }, function (_Filters) {
            FunctionFilter = _Filters.FunctionFilter;
        }, function (_TransformConfig) {
            TransformConfig = _TransformConfig.TransformConfig;
        }],
        execute: function () {
            TransformNode = (function () {
                function TransformNode(name, filter) {
                    _classCallCheck(this, TransformNode);

                    this.ancestors = [];
                    this.pipe = null;
                    this.name = 'unnamed TransformNode';

                    this.name = name;
                    this.pipe = filter;
                }

                TransformNode.prototype.addInput = function addInput(ancestor) {
                    this.ancestors.push(ancestor);
                };

                TransformNode.prototype.execute = function execute(inputObject, args) {
                    if (TransformConfig.enableDebugMessages) console.log('Executing node ' + this.pipe.name);

                    return this.pipe.execute.apply(this.pipe, [inputObject].concat(args));
                };

                TransformNode.prototype.buildInputSpec = function buildInputSpec() {
                    return this.pipe.buildInputSpec();
                };

                return TransformNode;
            })();

            _export('TransformNode', TransformNode);
        }
    };
});