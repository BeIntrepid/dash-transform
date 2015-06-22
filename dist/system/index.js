System.register(['./Filters', './Pipes', './Stream'], function (_export) {
  'use strict';

  return {
    setters: [function (_Filters) {
      for (var _key in _Filters) {
        _export(_key, _Filters[_key]);
      }
    }, function (_Pipes) {
      for (var _key2 in _Pipes) {
        _export(_key2, _Pipes[_key2]);
      }
    }, function (_Stream) {
      for (var _key3 in _Stream) {
        _export(_key3, _Stream[_key3]);
      }
    }],
    execute: function () {}
  };
});