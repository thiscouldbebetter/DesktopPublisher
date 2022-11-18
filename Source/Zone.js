
class Zone
{
	constructor(defnName)
	{
		this.defnName = defnName;
	}

	content(document)
	{
		if (this._content == null)
		{
			var contentBlock = document.contentBlocks[this.contentBlockName];
			if (contentBlock != null)
			{
				this._content = contentBlock.content(document);
			}
		}

		return this._content;
	}

	defn(document, page)
	{
		var pageDefn = page.defn(document);
		var returnValue = pageDefn.zoneDefns[this.defnName];
		return returnValue;
	}

	update(document, pageSequence, page)
	{
		var zoneLayout = new ZoneLayout(document, pageSequence, page, this);
		zoneLayout.layOut();
	}

	unload()
	{
		delete this._content;
		delete this.contentAsLines;
	}

	// drawable

	draw(document, page)
	{
		var zone = this;
		var zoneDefn = zone.defn(document, page);

		var display = page.display;
		var drawPos = display.drawPos;

		var zonePos = zoneDefn.pos;
		var zoneSize = zoneDefn.size;
		var zoneMargin = zoneDefn.margin;
		var zoneSizeMinusMargin = zoneDefn.sizeMinusMargin();

		display.drawRectangle(zonePos, zoneSize, zoneDefn.colorBack, zoneDefn.colorBorder);

		var contentAsLines = zone.contentAsLines;

		if (contentAsLines == null)
		{
			return;
		}

		var fontNameAndHeight = zoneDefn.fontNameAndHeight;
		var fontName = fontNameAndHeight.fontName;
		display.fontSet(fontNameAndHeight);
		var fontSizeY = fontNameAndHeight.heightInPixels;

		for (var i = 0; i < contentAsLines.length; i++)
		{
			var contentLine = contentAsLines[i];

			var widthOfWhitespaceBetweenCharacters;

			if (contentLine.startsWith("<"))
			{
				if (contentLine.startsWith("<image"))
				{
					var image = Image.fromControlTag(contentLine);
					image.load
					(
						() =>
						{
							drawPos.overwriteWithXY
							(
								zonePos.x + zoneMargin.x,
								zonePos.y + zoneMargin.y
							);

							display.drawImage(image, drawPos, image.size);
						}
					);

				}
			}
			else if (contentLine.indexOf("\n") >= 0)
			{
				widthOfWhitespaceBetweenCharacters = 0;
			}
			else
			{
				contentLine = contentLine.trim();

				var widthOfLineBeforeJustification = display.widthOfText
				(
					contentLine
				);

				var widthOfWhitespaceBetweenCharacters = 
					(
						zoneSizeMinusMargin.x 
						- widthOfLineBeforeJustification
					)
					/ (contentLine.length - 1); 
			}

			var charOffsetX = 0;

			for (var j = 0; j < contentLine.length; j++)
			{
				var contentChar = contentLine[j];

				drawPos.overwriteWithXY
				(
					zonePos.x + zoneMargin.x + charOffsetX,
					zonePos.y + zoneMargin.y + fontSizeY * (i + 1)
				);

				display.drawText(contentChar, drawPos);

				var widthOfChar = display.widthOfText
				(
					contentChar
				);

				charOffsetX += 
					widthOfChar
					+ widthOfWhitespaceBetweenCharacters;
			}
		}
	}

	// serializable

	static fromDeserializedObject(zoneAsObject)
	{
		var returnValue = new Zone
		(
			zoneAsObject.defnName
		);

		return returnValue;
	}
}
