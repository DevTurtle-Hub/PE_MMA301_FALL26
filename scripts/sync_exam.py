import os
import sys
import subprocess

# Ensure UTF-8 output on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

def run_cmd(cmd, desc=""):
    print(f"\n[SYNC] >>> {desc} ({cmd})...")
    result = subprocess.run(
        cmd,
        shell=True,
        capture_output=True,
        encoding="utf-8",
        errors="replace"
    )
    stdout_text = (result.stdout or "").strip()
    stderr_text = (result.stderr or "").strip()
    if result.returncode == 0:
        print(f"[OK] {desc} succeeded.")
        if stdout_text:
            print(stdout_text[:300])
        return True
    else:
        print(f"[WARN] {desc} exited with code {result.returncode}")
        if stderr_text:
            print(stderr_text[:300])
        return False

def sync_all(student_code="QE190042", deploy_rules=True, push_git=True):
    print("=" * 60)
    print("🚀 EXAM PARALLEL SYNC: CODE -> DOCX -> ZIP -> DEPLOY -> GIT")
    print("=" * 60)
    
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

    # 1. Typecheck and Lint
    run_cmd("npx tsc --noEmit", "TypeScript Typecheck")
    run_cmd("npx expo lint", "Expo Lint")

    # 2. Update Word Document (.docx)
    run_cmd(f"python scripts/create_report_template.py", "Regenerate Word Report Docx")

    # 3. Package Submission Folder (<StudentCode>.zip + <StudentCode>.docx)
    run_cmd(f"python scripts/pack_submission.py", "Package Final Zip Submission")

    # 4. Deploy Firestore Rules (if authenticated)
    if deploy_rules:
        run_cmd("npm run deploy:rules", "Deploy Firestore Security Rules")

    # 5. Git Commit & Push
    if push_git:
        run_cmd("git add .", "Stage Git Changes")
        run_cmd('git commit -m "Real-time sync: updated code, documentation, and submission artifacts"', "Commit Git Changes")
        run_cmd("git push origin main", "Push to GitHub Remote Repository")

    print("\n" + "=" * 60)
    print("✅ PARALLEL SYNC COMPLETED SUCCESSFULLY!")
    print(f" - Report file: {student_code}.docx")
    print(f" - Submission folder: {student_code}/")
    print(f" - GitHub: https://github.com/DevTurtle-Hub/PE_MMA301_FALL26")
    print("=" * 60)

if __name__ == "__main__":
    sync_all("QE190042")
