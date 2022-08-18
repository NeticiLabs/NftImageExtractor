import * as httpAccessor from './httpAccessor.js';
import * as ipfsAccessor from './ipfsAccessor.js';



async function get(url, options={}) {
    if (url.startsWith('http')){
        return await httpAccessor.get(url, options);
     } else if(url.startsWith('ipfs')){
        return await ipfsAccessor.get(url, options);
    } else{
        throw new Error('Not supported for url ', url);
    }
}


export {
    get
}