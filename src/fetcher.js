import fs from 'fs';
import Path from 'path';
import * as accessor from './accessors/accessor.js';


async function fetchMetadata(url) {
    return (await accessor.get(url)).data;
}

async function fetchImage(tokenId, url, config) {
    const downloadTo = Path.resolve(process.cwd(), "downloads", config.name);
    //Ensure dir exists
    if (!fs.existsSync(downloadTo)){
        fs.mkdirSync(downloadTo, {recursive:true});
    }
    //Try parse the best suffix
    const suffix = guessSuffix(url, tokenId);

    let resp = await accessor.get(url, {responseType: 'stream'});
    
    const path = Path.resolve(downloadTo, suffix);
    const writer = fs.createWriteStream(path);
    await resp.data.pipe(writer);
}


function guessSuffix(url, tokenId) {
    let suffix = url.split('/').pop();
    if (!suffix.includes('.')){//xxx.jpg or png
        suffix = String(tokenId);
    }
    return suffix;
}

export {
    fetchMetadata,
    fetchImage
}