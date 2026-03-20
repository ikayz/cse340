const showHomePage = async (req, res) => {
  const title = 'Home';
  res.render('home', { title, path: '/' });
};

export { showHomePage };
