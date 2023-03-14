import mongoose from 'mongoose';
const { connect } = mongoose;

import config from 'config';
const db = config.get('MONGODB_URI');


const connectMongoDB = () => {
	try {
		connect(db, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true
        });

		console.log('MongoDB Connected...');
	} catch (err) {
		console.error(err.message);
		// Exit process with failure
		process.exit(1);
	}
};

export default connectMongoDB;