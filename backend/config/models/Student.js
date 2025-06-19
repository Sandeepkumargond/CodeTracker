import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: String,

    // Codeforces handle
    cf_handle: { type: String, required: true, unique: true },

    // Codeforces data
    current_rating: Number,
    max_rating: Number,
    current_rank: String,
    max_rank: String,
    cf_contests: { type: Number, default: 0 },
    cf_problems_solved: { type: Number, default: 0 },

    // Sync & notification tracking
    last_synced: Date,
    auto_email_disabled: { type: Boolean, default: false },
    reminder_count: { type: Number, default: 0 },
}, { timestamps: true });

const Student = mongoose.model('Student', StudentSchema);
export default Student;