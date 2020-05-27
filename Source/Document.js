
function Document
(
	name,
	pageSizeInPixels,
	fonts,
	pageDefns,
	textFiles,
	contentBlocks,
	pages,
	contentAssignments
)
{
	this.name = name;
	this.pageSizeInPixels = pageSizeInPixels;
	this.fonts = fonts.addLookups("name");
	this.pageDefns = pageDefns.addLookups("name");
	this.textFiles = textFiles.addLookups("name");
	this.contentBlocks = contentBlocks.addLookups("name");
	this.pages = pages;
	this.contentAssignments = contentAssignments;
}

{
	Document.prototype.initialize = function(callback)
	{
		var pages = this.pages;

		for (var i = 0; i < pages.length; i++)
		{
			var page = pages[i];
			page.initialize(this);
		}

		TextStringFromFile.loadMany
		(
			this.textFiles, () => callback(this)
		);
	};

	Document.prototype.update = function()
	{
		var pages = this.pages;

		for (var i = 0; i < pages.length; i++)
		{
			var page = pages[i];
			page.update(this);
		}		
	};

	// drawable

	Document.prototype.draw = function()
	{
		var divOutput = document.getElementById("divOutput");
		divOutput.innerHTML = "";

		var pages = this.pages;

		for (var i = 0; i < pages.length; i++)
		{
			var page = pages[i];
			page.draw(this);
		}		
	};
	
	// serializable

	Document.deserialize = function(documentAsJson)
	{
		var documentAsObject = JSON.parse(documentAsJson);
		return Document.fromDeserializedObject(documentAsObject);
	};

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

		var pageDefns = documentAsObject.pageDefns.map
		(
			x => PageDefn.fromDeserializedObject(x)
		); 

		var textFiles = documentAsObject.textFiles.map
		(
			x => TextStringFromFile.fromDeserializedObject(x)
		);

		var contentBlocks = documentAsObject.contentBlocks.map
		(
			x => ContentBlock.fromDeserializedObject(x)
		);

		var pages = documentAsObject.pages.map
		(
			x => Page.fromDeserializedObject(x)
		);

		var contentAssignments = documentAsObject.contentAssignments.map
		(
			x => ContentAssignment.fromDeserializedObject(x)
		);

		var returnValue = new Document
		(
			name,
			pageSizeInPixels,
			fonts,
			pageDefns,
			textFiles,
			contentBlocks,
			pages,
			contentAssignments
		);

		return returnValue;
	};

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
	};
}
