const config = require("./utils/config");
const dns = require("dns");
if (process.env.DNS_SERVER) {
  dns.setServers([process.env.DNS_SERVER]);
}
const app = require("./app");

const PORT = 3002;
app.listen(config.PORT, () => {
  console.log(`Server runing on port ${PORT}`);
});
