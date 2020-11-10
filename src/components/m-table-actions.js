/* eslint-disable no-unused-vars */
import * as React from "react";
import PropTypes from "prop-types";
/* eslint-enable no-unused-vars */

const MTableActions = props => {

  const {
    actions,
    data,
    size,
    disabled,
    components
  } = props;

  const render = () => {
    if (actions) {
      return actions.map((action, index) => (
        <components.Action
          action={action}
          key={"action-" + index}
          data={data}
          size={size}
          disabled={disabled}
        />
      ));
    }

    return null;
  }

  return (
    <>
    {render()}
    </>
  )
}

MTableActions.defaultProps = {
  actions: [],
  data: {},
};

MTableActions.propTypes = {
  components: PropTypes.object.isRequired,
  actions: PropTypes.array.isRequired,
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object),
  ]),
  disabled: PropTypes.bool,
  size: PropTypes.string,
};

export default MTableActions;
