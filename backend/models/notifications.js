import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    from:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type:{
        type: String,
        required: true,
        enum: ['follow', 'like'] // the type of notification can be follow or like
    },
    read:{
        type: Boolean,
        default: false
    }
}, { timeseries: true });


const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;