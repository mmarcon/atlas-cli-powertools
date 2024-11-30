import yargs from "https://deno.land/x/yargs/deno.ts";
import hello from "./commands/hello.ts";

function registerCommands() {
  yargs(Deno.args.slice(1))
    .scriptName("atlas powertools")
    .command(hello)
    .help()
    .parse();
}

if (import.meta.main) {
  registerCommands();
}
