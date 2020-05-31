
function ZoneDefn(name, pos, size, margin, pageOffsetNext, zoneNameNext, fontNameAndHeight, colorBack, colorBorder)
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
	// serializable

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
			FontNameAndHeight.fromDeserializedObject(zoneDefnAsObject.fontNameAndHeight)
		);

		return returnValue;
	}
}
