import Greenlock from "greenlock";
import { getDomainName } from "../utils/user.util";

const defaultDomain = getDomainName(); 

const greenlock = Greenlock.create({
  packageRoot: __dirname,
  configDir: "./greenlock.d",
  maintainerEmail: "helloaadityaa@gmail.com",
  cluster: false,
  staging: false,
  sites: [
    {
      subject: defaultDomain,
      altnames: [`app.${defaultDomain}`, `www.${defaultDomain}`],
    },
  ],
});

export default greenlock;
