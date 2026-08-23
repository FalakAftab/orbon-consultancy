import os
import glob
# pyrefly: ignore [missing-import]
import pymupdf as fitz # PyMuPDF

def convert_pdfs_in_dir(src_dir, dest_dir, dpi=150):
    os.makedirs(dest_dir, exist_ok=True)
    pdf_files = glob.glob(os.path.join(src_dir, "*.pdf"))
    print(f"Found {len(pdf_files)} PDFs in {src_dir}")
    
    for pdf_path in pdf_files:
        base_name = os.path.splitext(os.path.basename(pdf_path))[0]
        # Clean filename for URL safety
        clean_name = base_name.replace(" ", "_").replace("·", "").replace("—", "_").replace("(", "").replace(")", "")
        try:
            doc = fitz.open(pdf_path)
            for i, page in enumerate(doc):
                pix = page.get_pixmap(dpi=dpi)
                out_filename = f"{clean_name}.png" if len(doc) == 1 else f"{clean_name}_p{i+1}.png"
                out_path = os.path.join(dest_dir, out_filename)
                pix.save(out_path)
                print(f"Saved: {out_path}")
            doc.close()
        except Exception as e:
            print(f"Error converting {pdf_path}: {e}")

if __name__ == "__main__":
    base_dir = r"d:\New_Xampp\htdocs\Consultancy\germany-study-recommender"
    
    # Figma screens (LandingPage.zip -> figma_landing1)
    convert_pdfs_in_dir(
        os.path.join(base_dir, "figma_landing1"),
        os.path.join(base_dir, "frontend-react", "public", "figma_screens"),
        dpi=150
    )
    
    # Figma asset images (LandingPage (1).zip -> figma_landing2)
    convert_pdfs_in_dir(
        os.path.join(base_dir, "figma_landing2"),
        os.path.join(base_dir, "frontend-react", "public", "figma_assets"),
        dpi=150
    )
    print("All conversions complete!")
