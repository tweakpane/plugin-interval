import {ClassName} from 'tweakpane/lib/common/view/class-name';
import {View} from 'tweakpane/lib/common/view/view';
import {PointNdTextView} from 'tweakpane/lib/input-binding/common/view/point-nd-text';

import {RangeSliderView} from './range-slider';

interface Config {
	sliderView: RangeSliderView;
	textView: PointNdTextView;
}

const className = ClassName('rsltxt');

export class RangeSliderTextView implements View {
	public readonly element: HTMLElement;
	private sliderView_: RangeSliderView;
	private textView_: PointNdTextView;

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
}
