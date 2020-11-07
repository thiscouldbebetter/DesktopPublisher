
class TextStringFromFile
{
	constructor(name, sourcePath, text)
	{
		this.name = name;
		this.sourcePath = sourcePath;
		this.text = text;
	}

	static fromDeserializedObject(textStringAsObject)
	{
		return new TextStringFromFile
		(
			textStringAsObject.name,
			textStringAsObject.sourcePath,
			textStringAsObject.text
		);
	}

	load()
	{
		// todo
	}

	unload()
	{
		delete this.text;
	}
}
