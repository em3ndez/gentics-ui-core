import {
    Component,
    Input,
    Output,
    Provider,
    EventEmitter,
    ElementRef,
    ViewChild,
    forwardRef
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

const GTX_INPUT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputField),
    multi: true
};

/**
 * The InputField wraps the native `<input>` form element but should only be used for
 * text, number or password types. Other types (date, range, file) should have dedicated components.
 *
 *
 * Note that the class is named `InputField` since `Input` is used by the Angular framework to denote
 * component inputs.
 *
 * ```html
 * <gtx-input label="Text Input Label"></gtx-input>
 * <gtx-input placeholder="Number Input Placeholder"
 *            type="number" min="0" max="100" step="5"></gtx-input>
 * ```
 */
@Component({
    selector: 'gtx-input',
    template: require('./input.tpl.html'),
    providers: [GTX_INPUT_VALUE_ACCESSOR]
})
export class InputField implements ControlValueAccessor {

    /**
     * Sets the disabled state
     */
    @Input() disabled: boolean = false;

    /**
     * Input field id
     */
    @Input() id: string;

    /**
     * A label for the input
     */
    @Input() label: string = '';

    /**
     * Max allowed value (applies when type = "number")
     */
    @Input() max: number;

    /**
     * Min allowed value (applies when type = "number")
     */
    @Input() min: number;

    /**
     * Max allowed length in characters
     */
    @Input() maxlength: number;

    /**
     * Input field name
     */
    @Input() name: string;

    /**
     * Regex pattern for complex validation
     */
    @Input() pattern: string;

    /**
     * Placeholder text to display when the field is empty
     */
    @Input() placeholder: string;

    /**
     * Sets the readonly state of the input
     */
    @Input() readonly: boolean = false;

    /**
     * Sets the required state of the input
     */
    @Input() required: boolean = false;

    /**
     * Increment step (applies when type = "number")
     */
    @Input() step: number;

    /**
     * Can be "text", "number" or "password".
     */
    @Input() type: 'text'|'number'|'password' = 'text';

    /**
     * Sets the value of the input.
     */
    @Input() value: string|number = '';

    /**
     * Fires when the input loses focus.
     */
    @Output() blur = new EventEmitter<string|number>();

    /**
     * Fires when the input gains focus.
     */
    @Output() focus = new EventEmitter<string|number>();

    /**
     * Fires whenever a char is entered into the field.
     */
    @Output() change = new EventEmitter<string|number>();

    @ViewChild('inputElement') private inputElement: ElementRef;
    @ViewChild('labelElement') private labelElement: ElementRef;

    // ValueAccessor members
    onChange: any = (_: any) => {};
    onTouched: any = () => {};

    /**
     * The Materialize input includes a dynamic label that changes position depending on the state of the input.
     * When the label has the "active" class, it moves above the input, otherwise it resides inside the input
     * itself.
     *
     * The Materialize "forms.js" script normally takes care of adding/removing the active class on page load,
     * but this does not work in a SPA setting where new views with inputs can be created without a page load
     * event to trigger the `Materialize.updateTextFields()` method. Therefore we need to handle it ourselves
     * when the input component is created.
     */
    ngAfterViewInit(): void {
        let input: HTMLInputElement = this.inputElement.nativeElement;
        let label: HTMLLabelElement = this.labelElement.nativeElement;

        if (input && label) {
            if (String(this.value).length > 0 || this.placeholder) {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        }
    }

    onBlur(e: Event): void {
        e.stopPropagation();
        const target: HTMLInputElement = <HTMLInputElement> e.target;
        this.blur.emit(this.normalizeValue(target.value));
        this.onTouched();
    }

    onFocus(): void {
        this.focus.emit(this.normalizeValue(this.value));
    }

    onInput(e: Event): void {
        const target: HTMLInputElement = <HTMLInputElement> e.target;
        let value = this.normalizeValue(target.value);
        this.change.emit(value);
        this.onChange(value);
    }

    writeValue(value: any): void {
        this.value = value;
    }

    registerOnChange(fn: Function): void { this.onChange = fn; }
    registerOnTouched(fn: Function): void { this.onTouched = fn; }

    private normalizeValue(val: any): string|number {
        if (this.type === 'number') {
            return Number(val);
        } else {
            return val;
        }
    }
}
