import WebUnityNode from 'webunity-node.js';

export default class WebUnityUtils {

    static init(modList) {

        const nodeCache = {};
        const jsObjList = [];

        //创建WebUnityNode
        for (var name in modList) {
            if (!nodeCache[name]) {
                nodeCache[name] = new WebUnityNode(modList[name].domid);
            }
        }

        //组件处理
        for (var name in modList) {
            const data = modList[name];
            const node = nodeCache[name];
            var scriptList = data.script || [];
            //添加用户脚本组件
            scriptList.forEach(function (js) {
                if (typeof js.mod != 'function' || !node.addComponent) {
                    console.log("Warning: Invalid Component: [" + js.name + "]!");
                    return;
                }
                //构造初始化参数
                const json = { node: node };
                for (var v in js.ref) {
                    const ref = js.ref[v];
                    if (ref.indexOf('&') != 0) {
                        json[v] = ref;
                    }
                    else {
                        json[v] = nodeCache[ref.slice(1)];
                    }
                }
                //构造脚本组件
                const jsObj = new js.mod(json);
                if (!jsObj) {
                    return;
                }
                jsObjList.push(jsObj);
                //挂载脚本组件到node
                node.addComponent(js.name, jsObj);
            });

        }

        //触发所有用户脚本组件的onLoad
        for (var i = 0; i < jsObjList.length; i++) {
            jsObjList[i].onLoad && jsObjList[i].onLoad();
        }
    }

};