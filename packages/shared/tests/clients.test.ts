import fs from "fs";
import path from "path";
import {
  ClientConfigSchema,
  RoomsConfigSchema,
  PoliciesConfigSchema,
  ContentConfigSchema
} from "../src";

describe("Clients Directory Validation", () => {
  const clientsDir = path.resolve(__dirname, "../../../clients");
  const clientFolders = fs.readdirSync(clientsDir).filter((name) => {
    return fs.statSync(path.join(clientsDir, name)).isDirectory();
  });

  it("should contain at least _template and gayatree-stay", () => {
    expect(clientFolders).toContain("_template");
    expect(clientFolders).toContain("gayatree-stay");
  });

  clientFolders.forEach((slug) => {
    describe(`Client: [${slug}]`, () => {
      const dir = path.join(clientsDir, slug);

      it("validates config.json against ClientConfigSchema", () => {
        const filePath = path.join(dir, "config.json");
        expect(fs.existsSync(filePath)).toBe(true);
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        const result = ClientConfigSchema.safeParse(data);
        if (!result.success) {
          const formatted = result.error.issues
            .map((i) => `field '${i.path.join(".")}': ${i.message}`)
            .join(", ");
          throw new Error(`Failed to parse config.json for ${slug}: ${formatted}`);
        }
        expect(result.success).toBe(true);
      });

      it("validates rooms.json against RoomsConfigSchema", () => {
        const filePath = path.join(dir, "rooms.json");
        expect(fs.existsSync(filePath)).toBe(true);
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        const result = RoomsConfigSchema.safeParse(data);
        if (!result.success) {
          const formatted = result.error.issues
            .map((i) => `field '${i.path.join(".")}': ${i.message}`)
            .join(", ");
          throw new Error(`Failed to parse rooms.json for ${slug}: ${formatted}`);
        }
        expect(result.success).toBe(true);
      });

      it("validates policies.json against PoliciesConfigSchema", () => {
        const filePath = path.join(dir, "policies.json");
        expect(fs.existsSync(filePath)).toBe(true);
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        const result = PoliciesConfigSchema.safeParse(data);
        if (!result.success) {
          const formatted = result.error.issues
            .map((i) => `field '${i.path.join(".")}': ${i.message}`)
            .join(", ");
          throw new Error(`Failed to parse policies.json for ${slug}: ${formatted}`);
        }
        expect(result.success).toBe(true);
      });

      it("validates content.json against ContentConfigSchema", () => {
        const filePath = path.join(dir, "content.json");
        expect(fs.existsSync(filePath)).toBe(true);
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        const result = ContentConfigSchema.safeParse(data);
        if (!result.success) {
          const formatted = result.error.issues
            .map((i) => `field '${i.path.join(".")}': ${i.message}`)
            .join(", ");
          throw new Error(`Failed to parse content.json for ${slug}: ${formatted}`);
        }
        expect(result.success).toBe(true);
      });

      it("has all required asset directories", () => {
        const requiredAssets = [
          "logo",
          "hero",
          "gallery/rooms",
          "gallery/property",
          "gallery/nearby"
        ];
        for (const sub of requiredAssets) {
          const assetPath = path.join(dir, "assets", sub);
          expect(fs.existsSync(assetPath)).toBe(true);
        }
      });
    });
  });
});
