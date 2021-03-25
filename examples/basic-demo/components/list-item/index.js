Component({
  properties: {
    item:{
      type: Object,
      value: {
        content: '',
        finished: false,
        index: 0
      }
    },
  },
  methods: {
    toggleFinished(event) {
      const key = event.target.dataset.key;
      this.triggerEvent('toggleFinished', {key})
    },

    removeItem(event) {
      const key = event.target.dataset.key;

      this.triggerEvent('removeItem', {key})
      // this.properties.onRemoveItem(key);
    }

  },
});