import * as core from '@actions/core';
import * as execa from 'execa';

import { injectable } from 'inversify';

@injectable()
export class ImagesHelper {

  async pullImage(image: string) : Promise<void> {
    core.info(`Pulling image ${image}...`);
    const imagePullProcess = execa('docker', ['pull', image]);
    if (imagePullProcess.stdout) {
      imagePullProcess.stdout.pipe(process.stdout);
    }
    await imagePullProcess;
    core.info(`Pulling image ${image} done`);
  }

  async pull(): Promise<void> {
    
    // setup docker-env of minikube
    core.info('Setup docker-env of minikube')
    const minikubeEnvProcess = await execa('eval', ['$(minikube docker-env)']);
    core.info(minikubeEnvProcess.stdout);

    await this.pullImage('quay.io/eclipse/happy-path:nightly');
    await this.pullImage('mariolet/petclinic:d2831f9b');
    await this.pullImage('centos/postgresql-96-centos7:9.6');
    await this.pullImage('quay.io/eclipse/che-theia:next');
    await this.pullImage('quay.io/eclipse/che-theia-endpoint-runtime-binary:next');
  }
}
