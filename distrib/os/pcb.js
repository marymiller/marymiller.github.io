///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var PCB = (function () {
        function PCB() {
            this.PID = _PID++;
            this.PC = 0;
            this.Accum = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.baseRegister = _CurrBlockOfMem * 256;
            this.limitRegister = (_CurrBlockOfMem * 256) + 255;
            this.processState = null;
            this.priority = null;
            this.location = null;
        }
        PCB.prototype.printPCB = function () {
            //_Console.printPCBInfo(this.PID, this.PC, this.Accum, this.Xreg, this.Yreg, this.Zflag);
        };
        return PCB;
    })();
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
