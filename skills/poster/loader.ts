import { readFileSync } from "fs";
import { join } from "path";
import type { PosterSkill } from "./schema";

/**
 * Load skill markdown files from the rules/ directory.
 * Returns the combined skill content to inject into the AI prompt.
 */
export function loadSkills(skills: PosterSkill[]): string {
  const sections: string[] = [];

  for (const skill of skills) {
    try {
      const filePath = join(process.cwd(), "skills", "poster", "rules", `${skill}.md`);
      const content = readFileSync(filePath, "utf-8");
      sections.push(`\n## Skill: ${skill}\n\n${content}`);
    } catch {
      console.warn(`Skill file not found: ${skill}.md`);
    }
  }

  if (sections.length === 0) return "";

  return `\n\n# Design Skills (apply these rules)\n${sections.join("\n")}`;
}
