import { readdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseTiledMap } from 'game-engine';
const __dirname = dirname(fileURLToPath(import.meta.url));
const MAPS_DIR = join(__dirname, '..', 'maps');
function toTitleCase(id) {
    return id
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (s) => s.toUpperCase())
        .trim();
}
function getMapMeta(json) {
    const nameProp = json.properties?.find((p) => p.name === 'name');
    const name = nameProp?.value;
    return {
        width: json.width,
        height: json.height,
        name: typeof name === 'string' ? name : undefined,
    };
}
export function listMaps() {
    const files = readdirSync(MAPS_DIR).filter((f) => f.endsWith('.json'));
    const result = [];
    for (const file of files) {
        const id = file.replace(/\.json$/, '');
        try {
            const raw = readFileSync(join(MAPS_DIR, file), 'utf-8');
            const json = JSON.parse(raw);
            const meta = getMapMeta(json);
            result.push({
                id,
                name: meta.name ?? toTitleCase(id),
                width: meta.width,
                height: meta.height,
            });
        }
        catch {
            // skip invalid maps
        }
    }
    return result;
}
export function getMap(id) {
    try {
        const raw = readFileSync(join(MAPS_DIR, `${id}.json`), 'utf-8');
        const json = JSON.parse(raw);
        return parseTiledMap(json);
    }
    catch {
        return null;
    }
}
