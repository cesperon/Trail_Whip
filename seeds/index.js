const mongoose = require('mongoose');
const Trail = require('../models/trail');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');

//connect to database
mongoose.connect('mongodb://localhost:27017/trail-find', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

//function takes in an array and returns random element from array
const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDb = async () => {

	//delete all trails that exist in database
	await Trail.deleteMany({});
	//seed database with random titles and locations
	for(let i = 0; i < 50; i++){
		//random number between 1 - 1000
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20)+10;
		const t1 = new Trail({

			title: `${sample(descriptors)} ${sample(places)}`,
			location:`${cities[random1000].city}, ${cities[random1000].state}`,
			image: 'https://source.unsplash.com/collection/9284785/1600x900',
			description: 'Lorem, ipsum, dolor sit amet consectetur adipisicing elit. Ea possimus et, earum optio harum repellat nisi porro nam doloribus nesciunt eligendi, distinctio commodi quisquam eius similique quos, deserunt suscipit facere?',
			price

		});

		await t1.save();


	}
}

//after seed db since seedDb is an async function we can close afterwards
seedDb().then(()=>{
	mongoose.connection.close();
});