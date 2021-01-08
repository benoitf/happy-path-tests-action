import * as core from '@actions/core';
import * as github from '@actions/github';

import { Analysis } from './analysis';
import { InversifyBinding } from './inversify-binding';

export class Main {
  public static readonly GITHUB_TOKEN: string = 'github-token';
  public static readonly CHE_URL: string = 'che-url';
  public static readonly MINIKUBE_VERSION: string = 'minikube';
  public static readonly MINIKUBE_VERSION_DEFAULT: string = 'default';
  public static readonly ADD_STATUS: string = 'add-status';
  public static readonly CHE_INSTANCE: string = 'che-instance';

  protected async doStart(): Promise<void> {
    // github write token
    const githubToken = core.getInput(Main.GITHUB_TOKEN, { required: true });
    if (!githubToken) {
      throw new Error(`No Github Token provided (${Main.GITHUB_TOKEN})`);
    }

    const cheUrl = core.getInput(Main.CHE_URL, { required: true });
    if (!cheUrl) {
      throw new Error(`No che-url provided (${Main.CHE_URL})`);
    }
    const inversifyBinbding = new InversifyBinding(githubToken, cheUrl);
    const container = inversifyBinbding.initBindings();
    const analysis = container.get(Analysis);
    await analysis.analyze(github.context);
  }

  async start(): Promise<boolean> {
    try {
      await this.doStart();
      return true;
    } catch (error) {
      core.setFailed(error.message);
      return false;
    }
  }
}
