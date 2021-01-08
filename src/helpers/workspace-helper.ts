import * as core from '@actions/core';
import * as execa from 'execa';
import * as k8s from '@kubernetes/client-node';

import { injectable, postConstruct } from 'inversify';

@injectable()
export class WorkspaceHelper {

  private k8sApi: k8s.CoreV1Api;

  @postConstruct()
  async init(): Promise<void> {
    // now, wait the workspace to be running
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();

    this.k8sApi = kc.makeApiClient(k8s.CoreV1Api);

  }

  async waitWorkspaceStart(timeoutMS = 120000, intervalMS = 5000): Promise<void> {
    const iterations = timeoutMS / intervalMS;
    for (let index = 0; index < iterations; index++) {
      const response = await this.k8sApi.listNamespacedPod('eclipse-che', undefined, undefined, undefined, 'status.phase=Running', 'che.workspace_id');
      if (response.body && response.body.items.length > 0) {
        return
      }
      await new Promise(resolve => setTimeout(resolve, intervalMS));
    }
    throw new Error('Waiting too long to have workspace running');
  }


  async start(): Promise<void> {

    // First create the workspace
    core.info('Create and start workspace...')
    const createAndStartWorkspaceProcess = execa('chectl', ['workspace:create', ' --start', '--devfile=$(pwd)/che/tests/e2e/files/happy-path/happy-path-workspace.yaml']);
    if (createAndStartWorkspaceProcess.stdout) {
      createAndStartWorkspaceProcess.stdout.pipe(process.stdout);
    }
    const workspaceStartEndProcess = await createAndStartWorkspaceProcess;
    const workspaceUrl = /https:\/\/.*/gm.exec(workspaceStartEndProcess.stdout)

    core.setOutput('workspace-url', workspaceUrl);
    core.info(`Detect as workspace URL the value ${workspaceUrl}`);

    await this.waitWorkspaceStart();
  }

}
