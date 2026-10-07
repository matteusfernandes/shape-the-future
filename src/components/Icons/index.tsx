// Mesmos ícones (feather) usados nas listagens do dashboard
type IconProps = { size?: number; color?: string };

const base = (size: number, color: string) => ({
  viewBox: '0 0 24 24',
  width: size,
  height: size,
  stroke: color,
  strokeWidth: 2,
  fill: 'none',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const
});

export function RemoveIcon({ size = 18, color = 'red' }: IconProps) {
  return (
    <svg {...base(size, color)}>
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

export function EditIcon({ size = 18, color = 'currentColor' }: IconProps) {
  return (
    <svg {...base(size, color)}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  );
}
