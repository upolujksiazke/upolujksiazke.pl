import React, {ComponentType} from 'react';
import c from 'classnames';

type IconProps = {
  className?: string,
  size?: string,
  color?: string,
  viewBox?: string,
  svgComponent: ComponentType<any>,
};

export const Icon = (
  {
    svgComponent: SvgComponent,
    size = 'normal',
    color,
    viewBox,
    className,
  }: IconProps,
) => (
  <i
    className={c(
      'c-icon',
      `is-text-${size}`,
      color && `is-text-${color}`,
      className,
    )}
  >
    <SvgComponent viewBox={viewBox} />
  </i>
);

Icon.displayName = 'Icon';

Icon.createFromSVG = (
  svgComponent: ComponentType,
  viewBox: string = '0 0 24 24',
) => (props: Omit<IconProps, 'svgComponent'>) => (
  <Icon
    {...props}
    viewBox={viewBox}
    svgComponent={svgComponent}
  />
);
