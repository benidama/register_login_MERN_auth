import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { 
        type: String, 
        required: true,
        validate: {
            validator: function(phone) {
                return /^[+]?[1-9]\d{1,14}$/.test(phone);
            },
            message: 'Please enter a valid phone number'
        }
    },
    password: { 
        type: String, 
        required: true,
        minlength: [8, 'Password must be at least 8 characters long'],
        validate: {
            validator: function(password) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password);
            },
            message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        }
    },
    role: { 
        type: String, 
        required: true,
        enum: ['Client', 'Worker', 'Leader'],
        default: 'Client'
    },
    profileImage: {
        type: String, // Base64 string or URL
        default: null
    },
    otp: { type: String }, 
    otpExpiry: { type: Date }, 
    isVerified: { type: Boolean, default: false }, 
    createdAt: { type: Date, default: Date.now } // Account creation date
});

const User = model('User', UserSchema);

export default User;