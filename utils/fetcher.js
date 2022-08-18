import fs from 'fs';
import Path from 'path';
import * as utils from './utils.js';
import * as httpAccessor from './httpAccessor.js';
import * as ipfsAccessor from './ipfsAccessor.js';


async function fetchMetadata(url) {
    if (url.startsWith('http')){
        return (await httpAccessor.get(url)).data;
     } else if(url.startsWith('ipfs')){
        return (await ipfsAccessor.get(url)).data;
    } else{
        throw new Error('Not supported for url ', url);
    }
}

async function fetchImage(tokenId, url, config) {
    const downloadTo = Path.resolve(process.cwd(), "downloads", config.name);
    if (!fs.existsSync(downloadTo)){
        fs.mkdirSync(downloadTo, {recursive:true});
    }
    const tail = url.split('/').pop();

    let resp;
    if (url.startsWith('http')){
        resp = await httpAccessor.get(url, {responseType: 'stream'});
     } else if(url.startsWith('ipfs')){
        resp = await httpAccessor.get(url, {responseType: 'stream'});
    } else{
        throw new Error('Not supported for url ', url);
    }

    const path = Path.resolve(downloadTo, tail);
    const writer = fs.createWriteStream(path);
    resp.data.pipe(writer);
}

export {
    fetchMetadata,
    fetchImage
}