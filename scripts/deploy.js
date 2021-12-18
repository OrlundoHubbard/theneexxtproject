const main = async () => {
    const nftContractFactory = await hre.ethers.getContractFactory('myNeexxtNFT');
    const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();
    console.log("Contract deployed to:", nftContract.address);

    // calling the function
    let txn = await nftContract.makeYourNFT()
    // Wait for NFT to be mined.
    await txn.wait()
    console.log("Neexxt NFT Minted")

};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error)
        process.exit(1);
    }
};

runMain();