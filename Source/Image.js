
class Image
{
	constructor(name, sourcePath, size)
	{
		this.name = name;
		this.sourcePath = sourcePath;
		this.size = size;
	}

	load(callback)
	{
		var d = document;
		var imgElement = d.createElement("img");
		imgElement.onload = () =>
		{
			callback(this);
		}
		this.systemImage = imgElement;
		imgElement.src = this.sourcePath;
		
		if (this.sourcePath.startsWith("data:"))
		{
			// Data Uris don't need to load asynchronously.
			callback(this);
		}
	}

	// ControlCode.

	static fromControlTag(imageAsControlTag)
	{
		var controlCodeAndAttributes = imageAsControlTag.split(" ");

		var imageSourceAttribute =
			controlCodeAndAttributes.filter(x => x.startsWith("src="))[0];
		var imageSourcePathQuoted = imageSourceAttribute.split("=")[1];
		var imageSourcePath =
			imageSourcePathQuoted.substr(0, imageSourcePathQuoted.length - 1).substr(1);

		var imageSizeAttribute =
			controlCodeAndAttributes.filter(x => x.startsWith("size="))[0];
		var imageSizeAsStringQuoted = imageSizeAttribute.split("=")[1];
		var imageSizeAsString =
			imageSizeAsStringQuoted.substr(0, imageSizeAsStringQuoted.length - 1).substr(1);
		var imageSizeXYAsStrings = imageSizeAsString.split(",");
		var imageSizeX = parseInt(imageSizeXYAsStrings[0]);
		var imageSizeY = parseInt(imageSizeXYAsStrings[1]);
		var imageSize = new Coords(imageSizeX, imageSizeY);

		var image = new Image(imageSourcePath, imageSourcePath, imageSize);

		return image;
	}

	toControlTag()
	{
		var returnValue =
			"<image src='"
			+ this.sourcePath
			+ "' size='"
			+ this.size.toString()
			+ "' />";
		return returnValue;
	}

	// Serializable.

	toBytes(callback)
	{
		this.load
		(
			imageLoaded =>
			{
				// hack
				var imageDataAsBase64 = this.sourcePath.split(",")[1];
				var imageAsBytesAsString = atob(imageDataAsBase64);
				var imageAsBytes = imageAsBytesAsString.split(",").map(x => parseInt(x))
				callback(imageAsBytes);
			}
		);
	}
}
