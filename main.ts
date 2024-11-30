import yargs from "https://deno.land/x/yargs@v17.7.2-deno/deno.ts";;
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
