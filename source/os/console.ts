///<reference path="../globals.ts" />

/* ------------
     Console.ts
     Requires globals.ts
     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "") {
        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        private clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        private resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { //     Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
		    _ExecutedValues.push(this.buffer);
		    _ExecutedNum = _ExecutedValues.length;
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    this.buffer = "";
                } else if (chr == String.fromCharCode(128)){
		    if(_ExecutedNum > 0){
		        this.buffer = _ExecutedValues[(_ExecutedNum-1)];
		        _ExecutedNum = _ExecutedNum - 1;
		        this.putText(this.buffer);
		    }
		}else if(chr == String.fromCharCode(129)) {
		    if(_ExecutedNum < _ExecutedValues.length){
		        this.buffer = _ExecutedValues[(_ExecutedNum)+1];
		        _ExecutedNum = _ExecutedNum + 1;
		        this.putText(this.buffer);
		    }
		} else if (chr == String.fromCharCode(9)){
		    var foundCommand = new Array<string>();
		    for (var x = 0; x < _OsShell.commandList.length; x++){
         	        if (_OsShell.commandList[x].command.search(this.buffer) == 0){
			    foundCommand.push(_OsShell.commandList[x].command);
			    console.log(foundCommand);
			}
		    }
		    if(foundCommand.length > 1){
		        var y = 0;
			var currentOptions = "";
			while(y < foundCommand.length){
			   currentOptions += (foundCommand[y] + " ");
			   y++;
			} 
			this.advanceLine();
			this.putText(currentOptions);
			this.advanceLine();
			_OsShell.putPrompt();
			this.putText(this.buffer);
		    }
		    else if(foundCommand.length == 1){
		       this.buffer = foundCommand[0];
		       this.putText(this.buffer);
		    }
		    else{
		       this.advanceLine();
		       this.putText('No Value Found');
		       this.advanceLine();
		       _OsShell.putPrompt();
		       this.putText(this.buffer);
		    }
		}else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Write a case for Ctrl-C.
            }
        }

        public putText(text): void {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
         }
	 
	 public deleteChar(value): void {
	    //Take Character wanted to delete and move curser back and "erase" value.
	    _DrawingContext.delete(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, value);
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, value);
                this.currentXPosition = this.currentXPosition + offset;
	    
	 
	 }


        public advanceLine(): void {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize + 
                                     _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                     _FontHeightMargin;
	    if(this.currentYPosition >= _Canvas.height){
                var offset =_DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin;
                var currentCanvas = _DrawingContext.getImageData(0,offset,_Canvas.width,_Canvas.height);
                _DrawingContext.putImageData(currentCanvas, 0, 0);
                this.currentYPosition = _Canvas.height - this.currentFontSize;
            }
        }
    }
 }