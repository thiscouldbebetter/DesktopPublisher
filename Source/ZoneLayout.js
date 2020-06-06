function ZoneLayout(document, pageSequence, page, zone)
{
	this.document = document;
	this.pageSequence = pageSequence;
	this.page = page;
	this.zone = zone;
}
{
	ZoneLayout.prototype.layOut = function()
	{
		this.zoneDefn = this.zone.defn(this.document, this.page);
		this.zoneSize = this.zoneDefn.sizeMinusMargin();

		this.content = this.zone.content(this.document);

		if (this.content == null)
		{
			return;
		}

		this.linesInZone = [];

		// hack
		this.display = new Display(new Coords(0, 0), false);
		this.display.initialize();

		var font = this.zoneDefn.fontNameAndHeight;
		this.fontSizeY = font.heightInPixels;

		this.lineCurrent = "";
		this.lineCurrentWidthSoFar = 0;
		this.zoneCurrentHeightSoFar = 0;
		this.wordCurrent = "";

		this.isInBlockQuote = false;
		this.isTextCenteredHorizontally = false;
		this.isTextCenteredVertically = false;
		this.isTextPaddedFromTop = false;

		this.imagesAwaitingLayout = [];

		this.contentCharIndex = 0;
		for (this.contentCharIndex = 0; this.contentCharIndex < this.content.length; this.contentCharIndex++)
		{
			this.contentChar = this.content[this.contentCharIndex];

			var shouldContinue = this.layOut_ContentChar_1();
			if (shouldContinue)
			{
				continue;
			}

			var shouldBreak = this.layOut_ContentChar_2();
			if (shouldBreak)
			{
				break;
			}
		}

		this.lineCurrent += this.wordCurrent;
		this.linesInZone.push(this.lineCurrent);

		this.zone.contentAsLines = this.linesInZone;
	};

	ZoneLayout.prototype.layOut_ContentChar_1 = function()
	{
		var shouldContinue = false;

		if (this.contentChar == " ")
		{
			this.lineCurrent += this.wordCurrent + " ";
			this.wordCurrent = "";
		}
		else if (this.contentChar == "\n") // newline
		{
			this.lineCurrent += this.wordCurrent + "\n";
			if (this.isTextCenteredHorizontally)
			{
				this.lineCurrent = this.lineCenter(this.lineCurrent);
			}
			this.wordCurrent = "";
			this.lineCurrentWidthSoFar = this.zoneSize.x;
		}
		else if (this.contentChar == "<") // control tag
		{
			var indexOfTagCloseChar = this.content.indexOf(">", this.contentCharIndex + 1);
			var controlCode = this.content.substring(this.contentCharIndex + 1, indexOfTagCloseChar);

			if (controlCode == "blockquote")
			{
				this.isInBlockQuote = true;
				this.zoneSize.x -= this.zoneDefn.margin.x;
			}
			else if (controlCode == "/blockquote")
			{
				this.isInBlockQuote = false;
				this.zoneSize.x += this.zoneDefn.margin.x;
			}
			else if (controlCode == "center")
			{
				this.isTextCenteredHorizontally = true;
			}
			else if (controlCode == "centerVertical")
			{
				this.isTextCenteredVertically = true;
			}
			else if (controlCode == "image")
			{
				// todo
				var image = new Image("../Content/Images/Test.png");
				image.load();
				this.imagesAwaitingLayout.push(image);
			}
			else if (controlCode == "left")
			{
				this.isTextCenteredHorizontally = false;
			}
			else if (controlCode == "padTop")
			{
				this.isTextPaddedFromTop = true;
			}
			else if (controlCode == "pageBreak") // formfeed
			{
				this.lineCurrent += this.wordCurrent + "\n";
				if (this.isTextCenteredHorizontally)
				{
					this.lineCurrent = this.lineCenter(this.lineCurrent);
				}
				if (this.isTextPaddedFromTop)
				{
					this.isTextPaddedFromTop = false;
					this.zoneCurrentHeightSoFar += this.fontSizeY;
					while (zoneCurrentHeightSoFar < this.zoneSize.y)
					{
						this.linesInZone.splice(0, 0, "\n");
						this.zoneCurrentHeightSoFar += this.fontSizeY;
					}
				}
				else if (this.isTextCenteredVertically)
				{
					this.isTextCenteredVertically = false;
					this.zoneCurrentHeightSoFar += this.fontSizeY;
					while (this.zoneCurrentHeightSoFar < this.zoneSize.y)
					{
						this.linesInZone.splice(0, 0, "\n");
						this.linesInZone.push("\n");
						this.zoneCurrentHeightSoFar += this.fontSizeY * 2;
					}
				}
				this.wordCurrent = "";
				this.lineCurrentWidthSoFar = this.zoneSize.x;
				this.zoneCurrentHeightSoFar = this.zoneSize.y;
			}

			else
			{
				throw "Unrecognized control code: " + controlCode;
			}

			this.contentCharIndex += controlCode.length + 1;
			//continue; // hack
			shouldContinue = true;
		}
		else
		{
			this.wordCurrent += this.contentChar;

			var widthOfContentChar = this.display.widthOfText(this.contentChar);
			this.lineCurrentWidthSoFar += widthOfContentChar;
		}
		return shouldContinue;
	};
	
	ZoneLayout.prototype.layOut_ContentChar_2 = function()
	{
		var shouldBreak = false;
		if (this.lineCurrentWidthSoFar >= this.zoneSize.x)
		{
			this.zoneCurrentHeightSoFar += this.fontSizeY;

			if (this.zoneCurrentHeightSoFar >= this.zoneSize.y)
			{
				// Create a new page.
				var pageIndex = this.page.pageIndex;
				var pageIndexNext = pageIndex + this.zoneDefn.pageOffsetNext;
				var pageNext = this.pageSequence.pages[pageIndexNext];
				if (pageNext == null)
				{
					pageNext = this.pageSequence.pageAdd(this.document);
				}
				this.page = pageNext;
				var zoneNextName = this.zoneDefn.zoneNameNext;
				var zoneNext = pageNext.zones[zoneNextName];
				if (zoneNext != null)
				{
					zoneNext._content =
						this.wordCurrent
						+ this.content.substr(this.contentCharIndex + 1);
					if (this.zone._content != zoneNext._content)
					{
						this.wordCurrent = "";
						zoneNext.update(this.document, this.pageSequence, this.page);
					}
					// break;
					shouldBreak = true;
					return shouldBreak;
				}
			}

			if (this.isTextCenteredHorizontally)
			{
				this.lineCurrent =
					this.lineCenter(this.lineCurrent);
			}

			this.linesInZone.push(this.lineCurrent);
			this.lineCurrent = "" + this.wordCurrent;

			this.lineCurrentWidthSoFar =
				this.display.widthOfText(this.wordCurrent);

			this.wordCurrent = "";
		}

		return shouldBreak;
	};

	ZoneLayout.prototype.lineCenter = function(lineToCenter)
	{
		while (this.display.widthOfText(lineToCenter) < this.zoneSize.x)
		{
			lineToCenter = " " + lineToCenter + " ";
		}
		return lineToCenter;
	};
}
