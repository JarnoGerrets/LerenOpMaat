using LOM.API.Controllers;
using LOM.API.DAL;
using LOM.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace LOM.API.Tests.Controllers
{
    public class OerControllerTests
    {
        private readonly OerController _controller;
        private readonly LOMContext _context;

        public OerControllerTests()
        {
            var options = new DbContextOptionsBuilder<LOMContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            _context = new LOMContext(options);
            _controller = new OerController(_context);
        }

        [Fact]
        public async Task UploadOer_ReturnsBadRequest_WhenFileIsNull()
        {
            // Arrange
            IFormFile file = null;

            // Act
            var result = await _controller.UploadOer(file);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task UploadOer_ReturnsBadRequest_WhenFileIsNotPdf()
        {
            // Arrange
            var content = Encoding.UTF8.GetBytes("inhoud");
            var stream = new MemoryStream(content);
            var file = new FormFile(stream, 0, stream.Length, "file", "oer.txt")
            {
                Headers = new HeaderDictionary(),
                ContentType = "text/plain"
            };

            // Act
            var result = await _controller.UploadOer(file);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task UploadOer_CreatesOer_WhenNoneExists()
        {
            // Arrange
            var content = Encoding.UTF8.GetBytes("pdf inhoud");
            var stream = new MemoryStream(content);
            var file = new FormFile(stream, 0, stream.Length, "file", "oer.pdf")
            {
                Headers = new HeaderDictionary(),
                ContentType = "application/pdf"
            };

            // Act
            var result = await _controller.UploadOer(file);

            // Assert
            Assert.IsType<OkObjectResult>(result);

            var oer = await _context.Oers.FindAsync(1);
            Assert.NotNull(oer);
            Assert.Equal(1, oer.Id);
        }

        [Fact]
        public async Task UploadOer_OverwritesExistingOer()
        {
            // Arrange
            _context.Oers.Add(new Oer
            {
                Id = 1,
                Base64PDF = Convert.ToBase64String(Encoding.UTF8.GetBytes("oude inhoud")),
                UploadDate = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();

            var inhoud = "nieuwe inhoud";
            var stream = new MemoryStream(Encoding.UTF8.GetBytes(inhoud));
            var file = new FormFile(stream, 0, stream.Length, "file", "oer.pdf")
            {
                Headers = new HeaderDictionary(),
                ContentType = "application/pdf"
            };

            // Act
            var result = await _controller.UploadOer(file);

            // Assert
            Assert.IsType<OkObjectResult>(result);

            var oer = await _context.Oers.FindAsync(1);
            var decoded = Encoding.UTF8.GetString(Convert.FromBase64String(oer.Base64PDF));
            Assert.Equal(inhoud, decoded);
        }

        [Fact]
        public async Task GetCurrentOer_ReturnsPdf_WhenExists()
        {
            // Arrange
            _context.Oers.Add(new Oer
            {
                Id = 1,
                Base64PDF = Convert.ToBase64String(Encoding.UTF8.GetBytes("pdf")),
                UploadDate = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetCurrentOer();

            // Assert
            Assert.IsType<FileStreamResult>(result);
        }

        [Fact]
        public async Task GetCurrentOer_ReturnsNotFound_WhenNotExists()
        {
            // Arrange
            // Geen Oer beschikbaar

            // Act
            var result = await _controller.GetCurrentOer();

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
        }
    }
}
