function parseTokenStr(str) {
    if (!str || str.length == 0) {
        throw new Error('Invalid str');
    }
    let ans = [];
    let index = str.indexOf('~');
    if (index >= 0) {
        let begin = parseInt(str.substring(0, index));
        let end = parseInt(str.substring(index+1, str.length));
        for (let token=begin;token<=end;token++){
            ans.push(token);
        }
    } else{
        let nums = str.split(',');
        for (var i=0;i<nums.length;i++){
            ans.push(parseInt(nums[i]));
        }
    }
    return ans;
}


function isEmpty(str) {
    return (!str || str.length === 0 );
}   


function replace(prototype, tokenId){
    let array = prototype.split('/');
    const tailStr = array.pop();
    const tail = tailStr.substring(tailStr.indexOf('.'));
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
    parseTokenStr,
    isEmpty,
    replace,
    tryUntilSucceed,  
};