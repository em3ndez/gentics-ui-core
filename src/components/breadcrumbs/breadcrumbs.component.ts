import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {isPresent} from '@angular/core/src/facade/lang';

export interface IBreadcrumbLink {
    href?: string;
    text: string;
    [key: string]: any;
}

export interface IBreadcrumbRouterLink {
    route: any[];
    text: string;
    [key: string]: any;
}

/**
 * A Breadcrumbs navigation component.
 *
 * ```html
 * <gtx-breadcrumbs></gtx-breadcrumbs>
 * ```
 */
@Component({
    selector: 'gtx-breadcrumbs',
    template: require('./breadcrumbs.tpl.html'),
    directives: [ROUTER_DIRECTIVES]
})
export class Breadcrumbs implements OnChanges {

    /**
     * A list of links to display
     */
    @Input() links: IBreadcrumbLink[];


    /**
     * A list of RouterLinks to display
     */
    @Input() routerLinks: IBreadcrumbRouterLink[];

    /**
     * Controls whether the navigation is disabled.
     */
    @Input() get disabled(): boolean {
        return this.isDisabled;
    }
    set disabled(val: boolean) {
        this.isDisabled = isPresent(val) && val !== false;
    }

    /**
     * Fires when a link is clicked
     */
    @Output() linkClick = new EventEmitter<IBreadcrumbLink | IBreadcrumbRouterLink>();


    private isDisabled: boolean = false;
    private backLink: IBreadcrumbLink | IBreadcrumbRouterLink;


    ngOnChanges(changes: SimpleChanges): void {
        if (changes['links'] || changes['routerLinks']) {
            let allLinks = (this.links || []).concat(this.routerLinks || []);
            this.backLink = allLinks[allLinks.length - 2];
        }
    }

    private onLinkClicked(link: IBreadcrumbLink | IBreadcrumbRouterLink, event: Event): void {
        if (this.isDisabled) {
            event.preventDefault();
            event.stopImmediatePropagation();
        } else {
            this.linkClick.emit(link);
        }
    }
}
