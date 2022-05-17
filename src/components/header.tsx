import { TableHead, TableRow, TableCell, TableSortLabel, Checkbox, Tooltip } from "@mui/material"
import { useEffect, useState, useRef } from "react";
import { Draggable } from "react-beautiful-dnd";
import { reducePercentsInCalc, actionsColumnWidth, selectionMaxWidth } from "../utils/common-values"

function MTableHeader(props: any) {
  const {
    hasDetailPanel,
    detailPanelColumnAlignment,
    isTreeData,
    actionHeaderIndex,
    showActionsColumn,
    scrollWidth,
    hasSelection,
    headerStyle,
    columns,
    draggable,
    sorting,
    icons,
    options,
    orderBy,
    orderDirection,
    thirdSortClick,
    theme,
    classes,
    localization,
    treeDataMaxLevel,
    showSelectAllCheckbox,
    selectedCount,
    dataCount,
    onColumnResized,
    onOrderChange,
    onAllSelected,
  } = props;

  const [lastX, setLastX] = useState(0);

  // Needs to use reference because document.events are not handled by React lifecycle
  const [lastAdditionalWidth, _setLastAdditionalWidth] = useState(0);
  const lastAdditionalWidthRef = useRef(lastAdditionalWidth);
  const setLastAdditionalWidth = (data: any) => {
    lastAdditionalWidthRef.current = data;
    _setLastAdditionalWidth(data);
  };

  interface IResizing {
    resizingColumnDef: any;
  }

  // Needs to use reference because document.events are not handled by React lifecycle
  const [resizingColumnDef, _setResizingColumnDef] = useState(undefined);
  const resizingColumnDefRef = useRef(resizingColumnDef);
  const setResizingColumnDef = (data: any) => {
    resizingColumnDefRef.current = data;
    _setResizingColumnDef(data);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e: any, columnDef: any) => {
    setLastAdditionalWidth(columnDef.tableData.additionalWidth);
    setLastX(e.clientX);
    setResizingColumnDef(columnDef);
  };

  const handleMouseMove = (e: any) => {
    let resizingColumnDef: any = resizingColumnDefRef.current;
    let lastAdditionalWidth: number = lastAdditionalWidthRef.current;

    if (!resizingColumnDef) {
      return;
    }

    let additionalWidth = lastAdditionalWidth + e.clientX - lastX;

    additionalWidth = Math.min(
      resizingColumnDef.maxWidth || additionalWidth,
      additionalWidth
    );

    if (resizingColumnDef.tableData.additionalWidth !== additionalWidth) {
      onColumnResized(resizingColumnDef.tableData.id, additionalWidth);
    }
  };

  const handleMouseUp = (e: any) => {
    setResizingColumnDef(undefined);
  };

  const getCellStyle = (columnDef: any) => {
    const width = reducePercentsInCalc(
      columnDef.tableData.width,
      scrollWidth
    );

    const style = {
      ...headerStyle,
      ...columnDef.headerStyle,
      boxSizing: "border-box",
      width,
      maxWidth: columnDef.maxWidth,
      minWidth: columnDef.minWidth,
    };

    if (
      options.tableLayout === "fixed" &&
      options.columnResizable &&
      columnDef.resizable !== false
    ) {
      style.paddingRight = 2;
    }

    return style;
  };

  const renderHeader = () => {
    const size = options.padding === "default" ? "medium" : "small";

    const mapArr = columns
      .filter(
        (columnDef: any) =>
          !columnDef.hidden && !(columnDef.tableData.groupOrder > -1)
      )
      .sort(
        (a: any, b: any) => a.tableData.columnOrder - b.tableData.columnOrder
      )
      .map((columnDef: any, index: number) => {
        let content = columnDef.title;

        if (draggable) {
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

        if (columnDef.sorting !== false && sorting) {
          content = (
            <TableSortLabel
              IconComponent={icons.SortArrow}
              active={orderBy === columnDef.tableData.id}
              direction={orderDirection || "asc"}
              onClick={() => {
                let orderDirection: any;
                orderDirection =
                  columnDef.tableData.id !== orderBy
                    ? "asc"
                    : orderDirection === "asc"
                    ? "desc"
                    : orderDirection === "desc" && thirdSortClick
                    ? ""
                    : orderDirection === "desc" && !thirdSortClick
                    ? "asc"
                    : orderDirection === ""
                    ? "asc"
                    : "desc";
                onOrderChange(columnDef.tableData.id, orderDirection);
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
          options.tableLayout === "fixed" &&
          options.columnResizable &&
          columnDef.resizable !== false
        ) {
          content = (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1 }}>{content}</div>
              <div></div>
              <icons.Resize
                style={{
                  cursor: "col-resize",
                  color: "inherit",
                  // resizingColumnDef &&
                  //   resizingColumnDef.tableData.id ===
                  //   columnDef.tableData.id
                  //   ? theme.palette.primary.main
                  //   : "inherit",
                }}
                onMouseDown={(e: any) => handleMouseDown(e, columnDef)}
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
            //className={classes.header}
            style={getCellStyle(columnDef)}
            size={size}
          >
            {content}
          </TableCell>
        );
      });
    return mapArr;
  };

  const renderActionsHeader = () => {
    const localizationCopy = {
      ...defaultProps.localization,
      ...localization,
    };
    const width = actionsColumnWidth(props);
    return (
      <TableCell
        key="key-actions-column"
        padding="checkbox"
        className={classes.header}
        style={{
          ...headerStyle,
          width: width,
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        <TableSortLabel hideSortIcon={true} disabled>
          {localizationCopy.actions}
        </TableSortLabel>
      </TableCell>
    );
  };

  const renderSelectionHeader = () => {
    const selectionWidth = selectionMaxWidth(
      props,
      treeDataMaxLevel
    );

    return (
      <TableCell
        padding="none"
        key="key-selection-column"
        className={classes.header}
        style={{ ...headerStyle, width: selectionWidth }}
      >
        {showSelectAllCheckbox && (
          <Checkbox
            indeterminate={selectedCount > 0 && selectedCount < dataCount}
            checked={dataCount > 0 && selectedCount === dataCount}
            onChange={(event, checked) =>
              onAllSelected && onAllSelected(checked)
            }
            {...options.headerSelectionProps}
          />
        )}
      </TableCell>
    );
  };

  const renderDetailPanelColumnCell = () => {
    return (
      <TableCell
        padding="none"
        key="key-detail-panel-column"
        //className={classes.header}
        style={{ ...headerStyle }}
      />
    );
  };

  const doRender = () => {
    const headers = renderHeader();
    if (hasSelection) {
      headers.splice(0, 0, renderSelectionHeader());
    }

    if (showActionsColumn) {
      if (actionHeaderIndex >= 0) {
        let endPos = 0;
        if (hasSelection) {
          endPos = 1;
        }
        headers.splice(actionHeaderIndex + endPos, 0, renderActionsHeader());
      } else if (actionHeaderIndex === -1) {
        headers.push(renderActionsHeader());
      }
    }

    if (hasDetailPanel) {
      if (detailPanelColumnAlignment === "right") {
        headers.push(renderDetailPanelColumnCell());
      } else {
        headers.splice(0, 0, renderDetailPanelColumnCell());
      }
    }

    if (isTreeData > 0) {
      headers.splice(
        0,
        0,
        <TableCell
          padding="none"
          key={"key-tree-data-header"}
          className={classes.header}
          style={{ ...headerStyle }}
        />
      );
    }

    columns
      .filter((columnDef: any) => columnDef.tableData.groupOrder > -1)
      .forEach((columnDef: any) => {
        headers.splice(
          0,
          0,
          <TableCell
            padding="checkbox"
            key={"key-group-header" + columnDef.tableData.id}
            className={classes.header}
          />
        );
      });

    return (
      <>
        <TableHead>
          <TableRow>{headers}</TableRow>
        </TableHead>
      </>
    );
  };

  return <>{doRender()}</>;
}

const defaultProps = {
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

export const styles = (theme: any) => ({
  header: {
    // display: 'inline-block',
    position: "sticky",
    top: 0,
    zIndex: 10,
    backgroundColor: theme.palette.background.paper, // Change according to theme,
  },
});

// @ts-ignore
//export default withStyles(styles, { withTheme: true })(MTableHeader);

export default MTableHeader;
