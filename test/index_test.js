const assert = require('assert');
const store = require('../src/constants');

describe('User', () => {
    describe('new User()', () => {
        it('should accept correct parameters', () => {
            assert.doesNotThrow(() => {
                new store.User(
                    'Guus Lieben',
                    'Arjan-straat 420',
                    '1234 AB',
                    '23/07/2000',
                    '+316 204 738 02',
                    'guus@xendox.com',
                    'hahahaNee123');
            });
        });
    });

    describe('new User()', () => {
        it('should throw error with incorrect parameters', () => {
            assert.throws(() => {
                // Incomplete constructor and wrong name format
                new store.User('Bob 123')
            });
        });
    });
});

describe('Movie', () => {
    describe('new Movie()', () => {
        it('should accept correct parameters', () => {
            assert.doesNotThrow(() => {
                new store.Movie('Batman', 'You know what this is', 2015, 'Bob Bobberson');
            });
        });
    });

    describe('new Movie()', () => {
        it('should throw error with incorrect parameters', () => {
            assert.throws(() => {
                // Invalid year
                new store.Movie('Batman', 'You know what this is', 2015213, 'Bob Bobberson');
            });
        });
    });
});