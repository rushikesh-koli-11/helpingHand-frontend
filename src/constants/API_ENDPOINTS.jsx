const BASE_URL = "/api"; 

const API_ENDPOINTS = {

  // user 
  LOGIN: `${BASE_URL}/users/login`,
  REGISTER: `${BASE_URL}/users/register`,
  GET_USER: (userId) => `${BASE_URL}/users/${userId}`,
  UPDATE_USER: (userId) => `${BASE_URL}/users/update/${userId}`,
  POST_PROFILE_PICTURE_BY_USERID: (userId) => `${BASE_URL}/users/download/${userId}`,
  UPLOAD_PROFILE_PICTURE: `${BASE_URL}/users/upload`,

  // fundraisers
  GET_FUNDRAISER: `${BASE_URL}/fundraisers`,
  POST_FUNDRAISER: `${BASE_URL}/fundraisers`, // Create fundraiser
  GET_FUNDRAISERS_BY_USER: (userId) => `${BASE_URL}/fundraisers/view-fundraisers/${userId}`,
  GET_FUNDRAISERS_BY_ID: (fundraiserId) => `${BASE_URL}/fundraisers/${fundraiserId}`,
  DELETE_FUNDRAISER: (fundraiserId) => `${BASE_URL}/fundraisers/${fundraiserId}`,
  GET_SAVED_FUNDRAISER: `${BASE_URL}/saved-fundraisers`,
  POST_SAVED_FUNDRAISER: `${BASE_URL}/saved-fundraisers`, // Save fundraiser
  GET_SAVED_FUNDRAISER_BY_SAVEID: (saveId) => `${BASE_URL}/saved-fundraisers/${saveId}`,
  GET_LATEST_FUNDRAISER: `${BASE_URL}/fundraisers/latest`,

  DELETE_SAVED_FUNDRAISER: (saveId) => `${BASE_URL}/saved-fundraisers/${saveId}`,
  PATCH_APPROVE_FUNDRAISER: (fundraiserId) => `${BASE_URL}/fundraisers/${fundraiserId}/approval`,

  // fundraiser-details
  GET_FUNDRAISER_DETAILS: `${BASE_URL}/fundraiser-details`,
  GET_FUNDRAISER_DETAILS_BY_FUNDRAISERID: (fundraiserId) => `${BASE_URL}/fundraiser-details/fundraiser/${fundraiserId}`,
  UPLOAD_FUNDRAISER_DETAILS: `${BASE_URL}/fundraiser-details/upload`,

  //patient-verifications
  POST_PATIENT_VERIFICATION: `${BASE_URL}/patient-verifications`, // Create patient verification
  GET_PATIENT_VERIFICATIONS_BY_FUNDRAISERID: (fundraiserId) => `${BASE_URL}/patient-verifications/fundraiser/${fundraiserId}`,
  GET_PATIENT_VERIFICATIONS: `${BASE_URL}/patient-verifications`,
  UPDATE_PATIENT_VERIFICATION: (id) => `${BASE_URL}/patient-verifications/${id}`,
  DELETE_PATIENT_VERIFICATION: (id) => `${BASE_URL}/patient-verifications/${id}`,

  //medical-documents
  // Backend routes: GET /medical-documents/fetch/{fundraiserId} and PUT /medical-documents/update/{fundraiserId}
  GET_MEDICAL_DOCUMENTS_BY_FUNDRAISERID: (fundraiserId) => `${BASE_URL}/medical-documents/fetch/${fundraiserId}`,
  UPDATE_MEDICAL_DOCUMENTS_BY_FUNDRAISERID: (fundraiserId) => `${BASE_URL}/medical-documents/update/${fundraiserId}`,
  UPLOAD_MEDICAL_DOCUMENTS: `${BASE_URL}/medical-documents/upload`,

  //hospital-details
  POST_HOSPITAL_DETAILS: `${BASE_URL}/hospital-details`, // Create hospital details
  GET_HOSPITAL_DETAILS_BY_FUNDRAISERID: (fundraiserId) => `${BASE_URL}/hospital-details/fundraiser/${fundraiserId}`,
  GET_HOSPITAL_DETAILS_BY_ID: (id) => `${BASE_URL}/hospital-details/${id}`,
  UPDATE_HOSPITAL_DETAILS_BY_ID: (hospitalDetailsId) => `${BASE_URL}/hospital-details/${hospitalDetailsId}`,
  DELETE_HOSPITAL_DETAILS: (id) => `${BASE_URL}/hospital-details/${id}`,

  //bank-details
  POST_BANK_DETAILS: `${BASE_URL}/bank-details`, // Create bank details
  GET_BANK_DETAILS_BY_FUNDRAISERID: (fundraiserId) => `${BASE_URL}/bank-details/fundraiser/${fundraiserId}`,
  GET_BANK_DETAILS_BY_ID: (bankDetailsId) => `${BASE_URL}/bank-details/${bankDetailsId}`,
  GET_BANK_DETAILS: `${BASE_URL}/bank-details`,
  UPDATE_BANK_DETAILS: (bankId) => `${BASE_URL}/bank-details/${bankId}`,
  DELETE_BANK_DETAILS: (bankId) => `${BASE_URL}/bank-details/${bankId}`,

  //background-details
  POST_BACKGROUND_DETAILS: `${BASE_URL}/backgrounds`, // Create background
  GET_BACKGROUND_DETAILS_BY_FUNDRAISERID: (fundraiserId) => `${BASE_URL}/backgrounds/fundraiser/${fundraiserId}`,
  GET_BACKGROUND_DETAILS_BY_BACKGROUNDID: (backgroundId) => `${BASE_URL}/backgrounds/${backgroundId}`,
  GET_BACKGROUND_DETAILS: `${BASE_URL}/backgrounds`,
  UPDATE_BACKGROUND_DETAILS: (backgroundId) => `${BASE_URL}/backgrounds/${backgroundId}`,
  DELETE_BACKGROUND_DETAILS: (backgroundId) => `${BASE_URL}/backgrounds/${backgroundId}`,

  //updates
  POST_UPDATES: `${BASE_URL}/updates`,
  GET_UPDATES: `${BASE_URL}/updates`,
  GET_UPDATES_BY_FUNDRAISERID: (fundraiserId) => `${BASE_URL}/updates/fundraiser/${fundraiserId}`,
  GET_UPDATE_BY_ID: (updateId) => `${BASE_URL}/updates/${updateId}`,

  //endpoint
  GET_ENDPOINT_BY_ID: (endpoint, id) => `${BASE_URL}/${endpoint}/${id}`,

  //download-receipt
  DOWNLOAD_RECEIPT_BY_DONATIONID: (donationId) => `${BASE_URL}/receipt/generate/${donationId}`,

  //donations
  POST_DONATION: `${BASE_URL}/donations`, // Create donation
  GET_DONATIONS_BY_USERID: (userId) => `${BASE_URL}/donations/user/${userId}`,
  GET_DONATIONS_BY_DONATIONID: (donationId) => `${BASE_URL}/donations/${donationId}`,
  GET_DONATIONS_BY_FUNDRAISERID: (fundraiserId) => `${BASE_URL}/donations/fundraiser/${fundraiserId}`,
  DONATION_SUCCESS_URL: (donationId) => `${BASE_URL}/donations/success?donationId=${donationId}`,
  DONATION_CANCEL_URL: (donationId) => `${BASE_URL}/donations/cancel?donationId=${donationId}`,

  //opean AI
  POST_OPENAI: "https://api.openai.com/v1/chat/completions",
  OPENAI_SITE_KEY: "your-openai-site-key-here",

  //stripe-public-key
  STRIPE_PUBLIC_KEY: "your-stripe-public-key-here",
  PAYMENT_CHECKOUT_URL: "http://localhost:8080/payment/checkout",


};

export { BASE_URL, API_ENDPOINTS };
