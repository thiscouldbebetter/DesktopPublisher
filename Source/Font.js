
function Font(name, sourcePath)
{
	this.name = name;
	this.sourcePath = sourcePath;
}
{
	Font.prototype.load = function(callback)
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
	};

	Font.prototype.unload = function()
	{
		delete this.isLoaded;
	}

}
