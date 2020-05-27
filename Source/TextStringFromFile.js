function TextStringFromFile(name, sourcePath)
{
	this.name = name;
	this.sourcePath = sourcePath;
}
{
	TextStringFromFile.fromDeserializedObject = function(textStringAsObject)
	{
		return new TextStringFromFile
		(
			textStringAsObject.name,
			textStringAsObject.sourcePath
		);
	};

	TextStringFromFile.loadMany = function(textStrings, callback)
	{
		for (var i = 0; i < textStrings.length; i++)
		{
			var textString = textStrings[i];
			textString.load(x => {});
		}

		var timer = setInterval
		(
			function()
			{
				var areAnyTextStringsNotLoaded = textStrings.some(x => x.text == null);
				if (areAnyTextStringsNotLoaded == false)
				{
					clearInterval(timer);
					callback();
				}
			},
			100 // milliseconds
		)
	};

	TextStringFromFile.prototype.load = function(callback)
	{
		var textStringFromFile = this;

		var xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open("GET", this.sourcePath);
		xmlHttpRequest.onreadystatechange = function(event)
		{
			if (xmlHttpRequest.readyState === XMLHttpRequest.DONE)
			{
				textStringFromFile.text = xmlHttpRequest.responseText;
				callback(textStringFromFile);
			}
		};
		xmlHttpRequest.send();
	};
}