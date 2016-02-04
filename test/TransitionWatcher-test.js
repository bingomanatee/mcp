import TransitionEvent from './../src/utils/TransitionEvent';
import TransitionWatcher from './../src/utils/TransitionWatcher';

export default t => {

	t.test('TransitionWatcher', twTest => {
		const rideIntoTheDangerZone = new TransitionEvent({toState: 'danger'}, 'topgun', {mcpState: 'safety'});
		const rideOutOfTheDangerZone = new TransitionEvent({toState: 'safety'}, 'iceman', {mcpState: 'danger'});
		const stayInsideTheDangerZone = new TransitionEvent({toState: 'danger'}, 'topgun', {mcpState: 'danger'});
		const mockMVC = {};

		twTest.test('unfiltered response', twuTest => {
			let foundDanger = 0;
			const watcher = new TransitionWatcher(mockMVC, () => ++foundDanger, false);
			watcher.reactTo(rideIntoTheDangerZone);
			twuTest.equal(foundDanger, 1, 'we are riding into the danger zone!');

			twuTest.end();
		});

		twTest.test('filtering for state', twfTest => {
			twfTest.test('string filter', twsTest => {
				let foundDanger = 0;
				const watcher = new TransitionWatcher(mockMVC,() => ++foundDanger, 'danger');
				watcher.reactTo(rideIntoTheDangerZone);
				watcher.reactTo(stayInsideTheDangerZone);
				watcher.reactTo(rideOutOfTheDangerZone);

				twsTest.equal(foundDanger, 1, 'we are riding into the danger zone ONCE!');
				twsTest.end();
			});

			twfTest.test('state filter', twsTest => {
				let foundDanger = 0;
				const watcher = new TransitionWatcher(mockMVC,() => ++foundDanger, {toState: 'danger'});
				watcher.reactTo(rideIntoTheDangerZone);
				watcher.reactTo(stayInsideTheDangerZone);
				watcher.reactTo(rideOutOfTheDangerZone);

				twsTest.equal(foundDanger, 1, 'we are riding into the danger zone ONCE!');
				twsTest.end();
			});

			twfTest.end();
		});

		twTest.test('filtering for action', twaTest => {
			let foundTopgun = 0;
			const watcher = new TransitionWatcher(mockMVC,() => ++foundTopgun, {action: 'topgun'});
			watcher.reactTo(rideIntoTheDangerZone);
			watcher.reactTo(stayInsideTheDangerZone);
			watcher.reactTo(rideOutOfTheDangerZone);

			twaTest.equal(foundTopgun, 2, 'found top gun TWICE!');
			twaTest.end();
		});

		twTest.end();
	});

}