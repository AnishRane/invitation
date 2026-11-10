// Regenerate on macOS: swift -module-cache-path /tmp/wedding-font-module-cache scripts/generate-ams-tushar.swift
// Uses the supplied font unchanged. The generated SVG is portable and needs no runtime converter.
import Foundation
import AppKit
import CoreText
import CoreGraphics

struct Sample: Decodable { let id: String; let text: String; let encoded: String }
struct Metric: Encodable { let id: String; let width: Double; let height: Double }
struct CustomInitial: Decodable { let advance: Double; let transform: [Double]; let paths: [String] }
let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let fontURL = root.appendingPathComponent("AMS_Tushar.ttf")
guard CTFontManagerRegisterFontsForURL(fontURL as CFURL, .process, nil) else { fatalError("Cannot load AMS_Tushar.ttf") }
let font = CTFontCreateWithName("AMSTushar" as CFString, 1000, nil)
let samples = try JSONDecoder().decode([Sample].self, from: Data(contentsOf: root.appendingPathComponent("scripts/ams-tushar-text.json")))
let initial = try JSONDecoder().decode(CustomInitial.self, from: Data(contentsOf: root.appendingPathComponent("scripts/ams-tushar-initial-a.json")))

// The reference initial is a code-native vector; the remaining lettering uses the supplied font.
func referenceInitial() -> CGPath {
    let result = CGMutablePath()
    let regex = try! NSRegularExpression(pattern: "[MCLZ]|-?[0-9]+(?:\\.[0-9]+)?")
    for source in initial.paths {
        let string = source as NSString
        let tokens = regex.matches(in: source, range: NSRange(location: 0, length: string.length)).map { string.substring(with: $0.range) }
        var index = 0
        func point() -> CGPoint {
            let x = Double(tokens[index])!, y = Double(tokens[index + 1])!
            index += 2
            return CGPoint(x: x, y: y)
        }
        let path = CGMutablePath()
        while index < tokens.count {
            let command = tokens[index]; index += 1
            switch command {
            case "M": path.move(to: point())
            case "L": path.addLine(to: point())
            case "C": let first = point(), second = point(), end = point(); path.addCurve(to: end, control1: first, control2: second)
            case "Z": path.closeSubpath()
            default: fatalError("Unsupported reference path command")
            }
        }
        let t = initial.transform
        result.addPath(path, transform: CGAffineTransform(a: t[0], b: t[1], c: t[2], d: t[3], tx: t[4], ty: t[5]))
    }
    return result
}

