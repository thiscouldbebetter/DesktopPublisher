
class PageDefn
{
	constructor(name, zoneDefns)
	{
		this.name = name;
		this.zoneDefns = zoneDefns.addLookups("name");

		for (var z = 0; z < this.zoneDefns.length; z++)
		{
			var zoneDefn = this.zoneDefns[z];
			var zoneDefnNameNext = zoneDefn.zoneDefnNameNext;
			if (zoneDefnNameNext != null)
			{
				zoneDefnNext = this.zoneDefns[zoneDefnNameNext];
				zoneDefnNext.zoneDefnNamePrev = zoneDefn.name;
			}
		}
	}

	unload()
	{
		this.zoneDefns.forEach(x => x.unload());
	}

	// serializable

	static fromDeserializedObject(pageDefnAsObject)
	{
		var zoneDefns = [];

		var zoneDefnsAsObjects = pageDefnAsObject.zoneDefns;
		for (var i = 0; i < zoneDefnsAsObjects.length; i++)
		{
			var zoneDefnAsObject = zoneDefnsAsObjects[i];
			var zoneDefn = ZoneDefn.fromDeserializedObject(zoneDefnAsObject);
			zoneDefns.push(zoneDefn);
		}

		var returnValue = new PageDefn(pageDefnAsObject.name, zoneDefns);

		return returnValue;
	}
}
