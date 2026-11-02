import os
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

def create_report(student_code="QE190042", full_name="Nguyen Van Quy", output_filename=None):
    if not output_filename:
        output_filename = f"{student_code}.docx"

    doc = Document()

    # Set Margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)

    # Document Title
    title = doc.add_paragraph()
    title_run = title.add_run("PRACTICAL EXAM REPORT - MMA301")
    title_run.bold = True
    title_run.font.size = Pt(20)
    title_run.font.color.rgb = RGBColor(37, 99, 235) # Blue
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER

    sub_title = doc.add_paragraph()
    sub_run = sub_title.add_run("Course: Mobile Multi-platform Application Development (MMA301)")
    sub_run.font.size = Pt(11)
    sub_run.font.italic = True
    sub_title.alignment = WD_ALIGN_PARAGRAPH.CENTER

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # Required Information Section (Template from Section 4 of exam)
    info_heading = doc.add_heading("1. Student & Project Information", level=1)
    info_heading.paragraph_format.space_after = Pt(8)

    info_data = [
        ("Student Code", student_code),
        ("Full Name", full_name),
        ("GitHub Repository URL", "https://github.com/DevTurtle-Hub/PE_MMA301_FALL26"),
        ("Expo Project Link", "https://expo.dev/accounts/devturtle/projects/PE_MMA301_FALL26"),
        ("Firebase Project ID", "pemma301fall26"),
        ("Test account email", f"grader.{student_code.lower()}@example.com"),
        ("Test account password", "Test1234!"),
    ]

    table = doc.add_table(rows=len(info_data), cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    for i, (label, val) in enumerate(info_data):
        row = table.rows[i]
        cell_lbl, cell_val = row.cells[0], row.cells[1]
        cell_lbl.width = Inches(2.2)
        cell_val.width = Inches(4.3)
        
        p_lbl = cell_lbl.paragraphs[0]
        r_lbl = p_lbl.add_run(label)
        r_lbl.bold = True
        r_lbl.font.size = Pt(10.5)

        p_val = cell_val.paragraphs[0]
        r_val = p_val.add_run(val)
        r_val.font.size = Pt(10.5)
        if val.startswith("http"):
            r_val.font.color.rgb = RGBColor(37, 99, 235)
            r_val.underline = True

    doc.add_paragraph().paragraph_format.space_after = Pt(16)

    # Section 2: Screenshots Checklist & Placeholders (Section 3 of exam)
    doc.add_heading("2. Application Screenshots & Feature Verification", level=1)
    p_desc = doc.add_paragraph()
    p_desc.add_run(
        "Below are all 16 required screenshots captured from the application and Firebase Console, "
        "ordered and captioned exactly as specified in the exam requirements."
    ).font.size = Pt(10.5)

    screenshots_list = [
        ("1. Firebase console — Authentication", "The Users list showing your test account."),
        ("2. Firebase console — Firestore data", "The books collection with at least 3 sample documents belonging to your test account."),
        ("3. Firebase console — Security Rules", "The Rules tab showing the rules you actually have published, not just saved in an editor."),
        ("4. Register screen — validation", "The form submitted empty, showing the error messages."),
        ("5. Register screen — success", "Right after a successful sign-up, showing Registration successful."),
        ("6. Login screen", "The empty sign-in form."),
        ("7. List screen — after login", "Showing the user’s e-mail, the Logout button, and at least 3 books already in the list."),
        ("8. Add Book form — validation", "The form submitted empty or with bad input, showing the error messages."),
        ("9. Add Book form — success", "Right after adding a book, showing Book added and the new book now in the list."),
        ("10. Filters and search", "The genre filter, status filter, favorites-only switch, and search box each changing what is shown."),
        ("11. Summary", "book-count, favorite-count and the status breakdown visible, with more than one status represented."),
        ("12. Detail screen — view mode", "One book’s full details (title, author, genre, status, rating, notes)."),
        ("13. Detail screen — edit mode, validation", "An edit submitted with bad input, showing the error messages."),
        ("14. Detail screen — after Save", "Showing the edited values now saved."),
        ("15. Favorite toggle and Delete", "A before/after pair showing the star toggled, and a book deleted and gone from the list."),
        ("16. Empty state", "The books-empty screen with the text No books found (captured with a fresh account without books)."),
    ]

    screenshots_dir = os.path.join(os.getcwd(), "screenshots")
    if not os.path.exists(screenshots_dir):
        os.makedirs(screenshots_dir)

    for idx, (title_text, desc_text) in enumerate(screenshots_list, 1):
        doc.add_heading(title_text, level=2)
        p_note = doc.add_paragraph()
        r_note = p_note.add_run(f"Description: {desc_text}")
        r_note.font.size = Pt(10)
        r_note.font.italic = True

        # Check if an image exists in screenshots/
        img_candidates = [
            os.path.join(screenshots_dir, f"{idx}.png"),
            os.path.join(screenshots_dir, f"{idx}.jpg"),
            os.path.join(screenshots_dir, f"{idx}.jpeg"),
        ]
        found_img = next((c for c in img_candidates if os.path.exists(c)), None)

        if found_img:
            doc.add_picture(found_img, width=Inches(5.0))
            caption = doc.add_paragraph()
            r_cap = caption.add_run(f"Caption: {title_text}")
            r_cap.font.size = Pt(9.5)
            r_cap.font.bold = True
            caption.alignment = WD_ALIGN_PARAGRAPH.CENTER
        else:
            p_placeholder = doc.add_paragraph()
            p_placeholder.paragraph_format.space_before = Pt(8)
            p_placeholder.paragraph_format.space_after = Pt(12)
            r_ph = p_placeholder.add_run(f"[ CHÈN ẢNH VÀO ĐÂY HOẶC ĐỂ FILE screenshots/{idx}.png ]")
            r_ph.font.color.rgb = RGBColor(156, 163, 175)
            r_ph.font.bold = True
            p_placeholder.alignment = WD_ALIGN_PARAGRAPH.CENTER

    doc.save(output_filename)
    print(f"Report document successfully created at: {output_filename}")

if __name__ == "__main__":
    create_report("QE190042", "Nguyen Van Quy")
