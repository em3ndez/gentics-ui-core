import {Component, DebugElement} from 'angular2/core';
import {ControlGroup, Control} from 'angular2/common';
import {By} from 'angular2/platform/browser';
import {
    ComponentFixture,
    describe,
    expect,
    fakeAsync,
    injectAsync,
    it,
    xit,
    tick,
    TestComponentBuilder
} from 'angular2/testing';
import {RadioButton, RadioGroup} from './radio-button.component';



describe('RadioButton', () => {

    it('should bind the label', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.overrideTemplate(TestComponent, `<gtx-radio-button label="testLabel"></gtx-radio-button>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
                fixture.detectChanges();
                expect(label.innerText).toBe('testLabel');
            });
    }));

    it('should bind the id to the label and input', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.overrideTemplate(TestComponent, `
            <gtx-radio-button
                label="testLabel"
                id="testId"
            ></gtx-radio-button>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
                const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                fixture.detectChanges();

                expect(label.htmlFor).toBe('testId');
                expect(label.getAttribute('for')).toBe('testId');
                expect(nativeInput.id).toBe('testId');
            });
    }));

    it('should use defaults for undefined attributes which have a default',
        injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb.overrideTemplate(TestComponent, `<gtx-radio-button></gtx-radio-button>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    fixture.detectChanges();

                    expect(nativeInput.checked).toBe(false);
                    expect(nativeInput.disabled).toBe(false);
                    expect(nativeInput.readOnly).toBe(false);
                    expect(nativeInput.required).toBe(false);
                    expect(nativeInput.value).toBe('');
                });
        }
    ));

    it('should not display undefined attributes', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.overrideTemplate(TestComponent, `<gtx-radio-button></gtx-radio-button>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                const getAttr: Function = (name: string) => nativeInput.attributes.getNamedItem(name);
                fixture.detectChanges();

                expect(getAttr('max')).toBe(null);
                expect(getAttr('min')).toBe(null);
                expect(getAttr('maxLength')).toBe(null);
                expect(getAttr('name')).toBe(null);
                expect(getAttr('pattern')).toBe(null);
                expect(getAttr('placeholder')).toBe(null);
                expect(getAttr('step')).toBe(null);
            });
    }));


    it('should prefill a unique "id" if none is passed in', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.overrideTemplate(TestComponent, `<gtx-radio-button></gtx-radio-button>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                const getAttr: Function = (name: string) => nativeInput.attributes.getNamedItem(name);
                fixture.detectChanges();

                const id: Attr = nativeInput.attributes.getNamedItem('id');
                expect(id).not.toBe(null);
                expect(id.value.length).toBeGreaterThan(0);
            });
    }));

    it('should pass through the native attributes', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.overrideTemplate(TestComponent, `
            <gtx-radio-button
                disabled="true"
                checked="true"
                name="testName"
                readonly="true"
                required="true"
                value="testValue"
            ></gtx-radio-button>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                fixture.detectChanges();

                expect(nativeInput.disabled).toBe(true);
                expect(nativeInput.checked).toBe(true);
                expect(nativeInput.name).toBe('testName');
                expect(nativeInput.readOnly).toBe(true);
                expect(nativeInput.required).toBe(true);
                expect(nativeInput.value).toBe('testValue');
            });
    }));

    it('should apply a css class "with-gap" when withGap is set', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.overrideTemplate(TestComponent, `
            <gtx-radio-button withGap></gtx-radio-button>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                fixture.detectChanges();
                const cssClass: string = nativeInput.className;
                expect(cssClass).toMatch(/\bwith-gap\b/);
           });
    }));

    it('should not apply the css class "with-gap" when withGap is not set',
        injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb.overrideTemplate(TestComponent, `
                <gtx-radio-button></gtx-radio-button>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    fixture.detectChanges();
                    const cssClass: string = nativeInput.className;
                    expect(cssClass).not.toMatch(/\bwith-gap\b/);
            });
        })
    );

    it('should emit "blur" with current check state when the native input blurs', injectAsync([TestComponentBuilder],
        fakeAsync((tcb: TestComponentBuilder) => {
            return tcb.overrideTemplate(TestComponent, `
                <gtx-radio-button
                    (blur)="onBlur($event)"
                    value="foo"
                    [checked]="true"
                ></gtx-radio-button>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    const debugInput: DebugElement = fixture.debugElement.query(By.css('input'));
                    const instance: TestComponent = fixture.componentInstance;
                    fixture.detectChanges();
                    spyOn(instance, 'onBlur');

                    debugInput.triggerEventHandler('blur', null);
                    tick();

                    expect(instance.onBlur).toHaveBeenCalledWith(true);
                });
        }))
    );

    it('should emit "focus" with current check state when the native input is focused', injectAsync([TestComponentBuilder],
        fakeAsync((tcb: TestComponentBuilder) => {
            return tcb.overrideTemplate(TestComponent, `
                <gtx-radio-button
                    (focus)="onFocus($event)"
                    value="foo"
                ></gtx-radio-button>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    const debugInput: DebugElement = fixture.debugElement.query(By.css('input'));
                    const instance: TestComponent = fixture.componentInstance;
                    fixture.detectChanges();
                    spyOn(instance, 'onFocus');

                    debugInput.triggerEventHandler('focus', null);
                    tick();

                    expect(instance.onFocus).toHaveBeenCalledWith(false);
                });
        }))
    );

    describe('ValueAccessor:', () => {

        it('should change a variable bound with ngModel when selected', injectAsync([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                return tcb.overrideTemplate(TestComponent, `
                    <gtx-radio-button
                        [(ngModel)]="boundProperty"
                        value="foo"
                        [checked]="checkState"
                    ></gtx-radio-button>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                        const instance: TestComponent = fixture.componentInstance;
                        instance.boundProperty = null;
                        fixture.detectChanges();
                        tick();
                        expect(instance.checkState).toBe(false);
                        expect(instance.boundProperty).toBe(null);

                        instance.checkState = true;
                        fixture.detectChanges();
                        tick();
                        expect(instance.checkState).toBe(true);
                        expect(instance.boundProperty).toBe('foo');
                    });
            })
        ));

        it('should bind the check state with NgModel (inbound)',
            injectAsync([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
                return tcb.overrideTemplate(TestComponent, `
                    <gtx-radio-button
                        [(ngModel)]="boundProperty"
                        value="otherValue">
                    </gtx-radio-button>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        const instance: TestComponent = fixture.componentInstance;
                        const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                        expect(nativeInput.checked).toBe(false);

                        instance.boundProperty = 'otherValue';
                        fixture.detectChanges();
                        tick();
                        expect(nativeInput.checked).toBe(true);

                        instance.boundProperty = null;
                        fixture.detectChanges();
                        tick();
                        expect(nativeInput.checked).toBe(false);
                    });
            })
        ));

        it('should update a bound property with NgModel (outbound)', injectAsync([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                return tcb.overrideTemplate(TestComponent, `
                    <gtx-radio-button
                        [(ngModel)]="boundProperty"
                        [checked]="checkState"
                        value="otherValue"
                    ></gtx-radio-button>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        tick();
                        const instance: TestComponent = fixture.componentInstance;
                        const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                        expect(instance.checkState).toBe(false);
                        expect(nativeInput.checked).toBe(false);
                        expect(instance.boundProperty).toBe('boundValue');

                        instance.checkState = true;
                        fixture.detectChanges();
                        tick();
                        expect(instance.checkState).toBe(true);
                        expect(nativeInput.checked).toBe(true);
                        expect(instance.boundProperty).toBe('otherValue');
                    });
            })
        ));

        it('should update multiple radioButtons bound on one NgModel (inbound)',
            injectAsync([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
                return tcb.overrideTemplate(TestComponent, `
                    <gtx-radio-button
                        [(ngModel)]="boundObjectProperty"
                        [value]="objectValues[0]">
                    </gtx-radio-button>
                    <gtx-radio-button
                        [(ngModel)]="boundObjectProperty"
                        [value]="objectValues[1]">
                    </gtx-radio-button>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        tick();
                        const instance: TestComponent = fixture.componentInstance;
                        const nativeInputs: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');

                        expect(nativeInputs[0].checked).toBe(false);
                        expect(nativeInputs[1].checked).toBe(false);

                        instance.boundObjectProperty = instance.objectValues[0];
                        fixture.detectChanges();
                        tick();
                        expect(nativeInputs[0].checked).toBe(true);
                        expect(nativeInputs[1].checked).toBe(false);

                        instance.boundObjectProperty = instance.objectValues[1];
                        fixture.detectChanges();
                        tick();
                        expect(nativeInputs[0].checked).toBe(false);
                        expect(nativeInputs[1].checked).toBe(true);
                    });
            })
        ));

        it('should update multiple radioButtons bound on one NgModel (outbound)',
            injectAsync([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
                return tcb.overrideTemplate(TestComponent, `
                    <gtx-radio-button
                        [(ngModel)]="boundObjectProperty"
                        [value]="objectValues[0]">
                    </gtx-radio-button>
                    <gtx-radio-button
                        [(ngModel)]="boundObjectProperty"
                        [value]="objectValues[1]">
                    </gtx-radio-button>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        tick();
                        const instance: TestComponent = fixture.componentInstance;
                        const nativeInputs: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');

                        expect(nativeInputs[0].checked).toBe(false);
                        expect(nativeInputs[1].checked).toBe(false);

                        nativeInputs[0].click();
                        tick();
                        fixture.detectChanges();
                        tick();
                        expect(nativeInputs[0].checked).toBe(true);
                        expect(nativeInputs[1].checked).toBe(false);
                        expect(instance.boundObjectProperty).toBe(instance.objectValues[0]);

                        nativeInputs[1].click();
                        tick();
                        fixture.detectChanges();
                        tick();
                        expect(nativeInputs[0].checked).toBe(false);
                        expect(nativeInputs[1].checked).toBe(true);
                        expect(instance.boundObjectProperty).toBe(instance.objectValues[1]);
                    });
            })
        ));

        it('should bind the value with NgControl (inbound)', injectAsync([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                return tcb.overrideTemplate(TestComponent, `
                    <form [ngFormModel]="testForm">
                        <gtx-radio-button ngControl="testControl" value="radioValue">
                        </gtx-radio-button>
                    </form>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        tick();
                        const instance: TestComponent = fixture.componentInstance;
                        const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                        const control: Control = <Control> instance.testForm.find('testControl');

                        expect(nativeInput.checked).toBe(false);

                        control.updateValue('radioValue');
                        fixture.detectChanges();
                        expect(nativeInput.checked).toBe(true);
                    });
            })
        ));

        it('should bind the value with NgControl (outbound)', injectAsync([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                return tcb.overrideTemplate(TestComponent, `
                    <form [ngFormModel]="testForm">
                        <gtx-radio-button
                            [checked]="checkState"
                            ngControl="testControl"
                            value="targetValue">
                        </gtx-radio-button>
                    </form>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        const instance: TestComponent = fixture.componentInstance;
                        const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                        const control: Control = <Control> instance.testForm.find('testControl');

                        instance.checkState = false;
                        fixture.detectChanges();
                        expect(nativeInput.checked).toBe(false);

                        instance.checkState = true;
                        fixture.detectChanges();
                        tick();

                        expect(nativeInput.checked).toBe(true);
                        expect(control.value).toBe('targetValue');
                    });
            })
        ));

    });
});


describe('RadioGroup', () => {

    it('should bind the check state of RadioButton children with NgModel (inbound)',
        injectAsync([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            return tcb.overrideTemplate(TestComponent, `
                <gtx-radio-group [(ngModel)]="boundProperty">
                    <gtx-radio-button value="A"></gtx-radio-button>
                    <gtx-radio-button value="B"></gtx-radio-button>
                </gtx-radio-group>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    fixture.detectChanges();

                    const instance: TestComponent = fixture.componentInstance;
                    const nativeInputs: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');

                    instance.boundProperty = 'A';
                    fixture.detectChanges();
                    tick();
                    expect(nativeInputs[0].checked).toBe(true);
                    expect(nativeInputs[1].checked).toBe(false);

                    instance.boundProperty = 'B';
                    fixture.detectChanges();
                    tick();
                    expect(nativeInputs[0].checked).toBe(false);
                    expect(nativeInputs[1].checked).toBe(true);
                });
        })
    ));

    xit('should uncheck all RadioButton children when none of their values match a property bound with NgModel (inbound)',
        injectAsync([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            return tcb.overrideTemplate(TestComponent, `
                <gtx-radio-group [(ngModel)]="boundProperty">
                    <gtx-radio-button value="A"></gtx-radio-button>
                    <gtx-radio-button value="B"></gtx-radio-button>
                </gtx-radio-group>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    const instance: TestComponent = fixture.componentInstance;
                    const nativeInputs: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');

                    instance.boundProperty = 'A';
                    tick();
                    fixture.detectChanges();
                    expect(nativeInputs[0].checked).toBe(true);
                    expect(nativeInputs[1].checked).toBe(false);

                    instance.boundProperty = 'some other value';
                    fixture.detectChanges();
                    tick();
                    expect(nativeInputs[0].checked).toBe(false);
                    expect(nativeInputs[1].checked).toBe(false);
                });
        })
    ));

    it('should update a NgModel bound property when RadioButton children are checked (outbound)',
        injectAsync([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            return tcb.overrideTemplate(TestComponent, `
                <gtx-radio-group [(ngModel)]="boundProperty">
                    <gtx-radio-button value="A"></gtx-radio-button>
                    <gtx-radio-button value="B"></gtx-radio-button>
                </gtx-radio-group>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    fixture.detectChanges();
                    tick();
                    const instance: TestComponent = fixture.componentInstance;
                    const nativeInputs: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');

                    nativeInputs[0].click();
                    fixture.detectChanges();
                    tick();
                    expect(instance.boundProperty).toBe('A');
                    expect(nativeInputs[0].checked).toBe(true);
                    expect(nativeInputs[1].checked).toBe(false);

                    nativeInputs[1].click();
                    fixture.detectChanges();
                    tick();
                    expect(instance.boundProperty).toBe('B');
                    expect(nativeInputs[0].checked).toBe(false);
                    expect(nativeInputs[1].checked).toBe(true);
                });
        })
    ));

    xit('should set a NgModel bound property to null when no RadioButton children are checked (outbound)',
        injectAsync([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            return tcb.overrideTemplate(TestComponent, `
                <gtx-radio-group [(ngModel)]="boundProperty">
                    <gtx-radio-button value="A" [checked]="checkState"></gtx-radio-button>
                    <gtx-radio-button value="B"></gtx-radio-button>
                </gtx-radio-group>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    fixture.detectChanges();

                    const instance: TestComponent = fixture.componentInstance;
                    const nativeInputs: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');
                    // const debugInputs: DebugElement[] = fixture.debugElement.queryAll(By.css('input'));

                    instance.checkState = true;
                    fixture.detectChanges();
                    tick();
                    expect(instance.boundProperty).toBe('A');
                    expect(nativeInputs[0].checked).toBe(true);
                    expect(nativeInputs[1].checked).toBe(false);

                    instance.checkState = false;
                    fixture.detectChanges();
                    tick();
                    expect(instance.boundProperty).toBe(null);
                    expect(nativeInputs[0].checked).toBe(false);
                    expect(nativeInputs[1].checked).toBe(false);
                });
        })
    ));

    it('should bind the check state of RadioButton children with NgControl (inbound)',
        injectAsync([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            return tcb.overrideTemplate(TestComponent, `
                <form [ngFormModel]="testForm">
                    <gtx-radio-group ngControl="testControl">
                        <gtx-radio-button value="A"></gtx-radio-button>
                        <gtx-radio-button value="B"></gtx-radio-button>
                    </gtx-radio-group>
                </form>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    fixture.detectChanges();

                    const instance: TestComponent = fixture.componentInstance;
                    const nativeInputs: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');
                    const control: Control = <Control> instance.testForm.find('testControl');

                    control.updateValue('A');
                    fixture.detectChanges();
                    tick();
                    expect(nativeInputs[0].checked).toBe(true);
                    expect(nativeInputs[1].checked).toBe(false);

                    control.updateValue('B');
                    fixture.detectChanges();
                    tick();
                    expect(nativeInputs[0].checked).toBe(false);
                    expect(nativeInputs[1].checked).toBe(true);
                });
        })
    ));

    it('should bind the check state of RadioButton children with NgControl (outbound)',
        injectAsync([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            return tcb.overrideTemplate(TestComponent, `
                <form [ngFormModel]="testForm">
                    <gtx-radio-group ngControl="testControl">
                        <gtx-radio-button value="A"></gtx-radio-button>
                        <gtx-radio-button value="B"></gtx-radio-button>
                    </gtx-radio-group>
                </form>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    fixture.detectChanges();

                    const instance: TestComponent = fixture.componentInstance;
                    const nativeInputs: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');
                    const control: Control = <Control> instance.testForm.find('testControl');

                    control.updateValue('A');
                    fixture.detectChanges();
                    tick();
                    expect(nativeInputs[0].checked).toBe(true);
                    expect(nativeInputs[1].checked).toBe(false);

                    control.updateValue('B');
                    fixture.detectChanges();
                    tick();
                    expect(nativeInputs[0].checked).toBe(false);
                    expect(nativeInputs[1].checked).toBe(true);
                });
        })
    ));

});


@Component({
    template: `<gtx-radio-button></gtx-radio-button>`,
    directives: [RadioButton, RadioGroup]
})
class TestComponent {

    boundProperty: string = 'boundValue';
    checkState: boolean = false;
    testForm: ControlGroup;

    boundObjectProperty: any = null;
    objectValues: any[] = [
        { a: 1 },
        { b: 2 }
    ];

    constructor() {
        this.testForm = new ControlGroup({
            testControl: new Control('controlValue')
        });
    }

    onBlur(): void {}
    onFocus(): void {}
    onChange(): void {}
}