import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QRCodeService {

  constructor() { }

  // Generate a more sophisticated QR code pattern
  generateQRCodeSVG(data: string, size: number = 120): string {
    const modules = 25; // QR code grid size
    const moduleSize = size / modules;
    const quietZone = 2; // Border modules
    
    let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="background: white;">`;
    
    // Generate pattern based on data
    const pattern = this.generateQRPattern(data, modules);
    
    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        if (pattern[row][col]) {
          const x = col * moduleSize;
          const y = row * moduleSize;
          svg += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="#000"/>`;
        }
      }
    }
    
    // Add finder patterns (corner squares)
    svg += this.addFinderPattern(0, 0, moduleSize);
    svg += this.addFinderPattern((modules - 7) * moduleSize, 0, moduleSize);
    svg += this.addFinderPattern(0, (modules - 7) * moduleSize, moduleSize);
    
    svg += '</svg>';
    return svg;
  }

  private generateQRPattern(data: string, size: number): boolean[][] {
    const pattern: boolean[][] = [];
    
    // Initialize pattern
    for (let i = 0; i < size; i++) {
      pattern[i] = new Array(size).fill(false);
    }
    
    // Generate pattern based on data hash
    let hash = this.hashCode(data);
    
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        // Skip finder pattern areas
        if (this.isFinderPattern(row, col, size)) {
          continue;
        }
        
        // Generate pseudo-random pattern
        hash = (hash * 1103515245 + 12345) & 0x7fffffff;
        pattern[row][col] = (hash % 3) === 0;
      }
    }
    
    return pattern;
  }

  private isFinderPattern(row: number, col: number, size: number): boolean {
    // Top-left finder pattern
    if (row < 9 && col < 9) return true;
    // Top-right finder pattern
    if (row < 9 && col >= size - 9) return true;
    // Bottom-left finder pattern
    if (row >= size - 9 && col < 9) return true;
    
    return false;
  }

  private addFinderPattern(x: number, y: number, moduleSize: number): string {
    const size = 7 * moduleSize;
    let pattern = '';
    
    // Outer black square
    pattern += `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="#000"/>`;
    // Inner white square
    pattern += `<rect x="${x + moduleSize}" y="${y + moduleSize}" width="${5 * moduleSize}" height="${5 * moduleSize}" fill="#fff"/>`;
    // Center black square
    pattern += `<rect x="${x + 2 * moduleSize}" y="${y + 2 * moduleSize}" width="${3 * moduleSize}" height="${3 * moduleSize}" fill="#000"/>`;
    // Inner center white square
    pattern += `<rect x="${x + 3 * moduleSize}" y="${y + 3 * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="#fff"/>`;
    
    return pattern;
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Generate animated QR code with loading effect
  generateAnimatedQRCodeSVG(data: string, size: number = 120): string {
    const qrCode = this.generateQRCodeSVG(data, size);
    
    // Add animation wrapper
    const animatedQR = qrCode.replace(
      '<svg',
      `<svg style="animation: qrFadeIn 1s ease-in-out;"`
    );
    
    return animatedQR + `
      <style>
        @keyframes qrFadeIn {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
      </style>
    `;
  }

  // Generate barcode SVG
  generateBarcodeSVG(data: string, width: number = 200, height: number = 50): string {
    let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="background: white;">`;
    
    const barWidth = width / (data.length * 2);
    let x = 0;
    
    for (let i = 0; i < data.length && x < width - 10; i++) {
      const charCode = data.charCodeAt(i);
      const currentBarWidth = Math.max(1, (charCode % 4) + 1);
      const isBlack = charCode % 2 === 0;
      
      if (isBlack) {
        svg += `<rect x="${x}" y="0" width="${currentBarWidth}" height="${height}" fill="#000"/>`;
      }
      x += currentBarWidth + 1;
    }
    
    // Add start and end markers
    svg += `<rect x="0" y="0" width="2" height="${height}" fill="#000"/>`;
    svg += `<rect x="${width - 2}" y="0" width="2" height="${height}" fill="#000"/>`;
    
    svg += '</svg>';
    return svg;
  }
}