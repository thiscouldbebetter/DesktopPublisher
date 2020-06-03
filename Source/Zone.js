
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

	Zone.prototype.update = function(document, pageSequence, page)
	{
		var zoneDefn = this.defn(document, page);
		var zoneSize = zoneDefn.sizeMinusMargin();

		var content = this.content(document);

		if (content == null)
		{
			return;
		}

		var linesInZone = [];

		// hack
		var display = new Display(new Coords(0, 0), false);
		display.initialize();

		var font = zoneDefn.fontNameAndHeight;
		var fontSizeY = font.heightInPixels;

		var lineCurrent = "";
		var lineCurrentWidthSoFar = 0;
		var zoneCurrentHeightSoFar = 0;
		var wordCurrent = "";

		var isInBlockQuote = false;
		var isTextCenteredHorizontally = false;
		var isTextCenteredVertically = false;
		var isTextPaddedFromTop = false;

		for (var i = 0; i < content.length; i++)
		{
			var contentChar = content[i];

			if (contentChar == " ")
			{
				lineCurrent += wordCurrent + " ";
				wordCurrent = "";
			}
			else if (contentChar == "\n") // newline
			{
				lineCurrent += wordCurrent + "\n";
				if (isTextCenteredHorizontally)
				{
					lineCurrent = this.lineCenter(lineCurrent, zoneDefn, display);
				}
				wordCurrent = "";
				lineCurrentWidthSoFar = zoneSize.x;
			}
			else if (contentChar == "<") // control tag
			{
				var indexOfTagCloseChar = content.indexOf(">", i + 1);
				var controlCode = content.substring(i + 1, indexOfTagCloseChar);

				if (controlCode == "blockquote")
				{
					isInBlockQuote = true;
					zoneSize.x -= zoneDefn.margin.x;
				}
				else if (controlCode == "/blockquote")
				{
					isInBlockQuote = false;
					zoneSize.x += zoneDefn.margin.x;
				}
				else if (controlCode == "center")
				{
					isTextCenteredHorizontally = true;
				}
				else if (controlCode == "centerVertical")
				{
					isTextCenteredVertically = true;
				}
				else if (controlCode == "left")
				{
					isTextCenteredHorizontally = false;
				}
				else if (controlCode == "padTop")
				{
					isTextPaddedFromTop = true;
				}
				else if (controlCode == "pageBreak") // formfeed
				{
					lineCurrent += wordCurrent + "\n";
					if (isTextCenteredHorizontally)
					{
						lineCurrent = this.lineCenter(lineCurrent, zoneDefn, display);
					}
					if (isTextPaddedFromTop)
					{
						isTextPaddedFromTop = false;
						zoneCurrentHeightSoFar += fontSizeY;
						while (zoneCurrentHeightSoFar < zoneSize.y)
						{
							linesInZone.splice(0, 0, "\n");
							zoneCurrentHeightSoFar += fontSizeY;
						}
					}
					else if (isTextCenteredVertically)
					{
						isTextCenteredVertically = false;
						zoneCurrentHeightSoFar += fontSizeY;
						while (zoneCurrentHeightSoFar < zoneSize.y)
						{
							linesInZone.splice(0, 0, "\n");
							linesInZone.push("\n");
							zoneCurrentHeightSoFar += fontSizeY * 2;
						}
					}
					wordCurrent = "";
					lineCurrentWidthSoFar = zoneSize.x;
					zoneCurrentHeightSoFar = zoneSize.y;
				}

				else
				{
					throw "Unrecognized control code: " + controlCode;
				}

				i += controlCode.length + 1;
				continue; // hack
			}
			else
			{
				wordCurrent += contentChar;

				var widthOfContentChar = display.widthOfText(contentChar);
				lineCurrentWidthSoFar += widthOfContentChar;
			}

			if (lineCurrentWidthSoFar >= zoneSize.x)
			{
				zoneCurrentHeightSoFar += fontSizeY;

				if (zoneCurrentHeightSoFar >= zoneSize.y)
				{
					// Create a new page.
					var pageIndex = page.pageIndex;
					var pageIndexNext = pageIndex + zoneDefn.pageOffsetNext;
					var pageNext = pageSequence.pages[pageIndexNext];
					if (pageNext == null)
					{
						pageNext = pageSequence.pageAdd(document);
					}
					page = pageNext;
					var zoneNextName = zoneDefn.zoneNameNext;
					var zoneNext = pageNext.zones[zoneNextName];
					if (zoneNext != null)
					{
						zoneNext._content = wordCurrent + content.substr(i + 1);
						if (this._content != zoneNext._content)
						{
							wordCurrent = "";
							zoneNext.update(document, pageSequence, page);
						}
						break;
					}
				}

				if (isTextCenteredHorizontally)
				{
					lineCurrent = this.lineCenter(lineCurrent, zoneDefn, display);
				}

				linesInZone.push(lineCurrent);
				lineCurrent = "" + wordCurrent;

				lineCurrentWidthSoFar = display.widthOfText(wordCurrent);

				wordCurrent = "";
			}
		}

		lineCurrent += wordCurrent;
		linesInZone.push(lineCurrent);

		this.contentAsLines = linesInZone;
	};

	Zone.prototype.lineCenter = function(lineToCenter, zoneDefn, display)
	{
		while (display.widthOfText(lineToCenter) < zoneDefn.sizeMinusMargin().x)
		{
			lineToCenter = " " + lineToCenter + " ";
		}
		return lineToCenter;
	};

	Zone.prototype.unload = function()
	{
		delete this._content;
		delete this.contentAsLines;
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
