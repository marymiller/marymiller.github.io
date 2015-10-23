///<reference path="control.ts" />

module TSOS {
    export class Memory {
        memoryBlock: string[];
        memoryBlockSize: number;

        constructor(size: number){
            this.memoryBlockSize = size;
            this.initializeMemoryBlocks(this.memoryBlockSize);
        }

        private initializeMemoryBlocks(size): void {
            this.memoryBlock = [size];
            for(var j = 0; j < size; j++){
                this.memoryBlock[j] = "00";
            }
        }

        public getMemBlock(): string[] {
            return this.memoryBlock;
        }

        public clearMem(): void {
            this.initializeMemoryBlocks(this.memoryBlockSize);
            Control.emptyFullMemTable();
        }

        public isEmpty(): boolean {
            for(var j = 0; j < this.memoryBlock.length; j++){
                if(this.memoryBlock[j] != "00"){
                    return false;
                }
            }
            return true;
        }
    }
}