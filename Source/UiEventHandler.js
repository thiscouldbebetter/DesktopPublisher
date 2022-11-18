
class UiEventHandler
{
	static buttonContentFileSelectedUnlink_Clicked()
	{
		Session.Instance.document.contentFileSelectedUnlink();
		UiEventHandler.controlsPopulate();
	}

	static buttonClearRenderedImages_Clicked()
	{
		var divOutput = document.getElementById("divOutput");
		divOutput.innerHTML = "";
	}

	static buttonDraw_Clicked()
	{
		var document = Session.Instance.document;
		if (document == null)
		{
			alert("No document!");
		}
		else
		{
			document.initialize(UiEventHandler.buttonDraw_Clicked_DocumentInitialized);
		}
	}

	static buttonDraw_Clicked_DocumentInitialized()
	{
		var d = document;
		var inputPageFrom = d.getElementById("inputPageFrom");
		var inputPageTo = d.getElementById("inputPageTo");
		var pageFrom = parseInt(inputPageFrom.value);
		var pageTo = parseInt(inputPageTo.value);
		var pageRange = new Range(pageFrom, pageTo);

		var documentToDraw = Session.Instance.document;
		documentToDraw.update();
		documentToDraw.draw(pageRange);
		documentToDraw.unload();
	}

	static buttonExport_Clicked()
	{
		var document = Session.Instance.document;
		if (document == null)
		{
			alert("No document!");
		}
		else
		{
			var documentAsTarFile = document.toTarFile_Png();
			var documentAsBytes = documentAsTarFile.toBytes();
			FileHelper.saveBytesAsFile(documentAsBytes, documentToExport.name + ".png.tar");
		}
	}

	static buttonLoadDemoDocument_Clicked()
	{
		var documentNew = Document.demo();
		Session.Instance.document = documentNew;
		UiEventHandler.controlsPopulate();
	}

	static buttonSaveDocument_Clicked()
	{
		var document = Session.Instance.document;
		if (document == null)
		{
			alert("No document!");
		}
		else
		{
			var documentAsTarFile = document.toTarFile();
			var documentAsBytes = documentAsTarFile.toBytes();
			FileHelper.saveBytesAsFile
			(
				documentAsBytes, document.name + ".doc.tar"
			);
		}
	}

	static controlsPopulate()
	{
		var d = document;
		var documentToPopulateFrom = Session.Instance.document;

		var inputDocumentName = d.getElementById("inputDocumentName");
		inputDocumentName.value = documentToPopulateFrom.name;

		var documentToPopulateFromAsJson = documentToPopulateFrom.toStringJson();
		var textareaLayoutAsJson = d.getElementById("textareaLayoutAsJson");
		textareaLayoutAsJson.value = documentToPopulateFromAsJson;

		var contentFiles = documentToPopulateFrom.contentFiles;
		var contentFilesAsSelectOptions = contentFiles.map
		(
			x =>
			{
				var returnValue = document.createElement("option")
				returnValue.value = x.name;
				returnValue.innerHTML = x.name;
				return returnValue;
			}
		);
		var selectContentFiles = d.getElementById("selectContentFiles");
		selectContentFiles.innerHTML = "";
		contentFilesAsSelectOptions.forEach(x => selectContentFiles.appendChild(x));
	}

	static inputContentFileToUpload_Changed(inputContentFileToUpload)
	{
		var contentFileToLoad = inputContentFileToUpload.files[0];
		if (contentFileToLoad != null)
		{
			FileHelper.loadFileAsBytes
			(
				contentFileToLoad,
				contentFileAsBytes =>
				{
					var contentFileContentAsString =
						ByteHelper.bytesToStringUTF8(contentFileAsBytes);
					var fileAsTextString = new TextStringFromFile
					(
						contentFileToLoad.name,
						contentFileToLoad.name, // sourcePath
						contentFileContentAsString
					);
					Session.Instance.document.contentFileAdd
					(
						fileAsTextString
					);
					UiEventHandler.controlsPopulate();
				}
			);
		}
	}

	static inputDocumentFileToLoad_Changed(inputDocumentFileToLoad)
	{
		var fileToLoad = inputDocumentFileToLoad.files[0];
		if (fileToLoad != null)
		{
			FileHelper.loadFileAsBytes
			(
				fileToLoad,
				(fileName, fileAsBytes) =>
				{
					var documentAsTarFile = TarFile.fromBytes(fileName, fileAsBytes);
					var document = Document.fromTarFile(documentAsTarFile);
					Session.Instance.document = document;
					UiEventHandler.controlsPopulate();
				}
			);
		}
	}

	static selectContentFiles_Changed(selectContentFiles)
	{
		var document = Session.Instance.document;
		var contentFileName = selectContentFiles.value;
		document.contentFileSelectByName(contentFileName);
	}
}
