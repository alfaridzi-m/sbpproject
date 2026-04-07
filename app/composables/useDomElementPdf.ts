import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const DEFAULT_ATTEMPTS: Array<{ scale: number; quality: number }> = [
  { scale: 2, quality: 0.65 },
  { scale: 1.5, quality: 0.55 },
  { scale: 1, quality: 0.45 },
  { scale: 0.85, quality: 0.35 },
  { scale: 0.7, quality: 0.28 },
]

export interface DomElementPdfOptions {
  /** Default 6 MiB */
  maxBytes?: number
  scaleQualityAttempts?: Array<{ scale: number; quality: number }>
  /**
   * html2canvas clones the DOM into a temporary document; use this to patch
   * that clone before rasterizing (e.g. inline BMKG logo as PNG).
   */
  patchClonedDocument?: (clonedDoc: Document) => void
}

/**
 * Rasterizes a DOM subtree with html2canvas (clone + paint), then builds a PDF with jsPDF.
 * Multi-page A4 when the captured content is taller than one page.
 */
export async function exportDomElementToPdfBlob(
  element: HTMLElement,
  options: DomElementPdfOptions = {}
): Promise<Blob> {
  const maxBytes = options.maxBytes ?? 6 * 1024 * 1024
  const attempts = options.scaleQualityAttempts ?? DEFAULT_ATTEMPTS

  let lastBlob: Blob | null = null

  for (const { scale, quality } of attempts) {
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        options.patchClonedDocument?.(clonedDoc)
        clonedDoc.querySelectorAll<HTMLElement>('.pdf-page').forEach((page) => {
          page.style.marginTop = '0'
          page.style.borderTop = 'none'
          page.style.boxShadow = 'none'
        })
      },
    })

    const blob = canvasToPdfBlob(canvas, quality)
    lastBlob = blob
    if (blob.size <= maxBytes) return blob
  }

  return lastBlob ?? new Blob()
}

function canvasToPdfBlob(canvas: HTMLCanvasElement, jpegQuality: number): Blob {
  const pdf = new jsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
    compress: true,
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const imgData = canvas.toDataURL('image/jpeg', jpegQuality)
  const imgWidth = pageWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  let heightLeft = imgHeight
  let position = 0

  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
  heightLeft -= pageHeight

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight
    pdf.addPage()
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
    heightLeft -= pageHeight
  }

  return pdf.output('blob')
}

export async function triggerPdfDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
