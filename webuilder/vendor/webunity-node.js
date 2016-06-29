export default class WebUnityNode {

    constructor(domid) {
        this._data = {
            domid: domid,
            dom: document.getElementById(domid),
            components: {}
        };
    }

    dom() {
        return this._data.dom;
    }

    getComponent(key) {
        return this._data.components[key];
    }

    addComponent(key, obj) {
        this._data.components[key] = obj;
    }

};
