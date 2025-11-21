import type { CSSProperties } from "react";

export type FireworkInstance = {
  id: number;
  originX: number;
  originY: number;
  offsetX: number;
  offsetY: number;
  initialY: number;
  finalSize: number;
  colors: string[];
  delay: number;
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
              "--origin-x": `${item.originX}%`,
              "--origin-y": `${item.originY}%`,
              "--x": `${item.offsetX}vmin`,
              "--y": `${item.offsetY}vmin`,
              "--initialSize": "0.5vmin",
              "--finalSize": `${item.finalSize}vmin`,
              "--initialY": `${item.initialY}vmin`,
              "--color1": item.colors[0],
              "--color2": item.colors[1],
              "--color3": item.colors[2],
              "--color4": item.colors[3],
              "--color5": item.colors[4],
              "--color6": item.colors[5],
              "--firework-delay": `${item.delay}ms`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
