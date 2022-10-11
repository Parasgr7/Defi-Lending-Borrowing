# DeFi-Lending-and-Borrowing DApp
DeFi Lending platform which lets you lend, borrow crypto assets and helps you earn some passive income as interest on your deposits.

A full stack, fully-onchain DeFi app that enables users to supply tokens to the contract and are rewarded with some customly made ERC20 token (LAR) based on the amount of token they supply and also allows users to borrow tokens from it.

It is deployed on the Ethereum Kovan Network.

# Features
1. The contract supports 4 test tokens; DAI, LINK, WETH and FAU 😎
2. Users can either supply some tokens to the pool just to provide liquidity or user can supply to the pool for usage as collateral.
3. Users get rewarded with some LAR token when they supply to the pool. The LAR token rewarded to the user is calculated based on the token amount in dollars users supplied to the pool.
4. For any user to borrow from the pool, the user has to stake some token as collateral. The collateral is influenced greatly by the LTV (Loan To Value) ratio of that particular token to stake. Note that the collateral must actually be greater in value than the token you want to borrow from the pool.
5. The contract supports only stable APY rate for all tokens that can be borrowed. In other words, the amount of interest to pay at the end of the day is always constant.
6. When user is ready to pay the debt, the interest along with the token borrowed is taken from the user. Interest is calculated based on that stable APY rate. 
7. After repaying, user can withdraw the token staked as collateral from the pool.
8. When a user withdraws from the pool, the contract also collects some LAR tokens rewarded to the user. The LAR token that will be collected from the user is equivalent in value to the amount of token user wants to withdraw.

# Technologies
1. **Open Zeppelin**: The contract uses IERC20 of OpenZeppelin create an instance of a token and also, it uses the Ownable contract of the OpenZepppelin to ensure security of the contract
2. **Chainlink**: The contract uses the AggregatorV3Interface of chainlink to fetch real time price feeds.
3. **Truffle**: Truffle is a development environment, asset pipeline, and testing framework for developing smart contracts.
4. **Ganache**: Ganache is used as blockchain for local testing. 
5. **Next JS**: Next JS is the front end framework used to ensure flexible user interaction.
6. **Tailwind CSS**
7. **Metamask**
8. **web3.js**


# Programming Languages
1. Solidity
2. Truffle
3. Javascript
4. Next.js

# What to Install
1. Tailwind CSS: Install tailwind css [here](https://tailwindcss.com/docs/installation)

# How to use
1. To deploy solidity smart contract on Kovan Network
```
truffle deploy --network kovan

```
2. Start the Server
```
npm run dev
```
 # Developer
 Let's Connect! 👋 👋 
 ```
 Paras Gaur - 
    Email - parasgr484@gmail.com
    Linkedin - https://www.linkedin.com/in/paras-gaur/
    Website - https://paras-portfolio-flame.vercel.app/
 ```

