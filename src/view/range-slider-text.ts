import {Value} from 'tweakpane/lib/plugin/common/model/value';
import {ClassName} from 'tweakpane/lib/plugin/common/view/class-name';
import {ValueView} from 'tweakpane/lib/plugin/common/view/value';
import {PointNdTextView} from 'tweakpane/lib/plugin/input-bindings/common/view/point-nd-text';

import {Interval} from '../model/interval';
import {RangeSliderView} from './range-slider';

interface Config {
	sliderView: RangeSliderView;
	textView: PointNdTextView<Interval>;
}

const className = ClassName('rsltxt');

export class RangeSliderTextView implements ValueView<Interval> {
	public readonly element: HTMLElement;
	private sliderView_: RangeSliderView;
	private textView_: PointNdTextView<Interval>;

	constructor(doc: Document, config: Config) {
		this.sliderView_ = config.sliderView;
		this.textView_ = config.textView;

		this.element = doc.createElement('div');
		this.element.classList.add(className());

		const sliderElem = doc.createElement('div');
		sliderElem.classList.add(className('s'));
		sliderElem.appendChild(this.sliderView_.element);
		this.element.appendChild(sliderElem);

		const textElem = doc.createElement('div');
		textElem.classList.add(className('t'));
		textElem.appendChild(this.textView_.element);
		this.element.appendChild(textElem);
	}

	get value(): Value<Interval> {
		return this.sliderView_.value;
	}

	public update(): void {
		this.sliderView_.update();
		this.textView_.update();
	}
}
