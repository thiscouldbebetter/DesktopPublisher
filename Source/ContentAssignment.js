
// classes

function ContentAssignment(contentBlockName, pageIndex, zoneDefnName)
{
	this.contentBlockName = contentBlockName;
	this.pageIndex = pageIndex;
	this.zoneDefnName = zoneDefnName;
}

{
	ContentAssignment.fromDeserializedObject = function(contentAssignmentAsObject)
	{
		return new ContentAssignment
		(
			contentAssignmentAsObject.contentBlockName,
			contentAssignmentAsObject.pageIndex,
			contentAssignmentAsObject.zoneName
		);
	}
}
