using LOM.MVC.Clients;

namespace LOM.MVC.Services
{
	public class ApiService<T> : IApiService<T> where T : new()
	{
		private readonly IConfiguration _configuration;
		private readonly IHttpClientFactory _factory;

		public ApiService(IConfiguration configuration, IHttpClientFactory factory)
		{
			_configuration = configuration;
			_factory = factory;
		}

		public async Task<bool> AddAsync(T item, string path)
		{
			try
			{
				var apiClient = new ApiClient(_factory, _configuration);
				var response = await apiClient.Post<T>(path, item);
				response.EnsureSuccessStatusCode();
				return true;
			}
			catch
			{
				// TODO add logging
				return default;
			}
		}

		public async Task<bool> DeleteAsync(int id, string path)
		{
			try
			{
				var apiClient = new ApiClient(_factory, _configuration);
				var response = await apiClient.Delete(path, id.ToString());
				response.EnsureSuccessStatusCode();
				return true;
			}
			catch
			{
				// TODO add logging
				return default;
			}
		}

		public async Task<List<T>?> GetAsync(string path)
		{
			try
			{
				var apiClient = new ApiClient(_factory, _configuration);
				var response = await apiClient.Get(path, "");
				response.EnsureSuccessStatusCode();
				return await response.Content.ReadAsAsync<List<T>>();
			}
			catch
			{
				// TODO add logging
				return default;
			}
		}

		public async Task<T?> GetAsync(int id, string path)
		{
			try
			{
				var apiClient = new ApiClient(_factory, _configuration);
				var response = await apiClient.Get(path, id.ToString());
				response.EnsureSuccessStatusCode();
				return await response.Content.ReadAsAsync<T>();
			}
			catch
			{
				// TODO add logging
				return default;
			}
		}

		public async Task<bool> UpdateAsync(int id, T item, string path)
		{
			try
			{
				var apiClient = new ApiClient(_factory, _configuration);
				var response = await apiClient.Put<T>(path, id.ToString(), item);
				response.EnsureSuccessStatusCode();
				return true;
			}
			catch
			{
				// TODO add logging
				return default;
			}
		}
	}
}
