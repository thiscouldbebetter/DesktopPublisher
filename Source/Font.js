
function Font(name, heightInPixels)
{
	this.name = name;
	this.heightInPixels = heightInPixels;
}

{
	Font.prototype.toString = function()
	{
		return "" + this.sizeInPixels + "px " + this.name;
	}
}
