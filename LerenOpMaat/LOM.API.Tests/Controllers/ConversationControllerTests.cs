﻿using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;
using LOM.API.Controllers;
using LOM.API.DAL;
using LOM.API.Models;
using System.Collections.Generic;

namespace LOM.API.Tests.Controllers
{
    public class ConversationControllerTests
    {
        private LOMContext GetInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<LOMContext>()
                .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
                .Options;
            return new LOMContext(options);
        }

        [Fact]
        public async Task GetConversationByStudentId_ReturnsConversation_WhenExists()
        {
            // Arrange
            var context = GetInMemoryContext();
            var student = new User { Id = 1, FirstName = "Student", LastName = "Test", ExternalID = "S1", RoleId = 2 };
            var teacher = new User { Id = 2, FirstName = "Teacher", LastName = "Test", ExternalID = "T1", RoleId = 1 };
            var route = new LearningRoute { Id = 1, UserId = 1, User = student };
            var conversation = new Conversation
            {
                Id = 1,
                StudentId = 1,
                Student = student,
                TeacherId = 2,
                Teacher = teacher,
                LearningRouteId = 1,
                LearningRoute = route
            };
            context.User.AddRange(student, teacher);
            context.LearningRoutes.Add(route);
            context.Conversations.Add(conversation);
            await context.SaveChangesAsync();

            var controller = new ConversationController(context);

            // Act
            var result = await controller.getConversationByStudentId(1);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Conversation>>(result);
            var foundConversation = Assert.IsType<Conversation>(actionResult.Value);
            Assert.Equal(1, foundConversation.StudentId);
            Assert.NotNull(foundConversation.Teacher);
            Assert.Equal("Teacher", foundConversation.Teacher.FirstName);
        }

        [Fact]
        public async Task GetConversationByStudentId_ReturnsNotFound_WhenNotExists()
        {
            // Arrange
            var context = GetInMemoryContext();
            var controller = new ConversationController(context);

            // Act
            var result = await controller.getConversationByStudentId(99);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task GetConversationsByAdministratorId_ReturnsConversations_WhenExists()
        {
            // Arrange
            var context = GetInMemoryContext();
            var student = new User { Id = 1, FirstName = "Student", LastName = "Test", ExternalID = "S1", RoleId = 2 };
            var admin = new User { Id = 2, FirstName = "Admin", LastName = "Test", ExternalID = "A1", RoleId = 1 };
            var route = new LearningRoute { Id = 1, UserId = 1, User = student };
            var conversation = new Conversation
            {
                Id = 1,
                StudentId = 1,
                Student = student,
                TeacherId = 2,
                Teacher = admin,
                LearningRouteId = 1,
                LearningRoute = route
            };
            context.User.AddRange(student, admin);
            context.LearningRoutes.Add(route);
            context.Conversations.Add(conversation);
            await context.SaveChangesAsync();

            var controller = new ConversationController(context);

            // Act
            var result = await controller.getConversationsByAdministratorId(2);

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Conversation>>>(result);
            var conversations = Assert.IsAssignableFrom<IEnumerable<Conversation>>(actionResult.Value);
            Assert.Single(conversations);
            Assert.Equal(2, ((Conversation)System.Linq.Enumerable.First(conversations)).TeacherId);
        }

        [Fact]
        public async Task GetConversationsByAdministratorId_ReturnsEmpty_WhenNoneExist()
        {
            // Arrange
            var context = GetInMemoryContext();
            var controller = new ConversationController(context);

            // Act
            var result = await controller.getConversationsByAdministratorId(99);

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Conversation>>>(result);
            var conversations = Assert.IsAssignableFrom<IEnumerable<Conversation>>(actionResult.Value);
            Assert.Empty(conversations);
        }
    }
}