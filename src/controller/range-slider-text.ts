import {Constraint} from 'tweakpane/lib/common/constraint/constraint';
import {ValueController} from 'tweakpane/lib/common/controller/value';
import {Formatter} from 'tweakpane/lib/common/converter/formatter';
import {Parser} from 'tweakpane/lib/common/converter/parser';
import {Value} from 'tweakpane/lib/common/model/value';
import {ValueMap} from 'tweakpane/lib/common/model/value-map';
import {ViewProps} from 'tweakpane/lib/common/model/view-props';
import {PointNdTextController} from 'tweakpane/lib/input-binding/common/controller/point-nd-text';

import {Interval, IntervalAssembly} from '../model/interval';
import {RangeSliderTextView} from '../view/range-slider-text';
import {RangeSliderController} from './range-slider';

interface Config {
	baseStep: number;
	constraint: Constraint<number> | undefined;
	draggingScale: number;
	formatter: Formatter<number>;
	maxValue: number;
	minValue: number;
	parser: Parser<number>;
	value: Value<Interval>;
	viewProps: ViewProps;
}

export class RangeSliderTextController implements ValueController<Interval> {
	public readonly value: Value<Interval>;
	public readonly view: RangeSliderTextView;
	public readonly viewProps: ViewProps;
	private readonly sc_: RangeSliderController;
	private readonly tc_: PointNdTextController<Interval>;

	constructor(doc: Document, config: Config) {
		this.value = config.value;
		this.viewProps = config.viewProps;

		this.sc_ = new RangeSliderController(doc, config);

		const axis = {
			baseStep: config.baseStep,
			constraint: config.constraint,
			textProps: new ValueMap({
				draggingScale: config.draggingScale,
				formatter: config.formatter,
			}),
		};
		this.tc_ = new PointNdTextController(doc, {
			assembly: IntervalAssembly,
			axes: [axis, axis],
			parser: config.parser,
			value: this.value,
			viewProps: config.viewProps,
		});

		this.view = new RangeSliderTextView(doc, {
			sliderView: this.sc_.view,
			textView: this.tc_.view,
		});
	}

	public get textController(): PointNdTextController<Interval> {
		return this.tc_;
	}
}
