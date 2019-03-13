
function Coords(x, y)
{
	this.x = x;
	this.y = y;
}

{
	Coords.prototype.clone = function()
	{
		return new Coords(this.x, this.y);
	}

	Coords.prototype.overwriteWithXY = function(x, y)
	{
		this.x = x;
		this.y = y;
		return this;
	}

	Coords.prototype.subtract = function(other)
	{
		this.x -= other.x;
		this.y -= other.y;
		return this;
	}

	// serializable

	Coords.fromDeserializedObject = function(coordsAsObject)
	{
		return new Coords(coordsAsObject.x, coordsAsObject.y);
	}
}
