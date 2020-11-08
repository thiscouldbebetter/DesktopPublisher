
class Display
{
	constructor(sizeInPixels, renderToScreen)
	{
		this.sizeInPixels = sizeInPixels;
		this.renderToScreen = (renderToScreen == null ? true : renderToScreen);

		this.drawPos = new Coords();
	}

	clear()
	{
		this.drawRectangle
		(
			new Coords(0, 0), this.sizeInPixels, "White", null
		);
	}

	fontSet(fontNameAndHeight)
	{
		this.fontNameAndHeight = fontNameAndHeight;
		this.graphics.font = this.fontNameAndHeight.toString();
	}

	initialize()
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

	toImageBytes()
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

	widthOfText(textToMeasure)
	{
		return this.graphics.measureText(textToMeasure).width;
	}

	// primitives

	drawImage(image, pos, size)
	{
		// hack
		// Just to see where the image should be, until it's fixed.
		this.graphics.fillStyle = "Gray";
		this.graphics.fillRect(pos.x, pos.y, size.x, size.y);

		// fix
		// Currently this draws nothing,
		// either due to asynchronous image loading,
		// or because of browser security features.

		this.graphics.drawImage
		(
			image.systemImage,
			pos.x, pos.y,
			size.x, size.y
		);
	}

	drawRectangle(pos, size, colorFill, colorBorder)
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

	drawText(text, pos)
	{
		this.graphics.fillStyle = "Gray";
		this.graphics.fillText
		(
			text,
			pos.x, pos.y
		);
	}
}
