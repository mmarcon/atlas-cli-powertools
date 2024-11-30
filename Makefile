
ENTRYPOINT=main.ts
BINARY=binary
MANIFEST_TEMPLATE=manifest.template.yml
MANIFEST=manifest.yml
CLI_DESTINATION_LOCAL_OSX=${HOME}/Library/Application Support/atlascli/plugins/mmarcon@atlas-cli-powertools

.PHONY: build-local
build-local:
	@echo "Building local plugin"
	deno compile --allow-run --allow-env --allow-read --allow-sys --allow-net --output="$(CLI_DESTINATION_LOCAL_OSX)/$(BINARY)" $(ENTRYPOINT)
	deno run --allow-write --allow-read devutil/localmanifest.ts --file $(MANIFEST_TEMPLATE) --output "$(CLI_DESTINATION_LOCAL_OSX)/$(MANIFEST)"