/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";
import { load } from '@cashfreepayments/cashfree-js';

const baseUrl = "http://localhost:3000";
const api = "/api/v1";

// Initiate Cashfree
const initiateCashfree = async () => {
  const cashfree = await load({
    mode: "sandbox", // or 'production'
  });
  return cashfree;
};

const checkStatus = async (orderId) => {
  try {
    const status = await axios({
      method: "GET",
      url: `${baseUrl}${api}/bookings/checkout-session-status/${orderId}`,
    });
    return status.data;
  } catch (error) {
    console.error('Error checking status:', error);
    throw error;
  }
};

export const bookTour = async (tourId) => {
  try {
    console.log("here in payments");

    // 1) Get checkout session from API
    const session = await axios({
      method: "POST",
      url: `${baseUrl}${api}/bookings/checkout-session/${tourId}`,
    });

    // Ensure the session data is available
    if (!session.data || !session.data.session || !session.data.session.payment_session_id) {
      throw new Error("Invalid session data");
    }

    // Load Cashfree.js
    const cashfree = await initiateCashfree();
    console.log("all good till here");

    // Define checkout options
    const checkoutOptions = {
      paymentSessionId: session.data.session.payment_session_id,
      redirectTarget: "_modal",
    };

    // Initiate the checkout
    cashfree.checkout(checkoutOptions).then(async (res) => {
      try {
        const status = await checkStatus(session.data.session.order_id);
        console.log(status)
        if(status === 'PAID'){
          console.log(tourId)
          const booking = await axios({
            method: "POST",
            url: `${baseUrl}${api}/bookings/createBookingCheckout`,
            data: {
              tourId: tourId,
              price: session.data.session.order_amount
            },
          });
        }

        showAlert("success", "Booking created successfully!");

      } catch (error) {
        console.error("Error checking order status after checkout:", error);
        showAlert("error", "Failed to check order status. Please try again.");
      }
    }).catch((checkoutError) => {
      console.error("Checkout error:", checkoutError);
      showAlert("error", "Failed to initiate checkout. Please try again.");
    });

  } catch (err) {
    console.error("err->", err);
    showAlert("error", err.message);
  }
};
