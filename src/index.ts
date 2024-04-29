import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { requestAPI } from './handler';

/**
 * Initialization data for the jupytercad_openvsp extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupytercad_openvsp:plugin',
  description: 'A JupyterCAD extension for OpenVSP',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupytercad_openvsp is activated!');

    requestAPI<any>('get-example')
      .then(data => {
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The jupytercad_openvsp server extension appears to be missing.\n${reason}`
        );
      });
  }
};

export default plugin;
