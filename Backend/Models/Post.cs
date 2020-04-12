using System;
using System.Collections.Generic;

namespace Duesen.Models
{
	public class Post
	{
		public string Id { get; set; }
		public string Heading { get; set; }
		public string Author { get; set; }
		public string Tags { get; set; }
		public string Categories { get; set; }
		public DateTime Created { get; set; }
		public DateTime LastModified { get; set; }
		public string Content { get; set; }
		public string Secret { get; set; }
	}
}