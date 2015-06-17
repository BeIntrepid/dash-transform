System.register(['./Pipes', './Steps', './Stream'], function (_export) {
  'use strict';

  return {
    setters: [function (_Pipes) {
      for (var _key in _Pipes) {
        _export(_key, _Pipes[_key]);
      }
    }, function (_Steps) {
      for (var _key2 in _Steps) {
        _export(_key2, _Steps[_key2]);
      }
    }, function (_Stream) {
      for (var _key3 in _Stream) {
        _export(_key3, _Stream[_key3]);
      }
    }],
    execute: function () {}
  };
});