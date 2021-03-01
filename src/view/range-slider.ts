import {Interval} from 'model/interval';
import {Value} from 'tweakpane/lib/plugin/common/model/value';
import {
	constrainRange,
	mapRange,
} from 'tweakpane/lib/plugin/common/number-util';
import {ClassName} from 'tweakpane/lib/plugin/common/view/class-name';
import {ValueView} from 'tweakpane/lib/plugin/common/view/value';

interface Config {
	maxValue: number;
	minValue: number;
	value: Value<Interval>;
}

const className = ClassName('rsl');

export class RangeSliderView implements ValueView<Interval> {
	public readonly element: HTMLElement;
	public readonly value: Value<Interval>;
	public readonly knobElements: [HTMLElement, HTMLElement];
	public readonly barElement: HTMLElement;
	public readonly trackElement: HTMLElement;
	private readonly maxValue_: number;
	private readonly minValue_: number;

	constructor(doc: Document, config: Config) {
		this.maxValue_ = config.maxValue;
		this.minValue_ = config.minValue;

		this.element = doc.createElement('div');
		this.element.classList.add(className());

		this.value = config.value;
		this.value.emitter.on('change', this.onValueChange_.bind(this));

		const trackElem = doc.createElement('div');
		trackElem.classList.add(className('t'));
		this.element.appendChild(trackElem);
		this.trackElement = trackElem;

		const barElem = doc.createElement('div');
		barElem.classList.add(className('b'));
		trackElem.appendChild(barElem);
		this.barElement = barElem;

		const knobElems = ['min', 'max'].map((modifier) => {
			const elem = doc.createElement('div');
			elem.classList.add(className('k'), className('k', modifier));
			trackElem.appendChild(elem);
			return elem;
		});
		this.knobElements = [knobElems[0], knobElems[1]];

		this.update();
	}

	private valueToX_(value: number): number {
		return (
			constrainRange(
				mapRange(value, this.minValue_, this.maxValue_, 0, 1),
				0,
				1,
			) * 100
		);
	}

	public update(): void {
		const v = this.value.rawValue;

		if (v.length === 0) {
			this.element.classList.add(className(undefined, 'zero'));
		} else {
			this.element.classList.remove(className(undefined, 'zero'));
		}

		const xs = [this.valueToX_(v.min), this.valueToX_(v.max)];
		this.barElement.style.left = `${xs[0]}%`;
		this.barElement.style.right = `${100 - xs[1]}%`;

		this.knobElements.forEach((elem, index) => {
			elem.style.left = `${xs[index]}%`;
		});
	}

	private onValueChange_() {
		this.update();
	}
}
