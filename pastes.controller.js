
// import pastes data file 
const pastes = require("../data/pastes-data");


// list of pastes 
function list(req, res) {
  const { userId } = req.params;
  // filter pastes by userId if provided, otherwise return all pastes 
  res.json({ data: pastes.filter(userId ? paste => paste.user_id == userId : () => true) });
}

// get the highest paste ID to ensure unique IDs for new pastes 
let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0)

// middleware to check if paste has a certain body property 
function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    // if property exists, proceed to the next middleware
    if (data[propertyName]) {
      return next();
    }
    // if property does not exist, return 400 error
    next({
        status: 400,
        message: `Must include a ${propertyName}`
    });
  };
}

// middleware to check if 'exposure' property is valid 
function exposurePropertyIsValid(req, res, next) {
  const { data: { exposure } = {} } = req.body;
  const validExposure = ["private", "public"];
  // if valid, proceed to next middleware
  if (validExposure.includes(exposure)) {
    return next();
  }
  // if invalid, return 400 error
  next({
    status: 400,
    message: `Value of the 'exposure' property must be one of ${validExposure}. Received: ${exposure}`,
  });
}

// middleware to check if 'syntax' property is valid 
function syntaxPropertyIsValid(req, res, next) {
  const { data: { syntax } = {} } = req.body;
  const validSyntax = ["None", "Javascript", "Python", "Ruby", "Perl", "C", "Scheme"];
  // if valid, proceed to next middleware
  if (validSyntax.includes(syntax)) {
    return next();
  }
  // if invalid, return 400 error
  next({
    status: 400,
    message: `Value of the 'syntax' property must be one of ${validSyntax}. Received: ${syntax}`,
  });
}

// middleware to check if 'expiration' property is valid 
function expirationIsValidNumber(req, res, next){
  const { data: { expiration }  = {} } = req.body;
  // if expiration value is a Number, proceed to next middleware
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
  // create a new paste object with a unique ID
  const newPaste = {
    id: ++lastPasteId, // Increment last id then assign as the current ID
    name: name,
    syntax: syntax,
    exposure: exposure,
    expiration: expiration,
    text: text,
  };
  // add the new paste to the pastes array 
  pastes.push(newPaste);
  res.status(201).json({ data: newPaste });
}

// middleware to check if paste already exists 
function pasteExists(req, res, next) {
  const { pasteId } = req.params;
  const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));
  if (foundPaste) {
    res.locals.paste = foundPaste;
    return next();
  }
  // if paste doesn't exist, return 400 error
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

  // update the paste properties with the new values 
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


// export all functions 
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
  