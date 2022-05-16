
import Table from "@material-ui/core/Table";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import LinearProgress from "@material-ui/core/LinearProgress";

// @ts-ignore
import DoubleScrollbar from "react-double-scrollbar";

import { MTablePagination, MTableSteppedPagination } from "./components";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import DataManager from "./utils/data-manager";
import { debounce } from "debounce";
import equal from "fast-deep-equal";
import { withStyles } from "@material-ui/core";
import * as CommonValues from "./utils/common-values";
import CircularProgress from "@material-ui/core/CircularProgress";
import Icon from "@material-ui/core/Icon";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";
import * as MComponents from "./components";
import { fade } from "@material-ui/core/styles/colorManipulator";
import React from "react";

interface IMaterialTableProps {
  columns: any,
  classes?: any,
  data?: any,
  editable?: any
  localization?: any,

  onChangeColumnHidden?: any,
  onChangePage?: any
  onChangeRowsPerPage?: any,
  onColumnDragged?: any,
  onFilterChange?: any,
  onGroupRemoved?: any,
  onOrderChange?: any,
  onRowClick?: any,
  onRowUpdateCancelled?: any
  onSearchChange?: any,
  onSelectionChange?: any,
  onTreeExpandChange?: any,

  actions?: any,
  rowData?: any,
  detailPanel?: any

  options?: {},
  parentChildData?: any,
  title?: string,
}

interface IMaterialTableState {
  bulkEditOpen: boolean;
  columns: any[];
  currentPage: number;
  data: any;
  errorState: any;
  groupedDataLength: number;
  isLoading: boolean;
  lastEditingRow: any;
  orderBy: number;
  orderDirection: string;
  originalData: never[];
  pageSize: number;
  query: any;
  renderData: any;
  searchText: string;
  selectedCount: number;
  showAddRow: boolean;
  treeDataMaxLevel: number;
  treefiedDataLength: number;
  width: number;
}

export default class MaterialTable extends React.Component<IMaterialTableProps, IMaterialTableState>  {
   
  dataManager = new DataManager();
  tableContainerDiv: any;

  constructor(props:any) {
    super(props);
    
    const calculatedProps = this.getProps(props);
    this.setDataManagerFields(calculatedProps, true);
    const renderState = this.dataManager.getRenderState();

    this.state = {
      errorState: undefined,
      isLoading: false,
      ...renderState,
      query: {
        filters: renderState.columns
          .filter((a) => a.tableData.filterValue)
          .map((a) => ({
            column: a,
            operator: "=",
            value: a.tableData.filterValue,
          })),
        orderBy: renderState.columns.find(
          (a) => a.tableData.id === renderState.orderBy
        ),
        orderDirection: renderState.orderDirection,
        page: 0,
        pageSize: calculatedProps.options.pageSize,
        search: renderState.searchText,

        totalCount: 0,
      },
      showAddRow: false,
      bulkEditOpen: false,
      width: 0,
    };

    this.tableContainerDiv = React.createRef();
  }

  componentDidMount() {

    this.setState(
      {
        ...this.dataManager.getRenderState(),
        //width: this.tableContainerDiv.current.scrollWidth,
      },
      () => {
        if (this.isRemoteData()) {
          this.onQueryChange(this.state.query);
        }
      }
    );
  }

  setDataManagerFields(props: any, isInit?: boolean) {
    let defaultSortColumnIndex = -1;
    let defaultSortDirection = "";
    if (props && props.options.sorting !== false) {
      defaultSortColumnIndex = props.columns.findIndex(
        (a:any) => a.defaultSort && a.sorting !== false
      );
      defaultSortDirection =
        defaultSortColumnIndex > -1
          ? props.columns[defaultSortColumnIndex].defaultSort
          : "";
    }

    this.dataManager.setColumns(props.columns);
    this.dataManager.setDefaultExpanded(props.options.defaultExpanded);
    this.dataManager.changeRowEditing();

    if (this.isRemoteData(props)) {
      this.dataManager.changeApplySearch(false);
      this.dataManager.changeApplyFilters(false);
      this.dataManager.changeApplySort(false);
    } else {
      this.dataManager.changeApplySearch(true);
      this.dataManager.changeApplyFilters(true);
      this.dataManager.changeApplySort(true);
      this.dataManager.setData(props.data);
    }

    // If the columns changed and the defaultSorting differs from the current sorting, it will trigger a new sorting
    const shouldReorder =
      isInit ||
      (defaultSortColumnIndex !== this.dataManager.orderBy &&
        !this.isRemoteData() &&
        defaultSortDirection !== this.dataManager.orderDirection);
    shouldReorder &&
      this.dataManager.changeOrder(
        defaultSortColumnIndex,
        defaultSortDirection
      );
    isInit && this.dataManager.changeSearchText(props.options.searchText || "");
    isInit &&
      this.dataManager.changeCurrentPage(
        props.options.initialPage ? props.options.initialPage : 0
      );
    (isInit || this.isRemoteData()) &&
      this.dataManager.changePageSize(props.options.pageSize);
    this.dataManager.changePaging(props.options.paging);
    isInit && this.dataManager.changeParentFunc(props.parentChildData);
    this.dataManager.changeDetailPanelType(props.options.detailPanelType);
  }

  cleanColumns(columns:any) {
    return columns.map((col:any) => {
      const colClone = { ...col };
      delete colClone.tableData;
      return colClone;
    });
  }

