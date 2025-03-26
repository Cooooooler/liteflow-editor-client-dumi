import Icon, {
  DeleteOutlined,
  EditOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
import { Node } from '@antv/x6';
import { Dropdown, Modal, Tooltip } from 'antd';
import classNames from 'classnames';
import { history } from 'liteflow-editor-client/LiteFlowEditor/hooks/useHistory';
import { INodeData } from 'liteflow-editor-client/LiteFlowEditor/model/node';
import getContextPadMenu from 'liteflow-editor-client/LiteFlowEditor/panels/flowGraph/contextPad';
import { createStyles } from 'liteflow-editor-client/LiteFlowEditor/styles';
import IndicatorIcons from 'liteflow-editor-client/LiteFlowEditor/svg_components/IndicatorIcons';
import { debounce } from 'lodash';
import React from 'react';

const useStyles = createStyles(({ token, css }) => {
  return {
    nodeToolBar: css`
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      .liteflow-add-node-prepend,
      .liteflow-add-node-append,
      .liteflow-top-toolBar,
      .liteflow-bottom-tool-bar {
        display: none;
      }

      &:hover {
        .liteflow-add-node-prepend,
        .liteflow-add-node-append,
        .liteflow-top-toolBar,
        .liteflowbottom-tool-bar {
          display: flex;
        }
      }
    `,
    addNodePrepend: css`
      position: absolute;
      top: 5px;
      left: -18px;
      width: 18px;
      height: 20px;
      overflow: hidden;
      background-color: ${token.colorBgContainer};
      border-radius: ${token.borderRadius}px;

      &:hover .liteflow-add-node-prepend-icon {
        filter: opacity(1);
      }
    `,
    addNodePrependIcon: css`
      width: 100%;
      height: 100%;
      filter: opacity(0.5);
    `,
    addNodeAppend: css`
      position: absolute;
      top: 5px;
      right: -18px;
      width: 18px;
      height: 20px;
      overflow: hidden;
      background-color: ${token.colorBgContainer};
      border-radius: ${token.borderRadius}px;
      transform: rotate(180deg);

      &:hover .liteflow-add-node-append-icon {
        filter: opacity(1);
      }
    `,
    addNodeAppendIcon: css`
      width: 100%;
      height: 100%;
      background-size: cover;
      filter: opacity(0.5);
    `,
    topToolBar: css`
      display: flex;
      justify-content: space-around;
      align-items: center;
      position: absolute;
      top: -24px;
      left: 50%;
      width: 50px;
      height: 24px;
      margin-left: -25px;
      border-radius: ${token.borderRadius}px;
      background-color: ${token.colorBgContainer};
      box-shadow: ${token.boxShadow};
    `,
    toolBarBtn: css`
      display: flex;
      justify-content: center;
      align-items: center;
      width: 20px;
      height: 20px;
      font-size: 16px;
      border: 1px solid transparent;
      border-radius: ${token.borderRadius}px;

      &:hover {
        border: 1px solid #ccc;
        background-color: rgba(64, 87, 109, 0.07);
      }
    `,
    deleteNode: css`
      position: relative;
      color: #f54a45;
    `,
    verticalLine: css`
      width: 2px;
      height: 18px;
      background-color: ${token.colorPrimaryBorder};
      border-radius: ${token.borderRadius}px;
    `,
    bottomToolBar: css`
      display: flex;
      justify-content: space-around;
      align-items: center;
      position: absolute;
      top: 24px;
      left: 50%;
      width: 50px;
      height: 24px;
      margin-left: -25px;
    `,
    collapseNode: css`
      position: relative;
      top: -2px;
      color: #c1c1c1;
      width: 12px;
      height: 12px;
      font-size: 12px;
      background: rgba(255, 255, 255, 0.85);

      &:hover {
        color: rgba(0, 0, 0, 0.85);
        background: #ffffff;
      }
    `,
  };
});

const NodeToolBar: React.FC<{ node: Node }> = (props) => {
  const { styles } = useStyles();
  const { node } = props;
  const {
    model,
    toolbar = {
      append: true,
      delete: true,
      prepend: true,
      replace: true,
      collapse: false,
    },
  } = node.getData<INodeData>() || {};
  const onDelete = debounce(() => {
    node.model?.graph?.select(model.selectNodes());
    node.model?.graph?.trigger('model:select', model);
    Modal.confirm({
      title: `确认要删除选中的节点？`,
      content: '点击确认按钮进行删除，点击取消按钮返回',
      onOk() {
        if (model.remove()) {
          node.model?.graph?.cleanSelection();
          history.push();
        }
      },
    });
  }, 100);
  const onCollapse = debounce(() => {
    model.toggleCollapse();
    node.model?.graph?.trigger('model:change');
  }, 100);

  const collapsed = model?.isCollapsed();
  return (
    <div className={classNames(styles.nodeToolBar)}>
      {toolbar.prepend && (
        <Dropdown
          menu={{
            items: getContextPadMenu({
              node,
              scene: 'prepend',
              title: '前面插入节点',
            }),
          }}
          trigger={['click']}
        >
          <div
            className={classNames(
              styles.addNodePrepend,
              'liteflow-add-node-prepend',
            )}
          >
            <Tooltip title="前面插入节点">
              <div
                className={classNames(
                  styles.addNodePrependIcon,
                  'liteflow-add-node-prepend-icon',
                )}
              >
                <Icon component={IndicatorIcons} />
              </div>
            </Tooltip>
          </div>
        </Dropdown>
      )}
      {toolbar.append && (
        <Dropdown
          menu={{
            items: getContextPadMenu({
              node,
              scene: 'append',
              title: '后面插入节点',
            }),
          }}
          trigger={['click']}
        >
          <div
            className={classNames(
              styles.addNodeAppend,
              'liteflow-add-node-append',
            )}
          >
            <Tooltip title="后面插入节点">
              <div
                className={classNames(
                  styles.addNodeAppendIcon,
                  'liteflow-add-node-append-icon',
                )}
              >
                <Icon component={IndicatorIcons} />
              </div>
            </Tooltip>
          </div>
        </Dropdown>
      )}
      {(toolbar.replace || toolbar.delete) && (
        <div className={classNames(styles.topToolBar, 'liteflow-top-toolBar')}>
          {
            <Dropdown
              menu={{
                items: getContextPadMenu({
                  node,
                  scene: 'replace',
                  title: '替换当前节点',
                }),
              }}
              trigger={['click']}
            >
              <div className={classNames(styles.toolBarBtn)}>
                <Tooltip title="替换当前节点">
                  <EditOutlined />
                </Tooltip>
              </div>
            </Dropdown>
          }
          <div className={styles.verticalLine} />
          {
            <div
              className={classNames(styles.toolBarBtn, styles.deleteNode)}
              onClick={onDelete}
            >
              <Tooltip title="删除节点">
                <DeleteOutlined />
              </Tooltip>
            </div>
          }
        </div>
      )}
      {toolbar.collapse && (
        <div
          className={classNames(
            styles.bottomToolBar,
            'liteflow-bottom-tool-bar',
          )}
        >
          <div
            className={classNames(styles.toolBarBtn, styles.collapseNode)}
            onClick={onCollapse}
          >
            <Tooltip title={collapsed ? '展开节点' : '折叠节点'}>
              {collapsed ? <PlusSquareOutlined /> : <MinusSquareOutlined />}
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeToolBar;
