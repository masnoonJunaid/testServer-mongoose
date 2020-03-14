const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const favoriteSchema = new Schema ({
	author : {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	comments: [
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Dish'
	]

},{
	timestamps: true
});



favoriteSchema.plugin(passportLocalMongoose);

var Favorites = mongoose.model('Favorites', favoriteSchema);
module.exports = Favorites;
