interface ActionProps {
  actions: [];
  data: object | [];
  disabled: boolean;
  size: number;
  components: any;
}

export default function MTableActions({
  actions,
  data,
  disabled,
  size,
  components,
}: ActionProps) {
  const render = () => {
    console.log(actions);
    if (actions) {
      return actions.map((action: any, index: number) => (
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
  };

  return <>{render()}</>;
}
