/* --------
   Utils.ts

   Utility functions.
   -------- */
var TSOS;
(function (TSOS) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.trim = function (str) {
            // Use a regular expression to remove leading and trailing spaces.
            return str.replace(/^\s+ | \s+$/g, "");
            /*
            Huh? WTF? Okay... take a breath. Here we go:
            - The "|" separates this into two expressions, as in A or B.
            - "^\s+" matches a sequence of one or more whitespace characters at the beginning of a string.
            - "\s+$" is the same thing, but at the end of the string.
            - "g" makes is global, so we get all the whitespace.
            - "" is nothing, which is what we replace the whitespace with.
            */
        };
        Utils.rot13 = function (str) {
            /*
               This is an easy-to understand implementation of the famous and common Rot13 obfuscator.
               You can do this in three lines with a complex regular expression, but I'd have
               trouble explaining it in the future.  There's a lot to be said for obvious code.
            */
            var retVal = "";
            for (var i in str) {
                var ch = str[i];
                var code = 0;
                if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0) {
                    code = str.charCodeAt(i) + 13; // It's okay to use 13.  It's not a magic number, it's called rot13.
                    retVal = retVal + String.fromCharCode(code);
                }
                else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0) {
                    code = str.charCodeAt(i) - 13; // It's okay to use 13.  See above.
                    retVal = retVal + String.fromCharCode(code);
                }
                else {
                    retVal = retVal + ch;
                }
            }
            return retVal;
        };
        Utils.hexStrToDecNum = function (hexStr) {
            return parseInt(hexStr, 16);
        };
        Utils.decNumToHexStr = function (decNum) {
            return decNum.toString(16);
        };
        Utils.stringToHex = function (string) {
            var hexString = "";
            for (var i = 0; i < string.length; i++) {
                hexString += string.charCodeAt(i).toString(16);
            }
            return hexString;
        };
        Utils.hexToString = function (hexx) {
            var hex = hexx.toString(); //force conversion
            var str = '';
            for (var i = 0; i < hex.length; i += 2)
                str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
            return str;
        };
        Utils.isNaNOverride = function (val) {
            return (val[1] === "D" || val === "00" || isNaN(val));
        };
        Utils.getPrettySchedulerType = function () {
            if (_SchedulerType === "rr") {
                return "Round Robin";
            }
            else if (_SchedulerType === "fcfs") {
                return "First Come First Serve";
            }
            else if (_SchedulerType === "priority") {
                return "Priority";
            }
        };
        Utils.isInteger = function (val) {
            if (val % 1 === 0 && isNaN(val) === false) {
                return true;
            }
            else {
                return false;
            }
        };
        return Utils;
    })();
    TSOS.Utils = Utils;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=utils.js.map