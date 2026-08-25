import { cn } from '../../lib/cn';

export function Table({ className, children, ...props }) {
  return (
    <div className="table-wrap">
      <table className={cn('table', className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function Thead({ className, children }) {
  return <thead className={className}>{children}</thead>;
}

export function Tbody({ className, children }) {
  return <tbody className={className}>{children}</tbody>;
}

export function Tr({ className, children, ...props }) {
  return (
    <tr className={className} {...props}>
      {children}
    </tr>
  );
}

export function Th({ className, children, ...props }) {
  return (
    <th className={className} {...props}>
      {children}
    </th>
  );
}

export function Td({ className, children, ...props }) {
  return (
    <td className={className} {...props}>
      {children}
    </td>
  );
}

export default Table;
