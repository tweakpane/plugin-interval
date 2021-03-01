import {Interval} from 'model/interval';
import {forceCast, isEmpty} from 'tweakpane/lib/misc/type-util';
import {ValueController} from 'tweakpane/lib/plugin/common/controller/value';
import {Formatter} from 'tweakpane/lib/plugin/common/converter/formatter';
import {Parser} from 'tweakpane/lib/plugin/common/converter/parser';
import {Value} from 'tweakpane/lib/plugin/common/model/value';
import {
	getStepForKey,
	getVerticalStepKeys,
} from 'tweakpane/lib/plugin/common/ui';
import {IntervalTextView} from 'view/interval-text';

interface Config {
	baseStep: number;
	formatter: Formatter<number>;
	parser: Parser<number>;
	value: Value<Interval>;
}

/**
 * @hidden
 */
export class IntervalTextController implements ValueController<Interval> {
	public readonly value: Value<Interval>;
	public readonly view: IntervalTextView;
	private readonly parser_: Parser<number>;
	private readonly baseStep_: number;

	constructor(doc: Document, config: Config) {
		this.onInputChange_ = this.onInputChange_.bind(this);
		this.onInputKeyDown_ = this.onInputKeyDown_.bind(this);

		this.parser_ = config.parser;
		this.value = config.value;

		this.baseStep_ = config.baseStep;

		this.view = new IntervalTextView(doc, {
			formatter: config.formatter,
			value: this.value,
		});
		this.view.inputElements.forEach((inputElem) => {
			inputElem.addEventListener('change', this.onInputChange_);
			inputElem.addEventListener('keydown', this.onInputKeyDown_);
		});
	}

	private findIndexOfInputElem_(inputElem: HTMLInputElement): number | null {
		const inputElems = this.view.inputElements;
		for (let i = 0; i < inputElems.length; i++) {
			if (inputElems[i] === inputElem) {
				return i;
			}
		}
		return null;
	}

	private updateComponent_(index: number, newValue: number): void {
		const comps = [this.value.rawValue.min, this.value.rawValue.max];
		const newComps = comps.map((comp, i) => {
			return i === index ? newValue : comp;
		});
		this.value.rawValue = new Interval(newComps[0], newComps[1]);

		this.view.update();
	}

	private onInputChange_(e: Event): void {
		const inputElem: HTMLInputElement = forceCast(e.currentTarget);

		const parsedValue = this.parser_(inputElem.value);
		if (isEmpty(parsedValue)) {
			return;
		}
		const compIndex = this.findIndexOfInputElem_(inputElem);
		if (isEmpty(compIndex)) {
			return;
		}
		this.updateComponent_(compIndex, parsedValue);
	}

	private onInputKeyDown_(e: KeyboardEvent): void {
		const inputElem: HTMLInputElement = forceCast(e.currentTarget);

		const parsedValue = this.parser_(inputElem.value);
		if (isEmpty(parsedValue)) {
			return;
		}
		const compIndex = this.findIndexOfInputElem_(inputElem);
		if (isEmpty(compIndex)) {
			return;
		}

		const step = getStepForKey(this.baseStep_, getVerticalStepKeys(e));
		if (step === 0) {
			return;
		}

		this.updateComponent_(compIndex, parsedValue + step);
	}
}
