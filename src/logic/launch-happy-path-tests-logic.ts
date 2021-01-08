import * as core from '@actions/core';

import { inject, injectable } from 'inversify';

import { AnyListener } from '../api/any-listener';
import { Configuration } from '../api/configuration';
import { Logic } from '../api/logic';
import { CheHelper } from '../helpers/che-helper';
import { HappyPathHelper } from '../helpers/happy-path-helper';
import { ImagesHelper } from '../helpers/images-helper';
import { WorkspaceHelper } from '../helpers/workspace-helper';

@injectable()
export class LaunchHappyPathTestsLogic implements Logic, AnyListener {
  @inject(ImagesHelper)
  private imagesHelper: ImagesHelper;

  @inject(CheHelper)
  private cheHelper: CheHelper;

  @inject(WorkspaceHelper)
  private workspaceHelper: WorkspaceHelper;

  @inject(HappyPathHelper)
  private happyPathHelper: HappyPathHelper;

  public async execute(): Promise<void> {
    core.info('Images [pull]...');
    await this.imagesHelper.pull();

    core.info('Eclipse Che [clone]...');
    await this.cheHelper.clone();

    core.info('Workspace [start]...');
    await this.workspaceHelper.start();

    core.info('Happy Path [start]...');
    await this.happyPathHelper.start();

  }

  @inject(Configuration)
  private configuration: Configuration;
}
