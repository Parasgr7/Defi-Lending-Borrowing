var LARToken= artifacts.require('../src/contracts/LARToken.sol')
var ADEToken= artifacts.require('../src/contracts/ADE.sol')
var LendingAndBorrowing = artifacts.require("../src/contracts/LendingAndBorrowing.sol")
var tools = require ("../../scripts/helpful_scripts")
const { time } = require('@openzeppelin/test-helpers');

contract("LendingAndBorrowing", async (accounts) => {



  describe("Tokens in Lending & Borrowing Array", async() => {
    const owner = accounts[0];
    const account = accounts[1];
    const another_lender = accounts[2];
    const initial_amount = web3.utils.toWei("100", "ether");
    const amount = web3.utils.toWei("10", "ether");
    const KEPT_BALANCE = web3.utils.toWei("500", "ether");
    var larToken, adeToken, lending_and_borrowing;


    before(async() =>{
      larToken = await LARToken.deployed();
      adeToken = await ADEToken.deployed();
      lending_and_borrowing = await LendingAndBorrowing.deployed();
      const dapp_usd_price_feed = await tools.get_contract("dai_usd_price_feed_address", "development")

      await larToken.transfer(lending_and_borrowing.address, BigInt(KEPT_BALANCE), {"from": owner });
      await larToken.transfer(account, BigInt(initial_amount),  {"from": owner})
      await adeToken.transfer(account, BigInt(initial_amount), {"from": owner})
      await adeToken.transfer(another_lender, BigInt(initial_amount), {"from": owner})

      await lending_and_borrowing.addTokenToPriceFeedMapping(larToken.address, dapp_usd_price_feed, {"from": owner})
      await lending_and_borrowing.addTokenToPriceFeedMapping(adeToken.address, dapp_usd_price_feed, {"from": owner})

      await lending_and_borrowing.addTokensForLending("LAR", larToken.address, BigInt(0.8 * (10**18)), BigInt(0.05 * (10**18)),  {"from": owner});
      await lending_and_borrowing.addTokensForLending("ADE", adeToken.address, BigInt(0.75 * (10**18)), BigInt(0.05 * (10**18)),  {"from": owner});

      await lending_and_borrowing.addTokensForBorrowing("LAR", larToken.address, BigInt(0.8 * (10**18)), BigInt(0.05 * (10**18)),  {"from": owner});
      await lending_and_borrowing.addTokensForBorrowing("ADE", adeToken.address, BigInt(0.75 * (10**18)), BigInt(0.05 * (10**18)),  {"from": owner});

    });

    it("tokens Lent array has LAR & ADE token address inside", async() => {
      var lar_token = await lending_and_borrowing.tokensForLending(1);
      var ade_token = await lending_and_borrowing.tokensForLending(2);

      assert.equal(lar_token.tokenAddress,larToken.address, "LAR token not added in Lending Array")
      assert.equal(ade_token.tokenAddress,adeToken.address, "ADE token not added in Lending Array")
    });
    it("tokens Borrow array has LAR & ADE token address inside", async() => {
      var lar_token = await lending_and_borrowing.tokensForBorrowing(1);
      var ade_token = await lending_and_borrowing.tokensForBorrowing(2);

      assert.equal(lar_token.tokenAddress,larToken.address, "LAR token not added in Borrowing Array")
      assert.equal(ade_token.tokenAddress,adeToken.address, "ADE token not added in Borrowing Array")
    });

    it("checks lending and borrowing functionality", async() => {
     let prev_ade_account_balance = await adeToken.balanceOf(account)
     let prev_lar_token_balance = await larToken.balanceOf(account)

     //-------- Tests for Lending functionality ----------
      await larToken.approve(lending_and_borrowing.address, BigInt(amount), {"from": account})
      await lending_and_borrowing.lend(larToken.address, BigInt(amount), {"from": account})
      var balance = await larToken.balanceOf(account)
      await larToken.approve(lending_and_borrowing.address, BigInt(balance), {"from": account})

      await adeToken.approve(lending_and_borrowing.address, BigInt(amount), {"from": account})
      await lending_and_borrowing.lend(adeToken.address, BigInt(amount), {"from": account})
      var balance = await adeToken.balanceOf(account)
      await adeToken.approve(lending_and_borrowing.address, BigInt(balance), {"from": account})

      await adeToken.approve(lending_and_borrowing.address, BigInt(amount), {"from": another_lender})
      await lending_and_borrowing.lend(adeToken.address, BigInt(amount), {"from": another_lender})
      var balance = await adeToken.balanceOf(another_lender)
      await adeToken.approve(lending_and_borrowing.address, BigInt(balance), {"from": another_lender})


      var getTotalAmountLentInDollars = await lending_and_borrowing.getTotalAmountLentInDollars(account)
      assert.equal(BigInt(getTotalAmountLentInDollars), web3.utils.toWei("40"), "Incorrect Total lent amount")

      /*
      Account lent:
      10 ADE of 75% LTV with and 10 LAR of 80% LTV
      10 ADE IN DOLLARS = toWei(10) * 2 * 0.75
      10 LAR IN DOLLARS = toWei(10) * 2 * 0.8

      Total Available to Borrow = 10 ADE IN DOLLARS + 10 LAR IN DOLLARS = toWei(31)
      */

      var availableToBorrowInDollars = await lending_and_borrowing.getUserTotalAmountAvailableForBorrowInDollars(account)
      assert.equal(BigInt(availableToBorrowInDollars), web3.utils.toWei("31"))

      var no_of_tokens_lent = await lending_and_borrowing.noOfTokensLent()
      var hasLent = await lending_and_borrowing.hasLentOrBorrowedToken(account, larToken.address, no_of_tokens_lent, "tokensLent")
      var new_ade_account_balance = await adeToken.balanceOf(account)

      assert.equal(hasLent, true)
      assert.equal(no_of_tokens_lent, 3)
      assert.equal(BigInt(new_ade_account_balance), BigInt(prev_ade_account_balance) - BigInt(amount)  , "Inequal")
      // assert.equal(BigInt(new_lar_token_balance), BigInt(prev_lar_token_balance) - BigInt(amount) , "Inequal")

      // -------Tests for Borrowing functionality-------
      await lending_and_borrowing.borrow(web3.utils.toWei("2"), adeToken.address, {"from": account})
      await lending_and_borrowing.borrow(web3.utils.toWei("12"), larToken.address, {"from": account})

      await lending_and_borrowing.borrow(web3.utils.toWei("2"), adeToken.address, {"from": another_lender})

      /*
      Account Borrow:
      4 ADE  with and 3 LAR
      10 ADE IN DOLLARS = toWei(2) * 2
      10 LAR IN DOLLARS = toWei(12) * 2

      Borrowed Amount [for user@account] = 4 DOLLARS + 24 DOLLARS = toWei(28)
      */

      var totalBorrowedByUser = await lending_and_borrowing.getTotalAmountBorrowedInDollars(account)
      assert.equal(BigInt(totalBorrowedByUser), BigInt(web3.utils.toWei("28")), "Incorrect Borrowed Amount")

      // i.e lent toWei(31) - borrowed toWei(28) = toWei(3)
      var availableToBorrowInDollars = await lending_and_borrowing.getUserTotalAmountAvailableForBorrowInDollars(account)
      assert.equal(BigInt(availableToBorrowInDollars), BigInt(web3.utils.toWei("3")), "Incorrect Amount Available to Borrow")


      var no_of_tokens_borrowed = await lending_and_borrowing.noOfTokensBorrowed()
      assert.equal(no_of_tokens_borrowed.toNumber(), 3, "Inequal")

      var borrowers_arr = await lending_and_borrowing.getBorrowersArray()
      assert.equal(borrowers_arr.length, 2, "Inequal length of borrowers array")

      var tokenAmountBorrowed = await lending_and_borrowing.tokensBorrowedAmount(larToken.address, account)
      console.log("borrowed1",BigInt(tokenAmountBorrowed))

      var lar_token_balance = await larToken.balanceOf(account)
      console.log("balance left before",BigInt(lar_token_balance))

      /* -------Pay Debt functionality------- ===== [paid debt of larTokens i.e 2 Qty borrowed]; Now Left [12-2 = 10 Qty] */
      await lending_and_borrowing.payDebt(larToken.address, web3.utils.toWei("2"), {"from": account})

      var tokenAmountBorrowed = await lending_and_borrowing.tokensBorrowedAmount(larToken.address, account)
      assert.equal(BigInt(tokenAmountBorrowed), web3.utils.toWei("10"), "check")

      // Previous Debt Cleared of 2 Qty LARToken and Now just left with 2 Qty [i.e 4$] of adeToken...
      var getTotalAmountBorrowedInDollars = await lending_and_borrowing.getTotalAmountBorrowedInDollars(account)
      assert.equal(BigInt(getTotalAmountBorrowedInDollars), web3.utils.toWei("24"), "Incorrect Total lent amount")

      lar_token_balance = await larToken.balanceOf(account)
      console.log("balance left after paying larToken debt",BigInt(lar_token_balance))


      //--------- Withdraw functionality --------

      // Paying outstanding debt of LarToken 10 Qty [i.e 20$]
      await lending_and_borrowing.payDebt(larToken.address, web3.utils.toWei("10"), {"from": account})
      var lar_token_balance = await larToken.balanceOf(account)
      console.log("balance left after paying larToken debt",BigInt(lar_token_balance))


      await lending_and_borrowing.withdraw(larToken.address, amount , {"from": account})

      // Making sure that the token is transferred back to your account and lar rewarded token is removed from your account.
      var lar_rewarded_token = await lending_and_borrowing.getAmountInDollars(amount , larToken.address)
      var lar_token_balance_after = BigInt(lar_token_balance) + BigInt(amount) - BigInt(lar_rewarded_token)
      assert.equal(lar_token_balance_after, BigInt(lar_token_balance) - BigInt(amount))








    });


  });


})
