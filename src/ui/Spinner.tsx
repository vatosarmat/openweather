import cl from 'classnames';

export type SpinnerProps = {
  className?: string;
  color: 'white' | 'black';
};

export const Spinner = ({ className, color }: SpinnerProps) => {
  return (
    <div className={cl(className, 'flex items-center justify-center')}>
      <div
        className={cl(
          'animate-spin',
          'rounded-full',
          'size-1/2',
          'border-2 border-transparent',
          color === 'white'
            ? 'border-l-white border-b-white border-r-white'
            : 'border-l-black border-b-black border-r-black',
        )}
      />
    </div>
  );
};
