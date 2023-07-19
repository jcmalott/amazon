export const getError = (error) => {
  console.log(error.response.data.message);
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};
