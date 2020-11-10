/* eslint-disable no-unused-vars */
import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Checkbox from "@material-ui/core/Checkbox";
import withStyles from "@material-ui/core/styles/withStyles";
import { Draggable } from "react-beautiful-dnd";
import { Tooltip } from "@material-ui/core";
import * as CommonValues from "../utils/common-values";
import equal from "fast-deep-equal";

/* eslint-enable no-unused-vars */
const MTableHeader = props => {

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
    onAllSelected
  } = props;

  
  const [lastX, setLastX] = useState(0);

  // Needs to use reference because document.events are not handled by React lifecycle
  const [lastAdditionalWidth, _setLastAdditionalWidth] = useState(0);
  const lastAdditionalWidthRef = useRef(lastAdditionalWidth);
  const setLastAdditionalWidth = data =>
  {
    lastAdditionalWidthRef.current = data;
    _setLastAdditionalWidth(data);
  }  
  
  // Needs to use reference because document.events are not handled by React lifecycle
  const [resizingColumnDef, _setResizingColumnDef] = useState(undefined);
  const resizingColumnDefRef = useRef(resizingColumnDef);
  const setResizingColumnDef = data =>
  {
    resizingColumnDefRef.current = data;
    _setResizingColumnDef(data);
  }  

  useEffect(() => {
    console.log('will mount');
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", this.handleMouseMove);
      document.removeEventListener("mouseup", this.handleMouseUp);
      console.log('will unmount');
    }
  }, []);  

  const handleMouseDown = (e, columnDef) => {
    setLastAdditionalWidth(columnDef.tableData.additionalWidth);
    setLastX(e.clientX);
    setResizingColumnDef(columnDef);
  };

  const handleMouseMove = (e) => {  
    let resizingColumnDef = resizingColumnDefRef.current;
    let lastAdditionalWidth = lastAdditionalWidthRef.current;
    
    //console.log(resizingColumnDef, lastAdditionalWidth)
    
    if (!resizingColumnDef) {
      return;
    }

    let additionalWidth = lastAdditionalWidth + e.clientX - lastX;
    

    additionalWidth = Math.min(
      resizingColumnDef.maxWidth || additionalWidth,
      additionalWidth
    );

    console.log(resizingColumnDef.tableData.additionalWidth);

    if (resizingColumnDef.tableData.additionalWidth !== additionalWidth) {
      onColumnResized(
        resizingColumnDef.tableData.id,
        additionalWidth
      );
    }
  };

  const handleMouseUp = (e) => {
    setResizingColumnDef(undefined);
  };

  const getCellStyle = (columnDef) => {
    const width = CommonValues.reducePercentsInCalc(
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
        (columnDef) =>
          !columnDef.hidden && !(columnDef.tableData.groupOrder > -1)
      )
      .sort((a, b) => a.tableData.columnOrder - b.tableData.columnOrder)
      .map((columnDef, index) => {
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
                const orderDirection =
                  columnDef.tableData.id !== orderBy
                    ? "asc"
                    : orderDirection === "asc"
                      ? "desc"
                      : orderDirection === "desc" &&
                        thirdSortClick
                        ? ""
                        : orderDirection === "desc" &&
                          !thirdSortClick
                          ? "asc"
                          : orderDirection === ""
                            ? "asc"
                            : "desc";
                onOrderChange(
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
                  color:
                    resizingColumnDef &&
                      resizingColumnDef.tableData.id ===
                      columnDef.tableData.id
                      ? theme.palette.primary.main
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
            className={classes.header}
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
    const localizationCopy = {
      ...MTableHeader.defaultProps.localization,
      ...localization,
    };
    const width = CommonValues.actionsColumnWidth(props);
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
  }

  const renderSelectionHeader = () => {
    const selectionWidth = CommonValues.selectionMaxWidth(
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
            indeterminate={
              selectedCount > 0 &&
              selectedCount < dataCount
            }
            checked={
              dataCount > 0 &&
              selectedCount === dataCount
            }
            onChange={(event, checked) =>
              onAllSelected && onAllSelected(checked)
            }
            {...options.headerSelectionProps}
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
        className={classes.header}
        style={{ ...headerStyle }}
      />
    );
  }

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
        headers.splice(
          actionsHeaderIndex + endPos,
          0,
          renderActionsHeader()
        );
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
      .filter((columnDef) => columnDef.tableData.groupOrder > -1)
      .forEach((columnDef) => {
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
  }

  return (
    <>
    {doRender} 
    </>  
  );
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


// export class MTableHeader extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       lastX: 0,
//       resizingColumnDef: undefined,
//     };
//   }

//   // shouldComponentUpdate(nextProps, nextState){
//   //   return !equal(nextProps, this.props) || !equal(nextState, this.state);
//   // }

//   componentDidMount() {
//     document.addEventListener("mousemove", this.handleMouseMove);
//     document.addEventListener("mouseup", this.handleMouseUp);
//   }

//   componentWillUnmount() {
//     document.removeEventListener("mousemove", this.handleMouseMove);
//     document.removeEventListener("mouseup", this.handleMouseUp);
//   }

//   handleMouseDown = (e, columnDef) => {
//     this.setState({
//       lastAdditionalWidth: columnDef.tableData.additionalWidth,
//       lastX: e.clientX,
//       resizingColumnDef: columnDef,
//     });
//   };

//   handleMouseMove = (e) => {
//     if (!this.state.resizingColumnDef) {
//       return;
//     }

//     let additionalWidth =
//       this.state.lastAdditionalWidth + e.clientX - this.state.lastX;

//     additionalWidth = Math.min(
//       this.state.resizingColumnDef.maxWidth || additionalWidth,
//       additionalWidth
//     );

//     if (
//       this.state.resizingColumnDef.tableData.additionalWidth !== additionalWidth
//     ) {
//       this.props.onColumnResized(
//         this.state.resizingColumnDef.tableData.id,
//         additionalWidth
//       );
//     }
//   };

//   handleMouseUp = (e) => {
//     this.setState({ resizingColumnDef: undefined });
//   };

//   getCellStyle = (columnDef) => {
//     const width = CommonValues.reducePercentsInCalc(
//       columnDef.tableData.width,
//       this.props.scrollWidth
//     );

//     const style = {
//       ...this.props.headerStyle,
//       ...columnDef.headerStyle,
//       boxSizing: "border-box",
//       width,
//       maxWidth: columnDef.maxWidth,
//       minWidth: columnDef.minWidth,
//     };

//     if (
//       this.props.options.tableLayout === "fixed" &&
//       this.props.options.columnResizable &&
//       columnDef.resizable !== false
//     ) {
//       style.paddingRight = 2;
//     }

//     return style;
//   };

//   renderHeader() {
//     const size = this.props.options.padding === "default" ? "medium" : "small";

//     const mapArr = this.props.columns
//       .filter(
//         (columnDef) =>
//           !columnDef.hidden && !(columnDef.tableData.groupOrder > -1)
//       )
//       .sort((a, b) => a.tableData.columnOrder - b.tableData.columnOrder)
//       .map((columnDef, index) => {
//         let content = columnDef.title;

//         if (this.props.draggable) {
//           content = (
//             <Draggable
//               key={columnDef.tableData.id}
//               draggableId={columnDef.tableData.id.toString()}
//               index={index}
//             >
//               {(provided, snapshot) => (
//                 <div
//                   ref={provided.innerRef}
//                   {...provided.draggableProps}
//                   {...provided.dragHandleProps}
//                 >
//                   {columnDef.title}
//                 </div>
//               )}
//             </Draggable>
//           );
//         }

//         if (columnDef.sorting !== false && this.props.sorting) {
//           content = (
//             <TableSortLabel
//               IconComponent={this.props.icons.SortArrow}
//               active={this.props.orderBy === columnDef.tableData.id}
//               direction={this.props.orderDirection || "asc"}
//               onClick={() => {
//                 const orderDirection =
//                   columnDef.tableData.id !== this.props.orderBy
//                     ? "asc"
//                     : this.props.orderDirection === "asc"
//                     ? "desc"
//                     : this.props.orderDirection === "desc" &&
//                       this.props.thirdSortClick
//                     ? ""
//                     : this.props.orderDirection === "desc" &&
//                       !this.props.thirdSortClick
//                     ? "asc"
//                     : this.props.orderDirection === ""
//                     ? "asc"
//                     : "desc";
//                 this.props.onOrderChange(
//                   columnDef.tableData.id,
//                   orderDirection
//                 );
//               }}
//             >
//               {content}
//             </TableSortLabel>
//           );
//         }

//         if (columnDef.tooltip) {
//           content = (
//             <Tooltip title={columnDef.tooltip} placement="bottom">
//               <span>{content}</span>
//             </Tooltip>
//           );
//         }

//         if (
//           this.props.options.tableLayout === "fixed" &&
//           this.props.options.columnResizable &&
//           columnDef.resizable !== false
//         ) {
//           content = (
//             <div style={{ display: "flex", alignItems: "center" }}>
//               <div style={{ flex: 1 }}>{content}</div>
//               <div></div>
//               <this.props.icons.Resize
//                 style={{
//                   cursor: "col-resize",
//                   color:
//                     this.state.resizingColumnDef &&
//                     this.state.resizingColumnDef.tableData.id ===
//                       columnDef.tableData.id
//                       ? this.props.theme.palette.primary.main
//                       : "inherit",
//                 }}
//                 onMouseDown={(e) => this.handleMouseDown(e, columnDef)}
//               />
//             </div>
//           );
//         }

//         const cellAlignment =
//           columnDef.align !== undefined
//             ? columnDef.align
//             : ["numeric", "currency"].indexOf(columnDef.type) !== -1
//             ? "right"
//             : "left";
//         return (
//           <TableCell
//             key={columnDef.tableData.id}
//             align={cellAlignment}
//             className={this.props.classes.header}
//             style={this.getCellStyle(columnDef)}
//             size={size}
//           >
//             {content}
//           </TableCell>
//         );
//       });
//     return mapArr;
//   }

//   renderActionsHeader() {
//     const localization = {
//       ...MTableHeader.defaultProps.localization,
//       ...this.props.localization,
//     };
//     const width = CommonValues.actionsColumnWidth(this.props);
//     return (
//       <TableCell
//         key="key-actions-column"
//         padding="checkbox"
//         className={this.props.classes.header}
//         style={{
//           ...this.props.headerStyle,
//           width: width,
//           textAlign: "center",
//           boxSizing: "border-box",
//         }}
//       >
//         <TableSortLabel hideSortIcon={true} disabled>
//           {localization.actions}
//         </TableSortLabel>
//       </TableCell>
//     );
//   }
//   renderSelectionHeader() {
//     const selectionWidth = CommonValues.selectionMaxWidth(
//       this.props,
//       this.props.treeDataMaxLevel
//     );

//     return (
//       <TableCell
//         padding="none"
//         key="key-selection-column"
//         className={this.props.classes.header}
//         style={{ ...this.props.headerStyle, width: selectionWidth }}
//       >
//         {this.props.showSelectAllCheckbox && (
//           <Checkbox
//             indeterminate={
//               this.props.selectedCount > 0 &&
//               this.props.selectedCount < this.props.dataCount
//             }
//             checked={
//               this.props.dataCount > 0 &&
//               this.props.selectedCount === this.props.dataCount
//             }
//             onChange={(event, checked) =>
//               this.props.onAllSelected && this.props.onAllSelected(checked)
//             }
//             {...this.props.options.headerSelectionProps}
//           />
//         )}
//       </TableCell>
//     );
//   }

//   renderDetailPanelColumnCell() {
//     return (
//       <TableCell
//         padding="none"
//         key="key-detail-panel-column"
//         className={this.props.classes.header}
//         style={{ ...this.props.headerStyle }}
//       />
//     );
//   }

//   render() {
//     const headers = this.renderHeader();
//     if (this.props.hasSelection) {
//       headers.splice(0, 0, this.renderSelectionHeader());
//     }

//     if (this.props.showActionsColumn) {
//       if (this.props.actionsHeaderIndex >= 0) {
//         let endPos = 0;
//         if (this.props.hasSelection) {
//           endPos = 1;
//         }
//         headers.splice(
//           this.props.actionsHeaderIndex + endPos,
//           0,
//           this.renderActionsHeader()
//         );
//       } else if (this.props.actionsHeaderIndex === -1) {
//         headers.push(this.renderActionsHeader());
//       }
//     }

//     if (this.props.hasDetailPanel) {
//       if (this.props.detailPanelColumnAlignment === "right") {
//         headers.push(this.renderDetailPanelColumnCell());
//       } else {
//         headers.splice(0, 0, this.renderDetailPanelColumnCell());
//       }
//     }

//     if (this.props.isTreeData > 0) {
//       headers.splice(
//         0,
//         0,
//         <TableCell
//           padding="none"
//           key={"key-tree-data-header"}
//           className={this.props.classes.header}
//           style={{ ...this.props.headerStyle }}
//         />
//       );
//     }

//     this.props.columns
//       .filter((columnDef) => columnDef.tableData.groupOrder > -1)
//       .forEach((columnDef) => {
//         headers.splice(
//           0,
//           0,
//           <TableCell
//             padding="checkbox"
//             key={"key-group-header" + columnDef.tableData.id}
//             className={this.props.classes.header}
//           />
//         );
//       });

//     return (
//       <TableHead>
//         <TableRow>{headers}</TableRow>
//       </TableHead>
//     );
//   }
// }

// MTableHeader.defaultProps = {
//   dataCount: 0,
//   hasSelection: false,
//   headerStyle: {},
//   selectedCount: 0,
//   sorting: true,
//   localization: {
//     actions: "Actions",
//   },
//   orderBy: undefined,
//   orderDirection: "asc",
//   actionsHeaderIndex: 0,
//   detailPanelColumnAlignment: "left",
//   draggable: true,
//   thirdSortClick: true,
// };

// MTableHeader.propTypes = {
//   columns: PropTypes.array.isRequired,
//   dataCount: PropTypes.number,
//   hasDetailPanel: PropTypes.bool.isRequired,
//   detailPanelColumnAlignment: PropTypes.string,
//   hasSelection: PropTypes.bool,
//   headerStyle: PropTypes.object,
//   localization: PropTypes.object,
//   selectedCount: PropTypes.number,
//   sorting: PropTypes.bool,
//   onAllSelected: PropTypes.func,
//   onOrderChange: PropTypes.func,
//   orderBy: PropTypes.number,
//   orderDirection: PropTypes.string,
//   actionsHeaderIndex: PropTypes.number,
//   showActionsColumn: PropTypes.bool,
//   showSelectAllCheckbox: PropTypes.bool,
//   draggable: PropTypes.bool,
//   thirdSortClick: PropTypes.bool,
//   tooltip: PropTypes.string,
// };

// export const styles = (theme) => ({
//   header: {
//     // display: 'inline-block',
//     position: "sticky",
//     top: 0,
//     zIndex: 10,
//     backgroundColor: theme.palette.background.paper, // Change according to theme,
//   },
// });

export default withStyles(styles, { withTheme: true })(MTableHeader);
