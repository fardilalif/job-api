const Job = require('../models/Job.js');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors');

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userID });
  res.status(StatusCodes.OK).json({ success: true, jobs });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userID;
  const job = req.body;
  const createdJob = await Job.create(job);
  res.status(StatusCodes.CREATED).json({ success: true, job: createdJob });
};

const getJob = async (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  const { userID } = req.user;
  console.log(userID);

  const job = await Job.findOne({ _id: id, createdBy: userID });
  console.log(job);
  if (!job) {
    throw new NotFoundError(`No job with id ${id}`);
  }

  res.status(StatusCodes.OK).json({ success: true, job });
};

const updateJob = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobID },
  } = req;

  const updatedJob = await Job.findOneAndUpdate(
    { _id: jobID, createdBy: userID },
    req.body,
    { returnDocument: 'after', runValidators: true }
  );

  if (!updatedJob) {
    throw new NotFoundError(`No job with id ${jobID}`);
  }

  res.status(StatusCodes.OK).json({ success: true, job: updatedJob });
};

const deleteJob = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobID },
  } = req;

  const job = await Job.findOneAndDelete({ _id: jobID, createdBy: userID });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobID}`);
  }

  res.status(StatusCodes.OK).json({ success: true, job });
};

module.exports = {
  getAllJobs,
  createJob,
  getJob,
  updateJob,
  deleteJob,
};
