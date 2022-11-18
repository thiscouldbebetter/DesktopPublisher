
class Session
{
	constructor(document)
	{
		this.document = document || Document.blank();
	}

	static Instance = new Session();
}
