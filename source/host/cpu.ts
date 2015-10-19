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

module TSOS {

    export class Cpu {

        constructor(public PC:number = 0,
                    public Acc:number = 0,
                    public Xreg:number = 0,
                    public Yreg:number = 0,
                    public Zflag:number = 0,
                    public isExecuting:boolean = false) {

        }

        public init():void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        public cycle():void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        }

        public opCodes(input):void {

            var code = input.toUpperCase();

            switch (code) {
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
                    _StdOut.putText("There is no op code refering to " + code);

            }
        }
        public loadAccumConst(){}
        public loadAccumMemory(){}
        public storeAccumMemory(){}
        public addWCarry(){}
        public loadXConst(){}
        public loadXMemory(){}
        public loadYConst(){}
        public loadYMemory(){}
        public noOperation(){}
        public breakSysCall(){}
        public compareByteInMemory(){}
        public branchNByte(){}
        public incrementValueByte(){}
        public sysCall(){}

    }
}