func nativeOutline(_ value: String) -> CGPath {
    let attributes = [kCTFontAttributeName as NSAttributedString.Key: font]
    let line = CTLineCreateWithAttributedString(NSAttributedString(string: value, attributes: attributes))
    let result = CGMutablePath()
    for run in CTLineGetGlyphRuns(line) as! [CTRun] {
        let count = CTRunGetGlyphCount(run)
        var glyphs = [CGGlyph](repeating: 0, count: count)
        var positions = [CGPoint](repeating: .zero, count: count)
        CTRunGetGlyphs(run, CFRange(location: 0, length: 0), &glyphs)
        CTRunGetPositions(run, CFRange(location: 0, length: 0), &positions)
        for index in 0..<count {
            guard glyphs[index] != 0 else { fatalError("Missing glyph in \(value)") }
            if let path = CTFontCreatePathForGlyph(font, glyphs[index], nil) {
                result.addPath(path, transform: CGAffineTransform(translationX: positions[index].x, y: positions[index].y))
            }
        }
    }
    return result
}
func outline(_ value: String) -> CGPath {
    let result = CGMutablePath()
    let parts = value.components(separatedBy: "Aa")
    var advance: CGFloat = 0
    for (index, part) in parts.enumerated() {
        result.addPath(nativeOutline(part), transform: CGAffineTransform(translationX: advance, y: 0))
        let line = CTLineCreateWithAttributedString(NSAttributedString(string: part, attributes: [kCTFontAttributeName as NSAttributedString.Key: font]))
        advance += CGFloat(CTLineGetTypographicBounds(line, nil, nil, nil))
        if index < parts.count - 1 {
            result.addPath(referenceInitial(), transform: CGAffineTransform(translationX: advance, y: 0))
            advance += CGFloat(initial.advance)
        }
    }
    return result
}
func number(_ value: CGFloat) -> String { String(format: "%.2f", locale: Locale(identifier: "en_US_POSIX"), Double(value)) }
func svgPath(_ path: CGPath) -> String {
    var result = ""
    path.applyWithBlock { pointer in
        let element = pointer.pointee
        func point(_ index: Int) -> String { "\(number(element.points[index].x)) \(number(element.points[index].y))" }
        switch element.type {
        case .moveToPoint: result += "M\(point(0))"
        case .addLineToPoint: result += "L\(point(0))"
        case .addQuadCurveToPoint: result += "Q\(point(0)) \(point(1))"
        case .addCurveToPoint: result += "C\(point(0)) \(point(1)) \(point(2))"
        case .closeSubpath: result += "Z"
        @unknown default: fatalError("Unsupported path element")
        }
    }
    return result
}
var symbols = "", metrics: [String: Metric] = [:]
for sample in samples {
    let path = outline(sample.encoded)
    let bounds = path.boundingBoxOfPath.insetBy(dx: -12, dy: -12)
    // A vertical flip converts CoreText's upward Y axis to SVG coordinates.
    var transform = CGAffineTransform(a: 1, b: 0, c: 0, d: -1, tx: -bounds.minX, ty: bounds.maxY)
    let normalized = path.copy(using: &transform)!
    symbols += "<symbol id=\"\(sample.id)\" viewBox=\"0 0 \(number(bounds.width)) \(number(bounds.height))\"><path fill=\"currentColor\" d=\"\(svgPath(normalized))\"/></symbol>\n"
    metrics[sample.text] = Metric(id: sample.id, width: Double(bounds.width), height: Double(bounds.height))
}
let svg = "<svg xmlns=\"http://www.w3.org/2000/svg\"><defs>\n\(symbols)</defs></svg>\n"
try svg.write(to: root.appendingPathComponent("public/calligraphy/ams-tushar.svg"), atomically: true, encoding: .utf8)
let encoder = JSONEncoder(); encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
try encoder.encode(metrics).write(to: root.appendingPathComponent("src/lib/ams-tushar-metrics.json"))
print("Generated \(samples.count) AMS Tushar lettering assets.")

if CommandLine.arguments.contains("--proof") {
    let columns = 3, cellWidth = 500, cellHeight = 300
    let width = columns * cellWidth, height = ((samples.count + columns - 1) / columns) * cellHeight
    let bitmap = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: width, pixelsHigh: height, bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: bitmap)
    let context = NSGraphicsContext.current!.cgContext
    NSColor(calibratedRed: 252/255, green: 247/255, blue: 243/255, alpha: 1).setFill()
    NSRect(x: 0, y: 0, width: width, height: height).fill()
    let color = NSColor(calibratedRed: 139/255, green: 65/255, blue: 82/255, alpha: 1)
    for (index, sample) in samples.enumerated() {
        let x = CGFloat(index % columns * cellWidth), top = CGFloat(index / columns * cellHeight)
        (sample.text as NSString).draw(at: NSPoint(x: x + 25, y: CGFloat(height) - top - 40), withAttributes: [.font: NSFont.systemFont(ofSize: 19), .foregroundColor: color])
        let path = outline(sample.encoded), bounds = path.boundingBoxOfPath
        let scale = min(440 / bounds.width, 210 / bounds.height)
        context.saveGState()
        context.translateBy(x: x + (CGFloat(cellWidth) - bounds.width * scale) / 2, y: CGFloat(height) - top - 275)
        context.scaleBy(x: scale, y: scale)
        context.translateBy(x: -bounds.minX, y: -bounds.minY)
        context.addPath(path); context.setFillColor(color.cgColor); context.fillPath()
        context.restoreGState()
    }
    NSGraphicsContext.restoreGraphicsState()
    try bitmap.representation(using: .png, properties: [:])!.write(to: root.appendingPathComponent("docs/ams-tushar-proof.png"))
    print("Updated docs/ams-tushar-proof.png")
}
