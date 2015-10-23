///<reference path="../globals.ts" />

module TSOS {
    export class PCB {
        PID: number;
        PC: number;
        Accum: number;
        Xreg: number;
        Yreg: number;
        Zflag: number;
        baseRegister: number;
        limitRegister: number;
        processState: string;
        priority: number;
        location: string;

        constructor(){
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

        public printPCB(): void {
            //_Console.printPCBInfo(this.PID, this.PC, this.Accum, this.Xreg, this.Yreg, this.Zflag);
        }
    }
}