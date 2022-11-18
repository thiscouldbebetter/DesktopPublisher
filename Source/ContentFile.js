
class ContentFile
{
	static fromNameAndBytes(name, bytes, callback)
	{
		var returnValue = null;

		if (name.endsWith(".txt") )
		{
			var contentAsString =
				ByteHelper.bytesToStringUTF8(bytes);

			returnValue = new TextStringFromFile
			(
				name,
				name, // sourcePath
				contentAsString
			);
		}
		else if (name.endsWith(".jpg") )
		{
			var contentAsString =
				"data:image/jpg;base64,"
				+ btoa(bytes);

			var size = null; // todo

			returnValue = new Image(name, contentAsString, size);
		}
		else
		{
			throw new Error("Unrecognized file extension: " + name);
		}

		returnValue.load(callback);
	}
}
