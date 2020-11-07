
class ContentBlock
{
	constructor(name, typeName, data)
	{
		this.name = name;
		this.typeName = typeName;
		this.data = data;
	}

	static fromDeserializedObject(contentBlockAsObject)
	{
		return new ContentBlock
		(
			contentBlockAsObject.name,
			contentBlockAsObject.typeName,
			contentBlockAsObject.data
		);
	}

	content(document)
	{
		return this.type().contentFromData(document, this.data);
	}

	type()
	{
		return ContentType.Instances()[this.typeName];
	}
}