  componentDidUpdate(prevProps:any) {
    // const propsChanged = Object.entries(this.props).reduce((didChange, prop) => didChange || prop[1] !== prevProps[prop[0]], false);

    const fixedPrevColumns = this.cleanColumns(prevProps.columns);
    const fixedPropsColumns = this.cleanColumns(this.props.columns);

    let propsChanged = !equal(fixedPrevColumns, fixedPropsColumns);
    propsChanged =
      propsChanged || !equal(prevProps.options, this.props.options);
    if (!this.isRemoteData()) {
      propsChanged = propsChanged || !equal(prevProps.data, this.props.data);
    }

    if (propsChanged) {
      const props = this.getProps(this.props);
      this.setDataManagerFields(props);
      this.setState(this.dataManager.getRenderState());
    }

    const count = this.isRemoteData()
      ? this.state.query.totalCount
      : this.state.data.length;
    const currentPage = this.isRemoteData()
      ? this.state.query.page
      : this.state.currentPage;
    const pageSize = this.isRemoteData()
      ? this.state.query.pageSize
      : this.state.pageSize;

    if (count <= pageSize * currentPage && currentPage !== 0) {
      this.onChangePage(null, Math.max(0, Math.ceil(count / pageSize) - 1));
    }
  }

  

  getProps(props?:any) {

    const calculatedProps = { ...(props || this.props) };

    calculatedProps.components = {
      ...this.defaultProps.components,
      ...calculatedProps.components,
    };
    calculatedProps.icons = {
      ...this.defaultProps.icons,
      ...calculatedProps.icons,
    };
    calculatedProps.options = {
      ...this.defaultProps.options,
      ...calculatedProps.options,
    };
    calculatedProps.classes = {
      ...this.defaultProps.classes,
      ...calculatedProps.classes,
    };

    calculatedProps.theme = { ...this.defaultProps.theme ,...calculatedProps.theme,
    };

    const localization = {
      ...this.defaultProps.localization.body,
      //...calculatedProps.localization.body,
    };

    calculatedProps.actions = [...(calculatedProps.actions || [])];

    if (calculatedProps.options.selection)
      calculatedProps.actions = calculatedProps.actions
        .filter((a: any) => a)
        .map((action: any) => {
          if (
            action.position === "auto" ||
            action.isFreeAction === false ||
            (action.position === undefined && action.isFreeAction === undefined)
          )
            if (typeof action === "function")
              return { action: action, position: "toolbarOnSelect" };
            else return { ...action, position: "toolbarOnSelect" };
          else if (action.isFreeAction)
            if (typeof action === "function")
              return { action: action, position: "toolbar" };
            else return { ...action, position: "toolbar" };
          else return action;
        });
    else
      calculatedProps.actions = calculatedProps.actions
        .filter((a: any) => a)
        .map((action: any) => {
          if (
            action.position === "auto" ||
            action.isFreeAction === false ||
            (action.position === undefined && action.isFreeAction === undefined)
          )
            if (typeof action === "function")
              return { action: action, position: "row" };
            else return { ...action, position: "row" };
          else if (action.isFreeAction)
            if (typeof action === "function")
              return { action: action, position: "toolbar" };
            else return { ...action, position: "toolbar" };
          else return action;
        });

    if (calculatedProps.editable) {
      if (calculatedProps.editable.onRowAdd) {
        calculatedProps.actions.push({
          icon: calculatedProps.icons.Add,
          tooltip: localization.addTooltip,
          position: "toolbar",
          disabled: !!this.dataManager.lastEditingRow,
          onClick: () => {
            this.dataManager.changeRowEditing();
            this.setState({
              ...this.dataManager.getRenderState(),
              showAddRow: !this.state.showAddRow,
            });
          },
        });
      }
      if (calculatedProps.editable.onRowUpdate) {
        calculatedProps.actions.push((rowData: any) => ({
          icon: calculatedProps.icons.Edit,
          tooltip: calculatedProps.editable.editTooltip
            ? calculatedProps.editable.editTooltip(rowData)
            : localization.editTooltip,
          disabled:
            calculatedProps.editable.isEditable &&
            !calculatedProps.editable.isEditable(rowData),
          hidden:
            calculatedProps.editable.isEditHidden &&
            calculatedProps.editable.isEditHidden(rowData),
          onClick: (e: any, rowData: any) => {
            this.dataManager.changeRowEditing(rowData, "update");
            this.setState({
              ...this.dataManager.getRenderState(),
              showAddRow: false,
            });
          },
        }));
      }
      if (calculatedProps.editable.onRowDelete) {
        calculatedProps.actions.push((rowData: any) => ({
          icon: calculatedProps.icons.Delete,
          tooltip: calculatedProps.editable.deleteTooltip
            ? calculatedProps.editable.deleteTooltip(rowData)
            : localization.deleteTooltip,
          disabled:
            calculatedProps.editable.isDeletable &&
            !calculatedProps.editable.isDeletable(rowData),
          hidden:
            calculatedProps.editable.isDeleteHidden &&
            calculatedProps.editable.isDeleteHidden(rowData),
          onClick: (e: any, rowData: any) => {
            this.dataManager.changeRowEditing(rowData, "delete");
            this.setState({
              ...this.dataManager.getRenderState(),
              showAddRow: false,
            });
          },
        }));
      }
      if (calculatedProps.editable.onBulkUpdate) {
        calculatedProps.actions.push({
          icon: calculatedProps.icons.Edit,
          tooltip: localization.bulkEditTooltip,
          position: "toolbar",
          hidden: this.dataManager.bulkEditOpen,
          onClick: () => {
            this.dataManager.changeBulkEditOpen(true);
            this.setState(this.dataManager.getRenderState());
          },
        });
        calculatedProps.actions.push({
          icon: calculatedProps.icons.Check,
          tooltip: localization.bulkEditApprove,
          position: "toolbar",
          hidden: !this.dataManager.bulkEditOpen,
          onClick: () => this.onEditingApproved("bulk"),
        });
        calculatedProps.actions.push({
          icon: calculatedProps.icons.Clear,
          tooltip: localization.bulkEditCancel,
          position: "toolbar",
          hidden: !this.dataManager.bulkEditOpen,
          onClick: () => {
            this.dataManager.changeBulkEditOpen(false);
            this.dataManager.clearBulkEditChangedRows();
            this.setState(this.dataManager.getRenderState());
          },
        });
      }
    }

    return calculatedProps;
  }

