import axios from 'axios';
import * as utils from './utils.js';

let headers= {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Safari/605.1.15'
}

async function get(url, options={}) {
    return utils.tryUntilSucceed(async ()=>{
        return await axios.get(url, {...options, headers:headers})
    });
}


export {
    get
}