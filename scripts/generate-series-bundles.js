import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fm from 'front-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const docsDir = path.join(rootDir, 'docs');
const outputDir = path.join(rootDir, 'public/data/docs');

async function generateSeriesBundles() {
  try {
    await fs.mkdir(outputDir, { recursive: true });

    const entries = await fs.readdir(docsDir, { withFileTypes: true });
    const seriesList = entries
      .filter((e) => e.isDirectory() && !e.name.startsWith('_'))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((e) => ({
        folder: e.name,
        key: e.name.split('-').pop(),
      }));

    for (const series of seriesList) {
      console.log(`Processing series: ${series.key} (${series.folder})`);

      const seriesPath = path.join(docsDir, series.folder);
      const seriesBundle = {
        key: series.key,
        title: '',
        meta: {},
        sections: [],
      };

      const metaPath = path.join(seriesPath, '_meta.json');
      const metaContent = await fs.readFile(metaPath, 'utf-8');
      const meta = JSON.parse(metaContent);
      seriesBundle.title = meta.title || series.folder;
      seriesBundle.meta = meta;

      const dirEntries = await fs.readdir(seriesPath, { withFileTypes: true });

      for (const entry of dirEntries) {
        if (!entry.isDirectory() || entry.name.startsWith('_')) continue;

        const sectionName = entry.name;
        const sectionPath = path.join(seriesPath, sectionName);

        const section = {
          key: sectionName.slice(2),
          title: sectionName.replace(/^\d+-/, ''),
          meta: {},
          files: [],
        };

        const sectionMetaPath = path.join(sectionPath, '_meta.json');
        const sectionMetaContent = await fs.readFile(sectionMetaPath, 'utf-8');
        const sectionMeta = JSON.parse(sectionMetaContent);
        section.title = sectionMeta.title || section.title;
        section.meta = sectionMeta;

        try {
          const files = await fs.readdir(sectionPath);
          const mdFiles = files.filter((f) => f.endsWith('.md') && !f.startsWith('_'));

          for (const mdFile of mdFiles.sort()) {
            const mdPath = path.join(sectionPath, mdFile);
            const mdContent = await fs.readFile(mdPath, 'utf-8');
            const { attributes, body } = fm(mdContent);

            const fileKey = mdFile.replace(/\.md$/, '');
            section.files.push({
              key: `${section.key}+${fileKey.slice(3)}`,
              title: attributes.title,
              meta: attributes,
              content: body,
            });
          }
        } catch (e) {
          console.warn(`Error reading section ${sectionName}:`, e.message);
        }

        if (section.files.length > 0 || Object.keys(section.meta).length > 0) {
          seriesBundle.sections.push(section);
        }
      }

      const rootFiles = await fs.readdir(seriesPath);
      const rootMdFiles = rootFiles.filter(
        (f) => f.endsWith('.md') && !f.startsWith('_')
      );

      if (rootMdFiles.length > 0) {
        const rootSection = {
          key: '',
          title: seriesBundle.title,
          meta: {},
          files: [],
        };

        for (const mdFile of rootMdFiles.sort()) {
          const mdPath = path.join(seriesPath, mdFile);
          const mdContent = await fs.readFile(mdPath, 'utf-8');
          const { attributes, body } = fm(mdContent);

          const fileKey = mdFile.replace(/\.md$/, '');
          rootSection.files.push({
            key: fileKey.slice(3),
            title: attributes.title,
            meta: attributes,
            content: body,
          });
        }

        if (rootSection.files.length > 0) {
          seriesBundle.sections.unshift(rootSection);
        }
      }

      const outputPath = path.join(outputDir, `${series.key}.json`);
      await fs.writeFile(outputPath, JSON.stringify(seriesBundle, null, 2), 'utf-8');
      const count = seriesBundle.sections.length;
      console.log(
        `  ✓ Generated: ${series.key}.json (${count} ${count === 1 ? 'section' : 'sections'})`
      );
    }

    console.log(`\n✓ All series bundles generated in ${outputDir}`);
  } catch (error) {
    console.error('Error generating series bundles:', error);
    process.exit(1);
  }
}

generateSeriesBundles();
