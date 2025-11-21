import type { CSSProperties } from "react";

export type FireworkInstance = {
  id: number;
  x: number;
  y: number;
  color: string;
};

type FireworksOverlayProps = {
  items: FireworkInstance[];
};

export function FireworksOverlay({ items }: FireworksOverlayProps) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="fireworks-overlay">
      {items.map((item) => (
        <span
          key={item.id}
          className="firework"
          style={
            {
              "--firework-color": item.color,
              "--firework-x": `${item.x}%`,
              "--firework-y": `${item.y}%`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}


