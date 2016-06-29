import WebUnityComponent from 'webunity-component';

export default class IndexClass extends WebUnityComponent {

    // constructor(...args) {
    //     super(...args);
    //     console.log('IndexClass constructor!!');
    // }

    onLoad() {
        // console.log('IndexClass', this.node.dom);
        // console.log('IndexClass.a', this.a);
        console.log('IndexClass.test', this.test);
        // console.log('IndexClass.test', this.test._data.components);
        const indexTest = this.test.getComponent('test');
        indexTest.html('index insert something!');
    }

};

console.warn(typeof IndexClass);
console.warn(IndexClass.name);
console.warn(IndexClass.isWebUnityComponent());