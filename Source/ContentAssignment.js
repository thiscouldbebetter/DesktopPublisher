
// classes

class ContentAssignment
{
	constructor(contentBlockName, pageIndex, zoneDefnName)
	{
		this.contentBlockName = contentBlockName;
		this.pageIndex = pageIndex;
		this.zoneDefnName = zoneDefnName;
	}

	static fromDeserializedObject(contentAssignmentAsObject)
	{
		return new ContentAssignment
		(
			contentAssignmentAsObject.contentBlockName,
			contentAssignmentAsObject.pageIndex,
			contentAssignmentAsObject.zoneDefnName
		);
	}
}
