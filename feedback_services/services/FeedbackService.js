const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  title: String,
  message: String
});

const Feedback = new mongoose.model("feedback", feedbackSchema);

class FeedbackService {

  constructor() {
  }

  async getList() {
    try {
      const data = await this.getData();
      return data;
    }catch(err) {
      console.log(err);
    }
  }


  async addEntry(name, email, title, message) {
    try{
      const newFeedback = await Feedback.create({
        name: name,
        email: email,
        title: title,
        message: message
      });
      await newFeedback.save();
    }catch(err) {
      console.log(err);
    }
  }


  async getData() {
    try{
      const feedbacks = await Feedback.find({});   
      return feedbacks.reverse();
    }catch(err) {
      console.log(err);
    }
  }

  async subscribeEvents(payload) {
    const {event, data} = payload;

    switch(event) {
      case "GETLIST":
        const list = await this.getList();
        return JSON.stringify(list);
      case "ADDENTRY":
        const res = await this.addEntry(data.name, data.email, data.title, data.message);
        if (res) {
          return true;
        }
        break;

    }
    return {msg: "no such event or something is missing"};

  }
}

module.exports = FeedbackService;
