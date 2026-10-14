// Ícones Lucide (search, map-pin, users, star) usados no cronograma
type IconProps = { size: number; strokeWidth?: number };

const stroke = (size: number, strokeWidth: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true
});

export const SearchIcon = ({ size, strokeWidth = 2.4 }: IconProps) => (
  <svg {...stroke(size, strokeWidth)}>
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.3-4.3"></path>
  </svg>
);

export const MapPinIcon = ({ size, strokeWidth = 2.4 }: IconProps) => (
  <svg {...stroke(size, strokeWidth)}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

export const UsersIcon = ({ size, strokeWidth = 2.2 }: IconProps) => (
  <svg {...stroke(size, strokeWidth)} style={{ flex: 'none', marginTop: 2 }}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.9"></path>
    <path d="M16 3.1a4 4 0 0 1 0 7.8"></path>
  </svg>
);

export const StarIcon = ({ size }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="#EC72A1"
    stroke="#EC72A1"
    strokeWidth={2}
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1Z"></path>
  </svg>
);
