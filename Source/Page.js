
function Page(defnName, zones)
{
	this.defnName = defnName;
	this.zones = zones;
}

{
	Page.prototype.defn = function(document)
	{
		return document.pageDefns[this.defnName];
	}

	Page.prototype.initialize = function(document)
	{
		this.zonesBuild(document);
	}

	Page.prototype.update = function(document)
	{		
		var defn = this.defn(document);
		var zoneDefns = defn.zoneDefns;

		var contentAssignments = document.contentAssignments;

		var pageIndex = document.pages.indexOf(this);

		for (var i = 0; i < contentAssignments.length; i++)
		{
			var contentAssignment = contentAssignments[i];
			if (pageIndex == contentAssignment.pageIndex)
			{
				var contentBlockName = contentAssignment.contentBlockName;
				var contentBlock = document.contentBlocks[contentBlockName];
				var zoneDefnName = contentAssignment.zoneDefnName;
				var zoneDefn = zoneDefns[zoneDefnName];			
				var zoneIndex = zoneDefns.indexOf(zoneDefn);
				var zone = this.zones[zoneIndex];
				zone.contentBlockName = contentBlockName;
			}
		}

		for (var i = 0; i < this.zones.length; i++)
		{
			var zone = this.zones[i];
			zone.update(document, this);
		}
	}

	Page.prototype.zonesBuild = function(document)
	{
		var defn = this.defn(document);

		if (this.zones == null)
		{
			var zoneDefns = defn.zoneDefns;

			var zones = [];

			for (var i = 0; i < zoneDefns.length; i++)
			{
				var zoneDefn = zoneDefns[i];
				var zone = new Zone(zoneDefn.name);
				zones.push(zone);
			}

			this.zones = zones;
		}
	}

	// drawable

	Page.prototype.draw = function(document, renderToScreen)
	{
		var displaySizeInPixels = document.pageSizeInPixels;
		this.display = new Display(displaySizeInPixels, renderToScreen);
		this.display.initialize();

		this.display.clear();

		var zones = this.zones;

		for (var i = 0; i < zones.length; i++)
		{
			var zone = zones[i];
			zone.draw(document, this);
		}		
	}

	// serializable

	Page.fromDeserializedObject = function(pageAsObject)
	{
		var zones = null;

		var zonesAsObjects = pageAsObject.zones;
		if (zonesAsObjects != null)
		{
			zones = [];

			for (var i = 0; i < zonesAsObjects.length; i++)
			{
				var zoneAsObject = zonesAsObjects[i];
				var zone = Zone.fromDeserializedObject(zoneAsObject);
				zones.push(zone);
			}
		}

		var returnValue = new Page
		(
			pageAsObject.defnName,
			zones
		);

		return returnValue;
	}

}
