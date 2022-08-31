
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
            console.log('start fetch proxy')
            const proxyJson= await axios.get(process.env.PROXY_POOL_API);
            const proxy = proxyJson.data.proxy;


            config = {
            ...config, 
            proxy: false, // has to be false
            httpsAgent: ProxyAgent(`http://${proxy}`)
            }

            // const test = await axios.head(url);
            // console.log('test result', test.status)
        
        }catch(err){
            console.log('error testing proxy:', err.message)
            config.httpsAgent = undefined
        }


    }

    return await utils.tryUntilSucceed(async ()=>{
        return await axios.get(url, config)
    });
}


export {
    get
}