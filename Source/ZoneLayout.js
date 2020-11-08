class ZoneLayout
{
	constructor(document, pageSequence, page, zone)
	{
		this.document = document;
		this.pageSequence = pageSequence;
		this.page = page;
		this.zone = zone;
	}

	layOut()
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

			var mightNewZoneBeNeeded = this.layOut_ContentChar_1_Handle();
			if (mightNewZoneBeNeeded)
			{
				var shouldBreak = this.layOut_ContentChar_2_ZoneNewIfNeeded();
				if (shouldBreak)
				{
					break;
				}
			}

			while (this.imagesAwaitingLayout.length > 0)
			{
				var imageToLayOut = this.imagesAwaitingLayout[0];
				this.imagesAwaitingLayout.splice(0, 1);
				var imageAsControlCode = imageToLayOut.toControlTag();
				this.linesInZone.push(imageAsControlCode);
				this.zoneCurrentHeightSoFar += imageToLayOut.size.y;
			}
		}

		this.lineCurrent += this.wordCurrent;
		this.linesInZone.push(this.lineCurrent);

		this.zone.contentAsLines = this.linesInZone;
	}

	layOut_ContentChar_1_Handle()
	{
		var mightNewZoneBeNeeded = true;

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
			mightNewZoneBeNeeded = this.layOut_ContentChar_1_Handle_ControlCodes();
		}
		else
		{
			this.wordCurrent += this.contentChar;

			var widthOfContentChar = this.display.widthOfText(this.contentChar);
			this.lineCurrentWidthSoFar += widthOfContentChar;
		}

		return mightNewZoneBeNeeded;
	}

	layOut_ContentChar_1_Handle_ControlCodes()
	{
		var mightNewZoneBeNeeded = false;

		var indexOfTagCloseChar = this.content.indexOf(">", this.contentCharIndex + 1);
		if (indexOfTagCloseChar == -1)
		{
			throw "Unclosed control code!";
		}
		var controlTag = this.content.substring(this.contentCharIndex + 1, indexOfTagCloseChar);
		var controlCodeAndAttributes = controlTag.split(" ");
		var controlCode = controlCodeAndAttributes[0];

		if (controlCode == ContentControlCodes.Blockquote)
		{
			this.isInBlockQuote = true;
			this.zoneSize.x -= this.zoneDefn.margin.x;
		}
		else if (controlCode == ContentControlCodes.BlockquoteClose)
		{
			this.isInBlockQuote = false;
			this.zoneSize.x += this.zoneDefn.margin.x;
		}
		else if (controlCode == ContentControlCodes.Center)
		{
			this.isTextCenteredHorizontally = true;
		}
		else if (controlCode == ContentControlCodes.CenterVertical)
		{
			this.isTextCenteredVertically = true;
		}
		else if (controlCode == ContentControlCodes.Image)
		{
			var image = Image.fromControlTag(controlTag);
			this.imagesAwaitingLayout.push(image);
		}
		else if (controlCode == ContentControlCodes.Left)
		{
			this.isTextCenteredHorizontally = false;
		}
		else if (controlCode == ContentControlCodes.LessThan)
		{
			// todo
			// Need to add escape code instead of the literal "<",
			// but it needs to subsequently be measured as the "<" would be.
			this.contentChar = "<";
			this.wordCurrent += this.controlChar;

			var widthOfContentChar = this.display.widthOfText(this.contentChar);
			this.lineCurrentWidthSoFar += widthOfContentChar;
		}
		else if (controlCode == ContentControlCodes.PadTop)
		{
			this.isTextPaddedFromTop = true;
		}
		else if (controlCode == ContentControlCodes.PageBreak) // formfeed
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
				while (this.zoneCurrentHeightSoFar < this.zoneSize.y)
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
			mightNewZoneBeNeeded = true;
		}
		else
		{
			throw "Unrecognized control code: " + controlCode;
		}

		this.contentCharIndex += controlTag.length + 1;

		return mightNewZoneBeNeeded;
	}

	layOut_ContentChar_2_ZoneNewIfNeeded()
	{
		var shouldBreak = false;

		if (this.lineCurrentWidthSoFar >= this.zoneSize.x)
		{
			this.zoneCurrentHeightSoFar += this.fontSizeY;

			if (this.zoneCurrentHeightSoFar >= this.zoneSize.y)
			{
				var zoneNextName = this.zoneDefn.zoneNameNext;

				if (this.zoneDefn.pageOffsetNext > 0)
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
				}

				var zoneNext = this.page.zones[zoneNextName];
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
	}

	lineCenter(lineToCenter)
	{
		while (this.display.widthOfText(lineToCenter) < this.zoneSize.x)
		{
			lineToCenter = " " + lineToCenter + " ";
		}
		return lineToCenter;
	}
}

class ContentControlCodes
{
	static Blockquote = "blockquote";
	static BlockquoteClose = "/blockquote";
	static Center = "center";
	static CenterVertical = "centerVertical";
	static Image = "image";
	static Left = "left";
	static LessThan = "lessThan";
	static PadTop = "padTop";
	static PageBreak = "pageBreak";
}
