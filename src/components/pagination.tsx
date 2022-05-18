
import { withStyles } from "@material-ui/core/styles";
import { IconButton, Tooltip, Typography } from "@mui/material";
import { merge } from 'lodash'


function MTablePaginationInner(props: any) {
  const {
    classes,
    count,
    page,
    rowsPerPage,
    theme,
    showFirstLastPageButtons,
    onChangePage,
  } = props;

  // const localization = {
  //   ...defaultProps.localization,
  //   ...props.localization,
  // };

  const localization = merge(defaultProps.localization, props.localization);



  console.log(props.localization)

  const handleFirstPageButtonClick = (event: any) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event: any) => {
    onChangePage(event, props.page - 1);
  };

  const handleNextButtonClick = (event: any) => {
    onChangePage(event, props.page + 1);
  };

  const handleLastPageButtonClick = (event: any) => {
    onChangePage(
      event,
      Math.max(0, Math.ceil(props.count / props.rowsPerPage) - 1)
    );
  };

  return (
    <>
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
              {theme.direction === "rtl" ? (
                <props.icons.NextPage />
              ) : (
                <props.icons.PreviousPage />
              )}
            </IconButton>
          </span>
        </Tooltip>
        <Typography
          variant="caption"
          style={{
            flex: 1,
            textAlign: "center",
            alignSelf: "center",
            flexBasis: "inherit",
          }}
        >
          {localization.labelDisplayedRows
            .replace(
              "{from}",
              props.count === 0 ? 0 : props.page * props.rowsPerPage + 1
            )
            .replace(
              "{to}",
              Math.min((props.page + 1) * props.rowsPerPage, props.count)
            )
            .replace("{count}", props.count)}
        </Typography>
        <Tooltip title={localization.nextTooltip}>
          <span>
            <IconButton
              onClick={handleNextButtonClick}
              disabled={page >= Math.ceil(count / rowsPerPage) - 1}
              aria-label={localization.nextAriaLabel}
            >
              {theme.direction === "rtl" ? (
                <props.icons.PreviousPage />
              ) : (
                <props.icons.NextPage />
              )}
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
    </>
  );
}

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

const actionsStyles = (theme: any) => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    display: "flex",
    // lineHeight: '48px'
  },
});

const MTablePagination = withStyles(actionsStyles, { withTheme: true })(
  MTablePaginationInner
);


export default MTablePagination;
