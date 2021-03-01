import {IntervalConstraint} from 'constraint/interval';
import {IntervalTextController} from 'controller/interval-text';
import {RangeSliderTextController} from 'controller/range-slider-text';
import {Interval, IntervalObject} from 'model/interval';
import {intervalFromUnknown} from 'reader/interval';
import {
	CompositeConstraint,
	findConstraint,
} from 'tweakpane/lib/plugin/common/constraint/composite';
import {Constraint} from 'tweakpane/lib/plugin/common/constraint/constraint';
import {RangeConstraint} from 'tweakpane/lib/plugin/common/constraint/range';
import {
	createNumberFormatter,
	parseNumber,
} from 'tweakpane/lib/plugin/common/converter/number';
import {Value} from 'tweakpane/lib/plugin/common/model/value';
import {TpError} from 'tweakpane/lib/plugin/common/tp-error';
import {InputBindingPlugin} from 'tweakpane/lib/plugin/input-binding';
import {
	createRangeConstraint,
	createStepConstraint,
} from 'tweakpane/lib/plugin/input-bindings/number/plugin';
import {getBaseStep, getSuitableDecimalDigits} from 'tweakpane/lib/plugin/util';
import {writeInterval} from 'writer/writer';

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

function createController(args: {document: Document; value: Value<Interval>}) {
	const v = args.value;
	const c = v.constraint;
	if (!(c instanceof IntervalConstraint)) {
		throw TpError.shouldNeverHappen();
	}

	const rc = c.edge && findConstraint(c.edge, RangeConstraint);
	if (rc?.minValue !== undefined && rc?.maxValue !== undefined) {
		return new RangeSliderTextController(args.document, {
			baseStep: getBaseStep(c.edge),
			formatter: createNumberFormatter(
				getSuitableDecimalDigits(c.edge, (v.rawValue.min + v.rawValue.max) / 2),
			),
			maxValue: rc.maxValue,
			minValue: rc.minValue,
			parser: parseNumber,
			value: v,
		});
	}

	return new IntervalTextController(args.document, {
		baseStep: getBaseStep(c.edge),
		formatter: createNumberFormatter(
			getSuitableDecimalDigits(c.edge, (v.rawValue.min + v.rawValue.max) / 2),
		),
		parser: parseNumber,
		value: v,
	});
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
	controller: (args) => createController(args),
};
