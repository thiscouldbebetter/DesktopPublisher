
function ContentType(name, contentFromData)
{
	this.name = name;
	this.contentFromData = contentFromData;
}
{
	ContentType.Instances = function()
	{
		if (ContentType._instances == null)
		{
			ContentType._instances = new ContentType_Instances();
		}
		return ContentType._instances;
	};

	function ContentType_Instances()
	{
		this.Text = new ContentType
		(
			"Text", (document, data) => data
		);
		this.TextFile = new ContentType
		(
			"TextFile",
			(document, data) =>
			{
				return document.textFiles[data].text;
			}
		);

		this._All =
		[
			this.Text,
			this.TextFile
		].addLookups("name");
	}
}
