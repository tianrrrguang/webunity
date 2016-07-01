export default class WebUnityComponent {

    constructor(_data) {
        for (let v in _data) {
            this[v] = _data[v];
        }
    }

    onLoad() {
        //TODO
    }

    static isWebUnityComponent() {
        return true;
    }

};
