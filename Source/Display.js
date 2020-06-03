
function Display(sizeInPixels, renderToScreen)
{
	this.sizeInPixels = sizeInPixels;
	this.renderToScreen = (renderToScreen == null ? true : renderToScreen);

	this.drawPos = new Coords();
}

{
	Display.prototype.clear = function()
	{
		this.drawRectangle
		(
			new Coords(0, 0), this.sizeInPixels, "White", null
		);
	}

	Display.prototype.fontSet = function(fontNameAndHeight)
	{
		this.fontNameAndHeight = fontNameAndHeight;
		this.graphics.font = this.fontNameAndHeight.toString();
	}

	Display.prototype.initialize = function()
	{
		this.canvas = document.createElement("canvas");
		this.canvas.style = "border:1px solid";
		this.canvas.width = this.sizeInPixels.x;
		this.canvas.height = this.sizeInPixels.y;
		this.graphics = this.canvas.getContext("2d");

		if (this.renderToScreen)
		{
			var divOutput = document.getElementById("divOutput");
			divOutput.appendChild(this.canvas);
		}
	}

	Display.prototype.toImageBytes = function()
	{
		var imageAsPNGDataURL = this.canvas.toDataURL("image/png");

		var imageAsByteString = atob(imageAsPNGDataURL.split(',')[1]);
		var imageAsBytes = [];

		for (var i = 0; i < imageAsByteString.length; i++) 
		{
			var byte = imageAsByteString.charCodeAt(i);
			imageAsBytes.push(byte);
		}

		return imageAsBytes;
	}

	Display.prototype.widthOfText = function(textToMeasure)
	{
		return this.graphics.measureText(textToMeasure).width;
	}

	// primitives

	Display.prototype.drawRectangle = function(pos, size, colorFill, colorBorder)
	{
		if (colorFill != null)
		{
			this.graphics.fillStyle = colorFill;
			this.graphics.fillRect
			(
				pos.x, pos.y,
				size.x, size.y
			);
		}

		if (colorBorder != null)
		{
			this.graphics.strokeStyle = colorBorder;
			this.graphics.strokeRect
			(
				pos.x, pos.y,
				size.x, size.y
			);
		}
	}

	Display.prototype.drawText = function(text, pos)
	{
		this.graphics.fillStyle = "Gray";
		this.graphics.fillText
		(
			text,
			pos.x, pos.y
		);
	}
}
