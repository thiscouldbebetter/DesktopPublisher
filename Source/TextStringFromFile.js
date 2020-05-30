function TextStringFromFile(name, sourcePath, text)
{
	this.name = name;
	this.sourcePath = sourcePath;
	this.text = text;
}
{
	TextStringFromFile.fromDeserializedObject = function(textStringAsObject)
	{
		return new TextStringFromFile
		(
			textStringAsObject.name,
			textStringAsObject.sourcePath,
			textStringAsObject.text
		);
	};

	TextStringFromFile.prototype.unload = function()
	{
		delete this.text;
	};
}
