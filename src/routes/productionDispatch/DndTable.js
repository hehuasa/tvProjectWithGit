import React, { Component } from 'react';
import { Pagination, Spin } from 'antd';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import classnames from 'classnames';
import styles from './index.less';

class DndTable extends Component {
  render() {
    const { columns, dataSource, rowKey, onDragEnd, draggableId, dragIndex, pagination, handlePageChange, sorting } = this.props;
    return (
      <DragDropContext
        onDragEnd={onDragEnd}
      >
        <Spin spinning={sorting}>
          <div
            className={classnames('ant-table', 'ant-table-default', 'ant-table-scroll-position-left', 'ant-table-scroll-position-right')}
          >
            <div
              className="ant-table-content"
            >
              <div
                className="ant-table-body"
              >
                <table>
                  <thead
                    className="ant-table-thead"
                  >
                    <tr>
                      { columns.map(item => (
                        <th key={item.dataIndex} width={item.width}>
                            {item.title}
                          </th>
                    ))}
                    </tr>
                  </thead>
                  <Droppable droppableId="droppable" type="focus" >
                    {(droppableProvided) => (
                      <tbody
                        ref={droppableProvided.innerRef}
                        {...droppableProvided.droppableProps}
                        className="ant-table-tbody"
                      >
                        { dataSource.map((item, index) => {
                        return (
                          <Draggable key={item[rowKey]} draggableId={item[draggableId]} index={index} type="focus" >
                            {(DraggableProvided, DraggableStateSnapshot) => {
                            const { red } = styles;
                            return (
                              <tr
                                className={classnames({
                                  dragging: DraggableStateSnapshot.isDragging,
                                  [red]: DraggableStateSnapshot.isDragging,
                                  'ant-table-row': true,
                                  'ant-table-row-level-0': true,
                                })}
                                ref={DraggableProvided.innerRef}
                                {...DraggableProvided.draggableProps}
                                {...DraggableProvided.dragHandleProps}
                              >
                                { columns.map((item1) => (
                                  <td key={item1.dataIndex} width={item1.width}>
                                    {item1.render ? item1.render(item[item1.dataIndex], item) : item[item1.dataIndex]}
                                  </td>
                                ))}
                              </tr>
                            );
                          }}
                          </Draggable>
                      );
})}
                        {droppableProvided.placeholder}
                      </tbody>
                    )}
                  </Droppable>
                </table>
              </div>
            </div>
            <div className={styles.page}>
              <Pagination showSizeChanger showQuickJumper current={pagination.current} pageSize={pagination.pageSize} total={pagination.total} pageSizeOptions={['5', '10', '20', '50']} onShowSizeChange={(pageNum, pageSize) => handlePageChange({ pageNum, pageSize })} onChange={(pageNum, pageSize) => handlePageChange({ pageNum, pageSize })} />
            </div>
          </div>
        </Spin>
      </DragDropContext>
    );
  }
}
export { DndTable };