  isRemoteData = (props?:any) => !Array.isArray((props || this.props).data);

  isOutsidePageNumbers = (props:any) =>
    props.page !== undefined && props.totalCount !== undefined;

  onAllSelected = (checked:any) => {
    this.dataManager.changeAllSelected(checked);
    this.setState(this.dataManager.getRenderState(), () =>
      this.onSelectionChange()
    );
  };

  onChangeColumnHidden = (column:any, hidden:boolean) => {
    this.dataManager.changeColumnHidden(column, hidden);
    this.setState(this.dataManager.getRenderState(), () => {
      this.props.onChangeColumnHidden &&
        this.props.onChangeColumnHidden(column, hidden);
    });
  };

  onChangeGroupOrder = (groupedColumn:any) => {
    this.dataManager.changeGroupOrder(groupedColumn.tableData.id);
    this.setState(this.dataManager.getRenderState());
  };

  onChangeOrder = (orderBy: any, orderDirection: string) => {
    const newOrderBy = orderDirection === "" ? -1 : orderBy;
    this.dataManager.changeOrder(newOrderBy, orderDirection);

    if (this.isRemoteData()) {
      const query = { ...this.state.query };
      query.page = 0;
      query.orderBy = this.state.columns.find(
        (a) => a.tableData.id === newOrderBy
      );
      query.orderDirection = orderDirection;
      this.onQueryChange(query, () => {
        this.props.onOrderChange &&
          this.props.onOrderChange(newOrderBy, orderDirection);
      });
    } else {
      this.setState(this.dataManager.getRenderState(), () => {
        this.props.onOrderChange &&
          this.props.onOrderChange(newOrderBy, orderDirection);
      });
    }
  };

  onChangePage = (event: any, page: any) => {
    if (this.isRemoteData()) {
      const query = { ...this.state.query };
      query.page = page;
      this.onQueryChange(query, () => {
        this.props.onChangePage &&
          this.props.onChangePage(page, query.pageSize);
      });
    } else {
      if (!this.isOutsidePageNumbers(this.props)) {
        this.dataManager.changeCurrentPage(page);
      }
      this.setState(this.dataManager.getRenderState(), () => {
        this.props.onChangePage &&
          this.props.onChangePage(page, this.state.pageSize);
      });
    }
  };

  onChangeRowsPerPage = (event: any) => {
    const pageSize = event.target.value;

    this.dataManager.changePageSize(pageSize);

    this.props.onChangePage && this.props.onChangePage(0, pageSize);

    if (this.isRemoteData()) {
      const query = { ...this.state.query };
      query.pageSize = event.target.value;
      query.page = 0;
      this.onQueryChange(query, () => {
        this.props.onChangeRowsPerPage &&
          this.props.onChangeRowsPerPage(pageSize);
      });
    } else {
      this.dataManager.changeCurrentPage(0);
      this.setState(this.dataManager.getRenderState(), () => {
        this.props.onChangeRowsPerPage &&
          this.props.onChangeRowsPerPage(pageSize);
      });
    }
  };

  onDragEnd = (result:any) => {
    if (!result || !result.source || !result.destination) return;
    this.dataManager.changeByDrag(result);
    this.setState(this.dataManager.getRenderState(), () => {
      if (
        this.props.onColumnDragged &&
        result.destination.droppableId === "headers" &&
        result.source.droppableId === "headers"
      ) {
        this.props.onColumnDragged(
          result.source.index,
          result.destination.index
        );
      }
    });
  };

  onGroupExpandChanged = (path:any) => {
    this.dataManager.changeGroupExpand(path);
    this.setState(this.dataManager.getRenderState());
  };

  onGroupRemoved = (groupedColumn:any, index:number) => {
    const result = {
      combine: null,
      destination: { droppableId: "headers", index: 0 },
      draggableId: groupedColumn.tableData.id,
      mode: "FLUID",
      reason: "DROP",
      source: { index, droppableId: "groups" },
      type: "DEFAULT",
    };
    this.dataManager.changeByDrag(result);
    this.setState(this.dataManager.getRenderState(), () => {
      this.props.onGroupRemoved &&
        this.props.onGroupRemoved(groupedColumn, index);
    });
  };

