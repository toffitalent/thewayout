import type { BorderStyleProps } from './borders';
import type { ColorStyleProps } from './colors';
import type { FlexStyleProps } from './flex';
import type { LayoutStyleProps } from './layout';
import type { SpacingStyleProps } from './spacing';
import type { TypographyStyleProps } from './typography';
import type { OtherStyleProps } from './other';
export type ThemeBrandColor = 'primary' | 'secondary';
export type ThemeDefaultColor = 'grey' | 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'indigo' | 'purple' | 'pink';
export type ThemeColorScheme = ThemeBrandColor | ThemeDefaultColor;
export type ThemeColorVariant = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type ThemeColor = ThemeBrandColor | ThemeDefaultColor | `${ThemeBrandColor | ThemeDefaultColor}.${ThemeColorVariant}` | 'bg' | 'caption' | 'dark' | 'light' | 'text';
export type ThemeFont = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 's1' | 's2' | 'p1' | 'p2' | 'c1' | 'c2' | 'label';
export type ThemeFontSize = ThemeFont | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl';
export type ThemeFontWeight = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
export type ThemeLayout = '1/2' | '1/3' | '2/3' | '1/4' | '3/4' | '1/5' | '2/5' | '3/5' | '4/5' | '1/6' | '5/6' | 'full';
export type ThemeSpacing = 'px' | 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 12 | 14 | 16 | 20 | 24 | 28 | 32 | 36 | 40 | 44 | 48 | 52 | 56 | 60 | 64 | 72 | 80 | 96;
export interface StyleProps extends BorderStyleProps, ColorStyleProps, FlexStyleProps, LayoutStyleProps, SpacingStyleProps, TypographyStyleProps, OtherStyleProps {
}
export interface SystemProps extends StyleProps {
    sx?: StyleProps;
}
