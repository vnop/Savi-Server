const respondDBQuery = (dbResponse, req, res) => {
  if (!dbResponse) {
    res.status(500).send('No DB Entries matched the request');
  } else {
    res.json(dbResponse).end();
  }
}

const respondDBError = (DBError, req, res) {
  res.status(500).json({error: DBError}).send('There was an error in the DB');
}

module.exports = {
  respondDBQuery: respondDBQuery,
  respondDBError: respondDBError
}