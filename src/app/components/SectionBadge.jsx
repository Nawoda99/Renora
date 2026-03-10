import { useCms } from "../content/ContentContext";

export function SectionBadge({ children }) {
  const { content } = useCms();
  const { badgeText, badgeBg } = content.settings.theme;
  return (
    <div
      className="inline-block px-4 py-2 rounded-full mb-4"
      style={{ backgroundColor: badgeBg }}
    >
      <span style={{ color: badgeText, fontWeight: "500" }}>{children}</span>
    </div>
  );
}
