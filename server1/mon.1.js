class a {
	constructor() {
		this.a = 'testa';
	}

	log() {
		console.log(this.a);
	}
}

class b {
	constructor() {
		this.a = 'testb';
	}

	log() {
		console.log(this.a);
	}
}

const nav = new a();

nav.log();

module.exports = {
	a,
	b
}


