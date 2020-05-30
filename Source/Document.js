
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
	Document.demo = function()
	{
		return new Document
		(
			"Invictus", // name
			new Coords(255, 330), // pageSizeInPixels
			// fonts
			[
				new Font("sans-serif", 10)
			],
			// pageDefns
			[
				new PageDefn
				(
					"PageDefn0",
					// zoneDefns"
					[
						new ZoneDefn
						(
							"0", // name
							new Coords(10, 10), // pos
							new Coords(150, 80), // size
							new Coords(20, 20), // margin
							0, // pageOffsetNext
							"1" // zoneNameNext
						),
						new ZoneDefn
						(
							"1",
							new Coords(50, 110),
							new Coords(150, 80),
							new Coords(20, 20),
							0,
							"2"
						),
						new ZoneDefn
						(
							"2",
							new Coords(90, 210),
							new Coords(150, 80),
							new Coords(20, 20),
							1,
							"0"
						)
					]
				) // end new PageDefn
			],
			// textFiles
			[
				new TextStringFromFile
				(
					"Invictus.txt",
					"Content/Invictus.txt",
					"Out of the night which covers me, black as the pit from pole to pole, I thank whatever gods may be for my unconquerable soul.\n\nIn the fell clutch of circumstance, I have not winced nor cried aloud.  Under the bludgeoning of chance, my head is bloody, but unbowed.\n\nBeyond this place of wrath and tears looms but the Horror of the shade, and yet the menace of the years finds, and shall find me, unafraid.\n\nIt matters not how strait the gate, how charged with punishments the scroll, I am the master of my fate: I am the captain of my soul.\n\n-William Ernest Henley"
				)
			],
			// contentBlocks
			[
				new ContentBlock
				(
					"Content0",
					"TextFile", // typeName
					"Invictus.txt" // data
				)
			],
			// pages
			[
				new Page("PageDefn0"),
				new Page("PageDefn0"),
				new Page("PageDefn0")
			],
			// contentAssignments
			[
				new ContentAssignment
				(
					"Content0", // contentBlockName
					0, // pageIndex
					"0" // zoneName":"0"
				)
			]
		);
	};

	Document.prototype.initialize = function()
	{
		this.pages.forEach(x => x.initialize(this));
	};

	Document.prototype.update = function()
	{
		this.pages.forEach(x => x.update(this));
	};

	// drawable

	Document.prototype.draw = function()
	{
		var divOutput = document.getElementById("divOutput");
		divOutput.innerHTML = "";

		this.pages.forEach(x => x.draw(this));
	};

	// serializable

	Document.fromLayoutJsonAndContentFiles = function(layoutAsJson, contentFiles)
	{
		var layoutAsObject = JSON.parse(layoutAsJson);

		var name = layoutAsObject.name;

		var pageSizeInPixels = Coords.fromDeserializedObject
		(
			layoutAsObject.pageSizeInPixels
		);

		var fonts = [];
		var fontsAsObjects = layoutAsObject.fonts;
		for (var i = 0; i < fontsAsObjects.length; i++)
		{
			var fontAsObject = fontsAsObjects[i];
			var font = new Font(fontAsObject.name, fontAsObject.heightInPixels);
			fonts.push(font);
		}

		var pageDefns = layoutAsObject.pageDefns.map
		(
			x => PageDefn.fromDeserializedObject(x)
		); 

		var contentBlocks = layoutAsObject.contentBlocks.map
		(
			x => ContentBlock.fromDeserializedObject(x)
		);

		var pages = layoutAsObject.pages.map
		(
			x => Page.fromDeserializedObject(x)
		);

		var contentAssignments = layoutAsObject.contentAssignments.map
		(
			x => ContentAssignment.fromDeserializedObject(x)
		);

		/*
		var textFiles = layoutAsObject.textFiles.map
		(
			x => TextStringFromFile.fromDeserializedObject(x)
		);
		*/

		var returnValue = new Document
		(
			name,
			pageSizeInPixels,
			fonts,
			pageDefns,
			contentFiles,
			contentBlocks,
			pages,
			contentAssignments
		);

		return returnValue;
	};

	// tar

	Document.fromTarFile = function(documentAsTarFile)
	{
		var tarFileEntries = documentAsTarFile.entries;
		var layoutAsTarFileEntry = tarFileEntries[0];
		var layoutAsBytes = layoutAsTarFileEntry.dataAsBytes;
		var layoutAsJson = ByteHelper.bytesToStringUTF8(layoutAsBytes);

		var contentFilesAsTarFileEntries = tarFileEntries.slice(1);
		var contentFilesAsTextStringsFromFiles = contentFilesAsTarFileEntries.map
		(
			x =>
			{
				var name = x.header.fileName;
				var nameMinusPrefix = name.substr("Content/".length);
				var text = ByteHelper.bytesToStringUTF8(x.dataAsBytes);
				return new TextStringFromFile(nameMinusPrefix, name, text);
			}
		);

		var returnValue = Document.fromLayoutJsonAndContentFiles
		(
			layoutAsJson, contentFilesAsTextStringsFromFiles
		);

		return returnValue;
	};

	Document.prototype.toTarFile = function()
	{
		var contentFiles = this.textFiles;

		var contentFilesAsTarFileEntries = contentFiles.map
		(
			x =>
			{
				var textAsBytes = ByteHelper.stringUTF8ToBytes(x.text);
				return new TarFileEntry
				(
					TarFileEntryHeader.fileNew("Content/" + x.name, textAsBytes),
					textAsBytes
				)
			}
		);

		contentFiles.forEach(x => x.unload());
		var layoutAsJson = JSON.stringify(this, null, 4);
		var layoutAsBytes = ByteHelper.stringUTF8ToBytes(layoutAsJson);
		var layoutAsTarFileEntry = new TarFileEntry
		(
			TarFileEntryHeader.fileNew
			(
				"Layout.json.txt", layoutAsBytes
			),
			layoutAsBytes
		);

		var tarFileEntriesAll =
			[layoutAsTarFileEntry].concat(contentFilesAsTarFileEntries);

		var documentAsTarFile = new TarFile
		(
			this.name + ".doc.tar", tarFileEntriesAll
		);

		return documentAsTarFile;
	};

	Document.prototype.toTarFile_Png = function()
	{
		this.initialize();
		this.update();

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
