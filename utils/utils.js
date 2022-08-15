function isEmpty(str) {
    return (!str || str.length === 0 );
}   


function replace(prototype, tokenId){
    let array = prototype.split('/');
    let tail = array.pop().substring(1);
    let replacedTail = tokenId+tail;
    array.push(replacedTail);
    return array.join('/');
}

async function tryUntilSucceed(promiseFn, maxTries=5) {
    try {
        return await promiseFn();
    } catch (e) {
        if (maxTries > 0) {
            return tryUntilSucceed(promiseFn, maxTries - 1);
        }
        console.log('retry')
        throw e;
    }
}

export {
    isEmpty,
    replace,
    tryUntilSucceed
};