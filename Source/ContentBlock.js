
function ContentBlock(name, typeName, data)
{
	this.name = name;
	this.typeName = typeName;
	this.data = data;
}

{
	ContentBlock.fromDeserializedObject = function(contentBlockAsObject)
	{
		return new ContentBlock
		(
			contentBlockAsObject.name,
			contentBlockAsObject.typeName,
			contentBlockAsObject.data
		);
	}
}
