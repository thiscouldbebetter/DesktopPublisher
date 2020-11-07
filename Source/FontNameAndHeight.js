
class FontNameAndHeight
{
	constructor(fontName, heightInPixels)
	{
		this.fontName = fontName;
		this.heightInPixels = heightInPixels;
	}

	static fromDeserializedObject(fontNameAndHeightAsObject)
	{
		return new FontNameAndHeight
		(
			fontNameAndHeightAsObject.fontName,
			parseInt(fontNameAndHeightAsObject.heightInPixels)
		);
	};

	toString()
	{
		return this.heightInPixels + "px " + this.fontName;
	};
}
