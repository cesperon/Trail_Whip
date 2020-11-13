const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
// allows for boilerplate injection
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Trail = require('./models/trail');
// error handling class
const AppError = require('./AppError');

//connect to database
mongoose.connect('mongodb://localhost:27017/trail-find', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});

//database setup
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
//set up render to not use .ejs and path to find views in views folder
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

//allows us to parse req.body for the information we need
app.use(express.urlencoded({ extended: true}));
//allows us to do put request with _method
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
	res.render('home');
});

app.get('/trails', async (req, res) => {
	//assign trails array(all trails in database) to trails constant
	const trails = await Trail.find({});
	res.render('trails/index', {trails});
});

//must come before id otherwise new will search as id
app.get('/trails/new', (req, res) => {
	res.render('trails/new');

});

app.post('/trails', async (req, res, next) => {
	try{
		// res.send(req.body.trail.title);
		const t = new Trail(req.body.trail);
		await t.save();
		//redirect to trails specific show page
		res.redirect(`/trails/${t._id}`);

	}catch(e){
		next(e);

	}
	
});
	
app.get('/trails/:id', async (req, res) => {
	//find trail by id and pass to show page
	const trail = await Trail.findById(req.params.id);
	res.render('trails/show', {trail});

});

app.get('/trails/:id/edit' , async (req, res) => {
	const trail = await Trail.findById(req.params.id);
	res.render('trails/edit', {trail});

});

app.put('/trails/:id' , async (req, res) => {
	const {id} = req.params;
	const trail = await Trail.findByIdAndUpdate(id, {...req.body.trail});
	res.redirect(`/trails/${trail._id}`);
	// res.send("it worked");

});

app.delete('/trails/:id' , async(req, res) => {
	const {id} = req.params;
	await Trail.findByIdAndDelete(id);
	res.redirect('/trails');
});

app.use((err, req, res, next) => {
	res.send("error");
})



app.listen(8000, (req, res) => {

	console.log('listening on port 2088');
});