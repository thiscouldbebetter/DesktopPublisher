
function Font(name, sourcePath)
{
	this.name = name;
	this.sourcePath = sourcePath;

	this.isLoaded = false;
	this.load();
}
{
	Font.prototype.load = function(callback)
	{
		var fontAsStyleElement = document.createElement("style");
		fontAsStyleElement.innerHTML = 
			"@font-face { "
			+ "font-family: '" + this.name + "';"
			+ "src: url('" + this.sourcePath + "');"; 
			+ "}";
		document.head.appendChild(fontAsStyleElement);
		this.isLoaded = true;
		if (callback != null)
		{
			callback(this);
		}
	};
}
