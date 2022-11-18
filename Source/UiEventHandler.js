
class UiEventHandler
{
	static body_Loaded()
	{
		UiEventHandler.controlsPopulate();
	}

	static buttonClearRenderedImages_Clicked()
	{
		var divOutput = document.getElementById("divOutput");
		divOutput.innerHTML = "";
	}

	static buttonContentFileSelectedUnlink_Clicked()
	{
		Session.Instance.document.contentFileSelectedUnlink();
		UiEventHandler.controlsPopulate();
	}

	static buttonContentFileSelectedDownload_Clicked()
	{
		var doc = Session.Instance.document;
		var contentFileSelected = doc.contentFileSelected();
		if (contentFileSelected != null)
		{
			contentFileSelected.toBytes
			(
				contentBytes =>
				{
					FileHelper.saveBytesAsFile
					(
						contentBytes, contentFileSelected.name
					);
				}
			);
			
		}
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

	static buttonLoadDocumentBlank_Clicked()
	{
		var documentNew = Document.blank();
		Session.Instance.document = documentNew;
		UiEventHandler.controlsPopulate();
	}

	static buttonLoadDocumentDemo_Clicked()
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
				(contentFileLoadedName, contentAsBytes) =>
				{
					ContentFile.fromNameAndBytes
					(
						contentFileLoadedName,
						contentAsBytes,
						contentFile =>
						{
							Session.Instance.document.contentFileAdd
							(
								contentFile
							);
							UiEventHandler.controlsPopulate();
						}
					);

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
