
function Page(pageIndex, defnName)
{
	this.pageIndex = pageIndex;
	this.defnName = defnName;
}

{
	Page.prototype.defn = function(document)
	{
		return document.pageDefns[this.defnName];
	};

	Page.prototype.unload = function()
	{
		this.zones.forEach(x => x.unload());
		delete this.zones;
	};

	Page.prototype.update = function(document, pageSequence)
	{
		this.zonesBuild(document);

		var defn = this.defn(document);
		var zoneDefns = defn.zoneDefns;

		var contentAssignments = document.contentAssignments;

		var pageIndex = this.pageIndex;

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
			zone.update(document, pageSequence, this);
		}
	};

	Page.prototype.zonesBuild = function(document)
	{
		var defn = this.defn(document);

		if (this.zones == null)
		{
			this.zones = defn.zoneDefns.map(x => new Zone(x.name));
			this.zones.addLookups("defnName");
		}
	};

	// drawable

	Page.prototype.draw = function(document)
	{
		var displaySizeInPixels = document.pageSizeInPixels;
		this.display = new Display(displaySizeInPixels);
		this.display.initialize();

		this.display.clear();

		this.zones.forEach(x => x.draw(document, this));
	};

	// serializable

	Page.fromDeserializedObject = function(pageAsObject)
	{
		var returnValue = new Page
		(
			pageAsObject.defnName,
			zonesAsObjects.map(x => Zone.fromDeserializedObject(x))
		);

		return returnValue;
	};

}
