System.register(['./transform'], function (_export) {
  'use strict';

  var transform;
  return {
    setters: [function (_transform) {
      transform = _transform.transform;

      _export('transform', _transform.transform);
    }],
    execute: function () {}
  };
});