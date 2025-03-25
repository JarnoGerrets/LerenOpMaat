namespace LOM.MVC.Clients
{
	public class ApiClient
	{
		private readonly IConfiguration _configuration;
		private readonly IHttpClientFactory _factory;
		private readonly Uri _baseaddress;

		public ApiClient(IHttpClientFactory factory, IConfiguration configuration)
		{
			_configuration = configuration;
			_factory = factory;
			_baseaddress = new Uri(_configuration.GetValue<string>("ApiUrl"));
		}

		public async Task<HttpResponseMessage> Get(string path, string key)
		{
			// Leading slash in path causes it to override the /api part
			path = path.TrimStart('/'); 

			if (key != "") 
				path += "/" + key;

			var client = _factory.CreateClient();
			client.BaseAddress = _baseaddress;
			var response = await client.GetAsync(path);
			return response;
		}

		public async Task<HttpResponseMessage> Post<T>(string path, T entity)
		{
			// Leading slash in path causes it to override the /api part
			path = path.TrimStart('/');

			var client = _factory.CreateClient();
			client.BaseAddress = _baseaddress;
			var response = await client.PostAsJsonAsync<T>(path, entity);
			return response;
		}

		public async Task<HttpResponseMessage> Put<T>(string path, string key, T entity)
		{
			// Leading slash in path causes it to override the /api part
			path = path.TrimStart('/');

			path += "/" + key;
			var client = _factory.CreateClient();
			client.BaseAddress = _baseaddress;
			var response = await client.PutAsJsonAsync<T>(path, entity);
			return response;
		}

		public async Task<HttpResponseMessage> Delete(string path, string key)
		{
			// Leading slash in path causes it to override the /api part
			path = path.TrimStart('/');

			path += "/" + key;
			var client = _factory.CreateClient();
			client.BaseAddress = _baseaddress;
			var response = await client.DeleteAsync(path);
			return response;
		}
	}
}
