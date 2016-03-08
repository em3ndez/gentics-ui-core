import {Component, DebugElement} from 'angular2/core';
import {By} from 'angular2/platform/browser';
import {
    beforeEach,
    ComponentFixture,
    describe,
    expect,
    fakeAsync,
    inject,
    injectAsync,
    it,
    tick,
    setBaseTestProviders,
    TestComponentBuilder
} from 'angular2/testing';
import {SearchBar} from './search-bar.component';

describe('SearchBar', () => {

    it('should fill input with value of the "query" prop', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                fixture.detectChanges();
                let input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
                expect(input.value).toBe('foo');
            });
    }));

    it('should emit the "search" event when button clicked',
        injectAsync([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
        return tcb.createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                fixture.detectChanges();
                let testInstance: TestComponent = fixture.componentInstance;
                let searchButtonDel: DebugElement = fixture.debugElement.query(By.css('button'));

                spyOn(testInstance, 'onSearch');
                searchButtonDel.triggerEventHandler('click', null);

                tick();
                expect(testInstance.onSearch).toHaveBeenCalledWith('foo');
            });
    })));

    it('should emit the "search" event when enter key pressed in input',
        injectAsync([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
        return tcb.createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                fixture.detectChanges();
                let testInstance: TestComponent = fixture.componentInstance;
                let searchBar: SearchBar = fixture.debugElement.query(By.css('gtx-search-bar')).componentInstance;
                spyOn(testInstance, 'onSearch');

                // Unable to test keyboard events directly - tried several approaches from
                // http://stackoverflow.com/questions/596481/simulate-javascript-key-events,
                // so we just directly invoke the class method.
                searchBar.onKeyDown(<KeyboardEvent> { keyCode: 13 }, 'foo');
                tick();

                expect(testInstance.onSearch).toHaveBeenCalledWith('foo');
            });
    })));

    it('should emit the "change" event when key pressed in input',
        injectAsync([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
        return tcb.createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                fixture.detectChanges();
                let testInstance: TestComponent = fixture.componentInstance;
                let searchBar: SearchBar = fixture.debugElement.query(By.css('gtx-search-bar')).componentInstance;
                spyOn(testInstance, 'onChange');

                // Unable to test keyboard events directly - tried several approaches from
                // http://stackoverflow.com/questions/596481/simulate-javascript-key-events,
                // so we just directly invoke the class method.
                searchBar.onKeyDown(<KeyboardEvent> { keyCode: 79 }, 'foo');
                tick();

                expect(testInstance.onChange).toHaveBeenCalledWith('foo');
            });
    })));
});

@Component({
    template: `<gtx-search-bar query="foo" (search)="onSearch($event)" (change)="onChange($event)"></gtx-search-bar>`,
    directives: [SearchBar]
})
class TestComponent {
    onSearch() : void {}
    onChange() : void {}
}