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
    otp: { type: String }, // OTP for verification
    otpExpiry: { type: Date }, // Expiry time for OTP
    isVerified: { type: Boolean, default: false } // Email verification status
});

const User = model('User', UserSchema);

export default User;