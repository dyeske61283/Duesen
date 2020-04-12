using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Duesen.Models;

namespace Duesen.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class PostsController : ControllerBase
	{
		private readonly PostContext _context;

		public PostsController(PostContext context)
		{
			_context = context;
		}

		// GET: api/Posts
		[HttpGet]
		public async Task<ActionResult<IEnumerable<PostDTO>>> GetPosts()
		{
			return await _context.Posts
			.Select(x => PostToDTO(x))
			.ToListAsync();
		}

		// GET: api/Posts/5
		[HttpGet("{id}")]
		public async Task<ActionResult<PostDTO>> GetPost(string id)
		{
			var post = await _context.Posts.FindAsync(id);

			if (post == null)
			{
				return NotFound();
			}

			return PostToDTO(post);
		}

		// PUT: api/Posts/5
		// To protect from overposting attacks, enable the specific properties you want to bind to, for
		// more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
		[HttpPut("{id}")]
		public async Task<IActionResult> PutPost(string id, PostDTO postDTO)
		{
			if (id != postDTO.Id)
			{
				return BadRequest();
			}

			var post = await _context.Posts.FindAsync(id);
			if (post == null)
			{
				return NotFound();
			}

			post.Tags = postDTO.Tags;
			post.LastModified = postDTO.LastModified;
			post.Heading = postDTO.Heading;
			post.Created = postDTO.Created;
			post.Content = postDTO.Content;
			post.Categories = postDTO.Categories;
			post.Author = postDTO.Author;

			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!PostExists(id))
				{
					return NotFound();
				}
				else
				{
					throw;
				}
			}

			return NoContent();
		}

		// POST: api/Posts
		// To protect from overposting attacks, enable the specific properties you want to bind to, for
		// more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
		[HttpPost]
		public async Task<ActionResult<PostDTO>> PostPost(PostDTO postDTO)
		{
			var post = new Post
			{
				Id = postDTO.Id,
				Tags = postDTO.Tags,
				LastModified = postDTO.LastModified,
				Heading = postDTO.Heading,
				Created = postDTO.Created,
				Content = postDTO.Content,
				Categories = postDTO.Categories,
				Author = postDTO.Author
			};

			_context.Posts.Add(post);
			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateException)
			{
				if (PostExists(post.Id))
				{
					return Conflict();
				}
				else
				{
					throw;
				}
			}

			return CreatedAtAction(nameof(GetPost), new { id = post.Id }, PostToDTO(post));
		}

		// DELETE: api/Posts/5
		[HttpDelete("{id}")]
		public async Task<ActionResult<Post>> DeletePost(string id)
		{
			var post = await _context.Posts.FindAsync(id);
			if (post == null)
			{
				return NotFound();
			}

			_context.Posts.Remove(post);
			await _context.SaveChangesAsync();

			return post;
		}

		private bool PostExists(string id)
		{
			return _context.Posts.Any(e => e.Id == id);
		}

		private static PostDTO PostToDTO(Post post) =>
		new PostDTO
		{
			Id = post.Id,
			Author = post.Author,
			Categories = post.Categories,
			Content = post.Content,
			Created = post.Created,
			Heading = post.Heading,
			LastModified = post.LastModified,
			Tags = post.Tags
		};
	}
}
