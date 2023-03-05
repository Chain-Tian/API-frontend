import {PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns, ProDescriptionsItemProps} from '@ant-design/pro-components';
import {FooterToolbar, PageContainer, ProDescriptions, ProTable,} from '@ant-design/pro-components';
import {FormattedMessage, useIntl} from '@umijs/max';
import {Button, Drawer, message} from 'antd';
import React, {useRef, useState} from 'react';
import {
  addInterfaceInfoUsingPOST,
  deleteInterfaceInfoUsingPOST,
  listInterfaceInfoByPageUsingGET,
  offlineInterfaceInfoUsingPOST,
  onlineInterfaceInfoUsingPOST,
  updateInterfaceInfoUsingPOST
} from "@/services/API-backend/interfaceInfoController";
import {SortOrder} from "antd/es/table/interface";
import {Params} from "react-router";
import CreateModal from "@/pages/Admin/InterfaceInfo/components/CreateModal";
import UpdateModal from "@/pages/Admin/InterfaceInfo/components/UpdateModal";


/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */




const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.InterfaceInfo[]>([]);



  /**
   * @en-US Add node
   * @zh-CN 添加节点
   * @param fields
   */
  const handleAdd = async (fields: API.InterfaceInfo) => {
    const hide = message.loading('正在添加');
    try {
      await addInterfaceInfoUsingPOST({...fields});
      hide();
      message.success('创建成功');
      handleUpdateModalOpen(false)
      return true;
    } catch (error: any) {
      hide();
      message.error('创建失败' + error.message);
      return false;
    }
  };
  /**
   *  发布接口
   *
   * @param record
   */
  const handleOffline = async (record: API.IdRequest) => {
    const hide = message.loading('下线中');
    if (!record) return true;
    try {
      await offlineInterfaceInfoUsingPOST({
        id: record.id
      });
      hide();
      message.success('操作成功');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('操作失败, ' + error.message);
      return false;
    }
  };

  /**
   *  发布接口
   *
   * @param record
   */
  const handleOnline = async (record: API.IdRequest) => {
    const hide = message.loading('发布中');
    if (!record) return true;
    try {
      await onlineInterfaceInfoUsingPOST({
        id: record.id
      });
      hide();
      message.success('操作成功');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('操作失败, ' + error.message);
      return false;
    }
  };

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param record
   */
  const handleRemove = async (record: API.InterfaceInfo) => {
    const hide = message.loading('正在删除');
    if (!record) return true;
    try {
      await deleteInterfaceInfoUsingPOST({
        id: record.id
      });
      hide();
      message.success('删除成功');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('删除失败, ' + error.message);
      return false;
    }
  };

  /**
   * 处理 更新
   * @param fields
   */
  const handleUpdate = async (fields: API.InterfaceInfo) => {
    if(!currentRow){
      return;
    }
    const hide = message.loading('Configuring');
    try {
      await updateInterfaceInfoUsingPOST({
        id: currentRow.id,
        ...fields
      });
      hide();
      message.success('操作成功');
      return true;
    } catch (error: any) {
      hide();
      message.error('操作失败, ' + error.message);
      return false;
    }
  };

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();


  const columns: ProColumns<API.InterfaceInfo>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.updateForm.ruleName.nameLabel"
          defaultMessage="接口名称"
        />
      ),
      dataIndex: 'name',
      valueType: 'text',
      formItemProps: {
        rules: [{
          required: true
        }]
      }
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      valueType: 'text',
    },
    {
      title: '请求头',
      dataIndex: 'requestHeader',
      valueType: 'jsonCode',
    },
    {
      title: '响应头',
      dataIndex: 'responseHeader',
      valueType: 'jsonCode',
    },
    {
      title: 'url',
      dataIndex: 'url',
      valueType: 'text',
    },
    {
      title: '请求参数',
      dataIndex: 'requestParams',
      valueType: 'jsonCode'
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Default',
        },
        1: {
          text: '开启',
          status: 'Processing',
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'update_time',
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.titleUpdatedAt"
          defaultMessage="更新时间"
        />
      ),
      sorter: true,
      dataIndex: 'update_time',
      valueType: 'dateTime',
      hideInForm: true,
      // renderFormItem: (item, {defaultRender, ...rest}, form) => {
      //   const status = form.getFieldValue('status');
      //   if (`${status}` === '0') {
      //     return false;
      //   }
      //   if (`${status}` === '3') {
      //     return (
      //       <Input
      //         {...rest}
      //         placeholder={intl.formatMessage({
      //           id: 'pages.searchTable.exception',
      //           defaultMessage: 'Please enter the reason for the exception!',
      //         })}
      //       />
      //     );
      //   }
      //   return defaultRender(item);
      // },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作"/>,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.searchTable.config" defaultMessage="修改"/>
        </a>,
        <Button
          type="text"
          danger
          key="config"
          onClick={() => {
            handleRemove(record)
          }}
        >
          <FormattedMessage id="pages.searchTable.config" defaultMessage="删除"/>
        </Button>,

        // 上线按钮
        record.status === 0 ? <a
          key="config"
          onClick={() => {
            handleOnline(record)
          }}
        >
          <FormattedMessage id="pages.searchTable.config" defaultMessage="发布"/>
        </a> : null,

        // 下线按钮
        record.status === 1 ? <Button
          type="text"
          danger
          key="config"
          onClick={() => {
            handleOffline(record)
          }}
        >
          <FormattedMessage id="pages.searchTable.config" defaultMessage="下线"/>
        </Button> : null,
      ],
    },
  ];


  return (
    <PageContainer>
      <ProTable<API.InterfaceInfo, API.PageInterfaceInfo>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined/> <FormattedMessage id="pages.searchTable.new" defaultMessage="新建"/>
          </Button>,
        ]}
        // @ts-ignore
        request={async (params: Params & {
          pageSize?: number;
          current?: number;
          keyword?: string;
        }, sort: Record<string, SortOrder>, filter: Record<string, React.ReactText[] | null>) => {
          const res: any = await listInterfaceInfoByPageUsingGET({
            ...params
          })
          if (res?.data) {
            return {
              data: res?.data.records || [],
              success: true,
              total: res?.data.total || 0,
            }
          } else {
            return {
              data: [],
              success: false,
              total: 0,
            }
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen"/>{' '}
              <a style={{fontWeight: 600}}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项"/>
              &nbsp;&nbsp;
              <span>
          <FormattedMessage
            id="pages.searchTable.totalServiceCalls"
            defaultMessage="Total number of service calls"
          />{' '}
                {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)}{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万"/>
          </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button>
        </FooterToolbar>
      )}
      <UpdateModal
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        visible={updateModalOpen}
        values={currentRow || {}}
        columns={columns}
      />


      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.InterfaceInfo>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.InterfaceInfo>[]}
          />
        )}
      </Drawer>
      <CreateModal columns={columns} onCancel={() => {
        handleModalOpen(false)
      }} onSubmit={(values) => {
        handleAdd(values)
      }} visible={createModalOpen}/>
    </PageContainer>
  );
};

export default TableList;
