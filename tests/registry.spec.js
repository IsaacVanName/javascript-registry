var lib      = require('../registry'),
    registry = lib.Registry;

describe('Public method test', function () {
	registry.set('name', 'Isaac Van Name');

	it('Property access should return the correct value.', function () {
		expect(registry.get('name')).toEqual('Isaac Van Name');
	});
});
