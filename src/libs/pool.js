import Card from "../game/cards/card";

const Pool = {

	CACHE: {},

	getCard: function(type) {
		return this.getFromCache(type, () => new Card(type));
	},

	getFromCache: function (key, createCallback) {

		if (!this.CACHE[key]) this.CACHE[key] = [];

		let stream = this.CACHE[key];

		let i = 0;
		let len = stream.length;
		let item;

		if (len === 0) {
			stream[0] = createCallback(key);
			item = stream[0];
			item.enable();

			return item;
		}

		while (i <= len) {
			if (!stream[i]) {
				stream[i] = createCallback(key);
				item = stream[i];
				item.enable();
				break;
			} else if (!stream[i].active) {
				item = stream[i];
				item.enable();
				break;
			} else {
				i++;
			}
		}

		return item;
	}

};

export default Pool;
