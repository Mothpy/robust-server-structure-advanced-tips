const pastes = require("../data/pastes-data");


// list 
function list(req, res) {
  const { userId } = req.params;
  res.json({ data: pastes.filter(userId ? paste => paste.user_id == userId : () => true) });
}

let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0)

// check body data 
function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({
        status: 400,
        message: `Must include a ${propertyName}`
    });
  };
}

// check if exposure property is valid 
function exposurePropertyIsValid(req, res, next) {
  const { data: { exposure } = {} } = req.body;
  const validExposure = ["private", "public"];
  if (validExposure.includes(exposure)) {
    return next();
  }
  next({
    status: 400,
    message: `Value of the 'exposure' property must be one of ${validExposure}. Received: ${exposure}`,
  });
}

// check if syntax property is valid 
function syntaxPropertyIsValid(req, res, next) {
  const { data: { syntax } = {} } = req.body;
  const validSyntax = ["None", "Javascript", "Python", "Ruby", "Perl", "C", "Scheme"];
  if (validSyntax.includes(syntax)) {
    return next();
  }
  next({
    status: 400,
    message: `Value of the 'syntax' property must be one of ${validSyntax}. Received: ${syntax}`,
  });
}

// check if expiration number is valid 
function expirationIsValidNumber(req, res, next){
  const { data: { expiration }  = {} } = req.body;
  if (expiration <= 0 || !Number.isInteger(expiration)){
      return next({
          status: 400,
          message: `Expiration requires a valid number`
      });
  }
  next();
}

// create a new paste 
function create(req, res) {
  const { data: { name, syntax, exposure, expiration, text } = {} } = req.body;
  const newPaste = {
    id: ++lastPasteId, // Increment last id then assign as the current ID
    name: name,
    syntax: syntax,
    exposure: exposure,
    expiration: expiration,
    text: text,
  };
  pastes.push(newPaste);
  res.status(201).json({ data: newPaste });
}

// check if paste already exists 
function pasteExists(req, res, next) {
  const { pasteId } = req.params;
  const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));
  if (foundPaste) {
    res.locals.paste = foundPaste;
    return next();
  }
  next({
    status: 404,
    message: `Paste id not found: ${pasteId}`,
  });
};

// read a paste 
function read(req, res, next) {
  res.json({ data: res.locals.paste });
};

// update a paste 
function update(req, res) {
  const paste = res.locals.paste;
  const { data: { name, syntax, expiration, exposure, text } = {} } = req.body;

  // update the paste
  foundPaste.name = name;
  foundPaste.syntax = syntax;
  foundPaste.expiration = expiration;
  foundPaste.exposure = exposure;
  foundPaste.text = text;

  res.json({ data: paste });

}

// delete a paste 
function destroy(req, res) {
  const { pasteId } = req.params;
  const index = pastes.findIndex((paste) => paste.id === Number(pasteId));
  // `splice()` returns an array of the deleted elements, even if it is one element
  const deletedPastes = pastes.splice(index, 1);
  res.sendStatus(204);
}

module.exports = {
  create: [
      bodyDataHas("name"),
      bodyDataHas("syntax"),
      bodyDataHas("exposure"),
      bodyDataHas("expiration"),
      bodyDataHas("text"),
      exposurePropertyIsValid,
      syntaxPropertyIsValid,
      expirationIsValidNumber,
      create
  ],
  list,
  read: [pasteExists, read],
  update: [
      pasteExists,
      bodyDataHas("name"),
      bodyDataHas("syntax"),
      bodyDataHas("exposure"),
      bodyDataHas("expiration"),
      bodyDataHas("text"),
      exposurePropertyIsValid,
      syntaxPropertyIsValid,
      expirationIsValidNumber,
      update
  ],
  delete: [pasteExists, destroy],
};
  