import type { FC, SVGProps } from 'react';

import { cn } from '@/utils';

type SvgComponent = FC<SVGProps<SVGSVGElement>>;

const iconNamePattern = /\/([\w-]+)\.svg$/;

const files = import.meta.glob<SvgComponent>('../../assets/svg/*.svg', {
  eager: true,
  query: '?react',
  import: 'default',
});

const icons = Object.entries(files).reduce<Record<string, SvgComponent>>(
  (acc, [path, component]) => {
    const name = path.match(iconNamePattern)?.[1];
    return name ? { ...acc, [name]: component } : acc;
  },
  {},
);

export type IconName = keyof typeof icons;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export const Icon: FC<IconProps> = (props) => {
  const { name, size = 16, className } = props;

  const CurrentIcon = icons[name];

  return CurrentIcon ? (
    <CurrentIcon
      width={size}
      height={size}
      className={cn('shrink-0 fill-current', className)}
      aria-hidden
    />
  ) : null;
};
