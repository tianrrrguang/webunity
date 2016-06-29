import WebUnityNode from 'webunity-node.js';

export default class WebUnityUtils {

    static init(modList) {

        const nodeCache = {};
        const objList = [];

        //创建WebUnityNode
        for (var i = 0; i < modList.length; i++) {
            var data = modList[i];
            var nodeName = data.node;
            var nodeDomId = data.domid;
            if (!nodeCache[nodeName]) {
                nodeCache[nodeName] = new WebUnityNode(nodeDomId);
            }
        }

        //添加组件
        for (var i = 0; i < modList.length; i++) {
            var data = modList[i];
            var nodeName = data.node;
            var nodeDomId = data.domid;
            var nodeScriptClass = data.mod;
            var node = nodeCache[nodeName];
            //构造组件
            if ((typeof nodeScriptClass) != 'function' || !node.addComponent) {
                console.log("Warning: Invalid Component: [" + data.script + "]!");
                continue;
            }
            var json = {
                node: node
            };
            for (let v in data.ref) {
                var ref = data.ref[v];
                if (ref.indexOf('&') != 0) {
                    json[v] = ref;
                }
                else {
                    json[v] = nodeCache[ref.slice(1)];
                }
            }
            var obj = new nodeScriptClass(json);
            if (!obj) {
                continue;
            }
            objList.push(obj);
            //附加组件
            node.addComponent(data.script, obj);
        }

        //触发onLoad
        for (var i = 0; i < objList.length; i++) {
            objList[i].onLoad && objList[i].onLoad();
        }
    }

};