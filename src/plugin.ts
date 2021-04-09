import {IntervalConstraint} from 'constraint/interval';
import {RangeSliderTextController} from 'controller/range-slider-text';
import {intervalFromUnknown, writeInterval} from 'converter/interval';
import {Interval, IntervalAssembly, IntervalObject} from 'model/interval';
import {
	CompositeConstraint,
	findConstraint,
} from 'tweakpane/lib/common/constraint/composite';
import {Constraint} from 'tweakpane/lib/common/constraint/constraint';
import {RangeConstraint} from 'tweakpane/lib/common/constraint/range';
import {
	createNumberFormatter,
	parseNumber,
} from 'tweakpane/lib/common/converter/number';
import {ValueMap} from 'tweakpane/lib/common/model/value-map';
import {TpError} from 'tweakpane/lib/common/tp-error';
import {
	getBaseStep,
	getSuitableDecimalDigits,
	getSuitableDraggingScale,
} from 'tweakpane/lib/common/util';
import {PointNdTextController} from 'tweakpane/lib/input-binding/common/controller/point-nd-text';
import {
	createRangeConstraint,
	createStepConstraint,
} from 'tweakpane/lib/input-binding/number/plugin';
import {InputBindingPlugin} from 'tweakpane/lib/input-binding/plugin';

interface IntervalInputParams {
	max?: number;
	min?: number;
	step?: number;
}

function fetchNumberParam(
	params: Record<string, unknown>,
	key: string,
): number | undefined {
	if (!(key in params)) {
		return undefined;
	}
	const v = params[key];
	return typeof v === 'number' ? v : undefined;
}

// Uses `Record<string, any>` instead of `Record<string, unknown>` to avoid unexpected error:
// https://github.com/microsoft/TypeScript/issues/15300
function typeParams(params: Record<string, any>): IntervalInputParams {
	return {
		max: fetchNumberParam(params, 'max'),
		min: fetchNumberParam(params, 'min'),
		step: fetchNumberParam(params, 'step'),
	};
}

function createConstraint(params: IntervalInputParams): Constraint<Interval> {
	const constraints = [];
	const rc = createRangeConstraint(params);
	if (rc) {
		constraints.push(rc);
	}
	const sc = createStepConstraint(params);
	if (sc) {
		constraints.push(sc);
	}

	return new IntervalConstraint(new CompositeConstraint(constraints));
}

export const intervalInputPlugin: InputBindingPlugin<
	Interval,
	IntervalObject
> = {
	id: 'input-interval',
	css: '__css__',

	accept: (exValue, _params) => {
		return Interval.isObject(exValue)
			? new Interval(exValue.min, exValue.max)
			: null;
	},
	binding: {
		reader: (_args) => intervalFromUnknown,
		constraint: (args) => createConstraint(typeParams(args.params)),
		equals: Interval.equals,
		writer: (_args) => writeInterval,
	},
	controller(args) {
		const v = args.value;
		const c = args.constraint;
		if (!(c instanceof IntervalConstraint)) {
			throw TpError.shouldNeverHappen();
		}

		const midValue = (v.rawValue.min + v.rawValue.max) / 2;
		const rc = c.edge && findConstraint(c.edge, RangeConstraint);
		if (rc?.minValue !== undefined && rc?.maxValue !== undefined) {
			return new RangeSliderTextController(args.document, {
				baseStep: getBaseStep(c.edge),
				constraint: c.edge,
				draggingScale: getSuitableDraggingScale(rc, midValue),
				formatter: createNumberFormatter(
					getSuitableDecimalDigits(c.edge, midValue),
				),
				maxValue: rc.maxValue,
				minValue: rc.minValue,
				parser: parseNumber,
				value: v,
				viewProps: args.viewProps,
			});
		}

		const axis = {
			baseStep: getBaseStep(c.edge),
			constraint: c.edge,
			textProps: new ValueMap({
				draggingScale: midValue,
				formatter: createNumberFormatter(
					getSuitableDecimalDigits(c.edge, midValue),
				),
			}),
		};
		return new PointNdTextController(args.document, {
			assembly: IntervalAssembly,
			axes: [axis, axis],
			parser: parseNumber,
			value: v,
			viewProps: args.viewProps,
		});
	},
};
