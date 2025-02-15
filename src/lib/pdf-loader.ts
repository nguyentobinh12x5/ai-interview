import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "langchain/document";
import axios from "axios";

export type PDFSource = {
  type: "url" | "local" | "buffer";
  source: string | Buffer;
};

export async function getPDFContent(pdfSource: PDFSource): Promise<string> {
  let docs: Document[] = [];

  try {
    switch (pdfSource.type) {
      case "url": {
        // Download PDF from URL
        const response = await axios.get(pdfSource.source as string, {
          responseType: "arraybuffer",
        });
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const loader = new WebPDFLoader(pdfBlob);
        docs = await loader.load();
        break;
      }
      case "local": {
        // Handle local file system PDF using PDFLoader
        const loader = new PDFLoader(pdfSource.source as string);
        docs = await loader.load();
        break;
      }
      case "buffer": {
        // Handle Buffer (e.g., from fs.readFile)
        const pdfBlob = new Blob([pdfSource.source as Buffer], {
          type: "application/pdf",
        });
        const loader = new WebPDFLoader(pdfBlob);
        docs = await loader.load();
        break;
      }
      default:
        throw new Error("Unsupported PDF source type");
    }
    const content = docs.map((doc) => doc.pageContent).join("\n");
    return content;
  } catch (e) {
    console.error(e);
    throw new Error("PDF content extraction failed!");
  }
}
