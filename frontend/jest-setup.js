Object.defineProperty(global, 'performance', {
  value: {
    now: () => Date.now(),
  },
  configurable: true,
});
