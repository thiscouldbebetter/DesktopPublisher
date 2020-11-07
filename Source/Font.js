
class Font
{
	constructor(name, sourcePath)
	{
		this.name = name;
		this.sourcePath = sourcePath;
	}

	load(callback)
	{
		var fontFace = new FontFace
		(
			this.name,
			"url(" + this.sourcePath + ")"
		);
		var font = this;
		fontFace.loaded.then
		(
			() => 
			{
				font.isLoaded = true;
				if (callback != null)
				{
					callback(font);
				};
			},
		);
		document.fonts.add(fontFace);
		fontFace.load();
	}

	unload()
	{
		delete this.isLoaded;
	}

}
