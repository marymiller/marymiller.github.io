///<reference path="../globals.ts" />
/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    var Cpu = (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        };
        Cpu.prototype.opCodes = function (input) {
            var code = input.toUpperCase();
            switch (code) {
                case "A9":
                    this.loadAccumConst();
                    break;
                case "AD":
                    this.loadAccumMemory();
                    break;
                case "8D":
                    this.storeAccumMemory();
                    break;
                case "6D":
                    this.addWCarry();
                    break;
                case "A2":
                    this.loadXConst();
                    break;
                case "AE":
                    this.loadXMemory();
                    break;
                case "A0":
                    this.loadYConst();
                    break;
                case "AC":
                    this.loadYMemory();
                    break;
                case "EA":
                    this.noOperation();
                    break;
                case "00":
                    this.breakSysCall();
                    break;
                case "EC":
                    this.compareByteInMemory();
                    break;
                case "D0":
                    this.branchNByte();
                    break;
                case "EE":
                    this.incrementValueByte();
                    break;
                case "FF":
                    this.sysCall();
                    break;
                default:
                    _StdOut.putText("There is no op code refering to " + code);
            }
        };
        Cpu.prototype.loadAccumConst = function () { };
        Cpu.prototype.loadAccumMemory = function () { };
        Cpu.prototype.storeAccumMemory = function () { };
        Cpu.prototype.addWCarry = function () { };
        Cpu.prototype.loadXConst = function () { };
        Cpu.prototype.loadXMemory = function () { };
        Cpu.prototype.loadYConst = function () { };
        Cpu.prototype.loadYMemory = function () { };
        Cpu.prototype.noOperation = function () { };
        Cpu.prototype.breakSysCall = function () { };
        Cpu.prototype.compareByteInMemory = function () { };
        Cpu.prototype.branchNByte = function () { };
        Cpu.prototype.incrementValueByte = function () { };
        Cpu.prototype.sysCall = function () { };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
