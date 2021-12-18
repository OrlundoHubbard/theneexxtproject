//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// importing OpenZepplelin Contracts
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

// importing helper functions
import { Base64 } from "./libraries/Base64.sol";


// inheriting the contract imported. This will give access
// to the inherited contract's methods.
contract myNeexxtNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 private _totalSupply = 50;

    // baseSvg variable
    string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    // Array for random words
    string[] randomWords = ["Missing", "Love", "New", "Assignment", "Money", "AfterParty", "UnderParty", "NewThought", "Neexxt"];
    event NewEpicNFTMinted(address sender, uint256 tokenId);

    constructor () ERC721 ("NeexxtNFT", "NEEXXT") {
        console.log("This is my NFT contract. Whoa!");
    }

    //function to randomly pick a word from array
    function pickRandomWord(uint256 tokenId) public view returns (string memory) {
        // seed the random generator
        uint256 rand = random(string(abi.encodePacked("Neexxt", Strings.toString(tokenId))));
        // Squash the # between 0 and the length of the array to avoid going out of bounds.
        rand = rand % randomWords.length;
        return randomWords[rand];
    }

    function random(string memory input) internal pure returns (uint256) {
    return uint256(keccak256(abi.encodePacked(input)));
}

    // function for user to get NFT.
    function makeYourNFT() public {
        // Grabbing current tokenID, it starts at 0.
        uint256 newItemId = _tokenIds.current();

        require(_totalSupply > newItemId, "SOLD OUT: There's a mint limit of 50");

        // Random selection of words
        string memory word = pickRandomWord(newItemId);

        // concatenate it all together
        string memory finalSvg = string(abi.encodePacked(baseSvg, word, "</text></svg>"));
            
    // Get JSON metadata in place and base64 encode it.
    string memory json = Base64.encode(
        bytes(
            string(
                abi.encodePacked(
                    '{"name": "',
                    // Title of the NFT will be generated word
                    word,
                    '", "description": "For those who understand the future.", "image": "data:image/svg+xml;base64, ',
                    // We add data:image/svg+xml;base64 and then append our base64 encode our svg.
                    Base64.encode(bytes(finalSvg)),
                    '"}'
                )
            )
        )
    );

    // Prepend data:application/json;base64, to our data.
    string memory finalTokenUri = string(
        abi.encodePacked("data:application/json;base64,", json)
    );

    console.log("\n--------------------");
    console.log(finalTokenUri);
    console.log("--------------------\n");

        // Mint the NFT to the sender using msg.sender.
        _safeMint(msg.sender, newItemId);

        // Setting the NFT's data.
        _setTokenURI(newItemId, finalTokenUri);
        

        //increment the counter for when the next NFT is minted.
        _tokenIds.increment();
        console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
        emit NewEpicNFTMinted(msg.sender, newItemId);
    }
}
