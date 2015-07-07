System.register([], function (_export) {
    "use strict";

    var InputSpec;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    return {
        setters: [],
        execute: function () {
            InputSpec = function InputSpec(name, inputs, ancestors, nodeGuid) {
                _classCallCheck(this, InputSpec);

                this.name = name;
                this.inputs = inputs;
                this.ancestors = ancestors;
                this.nodeGuid = nodeGuid;
            };

            _export("InputSpec", InputSpec);
        }
    };
});