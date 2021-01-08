import * as core from '@actions/core';
import * as execa from 'execa';
import * as fs from 'fs-extra';
import * as path from 'path';

import { injectable } from 'inversify';

@injectable()
export class HappyPathHelper {

  async start(): Promise<void> {

    const cheUrl = core.getInput('che-url');
    core.info(`Happy path tests will use Eclipse Che URL: ${cheUrl}`);

    const dockerRunProcess = execa('docker', ['run', '--shm-size=1g', '--net=host', '--ipc=host',
     '-p', '5920:5920',
     '-e', 'TS_SELENIUM_HEADLESS="false"',
     '-e', 'TS_SELENIUM_DEFAULT_TIMEOUT=300000',
     '-e', 'TS_SELENIUM_LOAD_PAGE_TIMEOUT=240000',
     '-e', 'TS_SELENIUM_WORKSPACE_STATUS_POLLING=20000',
     '-e', `TS_SELENIUM_BASE_URL=${cheUrl}`,
     '-e', 'TS_SELENIUM_LOG_LEVEL="DEBUG"',
     '-e', 'TS_SELENIUM_MULTIUSER="true"',
     '-e', 'TS_SELENIUM_USERNAME="admin"',
     '-e', 'TS_SELENIUM_PASSWORD="admin"',
     '-e', 'NODE_TLS_REJECT_UNAUTHORIZED=0',
     '-v', '$(pwd)/che/tests/e2e:/tmp/e2e',
     'quay.io/eclipse/happy-path:nightly'
    ]);
    if (dockerRunProcess.stdout) {
      dockerRunProcess.stdout.pipe(process.stdout);
    }
    await dockerRunProcess;
   
  }
}
