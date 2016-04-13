import {Component} from 'angular2/core';
import {GTX_FORM_DIRECTIVES, ContentsListItem} from '../../../index';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';

@Component({
    template: require('./contents-list-item-demo.tpl.html'),
    directives: [GTX_FORM_DIRECTIVES, ContentsListItem, Autodocs, DemoBlock, HighlightedCode]
})
export class ContentsListItemDemo {

    componentSource: string = require('!!raw!../../../components/contents-list-item/contents-list-item.component.ts');
    
    listItems: string[] = [
        'foo',
        'bar',
        'baz'
    ];
}
