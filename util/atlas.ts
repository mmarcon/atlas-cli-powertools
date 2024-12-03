import findProcess from "npm:find-process@1.4.7";

interface ProcessInfo {
  pid: number;
  ppid?: number;
  uid?: number;
  gid?: number;
  name: string;
  bin: string;
  cmd: string;
}

export async function getAtlasCliExecutable(ppid: number): Promise<string> {
  try {
    const processesForPid: ProcessInfo[] = await findProcess("pid", ppid) as ProcessInfo[];
    if (processesForPid.length === 0) {
      return "atlas";
    }
    const { bin } = processesForPid[0];
    return bin;
  } catch {
    return "atlas";
  }
}

export type AtlasCliInvocationResult =
  | { ok: true; output: string }
  | { ok: false; errorCode: number };

export async function invokeAtlasCli(
  args: string[],
): Promise<AtlasCliInvocationResult> {
  const atlasCliExecutable = await getAtlasCliExecutable(Deno.ppid);
  const process = new Deno.Command(atlasCliExecutable, {
    args: args,
    env: Deno.env.toObject(),
    stdout: "piped",
    stderr: "piped",
  }).spawn();

  const { code, stdout } = await process.output();

  if (code !== 0) {
    return { ok: false, errorCode: code };
  }

  const output = new TextDecoder().decode(stdout).trim();
  return { ok: true, output };
}
