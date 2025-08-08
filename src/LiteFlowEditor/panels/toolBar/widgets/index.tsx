import React from 'react';

import { Graph } from '@antv/x6';

import FitWindow from 'liteflow-editor-client/LiteFlowEditor/panels/toolBar/widgets/fitWindow';
import Fullscreen from 'liteflow-editor-client/LiteFlowEditor/panels/toolBar/widgets/fullscreen';
import Mock from 'liteflow-editor-client/LiteFlowEditor/panels/toolBar/widgets/mock';
import Redo from 'liteflow-editor-client/LiteFlowEditor/panels/toolBar/widgets/redo';
import Save from 'liteflow-editor-client/LiteFlowEditor/panels/toolBar/widgets/save';
import Selection from 'liteflow-editor-client/LiteFlowEditor/panels/toolBar/widgets/selection';
import ThemeSwitcher from 'liteflow-editor-client/LiteFlowEditor/panels/toolBar/widgets/theme';
import Undo from 'liteflow-editor-client/LiteFlowEditor/panels/toolBar/widgets/undo';
import View from 'liteflow-editor-client/LiteFlowEditor/panels/toolBar/widgets/view';
import Zoom from 'liteflow-editor-client/LiteFlowEditor/panels/toolBar/widgets/zoom';

interface IProps {
  flowGraph: Graph;
}

const tools: React.FC<IProps>[][] = [
  [ThemeSwitcher, Zoom],
  [FitWindow, Undo, Redo, Selection, Save, View, Fullscreen],
  [Mock],
];

export default tools;
