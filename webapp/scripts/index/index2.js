import lib from 'lib/lib';
import WebUnityComponent from 'webunity-component';

export default class IndexClass2 extends WebUnityComponent {

    onLoad() {
        // console.warn('IndexClass2', this.node);
        // console.warn('IndexClass2.a', this.a);
        // console.warn('IndexClass2.test', this.test);
        const indexTest = this.test.getComponent('test');
        indexTest.test1('222');
    }

};