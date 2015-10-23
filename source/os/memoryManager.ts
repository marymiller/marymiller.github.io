///<reference path="../globals.ts" />

module TSOS {
    export class MemoryManager {

        baseRegister: number;
        limitRegister: number;

        constructor(){
        }

        public fillMemoryWithProgram(code): void {
            _Memory.clearMem();
            for (var i = 0; i < code.length; i++) {
                this.updateMemoryAtLocation(i, code[i]);
            }
        }

        public getMemoryFromLocation(loc): any {
            var memBeforeParse = _Memory.getMemBlock()[loc];
            return memBeforeParse;
        }

        public getMemoryFromLocationInString(loc): string {
            var memBeforeParse = _Memory.getMemBlock();
            return memBeforeParse;
        }

        public updateMemoryAtLocation(loc, newCode): void {
            var currentTableRow = 0;

            var newCodeHex = Utils.decToHex(newCode);
            var currBlock = _Memory.getMemBlock();
            if (newCodeHex.length < 2)
                newCodeHex = "0" + newCodeHex;
            currBlock[loc] = newCodeHex;
            Control.updateMemTableAtLoc(Math.floor(loc / 8) + currentTableRow, loc % 8, newCodeHex);
        }
    }
}