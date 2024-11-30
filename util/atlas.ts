export async function getAtlasCliExecutable(ppid: number): Promise<string> {

  //TODO: adjust things so that it returns the full path to the Atlas CLI executable. Right now it returns the name of the executable.

  const cmdAndArgs: string[] = (
    Deno.build.os === "windows"
      ? `wmic process where (ProcessId=${ppid}) get ExecutablePath`
      : `ps -p ${ppid} -o comm=`
  ).split(" ");

  const command = cmdAndArgs.shift();

  if (!command) {
    throw new Error("Command is undefined.");
  }
  const process = new Deno.Command(command, {
    args: cmdAndArgs,
    env: Deno.env.toObject(),
    stdout: "piped",
    stderr: "piped",
  }).spawn();

  const { code, stdout } = await process.output();

  if (code === 0) {
    const output = new TextDecoder().decode(stdout).trim();
    return output;
  }
  return "atlas";
}

export async function invokeAtlasCli(
  args: string[],
): Promise<string> {
  const atlasCliExecutable = await getAtlasCliExecutable(Deno.ppid);
  const process = new Deno.Command(atlasCliExecutable, {
    args: args,
    env: Deno.env.toObject(),
    stdout: "piped",
    stderr: "piped",
  }).spawn();

  const { code, stdout } = await process.output();

  if (code !== 0) {
    throw new Error(`Atlas CLI exited with code ${code}`);
  }
  const output = new TextDecoder().decode(stdout).trim();
  return output;
}
