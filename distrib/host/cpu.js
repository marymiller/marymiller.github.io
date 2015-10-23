///<reference path="../globals.ts" />
///<reference path="../os/shell.ts" />
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
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting, code) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            if (code === void 0) { code = ""; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            this.code = code;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            this.code = "";
        };
        Cpu.prototype.clearPreviousProgram = function () {
            this.code = "";
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            _Assembly = "No Instruction";
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            var ir = _MemoryManager.getMemoryFromLocation(this.PC);
            this.opCodes(ir);
            if (_SingleStepOn) {
                this.isExecuting = false;
            }
            this.PC++;
            document.getElementById("pcVal").innerHTML = (this.PC).toString();
            document.getElementById("irVal").innerHTML = (ir).toString();
            document.getElementById("accVal").innerHTML = (this.Acc).toString();
            document.getElementById("xRegVal").innerHTML = (this.Xreg).toString();
            document.getElementById("yRegVal").innerHTML = (this.Yreg).toString();
            document.getElementById("zFlagVal").innerHTML = (this.Zflag).toString();
        };
        Cpu.prototype.opCodes = function (input) {
            this.code = input.toUpperCase();
            console.log(this.code);
            switch (this.code) {
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
                    _StdOut.putText("There is no op code refering to " + this.code);
            }
        };
        Cpu.prototype.loadAccumConst = function () {
            this.Acc = this.getNextByte();
            this.PC = this.PC + 1;
            _Kernel.krnTrace("load const into acc");
        };
        Cpu.prototype.loadAccumMemory = function () {
            var location = this.getNextTwoBytesAndSwap();
            this.Acc = TSOS.Utils.hexToDec(_MemoryManager.getMemoryFromLocation(location));
            this.PC = this.PC + 2;
            _Kernel.krnTrace("load acc from memory");
        };
        Cpu.prototype.storeAccumMemory = function () {
            var location = this.getNextTwoBytesAndSwap();
            _MemoryManager.updateMemoryAtLocation(location, TSOS.Utils.decToHex(this.Acc));
            this.PC = this.PC + 2;
            _Kernel.krnTrace("store acc into memory");
        };
        Cpu.prototype.addWCarry = function () {
            var location = this.getNextTwoBytesAndSwap();
            this.Acc += parseInt(_MemoryManager.getMemoryFromLocation(location));
            this.PC = this.PC + 2;
            _Kernel.krnTrace("add and store into acc");
        };
        Cpu.prototype.loadXConst = function () {
            this.Xreg = this.getNextByte();
            this.PC = this.PC + 1;
            _Kernel.krnTrace("load const into x");
        };
        Cpu.prototype.loadXMemory = function () {
            var location = this.getNextTwoBytesAndSwap();
            this.Xreg = TSOS.Utils.hexToDec(_MemoryManager.getMemoryFromLocation(location));
            this.PC = this.PC + 2;
            _Kernel.krnTrace("load x from mem");
        };
        Cpu.prototype.loadYConst = function () {
            this.Yreg = this.getNextByte();
            this.PC = this.PC + 1;
            _Kernel.krnTrace("load const into y");
        };
        Cpu.prototype.loadYMemory = function () {
            var location = this.getNextTwoBytesAndSwap();
            console.log("location" + location);
            this.Yreg = TSOS.Utils.hexToDec(_MemoryManager.getMemoryFromLocation(location));
            this.PC = this.PC + 2;
            _Kernel.krnTrace("load y from mem");
        };
        Cpu.prototype.noOperation = function () {
            _Kernel.krnTrace("no op");
        };
        Cpu.prototype.breakSysCall = function () {
            this.updatePCB();
            this.isExecuting = false;
            _Kernel.krnTrace("break");
            _StdOut.advanceLine();
            _OsShell.putPrompt();
        };
        Cpu.prototype.compareByteInMemory = function () {
            var location = this.getNextTwoBytesAndSwap();
            var memoryValue = parseInt(_MemoryManager.getMemoryFromLocation(location));
            this.Zflag = (memoryValue === this.Xreg) ? 1 : 0;
            this.PC = this.PC + 2;
            _Kernel.krnTrace("compare to x");
        };
        Cpu.prototype.branchNByte = function () {
            if (this.Zflag === 0) {
                var branchSpan = this.getNextByte();
                this.PC += 1;
                this.PC = this.PC + branchSpan;
                if (this.PC >= 256) {
                    this.PC = this.PC - 256;
                }
            }
            else {
                this.PC++;
            }
            _Kernel.krnTrace("branch");
        };
        Cpu.prototype.incrementValueByte = function () {
            var location = this.getNextTwoBytesAndSwap();
            var value = 1 + TSOS.Utils.hexToDec(_MemoryManager.getMemoryFromLocation(location));
            _MemoryManager.updateMemoryAtLocation(location, value);
            this.PC = this.PC + 2;
            _Kernel.krnTrace("increment");
        };
        Cpu.prototype.sysCall = function () {
            if (this.Xreg == 1) {
                console.log(TSOS.Utils.hexToDec(this.Yreg));
                _StdOut.putText(TSOS.Utils.hexToDec(this.Yreg).toString());
            }
            else if (this.Xreg == 2) {
                var test = _MemoryManager.getMemoryFromLocation(this.Yreg);
                var text = "";
                var keyCode = 0;
                while (test != "00") {
                    keyCode = parseInt(test, 16);
                    text = String.fromCharCode(keyCode);
                    _StdOut.putText(text);
                    this.Yreg++;
                    test = _MemoryManager.getMemoryFromLocation(this.Yreg);
                }
                _Kernel.krnTrace("syscall");
            }
        };
        Cpu.prototype.updatePCB = function () {
            _CurrPCB.PC = this.PC;
            _CPU.Acc = this.Acc;
            _CPU.Xreg = this.Xreg;
            _CPU.Yreg = this.Yreg;
            _CPU.Zflag = this.Zflag;
        };
        Cpu.prototype.toHexConversion = function (input) {
            return input.toString(16).toUpperCase();
        };
        Cpu.prototype.getNextByte = function () {
            var nextByteAsHex = _MemoryManager.getMemoryFromLocation(this.PC + 1);
            return TSOS.Utils.hexToDec(nextByteAsHex);
        };
        Cpu.prototype.getNextTwoBytesAndSwap = function () {
            var byteOne = _MemoryManager.getMemoryFromLocation(this.PC + 1);
            var byteTwo = _MemoryManager.getMemoryFromLocation(this.PC + 2);
            return TSOS.Utils.hexToDec(byteTwo + byteOne);
        };
        Cpu.prototype.resetCPUElements = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
