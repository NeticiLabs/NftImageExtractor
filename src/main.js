import dotenv from 'dotenv';
import ethers from 'ethers';
import * as utils from './utils.js';
import * as fetcher from './fetcher.js';

import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
const erc721Abi = require("../abi/Example721.json"); // use the require method

dotenv.config();

const config = {
    name: process.env.NAME,
    endPoint: process.env.END_POINT,
    contract: process.env.CONTRACT_ADDRESS,
    tokens: utils.parseTokenStr(process.env.TOKENS??'10'),
};


let contract;
async function main(){
    //1. Establish json rpc provider to infura
    let url = `${config.endPoint}`;
    const provider = new ethers.providers.JsonRpcProvider(url);
    //2. We don't need any private key
    let privateKey = "0x0123456789012345678901234567890123456789012345678901234567890123";
    let signer = new ethers.Wallet(privateKey, provider);
    //3. Fetching metadatas
    contract = new ethers.Contract(config.contract, erc721Abi.abi, signer);
    let urls = await urlsByIds(config.tokens, contract)
    console.log('Metadata collected complete');
    //4. Download images.
    for (var i=0;i<urls.length;i++){
        await downloadImage(urls[i]);
    }
    console.log('Download complete');
}

async function urlsByIds(tokenList, contract){
    let urls = []
    for (var i=0;i<tokenList.length;i++){
        const tokenId = tokenList[i];
        const metadataUri = await contract.tokenURI(tokenId);
        const metadata = await fetcher.fetchMetadata(metadataUri);
        urls.push({
            token: tokenId,
            url: metadata.image
        }) 
    }
    return urls;
}


async function downloadImage(urlInf){
    const tokenId = urlInf.token;
    const img = urlInf.url;
    await fetcher.fetchImage(tokenId, img, config);
}


try{
    main();
}catch(error){
    console.error(error);
}
