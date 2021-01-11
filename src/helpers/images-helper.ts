import * as core from '@actions/core';
import * as execa from 'execa';
import * as fs from 'fs-extra';
import AxiosInstance from 'axios';

import { inject, injectable } from 'inversify';
import { Configuration } from '../api/configuration';

@injectable()
export class ImagesHelper {


  @inject(Configuration)
  private configuration: Configuration;
  
  async pullImage(image: string): Promise<void> {
    core.info(`Pulling image ${image}...`);
    const imagePullProcess = execa('docker', ['pull', image]);
    if (imagePullProcess.stdout) {
      imagePullProcess.stdout.pipe(process.stdout);
    }
    await imagePullProcess;
    core.info(`Pulling image ${image} done`);
  }

  async findImages(path: string): Promise<string[]> {
    const images = new Set<string>();

    // starts by http, use axios else use file
    let devfileContent;
    if (path.startsWith('http')) {
      const response = await AxiosInstance.get(path);
      devfileContent = response.data;
    } else {
      devfileContent = await fs.readFile(path, 'utf-8');
    }

    // search the images referenced by the devfile
    const regexpImage = /image: (?<imagename>.*)/gm;
    let mImage;
    while ((mImage = regexpImage.exec(devfileContent)) !== null) {
      if (mImage.groups) {
        const imageName = mImage.groups.imagename;
        core.info(`Found ${imageName} in happy path ${path}`);
        images.add(imageName);
      }
    }

    const regexpId = /id: (?<componentid>.*)/gm;
    let mId;
    while ((mId = regexpId.exec(devfileContent)) !== null) {
      if (mId.groups) {
        // need to grab plugin's id
        const componentId = mId.groups.componentid;
        core.info(`Searching in id ${componentId}`);
        const response = await AxiosInstance.get(`https://che-plugin-registry-main.surge.sh/v3/plugins/${componentId}/meta.yaml`);
        const pluginIdContent = response.data;
        const pluginRegexpImage = /image: (?<imagename>.*)/gm;
        let mPluginImage;
        while ((mPluginImage = pluginRegexpImage.exec(pluginIdContent)) !== null) {
          if (mPluginImage.groups) {
            const imageName = mPluginImage.groups.imagename;
            core.info(`Found ${imageName} in component id ${componentId}`);
            images.add(imageName);
          }
        }
      }
    }

    const regexpReference = /reference: (?<referencedEntry>.*)/gm;
    let mReference;
    while ((mReference = regexpReference.exec(devfileContent)) !== null) {
      if (mReference.groups) {
        // need to grab reference
        const reference = mReference.groups.referencedEntry;
        core.info(`Searching in reference ${reference}`);
        const referencedImages = await this.findImages(reference);
        core.info(`Found images ${referencedImages} in reference ${reference}`);
        referencedImages.forEach(image => images.add(image));
      }
    }

    return Array.from(images).map(imageParam => imageParam.replace(/'/g, '').replace(/"/g, ''));
  }

  async pull(): Promise<void[]> {

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


    // get happy path and analyze reference from the devfile
    const devfilePath = this.configuration.devfilePath();

    // find images from devfilePath
    const foundImages = await this.findImages(devfilePath);

    // skip images that are prefixed with 'local-'
    const images = foundImages.filter(image => !image.startsWith("local-"));

    return Promise.all(images.map(async image => this.pullImage(image)));
  }
}
