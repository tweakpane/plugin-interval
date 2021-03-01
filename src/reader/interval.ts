import {Interval} from 'model/interval';

export function intervalFromUnknown(value: unknown): Interval {
	return Interval.isObject(value)
		? new Interval(value.min, value.max)
		: new Interval(0, 0);
}
