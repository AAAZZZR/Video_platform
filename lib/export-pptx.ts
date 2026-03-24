import type { SceneData } from "@/src/types";
import PptxGenJS from "pptxgenjs";

// Extract first hex color from CSS gradient for PPTX background
function extractBgColor(background: string): string {
  const match = background.match(/#([0-9a-fA-F]{6})/);
  return match ? match[1] : "0f0c29";
}

const TITLE_OPTS = {
  x: 0.5,
  y: 0.4,
  w: 12.33,
  h: 0.8,
  fontSize: 32,
  fontFace: "Arial",
  color: "FFFFFF",
  bold: true,
} as const;

function addTitle(slide: PptxGenJS.Slide, title: string) {
  slide.addText(title, TITLE_OPTS);
}

export async function exportToPptx(
  scenes: SceneData[],
  filename = "VidCraft-Export",
): Promise<void> {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "VidCraft AI";

  for (const scene of scenes) {
    const slide = pptx.addSlide();
    const bgColor = extractBgColor(scene.background);
    slide.background = { color: bgColor };

    switch (scene.type) {
      case "title": {
        slide.addText(scene.title, {
          x: 0.5,
          y: 2.2,
          w: 12.33,
          h: 1.5,
          fontSize: 44,
          fontFace: "Arial",
          color: "FFFFFF",
          bold: true,
          align: "center",
        });
        slide.addText(scene.subtitle, {
          x: 1.5,
          y: 3.9,
          w: 10.33,
          h: 1.0,
          fontSize: 24,
          fontFace: "Arial",
          color: "CCCCCC",
          align: "center",
        });
        break;
      }

      case "text": {
        addTitle(slide, scene.title);
        slide.addText(scene.body, {
          x: 0.5,
          y: 1.6,
          w: 12.33,
          h: 5.0,
          fontSize: 18,
          fontFace: "Arial",
          color: "E0E0E0",
          valign: "top",
        });
        break;
      }

      case "bullets": {
        addTitle(slide, scene.title);
        slide.addText(
          scene.items.map((item) => ({
            text: item,
            options: {
              bullet: true,
              color: "E0E0E0",
              fontSize: 20,
              fontFace: "Arial",
              breakLine: true as const,
              paraSpaceBefore: 8,
            },
          })),
          { x: 0.5, y: 1.6, w: 12.33, h: 5.2 },
        );
        break;
      }

      case "table": {
        addTitle(slide, scene.title);
        const headerRow: PptxGenJS.TableCell[] = scene.headers.map((h) => ({
          text: h,
          options: {
            bold: true,
            color: "FFFFFF",
            fill: { color: "333333" },
            fontSize: 14,
            fontFace: "Arial",
          },
        }));
        const dataRows: PptxGenJS.TableCell[][] = scene.rows.map((row) =>
          row.map((cell) => ({
            text: cell,
            options: {
              color: "E0E0E0",
              fontSize: 13,
              fontFace: "Arial",
            },
          })),
        );
        const colW = scene.headers.length > 0
          ? Array(scene.headers.length).fill(12.33 / scene.headers.length)
          : undefined;
        slide.addTable([headerRow, ...dataRows], {
          x: 0.5,
          y: 1.6,
          w: 12.33,
          colW,
          border: { color: "444444", pt: 1, type: "solid" },
          autoPage: false,
        });
        break;
      }

      case "chart-bar": {
        addTitle(slide, scene.title);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        slide.addChart((pptx as any).charts.BAR, [
          {
            name: scene.unit || "Value",
            labels: scene.items.map((i) => i.label),
            values: scene.items.map((i) => i.value),
          },
        ], {
          x: 0.5,
          y: 1.6,
          w: 12.33,
          h: 5.2,
          showValue: true,
          catAxisLabelColor: "CCCCCC",
          valAxisLabelColor: "CCCCCC",
          chartColors: ["6C63FF"],
          showLegend: false,
        });
        break;
      }

      case "stats": {
        addTitle(slide, scene.title);
        const count = scene.items.length;
        const itemW = 12.33 / Math.max(count, 1);
        scene.items.forEach((item, i) => {
          slide.addText(item.value, {
            x: 0.5 + i * itemW,
            y: 2.5,
            w: itemW,
            h: 1.5,
            fontSize: 48,
            fontFace: "Arial",
            bold: true,
            color: "FFFFFF",
            align: "center",
          });
          slide.addText(item.label, {
            x: 0.5 + i * itemW,
            y: 4.2,
            w: itemW,
            h: 0.8,
            fontSize: 16,
            fontFace: "Arial",
            color: "CCCCCC",
            align: "center",
          });
        });
        break;
      }

      case "comparison": {
        addTitle(slide, scene.title);
        // Left column
        slide.addText(scene.leftTitle, {
          x: 0.5,
          y: 1.6,
          w: 5.8,
          h: 0.6,
          fontSize: 22,
          fontFace: "Arial",
          bold: true,
          color: "FFFFFF",
        });
        slide.addText(
          scene.leftItems.map((item) => ({
            text: item,
            options: { bullet: true, color: "E0E0E0", fontSize: 17, fontFace: "Arial", breakLine: true as const, paraSpaceBefore: 6 },
          })),
          { x: 0.5, y: 2.4, w: 5.8, h: 4.4 },
        );
        // Divider
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        slide.addShape((pptx as any).shapes.LINE, {
          x: 6.66,
          y: 1.6,
          w: 0,
          h: 5.2,
          line: { color: "444444", width: 1 },
        });
        // Right column
        slide.addText(scene.rightTitle, {
          x: 7.03,
          y: 1.6,
          w: 5.8,
          h: 0.6,
          fontSize: 22,
          fontFace: "Arial",
          bold: true,
          color: "FFFFFF",
        });
        slide.addText(
          scene.rightItems.map((item) => ({
            text: item,
            options: { bullet: true, color: "E0E0E0", fontSize: 17, fontFace: "Arial", breakLine: true as const, paraSpaceBefore: 6 },
          })),
          { x: 7.03, y: 2.4, w: 5.8, h: 4.4 },
        );
        break;
      }

      case "quote": {
        slide.addText(`\u201C${scene.quote}\u201D`, {
          x: 1.0,
          y: 2.0,
          w: 11.33,
          h: 3.0,
          fontSize: 28,
          fontFace: "Arial",
          color: "FFFFFF",
          italic: true,
          align: "center",
          valign: "middle",
        });
        slide.addText(`\u2014 ${scene.author}`, {
          x: 1.0,
          y: 5.2,
          w: 11.33,
          h: 0.6,
          fontSize: 18,
          fontFace: "Arial",
          color: "CCCCCC",
          align: "center",
        });
        break;
      }

      case "code": {
        addTitle(slide, scene.title);
        slide.addText(scene.code, {
          x: 0.5,
          y: 1.6,
          w: 12.33,
          h: 5.2,
          fontSize: 14,
          fontFace: "Courier New",
          color: "E0E0E0",
          fill: { color: "111111" },
          valign: "top",
          paraSpaceAfter: 4,
        });
        // Language label
        if (scene.language) {
          slide.addText(scene.language, {
            x: 11.0,
            y: 1.2,
            w: 1.8,
            h: 0.4,
            fontSize: 10,
            fontFace: "Arial",
            color: "888888",
            align: "right",
          });
        }
        break;
      }
    }
  }

  await pptx.writeFile({ fileName: `${filename}.pptx` });
}
