const InternModel = require('../models/internModel');
const CollegeModel = require('../models/collegeModel');

const { objectValue, nameRegex, emailRegex, isValidRequest, mobileRegex } = require('../validator/validations.js');


/** --------------------------------------------------------------------------------------------------- */

const createIntern = async function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const data = req.body
    const { name, email, mobile, collegeName, isDeleted } = data; // Destructuring

    if (!isValidRequest(data))
      return res.status(400).send({ status: false, msg: 'Request body cannot remain empty' });

    if (!objectValue(collegeName))
      return res.status(400).send({ status: false, msg: 'collegeName must be present it cannot remain empty ' });

    if (!objectValue(name))
      return res.status(400).send({ status: false, msg: 'name must be present it cannot remain empty' });

    if (!nameRegex(name))
      return res.status(400).send({ status: false, msg: 'Please provide valid name, it should not contains any special characters and numbers' });

    if (isDeleted === '') {
      if (!objectValue(isDeleted))
        return res.status(400).send({ status: false, msg: 'isDeleted must be present it cannot remain empty' });
    }

    if (isDeleted && typeof isDeleted !== 'boolean')
      return res.status(400).send({ status: false, msg: 'isDeleted should be either true or false' });

    if (!objectValue(email))
      return res.status(400).send({ status: false, msg: 'emaiId must be present it cannot remain empty' });

    if (!emailRegex(email))
      return res.status(400).send({ status: false, msg: 'emailId is invalid' });

    const duplicateEmail = await InternModel.findOne({ email: email });

    if (duplicateEmail)
      return res.status(400).send({ status: false, msg: 'This email is already exist' });

    if (!objectValue(mobile))
      return res.status(400).send({ status: false, msg: 'mobile number must be present it cannot remain empty' });

    if (!mobileRegex(mobile))
      return res.status(400).send({ status: false, msg: 'mobile number is invalid' });

    const duplicateMobile = await InternModel.findOne({ mobile: mobile });

    if (duplicateMobile)
      return res.status(400).send({ status: false, msg: `This mobile number ${mobile} is already present try with different one` });


    const findCollegeId = await CollegeModel.findOne({ name: collegeName, isDeleted: false });

    if (!findCollegeId)
      return res.status(404).send({ status: false, msg: `There is no such college present with the name college name : ${collegeName}` });

    let collegeId = findCollegeId._id;
    const internData = {
      isDeleted: findCollegeId.isDeleted,
      name: name,
      email: email,
      mobile: mobile,
      collegeId: collegeId,
    }
    const internCreation = await InternModel.create(internData);

    let finalData = {}
    finalData.isDeleted = findCollegeId.isDeleted;
    finalData.name = internCreation.name;
    finalData.email = internCreation.email;
    finalData.mobile = internCreation.mobile;
    finalData.collegeId = findCollegeId._id;

    return res.status(201).send({ status: true, data: finalData });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};


/** --------------------------------------------------------------------------------------------------- */


const getCollegeDetails = async function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    let name = req.query.collegeName;

    if (!name)
      return res.status(400).send({ status: false, msg: 'Query cannot remain empty' });

    name = name.trim().toLowerCase();

    const college = await CollegeModel.findOne({ name: name });

    if (!college)
      return res.status(404).send({ status: false, msg: 'No such college exist or try for abbreviation of same' });

    const findIntern = await InternModel.find({ collegeId: college._id, isDeleted: false }).select({ collegeId: 0, __v: 0, isDeleted: 0 });

    if (!findIntern.length)
      return res.status(404).send({ status: false, msg: 'No interns exist for this college' });

    const finalData = {
      name: college.name,
      fullName: college.fullName, // Destructuring
      logoLink: college.logoLink,
      interns: findIntern,
    }

    return res.status(200).send({ status: true, data: finalData });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports = { createIntern, getCollegeDetails };