  onEditingApproved = (mode:any, newData?:any, oldData?:any) => {
    if (mode === "add" && this.props.editable && this.props.editable.onRowAdd) {
      this.setState({ isLoading: true }, () => {
        this.props.editable
          .onRowAdd(newData)
          .then((result:any) => {
            this.setState({ isLoading: false, showAddRow: false }, () => {
              if (this.isRemoteData()) {
                this.onQueryChange(this.state.query);
              }
            });
          })
          .catch((reason:any) => {
            const errorState = {
              message: reason,
              errorCause: "add",
            };
            this.setState({ isLoading: false, errorState });
          });
      });
    } else if (
      mode === "update" &&
      this.props.editable &&
      this.props.editable.onRowUpdate
    ) {
      this.setState({ isLoading: true }, () => {
        this.props.editable
          .onRowUpdate(newData, oldData)
          .then((result:any) => {
            this.dataManager.changeRowEditing(oldData);
            this.setState(
              {
                isLoading: false,
                ...this.dataManager.getRenderState(),
              },
              () => {
                if (this.isRemoteData()) {
                  this.onQueryChange(this.state.query);
                }
              }
            );
          })
          .catch((reason:any) => {
            const errorState = {
              message: reason,
              errorCause: "update",
            };
            this.setState({ isLoading: false, errorState });
          });
      });
    } else if (
      mode === "delete" &&
      this.props.editable &&
      this.props.editable.onRowDelete
    ) {
      this.setState({ isLoading: true }, () => {
        this.props.editable
          .onRowDelete(oldData)
          .then((result:any) => {
            this.dataManager.changeRowEditing(oldData);
            this.setState(
              {
                isLoading: false,
                ...this.dataManager.getRenderState(),
              },
              () => {
                if (this.isRemoteData()) {
                  this.onQueryChange(this.state.query);
                }
              }
            );
          })
          .catch((reason:any) => {
            const errorState = {
              message: reason,
              errorCause: "delete",
            };
            this.setState({ isLoading: false, errorState });
          });
      });
    } else if (
      mode === "bulk" &&
      this.props.editable &&
      this.props.editable.onBulkUpdate
    ) {
      this.setState({ isLoading: true }, () => {
        this.props.editable
          .onBulkUpdate(this.dataManager.bulkEditChangedRows)
          .then((result:any) => {
            this.dataManager.changeBulkEditOpen(false);
            this.dataManager.clearBulkEditChangedRows();
            this.setState(
              {
                isLoading: false,
                ...this.dataManager.getRenderState(),
              },
              () => {
                if (this.isRemoteData()) {
                  this.onQueryChange(this.state.query);
                }
              }
            );
          })
          .catch((reason: any) => {
            const errorState = {
              message: reason,
              errorCause: "bulk edit",
            };
            this.setState({ isLoading: false, errorState });
          });
      });
    }
  };

  onEditingCanceled = (mode:any, rowData: any) => {
    if (mode === "add") {
      this.props.editable.onRowAddCancelled &&
        this.props.editable.onRowAddCancelled();
      this.setState({ showAddRow: false });
    } else if (mode === "update") {
      this.props.editable.onRowUpdateCancelled &&
        this.props.editable.onRowUpdateCancelled();
      this.dataManager.changeRowEditing(rowData);
      this.setState(this.dataManager.getRenderState());
    } else if (mode === "delete") {
      this.dataManager.changeRowEditing(rowData);
      this.setState(this.dataManager.getRenderState());
    }
  };
  retry = () => {
    this.onQueryChange(this.state.query);
  };
  onQueryChange = (query: any, callback? : any) => {
    query = { ...this.state.query, ...query, error: this.state.errorState };
    this.setState({ isLoading: true, errorState: undefined }, () => {
      this.props
        .data(query)
        .then((result: any) => {
          query.totalCount = result.totalCount;
          query.page = result.page;
          this.dataManager.setData(result.data);
          this.setState(
            {
              isLoading: false,
              errorState: false,
              ...this.dataManager.getRenderState(),
              query,
            },
            () => {
              callback && callback();
            }
          );
        })
        .catch((error: any) => {
          const localization = {
            ...this.defaultProps.localization,
            ...this.props.localization,
          };
          const errorState = {
            message:
              typeof error === "object"
                ? error.message
                : error !== undefined
                ? error
                : localization.error,
            errorCause: "query",
          };
          this.setState({
            isLoading: false,
            errorState,
            ...this.dataManager.getRenderState(),
          });
        });
    });
  };

  onRowSelected = (event: any, path:any, dataClicked: any) => {
    this.dataManager.changeRowSelected(event.target.checked, path);
    this.setState(this.dataManager.getRenderState(), () =>
      this.onSelectionChange(dataClicked)
    );
  };

  onSelectionChange = (dataClicked?: any) => {
    if (this.props.onSelectionChange) {
      const selectedRows:any = [];

      const findSelecteds = (list:any) => {
        list.forEach((row:any) => {
          if (row.tableData.checked) {
            selectedRows.push(row);
          }
        });
      };

      findSelecteds(this.state.originalData);
      this.props.onSelectionChange(selectedRows, dataClicked);
    }
  };

  onSearchChangeDebounce = debounce((searchText:string) => {
    if (this.isRemoteData()) {
      const query = { ...this.state.query };
      query.page = 0;
      query.search = searchText;

      this.onQueryChange(query);
    } else {
      this.setState(this.dataManager.getRenderState(), () => {
        this.props.onSearchChange && this.props.onSearchChange(searchText);
      });
    }
  }, 200 /*this.props.options.debounceInterval */);

  onFilterChange = (columnId:any, value:any) => {
    this.dataManager.changeFilterValue(columnId, value);
    this.setState({}, this.onFilterChangeDebounce);
  };

