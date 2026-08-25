import { createContext, useContext } from 'react';
import { cn } from '../../lib/cn';

const TabsContext = createContext(null);

export function Tabs({ value, onValueChange, className, children, ...props }) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn('tabs', className)} role="tablist" {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }) {
  return <div className={cn('flex gap-1', className)}>{children}</div>;
}

export function TabsTrigger({ value, className, children, ...props }) {
  const context = useContext(TabsContext);
  const active = context?.value === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={cn('tab', active && 'tab-active', className)}
      onClick={() => context?.onValueChange?.(value)}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children }) {
  const context = useContext(TabsContext);
  if (context?.value !== value) return null;
  return (
    <div role="tabpanel" className={cn('slide-up', className)}>
      {children}
    </div>
  );
}

export default Tabs;
