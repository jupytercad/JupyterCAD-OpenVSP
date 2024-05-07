import {
  ICollaborativeDrive,
  SharedDocumentFactory
} from '@jupyter/docprovider';
import {
  IJCadWorkerRegistry,
  IJCadWorkerRegistryToken,
  IJupyterCadDocTracker,
  IJupyterCadWidget,
  IJCadExternalCommandRegistry,
  IJCadExternalCommandRegistryToken
} from '@jupytercad/schema';
import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { IThemeManager, WidgetTracker } from '@jupyterlab/apputils';
import { JupyterCadWidgetFactory } from '@jupytercad/jupytercad-core';
import { JupyterCadVspModelFactory } from './modelfactory';
import { JupyterCadOVSPDoc } from './model';

const FACTORY = 'JupyterCAD VSP3 Viewer';

/**
 * Initialization data for the jupytercad_openvsp extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupytercad_openvsp:plugin',
  description: 'A JupyterCAD extension for OpenVSP',
  autoStart: true,
  requires: [
    IJupyterCadDocTracker,
    IThemeManager,
    IJCadWorkerRegistryToken,
    IJCadExternalCommandRegistryToken,
    ICollaborativeDrive
  ],
  activate: (
    app: JupyterFrontEnd,
    tracker: WidgetTracker<IJupyterCadWidget>,
    themeManager: IThemeManager,
    workerRegistry: IJCadWorkerRegistry,
    externalCommandRegistry: IJCadExternalCommandRegistry,
    drive: ICollaborativeDrive | null
  ) => {
    const widgetFactory = new JupyterCadWidgetFactory({
      name: FACTORY,
      modelName: 'jupytercad-vspmodel',
      fileTypes: ['vsp'],
      defaultFor: ['vsp'],
      tracker,
      commands: app.commands,
      workerRegistry,
      externalCommandRegistry
    });
    app.docRegistry.addWidgetFactory(widgetFactory);

    const modelFactory = new JupyterCadVspModelFactory();
    app.docRegistry.addModelFactory(modelFactory);
    // register the filetype
    app.docRegistry.addFileType({
      name: 'vsp',
      displayName: 'VSP',
      mimeTypes: ['text/json'],
      extensions: ['.vsp3', '.VSP3'],
      fileFormat: 'text',
      contentType: 'vsp'
    });

    const vspSharedModelFactory: SharedDocumentFactory = () => {
      return new JupyterCadOVSPDoc();
    };
    if (drive) {
      drive.sharedModelFactory.registerDocumentFactory(
        'vsp',
        vspSharedModelFactory
      );
    }

    widgetFactory.widgetCreated.connect((sender, widget) => {
      widget.context.pathChanged.connect(() => {
        tracker.save(widget);
      });
      themeManager.themeChanged.connect((_, changes) =>
        widget.context.model.themeChanged.emit(changes)
      );
      tracker.add(widget);
      app.shell.activateById('jupytercad::leftControlPanel');
    });
  }
};

export default plugin;
