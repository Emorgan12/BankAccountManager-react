using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BankAccountManager
{
    public interface IAccountsRepository
    {
        Task<Account> GetItemAsync(string username, string password);
        Task<IEnumerable<Account>> GetItemsAsync();
        Task CreateItemAsync(Account account);
        Task UpdateItemAsync(string username, string password, Account account);
        Task DeleteItemAsync(string username, string password);
        Task<Account> GetItemAsyncNoPass(string recipientUsername);
    }
}
