import { ethers } from 'ethers';
import { abi } from 'global/erc721';

const baseUrl = process.env.NODE_ENDPOINT ?? '';
const username = process.env.NODE_USERNAME;
const password = process.env.NODE_PASSWORD;

export const checkNFTOwnership = async (address: string) => {
  try {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? '';
    // Create node provider using project credentials
    const provider = new ethers.providers.JsonRpcProvider({
      url: baseUrl,
      user: username,
      password: password,
    });
    const contract = await new ethers.Contract(contractAddress, abi, provider);
    const balance = await contract.balanceOf(address);
    if (balance.toString() !== '0') {
      // Owns ${balance} NFTs of the given collection
      console.debug(`Balance is ${balance}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(error);
    return null;
  }
};
