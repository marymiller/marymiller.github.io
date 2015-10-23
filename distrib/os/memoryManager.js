///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager() {
        }
        MemoryManager.prototype.fillMemoryWithProgram = function (code) {
            _Memory.clearMem();
            for (var i = 0; i < code.length; i++) {
                this.updateMemoryAtLocation(i, code[i]);
            }
        };
        MemoryManager.prototype.getMemoryFromLocation = function (loc) {
            var memBeforeParse = _Memory.getMemBlock()[loc];
            return memBeforeParse;
        };
        MemoryManager.prototype.getMemoryFromLocationInString = function (loc) {
            var memBeforeParse = _Memory.getMemBlock();
            return memBeforeParse;
        };
        MemoryManager.prototype.updateMemoryAtLocation = function (loc, newCode) {
            var currentTableRow = 0;
            var newCodeHex = TSOS.Utils.decToHex(newCode);
            var currBlock = _Memory.getMemBlock();
            if (newCodeHex.length < 2)
                newCodeHex = "0" + newCodeHex;
            currBlock[loc] = newCodeHex;
            TSOS.Control.updateMemTableAtLoc(Math.floor(loc / 8) + currentTableRow, loc % 8, newCodeHex);
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
