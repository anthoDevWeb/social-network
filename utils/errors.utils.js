exports.signUpErrors = (err) => {
  let errors = { pseudo: "", email: "", password: "" };
  if (err.message.includes("pseudo"))
    errors.pseudo = "Pseudo incorrect ou déjà pris";
  if (err.message.includes("email")) errors.email = "Email incorrect";
  if (err.message.includes("password"))
    errors.password = "Le mot de passe doit faire 6 caractères minimum";
  if (err.code === 11000 && err.message.includes("email"))
    errors.email = "Cet email est déjà enregistré";
  if (err.code === 11000 && err.message.includes("pseudo"))
    errors.pseudo = "Ce pseudo est déjà enregistré";
  return errors;
};

exports.signInErrors = (err) => {
  let errors = { email: "", password: "" };
  if (err.message.includes("email")) errors.email = "Email inconnu";

  if (err.message.includes("password"))
    errors.password = "Le mot de passe ne correspond pas";
  return errors;
};

exports.uploadErrors = (e) => {
  let errors = { format: "", maxSize: "" };

  if (e.message.includes("invalid file"))
    errors.format = "Format incompatible";
  if (e.message.includes("max size"))
    errors.maxSize = "Le fichier dépasse 2.5Mo";

  return errors;
};
