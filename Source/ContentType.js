
class ContentType
{
	constructor(name, contentFromData)
	{
		this.name = name;
		this.contentFromData = contentFromData;
	}

	static Instances = function()
	{
		if (ContentType._instances == null)
		{
			ContentType._instances = new ContentType_Instances();
		}
		return ContentType._instances;
	}
}

class ContentType_Instances
{
	constructor()
	{
		this.NumberSequence = new ContentType
		(
			"NumberSequence",
			(document, data) => 
			{
				var returnValue = "";
				var numberRangeAndStartOffsetAsString = data;
				var numberRangeAndStartOffsetAsStrings =
					numberRangeAndStartOffsetAsString.split(";");
				var numberRangeAsString = numberRangeAndStartOffsetAsStrings[0];
				var startOffsetAsString = numberRangeAndStartOffsetAsStrings[1] || "0";
				var startOffset = parseInt(startOffsetAsString);
				for (var i = 0; i < startOffset; i++)
				{
					returnValue += "\n";
				}
				var numberMinAndMaxAsStrings = numberRangeAsString.split("-");
				var numberMin = parseInt(numberMinAndMaxAsStrings[0]);
				var numberMax = parseInt(numberMinAndMaxAsStrings[1]);
				for (var i = numberMin; i <= numberMax; i++)
				{
					returnValue += i + "\n";
				}
				return returnValue;
			}
		);

		this.Text = new ContentType
		(
			"Text", (document, data) => data
		);

		this.TextFile = new ContentType
		(
			"TextFile",
			(document, data) =>
			{
				return document.contentFiles[data].text;
			}
		);

		this._All =
		[
			this.NumberSequence,
			this.Text,
			this.TextFile
		].addLookups("name");
	}
}
