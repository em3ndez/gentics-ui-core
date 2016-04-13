import {Component} from 'angular2/core';
import {Router, RouteConfig, RouteDefinition, ROUTER_DIRECTIVES} from 'angular2/router';
import {TopBar, SearchBar, SideMenu, SplitViewContainer, ContentsListItem, Notification, OverlayHost} from '../index';
import {pages, kebabToPascal, IPageInfo} from './pageList';


const routes: RouteDefinition[] = pages.map((demo: IPageInfo) => {
   return {
       path: '/' + demo.name,
       name: kebabToPascal(demo.name),
       component: demo.component
   };
});


@Component({
    selector: 'default',
    template: ''
})
class DefaultRoute {}

routes.push({
    path: '/',
    name: 'DefaultRoute',
    component: DefaultRoute
});

@Component({
    selector: 'app',
    template: require('./app.tpl.html'),
    directives: [
        ROUTER_DIRECTIVES,
        TopBar,
        SearchBar,
        SplitViewContainer,
        SideMenu,
        ContentsListItem,
        OverlayHost
    ],
    providers: [Notification]
})
@RouteConfig(routes)
export class App {
    displayMenu: boolean = false;
    contentItems: any[] = pages.map((page: IPageInfo) => {
        return {
            title: kebabToPascal(page.name),
            route: kebabToPascal(page.name),
            keywords: page.keywords || [],
            type: page.type
        };
    });
    filteredContentItems: any[];
    hasContent: boolean = false;
    splitFocus: string = 'left';
    searchQuery: string;
    subscription: any;

    constructor(private router: Router) {
        this.subscription = router.subscribe(route => {
            this.hasContent = !!route;
        });
        this.filteredContentItems = this.contentItems.slice(0);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    filterContentItems(query: string): void {
        const match = (needle: string, haystack: string): boolean => {
            return -1 < haystack.toLowerCase().indexOf(needle.toLowerCase());
        };

        if (query && 0 < query.length) {
            this.filteredContentItems = this.contentItems.filter((item: any) => {
                let titleMatch = match(query, item.title);
                let keywordMatch = item.keywords.reduce((res: boolean, keyword: string) => {
                    return res || match(query, keyword);
                }, false);
                return titleMatch || keywordMatch;
            });
        } else {
            this.filteredContentItems = this.contentItems.slice(0);
        }
    }

    closeContent(): void {
        this.hasContent = false;
    }

    toggleMenu(newState: boolean): void {
        this.displayMenu = newState;
    }
}
