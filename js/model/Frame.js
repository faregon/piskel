(function () {
	var ns = $.namespace("pskl.model");
	
	ns.Frame = function (pixels) {
		this.pixels = pixels;
		this.previousStates = [this._clonePixels()];
		this.stateIndex = 0;
	};

	ns.Frame.createEmpty = function (width, height) {
		var pixels = []; //new Array(width);
		for (var columnIndex=0; columnIndex < width; columnIndex++) {
			var columnArray = [];
			for(var heightIndex = 0; heightIndex < height; heightIndex++) {
				columnArray.push(Constants.TRANSPARENT_COLOR);
			}
			pixels[columnIndex] = columnArray;
    	}
		return new ns.Frame(pixels);
	};

	ns.Frame.createEmptyFromFrame = function (frame) {
		return ns.Frame.createEmpty(frame.getWidth(), frame.getHeight());
	};

	ns.Frame.prototype.clone = function () {
		return new ns.Frame(this._clonePixels());
	};

	ns.Frame.prototype._clonePixels = function () {
		var pixels = [];
		for (var col = 0 ; col < this.getWidth() ; col++) {
			pixels[col] = this.pixels[col].slice(0 , this.getHeight());
		}
		return pixels;
	};

	ns.Frame.prototype.serialize = function () {
		return JSON.stringify(this.pixels);
	};

	ns.Frame.prototype.setPixel = function (col, row, color) {
		this.pixels[col][row] = color;
	};

	ns.Frame.prototype.getPixel = function (col, row) {
		return this.pixels[col][row];
	};

	ns.Frame.prototype.getWidth = function () {
		return this.pixels.length;
	};

	ns.Frame.prototype.getHeight = function () {
		return this.pixels[0].length;
	};

	ns.Frame.prototype.containsPixel = function (col, row) {
		return col >= 0 && row >= 0 && col < this.pixels.length && row < this.pixels[0].length;
	};

	ns.Frame.prototype.saveState = function () {
		// remove all states past current state
		this.previousStates.length = this.stateIndex + 1;
		// push new state
		this.previousStates.push(this._clonePixels());
		// set the stateIndex to latest saved state
		this.stateIndex = this.previousStates.length - 1;
	};

	ns.Frame.prototype.loadPreviousState = function () {
		if (this.stateIndex > 0) {
			this.stateIndex--;
			this.pixels = this.previousStates[this.stateIndex];
		}
	};

	ns.Frame.prototype.loadNextState = function () {
		if (this.stateIndex < this.previousStates.length - 1) {
			this.stateIndex++;
			this.pixels = this.previousStates[this.stateIndex];
		}	
	};

})();