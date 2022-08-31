
import utils from '../utils.js';
import uaPool from 'random-useragent';
import ProxyAgent from'https-proxy-agent';
import axios from 'axios';




async function get(url, config={}) {
    let headers= {
        'User-Agent': uaPool.getRandom()
    };
    config = {
        ...config,
        headers: headers
    }
    if (process.env.PROXY_POOL_API){
        try{
            const proxyJson= await axios.get(process.env.PROXY_POOL_API);
            const proxy = proxyJson.data.proxy;
            config = {
            ...config, 
            proxy: false, // has to be false
            httpsAgent: ProxyAgent(`http://${proxy}`)
        }
        }catch(err){
            console.log(err)
        }


    }

    return await utils.tryUntilSucceed(async ()=>{
        return await axios.get(url, config)
    });
}


export {
    get
}