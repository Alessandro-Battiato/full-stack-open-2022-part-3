const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

//node mongo.js <yourpassword>

const url = `mongodb+srv://Alessandro:${password}@atlascluster.chiopef.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected");

    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
    });

    return person.save();
  })
  .then(() => {
    console.log(
      `added ${process.argv[3]} number ${process.argv[4]} to phonebook`
    );
    return mongoose.connection.close();
  })
  .catch((err) => console.log(err));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
  },
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("Phonebook:");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}
