import { importw, release } from "../../mod.ts";

export async function main() {
  const exampleModPath = new URL("./exampleMod.ts", import.meta.url).pathname;

  console.log(exampleModPath);

  // Import `denoCwd` from a Worker with Deno namespace enabled, but read permission restricted
  const { denoCwd, [release]: terminate } = await importw(
    "./examples/restrictedRead/exampleMod.ts",
    {
      name: "permissionRestrictedWorker",
      deno: {
        namespace: true,
        permissions: {
          read: [exampleModPath],
        },
      },
    },
  );

  /**
   * Expect to get a read permission error:
   * `PermissionDenied: read access to <CWD>, run again with the --allow-read flag`
   */
  try {
    await denoCwd(); // BOOM!
  } catch (e) {
    console.log("BOOM! 💥 ");
    console.error(e);
  }

  await terminate();
}

if (import.meta.main) {
  await main();
}
