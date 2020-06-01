
function Document
(
	name,
	pageSizeInPixels,
	fonts,
	pageDefns,
	contentFiles,
	contentBlocks,
	pages,
	contentAssignments
)
{
	this.name = name;
	this.pageSizeInPixels = pageSizeInPixels;
	this.fonts = fonts.addLookups("name");
	this.pageDefns = pageDefns.addLookups("name");
	this.contentFiles = contentFiles.addLookups("name");
	this.contentBlocks = contentBlocks.addLookups("name");
	this.pages = pages;
	this.contentAssignments = contentAssignments;
}

{
	Document.demo = function()
	{
		return Document.demoOdyssey();
	};

	Document.demoOdyssey = function()
	{
		var textOdyssey =
			"<center><centerVertical>The Odyssey\n"
			+ "by Homer\n"
			+ "translated by Samuel Butler\n"
			+ "<pageBreak>"
			+ "<pageBreak>"
			+ "<center><centerVertical>Book I\n"
			+ "\n"
			+ "THE GODS IN COUNCIL--MINERVA'S VISIT TO ITHACA--THE CHALLENGE FROM"
			+ " TELEMACHUS TO THE SUITORS.\n"
			+ "<pageBreak>"
			+ "<pageBreak>"
			+ "Tell me, O Muse, of that ingenious hero who travelled far and wide"
			+ " after he had sacked the famous town of Troy. Many cities did he visit,"
			+ " and many were the nations with whose manners and customs he was"
			+ " acquainted; moreover he suffered much by sea while trying to save his"
			+ " own life and bring his men safely home; but do what he might he could"
			+ " not save his men, for they perished through their own sheer folly in"
			+ " eating the cattle of the Sun-god Hyperion; so the god prevented them"
			+ " from ever reaching home. Tell me, too, about all these things, oh"
			+ " daughter of Jove, from whatsoever source you may know them.\n"
			+ "\n"
			+ "So now all who escaped death in battle or by shipwreck had got safely"
			+ " home except Ulysses, and he, though he was longing to return to his"
			+ " wife and country, was detained by the goddess Calypso, who had got him"
			+ " into a large cave and wanted to marry him. But as years went by, there"
			+ " came a time when the gods settled that he should go back to Ithaca;"
			+ " even then, however, when he was among his own people, his troubles were"
			+ " not yet over; nevertheless all the gods had now begun to pity him"
			+ " except Neptune, who still persecuted him without ceasing and would not"
			+ " let him get home.\n"
			+ "\n"
			+ "Now Neptune had gone off to the Ethiopians, who are at the world's end,"
			+ " and lie in two halves, the one looking West and the other East.[1] He had"
			+ " gone there to accept a hecatomb of sheep and oxen, and was enjoying"
			+ " himself at his festival; but the other gods met in the house of"
			+ " Olympian Jove, and the sire of gods and men spoke first. At that moment"
			+ " he was thinking of Aegisthus, who had been killed by Agamemnon's son"
			+ " Orestes; so he said to the other gods:\n"
			+ "\n"
			+ "\"See now, how men lay blame upon us gods for what is after all nothing"
			+ " but their own folly. Look at Aegisthus; he must needs make love to"
			+ " Agamemnon's wife unrighteously and then kill Agamemnon, though he knew"
			+ " it would be the death of him; for I sent Mercury to warn him not to do"
			+ " either of these things, inasmuch as Orestes would be sure to take his"
			+ " revenge when he grew up and wanted to return home. Mercury told him"
			+ " this in all good will but he would not listen, and now he has paid for"
			+ " everything in full.\"\n"
			+ "\n"
			+ "Then Minerva said, \"Father, son of Saturn, King of kings, it served"
			+ " Aegisthus right, and so it would any one else who does as he did; but"
			+ " Aegisthus is neither here nor there; it is for Ulysses that my heart"
			+ " bleeds, when I think of his sufferings in that lonely sea-girt island,"
			+ " far away, poor man, from all his friends. It is an island covered with"
			+ " forest, in the very middle of the sea, and a goddess lives there,"
			+ " daughter of the magician Atlas, who looks after the bottom of the"
			+ " ocean, and carries the great columns that keep heaven and earth"
			+ " asunder. This daughter of Atlas has got hold of poor unhappy Ulysses,"
			+ " and keeps trying by every kind of blandishment to make him forget his"
			+ " home, so that he is tired of life, and thinks of nothing but how he may"
			+ " once more see the smoke of his own chimneys. You, sir, take no heed of"
			+ " this, and yet when Ulysses was before Troy did he not propitiate you"
			+ " with many a burnt sacrifice? Why then should you keep on being so angry"
			+ " with him?\"\n"
			+ "\n"
			+ "[...]\n";

		var font = new FontNameAndHeight("Font", 10);

		var pageDefnName = "PageDefn0";
		var pageCount = 7;
		var pages = [];
		for (var i = 0; i < pageCount; i++)
		{
			pages.push(new Page(pageDefnName));
		}

		return new Document
		(
			"Odyssey", // name
			new Coords(255, 330), // pageSizeInPixels
			// fonts
			[
				new Font("Font", "../Content/Fonts/Font.ttf")
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
							"A", // name
							new Coords(0, 0), // pos
							new Coords(255, 330), // size
							new Coords(20, 20), // margin
							1, // pageOffsetNext
							"A", // zoneNameNext
							font
						),

						new ZoneDefn
						(
							"PageNumber", // name
							new Coords(235, 310), // pos
							new Coords(10, 10), // size
							new Coords(0, 0), // margin
							1, // pageOffsetNext
							"PageNumber", // zoneNameNext
							font
						)
					]
				) // end new PageDefn
			],
			// contentFiles
			[
				new TextStringFromFile
				(
					"Homer-Odyssey,_The.txt",
					"Content/Homer-Odyssey,_The.txt",
					textOdyssey
				)
			],
			// contentBlocks
			[
				new ContentBlock
				(
					"Content0",
					"TextFile", // typeName
					"Homer-Odyssey,_The.txt" // data
				),
				new ContentBlock
				(
					"PageNumbers", "NumberSequence", "1-1000;2"
				),
			],
			pages,
			// contentAssignments
			[
				new ContentAssignment
				(
					"Content0", // contentBlockName
					0, // pageIndex
					"A" // zoneName
				),
				new ContentAssignment
				(
					"PageNumbers", // contentBlockName
					0, // pageIndex
					"PageNumber" // zoneName
				)
			]
		);
	};

	Document.demoInvictus = function()
	{
		var textInvictus =

			"<center><centerVertical>"
			+ "Invictus\n"
			+ "by William Ernest Henley\f"

			+ "<left>"
			+ "Out of the night which covers me,"
			+ " black as the pit from pole to pole,"
			+ " I thank whatever gods may be"
			+ " for my unconquerable soul.\n\n"
			
			+ "In the fell clutch of circumstance,"
			+ "I have not winced nor cried aloud."
			+ "  Under the bludgeoning of chance,"
			+ " my head is bloody, but unbowed.\n\n"
			
			+ "Beyond this place of wrath and tears"
			+ " looms but the Horror of the shade,"
			+ " and yet the menace of the years"
			+ " finds, and shall find me, unafraid.\n\n"
			
			+ "It matters not how strait the gate,"
			+ " how charged with punishments the scroll,"
			+ " I am the master of my fate:"
			+ " I am the captain of my soul.\n\n"

		var font = new FontNameAndHeight("Font", 10);

		return new Document
		(
			"Invictus", // name
			new Coords(255, 330), // pageSizeInPixels
			// fonts
			[
				new Font("Font", "../Content/Fonts/Font.ttf")
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
							"1", // zoneNameNext
							font
						),
						new ZoneDefn
						(
							"1",
							new Coords(50, 110),
							new Coords(150, 80),
							new Coords(20, 20),
							0,
							"2",
							font
						),
						new ZoneDefn
						(
							"2",
							new Coords(90, 210),
							new Coords(150, 80),
							new Coords(20, 20),
							1,
							"0",
							font
						)
					]
				) // end new PageDefn
			],
			// contentFiles
			[
				new TextStringFromFile
				(
					"Invictus.txt",
					"Content/Invictus.txt",
					textInvictus
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

	Document.prototype.initialize = function(callback)
	{
		this.pages.forEach(x => x.initialize(this));
		this.loadAll(callback);
	};

	Document.prototype.contentFileAdd = function(contentFileToAdd)
	{
		this.contentFiles.push(contentFileToAdd);
		this.contentFiles[contentFileToAdd.name] = contentFileToAdd;
	};

	Document.prototype.contentFileSelectByName = function(contentFileNameToSelect)
	{
		this.contentFileSelectedName = contentFileNameToSelect;
	};

	Document.prototype.contentFileSelected = function()
	{
		return (this.contentFileSelectedName == null ? null : this.contentFiles[this.contentFileSelectedName] );
	};

	Document.prototype.contentFileSelectedUnlink = function()
	{
		var contentFileSelected = this.contentFileSelected();
		if (contentFileSelected != null)
		{
			this.contentFileSelectedName = null;
			var index = this.contentFiles.indexOf(this.contentFileSelected);
			this.contentFiles.splice(index, 1);
		}
	};

	Document.prototype.isLoaded = function()
	{
		var areAnyFontsNotLoaded = this.fonts.some(x => x.isLoaded == false);
		var areAnyContentFilesNotLoaded = this.contentFiles.some(x => x.text == null);
		var isEverythingLoaded = (areAnyFontsNotLoaded == false && areAnyContentFilesNotLoaded == false);
		return isEverythingLoaded;
	};

	Document.prototype.loadAll = function(callback)
	{
		var doc = this;
		
		function doCallbackIfAllItemsLoaded()
		{
			if (doc.isLoaded())
			{
				callback();
			}
		}
		this.fonts.forEach(x => x.load(doCallbackIfAllItemsLoaded));
		//this.contentFiles.forEach(x => x.load(doCallbackIfAllItemsLoaded));
	};

	Document.prototype.unload = function()
	{
		this.fonts.forEach(x => x.unload());
		this.pageDefns.forEach(x => x.unload());
		this.pages.forEach(x => x.unload());
	}

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
			var font = new Font(fontAsObject.name, fontAsObject.sourcePath);
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
		var contentFiles = layoutAsObject.contentFiles.map
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

	// strings

	Document.prototype.toStringJson = function()
	{
		var contentFileTextsToRestore = this.contentFiles.map(x => x.text);
		this.contentFiles.forEach((x, i) => delete x.text);
		var contentFileSelectedName = this.contentFileSelectedName;

		var returnValue = JSON.stringify(this, null, 4);

		this.contentFiles.forEach((x, i) => x.text = contentFileTextsToRestore[i]);
		this.contentFileSelectedName = contentFileSelectedName;

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
		var contentFiles = this.contentFiles;

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

		var layoutAsJson = this.toStringJson();

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
