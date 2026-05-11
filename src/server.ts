import app from './app';

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`02_EJS_Components → http://localhost:${PORT}`);
});
