import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {Component} from '@angular/core';
import {async, inject} from '@angular/core/testing';

import {Button} from './button.component';

describe('Button:', () => {

    it('should be enabled by default',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.createAsync(TestComponent)
            .then(fixture => {
                let button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
                fixture.detectChanges();

                expect(button.disabled).toBe(false);
            })
        ))
    );

    it('should bind the "disabled" property',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-button [disabled]='true'></gtx-button>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
                let button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
                fixture.detectChanges();

                expect(button.disabled).toBe(true);
            })
        ))
    );

    it('should accept literal "disabled" property',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-button disabled='true'></gtx-button>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
                let button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
                fixture.detectChanges();

                expect(button.disabled).toBe(true);
            })
        ))
    );

});

@Component({
    template: `<gtx-button></gtx-button>`,
    directives: [Button]
})
class TestComponent {
}
