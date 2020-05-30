
function Zone(defnName)
{
	this.defnName = defnName;
}

{
	Zone.prototype.content = function(document)
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
	};

	Zone.prototype.defn = function(document, page)
	{
		var pageDefn = page.defn(document);
		var returnValue = pageDefn.zoneDefns[this.defnName];
		return returnValue;
	};

	Zone.prototype.update = function(document, page)
	{
		var zoneDefn = this.defn(document, page);

		var content = this.content(document);

		if (content == null)
		{
			return;
		}

		var contentAsLines = [];

		// hack
		var display = new Display(new Coords(0, 0), false);
		display.initialize();

		var fontName = zoneDefn.fontName;
		if (fontName == null)
		{
			fontName = document.fonts[0].name;
		}
		var font = document.fonts[fontName];
		var fontSizeY = font.heightInPixels;
		var charOffset = new Coords(0, 0);

		var lineCurrent = "";
		var wordCurrent = "";

		for (var i = 0; i < content.length; i++)
		{
			var contentChar = content[i];

			wordCurrent += contentChar;

			var widthOfContentChar = display.widthOfText
			(
				contentChar
			);
			charOffset.x += widthOfContentChar;

			if (contentChar == " ")
			{
				lineCurrent += wordCurrent;
				wordCurrent = "";
			}
			else if (contentChar == "\n")
			{
				lineCurrent += wordCurrent + "\n";
				wordCurrent = "";
				charOffset.x = zoneDefn.sizeMinusMargin.x;
			}

			if (charOffset.x >= zoneDefn.sizeMinusMargin.x)
			{
				charOffset.y += fontSizeY;

				if (charOffset.y >= zoneDefn.sizeMinusMargin.y)
				{
					var pageIndex = document.pages.indexOf(page);
					var pageIndexNext = pageIndex + zoneDefn.pageOffsetNext;
					var pageNext = document.pages[pageIndexNext];
					if (pageNext == null)
					{
						break;
					}
					page = pageNext;
					var zoneNextName = zoneDefn.zoneNameNext;
					var zoneNext = pageNext.zones[zoneNextName];
					if (zoneNext != null)
					{
						zoneNext._content = 
							wordCurrent 
							+ content.substr(i + 1);
						wordCurrent = "";
						zoneNext.update(document, page);
						break;
					}
				}

				contentAsLines.push(lineCurrent);
				lineCurrent = "" + wordCurrent;

				charOffset.x = display.widthOfText(wordCurrent);

				wordCurrent = "";
			}
		}

		lineCurrent += wordCurrent;
		contentAsLines.push(lineCurrent);

		this.contentAsLines = contentAsLines;
	};

	// drawable

	Zone.prototype.draw = function(document, page)
	{
		var zone = this;
		var zoneDefn = zone.defn(document, page);

		var display = page.display;
		var drawPos = display.drawPos;

		var zonePos = zoneDefn.pos;
		var zoneSize = zoneDefn.size;
		var zoneMargin = zoneDefn.margin;
		var zoneSizeMinusMargin = zoneDefn.sizeMinusMargin;

		display.drawRectangle(zonePos, zoneSize, zoneDefn.colorBack, zoneDefn.colorBorder);

		var contentAsLines = zone.contentAsLines;

		if (contentAsLines != null)
		{	
			var fontName = zoneDefn.fontName;
			if (fontName == null)
			{
				fontName = document.fonts[0].name;
			}
			var font = document.fonts[fontName];
			var fontSizeY = font.heightInPixels;
			display.fontSet(font);

			for (var i = 0; i < contentAsLines.length; i++)
			{
				var contentLine = contentAsLines[i];

				var widthOfWhitespaceBetweenCharacters;

				if (contentLine.indexOf("\n") >= 0)
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

				contentLine = contentLine.trim();

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
	};

	// serializable

	Zone.fromDeserializedObject = function(zoneAsObject)
	{
		var returnValue = new Zone
		(
			zoneAsObject.defnName
		);

		return returnValue;
	};
}
