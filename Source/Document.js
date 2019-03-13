
function Document(name, pageSizeInPixels, fonts, pageDefns, contentBlocks, pages, contentAssignments)
{
	this.name = name;
	this.pageSizeInPixels = pageSizeInPixels;
	this.fonts = fonts.addLookups("name");
	this.pageDefns = pageDefns.addLookups("name");
	this.contentBlocks = contentBlocks.addLookups("name");
	this.pages = pages;
	this.contentAssignments = contentAssignments;
}

{
	Document.prototype.initialize = function()
	{
		var pages = this.pages;

		for (var i = 0; i < pages.length; i++)
		{
			var page = pages[i];
			page.initialize(this);
		}		
	}

	Document.prototype.update = function()
	{
		var pages = this.pages;

		for (var i = 0; i < pages.length; i++)
		{
			var page = pages[i];
			page.update(this);
		}		
	}

	// drawable

	Document.prototype.draw = function()
	{
		var pages = this.pages;

		for (var i = 0; i < pages.length; i++)
		{
			var page = pages[i];
			page.draw(this);
		}		
	}
	
	// serializable

	Document.fromDeserializedObject = function(documentAsObject)
	{
		var name = documentAsObject.name;

		var pageSizeInPixels = Coords.fromDeserializedObject
		(
			documentAsObject.pageSizeInPixels
		);

		var fonts = [];
		var fontsAsObjects = documentAsObject.fonts;
		for (var i = 0; i < fontsAsObjects.length; i++)
		{
			var fontAsObject = fontsAsObjects[i];
			var font = new Font(fontAsObject.name, fontAsObject.heightInPixels);
			fonts.push(font);
		}

		var pageDefns = [];
		var pageDefnsAsObjects = documentAsObject.pageDefns;
		for (var i = 0; i < pageDefnsAsObjects.length; i++)
		{
			var pageDefnAsObject = pageDefnsAsObjects[i];
			var pageDefn = PageDefn.fromDeserializedObject(pageDefnAsObject);
			pageDefns.push(pageDefn);
		}

		var contentBlocks = [];
		var contentBlocksAsObjects = documentAsObject.contentBlocks;
		for (var i = 0; i < contentBlocksAsObjects.length; i++)
		{
			var contentBlockAsObject = contentBlocksAsObjects[i];
			var contentBlock = ContentBlock.fromDeserializedObject
			(
				contentBlockAsObject
			);
			contentBlocks.push(contentBlock);
		}

		var pages = [];
		var pagesAsObjects = documentAsObject.pages;
		for (var i = 0; i < pagesAsObjects.length; i++)
		{
			var pageAsObject = pagesAsObjects[i];
			var page = Page.fromDeserializedObject(pageAsObject);
			pages.push(page);
		}

		var contentAssignments = [];
		var contentAssignmentsAsObjects = documentAsObject.contentAssignments;
		for (var i = 0; i < contentAssignmentsAsObjects.length; i++)
		{
			var contentAssignmentAsObject = contentAssignmentsAsObjects[i];
			var contentAssignment = ContentAssignment.fromDeserializedObject(contentAssignmentAsObject);
			contentAssignments.push(contentAssignment);
		}

		var returnValue = new Document
		(
			name,
			pageSizeInPixels,
			fonts,
			pageDefns,
			contentBlocks,
			pages,
			contentAssignments
		);

		return returnValue;
	}

	// tar

	Document.prototype.toTarFile = function()
	{
		var returnValue = TarFile.new();

		for (var i = 0; i < this.pages.length; i++)
		{
			var page = this.pages[i];
			page.draw(this, false);
			var pageAsImageBytes = page.display.toImageBytes();

			var pageAsTarFileEntry = TarFileEntry.fileNew
			(
				"Page" + i + ".png",
				pageAsImageBytes
			);

			returnValue.entries.push(pageAsTarFileEntry);
		}

		return returnValue;
	}

}
