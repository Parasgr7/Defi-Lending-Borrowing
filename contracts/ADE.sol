// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ADE is ERC20{
    constructor() ERC20("ADE Token", "ADE"){
        _mint(msg.sender, 10000000 * 10**18);
    }


}
