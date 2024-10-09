using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BankAccountManager_API_main.Data;
using Microsoft.EntityFrameworkCore;

namespace BankAccountManager
{
    public class AccountsRepository : IAccountsRepository
    {
        private readonly DataContext _context;

        public AccountsRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Account> GetItemAsync(string username, string password)
        {
            // Implementation here
            return await _context.Accounts.FirstOrDefaultAsync(a => a.Username == username && a.Password == password);
        }

        public async Task<IEnumerable<Account>> GetItemsAsync()
        {
            // Implementation here
            return await _context.Accounts.ToListAsync();
        }

        public async Task CreateItemAsync(Account account)
        {
            // Implementation here
            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateItemAsync(string username, string password, Account account)
        {
            // Implementation here
            var existingAccount = await _context.Accounts.FirstOrDefaultAsync(a => a.Username == username && a.Password == password);
            if (existingAccount != null)
            {
                existingAccount.Balance = account.Balance;
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteItemAsync(string username, string password)
        {
            // Implementation here
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Username == username && a.Password == password);
            if (account != null)
            {
                _context.Accounts.Remove(account);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Account> GetItemAsyncNoPass(string recipientUsername)
        {
            // Implementation here
            return await _context.Accounts.FirstOrDefaultAsync(a => a.Username == recipientUsername);
        }
    }
}