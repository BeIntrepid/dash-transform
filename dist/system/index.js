System.register(['./Filters', './Stream'], function (_export) {
  'use strict';

  return {
    setters: [function (_Filters) {
      for (var _key in _Filters) {
        _export(_key, _Filters[_key]);
      }
    }, function (_Stream) {
      for (var _key2 in _Stream) {
        _export(_key2, _Stream[_key2]);
      }
    }],
    execute: function () {}
  };
});