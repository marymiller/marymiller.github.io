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

module TSOS {

    export class Cpu {

        constructor(public PC:number = 0,
                    public Acc:number = 0,
                    public Xreg:number = 0,
                    public Yreg:number = 0,
                    public Zflag:number = 0,
                    public isExecuting:boolean = false,
                    public code: string = "") {

        }

        public init():void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            this.code = "";
        }
        public clearPreviousProgram(){
            this.code ="";
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            _Assembly = "No Instruction";
         }

        public cycle():void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.


            var ir = _MemoryManager.getMemoryFromLocation(this.PC);

            this.opCodes(ir);
            if(_SingleStepOn){
                this.isExecuting = false;
            }
            this.PC++;

            (<HTMLButtonElement>document.getElementById("pcVal")).innerHTML = (this.PC).toString();
            (<HTMLButtonElement>document.getElementById("irVal")).innerHTML = (ir).toString();
            (<HTMLButtonElement>document.getElementById("accVal")).innerHTML = (this.Acc).toString();
            (<HTMLButtonElement>document.getElementById("xRegVal")).innerHTML = (this.Xreg).toString();
            (<HTMLButtonElement>document.getElementById("yRegVal")).innerHTML = (this.Yreg).toString();
            (<HTMLButtonElement>document.getElementById("zFlagVal")).innerHTML = (this.Zflag).toString();

        }

        public opCodes(input):void {

            this.code = input.toUpperCase();
            console.log(this.code);
            switch (this.code) {
                case "A9": //Load the accumulator with a constant
                    this.loadAccumConst();
                    break;
                case "AD": //Load the accumulator from memory
                    this.loadAccumMemory();
                    break;
                case "8D": //Store the accumulator in memory
                    this.storeAccumMemory();
                    break;
                case "6D": //Add with carry
                    this.addWCarry();
                    break;
                case "A2": //Load the x register with a constant
                    this.loadXConst();
                    break;
                case "AE": //Load the x register from memory
                    this.loadXMemory();
                    break;
                case "A0": //Load the Y register with a constant
                    this.loadYConst();
                    break;
                case "AC": //Load the Y register from memory
                    this.loadYMemory();
                    break;
                case "EA": //No Operation
                    this.noOperation();
                    break;
                case "00": //Break
                    this.breakSysCall();
                    break;
                case "EC": //Compare a byte in memory to the x reg
                    this.compareByteInMemory();
                    break;
                case "D0": //Branch n bytes if z flag = 0
                    this.branchNByte();
                    break;
                case "EE": //Increment the value of a byte
                    this.incrementValueByte();
                    break;
                case "FF": //System Call
                    this.sysCall();
                    break;
                default: //No match
                    _StdOut.putText("There is no op code refering to " + this.code);

            }
        }
        public loadAccumConst(){
            this.Acc = this.getNextByte();
            this.PC = this.PC + 1;
            _Kernel.krnTrace("load const into acc");
        }
        public loadAccumMemory(){
            var location = this.getNextTwoBytesAndSwap();
            this.Acc = Utils.hexToDec(_MemoryManager.getMemoryFromLocation(location));
            this.PC = this.PC + 2;
            _Kernel.krnTrace("load acc from memory");
        }
        public storeAccumMemory(){
            var location = this.getNextTwoBytesAndSwap();

            _MemoryManager.updateMemoryAtLocation(location, Utils.decToHex(this.Acc));
            this.PC = this.PC + 2;
            _Kernel.krnTrace("store acc into memory");
        }
        public addWCarry(){
            var location = this.getNextTwoBytesAndSwap();
            this.Acc += parseInt(_MemoryManager.getMemoryFromLocation(location));
            this.PC = this.PC + 2;
            _Kernel.krnTrace("add and store into acc");
        }
        public loadXConst(){
            this.Xreg = this.getNextByte();
            this.PC = this.PC + 1;
            _Kernel.krnTrace("load const into x");
        }
        public loadXMemory(){
            var location = this.getNextTwoBytesAndSwap();
            this.Xreg = Utils.hexToDec(_MemoryManager.getMemoryFromLocation( location));
            this.PC = this.PC + 2;
            _Kernel.krnTrace("load x from mem");
        }
        public loadYConst(){
            this.Yreg = this.getNextByte();
            this.PC = this.PC + 1;
            _Kernel.krnTrace("load const into y");
        }
        public loadYMemory(){
            var location = this.getNextTwoBytesAndSwap();
            console.log("location" + location);
            this.Yreg = Utils.hexToDec(_MemoryManager.getMemoryFromLocation(location));
            this.PC = this.PC + 2;
            _Kernel.krnTrace("load y from mem");
        }
        public noOperation(){
            _Kernel.krnTrace("no op");
        }
        public breakSysCall(){
            this.updatePCB();
            this.isExecuting = false;
            _Kernel.krnTrace("break");
            _StdOut.advanceLine();
            _OsShell.putPrompt();
        }
        public compareByteInMemory(){
            var location = this.getNextTwoBytesAndSwap();
            var memoryValue = parseInt(_MemoryManager.getMemoryFromLocation(location));
            this.Zflag = (memoryValue === this.Xreg) ? 1 : 0;
            this.PC = this.PC + 2;
            _Kernel.krnTrace("compare to x");
        }
        public branchNByte(){
            if (this.Zflag === 0) {
                var branchSpan = this.getNextByte();
                this.PC += 1;
                this.PC = this.PC + branchSpan;
                if (this.PC >= 256) {
                    this.PC = this.PC - 256;
                }
            } else {
                this.PC++;
            }
            _Kernel.krnTrace("branch");
        }
        public incrementValueByte(){
            var location = this.getNextTwoBytesAndSwap();
            var value = 1 + Utils.hexToDec(_MemoryManager.getMemoryFromLocation(location));
            _MemoryManager.updateMemoryAtLocation(location, value);
            this.PC = this.PC + 2;
            _Kernel.krnTrace("increment");
        }
        public sysCall(){
            if(this.Xreg == 1){
                console.log(Utils.hexToDec(this.Yreg));
                _StdOut.putText(Utils.hexToDec(this.Yreg).toString());
            }
            else if(this.Xreg == 2){
                var test = _MemoryManager.getMemoryFromLocation(this.Yreg);
                var text = "";
                var keyCode = 0;

                while(test != "00") {
                    keyCode = parseInt(test, 16);
                    text = String.fromCharCode(keyCode);
                    _StdOut.putText(text);
                    this.Yreg++;
                    test = _MemoryManager.getMemoryFromLocation(this.Yreg);
                }
                _Kernel.krnTrace("syscall");
            }

        }


        public updatePCB(){
            _CurrPCB.PC = this.PC;
            _CPU.Acc = this.Acc;
            _CPU.Xreg = this.Xreg;
            _CPU.Yreg = this.Yreg;
            _CPU.Zflag = this.Zflag;

        }

        public toHexConversion(input):number{
            return input.toString(16).toUpperCase();
        }

        public getNextByte () {
            var nextByteAsHex = _MemoryManager.getMemoryFromLocation(this.PC + 1);
            return Utils.hexToDec(nextByteAsHex);
        }

        public getNextTwoBytesAndSwap() {
            var byteOne = _MemoryManager.getMemoryFromLocation(this.PC + 1);
            var byteTwo = _MemoryManager.getMemoryFromLocation(this.PC + 2);
            return Utils.hexToDec(byteTwo + byteOne);
        }

        public resetCPUElements(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }
    }
}
