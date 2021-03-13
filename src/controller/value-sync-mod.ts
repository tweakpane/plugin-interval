import {Value} from 'tweakpane/lib/plugin/common/model/value';

// TODO: Apply changes to core

/**
 * Synchronizes two values.
 */
export function connectValuesMod<T1, T2>({
	primary,
	secondary,
	forward,
	backward,
	preventsFeedback,
}: {
	primary: Value<T1>;
	secondary: Value<T2>;
	forward: (primary: Value<T1>, secondary: Value<T2>) => T2;
	backward: (primary: Value<T1>, secondary: Value<T2>) => T1;

	preventsFeedback?: boolean;
}): void {
	// Prevents an event firing loop
	// e.g.
	// primary changed
	// -> applies changes to secondary
	// -> secondary changed
	// -> applies changes to primary
	// -> ...
	let changing = false;
	const preventFeedback = preventsFeedback
		? function (callback: () => void) {
				if (changing) {
					return;
				}
				changing = true;
				callback();
				changing = false;
		  }
		: function (callback: () => void) {
				callback();
		  };

	primary.emitter.on('change', () => {
		preventFeedback(() => {
			secondary.rawValue = forward(primary, secondary);
		});
	});
	secondary.emitter.on('change', () => {
		preventFeedback(() => {
			primary.rawValue = backward(primary, secondary);
		});
	});

	preventFeedback(() => {
		secondary.rawValue = forward(primary, secondary);
	});
}
