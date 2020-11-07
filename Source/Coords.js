
class Coords
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}

	clone()
	{
		return new Coords(this.x, this.y);
	}

	overwriteWithXY(x, y)
	{
		this.x = x;
		this.y = y;
		return this;
	}

	subtract(other)
	{
		this.x -= other.x;
		this.y -= other.y;
		return this;
	}

	// serializable

	static fromDeserializedObject(coordsAsObject)
	{
		return new Coords(coordsAsObject.x, coordsAsObject.y);
	}
}
