import {Interval} from 'model/interval';
import {BindingTarget} from 'tweakpane/lib/plugin/common/binding/target';

export function writeInterval(target: BindingTarget, value: Interval): void {
	target.writeProperty('max', value.max);
	target.writeProperty('min', value.min);
}
