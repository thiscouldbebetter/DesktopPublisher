
function ZoneDefn(name, pos, size, margin, pageOffsetNext, zoneNameNext, fontName, colorBack, colorBorder)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.margin = margin;
	this.zoneNameNext = zoneNameNext;
	this.pageOffsetNext = pageOffsetNext;
	this.fontName = fontName;
	this.colorBack = colorBack;
	this.colorBorder = colorBorder;

	this.zoneNamePrev = null;

	this.sizeMinusMargin = this.size.clone().subtract
	(
		this.margin
	).subtract
	(
		this.margin
	);
}

{
	// serialzable

	ZoneDefn.fromDeserializedObject = function(zoneDefnAsObject)
	{
		var returnValue = new ZoneDefn
		(
			zoneDefnAsObject.name, 
			Coords.fromDeserializedObject(zoneDefnAsObject.pos), 
			Coords.fromDeserializedObject(zoneDefnAsObject.size), 
			Coords.fromDeserializedObject(zoneDefnAsObject.margin), 
			zoneDefnAsObject.pageOffsetNext, 
			zoneDefnAsObject.zoneNameNext, 
			zoneDefnAsObject.fontName
		);

		return returnValue;
	}
}
