export const signUpValidator = (err) => {
  let errors = { name: "", password: "", email: "" };

  if (err.message.includes("name")) {
    errors.name = "The UserName is incorrect, (6) min char";
  }
  if (err.message.includes("email")) {
    errors.email = "The email is incorrect";
  }
  if (err.message.includes("password")) {
    errors.password = "Password min (6) Char, Please Try again. ";
  }
  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email")) {
    errors.email = "This email is already taken";
  }
  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("name")) {
    errors.name = "This UserName is already taken";
  }

  return errors;
};
