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
  if (map.size === 0) {
    return input;
  }

  const namePattern = Array.from(map.keys()).join('|');
  if (!namePattern) {
    return input;
  }
  const lineRegex = /^([^：\r\n]*)(：)/gm;
  const nameRegex = new RegExp(namePattern, 'g');

  return input.replace(lineRegex, (match, segment, colon) => {
    let changed = false;
    const replaced = segment.replace(nameRegex, (name: string) => {
      const color = map.get(name);
      changed = true;
      return `<span style="color: ${color}">${name}</span>`;
    });

    if (!changed) {
      return match;
    }
    return `${replaced}${colon}`;
  });
};

export const formatMarkdownContent = (content: string, strDiffColorCfg = '') => {
  if (strDiffColorCfg) {
    content = renderPersonColor(content, parsePersonColor(strDiffColorCfg));
  }
  return content;
};
