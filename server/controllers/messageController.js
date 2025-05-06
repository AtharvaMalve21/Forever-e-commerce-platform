const Message = require("../models/messageModel");
const User = require("../models/userModel");


//any one can message
exports.addMessage = async (req, res) => {
  try {
    //fetch the details
    const { name, phone, body } = req.body;

    //validate details
    if (!name || !phone || !body) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all the required details",
      });
    }

    //validate phone
    if (phone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Phone number should be of 10 digits.",
      });
    }

    //create new message
    const newMessage = await Message.create({ name, phone, body });

    //return response
    return res.status(201).json({
      success: true,
      data: newMessage,
      message: "Message successfully sent.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//only admins can see the messages
exports.getAllMessages = async (req, res) => {
  try {
    //authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found. Login Again.",
      });
    }
    //find all the messages
    const messages = await Message.find({});
    //return response
    return res.status(200).json({
      success: true,
      data: messages,
      message: "Messages data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
