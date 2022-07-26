const AREAS = [
	[ // zone 0
		{
			area: [0, 0], // this means the map is 0-0 aka zone 0 and area 0
			name: 'Enemy Plains',
			desc: 'Progressing through areas requires beating multiple enemies',
			dp: 10,
			rewards: {
				currency: new Decimal(15),
				xp: new Decimal(15),
			},
			startDir: DIR.right,
			data: [ // the map itself
				's   r w   e',
			],
			key: {
				' ': 'c-path',
				's': 'c-start',
				'e': 'c-end',
				'r': 'e-redsquare',
				'w': 'e-whitesquare',
			},
			boss: false,
			enemies: {
				total: 2,
				kinds: 2,
				groups: {
					'weak': 2,
				}
			}
		},
		{
			area: [0, 1],
			name: 'White Chain',
			desc: 'Four white squares, should be able to survive',
			dp: 15,
			rewards: {
				currency: new Decimal(15),
				xp: new Decimal(15),
			},
			startDir: DIR.right,
			data: [ // the map itself
				's  w vXXXXX',
				'XXXXXwXXXXX',
				'XXXXX XXXXX',
				'XXXXX XXXXX',
				'XXXXXwXXXXX',
				'XXXXX> w  e',
			],
			key: {
				' ': 'c-path',
				's': 'c-start',
				'e': 'c-end',
				'X': 'c-none',
				'v': 'c-down',
				'>': 'c-right',
				'w': 'e-whitesquare',
			},
			boss: false,
			enemies: {
				total: 4,
				kinds: 1,
				groups: {
					'weak': 4,
				}
			}
		},
		{
			area: [0, 2],
			name: 'Multitasking',
			desc: 'Fighting multiple enemies at once is tiring, but the rewards are worth it. Click an enemy to switch target',
			dp: 25,
			rewards: {
				currency: new Decimal(15),
				xp: new Decimal(15),
			},
			data: [ // the map itself
				's  :  e',
			],
			startDir: DIR.right,
			key: {
				' ': 'c-path',
				's': 'c-start',
				'e': 'c-end',
				':': 'e-multi-greensquare-whitesquare',
			},
			boss: false,
			enemies: {
				total: 2,
				kinds: 2,
				groups: {
					'weak': 1,
					'medium': 1,
				}
			}
		},
	],
]

const ZONES = [
	{
		zone: 0,
		name: 'Hill Hills',
		desc: 'Specially designed to be welcoming for newcomers',
		dp: 40,
	},
]