const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const tourController = require('./tourController');

exports.getOverview = catchAsync(async(req, res, next) => {

    const tours = await Tour.find();

  res.status(200).render("overview",{
    tours
  });
});

exports.getTour = catchAsync(async(req, res, next) => {

  const data = await Tour.findOne({slug: req.params.slug}).populate({
    path: 'reviews',
    fields: 'review user rating'
  });
  
  
  if(!data){
    return next( new AppError('There is no tour with this name', 404));
  }

  res.status(200).render("tour", {
    title: data.name,
    tour: data,
  });
});

exports.getLoginForm = catchAsync(async(req, res, next) => {
  res.status(200).render("login", {
    title: "Login",
  }); 
});

exports.getAccount = catchAsync(async(req, res, next) => {
  res.status(200).render("account", {
    title: "My Account"
  })
});



exports.updateUserData = catchAsync(async(req, res) => {
  
  console.log("done here calling next")
  console.log(req.originalUrl)
  console.log(req.user, req.body)
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.send("200")
  // .render('account', {
  //   title: 'My Account',
  //   user: updatedUser
  // });
});