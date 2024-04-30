exports.send_create_response = async (req, res, next) => {
    res.status(200).send({message: "success"});
  };
  
  exports.send_find_response = async (req, res, next) => {
    res.status(200).send(req.responseData);
  };