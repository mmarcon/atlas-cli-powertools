import { parse, stringify } from "jsr:@std/yaml";
import { parseArgs } from "jsr:@std/cli/parse-args";

interface GithubConfig {
  owner: string;
  name: string;
}

interface CommandConfig {
  description: string;
}

interface LocalConfig {
  name: string;
  description: string;
  version: string;
  github: GithubConfig;
  binary: string;
  commands: {
    powertools: CommandConfig;
  };
}

async function loadLocalYml(filePath: string): Promise<LocalConfig> {
  const fileContent = await Deno.readTextFile(filePath);
  const data = parse(fileContent) as LocalConfig;
  return data;
}

function injectLocalConfig(config: LocalConfig): LocalConfig {
  config.version = "0.0.1-dev";
  config.github.owner = "mmarcon";
  config.github.name = "atlas-cli-powertools";
  config.binary = "binary";
  return config;
}

async function saveLocalYml(filePath: string, config: LocalConfig) {
  const data = stringify(config);
  await Deno.writeTextFile(filePath, data);
}

if (import.meta.main) {
  const args = parseArgs(Deno.args, {
    string: ["file", "output"],
    alias: { f: "file", o: "output" },
    default: { file: "../manifest.template.yml", output: "manifest.yml" },
  });
  const config = await loadLocalYml(args.file);
  const newConfig = injectLocalConfig(config);
  await saveLocalYml(args.output, newConfig);
}
