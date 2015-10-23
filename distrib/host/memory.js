///<reference path="control.ts" />
var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory(size) {
            this.memoryBlockSize = size;
            this.initializeMemoryBlocks(this.memoryBlockSize);
        }
        Memory.prototype.initializeMemoryBlocks = function (size) {
            this.memoryBlock = [size];
            for (var j = 0; j < size; j++) {
                this.memoryBlock[j] = "00";
            }
        };
        Memory.prototype.getMemBlock = function () {
            return this.memoryBlock;
        };
        Memory.prototype.clearMem = function () {
            this.initializeMemoryBlocks(this.memoryBlockSize);
            TSOS.Control.emptyFullMemTable();
        };
        Memory.prototype.isEmpty = function () {
            for (var j = 0; j < this.memoryBlock.length; j++) {
                if (this.memoryBlock[j] != "00") {
                    return false;
                }
            }
            return true;
        };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
