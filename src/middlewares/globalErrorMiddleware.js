const GlobalError = (err, req, res, next) => {
  console.log(
    ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>global start>>>>>>>>>>>>>>>>>>>>>>>>>>>\n",

    err,

    "\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>global end>>>>>>>>>>>>>>>>>>>>>>>>>>>"
  );

  let error = {
    name: err?.name,
    message: err?.message,
    path: { path: err?.message, message: "" },
  };

  res.status(400).send(error);
};

module.exports = GlobalError;
