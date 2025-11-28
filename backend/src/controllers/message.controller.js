import { Conversation } from '../models/conversation.model.js'
import { Message } from '../models/message.model.js'
import { getRecieverSocketId, io } from '../socket/socket.js';

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const recieverId = req.params.id;
        const { textMessage: message } = req.body;

        if (!senderId || !recieverId) {
            return res.status(400).json({
                success: false,
                message: "senderId or recieverId missing"
            });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recieverId] }
        });
        //establish the conversation if not started yet
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, recieverId]
            })
        };
        const newMessage = await Message.create({
            senderId,
            recieverId,
            message
        })
        if (newMessage) conversation.messages.push(newMessage._id);

        await Promise.all([conversation.save(), newMessage.save()]);

        //implement socket io
        const recieverSocketId = getRecieverSocketId(recieverId);

        if (recieverId) {
            io.to(recieverSocketId).emit('newMessage', newMessage);
        }

        return res.status(200).json({
            newMessage,
            success: true
        })
    } catch (error) {
        console.log(error)

    }
}
export const getMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const recieverId = req.params.id;

        // ✅ Validate receiverId before running DB query
        if (!recieverId) {
            return res.status(400).json({ 
                success: false, 
                message: "Receiver ID is required" 
            });
        }

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, recieverId] }
        }).populate('messages');

        if (!conversation) {
            return res.status(200).json({
                messages: []
            });
        }

        return res.status(200).json({
            messages: conversation.messages
        });
    } catch (error) {
        console.log("Error in getMessage:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
