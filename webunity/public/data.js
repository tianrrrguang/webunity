var g = {};

exports.get = function(key){
    return g[key];
};

exports.set = function(key, val){
    g[key] = val;
};