import cl from 'classnames';

export type SpinnerProps = {
  className?: string;
};

export const Spinner = ({ className }: SpinnerProps) => {
  return (
    <div className={cl(className, 'flex items-center justify-center')}>
      <div
        className={cl(
          'animate-spin',
          'rounded-full',
          'size-1/2',
          'border-2 border-transparent',
          'border-l-white border-b-white border-r-white',
        )}
      />
    </div>
  );
};
