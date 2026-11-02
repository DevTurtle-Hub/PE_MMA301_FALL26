import os
import zipfile
import shutil

def pack_submission(student_code="QE190042"):
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    dist_folder = os.path.join(root_dir, student_code)
    
    if os.path.exists(dist_folder):
        shutil.rmtree(dist_folder)
    os.makedirs(dist_folder)

    # 1. Copy Word document
    docx_file = f"{student_code}.docx"
    docx_path = os.path.join(root_dir, docx_file)
    if os.path.exists(docx_path):
        shutil.copy(docx_path, os.path.join(dist_folder, docx_file))
        print(f"Copied {docx_file} into {dist_folder}")
    else:
        print(f"Warning: {docx_file} not found at project root!")

    # 2. Create Zip file (source code without node_modules, .git, .expo, .env)
    zip_filename = os.path.join(dist_folder, f"{student_code}.zip")
    
    exclude_dirs = {
        'node_modules',
        '.git',
        '.expo',
        'dist',
        'web-build',
        student_code,
        '.vscode',
        '.idea',
        '__pycache__',
    }
    
    exclude_files = {
        '.env',
        f"{student_code}.zip",
        f"{student_code}.docx",
    }

    with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(root_dir):
            # Prune excluded directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            
            for file in files:
                if file in exclude_files:
                    continue
                if file.endswith('.tsbuildinfo'):
                    continue

                abs_path = os.path.join(root, file)
                rel_path = os.path.relpath(abs_path, root_dir)
                
                # Verify that package.json is at root of the zip
                zipf.write(abs_path, rel_path)

    print(f"Successfully packaged source code into {zip_filename}")
    print(f"\nFinal submission folder prepared: {dist_folder}")
    print(f"Files ready for submission:")
    print(f" - {os.path.join(dist_folder, docx_file)}")
    print(f" - {zip_filename}")

if __name__ == "__main__":
    pack_submission("QE190042")
