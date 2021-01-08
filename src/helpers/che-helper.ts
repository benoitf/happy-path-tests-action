import * as core from '@actions/core';
import * as execa from 'execa';

import { injectable } from 'inversify';

@injectable()
export class CheHelper {

  async clone(): Promise<void> {
    
    // Clone Eclipse che
    core.info('Cloning eclipse che for happy path tests')
    const gitCloneProcess = execa('git', ['clone', 'https://github.com/eclipse/che']);
    if (gitCloneProcess.stdout) {
      gitCloneProcess.stdout.pipe(process.stdout);
    }
    await gitCloneProcess;
  }
}
