import {ValueController} from 'tweakpane/lib/plugin/common/controller/value';
import {Formatter} from 'tweakpane/lib/plugin/common/converter/formatter';
import {Parser} from 'tweakpane/lib/plugin/common/converter/parser';
import {Value} from 'tweakpane/lib/plugin/common/model/value';

import {Interval, IntervalAssembly} from '../model/interval';
import {RangeSliderTextView} from '../view/range-slider-text';
import {PointNdTextControllerMod} from './point-nd-mod';
import {RangeSliderController} from './range-slider';

interface Config {
	baseStep: number;
	draggingScale: number;
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
	private readonly tc_: PointNdTextControllerMod<Interval>;

	constructor(doc: Document, config: Config) {
		this.value = config.value;

		this.sc_ = new RangeSliderController(doc, config);

		const axis = {
			baseStep: config.baseStep,
			draggingScale: config.draggingScale,
			formatter: config.formatter,
		};
		this.tc_ = new PointNdTextControllerMod(doc, {
			assembly: IntervalAssembly,
			axes: [axis, axis],
			parser: config.parser,
			value: this.value,
		});

		this.view = new RangeSliderTextView(doc, {
			sliderView: this.sc_.view,
			textView: this.tc_.view,
		});
	}

	public get textController(): PointNdTextControllerMod<Interval> {
		return this.tc_;
	}
}
