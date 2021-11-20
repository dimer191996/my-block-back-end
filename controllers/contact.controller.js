import ContactModel from "../models/contact.model.js";
export const sendContactForm = async (req, res, next) => {
  const contactForm = new ContactModel({
    creator: req.body.email,
    body: req.body.body,
  });

  try {
    await contactForm.save();
    return res.status(201).send({
      message: "Thank You For We will get back to you soon",
      type: "success",
    });
  } catch (err) {
    return res.status(401).send({
      message: "Something Went wrong",
      type: "fail",
    });
  }
};

export default {
  sendContactForm,
};
