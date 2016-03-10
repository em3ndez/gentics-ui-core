import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    ViewChild
} from 'angular2/core';
import { DOM } from 'angular2/src/platform/dom/dom_adapter';

// HACK: workaround for enum type. With TypeScript >= 1.8.0, use:
//   type FocusType: 'left' | 'right';
export class FocusType {
    static LEFT = <FocusType> (<any> 'left');
    static RIGHT = <FocusType> (<any> 'right');
}

@Component({
    selector: 'gtx-split-view-container',
    template: require('./split-view-container.tpl.html')
})
export class SplitViewContainer implements AfterViewInit, OnDestroy {
    /**
     * Tells if a panel is opened on the right side in the split view.
     * Setting to false will also change {@link focusedPanel}.
     */
    @Input() get rightPanelVisible(): boolean {
        return this._rightPanelVisible;
    }
    set rightPanelVisible(visible: boolean) {
        if (visible != this._rightPanelVisible) {
            this._rightPanelVisible = visible;
            if (visible) {
                this.rightPanelOpened.emit(null);
            } else {
                this.rightPanelClosed.emit(null);
                if (this._focusedPanel == 'right') {
                    this._focusedPanel = 'left';
                    this.leftPanelFocused.emit(null);
                    this.focusedPanelChange.emit('left');
                }
            }
            this.rightPanelVisibleChange.emit(visible);
        }
    }

    /**
     * Tells the SplitViewContainer which side is focused.
     * Valid values are "left" and "right".
     */
    @Input()
    get focusedPanel(): FocusType {
        return this._focusedPanel;
    }
    set focusedPanel(panel: FocusType) {
        let newFocus: FocusType;
        if (panel == 'right' && this._rightPanelVisible) {
            newFocus = FocusType.RIGHT;
        } else {
            newFocus = FocusType.LEFT;
        }

        if (newFocus != this._focusedPanel) {
            this._focusedPanel = newFocus;

            if (newFocus == 'right') {
                this.rightPanelFocused.emit(null);
            } else {
                this.leftPanelFocused.emit(null);
            }
            this.focusedPanelChange.emit(newFocus);
        } else if (newFocus != panel) {
            this.focusedPanelChange.emit(newFocus);
        }
    }

    /**
     * Changes the container split in "large" layout.
     */
    leftContainerWidthPercent: number = 50;

    /**
     * The smallest panel size in percent the left
     * and right panels will shrink to when resizing.
     */
    @Input() minPanelSizePercent: number = 5;

    /**
     * The smallest panel size in pixels the left
     * and right panels will shrink to when resizing.
     */
    @Input() minPanelSizePixels: number = 20;


    /**
     * Triggers when the right panel is closed.
     */
    @Output()
    rightPanelClosed: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Triggers when the right panel is closed.
     */
    @Output()
    rightPanelOpened: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Triggers when the value of {@link rightPanelVisible} changes.
     * Allows to double-bind the property.
     * @example
     *     <split-view-container [(rightPanelVisible)]="property">
     */
    @Output()
    rightPanelVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * Triggers when the left panel is focused.
     */
    @Output()
    leftPanelFocused: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Triggers when the right panel is focused.
     */
    @Output()
    rightPanelFocused: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Triggers when the value of {@link focusedPanel} changes.
     * Allows to double-bind the property.
     * @example
     *     <split-view-container [(focusedPanel)]="property">
     */
    @Output()
    focusedPanelChange: EventEmitter<FocusType> = new EventEmitter<FocusType>();


    private _rightPanelVisible: boolean = false;
    private _focusedPanel: FocusType = 'left';
    private resizing: boolean = false;
    private resizeMouseOffset: number;
    private resizerXPosition: number;
    private boundBodyMouseUp: EventListener;
    private boundBodyMouseMove: EventListener;

    @ViewChild('resizeContainer') private resizeContainer: ElementRef;
    @ViewChild('leftPanel') private leftPanel: ElementRef;
    @ViewChild('resizer') private resizer: ElementRef;

