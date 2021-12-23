import React from 'react';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';

import { service } from '@/configs';
import EditableTable from './EditableTable';

let dragingIndex = -1;

function BodyRow(props) {
  const { isOver, connectDragSource, connectDropTarget, moveRow, ...restProps } = props;
  const style = { ...restProps.style, cursor: 'move' };

  let { className } = restProps;
  if (isOver) {
    if (restProps.index > dragingIndex) {
      className += ' drop-over-downward';
    }
    if (restProps.index < dragingIndex) {
      className += ' drop-over-upward';
    }
  }

  return connectDragSource(connectDropTarget(<tr {...restProps} className={className} style={style} />));
}

const rowSource = {
  beginDrag(props) {
    dragingIndex = props.index;
    return {
      index: props.index
    };
  }
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return null;
    }
    props.moveRow(dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
    return null;
  }
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))(
  DragSource('row', rowSource, connect => ({
    connectDragSource: connect.dragSource()
  }))(BodyRow)
);

class DragSortingTable extends React.Component {
  components = {
    body: {
      row: DragableBodyRow
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: []
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (service.getValue(props, 'columns', []).length !== state.columns.length) {
      return {
        columns: service.getValue(props, 'columns', []),
        data: service.getValue(props, 'dataSource', [])
      };
    }

    if (service.getValue(props, 'dataSource', []).length !== state.data.length) {
      return {
        data: service.getValue(props, 'dataSource', [])
      };
    }

    return null;
  }

  moveRow = (dragIndex, hoverIndex) => {
    const { data } = this.state;
    const dragRow = data[dragIndex];
    const targetRow = data[hoverIndex];

    if (dragRow.inqOrd) {
      dragRow['inqOrd'] = hoverIndex + 1;
      targetRow['inqOrd'] = dragIndex + 1;
    }

    this.setState(state => {
      return update(state, {
        data: {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow]
          ]
        }
      });
    });
  };

  render() {
    return (
      <DndProvider backend={HTML5Backend}>
        <EditableTable
          components={this.components}
          columns={this.props.columns}
          dataSource={this.state.data}
          onEvents={this.props.onEvents}
          addRemove={this.props.addRemove}
          inputType="text"
          modeControll
          scroll={this.props.scroll || null}
          handler={this.props.handler}
          onRow={(record, index) => ({
            index,
            moveRow: this.moveRow
          })}
        />
      </DndProvider>
    );
  }
}

export default DragSortingTable;
