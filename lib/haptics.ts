export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'double') {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return

  try {
    switch (type) {
      case 'light':
        navigator.vibrate(15)
        break
      case 'medium':
        navigator.vibrate(40)
        break
      case 'heavy':
        navigator.vibrate([60, 30, 80])
        break
      case 'double':
        navigator.vibrate([20, 40, 30])
        break
    }
  } catch {}
}
