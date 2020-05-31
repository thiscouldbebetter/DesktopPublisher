
function FontNameAndHeight(fontName, heightInPixels)
{
	this.fontName = fontName;
	this.heightInPixels = heightInPixels;
}
{
	FontNameAndHeight.fromDeserializedObject = function(fontNameAndHeightAsObject)
	{
		return new FontNameAndHeight
		(
			fontNameAndHeightAsObject.fontName,
			parseInt(fontNameAndHeightAsObject.heightInPixels)
		);
	};

	FontNameAndHeight.prototype.toString = function()
	{
		return this.heightInPixels + "px " + this.fontName;
	};
}
