using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Data;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;
        public DatingRepository(DataContext context)
        {
            _context = context;

        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes.FirstOrDefaultAsync(u => u.LikerId == userId 
                                && u.LikeeId == recipientId);
        }

        public async Task<Photo> GetMainPhotoFromUser(int userid)
        {
            return await _context.Photos.Where(u => u.Userid == userid).FirstOrDefaultAsync(p => p.IsMain);
        }

        public async Task<Photo> GetPhoto(int id)
        {
           var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);
            return photo;
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Id == id);
            return user;
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users =_context.Users.Include(p => p.Photos).OrderBy(u => u.LastActive).AsQueryable();

            users = users.Where(u => u.Id != userParams.UserId);

            users = users.Where(g =>g.Gender == userParams.Gender);

            if(userParams.Likers)
            {
                var userLikers = await GetUserLikes(userParams.UserId,userParams.Likers);
                users = users.Where(u => userLikers.Contains(u.Id));
            }

            if(userParams.Likees)
            {
                var userLikees = await GetUserLikes(userParams.UserId,userParams.Likers);
                users = users.Where(u => userLikees.Contains(u.Id));
            }

            if(userParams.MinAge != 18 || userParams.MaxAge != 99)
            {
                var minDateOfBirth = DateTime.Today.AddYears(-userParams.MaxAge - 1);
                var maxDateOfBirth = DateTime.Today.AddYears(-userParams.MinAge);

                users = users.Where(u => u.DateOfBirth >= minDateOfBirth && u.DateOfBirth <= maxDateOfBirth);
            }

            if(!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created":
                        users = users.OrderByDescending(u => u.Created);
                        break;
                    default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }

            return await PagedList<User>.CreateAsync(users,userParams.PageNumber,userParams.PageSize);
        }

        public async Task<IEnumerable<int>> GetUserLikes(int id , bool likers)
        {
            var user = await _context.Users.
                Include(u => u.Likers).
                Include(u => u.Likees).
                FirstOrDefaultAsync(u => u.Id == id);

            if(likers)
            {
                //احنا هنا بنرجع كام واحد عملنا لايك بواسطة الايميل الى احنا داخلين بيه
                //Likers الى هما عاملينا لايك
                return user.Likers.Where(u => u.LikeeId == id).Select(u => u.LikerId);
            }
            else
            {
                //احنا هنا عاوزين نجيب الى احنا عاملينهم لايك 
                //Likees الى احنا عاملينهم لايك
                return user.Likees.Where(u => u.LikerId == id).Select(u => u.LikeeId);
            }
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
           var messages = _context.Messages
                            .Include(u => u.Sender).ThenInclude(p => p.Photos)
                            .Include(u => u.Recipient).ThenInclude(p => p.Photos)
                            .AsQueryable();

            switch(messageParams.MessageContainer)
            {
                case"Inbox":
                    messages = messages.Where(u => u.RecipientId == messageParams.UserId);
                    break;
                case"Outbox":
                    messages = messages.Where(u => u.SenderId == messageParams.UserId);
                    break;
                default:
                    messages = messages.Where(u => u.RecipientId == messageParams.UserId && u.IsRead == false);
                    break;
            }

            messages = messages.OrderByDescending(d => d.MessageSend);

            return await PagedList<Message>.CreateAsync(messages,messageParams.PageNumber,messageParams.PageSize);
                            
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            var messages = await _context.Messages
                    .Include(u => u.Sender).ThenInclude(p => p.Photos)
                    .Include(u => u.Recipient).ThenInclude(p => p.Photos)
                    .Where(m => m.RecipientId == userId && m.SenderId == recipientId 
                    || m.RecipientId == recipientId && m.SenderId == userId)
                    .OrderByDescending(m => m.MessageSend)
                    .ToListAsync();

            return messages;
        }
    }
}