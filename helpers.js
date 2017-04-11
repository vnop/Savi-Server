const respondDBquery = (dbResponse, req, res) => {
  if (!dbResponse) {
    res.status(500).end();
  } else {
    res.json(dbResponse).end();
  }
}

module.exports = {
  respondDBquery: respondDBquery
}