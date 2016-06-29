
exports.b1 = function () {
    return `
import WebUnityUtils from 'webunity-utils.js';

const modList = [];
`;
};

exports.b2 = function (node, id, data) {
    const arr = [];
    const _data = [];
    arr.push(`node: "${node}"`);
    if( data.script ){
        arr.push(`script: "${data.script}"`);
        arr.push(`mod: require("${data.js}").default`);
    }
    arr.push(`domid: "${id}"`);
    for (var v in data.ref) {
        if (typeof data.ref[v] == 'string') {
            _data.push(v + ': "' + data.ref[v] + '"');
        }
        else {
            _data.push(v + ': new WebUnityNode("' + data.ref[v].id + '")');
        }
    }
    data.script && arr.push('ref: {' + _data.join(', ') + '}');
    return `modList.push({` + arr.join(', ') + `});\r\n`;
};

exports.b3 = function () {
    return '\r\nWebUnityUtils.init(modList);\r\n';
};