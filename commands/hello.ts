import { Arguments } from 'https://deno.land/x/yargs/deno-types.ts';
import { MongoClient, Document } from "npm:mongodb@6";
import { invokeAtlasCli } from "../util/atlas.ts";

interface HelloResponse {
  ok: number;
}

interface HelloResult {
  ok: boolean;
  errorCode?: string;
}

async function getConnectionString(deploymentName: string): Promise<string> {
  const connectionString = await invokeAtlasCli(["deployments", "connect", deploymentName, "--connectWith", "connectionString"]);
  return connectionString.trim();
}

async function hello(connectionString: string): Promise<HelloResult> {
  const client = new MongoClient(connectionString);
  const result: HelloResult = { ok: false };
  try {
    await client.connect();
    const helloResponse: HelloResponse = await client.db("admin").command({ hello: 1 }) as HelloResponse;
    result.ok = helloResponse.ok === 1;
    return result;
  } catch (error: any) {
    if (typeof error.code === "string") {
      result.errorCode = error.code;
    }
    result.ok = false;
    return result;
  } finally {
    await client.close();
  }
}

async function handler(argv: Arguments) {
  const deploymentName = argv.deploymentName;
  const connectionString = await getConnectionString(deploymentName);
  console.log(`%cConnection string: %c${connectionString}`, "font-weight: bold", "font-weight: normal");
  const result: HelloResult = await hello(connectionString);
  console.log(`%cCluster reachable: %c${result.ok}${result.errorCode ? " (" + result.errorCode + ")" : ""}`, "font-weight: bold", `font-weight: normal; color: ${result.ok ? "green" : "red"}`);
}

function builder(yargs: any) {
  return yargs.option('deploymentName', {
    alias: 'd',
    type: 'string',
    description: 'The name of the deployment to connect to.',
    demandOption: true
  });
}

const command = {
  command: 'hello',
  describe: 'Check if the cluster is up and running and can be reached.',
  builder,
  handler
};


export default command;