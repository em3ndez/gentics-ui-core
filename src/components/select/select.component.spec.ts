import {Component, DebugElement} from 'angular2/core';
import {ControlGroup, Control} from 'angular2/common';
import {By} from 'angular2/platform/browser';
import {
    ComponentFixture,
    describe,
    expect,
    fakeAsync,
    flushMicrotasks,
    injectAsync,
    it,
    iit,
    xit,
    tick,
    TestComponentBuilder
} from 'angular2/testing';
import {Select, GtxSelectValueAccessor} from './select.component';
import {GtxInputValueAccessor} from '../input/input.component';



describe('Select', () => {

    it('should bind the label', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.overrideTemplate(TestComponent, `<gtx-select label="testLabel"></gtx-select>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                let label: HTMLElement = fixture.nativeElement.querySelector('label');
                fixture.detectChanges();

                expect(label.innerText).toBe('testLabel');
            });
    }));

    it('should bind the id to the label and input', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.overrideTemplate(TestComponent, `<gtx-select label="testLabel" id="testId"></gtx-select>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                let label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
                let nativeSelect: HTMLSelectElement = fixture.nativeElement.querySelector('select');

                fixture.detectChanges();

                expect(label.htmlFor).toBe('testId');
                expect(nativeSelect.id).toBe('testId');
            });
    }));

    it('should use defaults for undefined attributes which have a default', injectAsync([TestComponentBuilder],
        (tcb: TestComponentBuilder) => {
            return tcb.overrideTemplate(TestComponent, `<gtx-select></gtx-select>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    let nativeSelect: HTMLSelectElement = fixture.nativeElement.querySelector('select');
                    fixture.detectChanges();

                    expect(nativeSelect.disabled).toBe(false);
                    expect(nativeSelect.multiple).toBe(false);
                    expect(nativeSelect.required).toBe(false);
                });
        }));

    it('should not display undefined attributes', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.overrideTemplate(TestComponent, `<gtx-select></gtx-select>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                let nativeSelect: HTMLSelectElement = fixture.nativeElement.querySelector('select');
                const getAttr: Function = (name: string) => nativeSelect.attributes.getNamedItem(name);
                fixture.detectChanges();

                expect(getAttr('id')).toBe(null);
                expect(getAttr('name')).toBe(null);
            });
    }));

    it('should pass through the native attributes', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.overrideTemplate(TestComponent, `<gtx-select
                          disabled="true"
                          multiple="true"
                          name="testName"
                          required="true"
                      ></gtx-select>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                let nativeSelect: HTMLSelectElement = fixture.nativeElement.querySelector('select');
                fixture.detectChanges();

                expect(nativeSelect.disabled).toBe(true);
                expect(nativeSelect.multiple).toBe(true);
                expect(nativeSelect.name).toBe('testName');
                expect(nativeSelect.required).toBe(true);
            });
    }));

    it('should accept a "value" string and make the matching option "selected"', injectAsync([TestComponentBuilder],
        (tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    fixture.detectChanges();
                    let optionBar: HTMLOptionElement = <HTMLOptionElement> fixture.nativeElement
                        .querySelector('option[value="Bar"]');

                    expect(optionBar.selected).toBe(true);
                });
        }));

    it('should accept a "value" array and make the matching options "selected" (multi select)', injectAsync([TestComponentBuilder],
        fakeAsync((tcb: TestComponentBuilder) => {
            return tcb
                .overrideTemplate(TestComponent, `
                                <gtx-select [value]="multiValue" multiple="true">
                                    <option *ngFor="#option of options" [value]="option">{{ option }}</option>
                                </gtx-select>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    fixture.detectChanges();
                    tick();

                    let options: NodeListOf<HTMLOptionElement> = fixture.nativeElement.querySelectorAll('option');

                    expect(options[0].selected).toBe(false);
                    expect(options[1].selected).toBe(true);
                    expect(options[2].selected).toBe(true);
                });
        })));

    it('should update "value" when another option is clicked', injectAsync([TestComponentBuilder],
        fakeAsync((tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    fixture.detectChanges();
                    tick();
                    let selectInstance: Select = fixture.debugElement.query(By.css('gtx-select')).componentInstance;
                    let optionLIs: NodeListOf<HTMLLIElement> = fixture.nativeElement.querySelectorAll('li');

                    optionLIs[0].click();
                    tick();
                    expect(selectInstance.value).toBe('Foo');

                    optionLIs[2].click();
                    tick();
                    expect(selectInstance.value).toBe('Baz');
                });
        })));

    /**
     * TODO: find out why this fails with error "1 periodic timer(s) still in the queue."
     * then re-enable
     */
    xit('should emit "blur" when input blurs, with current value', injectAsync([TestComponentBuilder],
        fakeAsync((tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    fixture.detectChanges();
                    tick();
                    let fakeInput: HTMLInputElement = fixture.nativeElement.querySelector('input.select-dropdown');
                    let instance: TestComponent = fixture.componentInstance;
                    spyOn(instance, 'onBlur');

                    let event: Event = document.createEvent('Event');
                    event.initEvent('blur', true, true);
                    fakeInput.dispatchEvent(event);
                    tick();

                    expect(instance.onBlur).toHaveBeenCalledWith('Bar');
                });
        })));

    it('should emit "change" when a list item is clicked', injectAsync([TestComponentBuilder],
        fakeAsync((tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    fixture.detectChanges();
                    tick();

                    let optionLIs: NodeListOf<HTMLLIElement> = fixture.nativeElement.querySelectorAll('li');
                    let instance: TestComponent = fixture.componentInstance;
                    spyOn(instance, 'onChange');

                    optionLIs[0].click();
                    tick();
                    expect(instance.onChange).toHaveBeenCalledWith('Foo');

                    optionLIs[2].click();
                    tick();
                    expect(instance.onChange).toHaveBeenCalledWith('Baz');
                });
        })));

    it('should emit "change" when a list item is clicked (multiple select)', injectAsync([TestComponentBuilder],
        fakeAsync((tcb: TestComponentBuilder) => {
            return tcb.overrideTemplate(TestComponent,
                `<gtx-select multiple="true"
                             [value]="value"
                             (change)="onChange($event)">
                      <option *ngFor="#option of options" [value]="option">{{ option }}</option>
                 </gtx-select>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    fixture.detectChanges();
                    tick();

                    let optionLIs: NodeListOf<HTMLLIElement> = fixture.nativeElement.querySelectorAll('li');
                    let instance: TestComponent = fixture.componentInstance;
                    spyOn(instance, 'onChange');

                    optionLIs[0].click();
                    tick();
                    expect((<any> instance.onChange).calls.argsFor(0)[0]).toEqual(['Bar', 'Foo']);

                    optionLIs[2].click();
                    tick();
                    expect((<any> instance.onChange).calls.argsFor(1)[0]).toEqual(['Bar', 'Foo', 'Baz']);
                });
        })));

    describe('ValueAccessor:', () => {

        it('should bind the value with NgModel (outbound)', injectAsync([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                return tcb.overrideTemplate(TestComponent, `<gtx-select [(ngModel)]="ngModelValue">
                                                                <option *ngFor="#option of options" [value]="option">{{ option }}</option>
                                                            </gtx-select>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        tick();

                        let instance: TestComponent = fixture.componentInstance;
                        let optionLIs: NodeListOf<HTMLLIElement> = fixture.nativeElement.querySelectorAll('li');

                        optionLIs[0].click();
                        tick();
                        tick();
                        fixture.detectChanges();
                        expect(instance.ngModelValue).toBe('Foo');

                        optionLIs[2].click();
                        tick();
                        tick();
                        fixture.detectChanges();
                        expect(instance.ngModelValue).toBe('Baz');
                    });
            })));

        it('should bind the value with NgControl (outbound)', injectAsync([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                return tcb.overrideTemplate(TestComponent,
                    `<form [ngFormModel]="testForm">
                         <gtx-select ngControl="test">
                             <option *ngFor="#option of options" [value]="option">{{ option }}</option>
                         </gtx-select>
                     </form>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        tick();
                        let instance: TestComponent = fixture.componentInstance;
                        let optionLIs: NodeListOf<HTMLLIElement> = fixture.nativeElement.querySelectorAll('li');

                        optionLIs[0].click();
                        tick();
                        tick();
                        fixture.detectChanges();
                        expect(instance.testForm.controls['test'].value).toBe('Foo');

                        optionLIs[2].click();
                        tick();
                        tick();
                        fixture.detectChanges();
                        expect(instance.testForm.controls['test'].value).toBe('Baz');
                    });
            })));

    });

});


@Component({
    template: `<gtx-select [value]="value"
                           (blur)="onBlur($event)"
                           (change)="onChange($event)">
                    <option *ngFor="#option of options" [value]="option">{{ option }}</option>
               </gtx-select>`,
    directives: [Select, GtxSelectValueAccessor]
})
class TestComponent {

    value: string = 'Bar';
    multiValue: string[] = ['Bar', 'Baz'];
    ngModelValue: string = 'Bar';
    options: string[] = ['Foo', 'Bar', 'Baz'];
    testForm: ControlGroup;

    constructor() {
        this.testForm = new ControlGroup({
            test: new Control('Bar')
        });
    }

    onBlur(): void {}
    onFocus(): void {}
    onChange(): void {}
}
