import {Interval} from 'model/interval';
import {ValueController} from 'tweakpane/lib/plugin/common/controller/value';
import {Formatter} from 'tweakpane/lib/plugin/common/converter/formatter';
import {Parser} from 'tweakpane/lib/plugin/common/converter/parser';
import {Value} from 'tweakpane/lib/plugin/common/model/value';
import {RangeSliderTextView} from 'view/range-slider-text';

import {IntervalTextController} from './interval-text';
import {RangeSliderController} from './range-slider';

interface Config {
	baseStep: number;
	formatter: Formatter<number>;
	maxValue: number;
	minValue: number;
	parser: Parser<number>;
	value: Value<Interval>;
}

export class RangeSliderTextController implements ValueController<Interval> {
	public readonly value: Value<Interval>;
	public readonly view: RangeSliderTextView;
	private readonly sc_: RangeSliderController;
	private readonly tc_: IntervalTextController;

	constructor(doc: Document, config: Config) {
		this.value = config.value;

		this.sc_ = new RangeSliderController(doc, config);
		this.tc_ = new IntervalTextController(doc, config);

		this.view = new RangeSliderTextView(doc, {
			sliderView: this.sc_.view,
			textView: this.tc_.view,
		});
	}
}
