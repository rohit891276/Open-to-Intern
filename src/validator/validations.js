const mongoose = require('mongoose');

const isValidObjectId = (objectId) => {
  return mongoose.Types.ObjectId.isValid(objectId);
};

//====================================================================================================================//

const objectValue = (value) => {
  if (typeof value === 'undefined' || value === null) return false;
  if (typeof value === 'string' && value.length === 0) return false;
  return true;
};

//====================================================================================================================//

const isValidRequest = (value) => {
  if (Object.keys(value).length === 0) return false;
  return true;
};

//====================================================================================================================//

const nameRegex = (value) => {
  let nameRegex = /^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/;
  if (nameRegex.test(value)) return true;
};

//====================================================================================================================//

const collegeRegex = (value) => {
  let collegeRegex = /^[A-Za-z\s]{0,}[\.,'-]{0,1}[A-Za-z\s]{0,}[\.,'-]{0,}[A-Za-z\s]{0,}[\.,'-]{0,}[A-Za-z\s]{0,}[\.,'-]{0,}[A-Za-z\s]{0,}[\.,'-]{0,}[A-Za-z\s]{0,}$/;
  if (collegeRegex.test(value)) return true;
};

//====================================================================================================================//

const emailRegex = (value) => {
  let emailRegex = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
  if (emailRegex.test(value)) return true;
};

//====================================================================================================================//

const mobileRegex = (value) => {
  let mobileRegex = /^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/
  if (mobileRegex.test(value)) return true;
};

//====================================================================================================================//

const urlRegex = (value) => {
  let urlRegex = /(https|http?:\/\/.*\.(?:png|gif|webp|jpeg|jpg))/i;
  if (urlRegex.test(value)) return true;
};

module.exports = { isValidObjectId, objectValue, nameRegex, collegeRegex, emailRegex, isValidRequest, mobileRegex, urlRegex };
