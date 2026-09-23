"""Create a reviewable, read-only staging dataset from DOCX/PDF university files."""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import zipfile
from pathlib import Path
from typing import Iterable
from xml.etree import ElementTree as ET

WORD_NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
LABELS = [
    "Degree",
    "Course location",
    "Teaching language",
    "Languages",
    "Programme duration",
    "Beginning",
    "Application deadline",
    "Tuition fees per semester in EUR",
    "Academic admission requirements",
    "Language requirements",
    "Submit application to",
    "Description/content",
]
LABEL_PATTERN = re.compile(
    r"(?P<label>Degree|Course location|Teaching language|Languages|Programme duration|"
    r"Beginning|Application deadline|Tuition fees per semester in EUR|"
    r"Academic admission requirements|Language requirements|Submit application to|"
    r"Description/content)",
    re.IGNORECASE,
)
PROGRAM_PATTERN = re.compile(
    r"^(?:---?\s*)?(?:\d+\s*)?(?i:st|nd|rd|th)(?=\s|[A-Z])",
)
URL_PATTERN = re.compile(r"https?://[^\s<>\]\[)]+", re.IGNORECASE)


def clean(value: str) -> str:
    return re.sub(r"\s+", " ", value.replace("\u00a0", " ")).strip()


def read_docx(path: Path) -> str:
    with zipfile.ZipFile(path) as archive:
        root = ET.fromstring(archive.read("word/document.xml"))
    paragraphs = []
    for paragraph in root.findall(".//w:p", WORD_NS):
        text = "".join(node.text or "" for node in paragraph.findall(".//w:t", WORD_NS))
        if text.strip():
            paragraphs.append(clean(text))
    return "\n".join(paragraphs)


def read_pdf(path: Path) -> str:
    try:
        import fitz  # PyMuPDF is used only by this local staging tool.
    except ImportError as error:
        raise RuntimeError("Install PyMuPDF to include PDF sources: python -m pip install pymupdf") from error
    document = fitz.open(path)
    lines = []
    for page in document:
        blocks = sorted(page.get_text("blocks"), key=lambda block: (block[1], block[0]))
        for block in blocks:
            lines.extend(clean(line) for line in block[4].splitlines() if clean(line))
    return "\n".join(lines)


def read_source(path: Path) -> str:
    if path.suffix.lower() == ".docx":
        return read_docx(path)
    if path.suffix.lower() == ".pdf":
        return read_pdf(path)
    return ""


def split_programs(text: str) -> Iterable[str]:
    lines = [clean(line) for line in text.splitlines() if clean(line)]
    starts = [index for index, line in enumerate(lines) if PROGRAM_PATTERN.match(line)]
    if not starts:
        yield "\n".join(lines)
        return
    if starts[0] > 0:
        yield "\n".join(lines[: starts[0]])
    for offset, start in enumerate(starts):
        end = starts[offset + 1] if offset + 1 < len(starts) else len(lines)
        yield "\n".join(lines[start:end])


def extract_sections(block: str) -> dict[str, str]:
    lines = [clean(line) for line in block.splitlines() if clean(line)]
    label_map = {label.lower(): label.lower() for label in LABELS}
    matches = [
        (index, label_map[line.lower()])
        for index, line in enumerate(lines)
        if line.lower() in label_map
    ]
    sections: dict[str, str] = {}
    for index, (line_index, label) in enumerate(matches):
        next_line = matches[index + 1][0] if index + 1 < len(matches) else len(lines)
        value = clean(" ".join(lines[line_index + 1:next_line]))
        if value:
            sections[label] = value
    return sections


def first_line(block: str) -> str:
    return clean(block.splitlines()[0]) if block.splitlines() else ""


def extract_record(block: str, source: Path) -> dict:
    sections = extract_sections(block)
    urls = sorted(set(URL_PATTERN.findall(block)))
    lines = [clean(line) for line in block.splitlines() if clean(line)]
    title = first_line(block)
    program_name = re.sub(
        r"^---?\s*\d*\s*(?i:st|nd|rd|th)\s*",
        "",
        title,
    ).strip() or title
    university = ""
    for index, line in enumerate(lines[1:10], start=1):
        if "•" in line:
            current_prefix = clean(line.split("•", 1)[0])
            previous = lines[index - 1] if index > 0 else ""
            wrapped_suffix = current_prefix.startswith(("and ", "Sciences", "Design"))
            prefix = previous if wrapped_suffix and "•" not in previous else ""
            university = clean(f"{prefix} {current_prefix}")
            break
    if not university and source.stem.lower() in title.lower():
        university = source.stem
    tuition_fee = URL_PATTERN.sub("", sections.get("tuition fees per semester in eur", "Not specified"))
    return {
        "source_file": source.name,
        "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "source_block": title,
        "university_name": university,
        "program_name": program_name,
        "degree": sections.get("degree", "Not specified"),
        "course_location": sections.get("course location", "Not specified"),
        "teaching_language": sections.get("teaching language", "Not specified"),
        "language_details": sections.get("languages", "Not specified"),
        "programme_duration": sections.get("programme duration", "Not specified"),
        "intake": sections.get("beginning", "Not specified"),
        "deadlines": sections.get("application deadline", "Not specified"),
        "tuition_fee": tuition_fee or "Not specified",
        "academic_requirements": sections.get("academic admission requirements", "Not specified"),
        "language_requirements": sections.get("language requirements", "Not specified"),
        "application_details": sections.get("submit application to", "Not specified"),
        "description": sections.get("description/content", "Not specified"),
        "links": [url.rstrip(".,;") for url in urls],
        "raw_text": block,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    sources = sorted(path for path in args.source.iterdir() if path.suffix.lower() in {".docx", ".pdf"})
    records = []
    seen = set()
    skipped = []
    for source in sources:
        text = read_source(source)
        content_hash = hashlib.sha256(re.sub(r"\s+", " ", text).strip().lower().encode()).hexdigest()
        if content_hash in seen:
            skipped.append({"file": source.name, "reason": "duplicate normalized content"})
            continue
        seen.add(content_hash)
        for block in split_programs(text):
            if not clean(block):
                continue
            sections = extract_sections(block)
            core_fields = {
                "degree",
                "teaching language",
                "programme duration",
                "beginning",
                "application deadline",
                "description/content",
            }
            if not (set(sections) & core_fields):
                continue
            record = extract_record(block, source)
            if not record["university_name"] and record["degree"] == "Not specified":
                continue
            if (
                record["program_name"].casefold() == record["university_name"].casefold()
            ):
                continue
            records.append(record)
    records.sort(key=lambda record: (
        record["university_name"].casefold(),
        record["program_name"].casefold(),
    ))
    missing_fields = []
    for record in records:
        missing = [
            field for field in (
                "university_name",
                "degree",
                "deadlines",
                "tuition_fee",
                "language_requirements",
                "application_details",
            )
            if record[field] in {"", "Not specified"}
        ]
        if missing:
            missing_fields.append({
                "university_name": record["university_name"],
                "program_name": record["program_name"],
                "source_file": record["source_file"],
                "missing_fields": missing,
            })
    payload = {
        "schema_version": 1,
        "read_only_source": str(args.source),
        "source_files": len(sources),
        "duplicate_files_skipped": skipped,
        "missing_fields_report": missing_fields,
        "records": records,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"sources={len(sources)} records={len(records)} duplicates_skipped={len(skipped)}")
    print(f"output={args.output}")


if __name__ == "__main__":
    main()
