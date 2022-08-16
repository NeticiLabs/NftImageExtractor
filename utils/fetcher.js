import fs from 'fs';
import axios from 'axios';
import Path from 'path';
import * as utils from './utils.js';

let headers= {
     'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Safari/605.1.15'
}

async function getMetadata(url) {

    let resp =  await utils.tryUntilSucceed(async ()=>{
        if (url.startsWith('http')){
            return await axios.get(url, {headers:headers})
        } else if(url.startsWith('ipfs')){
            //TODO:存一个IPFS网关列表，挨个尝试，把文件下载下来
            throw new Error('Not supported');
        }
    });
    return resp.data;
}

async function downloadHttp(tokenId, url, config) {
    const downloadTo = Path.resolve(process.cwd(), "downloads", config.name);
    if (!fs.existsSync(downloadTo)){
        fs.mkdirSync(downloadTo, {recursive:true});
    }
    const tail = url.split('/').pop();
    await utils.tryUntilSucceed(async ()=>{
        const path = Path.resolve(downloadTo, tail);
        const writer = fs.createWriteStream(path);
        let resp = await axios.get(url,{responseType: 'stream', headers:headers});
        resp.data.pipe(writer);
    });
}

export {
    getMetadata,
    downloadHttp
}