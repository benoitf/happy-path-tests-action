import * as core from '@actions/core';
import * as execa from 'execa';
import * as path from 'path';
import * as fs from 'fs-extra';
import AxiosInstance from 'axios';

import { injectable } from 'inversify';

@injectable()
export class ImagesHelper {

  async pullImage(image: string): Promise<void> {
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
    // grab list of exported commands
    const { stdout } = await execa('minikube', ['docker-env']);

    // parse export commands
    const regexp = /export (?<key>.*)="(?<value>.*)"/gm;
    let m;
    while ((m = regexp.exec(stdout)) !== null) {
      if (m.groups) {
        const key = m.groups.key;
        const value = m.groups.value;

        core.info(`Exporting ${key} to ${value}`);
        process.env[key] = value;
      }
    }


    // grab the images to pull from happy path files
    const cheHappyPathFolder = path.resolve('che', 'tests', 'e2e', 'files', 'happy-path');
    const files = await fs.readdir(cheHappyPathFolder);
    const images = new Set<string>();
    await Promise.all(files.map(async file => {
      // search inside yaml files the images
      if (file.endsWith('.yaml')) {
        // look for image:
        const fileContent = await fs.readFile(path.join(cheHappyPathFolder, file), 'utf-8');


        const regexpImage = /image: (?<imagename>.*)/gm;
        let mImage;
        while ((mImage = regexpImage.exec(fileContent)) !== null) {
          if (mImage.groups) {
            const imageName = mImage.groups.imagename;
            core.info(`Finding ${imageName} in happy path file ${file}`);
            images.add(imageName);
          }
        }

        const regexpId = /id: (?<componentid>.*)/gm;
        let mId;
        while ((mId = regexpId.exec(fileContent)) !== null) {
          if (mId.groups) {
            // need to grab plugin's id
            const componentId = mId.groups.componentid;

            const response = await AxiosInstance.get(`https://che-plugin-registry-main.surge.sh/v3/plugins/${componentId}/meta.yaml`);
            const pluginIdContent = response.data;

            const pluginRegexpImage = /image: (?<imagename>.*)/gm;
            let mPluginImage;
            while ((mPluginImage = pluginRegexpImage.exec(pluginIdContent)) !== null) {
              if (mPluginImage.groups) {
                const imageName = mPluginImage.groups.imagename;
                core.info(`Finding ${imageName} in component id ${componentId}`);
                images.add(imageName);
              }
            }
          }
        }
      }
    }));

    await Promise.all(Array.from(images).map(async imageParam => {
      const image = imageParam.replace(/'/g, '').replace(/"/g, '');
      return this.pullImage(image);
    }));
  }
}
