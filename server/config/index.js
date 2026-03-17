import mongoose from 'mongoose';
import adminSchema from '../models/Admin.js';

let adminConn;
let Admin;

export const connectDB = async () => {
    try {
        const mongoOptions = {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000,
            family: 4 // Use IPv4
        };

        // Default connection (test database)
        const conn = await mongoose.connect(process.env.MONGO_URI, mongoOptions);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Admin database connection
        const baseUri = process.env.MONGO_URI.includes('?') 
            ? process.env.MONGO_URI.split('?')[0]
            : process.env.MONGO_URI;
        
        const adminUri = baseUri.substring(0, baseUri.lastIndexOf('/')) + '/admin_db';
        const queryParams = process.env.MONGO_URI.includes('?') ? '?' + process.env.MONGO_URI.split('?')[1] : '';
        
        adminConn = mongoose.createConnection(adminUri + queryParams, mongoOptions);
        Admin = adminConn.model('Admin', adminSchema);
        
        console.log(`Admin Database Connected`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export { Admin };