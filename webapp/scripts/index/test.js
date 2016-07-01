import lib from 'lib/lib';
import WebUnityComponent from 'webunity-component';

export default class TestClass extends WebUnityComponent {

    onLoad() {
        console.log('TestClass');
    }

    test1(msg){
        console.warn('test: ', msg);
    }

    html(txt){
        this.node.dom().innerHTML = txt;
    }

};