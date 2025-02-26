import cl from 'classnames';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  onEnter?: () => void;
};

export const Input = ({
  onEnter,
  className,
  onKeyDown,
  ...props
}: InputProps) => {
  const onKeyDownProps = onEnter
    ? {
        onKeyDown: ((evt) => {
          if (evt.key === 'Enter') {
            onEnter();
            evt.currentTarget.blur();
          }

          if (onKeyDown) {
            onKeyDown(evt);
          }
        }) satisfies React.KeyboardEventHandler<HTMLInputElement>,
      }
    : {
        onKeyDown,
      };

  return (
    <input
      {...props}
      {...onKeyDownProps}
      className={cl(
        className,
        'px-2 py-0.5',
        'border rounded-sm border-slate-400 hover:border-sky-600 outline-sky-600',
      )}
    />
  );
};
