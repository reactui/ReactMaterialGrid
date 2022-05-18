import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { TableHead, TableRow, TableCell, TableSortLabel, Checkbox, Tooltip } from "@mui/material"
import withStyles, { CSSProperties } from "@material-ui/core/styles/withStyles";
import { Draggable } from "react-beautiful-dnd";
import * as CommonValues from "../utils/common-values";
import equal from "fast-deep-equal";

interface IHeaderState {
  lastAdditionalWidth: any
  lastX: number,
  resizingColumnDef: any
}
interface IHeaderProps {
  onColumnResized: any
  onOrderChange: any
  onAllSelected: any
  scrollWidth: number
  headerStyle: CSSProperties | undefined
  options: any
  columns: []
  draggable: boolean
  sorting: boolean
  icons: any
  orderBy: string
  orderDirection: 'asc' | 'desc'
  thirdSortClick : boolean
  classes: any
  theme: any
  localization: any
  treeDataMaxLevel: number
  selectedCount: number
  dataCount: number
  showSelectAllCheckbox: boolean
  hasSelection: boolean
  showActionsColumn: boolean
  actionsHeaderIndex: number
  hasDetailPanel: boolean
  detailPanelColumnAlignment: any
  isTreeData: boolean
}

const MTableHeader = (props : IHeaderProps) :JSX.Element => {
  
    const [state, setState] = useState<IHeaderState>( {
      lastAdditionalWidth: undefined,
      lastX: 0,
      resizingColumnDef: undefined,
    });

    useEffect(() => {
      console.log('will mount');
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        console.log('will unmount');
      }
    }, []);  

  const handleMouseDown = (e, columnDef) => {
    setState({
      lastAdditionalWidth: columnDef.tableData.additionalWidth,
      lastX: e.clientX,
      resizingColumnDef: columnDef,
    });
  };

  const handleMouseMove = (e) => {
    if (!state.resizingColumnDef) {
      return;
    }

    let additionalWidth = state.lastAdditionalWidth + e.clientX - state.lastX;
    additionalWidth = Math.min(state.resizingColumnDef.maxWidth || additionalWidth, additionalWidth);

    if (state.resizingColumnDef.tableData.additionalWidth !== additionalWidth) {
      props.onColumnResized(state.resizingColumnDef.tableData.id, additionalWidth);
    }
  };

  const handleMouseUp = (e) => {
    setState({ ...state, resizingColumnDef: undefined });
  };

  const getCellStyle = (columnDef) => {
    const width = CommonValues.reducePercentsInCalc(
      columnDef.tableData.width,
      props.scrollWidth
    );

    const style = {
      ...props.headerStyle,
      ...columnDef.headerStyle,
      boxSizing: "border-box",
      width,
      maxWidth: columnDef.maxWidth,
      minWidth: columnDef.minWidth,
    };

    if (props.options.tableLayout === "fixed" &&
        props.options.columnResizable &&
        columnDef.resizable !== false) {
      style.paddingRight = 2;
    }

    return style;
  };

  const renderHeader = () => {
    const size = props.options.padding === "default" ? "medium" : "small";

    const mapArr = props.columns
      .filter(
        (columnDef: any) =>
          !columnDef.hidden && !(columnDef.tableData.groupOrder > -1)
      )
      .sort((a:any, b:any) => a.tableData.columnOrder - b.tableData.columnOrder)
      .map((columnDef:any, index) => {
        let content = columnDef.title;

        if (props.draggable) {
          content = (
            <Draggable
              key={columnDef.tableData.id}
              draggableId={columnDef.tableData.id.toString()}
              index={index}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  {columnDef.title}
                </div>
              )}
            </Draggable>
          );
        }

        if (columnDef.sorting !== false && props.sorting) {
          content = (
            <TableSortLabel
              IconComponent={props.icons.SortArrow}
              active={props.orderBy === columnDef.tableData.id}
              direction={props.orderDirection || "asc"}
              onClick={() => {
                const orderDirection =
                  columnDef.tableData.id !== props.orderBy
                    ? "asc"
                    : props.orderDirection === "asc"
                    ? "desc"
                    : props.orderDirection === "desc" &&
                      props.thirdSortClick
                    ? ""
                    : props.orderDirection === "desc" &&
                      !props.thirdSortClick
                    ? "asc"
                    : 'asc';
                props.onOrderChange(
                  columnDef.tableData.id,
                  orderDirection
                );
              }}
            >
              {content}
            </TableSortLabel>
          );
        }

        if (columnDef.tooltip) {
          content = (
            <Tooltip title={columnDef.tooltip} placement="bottom">
              <span>{content}</span>
            </Tooltip>
          );
        }

        if (
          props.options.tableLayout === "fixed" &&
          props.options.columnResizable &&
          columnDef.resizable !== false
        ) {
          content = (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1 }}>{content}</div>
              <div></div>
              <props.icons.Resize
                style={{
                  cursor: "col-resize",
                  color:
                    state.resizingColumnDef &&
                    state.resizingColumnDef.tableData.id ===
                      columnDef.tableData.id
                      ? props.theme.palette.primary.main
                      : "inherit",
                }}
                onMouseDown={(e) => handleMouseDown(e, columnDef)}
              />
            </div>
          );
        }

        const cellAlignment =
          columnDef.align !== undefined
            ? columnDef.align
            : ["numeric", "currency"].indexOf(columnDef.type) !== -1
            ? "right"
            : "left";
        return (
          <TableCell
            key={columnDef.tableData.id}
            align={cellAlignment}
            className={props.classes.header}
            style={getCellStyle(columnDef)}
            size={size}
          >
            {content}
          </TableCell>
        );
      });
    return mapArr;
  }

  const renderActionsHeader = () => {
    const localization = {
      ...MTableHeader.defaultProps.localization,
      ...props.localization,
    };
    const width = CommonValues.actionsColumnWidth(props);
    return (
      <TableCell
        key="key-actions-column"
        padding="checkbox"
        className={props.classes.header}
        style={{
          ...props.headerStyle,
          width: width,
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        <TableSortLabel hideSortIcon={true} disabled>
          {localization.actions}
        </TableSortLabel>
      </TableCell>
    );
  }
  
  const renderSelectionHeader = () => {
    const selectionWidth = CommonValues.selectionMaxWidth(
      props,
      props.treeDataMaxLevel
    );

    return (
      <TableCell
        padding="none"
        key="key-selection-column"
        className={props.classes.header}
        style={{ ...props.headerStyle, width: selectionWidth }}
      >
        {props.showSelectAllCheckbox && (
          <Checkbox
            indeterminate={
              props.selectedCount > 0 &&
              props.selectedCount < props.dataCount
            }
            checked={
              props.dataCount > 0 &&
              props.selectedCount === props.dataCount
            }
            onChange={(event, checked) =>
              props.onAllSelected && props.onAllSelected(checked)
            }
            {...props.options.headerSelectionProps}
          />
        )}
      </TableCell>
    );
  }

  const renderDetailPanelColumnCell = () => {
    return (
      <TableCell
        padding="none"
        key="key-detail-panel-column"
        className={props.classes.header}
        style={{ ...props.headerStyle }}
      />
    );
  }

  const render = () => {
    const headers = renderHeader();
    if (props.hasSelection) {
      headers.splice(0, 0, renderSelectionHeader());
    }

    if (props.showActionsColumn) {
      if (props.actionsHeaderIndex >= 0) {
        let endPos = 0;
        if (props.hasSelection) {
          endPos = 1;
        }
        headers.splice(
          props.actionsHeaderIndex + endPos,
          0,
          renderActionsHeader()
        );
      } else if (props.actionsHeaderIndex === -1) {
        headers.push(renderActionsHeader());
      }
    }

    if (props.hasDetailPanel) {
      if (props.detailPanelColumnAlignment === "right") {
        headers.push(renderDetailPanelColumnCell());
      } else {
        headers.splice(0, 0, renderDetailPanelColumnCell());
      }
    }

    // TODO: props.isTreeData > 0 (?)
    if (props.isTreeData) {
      headers.splice(
        0,
        0,
        <TableCell
          padding="none"
          key={"key-tree-data-header"}
          className={props.classes.header}
          style={{ ...props.headerStyle }}
        />
      );
    }

    props.columns
      .filter((columnDef:any) => columnDef.tableData.groupOrder > -1)
      .forEach((columnDef:any) => {
        headers.splice(
          0,
          0,
          <TableCell
            padding="checkbox"
            key={"key-group-header" + columnDef.tableData.id}
            className={props.classes.header}
          />
        );
      });

    return (
      <TableHead>
        <TableRow>{headers}</TableRow>
      </TableHead>
    );
  }

  return (
    <>
    {render()}
    </>
  )
}

MTableHeader.defaultProps = {
  dataCount: 0,
  hasSelection: false,
  headerStyle: {},
  selectedCount: 0,
  sorting: true,
  localization: {
    actions: "Actions",
  },
  orderBy: undefined,
  orderDirection: "asc",
  actionsHeaderIndex: 0,
  detailPanelColumnAlignment: "left",
  draggable: true,
  thirdSortClick: true,
};

MTableHeader.propTypes = {
  columns: PropTypes.array.isRequired,
  dataCount: PropTypes.number,
  hasDetailPanel: PropTypes.bool.isRequired,
  detailPanelColumnAlignment: PropTypes.string,
  hasSelection: PropTypes.bool,
  headerStyle: PropTypes.object,
  localization: PropTypes.object,
  selectedCount: PropTypes.number,
  sorting: PropTypes.bool,
  onAllSelected: PropTypes.func,
  onOrderChange: PropTypes.func,
  orderBy: PropTypes.number,
  orderDirection: PropTypes.string,
  actionsHeaderIndex: PropTypes.number,
  showActionsColumn: PropTypes.bool,
  showSelectAllCheckbox: PropTypes.bool,
  draggable: PropTypes.bool,
  thirdSortClick: PropTypes.bool,
  tooltip: PropTypes.string,
};

export const styles = (theme) => ({
  header: {
    // display: 'inline-block',
    position: "sticky",
    top: 0,
    zIndex: 10,
    backgroundColor: theme.palette.background.paper, // Change according to theme,
  },
});

// @ts-ignore
export default withStyles(styles, { withTheme: true })(MTableHeader);
