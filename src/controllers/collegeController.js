const CollegeModel = require('../models/collegeModel');

const { urlRegex, objectValue, nameRegex, collegeRegex, isValidRequest } = require('../validator/validations.js');


/** --------------------------------------------------------------------------------------------------- */

const createCollege = async function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const data = req.body;

    if (!isValidRequest(data))
      return res.status(400).send({ status: false, msg: 'Request body cannot remain empty' });

    const { name, fullName, logoLink, isDeleted } = data; // Destructuring

    if (!objectValue(name))
      return res.status(400).send({ status: false, msg: 'name must be present it cannot remain empty' });

    if (!nameRegex(name))
      return res.status(400).send({ status: false, msg: 'Please provide valid name, it should not contains any special characters and numbers' });

    const duplicateName = await CollegeModel.findOne({ name: name });
    if (duplicateName)
      return res.status(400).send({ status: false, msg: 'This college name is already exist please provide different one' });

    if (!objectValue(fullName))
      return res.status(400).send({ status: false, msg: 'fullName must be present it cannot remain empty' });

    if (!collegeRegex(fullName))
      return res.status(400).send({ status: false, msg: 'College full name must be in characters and at least of valid length' });

    if (!objectValue(logoLink))
      return res.status(400).send({ status: false, msg: 'logoLink must be present it cannot remain empty' });

    if (!urlRegex(logoLink))
      return res.status(400).send({ status: false, msg: 'logoLink is invalid' });

    const duplicateLogoLink = await CollegeModel.findOne({ logoLink: logoLink });
    if (duplicateLogoLink)
      return res.status(400).send({ status: false, msg: 'logo link already in exist please provide different logo link' });

    if (isDeleted === '') {
      if (!objectValue(isDeleted))
        return res.status(400).send({ status: false, msg: 'isDeleted must be present it cannot remain empty' });
    }

    if (isDeleted && typeof isDeleted !== 'boolean')
      return res.status(400).send({ status: false, msg: 'isDeleted should be either true or false' });

    const savedData = await CollegeModel.create(data);

    const finalCollegeData = {
      name: savedData.name,
      fullName: savedData.fullName,
      logoLink: savedData.logoLink,
      isDeleted: savedData.isDeleted,
    };

    return res.status(201).send({ status: true, data: finalCollegeData });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports = { createCollege };