  onFilterChangeDebounce = debounce(() => {
    if (this.isRemoteData()) {
      const query = { ...this.state.query };
      query.page = 0;
      query.filters = this.state.columns
        .filter((a) => a.tableData.filterValue)
        .map((a) => ({
          column: a,
          operator: "=",
          value: a.tableData.filterValue,
        }));

      this.onQueryChange(query);
    } else {
      this.setState(this.dataManager.getRenderState(), () => {
        if (this.props.onFilterChange) {
          const appliedFilters = this.state.columns
            .filter((a) => a.tableData.filterValue)
            .map((a) => ({
              column: a,
              operator: "=",
              value: a.tableData.filterValue,
            }));
          this.props.onFilterChange(appliedFilters);
        }
      });
    }
  }, 200);

  onTreeExpandChanged = (path:any, data:any) => {
    this.dataManager.changeTreeExpand(path);
    this.setState(this.dataManager.getRenderState(), () => {
      this.props.onTreeExpandChange &&
        this.props.onTreeExpandChange(data, data.tableData.isTreeExpanded);
    });
  };

  onToggleDetailPanel = (path:any, render:any) => {
    this.dataManager.changeDetailPanelVisibility(path, render);
    this.setState(this.dataManager.getRenderState());
  };

  onCellEditStarted = (rowData: any, columnDef :any) => {
    this.dataManager.startCellEditable(rowData, columnDef);
    this.setState(this.dataManager.getRenderState());
  };

  onCellEditFinished = (rowData:any, columnDef:any) => {
    this.dataManager.finishCellEditable(rowData, columnDef);
    this.setState(this.dataManager.getRenderState());
  };

  onEditRowDataChanged = (rowData:any, newData:any) => {
    // TODO
    // this.dataManager.setEditRowData(rowData, newData);
    this.setState(this.dataManager.getRenderState());
  };

  onColumnResized = (id:any, additionalWidth:number) => {
    this.dataManager.onColumnResized(id, additionalWidth);
    this.setState(this.dataManager.getRenderState());
  };

