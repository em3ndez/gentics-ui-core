import {Component, OnDestroy} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {Observable, Subscription} from 'rxjs';

import {GTX_FORM_DIRECTIVES, Modal, Button} from '../../../index';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';
import {SortableList, ISortableEvent} from '../../../components/sortable-list/sortable-list.component';
import {DragStateTrackerFactory, PageFileDragHandler, FileDropArea, PreventFileDrop} from '../../../index';

@Component({
    template: require('./file-drop-area-demo.tpl.html'),
    directives: [
        FileDropArea,
        PreventFileDrop,
        SortableList,
        Autodocs,
        DemoBlock,
        Button,
        HighlightedCode,
        GTX_FORM_DIRECTIVES,
        ROUTER_DIRECTIVES
    ],
    providers: [PageFileDragHandler, DragStateTrackerFactory]
})
export class FileDropAreaDemo implements OnDestroy {
    directiveSource: string = require('!!raw!../../../components/file-drop-area/file-drop-area.directive.ts');

    draggingFileOnThis = false;
    droppedFiles: File[] = [];
    droppedImages: File[] = [];
    droppedTextFiles: File[] = [];
    rejectedImages: File[] = [];
    rejectedTextFiles: File[] = [];
    reorderableFiles: File[] = [];
    isDisabled = true;
    preventOnPage = true;
    preventLocal = false;
    serviceEvents: string[] = [];
    subscription: Subscription;

    constructor(private dragdrop: PageFileDragHandler) {
        this.subscription = Observable.merge(
                dragdrop.dragEnter.mapTo('dragEnter'),
                dragdrop.dragStop.mapTo('dragStop'),
                dragdrop.filesDragged$.map($event => `filesDragged$ ($event = ${JSON.stringify($event)})`)
            ).subscribe(eventText => {
                let d = new Date();
                let time = d.toTimeString().split(' ')[0] + (d.getMilliseconds() / 1000).toFixed(3).substr(1);
                this.serviceEvents = this.serviceEvents.concat(`${time}: ${eventText}`);
            });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onDropFiles(files: File[]): void {
        this.draggingFileOnThis = false;
        this.droppedFiles.push(...files);
    }

    reorderList(event: ISortableEvent): void {
        this.reorderableFiles = event.sort(this.reorderableFiles);
    }

    addFilesToReorderableList(files: File[]): void {
        this.reorderableFiles.push(...files);
    }
}