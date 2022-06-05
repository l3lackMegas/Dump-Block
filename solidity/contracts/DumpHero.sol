// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DumpHero is ERC721URIStorage {
    using Address for address;
    using SafeERC20 for IERC20;
    using Counters for Counters.Counter;
    IERC20 public token;
    Counters.Counter private _tokenId;
    mapping(address=>mapping(uint=>uint)) private _ownedTokens;

    constructor(address _token) ERC721("DumpBlock", "DHERO") {
        token = IERC20(_token);
    }

    function mintHero(address player, string memory tokenURI) public returns (uint256) {
        // token.safeTransferFrom(msg.sender, 0x0000000000000000000000000000000000000000, 500 * 10**18);
        _tokenId.increment();

        uint256 last_id = _tokenId.current();
        uint length = ERC721.balanceOf(player);
        _mint(player, last_id);
        _ownedTokens[player][length] = last_id;
        _setTokenURI(last_id, tokenURI);

        return last_id;
    }

    function burn(uint256 tokenId) public {
        _burn(tokenId);
        token.safeTransfer(msg.sender, token.balanceOf(address(this)));
    }
    
    
    function tokenOfOwnerByIndex(address owner,uint index) public view returns(uint){
        require(index < ERC721.balanceOf(owner), "Index out of bounds");
        return _ownedTokens[owner][index];
    }
}