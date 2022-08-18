import fs from 'fs';
import * as http from './httpAccessor.js';

const gateways = loadGateways();

async function get(url, options={}){
    const body = url.substring("ipfs://".length);
    for (var i=0;i<gateways.length;i++){
        const httpUrl = gateways[i] + '/ipfs/' + body;
        try {
            return await http.get(httpUrl, options);
        }
        catch(err){
            console.log('Try another ipfs gateway');
        }
    }
}

function loadGateways() {
    const content = fs.readFileSync('ipfs.txt', 'utf-8');
    return content.split(/\r?\n/);
}

export {
    get
}