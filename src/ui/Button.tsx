import cl from 'classnames';

import { Spinner } from './Spinner';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export const Button = ({
  loading,

  className: classNameProp,
  children,
  disabled,
  ...props
}: ButtonProps) => {
  let content = children;

  if (loading) {
    content = (
      <>
        <div className="invisible">{children}</div>
        <Spinner
          color="white"
          className="size-8 absolute left-[50%] top-0 transform-[translateX(-50%)]"
        />
      </>
    );
  } else {
    content = <div>{children}</div>;
  }

  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={cl(
        classNameProp,
        'relative',
        'h-8 px-2 rounded-sm',
        'flex flex-row items-center justify-center',
        'text-white uppercase font-bold',
        'bg-blue-950',
        loading
          ? ['cursor-wait']
          : disabled
            ? ['cursor-not-allowed', 'opacity-15']
            : //normal state
              [
                'cursor-pointer',
                'hover:bg-blue-900',
                'active:transform-[translateY(1px)]',
              ],
      )}
    >
      {content}
    </button>
  );
};
