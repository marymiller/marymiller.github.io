//<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DeviceDriverKeyboard = (function (_super) {
        __extends(DeviceDriverKeyboard, _super);
        function DeviceDriverKeyboard() {
            // Override the base method pointers.
            _super.call(this, this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
        }
        DeviceDriverKeyboard.prototype.krnKbdDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };
        DeviceDriverKeyboard.prototype.krnKbdDispatchKeyPress = function (params) {
            // Parse the params.    TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) ||
                ((keyCode >= 97) && (keyCode <= 123))) {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            }
            else if (isShifted) {
                if (keyCode == 48) {
                    chr = String.fromCharCode(41);
                }
                else if (keyCode == 49) {
                    chr = String.fromCharCode(33);
                }
                else if (keyCode == 50) {
                    chr = String.fromCharCode(64);
                }
                else if (keyCode == 51) {
                    chr = String.fromCharCode(35);
                }
                else if (keyCode == 52) {
                    chr = String.fromCharCode(36);
                }
                else if (keyCode == 53) {
                    chr = String.fromCharCode(37);
                }
                else if (keyCode == 54) {
                    chr = String.fromCharCode(94);
                }
                else if (keyCode == 55) {
                    chr = String.fromCharCode(38);
                }
                else if (keyCode == 56) {
                    chr = String.fromCharCode(42);
                }
                else if (keyCode == 57) {
                    chr = String.fromCharCode(40);
                }
                else if (keyCode == 186) {
                    chr = String.fromCharCode(58);
                }
                else if (keyCode == 187) {
                    chr = String.fromCharCode(43);
                }
                else if (keyCode == 188) {
                    chr = String.fromCharCode(60);
                }
                else if (keyCode == 189) {
                    chr = String.fromCharCode(45);
                }
                else if (keyCode == 190) {
                    chr = String.fromCharCode(62);
                }
                else if (keyCode == 191) {
                    chr = String.fromCharCode(63);
                }
                else if (keyCode == 222) {
                    chr = String.fromCharCode(34);
                }
                else if (keyCode == 220) {
                    chr = String.fromCharCode(124);
                }
                else if (keyCode == 219) {
                    chr = String.fromCharCode(123);
                }
                else if (keyCode == 221) {
                    chr = String.fromCharCode(125);
                }
                else if (keyCode == 192) {
                    chr = String.fromCharCode(126);
                }
                _KernelInputQueue.enqueue(chr);
            }
            else if (((keyCode >= 48) && (keyCode <= 57)) ||
                (keyCode == 32) ||
                (keyCode == 13) ||
                (keyCode == 8)) {
                chr = String.fromCharCode(keyCode);
                console.log(chr);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 38) {
                chr = String.fromCharCode(128);
                console.log(chr);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 40) {
                chr = String.fromCharCode(129);
                console.log(chr);
                _KernelInputQueue.enqueue(chr);
            }
            else if (((keyCode >= 186) && (keyCode <= 192)) ||
                ((keyCode >= 219) && (keyCode <= 222))) {
                if (keyCode == 186) {
                    chr = String.fromCharCode(59);
                }
                else if (keyCode == 187) {
                    chr = String.fromCharCode(61);
                }
                else if (keyCode == 188) {
                    chr = String.fromCharCode(44);
                }
                else if (keyCode == 189) {
                    chr = String.fromCharCode(45);
                }
                else if (keyCode == 190) {
                    chr = String.fromCharCode(46);
                }
                else if (keyCode == 191) {
                    chr = String.fromCharCode(47);
                }
                else if (keyCode == 192) {
                    chr = String.fromCharCode(96);
                }
                else if (keyCode == 219) {
                    chr = String.fromCharCode(91);
                }
                else if (keyCode == 220) {
                    chr = String.fromCharCode(92);
                }
                else if (keyCode == 221) {
                    chr = String.fromCharCode(93);
                }
                else if (keyCode == 222) {
                    chr = String.fromCharCode(39);
                }
                _KernelInputQueue.enqueue(chr);
            }
        };
        return DeviceDriverKeyboard;
    })(TSOS.DeviceDriver);
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
