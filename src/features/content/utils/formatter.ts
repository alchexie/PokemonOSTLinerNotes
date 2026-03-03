type HexColor = `#${string}`;

interface PersonColor {
  name: string;
  color: HexColor;
}

const parsePersonColor = (input: string): PersonColor[] => {
  return input.split('|').map((part) => {
    const [name, color] = part.trim().split(/\s+/);
    if (!name || !color) {
      throw new Error(`Invalid format: ${part}`);
    }
    if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
      throw new Error(`Invalid color: ${color}`);
    }

    return {
      name,
      color: color as HexColor,
    };
  });
};

const renderPersonColor = (input: string, config: PersonColor[]) => {
  const map = new Map(config.map((p) => [p.name, p.color]));
  return input.replace(/([^：\s]+)：/g, (match, name) => {
    const color = map.get(name);
    return `<span style="color: ${color}">${match}</span>`;
  });
};

export const formatMarkdownContent = (content: string, strDiffColorCfg = '') => {
  if (strDiffColorCfg) {
    content = renderPersonColor(content, parsePersonColor(strDiffColorCfg));
  }
  return content;
};
