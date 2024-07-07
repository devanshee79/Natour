const axios = require("axios");
const Tour = require("../models/tourModel");
const Booking = require("../models/bookingModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("../utils/appError");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const CASHFREE_APP_ID = process.env.PAYMENT_ID;
  const CASHFREE_SECRET_KEY = process.env.PAYMENT_SECRET_KEY;
  const CASHFREE_TEST_URL = process.env.PAYMENT_URL;

  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }

  // 2) Create checkout session (order) with Cashfree
  const orderData = {
    order_id: `${req.params.tourId}_${Date.now()}`, // Unique order ID
    order_amount: tour.price,
    order_currency: "INR",
    customer_details: {
      customer_id: req.user.id,
      customer_email: req.user.email,
      customer_phone: "1203567890", // Assuming you have the user's phone number
      customer_name: req.user.name, // Assuming you have the user's name
    },
    order_note: `${tour.name} Tour Booking`,
  };

  const response = await axios.post(`${CASHFREE_TEST_URL}`, orderData, {
    headers: {
      "Content-Type": "application/json",
      "x-client-id": CASHFREE_APP_ID,
      "x-client-secret": CASHFREE_SECRET_KEY,
      "x-api-version": "2023-08-01",
      "x-request-id": `req_${Date.now()}`, // Optional unique request ID
    },
  });

  // 3) Create session as response
  res.status(200).json({
    status: "success",
    session: response.data,
  });
});

exports.orderStatusCheck = catchAsync(async (req, res, next) => {

  const CASHFREE_APP_ID = process.env.PAYMENT_ID;
  const CASHFREE_SECRET_KEY = process.env.PAYMENT_SECRET_KEY;
  const CASHFREE_TEST_URL = process.env.PAYMENT_URL;

  const orderStatus = await axios.get(`${CASHFREE_TEST_URL}/${req.params.orderId}`, {
    headers: {
      "Content-Type": "application/json",
      "x-client-id": CASHFREE_APP_ID,
      "x-client-secret": CASHFREE_SECRET_KEY,
      "x-api-version": "2023-08-01",
      "x-request-id": `req_${Date.now()}`, // Optional unique request ID
    },
  });

  res.status(200).send(orderStatus.data.order_status);
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const tour = req.body.tourId;
  const price = req.body.price;
  const user = req.user._id;

  if (!tour && !user && !price) return next(new AppError("fiels are not there", 400));
  const response = await Booking.create({ tour, user, price });

  res.redirect('/');
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
