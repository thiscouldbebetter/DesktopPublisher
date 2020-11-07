
class PageSequence
{
	constructor(pageDefnNames)
	{
		this.pageDefnNames = pageDefnNames;
	}

	static fromDeserializedObject(pageSequenceAsObject)
	{
		return new PageSequence(pageSequenceAsObject.pageDefnNames);
	}

	draw(document, pageRange)
	{
		var pagesToDraw = this.pages.filter
		(
			(x, i) => i >= pageRange.min - 1 && i < pageRange.max
		);
		pagesToDraw.forEach(x => x.draw(document));
	}

	pageAdd(document)
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
	}

	unload()
	{
		this.pages.forEach(x => x.unload());
		delete this.pages;
	}

	update(document)
	{
		this.pages = [];

		var hasAnyContentNotYetBeenAssignedToPages = true;
		while (hasAnyContentNotYetBeenAssignedToPages)
		{
			var page = this.pageAdd(document);

			page.update(document, this);

			hasAnyContentNotYetBeenAssignedToPages = false; // todo
		}
	}

}
