from collections import Counter
from pathlib import Path

def analyze_docs(directory_path):
    path = Path(directory_path)
    
    # Recursively find all .doc and .docx files
    doc_files = list(path.rglob("*.doc")) + list(path.rglob("*.docx"))
    
    print(f"Total Word documents found: {len(doc_files)}")
    
    # Extract just the filenames (ignoring the file extension)
    # E.g., 'report.docx' and 'report.doc' will both be counted as 'report'
    filenames = [file.stem for file in doc_files] 
    
    # Count occurrences of each filename
    name_counts = Counter(filenames)
    
    # Filter for names that appear more than once
    duplicates = {name: count for name, count in name_counts.items() if count > 1}
    
    if duplicates:
        print(f"\nFound {len(duplicates)} names that are duplicated across folders:")
        for name, count in duplicates.items():
            print(f" - '{name}' appears {count} times")
    else:
        print("\nNo duplicate file names found.")

# Execute the function
analyze_docs('"C:\Users\farwa\Documents\freelance\MCQS all"')