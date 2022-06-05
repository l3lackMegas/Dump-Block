// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DumpBlockAccount is ERC20 {
    using Address for address;
    using SafeERC20 for IERC20;

    IERC20 public token;

    constructor(address _token) ERC20("DumpBlock Account", "DBTA") {
        token = IERC20(_token);
    }


    function balance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function deposit(uint256 _amount) public {
        require(_amount > 0, "amount cannot be zero");
        token.safeTransferFrom(msg.sender, address(this), _amount);
        _mint(msg.sender, _amount);
    }

    function withdraw(uint256 _amount) public {
        _burn(msg.sender, _amount);
        token.safeTransfer(msg.sender, _amount);
    }

    function mint(unit256 _amount) public {
        _mint(msg.sender, _amount);
    }

    function burn(unit256 _amount) public {
        _burn(msg.sender, _amount);
    }
}