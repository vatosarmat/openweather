import { SafeParseError } from 'zod';

export const ZodErrorView = ({
  errorResult,
}: {
  errorResult: SafeParseError<object>;
}) => {
  return (
    <div>
      <div className="p-8 text-red-600">
        {errorResult.error.issues[0].message}
      </div>
      <pre className="p-8 text-red-800 text-xs">
        {JSON.stringify(errorResult, undefined, 2)}
      </pre>
    </div>
  );
};
