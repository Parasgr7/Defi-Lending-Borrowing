const LARToken= artifacts.require('LARToken')
const ADEToken= artifacts.require('ADE')
const LendingAndBorrowing = artifacts.require('LendingAndBorrowing')
const tools = require ("../scripts/helpful_scripts")

const KEPT_BALANCE = web3.utils.toWei("1000", "ether")

const token_info = {
    "dai_token": {"name": "DAI", "LTV": tools.toWei("0.8"), "borrow_stable_rate": tools.toWei("0.025")},
    "weth_token": {"name": "WETH", "LTV": tools.toWei("0.75"), "borrow_stable_rate": tools.toWei("0.01")},
    "link_token": {"name": "LINK", "LTV": tools.toWei("0.8"), "borrow_stable_rate": tools.toWei("0.05")},
    "fau_token": {"name": "FAU", "LTV": tools.toWei("0.85"), "borrow_stable_rate": tools.toWei("0.009")},
}

module.exports = async function(deployer, network, accounts) {

    await deployer.deploy(LARToken)
    await deployer.deploy(ADEToken)
    const lar_token = await LARToken.deployed()
    await deployer.deploy(LendingAndBorrowing,lar_token.address)
    const lending_and_borrowing = await LendingAndBorrowing.deployed()

    dai_token_address = await tools.get_contract("dai_token_address",network, deployer)
    weth_token_address = await tools.get_contract("weth_token_address",network, deployer)
    link_token_address = await tools.get_contract("link_token_address",network, deployer)
    fau_token_address = await tools.get_contract("fau_token_address",network, deployer)

    const token_to_price_feed = await addTokenToPriceFeed(network, deployer)

    var total = await lar_token.totalSupply()
    tx = await lar_token.transfer(lending_and_borrowing.address, BigInt(total) - BigInt(KEPT_BALANCE))

    await add_token_to_price_feed_mapping(
        lending_and_borrowing,
        token_to_price_feed,
        dai_token_address,
        weth_token_address,
        link_token_address,
        fau_token_address
    )

    await addTokensToLend(lending_and_borrowing, dai_token_address, weth_token_address, link_token_address, fau_token_address)

    await addTokensToBorrow(lending_and_borrowing, dai_token_address, weth_token_address, link_token_address, fau_token_address)
}

const addTokenToPriceFeed = async (network, deployer) => {
    dai_usd_price_feed_address = await tools.get_contract("dai_usd_price_feed_address", network, deployer)
    weth_usd_price_feed_address = await tools.get_contract("eth_usd_price_feed_address",network, deployer)
    link_usd_price_feed_address = await tools.get_contract("link_usd_price_feed_address",network, deployer)
    fau_usd_price_feed_address = await tools.get_contract("fau_usd_price_feed_address",network, deployer)

    token_to_price_feed = {
        0: dai_usd_price_feed_address,
        1: weth_usd_price_feed_address,
        2: link_usd_price_feed_address,
        3: fau_usd_price_feed_address,
    }

    return token_to_price_feed
}

const add_token_to_price_feed_mapping = async(lending_and_borrowing, token_to_price_feed, ...tokens) => {
    for(token in tokens){
        price_feed_address = token_to_price_feed[token]
        tx = await lending_and_borrowing.addTokenToPriceFeedMapping(tokens[token], price_feed_address)
      }
}

const addTokensToLend = async(lending_and_borrowing, dai_token_address, weth_token_address, link_token_address, fau_token_address) => {
    tx1 = await lending_and_borrowing.addTokensForLending(
        token_info["dai_token"]["name"],
        dai_token_address,
        token_info["dai_token"]["LTV"],
        token_info["dai_token"]["borrow_stable_rate"]
    )


    tx2 = await lending_and_borrowing.addTokensForLending(
        token_info["weth_token"]["name"],
        weth_token_address,
        token_info["weth_token"]["LTV"],
        token_info["weth_token"]["borrow_stable_rate"]
    )


    tx3 = await lending_and_borrowing.addTokensForLending(
        token_info["link_token"]["name"],
        link_token_address,
        token_info["link_token"]["LTV"],
        token_info["link_token"]["borrow_stable_rate"]
    )


    tx4 = await lending_and_borrowing.addTokensForLending(
        token_info["fau_token"]["name"],
        fau_token_address,
        token_info["fau_token"]["LTV"],
        token_info["fau_token"]["borrow_stable_rate"]
    )

  }

const addTokensToBorrow = async(lending_and_borrowing, dai_token_address, weth_token_address, link_token_address, fau_token_address)=>{
    tx1 = await lending_and_borrowing.addTokensForBorrowing(
        token_info["dai_token"]["name"],
        dai_token_address,
        token_info["dai_token"]["LTV"],
        token_info["dai_token"]["borrow_stable_rate"]
    )


    tx2 = await lending_and_borrowing.addTokensForBorrowing(
        token_info["weth_token"]["name"],
        weth_token_address,
        token_info["weth_token"]["LTV"],
        token_info["weth_token"]["borrow_stable_rate"]
    )


    tx3 = await lending_and_borrowing.addTokensForBorrowing(
        token_info["link_token"]["name"],
        link_token_address,
        token_info["link_token"]["LTV"],
        token_info["link_token"]["borrow_stable_rate"]
    )


    tx4 = await lending_and_borrowing.addTokensForBorrowing(
        token_info["fau_token"]["name"],
        fau_token_address,
        token_info["fau_token"]["LTV"],
        token_info["fau_token"]["borrow_stable_rate"]
    )

}
