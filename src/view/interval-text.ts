import {Formatter} from 'tweakpane/lib/plugin/common/converter/formatter';
import {Value} from 'tweakpane/lib/plugin/common/model/value';
import {ClassName} from 'tweakpane/lib/plugin/common/view/class-name';
import {ValueView} from 'tweakpane/lib/plugin/common/view/value';

import {Interval} from '../model/interval';

interface Config {
	formatter: Formatter<number>;
	value: Value<Interval>;
}

const className = ClassName('itvtxt');

/**
 * @hidden
 */
export class IntervalTextView implements ValueView<Interval> {
	public readonly element: HTMLElement;
	public readonly value: Value<Interval>;
	private formatter_: Formatter<number>;
	private inputElems_: [HTMLInputElement, HTMLInputElement];

	constructor(doc: Document, config: Config) {
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.formatter_ = config.formatter;

		this.element = doc.createElement('div');
		this.element.classList.add(className());

		const inputElems = [0, 1].map(() => {
			const inputElem = doc.createElement('input');
			inputElem.classList.add(className('i'));
			inputElem.type = 'text';
			return inputElem;
		});
		[0, 1].forEach((_, index) => {
			const elem = doc.createElement('div');
			elem.classList.add(className('w'));
			elem.appendChild(inputElems[index]);
			this.element.appendChild(elem);
		});

		this.inputElems_ = [inputElems[0], inputElems[1]];

		config.value.emitter.on('change', this.onValueChange_);
		this.value = config.value;

		this.update();
	}

	get inputElements(): [HTMLInputElement, HTMLInputElement] {
		return this.inputElems_;
	}

	public update(): void {
		const comps = [this.value.rawValue.min, this.value.rawValue.max];
		comps.forEach((comp, index) => {
			const inputElem = this.inputElems_[index];
			inputElem.value = this.formatter_(comp);
		});
	}

	private onValueChange_(): void {
		this.update();
	}
}
