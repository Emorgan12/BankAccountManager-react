using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.SecurityToken.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using BankAccountManager_API_main.Data;

namespace BankAccountManager
{
    [ApiController]
    [Route("accounts")]
    public class AccountsController : ControllerBase
    {
        private readonly IAccountsRepository repository;
        private readonly ILogger<AccountsController> logger;

        public AccountsController(IAccountsRepository repository, ILogger<AccountsController> logger)
        {
            this.repository = repository;
            this.logger = logger;
        }

        [HttpGet("{Username} {Password}")]
        public async Task<Account> Login(string Username = null, string Password = null)
        {
            var accounts = await repository.GetItemAsync(Username, Password);

            logger.LogInformation($"{DateTime.UtcNow:hh:mm:ss}: Hello {Username}! You have successfully logged in! Your account balance is {accounts.Balance}!");
            return accounts;
        }

        [HttpPost]
        public async Task<ActionResult<Account>> CreateAccountAsync(Account account)
        {

            var accounts = await repository.GetItemsAsync();
            if (accounts.Any(a => a.Username == account.Username))
            {
                return BadRequest("Username already exists");
            }

            // Validate password
            if (!validation.ContainsNumber(account.Password))
            {
                return BadRequest("Password must contain at least one number");
            }

            // Create a new account with a unique Id
            Account newAccount = new()
            {
                Id = Guid.NewGuid(),
                Username = account.Username,
                Password = account.Password,
                CreatedDate = DateTimeOffset.UtcNow
            };

            // Save the new account
            await repository.CreateItemAsync(newAccount);

            return CreatedAtAction(nameof(GetItemsAsync), new { id = newAccount.Id }, newAccount);
        }

        [HttpDelete("{Username}, {Password}/delete")]
        public async Task<ActionResult> DeleteItemAsync(string Username, string Password)
        {
            var existingAccount = await repository.GetItemAsync(Username, Password);
            if (existingAccount is null)
            {
                logger.LogInformation($"{DateTime.UtcNow:hh:mm:ss}: Account with username {Username} not found");
                return NotFound();
            }

            logger.LogInformation($"{DateTime.UtcNow:hh:mm:ss}: Deleting account with username {Username}");
            await repository.DeleteItemAsync(Username, Password);

            return NoContent();
        }

        [HttpGet("{Username}/findUser")]
        public async Task<Account> FindUser(string Username)
        {
            var accounts = await repository.GetItemAsyncNoPass(Username);

            logger.LogInformation($"{DateTime.UtcNow:hh:mm:ss}: Found {Username}");
            return accounts;
        }
        [HttpGet]
        public async Task<IEnumerable<Account>> GetItemsAsync()
        {
            IEnumerable<Account> accounts = (await repository.GetItemsAsync())
                                                .Select(account => account);
            return accounts;
        }

        [HttpPut("{Username}, {Password}, {DepositAmount}/deposit")]
        public async Task<ActionResult<Account>> DepositMoney(string Username, string Password, int DepositAmount)
        {
            var existingAccount = await repository.GetItemAsync(Username, Password);

            if (existingAccount is null)
            {
                return NotFound();
            }

            if (DepositAmount < 0)
            {
                return BadRequest("Deposit amount must be greater than 0");
            }

            Account updatedAccount = new Account
            {
                Id = existingAccount.Id,
                Username = existingAccount.Username,
                Password = existingAccount.Password,
                CreatedDate = existingAccount.CreatedDate,
                Balance = existingAccount.Balance + DepositAmount
            };

            await repository.UpdateItemAsync(Username, Password, updatedAccount);

            return updatedAccount;
        }

        [HttpPut("{Username}, {Password}, {WidthdrawAmount}/widthdraw")]
        public async Task<ActionResult<Account>> WidthdrawMoney(string Username, string Password, int WidthdrawAmount)
        {
            var existingAccount = await repository.GetItemAsync(Username, Password);

            if (existingAccount is null)
            {
                return NotFound();
            }

            if (WidthdrawAmount < 0)
            {
                return BadRequest("Widthdraw amount must be greater than 0");
            }

            if (existingAccount.Balance < WidthdrawAmount)
            {
                return BadRequest("Insufficient funds");
            }

            Account updatedAccount = new Account
            {
                Id = existingAccount.Id,
                Username = existingAccount.Username,
                Password = existingAccount.Password,
                CreatedDate = existingAccount.CreatedDate,
                Balance = existingAccount.Balance - WidthdrawAmount
            };

            await repository.UpdateItemAsync(Username, Password, updatedAccount);

            return updatedAccount;
        }

        [HttpPut("{Username}, {Password}, {TransferAmount}, {RecipientUsername}/transfer")]

        public async Task<ActionResult<Account>> TransferMoney(string Username, string Password, int TransferAmount, string RecipientUsername)
        {
            var existingAccount = await repository.GetItemAsync(Username, Password);
            var recipientAccount = await repository.GetItemAsyncNoPass(RecipientUsername);

            if (existingAccount is null)
            {
                return NotFound();
            }

            if (recipientAccount is null)
            {
                return NotFound();
            }

            if (TransferAmount < 0)
            {
                return BadRequest("Transfer amount must be greater than 0");
            }

            if (existingAccount.Balance < TransferAmount)
            {
                return BadRequest("Insufficient funds");
            }

            Account updatedAccount = new Account
            {
                Id = existingAccount.Id,
                Username = existingAccount.Username,
                Password = existingAccount.Password,
                CreatedDate = existingAccount.CreatedDate,
                Balance = existingAccount.Balance - TransferAmount
            };

            Account updatedRecipientAccount = new Account
            {
                Id = recipientAccount.Id,
                Username = recipientAccount.Username,
                Password = recipientAccount.Password,
                CreatedDate = recipientAccount.CreatedDate,
                Balance = recipientAccount.Balance + TransferAmount
            };

            await repository.UpdateItemAsync(Username, Password, updatedAccount);
            await repository.UpdateItemAsync(RecipientUsername, recipientAccount.Password, updatedRecipientAccount);

            logger.LogInformation($"{DateTime.UtcNow:hh:mm:ss}: {TransferAmount} has been transferred from {Username} to {RecipientUsername}");
            logger.LogInformation($"{DateTime.UtcNow:hh:mm:ss}: {Username} has a balance of {updatedAccount.Balance}");
            logger.LogInformation($"{DateTime.UtcNow:hh:mm:ss}: {RecipientUsername} has a balance of {updatedRecipientAccount.Balance}");

            return updatedAccount;
        }

        [HttpPut("{Username}, {Password}, {NewPassword}/changepassword")]
        public async Task<ActionResult<Account>> ChangePassword(string Username, string Password, string NewPassword)
        {
            var existingAccount = await repository.GetItemAsync(Username, Password);

            if (existingAccount is null)
            {
                return NotFound();
            }

            Account updatedAccount = new Account
            {
                Id = existingAccount.Id,
                Username = existingAccount.Username,
                Password = NewPassword,
                CreatedDate = existingAccount.CreatedDate,
                Balance = existingAccount.Balance
            };

            await repository.UpdateItemAsync(Username, Password, updatedAccount);

            return updatedAccount;
        }

    }
}