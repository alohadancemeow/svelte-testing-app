import { describe, it, expect, vi, beforeEach } from 'vitest';
import { load, actions } from './+page.server';
import { Game } from './game';

// Mock the Game class
vi.mock('./game', () => ({
	Game: vi.fn().mockImplementation((serialized?: string) => {
		if (serialized) {
			const parsed = JSON.parse(serialized);
			return {
				index: parsed.index || 0,
				guesses: parsed.guesses || ['', '', '', '', '', ''],
				answers: parsed.answers || [],
				answer: parsed.answer || 'hello',
				won: parsed.won || false,
				toString: () => JSON.stringify(parsed)
			};
		}
		return {
			index: 0,
			guesses: ['', '', '', '', '', ''],
			answers: [],
			answer: 'hello',
			won: false,
			toString: () => JSON.stringify({
				index: 0,
				guesses: ['', '', '', '', '', ''],
				answers: [],
				answer: 'hello',
				won: false
			})
		};
	})
}));

describe('Sverdle Server Functions', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('load function', () => {
		it('should create new game when no cookie exists', async () => {
			const mockEvent = {
				cookies: {
					get: vi.fn().mockReturnValue(undefined)
				}
			};

			const result = await load(mockEvent as any);

			expect(result).toEqual({
				guesses: ['', '', '', '', '', ''],
				answers: [],
				answer: null
			});
			expect(Game).toHaveBeenCalledWith(undefined);
		});

		it('should load existing game from cookie', async () => {
			const existingGameData = JSON.stringify({
				index: 2,
				guesses: ['hello', 'world', '', '', '', ''],
				answers: [
					[{ letter: 'h', correct: true }, { letter: 'e', correct: false }],
					[{ letter: 'w', correct: false }, { letter: 'o', correct: true }]
				],
				answer: 'hello',
				won: false
			});

			const mockEvent = {
				cookies: {
					get: vi.fn().mockReturnValue(existingGameData)
				}
			};

			const result = await load(mockEvent as any);

			expect(result).toEqual({
				guesses: ['hello', 'world', '', '', '', ''],
				answers: [
					[{ letter: 'h', correct: true }, { letter: 'e', correct: false }],
					[{ letter: 'w', correct: false }, { letter: 'o', correct: true }]
				],
				answer: null
			});
			expect(Game).toHaveBeenCalledWith(existingGameData);
		});

		it('should reveal answer when game is won', async () => {
			const wonGameData = JSON.stringify({
				index: 1,
				guesses: ['hello', '', '', '', '', ''],
				answers: ['xxxxx'],
				answer: 'hello',
				won: true
			});

			const mockEvent = {
				cookies: {
					get: vi.fn().mockReturnValue(wonGameData)
				}
			};

			const result = await load(mockEvent as any);

			expect(result.answer).toBe('hello');
		});

		it('should reveal answer when all guesses are used', async () => {
			const lostGameData = JSON.stringify({
				index: 6,
				guesses: ['wrong', 'guess', 'every', 'single', 'time!', 'darn!'],
				answers: [[], [], [], [], [], []],
				answer: 'hello',
				won: false
			});

			const mockEvent = {
				cookies: {
					get: vi.fn().mockReturnValue(lostGameData)
				}
			};

			const result = await load(mockEvent as any);

			expect(result.answer).toBe('hello');
		});
	});

	describe('actions.update', () => {
		it('should update game state with letter input', async () => {
			const mockGame = {
				index: 0,
				guesses: ['', '', '', '', '', ''],
				answers: [],
				answer: 'hello',
				won: false,
				toString: vi.fn().mockReturnValue('{"index":0,"guesses":["a","","","","",""],"answers":[],"answer":"hello","won":false}')
			};

			vi.mocked(Game).mockReturnValue(mockGame as any);

			const mockEvent = {
				cookies: {
					get: vi.fn().mockReturnValue(undefined),
					set: vi.fn()
				},
				request: {
					formData: vi.fn().mockResolvedValue(new Map([['key', 'a']]))
				}
			};

			await actions.update(mockEvent as any);

			expect(mockEvent.cookies.set).toHaveBeenCalledWith(
				'sverdle',
				'{"index":0,"guesses":["a","","","","",""],"answers":[],"answer":"hello","won":false}',
				{ path: '/' }
			);
		});

		it('should handle backspace input', async () => {
			const mockGame = {
				index: 0,
				guesses: ['ab', '', '', '', '', ''],
				answers: [],
				answer: 'hello',
				won: false,
				toString: vi.fn().mockReturnValue('{"index":0,"guesses":["a","","","","",""],"answers":[],"answer":"hello","won":false}')
			};

			vi.mocked(Game).mockReturnValue(mockGame as any);

			const mockEvent = {
				cookies: {
					get: vi.fn().mockReturnValue('{"index":0,"guesses":["ab","","","","",""],"answers":[],"answer":"hello","won":false}'),
					set: vi.fn()
				},
				request: {
					formData: vi.fn().mockResolvedValue(new Map([['key', 'backspace']]))
				}
			};

			await actions.update(mockEvent as any);

			expect(mockEvent.cookies.set).toHaveBeenCalled();
		});
	});

	describe('actions.enter', () => {
		it('should return bad guess error for invalid word', async () => {
			const mockGame = {
				index: 0,
				guesses: ['zzzzz', '', '', '', '', ''],
				answers: [],
				answer: 'hello',
				won: false,
				enter: vi.fn().mockReturnValue(false),
				toString: vi.fn().mockReturnValue('{"index":0,"guesses":["zzzzz","","","","",""],"answers":[],"answer":"hello","won":false}')
			};

			vi.mocked(Game).mockReturnValue(mockGame as any);

			const mockEvent = {
				cookies: {
					get: vi.fn().mockReturnValue('{"index":0,"guesses":["zzzzz","","","","",""],"answers":[],"answer":"hello","won":false}'),
					set: vi.fn()
				},
				request: {
					formData: vi.fn().mockResolvedValue({
						getAll: vi.fn().mockReturnValue(['z', 'z', 'z', 'z', 'z'])
					})
				}
			};

			const result = await actions.enter(mockEvent as any);

			expect(result).toEqual(expect.objectContaining({
				status: 400,
				data: { badGuess: true }
			}));
			expect(mockGame.enter).toHaveBeenCalled();
		});

		it('should process valid guess and update game state', async () => {
			const mockGame = {
				index: 0,
				guesses: ['world', '', '', '', '', ''],
				answers: [[{ letter: 'w', correct: false }]],
				answer: 'hello',
				won: false,
				enter: vi.fn().mockReturnValue(true),
				toString: vi.fn().mockReturnValue('{"index":1,"guesses":["world","","","","",""],"answers":[[{"letter":"w","correct":false}]],"answer":"hello","won":false}')
			};

			vi.mocked(Game).mockReturnValue(mockGame as any);

			const mockEvent = {
				cookies: {
					get: vi.fn().mockReturnValue('{"index":0,"guesses":["world","","","","",""],"answers":[],"answer":"hello","won":false}'),
					set: vi.fn()
				},
				request: {
					formData: vi.fn().mockResolvedValue({
						getAll: vi.fn().mockReturnValue(['w', 'o', 'r', 'l', 'd'])
					})
				}
			};

			const result = await actions.enter(mockEvent as any);

			expect(result).toBeUndefined();
			expect(mockGame.enter).toHaveBeenCalled();
			expect(mockEvent.cookies.set).toHaveBeenCalled();
		});
	});

	describe('actions.restart', () => {
		it('should create new game and clear cookie', async () => {
			const mockEvent = {
				cookies: {
					delete: vi.fn()
				}
			};

			await actions.restart(mockEvent as any);

			expect(mockEvent.cookies.delete).toHaveBeenCalledWith('sverdle', { path: '/' });
		});
	});
});