using LOM.API.DAL;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace LOM.API.Tests.TestHelpers
{
	public static class DbContextHelper
	{
		public static LOMContext GetInMemoryContext()
		{
			var options = new DbContextOptionsBuilder<LOMContext>()
				.UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
				.Options;

			return new LOMContext(options);
		}

	}
}
