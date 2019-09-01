const addRepository = async input => {
  return fs.promises
    .readFile("./data/settings.json", "utf8")
    .then(data => JSON.parse(data))
    .then(data => {
      data.repositories.push(input.repository);
      return data;
    })
    .then(data =>
      fs.promises.writeFile("./data/settings.json", JSON.stringify(data))
    )
    .then(
      fs.promises
        .readFile("./data/settings.json", "utf8")
        .then(data => JSON.parse(data))
    );
};
module.exports = { addRepository };
