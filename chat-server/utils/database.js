const MongoClient = require("mongodb").MongoClient;

var dotenv =require('dotenv');
dotenv.config();
const mongo_url = process.env.MONGO_URI;


// module.exports = {
//   connect: async function(callback) {
//     var connection;
//     await new Promise((resolve, reject) => {
//       MongoClient.connect(mongo_url,{ useUnifiedTopology: true }, (err, database) => {
//         if (err) {
//           console.log("Database error: " + err);
//           reject();
//         } else {
//           console.log("Successful database connection");
//           connection = database;
//           resolve();
//         }
//       });
//     });
//     return connection;
//   }
// };

class Mongo {
  constructor() {
    console.log(mongo_url)
    this.client = new MongoClient(mongo_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  async getDB(_name) {
    await this.client.connect();
    console.log("Connected to MongoDB");
    this.db = this.client.db(_name);

    return this.db;
  }
  async disconnect() {
    await this.client.close();
    console.log("diconnected to MongoDB");
  }
}

module.exports = new Mongo();
