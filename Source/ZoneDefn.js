
class ZoneDefn
{
	constructor
	(
		name, pos, size, margin, pageOffsetNext, zoneNameNext,
		fontNameAndHeight, colorBack, colorBorder
	)
	{
		this.name = name;
		this.pos = pos;
		this.size = size;
		this.margin = margin;
		this.zoneNameNext = zoneNameNext;
		this.pageOffsetNext = pageOffsetNext;
		this.fontNameAndHeight = fontNameAndHeight;
		this.colorBack = colorBack;
		this.colorBorder = colorBorder;
	}

	sizeMinusMargin()
	{
		if (this._sizeMinusMargin == null)
		{
			this._sizeMinusMargin = this.size.clone().subtract
			(
				this.margin
			).subtract
			(
				this.margin
			);
		}
		return this._sizeMinusMargin;
	}

	unload()
	{
		delete this._sizeMinusMargin;
	}

	// serializable

	static fromDeserializedObject(zoneDefnAsObject)
	{
		var returnValue = new ZoneDefn
		(
			zoneDefnAsObject.name, 
			Coords.fromDeserializedObject(zoneDefnAsObject.pos), 
			Coords.fromDeserializedObject(zoneDefnAsObject.size), 
			Coords.fromDeserializedObject(zoneDefnAsObject.margin), 
			zoneDefnAsObject.pageOffsetNext, 
			zoneDefnAsObject.zoneNameNext, 
			FontNameAndHeight.fromDeserializedObject(zoneDefnAsObject.fontNameAndHeight)
		);

		return returnValue;
	}
}
