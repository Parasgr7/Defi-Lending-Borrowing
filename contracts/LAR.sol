// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LARToken is ERC20{
    constructor() ERC20("LAR Token", "LAR"){
        _mint(msg.sender, 1000000 * 10**18);
    }


}
