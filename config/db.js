import mongoose from "mongoose";
export const connectDB = async () => {
    console.log("trying to connect to DB...");
    try {
        const dbAddress = await (await mongoose.connect(`${process.env.MONGO_URI}`, { dbName: 'strategizedb' }));
        console.log(`MongoDB connected on: ${dbAddress.connection.host}`);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
};
