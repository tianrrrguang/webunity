import lib from 'lib/lib';
import WebUnityComponent from 'webunity-component';

export default class LoginClass extends WebUnityComponent {

    onLoad() {
        this.node.dom().style.background = 'red';
        console.log('id:', this.node.dom().id);
        console.log('aaa:', this.aaa);
        console.log('&tpl:', this.tpl.dom().innerHTML);
    }

};
