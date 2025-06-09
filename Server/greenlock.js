import Greenlock from 'greenlock-express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const greenlock = Greenlock.init({
  packageRoot: __dirname,
  configDir: './greenlock.d',
  maintainerEmail: 'helloaadityaa@gmail.com',
  staging: false,
  cluster: false,
  manager: {
    module: '@greenlock/manager',
  }
});

export default greenlock;