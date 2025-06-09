import { execSync } from 'child_process';

export const getDomainName = () => process.env.DOMAIN;

export function addGreenlockSite(subject, altnames) {
  const cmd = `npx greenlock add --subject ${subject} --altnames ${altnames.join(',')}`;
  try {
    const output = execSync(cmd, { encoding: 'utf-8' });
    console.log('Command output:', output);
    return output;
  } catch (err) {
    console.error('Error running greenlock add:', err.message);
    throw err;
  }
}