  renderFooter = () => {
    const props = this.getProps();
    if (props.options.paging) {
      const localization = {
        ...this.defaultProps.localization.pagination,
        //...this.props.localization.pagination,
      };

      const isOutsidePageNumbers = this.isOutsidePageNumbers(props);
      const currentPage = isOutsidePageNumbers
        ? Math.min(
            props.page,
            Math.floor(props.totalCount / this.state.pageSize)
          )
        : this.state.currentPage;
      const totalCount = isOutsidePageNumbers
        ? props.totalCount
        : this.state.data.length;

      return (
        <Table>
          <TableFooter style={{ display: "grid" }}>
            <TableRow>
              <props.components.Pagination
                classes={{
                  root: props.classes.paginationRoot,
                  toolbar: props.classes.paginationToolbar,
                  caption: props.classes.paginationCaption,
                  selectRoot: props.classes.paginationSelectRoot,
                }}
                style={{
                  float: props.theme.direction === "rtl" ? "" : "right",
                  overflowX: "auto",
                }}
                colSpan={3}
                count={
                  this.isRemoteData() ? this.state.query.totalCount : totalCount
                }
                icons={props.icons}
                rowsPerPage={this.state.pageSize}
                rowsPerPageOptions={props.options.pageSizeOptions}
                SelectProps={{
                  renderValue: (value: any) => (
                    <div style={{ padding: "0px 5px" }}>
                      {value + " " + localization.labelRowsSelect + " "}
                    </div>
                  ),
                }}
                page={this.isRemoteData() ? this.state.query.page : currentPage}
                onChangePage={this.onChangePage}
                onChangeRowsPerPage={this.onChangeRowsPerPage}
                ActionsComponent={(subProps:any) =>
                  props.options.paginationType === "normal" ? (
                    <MTablePagination
                      {...subProps}
                      icons={props.icons}
                      localization={localization}
                      showFirstLastPageButtons={
                        props.options.showFirstLastPageButtons
                      }
                    />
                  ) : (
                    <MTableSteppedPagination
                      {...subProps}
                      icons={props.icons}
                      localization={localization}
                      showFirstLastPageButtons={
                        props.options.showFirstLastPageButtons
                      }
                    />
                  )
                }
                labelDisplayedRows={(row:any) =>
                  localization.labelDisplayedRows
                    .replace("{from}", row.from)
                    .replace("{to}", row.to)
                    .replace("{count}", row.count)
                }
                labelRowsPerPage={localization.labelRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      );
    }

    return <></>
  }

  renderTable = (props: any) => {
    return (
    <Table
      style={{
        tableLayout:
          props.options.fixedColumns &&
          (props.options.fixedColumns.left || props.options.fixedColumns.right)
            ? "fixed"
            : props.options.tableLayout,
      }}
    >
      {props.options.header && (
        <props.components.Header
          actions={props.actions}
          localization={{
            ...this.defaultProps.localization.header,
            //...this.props.localization.header,
          }}
          columns={this.state.columns}
          hasSelection={props.options.selection}
          headerStyle={props.options.headerStyle}
          icons={props.icons}
          selectedCount={this.state.selectedCount}
          dataCount={
            props.parentChildData
              ? this.state.treefiedDataLength
              : this.state.columns.filter(
                  (col) => col.tableData.groupOrder > -1
                ).length > 0
              ? this.state.groupedDataLength
              : this.state.data.length
          }
          hasDetailPanel={!!props.detailPanel}
          detailPanelColumnAlignment={props.options.detailPanelColumnAlignment}
          showActionsColumn={
            props.actions &&
            props.actions.filter(
              (a: any) => a.position === "row" || typeof a === "function"
            ).length > 0
          }
          showSelectAllCheckbox={props.options.showSelectAllCheckbox}
          orderBy={this.state.orderBy}
          orderDirection={this.state.orderDirection}
          onAllSelected={this.onAllSelected}
          onOrderChange={this.onChangeOrder}
          actionsHeaderIndex={props.options.actionsColumnIndex}
          sorting={props.options.sorting}
          grouping={props.options.grouping}
          isTreeData={this.props.parentChildData !== undefined}
          draggable={props.options.draggable}
          thirdSortClick={props.options.thirdSortClick}
          treeDataMaxLevel={this.state.treeDataMaxLevel}
          options={props.options}
          onColumnResized={this.onColumnResized}
          scrollWidth={this.state.width}
        />
      )}
      <props.components.Body
        actions={props.actions}
        components={props.components}
        icons={props.icons}
        renderData={this.state.renderData}
        currentPage={this.state.currentPage}
        initialFormData={props.initialFormData}
        pageSize={this.state.pageSize}
        columns={this.state.columns}
        errorState={this.state.errorState}
        detailPanel={props.detailPanel}
        options={props.options}
        getFieldValue={this.dataManager.getFieldValue}
        isTreeData={this.props.parentChildData !== undefined}
        onFilterChanged={this.onFilterChange}
        onRowSelected={this.onRowSelected}
        onToggleDetailPanel={this.onToggleDetailPanel}
        onGroupExpandChanged={this.onGroupExpandChanged}
        onTreeExpandChanged={this.onTreeExpandChanged}
        onEditingCanceled={this.onEditingCanceled}
        onEditingApproved={this.onEditingApproved}
        localization={{
          ...this.defaultProps.localization.body,
          //...this.props.localization.body,
        }}
        onRowClick={this.props.onRowClick}
        showAddRow={this.state.showAddRow}
        hasAnyEditingRow={
          !!(this.state.lastEditingRow || this.state.showAddRow)
        }
        hasDetailPanel={!!props.detailPanel}
        treeDataMaxLevel={this.state.treeDataMaxLevel}
        cellEditable={props.cellEditable}
        onCellEditStarted={this.onCellEditStarted}
        onCellEditFinished={this.onCellEditFinished}
        bulkEditOpen={this.dataManager.bulkEditOpen}
        onBulkEditRowChanged={this.dataManager.onBulkEditRowChanged}
        scrollWidth={this.state.width}
      />
    </Table>
    );
  }

  getColumnsWidth = (props: any, count: number) => {
    let result:any = [];

    const actionsWidth = CommonValues.actionsColumnWidth(props);
    if (actionsWidth > 0) {
      if (
        count > 0 &&
        props.options.actionsColumnIndex >= 0 &&
        props.options.actionsColumnIndex < count
      ) {
        result.push(actionsWidth + "px");
      } else if (
        count < 0 &&
        props.options.actionsColumnIndex < 0 &&
        props.options.actionsColumnIndex >= count
      ) {
        result.push(actionsWidth + "px");
      }
    }

    // add selection action width only for left container div
    if (props.options.selection && count > 0) {
      const selectionWidth = CommonValues.selectionMaxWidth(
        props,
        this.state.treeDataMaxLevel
      );
      result.push(selectionWidth + "px");
    }

    for (let i = 0; i < Math.abs(count) && i < props.columns.length; i++) {
      const colDef =
        props.columns[count >= 0 ? i : props.columns.length - 1 - i];
      if (colDef.tableData) {
        if (typeof colDef.tableData.width === "number") {
          result.push(colDef.tableData.width + "px");
        } else {
          result.push(colDef.tableData.width);
        }
      }
    }

    return "calc(" + result.join(" + ") + ")";
  };

  render() {
    const props = this.getProps();

    return (
      <DragDropContext
        onDragEnd={this.onDragEnd}
        nonce={props.options.cspNonce}
      >
        <props.components.Container
          style={{ position: "relative", ...props.style }}
        >
          {props.options.paginationPosition === "top" ||
          props.options.paginationPosition === "both"
            ? this.renderFooter()
            : null}
          {props.options.toolbar && (
            <props.components.Toolbar
              actions={props.actions}
              components={props.components}
              selectedRows={
                this.state.selectedCount > 0
                  ? this.state.originalData.filter((a:any) => {
                      return a.tableData.checked;
                    })
                  : []
              }
              columns={this.state.columns}
              columnsButton={props.options.columnsButton}
              icons={props.icons}
              exportAllData={props.options.exportAllData}
              exportButton={props.options.exportButton}
              exportDelimiter={props.options.exportDelimiter}
              exportFileName={props.options.exportFileName}
              exportCsv={props.options.exportCsv}
              exportPdf={props.options.exportPdf}
              getFieldValue={this.dataManager.getFieldValue}
              data={this.state.data}
              renderData={this.state.renderData}
              search={props.options.search}
              showTitle={props.options.showTitle}
              showTextRowsSelected={props.options.showTextRowsSelected}
              toolbarButtonAlignment={props.options.toolbarButtonAlignment}
              searchFieldAlignment={props.options.searchFieldAlignment}
              searchAutoFocus={props.options.searchAutoFocus}
              searchFieldStyle={props.options.searchFieldStyle}
              searchFieldVariant={props.options.searchFieldVariant}
              title={props.title}
              searchText={this.dataManager.searchText}
              onSearchChanged={this.onSearchChangeDebounce}
              dataManager={this.dataManager}
              onColumnsChanged={this.onChangeColumnHidden}
              localization={{
                ...this.defaultProps.localization.toolbar,
                //...this.props.localization.toolbar,
              }}
            />
          )}
          {props.options.grouping && (
            <props.components.Groupbar
              icons={props.icons}
              localization={{
                ...this.defaultProps.localization.grouping,
                ...props.localization.grouping,
              }}
              groupColumns={this.state.columns
                .filter((col) => col.tableData.groupOrder > -1)
                .sort(
                  (col1, col2) =>
                    col1.tableData.groupOrder - col2.tableData.groupOrder
                )}
              onSortChanged={this.onChangeGroupOrder}
              onGroupRemoved={this.onGroupRemoved}
            />
          )}

          {/* @ts-ignore */}
          <ScrollBar double={props.options.doubleHorizontalScroll}>
            <Droppable droppableId="headers" direction="horizontal">
              {(provided, snapshot) => {
                let newProps = this.getProps(props);
                const table = this.renderTable(newProps);
                return (
                  <div ref={provided.innerRef}>
                    <div
                      ref={this.tableContainerDiv}
                      style={{
                        maxHeight: props.options.maxBodyHeight,
                        minHeight: props.options.minBodyHeight,
                        overflowY: props.options.overflowY,
                      }}
                    >
                      {this.state.width &&
                      props.options.fixedColumns &&
                      props.options.fixedColumns.right ? (
                        <div
                          style={{
                            width: this.getColumnsWidth(
                              props,
                              -1 * props.options.fixedColumns.right
                            ),
                            position: "absolute",
                            top: 0,
                            right: 0,
                            boxShadow: "-2px 0px 15px rgba(125,147,178,.25)",
                            overflowX: "hidden",
                            zIndex: 11,
                          }}
                        >
                          <div
                            style={{
                              width: this.state.width,
                              background: "white",
                              transform: `translateX(calc(${this.getColumnsWidth(
                                props,
                                -1 * props.options.fixedColumns.right
                              )} - 100%))`,
                            }}
                          >
                            {table}
                          </div>
                        </div>
                      ) : null}

                      <div>{table}</div>

                      {this.state.width &&
                      props.options.fixedColumns &&
                      props.options.fixedColumns.left ? (
                        <div
                          style={{
                            width: this.getColumnsWidth(
                              props,
                              props.options.fixedColumns.left
                            ),
                            position: "absolute",
                            top: 0,
                            left: 0,
                            boxShadow: "2px 0px 15px rgba(125,147,178,.25)",
                            overflowX: "hidden",
                            zIndex: 11,
                          }}
                        >
                          <div
                            style={{
                              width: this.state.width,
                              background: "white",
                            }}
                          >
                            {table}
                          </div>
                        </div>
                      ) : null}
                    </div>
                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
          </ScrollBar>
          {(this.state.isLoading || props.isLoading) &&
            props.options.loadingType === "linear" && (
              <div style={{ position: "relative", width: "100%" }}>
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <LinearProgress />
                </div>
              </div>
            )}
          {props.options.paginationPosition === "bottom" ||
          props.options.paginationPosition === "both"
            ? this.renderFooter()
            : null}

          {(this.state.isLoading || props.isLoading) &&
            props.options.loadingType === "overlay" && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: "100%",
                  zIndex: 11,
                }}
              >
                <props.components.OverlayLoading theme={props.theme} />
              </div>
            )}
          {this.state.errorState &&
            this.state.errorState.errorCause === "query" && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: "100%",
                  zIndex: 11,
                }}
              >
                <props.components.OverlayError
                  error={this.state.errorState}
                  retry={this.retry}
                  theme={props.theme}
                  icon={props.icons.Retry}
                />
              </div>
            )}
        </props.components.Container>
      </DragDropContext>
    );
  }


  OverlayLoading = (props : any) => (
    <div
      style={{
        display: "table",
        width: "100%",
        height: "100%",
        backgroundColor: fade(props.theme.palette.background.paper, 0.7),
      }}
    >
      <div
        style={{
          display: "table-cell",
          width: "100%",
          height: "100%",
          verticalAlign: "middle",
          textAlign: "center",
        }}
      >
        <CircularProgress />
      </div>
    </div>
  );

  OverlayError = (props:any) => (
    <div
      style={{
        display: "table",
        width: "100%",
        height: "100%",
        backgroundColor: fade(props.theme.palette.background.paper, 0.7),
      }}
    >
      <div
        style={{
          display: "table-cell",
          width: "100%",
          height: "100%",
          verticalAlign: "middle",
          textAlign: "center",
        }}
      >
        <span>{props.error.message}</span>{" "}
        <props.icon
          onClick={props.retry}
          style={{ cursor: "pointer", position: "relative", top: 5 }}
        />
      </div>
    </div>
  );


  Container = (props:any) => <Paper elevation={2} {...props} />;
  
  defaultProps = {
    actions: [],
    classes: {},
    columns: [],
    theme: {},
    components: {
      Action: MComponents.MTableAction,
      Actions: MComponents.MTableActions,
      Body: MComponents.MTableBody,
      Cell: MComponents.MTableCell,
      Container: this.Container,
      EditCell: MComponents.MTableEditCell,
      EditField: MComponents.MTableEditField,
      EditRow: MComponents.MTableEditRow,
      FilterRow: MComponents.MTableFilterRow,
      Groupbar: MComponents.MTableGroupbar,
      GroupRow: MComponents.MTableGroupRow,
      Header: MComponents.MTableHeader,
      OverlayLoading: this.OverlayLoading,
      OverlayError: this.OverlayError,
      Pagination: TablePagination,
      Row: MComponents.MTableBodyRow,
      Toolbar: MComponents.MTableToolbar,
    },
    data: [],
    icons: {
      Add: React.forwardRef((props, ref) => (
        <Icon {...props} >
          add_box
        </Icon>
      )),
      Check: React.forwardRef((props, ref) => (
        <Icon {...props} >
          check
        </Icon>
      )),
      Clear: React.forwardRef((props, ref) => (
        <Icon {...props} >
          clear
        </Icon>
      )),
      Delete: React.forwardRef((props, ref) => (
        <Icon {...props} >
          delete_outline
        </Icon>
      )),
      DetailPanel: React.forwardRef((props, ref) => (
        <Icon {...props} >
          chevron_right
        </Icon>
      )),
      Edit: React.forwardRef((props, ref) => (
        <Icon {...props} >
          edit
        </Icon>
      )),
      Export: React.forwardRef((props, ref) => (
        <Icon {...props} >
          save_alt
        </Icon>
      )),
      Filter: React.forwardRef((props, ref) => (
        <Icon {...props} >
          filter_list
        </Icon>
      )),
      FirstPage: React.forwardRef((props, ref) => (
        <Icon {...props} >
          first_page
        </Icon>
      )),
      LastPage: React.forwardRef((props, ref) => (
        <Icon {...props} >
          last_page
        </Icon>
      )),
      NextPage: React.forwardRef((props, ref) => (
        <Icon {...props} >
          chevron_right
        </Icon>
      )),
      PreviousPage: React.forwardRef((props, ref) => (
        <Icon {...props} >
          chevron_left
        </Icon>
      )),
      ResetSearch: React.forwardRef((props, ref) => (
        <Icon {...props} >
          clear
        </Icon>
      )),
      Resize: React.forwardRef((props:any, ref) => (
        <Icon
          {...props}
          
          style={{ ...props.style, transform: "rotate(90deg)" }}
        >
          drag_handle
        </Icon>
      )),
      Search: React.forwardRef((props, ref) => (
        <Icon {...props} >
          search
        </Icon>
      )),
      SortArrow: React.forwardRef((props, ref) => (
        <Icon {...props} >
          arrow_downward
        </Icon>
      )),
      ThirdStateCheck: React.forwardRef((props, ref) => (
        <Icon {...props} >
          remove
        </Icon>
      )),
      ViewColumn: React.forwardRef((props, ref) => (
        <Icon {...props} >
          view_column
        </Icon>
      )),
      Retry: React.forwardRef((props, ref) => (
        <Icon {...props} >
          replay
        </Icon>
      )),
      /* eslint-enable react/display-name */
    },
    isLoading: false,
    title: "Table Title",
    options: {
      actionsColumnIndex: 0,
      addRowPosition: "last",
      columnsButton: false,
      detailPanelType: "multiple",
      debounceInterval: 200,
      doubleHorizontalScroll: false,
      emptyRowsWhenPaging: true,
      exportAllData: false,
      exportButton: false,
      exportDelimiter: ",",
      filtering: false,
      groupTitle: false,
      header: true,
      headerSelectionProps: {},
      hideFilterIcons: false,
      loadingType: "overlay",
      padding: "default",
      searchAutoFocus: false,
      paging: true,
      pageSize: 5,
      pageSizeOptions: [5, 10, 20],
      paginationType: "normal",
      paginationPosition: "bottom",
      showEmptyDataSourceMessage: true,
      showFirstLastPageButtons: true,
      showSelectAllCheckbox: true,
      search: true,
      showTitle: true,
      showTextRowsSelected: true,
      tableLayout: "auto",
      toolbarButtonAlignment: "right",
      searchFieldAlignment: "right",
      searchFieldStyle: {},
      searchFieldVariant: "standard",
      selection: false,
      selectionProps: {},
      sorting: true,
      toolbar: true,
      defaultExpanded: false,
      detailPanelColumnAlignment: "left",
      thirdSortClick: true,
      overflowY: "auto",
    },
    localization: {
      error: "Data could not be retrieved",
      grouping: {
        groupedBy: "Grouped By:",
        placeholder: "Drag headers here to group by",
      },
      pagination: {
        labelDisplayedRows: "{from}-{to} of {count}",
        labelRowsPerPage: "Rows per page:",
        labelRowsSelect: "rows",
      },
      toolbar: {},
      header: {},
      body: {
        filterRow: {},
        editRow: {
          saveTooltip: "Save",
          cancelTooltip: "Cancel",
          deleteText: "Are you sure you want to delete this row?",
        },
        addTooltip: "Add",
        deleteTooltip: "Delete",
        editTooltip: "Edit",
        bulkEditTooltip: "Edit All",
        bulkEditApprove: "Save all changes",
        bulkEditCancel: "Discard all changes",
      },
    },
    style: {}
  };

}

var style = () => ({
  horizontalScrollContainer: {
    "& ::-webkit-scrollbar": {
      "-webkit-appearance": "none",
    },
    "& ::-webkit-scrollbar:horizontal": {
      height: 8,
    },
    "& ::-webkit-scrollbar-thumb": {
      borderRadius: 4,
      border: "2px solid white",
      backgroundColor: "rgba(0, 0, 0, .3)",
    },
  },
});

// @ts-ignore
const ScrollBar = withStyles(style)(({ double, children, classes }) => {
  if (double) {
    return <DoubleScrollbar>{children}</DoubleScrollbar>;
  } else {
    return (
      <div
        className={classes.horizontalScrollContainer}
        style={{ overflowX: "auto", position: "relative" }}
      >
        {children}
      </div>
    );
  }
});
