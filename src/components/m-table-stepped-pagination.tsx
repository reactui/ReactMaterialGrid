/* eslint-disable no-unused-vars */
import IconButton from "@material-ui/core/IconButton";
import withStyles from "@material-ui/core/styles/withStyles";
import Tooltip from "@material-ui/core/Tooltip";
import Hidden from "@material-ui/core/Hidden";
import Button from "@material-ui/core/Button";

function MTablePaginationInner(props:any) {

  const handleFirstPageButtonClick = (event:any) => {
    props.onChangePage(event, 0);
  };

  const handleBackButtonClick = (event:any) => {
    props.onChangePage(event, props.page - 1);
  };

  const handleNextButtonClick = (event:any) => {
    props.onChangePage(event, props.page + 1);
  };

  const handleNumberButtonClick = (number:any) => (event:any) => {
    props.onChangePage(event, number);
  };

  const handleLastPageButtonClick = (event:any) => {
    props.onChangePage(
      event,
      Math.max(0, Math.ceil(props.count / props.rowsPerPage) - 1)
    );
  };

  const renderPagesButton = (start: any, end: any) => {
    const buttons:any = [];

    for (let p = start; p <= end; p++) {
      const buttonVariant = p === props.page ? "contained" : "text";
      buttons.push(
        <Button
          size="small"
          style={{
            boxShadow: "none",
            maxWidth: "30px",
            maxHeight: "30px",
            minWidth: "30px",
            minHeight: "30px",
          }}
          disabled={p === props.page}
          variant={buttonVariant}
          onClick={handleNumberButtonClick(p)}
          key={p}
        >
          {p + 1}
        </Button>
      );
    }

    return <span>{buttons}</span>;
  }

  const render = () => {
    const {
      classes,
      count,
      page,
      rowsPerPage,
      theme,
      showFirstLastPageButtons,
    } = props;

    const localization = {
      ...defaultProps.localization,
      ...props.localization,
    };
    const maxPages = Math.ceil(count / rowsPerPage) - 1;

    const pageStart = Math.max(page - 1, 0);
    const pageEnd = Math.min(maxPages, page + 1);

    return (
      <div className={classes.root}>
        {showFirstLastPageButtons && (
          <Tooltip title={localization.firstTooltip}>
            <span>
              <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label={localization.firstAriaLabel}
              >
                {theme.direction === "rtl" ? (
                  <props.icons.LastPage />
                ) : (
                  <props.icons.FirstPage />
                )}
              </IconButton>
            </span>
          </Tooltip>
        )}
        <Tooltip title={localization.previousTooltip}>
          <span>
            <IconButton
              onClick={handleBackButtonClick}
              disabled={page === 0}
              aria-label={localization.previousAriaLabel}
            >
              <props.icons.PreviousPage />
            </IconButton>
          </span>
        </Tooltip>
        {/* @ts-ignore */}
        <Hidden smDown={true}>
          {renderPagesButton(pageStart, pageEnd)}
        </Hidden>
        <Tooltip title={localization.nextTooltip}>
          <span>
            <IconButton
              onClick={handleNextButtonClick}
              disabled={page >= maxPages}
              aria-label={localization.nextAriaLabel}
            >
              <props.icons.NextPage />
            </IconButton>
          </span>
        </Tooltip>
        {showFirstLastPageButtons && (
          <Tooltip title={localization.lastTooltip}>
            <span>
              <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label={localization.lastAriaLabel}
              >
                {theme.direction === "rtl" ? (
                  <props.icons.FirstPage />
                ) : (
                  <props.icons.LastPage />
                )}
              </IconButton>
            </span>
          </Tooltip>
        )}
      </div>
    );
  }
}

const actionsStyles = (theme: any) => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5),
  },
});

const defaultProps = {
  showFirstLastPageButtons: true,
  localization: {
    firstTooltip: "First Page",
    previousTooltip: "Previous Page",
    nextTooltip: "Next Page",
    lastTooltip: "Last Page",
    labelDisplayedRows: "{from}-{to} of {count}",
    labelRowsPerPage: "Rows per page:",
  },
};

const MTableSteppedPagination = withStyles(actionsStyles, { withTheme: true })(
  // @ts-ignore
  MTablePaginationInner
);

export default MTableSteppedPagination;
