// Ethers.js implementation for calling liquidateVessels function
const { ethers } = require('ethers');

/**
 * Function to liquidate vessels using ethers.js
 * @param {Object} params - Function parameters
 * @param {string} params.contractAddress - Address of the contract with liquidateVessels function
 * @param {string} params.contractAbi - ABI of the contract (at minimum containing the liquidateVessels function)
 * @param {string} params.addressParam - The address parameter for liquidateVessels
 * @param {string|number} params.uint256Param - The uint256 parameter for liquidateVessels (as string for large numbers)
 * @param {ethers.providers.Provider} params.provider - Ethers provider instance
 * @param {ethers.Wallet|ethers.Signer} params.signer - Wallet or signer to execute the transaction
 * @param {Object} [params.txOptions] - Optional transaction parameters like gasLimit, gasPrice, etc.
 * @returns {Promise<ethers.providers.TransactionReceipt>} Transaction receipt after mining
 */
async function liquidateVessels({
    contractAddress,
    contractAbi,
    addressParam,
    uint256Param,
    provider,
    signer,
    txOptions = {}
}) {
    try {
        // Create contract instance
        const contract = new ethers.Contract(
            contractAddress,
            contractAbi,
            signer
        );

        // Prepare transaction options with defaults
        const options = {
            gasLimit: txOptions.gasLimit || 3000000, // Default gas limit
            ...txOptions
        };

        // Call the liquidateVessels function
        console.log(`Calling liquidateVessels with address: ${addressParam} and uint256: ${uint256Param}`);
        const tx = await contract.liquidateVessels(addressParam, uint256Param, options);

        console.log(`Transaction hash: ${tx.hash}`);

        // Wait for transaction to be mined
        const receipt = await tx.wait();
        console.log(`Transaction confirmed in block ${receipt.blockNumber}`);

        // Return the transaction receipt
        return receipt;
    } catch (error) {
        console.error('Error liquidating vessels:', error);
        throw error;
    }
}

// Example usage:
async function main() {
    // Replace with actual values
    const rpc = 'https://node.botanixlabs.dev';
    const PRIVATE_KEY = '0xd68f5d8c457f5675592a7d486aeb7de973a76b12e02430e7dc01956b27af0370'; // Be careful with private keys!

    // Set up provider and signer
    const provider = new ethers.providers.JsonRpcProvider(rpc);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    // Contract information
    const contractAddress = '0xd4B76b6e5E56F1DAD86c96D275831dEfdB9473c1';
    const contractAbi = [
        // Minimal ABI - just the liquidateVessels function
        "function liquidateVessels(address _asset, uint256 _n) external"
    ];

    // Parameters for liquidateVessels
    const assetAddress = '0x321f90864fb21cdcddD0D67FE5e4Cbc812eC9e64'; // The address parameter
    const numberOfVessels = 100; // The uint256 parameter - number of vessels to liquidate

    try {
        const receipt = await liquidateVessels({
            contractAddress,
            contractAbi,
            addressParam: assetAddress,
            uint256Param: numberOfVessels,
            provider,
            signer: wallet,
            txOptions: {
                gasLimit: 15000000, // Adjust based on your contract's needs
                maxFeePerGas: ethers.utils.parseUnits('0.000008148', 'gwei'), // For EIP-1559 transactions
                maxPriorityFeePerGas: ethers.utils.parseUnits('0.000008148', 'gwei') // For EIP-1559 transactions
            }
        });

        console.log('Liquidation successful!', receipt);
    } catch (error) {
        console.error('Liquidation failed:', error);
    }
}

// Uncomment to run the example
main();