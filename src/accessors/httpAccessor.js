import axios from 'axios';
import utils from '../utils.js';
import uaPool from 'random-useragent';

async function get(url, options={}) {
    let headers= {
        'User-Agent': uaPool.getRandom()
    };
    return utils.tryUntilSucceed(async ()=>{
        return await axios.get(url, {...options, headers:headers})
    });
}


export {
    get
}