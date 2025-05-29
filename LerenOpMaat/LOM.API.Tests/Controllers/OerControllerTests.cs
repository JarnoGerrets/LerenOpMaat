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
            // Arrange:
            var options = new DbContextOptionsBuilder<LOMContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            _context = new LOMContext(options);
            _controller = new OerController(_context);
        }

        [Fact]
        public async Task UploadOer_ReturnsBadRequest_When_FileIsNull()
        {
            // Arrange:
            // Leeg omdat er geen bestand nodig is

            // Act
            var result = await _controller.UploadOer(null);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task UploadOer_ReturnsBadRequest_When_FileIsNotPdf()
        {
            // Arrange
            var file = new FormFile(
                new MemoryStream(Encoding.UTF8.GetBytes("inhoud")), 0, 10, "file", "oer.txt")
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
        public async Task UploadOer_ReturnsOk_When_ValidPdfUploaded()
        {
            // Arrange
            var file = new FormFile(
                new MemoryStream(Encoding.UTF8.GetBytes("pdf inhoud")), 0, 10, "file", "oer.pdf")
            {
                Headers = new HeaderDictionary(),
                ContentType = "application/pdf"
            };

            // Act
            var result = await _controller.UploadOer(file);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task GetCurrentOer_ReturnsPdf_When_OerExists()
        {
            // Arrange
            _context.Oers.Add(new Oer
            {
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
        public async Task GetCurrentOer_ReturnsNotFound_When_NoOerExists()
        {
            // Arrange

            // Act
            var result = await _controller.GetCurrentOer();

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
        }
    }
}
