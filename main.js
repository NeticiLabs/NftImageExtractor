import dotenv from 'dotenv';
import ethers from 'ethers';
import axios from 'axios';
import * as utils from './utils/utils.js';
import * as fetcher from './utils/download.js';

import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
const erc721Abi = require("./abi/erc721.json") // use the require method

dotenv.config();

const config = {
    name: process.env.NAME,
    endPoint: process.env.END_POINT,
    apiKey: process.env.API_KEY,
    contract: process.env.CONTRACT_ADDRESS,
    fetchMode: process.env.FETCH_MODE,
    tokenCount: utils.isEmpty(process.env.TOKEN_COUNT)?Number.MAX_SAFE_INTEGER:process.env.TOKEN_COUNT,
    tokenList: process.env.TOKEN_LIST.split(',')
};


let contract;
async function main(){
    //1. Establish json rpc provider to infura
    let url = `${config.endPoint}${config.apiKey}`;
    console.log("connecting to rpc",url)
    const provider = new ethers.providers.JsonRpcProvider(url);
    //2. We don't need any private key
    let privateKey = "0x0123456789012345678901234567890123456789012345678901234567890123";
    let signer = new ethers.Wallet(privateKey, provider);
    //3. Fetching metadatas
    //Genrate the image urls for other tokens(to avoid too many access to metadata server)
    contract = new ethers.Contract(config.contract, erc721Abi, signer);
    const prototypeMetadataUri = await contract.tokenURI(0);
    const metadata = await fetcher.getMetadata(prototypeMetadataUri);
    const protoytypeImageUrl = metadata.image;
    console.log('proto type url fetched:', protoytypeImageUrl);
    let urls;
    if (config.fetchMode === 'ID'){
        urls = await urlsByIds(config.tokenList, protoytypeImageUrl)
    } else if (config.fetchMode === 'COUNT'){
        urls = await urlsByCount(config.tokenCount, protoytypeImageUrl)
    }
    console.log('Metadata collected complete');
    //4. Download images.
    Object.keys(urls).forEach(async k=>{
        await downloadImage(urls, k);
    });
    console.log('Download complete');
}

async function urlsByIds(tokenList, prototype){
    let urls = {}
    for (var i=0;i<tokenList.length;i++){
        const tokenId = tokenList[i];
        urls[tokenId] = utils.replace(prototype, tokenId);
    }
    return urls;
}

async function urlsByCount(tokenCount, prototype){
    //TODO:UPDATE ABI
    const total = await contract.totalSupply();
    console.log(total);
    tokenCount = Math.min(tokenCount, total);
    let urls = {}
    for (var i=0;i<tokenCount;i++) {
        urls[i] = utils.replace(prototype, i);
    }
    return urls;
}

async function downloadImage(urls, tokenId){
    let img = urls[tokenId];
    if(img.startsWith('http')){
         fetcher.downloadHttp(tokenId, img, config);
    } else{
    }

}


try{
    main();
}catch(error){
    console.error(error);
}
