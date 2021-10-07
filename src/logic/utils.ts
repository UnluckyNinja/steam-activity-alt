export function today() {
  return daysEarlier(0)
}

export function daysEarlier(num: number) {
  // const now = new Date()
  return new Date().setHours(0, 0, 0, 0) - num * 24 * 3600 * 1000
}
