'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

export function Tab({
  children,
  index,
  className,
  ...props
}: {
  children?: React.ReactNode;
  index: number;
} & ClassNameProps &
  React.ComponentProps<'button'>) {
  const { tabRefs, setActiveIndex, setHoveredIndex } = useTabs();
  return (
    <Button
      type='button'
      variant='ghost'
      ref={(el) => (tabRefs.current[index] = el)}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      onClick={() => setActiveIndex(index)}
      className={cn(
        'font-semibold hover:bg-transparent dark:hover:bg-transparent relative',
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
export type ClassNameProps = {
  className?: string;
};
export function HoverHighlight({ className }: ClassNameProps) {
  const { hoverStyle, hoveredIndex } = useTabs();
  return (
    <div
      className={cn(
        'absolute flex h-9 items-center rounded-md bg-muted transition-all duration-300 ease-out',
        className,
      )}
      style={{
        ...hoverStyle,
        opacity: hoveredIndex !== null ? 1 : 0,
      }}
    />
  );
}

export function ActiveIndicator({ className }: ClassNameProps) {
  const { activeStyle } = useTabs();
  return (
    <div
      className={cn(
        'absolute -bottom-1.5 h-0.5 bg-foreground transition-all duration-300 ease-out',
        className,
      )}
      style={activeStyle}
    />
  );
}

type TabsContextProps = {
  activeIndex: number;
  hoveredIndex: number | null;
  hoverStyle: React.CSSProperties;
  activeStyle: React.CSSProperties;
  setActiveIndex: (index: number) => void;
  setHoveredIndex: (index: number | null) => void;
  tabRefs: React.RefObject<(HTMLButtonElement | null)[]>;
};

const TabsContext = createContext<TabsContextProps | undefined>(undefined);

export function TabsProvider({ children }: { children: React.ReactNode }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverStyle, setHoverStyle] = useState({});
  const [activeStyle, setActiveStyle] = useState({ left: '0px', width: '0px' });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (hoveredIndex !== null) {
      const hoveredElement = tabRefs.current[hoveredIndex];
      if (hoveredElement) {
        const { offsetLeft, offsetWidth } = hoveredElement;
        setHoverStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }
  }, [hoveredIndex]);

  useEffect(() => {
    const activeElement = tabRefs.current[activeIndex];
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement;
      setActiveStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    requestAnimationFrame(() => {
      const overviewElement = tabRefs.current[0];
      if (overviewElement) {
        const { offsetLeft, offsetWidth } = overviewElement;
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    });
  }, []);
  return (
    <TabsContext.Provider
      value={{
        activeIndex,
        hoveredIndex,
        hoverStyle,
        activeStyle,
        tabRefs,
        setActiveIndex,
        setHoveredIndex,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
}
export function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('useTabs must be used within TabsProvider');
  return ctx;
}

export function Tabs({ children }: { children: React.ReactNode }) {
  return (
    <TabsProvider>
      <div className='relative'>{children}</div>
    </TabsProvider>
  );
}
