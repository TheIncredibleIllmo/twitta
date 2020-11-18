//The require('mongoose') call above returns a Singleton object.
// It means that the first time you call require('mongoose'), It
// is creating an instance of the Mongoose class and returning it.
// On subsequent ChannelSplitterNode, it will return the same instance that was
// created and returned to you the first time because of how module
// import/export works in ES6
const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose
      .connect(
        'mongodb+srv://admin:1nCR3d1bl3@twittacluster.w1vhr.mongodb.net/Twitta?retryWrites=true&w=majority'
      )
      .then(() => {
        console.log('Mongo db connection was SUCCESSFULLY done.');
      })
      .catch((err) => {
        console.log('Mongo db connection error: ' + err);
      });
  }
}

module.exports = new Database();
