
function PageSequence(pageDefnNames)
{
	this.pageDefnNames = pageDefnNames;
}
{
	PageSequence.fromDeserializedObject = function(pageSequenceAsObject)
	{
		return new PageSequence(pageSequenceAsObject.pageDefnNames);
	};

	PageSequence.prototype.draw = function(document, pageRange)
	{
		var pagesToDraw = this.pages.filter
		(
			(x, i) => i >= pageRange.min - 1 && i < pageRange.max
		);
		pagesToDraw.forEach(x => x.draw(document));
	}

	PageSequence.prototype.pageAdd = function(document)
	{
		this.pageDefnNameIndex = this.pageDefnNameIndex || 0;
		var pageDefnName = this.pageDefnNames[this.pageDefnNameIndex];
		this.pageDefnNameIndex++;
		if (this.pageDefnNameIndex >= this.pageDefnNames.length)
		{
			this.pageDefnNameIndex = 0;
		}
		var page = new Page
		(
			this.pages.length, pageDefnName
		);
		page.zonesBuild(document);
		this.pages.push(page);
		return page;
	};

	PageSequence.prototype.unload = function()
	{
		this.pages.forEach(x => x.unload());
		delete this.pages;
	};

	PageSequence.prototype.update = function(document)
	{
		this.pages = [];

		var hasAnyContentNotYetBeenAssignedToPages = true;
		while (hasAnyContentNotYetBeenAssignedToPages)
		{
			var page = this.pageAdd(document);

			page.update(document, this);

			hasAnyContentNotYetBeenAssignedToPages = false; // todo
		}
	};

}
