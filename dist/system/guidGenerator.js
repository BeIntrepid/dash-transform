System.register([], function (_export) {
    'use strict';

    return {
        setters: [],
        execute: function () {
            (function () {
                var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

                Math.uuid = function (len, radix) {
                    var chars = CHARS,
                        uuid = [],
                        i;
                    radix = radix || chars.length;

                    if (len) {
                        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
                    } else {
                        var r;

                        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                        uuid[14] = '4';

                        for (i = 0; i < 36; i++) {
                            if (!uuid[i]) {
                                r = 0 | Math.random() * 16;
                                uuid[i] = chars[i == 19 ? r & 3 | 8 : r];
                            }
                        }
                    }

                    return uuid.join('');
                };

                Math.uuidFast = function () {
                    var chars = CHARS,
                        uuid = new Array(36),
                        rnd = 0,
                        r;
                    for (var i = 0; i < 36; i++) {
                        if (i == 8 || i == 13 || i == 18 || i == 23) {
                            uuid[i] = '-';
                        } else if (i == 14) {
                            uuid[i] = '4';
                        } else {
                            if (rnd <= 2) rnd = 33554432 + Math.random() * 16777216 | 0;
                            r = rnd & 15;
                            rnd = rnd >> 4;
                            uuid[i] = chars[i == 19 ? r & 3 | 8 : r];
                        }
                    }
                    return uuid.join('');
                };

                Math.uuidCompact = function () {
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0,
                            v = c == 'x' ? r : r & 3 | 8;
                        return v.toString(16);
                    });
                };
            })();
        }
    };
});