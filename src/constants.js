export const ACTIVITIES = [
  'work for',
  'take a break for',
  'go eat something for',
]

export const DURATIONS = [1, 2, 3, 5, 10, 15, 20, 30, 45]

export const UNITS = ['minutes', 'hours']

// Valid duration indices when unit === 'hours' (max 3 hours)
// These correspond to indices 0, 1, 2 in DURATIONS (values 1, 2, 3)
export const VALID_HOUR_DURATION_INDICES = [0, 1, 2]

export const ITEM_HEIGHT = 80 // px