    constructor(private ownElement: ElementRef) {
    }

    // (hacky) After initializing the view, make this component fill the height of the viewport
    ngAfterViewInit(): void {
        if (!this.ownElement || !this.ownElement.nativeElement) {
            return;
        }
        const element: HTMLElement = this.ownElement.nativeElement;
        const css: CSSStyleDeclaration = element.style;
        css.top = element.offsetTop + 'px';
        css.bottom = css.left = css.right = '0';
        css.position = 'absolute';
    }

    ngOnDestroy(): void {
        this.unbindBodyEvents();
    }

    private leftPanelClicked() {
        if (this._focusedPanel == FocusType.RIGHT) {
            this.focusedPanel = FocusType.LEFT;
        }
    }

    private rightPanelClicked() {
        if (this._focusedPanel == FocusType.LEFT && this._rightPanelVisible) {
            this.focusedPanel = FocusType.RIGHT;
        }
    }

    private startResizer(event: MouseEvent) {
        if (event.which != 1 || !this.leftPanel.nativeElement) { return; };
        event.preventDefault();

        const resizeHandle: HTMLElement = <HTMLElement> this.resizer.nativeElement;
        const mouseXOffset: number = event.clientX - resizeHandle.getBoundingClientRect().left;
        this.resizeMouseOffset = mouseXOffset;

        // Bind mousemove and mouseup on body (the Angular2 way)
        this.boundBodyMouseMove = this.moveResizer.bind(this);
        this.boundBodyMouseUp = this.endResizing.bind(this);
        const body: HTMLBodyElement = DOM.query('body');
        DOM.addClass(body, 'gtx-split-view-container-resizing');
        body.addEventListener('mousemove', this.boundBodyMouseMove);
        body.addEventListener('mouseup', this.boundBodyMouseUp);

        // Start resizing
        this.resizerXPosition = this.getAdjustedPosition(event.clientX);
        this.resizing = true;
    }

    private moveResizer(event: MouseEvent) {
        this.resizerXPosition = this.getAdjustedPosition(event.clientX);
    }

    private endResizing(event: MouseEvent) {
        this.leftContainerWidthPercent = this.getAdjustedPosition(event.clientX);
        this.resizing = false;
        this.unbindBodyEvents();
    }

    private unbindBodyEvents(): void {
        if (this.boundBodyMouseMove) {
            const body: HTMLBodyElement = DOM.query('body');
            DOM.removeClass(body, 'gtx-split-view-container-resizing');
            body.removeEventListener('mousemove', this.boundBodyMouseMove);
            body.removeEventListener('mouseup', this.boundBodyMouseUp);
            this.boundBodyMouseMove = null;
            this.boundBodyMouseUp = null;
        }
    }

    /**
     * Helper function to keep the resize functionality
     * within its limits (minPanelSizePixels & minPanelSizePercent).
     * @return {number} Returns the adjusted X postition in % of the container width.
     */
    private getAdjustedPosition(mouseClientX: number): number {
        const container: HTMLElement = <HTMLElement> this.resizeContainer.nativeElement;
        const containerOffset: number = container.getBoundingClientRect().left;
        const containerWidth: number = container.offsetWidth;
        const resizerWidth: number = (<HTMLElement> this.resizer.nativeElement).offsetWidth;
        const maxXPixels: number = containerWidth - resizerWidth - this.minPanelSizePixels;
        const maxXPercent: number = 100 * (1 - resizerWidth / containerWidth) - this.minPanelSizePercent;

        let relativeX: number = mouseClientX - this.resizeMouseOffset - containerOffset;
        if (relativeX < this.minPanelSizePixels) {
            relativeX = this.minPanelSizePixels;
        } else if (relativeX > maxXPixels) {
            relativeX = maxXPixels;
        }

        let percentX: number = 100 * (relativeX / containerWidth);
        if (percentX < this.minPanelSizePercent) {
            percentX = this.minPanelSizePercent;
        } else if (percentX > maxXPercent) {
            percentX = maxXPercent;
        }

        return percentX;
    }
}
