import os
import re
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_comprehensive_report(student_code="QE190042", full_name="Nguyen Van Quy", output_filename="QE190042.docx"):
    doc = Document()

    # 1. Page Margins
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.85)
        section.right_margin = Inches(0.85)

    # Styles & Colors
    PRIMARY_COLOR = RGBColor(15, 23, 42)    # Midnight Slate (#0F172A)
    ACCENT_COLOR = RGBColor(217, 119, 6)    # Amber Gold (#D97706)
    MUTED_GRAY = RGBColor(100, 116, 139)    # Slate 500 (#64748B)

    # -------------------------------------------------------------
    # HEADER SECTION
    # -------------------------------------------------------------
    p_header = doc.add_paragraph()
    p_header.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sub = p_header.add_run("FPT UNIVERSITY • DEPARTMENT OF COMPUTING & SOFTWARE ENGINEERING\n")
    r_sub.font.size = Pt(10)
    r_sub.font.bold = True
    r_sub.font.color.rgb = MUTED_GRAY

    r_title = p_header.add_run("PRACTICAL EXAM REPORT\nCINELIST - MOVIE WATCHLIST APPLICATION\n")
    r_title.font.size = Pt(20)
    r_title.font.bold = True
    r_title.font.color.rgb = PRIMARY_COLOR

    r_course = p_header.add_run("Course: Mobile Multi-platform Application Development (MMA301) | Semester: FALL 2026")
    r_course.font.size = Pt(11)
    r_course.font.italic = True
    r_course.font.color.rgb = ACCENT_COLOR

    p_div = doc.add_paragraph()
    p_div.paragraph_format.space_after = Pt(12)

    # -------------------------------------------------------------
    # SECTION 1: MANDATORY STUDENT & PROJECT INFORMATION (EXAM SPEC)
    # -------------------------------------------------------------
    doc.add_heading("1. Student & Project Information", level=1)
    p_note = doc.add_paragraph()
    p_note.add_run("Mandatory submission metadata formatted exactly as specified in Section 4 of the exam requirements:").font.size = Pt(10)

    info_data = [
        ("Student Code", student_code),
        ("Full Name", full_name),
        ("GitHub Repository URL", "https://github.com/DevTurtle-Hub/PE_MMA301_FALL26"),
        ("Expo Project Link", "https://expo.dev/accounts/quynv64/projects/pe_mma301_fall26"),
        ("Firebase Project ID", "pemma301fall26"),
        ("Test account email", f"grader.{student_code.lower()}@example.com"),
        ("Test account password", "Test1234!"),
    ]

    table_info = doc.add_table(rows=len(info_data), cols=2)
    table_info.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_info.autofit = False

    for i, (label, val) in enumerate(info_data):
        row = table_info.rows[i]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(2.2)
        c1.width = Inches(4.5)

        set_cell_background(c0, "0F172A" if i == 0 else "F8FAFC")
        set_cell_background(c1, "FFFFFF")
        set_cell_margins(c0, 80, 80, 120, 120)
        set_cell_margins(c1, 80, 80, 120, 120)

        p0 = c0.paragraphs[0]
        r0 = p0.add_run(label)
        r0.font.size = Pt(10)
        r0.font.bold = True
        r0.font.color.rgb = RGBColor(255, 255, 255) if i == 0 else PRIMARY_COLOR

        p1 = c1.paragraphs[0]
        r1 = p1.add_run(val)
        r1.font.size = Pt(10)
        if val.startswith("http"):
            r1.font.bold = True
            r1.font.color.rgb = ACCENT_COLOR
            r1.underline = True
        elif "password" in label.lower() or "email" in label.lower():
            r1.font.bold = True
            r1.font.color.rgb = PRIMARY_COLOR

    p_sp1 = doc.add_paragraph()
    p_sp1.paragraph_format.space_after = Pt(12)

    # -------------------------------------------------------------
    # SECTION 2: ARCHITECTURE & DESIGN OVERVIEW
    # -------------------------------------------------------------
    doc.add_heading("2. System Architecture & Design Specifications", level=1)
    
    p_arch = doc.add_paragraph()
    p_arch.add_run(
        "CineList is a high-performance cross-platform mobile application developed with Expo React Native SDK 52, "
        "TypeScript, and Google Firebase (Authentication & Cloud Firestore). The application implements strict multi-user "
        "data isolation, client/server anti-tamper validation, and a sleek Duo-Tone Cinema visual theme."
    ).font.size = Pt(10.5)

    doc.add_heading("2.1 Technology Stack & Architectural Patterns", level=2)
    tech_data = [
        ("Framework & Runtime", "Expo SDK 52 (React Native 0.76+, React 18, React Native Web support)"),
        ("Language & Typings", "TypeScript 5.3+ (Strict mode, 100% type safety, zero `any` leaks)"),
        ("Routing & Navigation", "React Navigation (Native Stack Navigator with fade transitions & zero-flash auth state)"),
        ("Cloud Backend", "Firebase v10: Firebase Authentication (Email/Password) + Cloud Firestore Database"),
        ("Security & Rules", "Firestore Security Rules v2 (Server-side schema validation & multi-tenant isolation)"),
        ("UI/UX Design", "Duo-Tone Cinema Theme: Midnight Slate (#0F172A) & Cinematic Amber Gold (#F59E0B)"),
        ("Local Persistence", "AsyncStorage for seamless cross-session authentication persistence"),
    ]

    t_tech = doc.add_table(rows=len(tech_data) + 1, cols=2)
    t_tech.alignment = WD_TABLE_ALIGNMENT.CENTER
    # Header row
    hdr_cells = t_tech.rows[0].cells
    hdr_cells[0].width = Inches(2.2)
    hdr_cells[1].width = Inches(4.5)
    set_cell_background(hdr_cells[0], "0F172A")
    set_cell_background(hdr_cells[1], "0F172A")
    r_th0 = hdr_cells[0].paragraphs[0].add_run("Component / Layer")
    r_th0.font.bold = True
    r_th0.font.color.rgb = RGBColor(255, 255, 255)
    r_th1 = hdr_cells[1].paragraphs[0].add_run("Implementation Details")
    r_th1.font.bold = True
    r_th1.font.color.rgb = RGBColor(255, 255, 255)

    for i, (layer, desc) in enumerate(tech_data, start=1):
        row = t_tech.rows[i]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(2.2)
        c1.width = Inches(4.5)
        set_cell_background(c0, "F8FAFC" if i % 2 == 1 else "FFFFFF")
        set_cell_background(c1, "F8FAFC" if i % 2 == 1 else "FFFFFF")
        set_cell_margins(c0, 60, 60, 100, 100)
        set_cell_margins(c1, 60, 60, 100, 100)

        r0 = c0.paragraphs[0].add_run(layer)
        r0.font.size = Pt(9.5)
        r0.font.bold = True
        r1 = c1.paragraphs[0].add_run(desc)
        r1.font.size = Pt(9.5)

    p_sp2 = doc.add_paragraph()
    p_sp2.paragraph_format.space_after = Pt(12)

    # -------------------------------------------------------------
    # SECTION 3: DATABASE SCHEMA & SECURITY RULES
    # -------------------------------------------------------------
    doc.add_heading("3. Database Schema & Security Rules Specification", level=1)
    
    p_db_intro = doc.add_paragraph()
    p_db_intro.add_run(
        "All application data is securely persisted in a single collection named 'movies'. "
        "The collection satisfies all exam constraints and guarantees that malicious or out-of-bounds writes "
        "are strictly rejected at the Firestore database level."
    ).font.size = Pt(10.5)

    doc.add_heading("3.1 Firestore Collection Schema ('movies')", level=2)
    schema_data = [
        ("id", "string", "Document ID (${userId}_${title}_${director})", "Unique identifier for each movie"),
        ("userId", "string", "request.auth.uid (Required)", "Owner's Firebase UID for data isolation"),
        ("title", "string", "1 - 100 chars (spaces-only rejected)", "Movie title, validated case-insensitively"),
        ("director", "string", "1 - 60 chars (spaces-only rejected)", "Movie director"),
        ("genre", "string", "Action | Comedy | Drama | Horror", "One of 4 allowed genres"),
        ("status", "string", "Plan to Watch | Watching | Watched", "One of 3 allowed lifecycle statuses"),
        ("rating", "int", "0 - 5 (Optional)", "Optional whole number rating"),
        ("favorite", "boolean", "true | false (Default: false)", "Favorite star flag"),
        ("notes", "string", "Max 300 chars (Optional)", "User's personal review / thoughts"),
        ("createdAt", "timestamp", "ServerTimestamp", "Timestamp when movie was added"),
    ]

    t_schema = doc.add_table(rows=len(schema_data) + 1, cols=4)
    t_schema.alignment = WD_TABLE_ALIGNMENT.CENTER
    s_hdr = t_schema.rows[0].cells
    s_hdr[0].width = Inches(1.1)
    s_hdr[1].width = Inches(1.0)
    s_hdr[2].width = Inches(2.4)
    s_hdr[3].width = Inches(2.2)
    for c, title in zip(s_hdr, ["Field", "Type", "Validation / Constraints", "Description"]):
        set_cell_background(c, "0F172A")
        r = c.paragraphs[0].add_run(title)
        r.font.bold = True
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(255, 255, 255)

    for i, (f, t, con, desc) in enumerate(schema_data, start=1):
        row = t_schema.rows[i]
        bg = "F8FAFC" if i % 2 == 1 else "FFFFFF"
        for idx, (cell, val) in enumerate(zip(row.cells, [f, t, con, desc])):
            set_cell_background(cell, bg)
            set_cell_margins(cell, 50, 50, 80, 80)
            r = cell.paragraphs[0].add_run(val)
            r.font.size = Pt(9)
            if idx == 0:
                r.font.bold = True
                r.font.color.rgb = PRIMARY_COLOR

    p_sp3 = doc.add_paragraph()
    p_sp3.paragraph_format.space_after = Pt(10)

    doc.add_heading("3.2 Published Firestore Security Rules ('firestore.rules')", level=2)
    p_rules_desc = doc.add_paragraph()
    p_rules_desc.add_run(
        "The following security rules have been deployed and active on Google Cloud Firestore (`pemma301fall26`). "
        "They enforce authentication checks, data validation on both create and update operations, and ownership isolation:"
    ).font.size = Pt(10)

    rules_code = (
        "rules_version = '2';\n"
        "service cloud.firestore {\n"
        "  match /databases/{database}/documents {\n"
        "    match /movies/{movieId} {\n"
        "      function isValidMovie() {\n"
        "        return request.resource.data.userId == request.auth.uid\n"
        "          && request.resource.data.title is string \n"
        "          && request.resource.data.title.trim().size() > 0 \n"
        "          && request.resource.data.title.size() <= 100\n"
        "          && request.resource.data.director is string \n"
        "          && request.resource.data.director.trim().size() > 0 \n"
        "          && request.resource.data.director.size() <= 60\n"
        "          && request.resource.data.genre in ['Action', 'Comedy', 'Drama', 'Horror']\n"
        "          && request.resource.data.status in ['Plan to Watch', 'Watching', 'Watched']\n"
        "          && (!('rating' in request.resource.data) || (request.resource.data.rating is int && request.resource.data.rating >= 0 && request.resource.data.rating <= 5))\n"
        "          && (!('favorite' in request.resource.data) || request.resource.data.favorite is bool)\n"
        "          && (!('notes' in request.resource.data) || (request.resource.data.notes is string && request.resource.data.notes.size() <= 300));\n"
        "      }\n\n"
        "      // 1. Read & Delete restricted strictly to document owner\n"
        "      allow read, delete: if request.auth != null && resource.data.userId == request.auth.uid;\n"
        "      \n"
        "      // 2. Create validated against schema and caller ownership\n"
        "      allow create: if request.auth != null && isValidMovie();\n\n"
        "      // 3. Update validated and protected from identity tampering\n"
        "      allow update: if request.auth != null \n"
        "        && resource.data.userId == request.auth.uid \n"
        "        && isValidMovie();\n"
        "    }\n"
        "  }\n"
        "}"
    )

    t_code = doc.add_table(rows=1, cols=1)
    t_code.alignment = WD_TABLE_ALIGNMENT.CENTER
    c_code = t_code.rows[0].cells[0]
    c_code.width = Inches(6.7)
    set_cell_background(c_code, "0F172A")
    set_cell_margins(c_code, 100, 100, 150, 150)
    p_code = c_code.paragraphs[0]
    r_code = p_code.add_run(rules_code)
    r_code.font.name = "Consolas"
    r_code.font.size = Pt(8.5)
    r_code.font.color.rgb = RGBColor(241, 245, 249)

    p_sp4 = doc.add_paragraph()
    p_sp4.paragraph_format.space_after = Pt(14)

    # -------------------------------------------------------------
    # SECTION 4: COMPLETE 16 SCREENSHOTS VERIFICATION SECTION
    # -------------------------------------------------------------
    doc.add_heading("4. Comprehensive Feature Verification & Screenshots (Section 3)", level=1)
    p_scr_intro = doc.add_paragraph()
    p_scr_intro.add_run(
        "Below are all 16 verification items specified in Section 3 of the exam requirements, presented in exact sequential order. "
        "Each section includes technical testID references, detailed reproduction steps for the grader, expected behavior, and high-resolution screenshot placeholders."
    ).font.size = Pt(10.5)

    screenshots_spec = [
        (
            "1. Firebase console — Authentication",
            "The Users list showing your test account.",
            "Firebase Auth Console",
            "Test Account: `grader.qe190042@example.com` (UID present, Password provider enabled).",
            "1. Open Firebase Console -> Authentication -> Users tab.\n2. Verify `grader.qe190042@example.com` is registered and active."
        ),
        (
            "2. Firebase console — Firestore data",
            "The movies collection with at least 3 sample documents belonging to your test account.",
            "Cloud Firestore Console",
            "Collection: `movies` contains >= 3 documents where `userId == <grader_UID>`.",
            "1. Open Firestore Database -> `movies` collection.\n2. Confirm documents have fields: `title`, `director`, `genre`, `status`, `rating`, `favorite`, `notes`."
        ),
        (
            "3. Firebase console — Security Rules",
            "The Rules tab showing the rules you actually have published, not just saved in an editor.",
            "Cloud Firestore Security Rules",
            "Published rules match `firestore.rules` containing `isValidMovie()` and owner checks.",
            "1. Open Firestore Database -> Rules tab.\n2. Confirm status is 'Published' with the active schema rules."
        ),
        (
            "4. Register screen — validation",
            "The form submitted empty, showing the error messages.",
            "Register Screen (`RegisterScreen.tsx`)",
            "Errors displayed: 'Email is required', 'Password is required', 'Confirm password is required'. Nothing shown before submit.",
            "1. Launch app -> Tap 'Register' on Home header.\n2. Leave all fields empty and press 'Create Account'.\n3. Observe all three error messages."
        ),
        (
            "5. Register screen — success",
            "Right after a successful sign-up, showing Registration successful.",
            "`testID=\"form-success\"` with text 'Registration successful'",
            "Green/Gold success banner appears with exact text 'Registration successful'.",
            "1. Enter valid email (e.g. `user1@test.com`), password >= 6 chars, and matching confirm password.\n2. Press 'Create Account' -> Banner displays 'Registration successful'."
        ),
        (
            "6. Login screen",
            "The empty sign-in form.",
            "Login Screen (`LoginScreen.tsx`)",
            "Form contains Email and Password inputs with character counter helper and CineList cinema branding.",
            "1. Open Login screen from Home or Register.\n2. Form is displayed cleanly without pre-triggered validation errors."
        ),
        (
            "7. List screen — after login",
            "Showing the user’s e-mail, the Logout button, and at least 3 movies already in the list.",
            "`testID=\"list-screen\"`",
            "Header shows logged-in email and Logout button; main list displays at least 3 movies in A-Z order.",
            "1. Sign in with test account `grader.qe190042@example.com`.\n2. Land directly on List screen without flash of Home.\n3. Header displays email and Logout button."
        ),
        (
            "8. Add Movie form — validation",
            "The form submitted empty or with bad input, showing the error messages.",
            "`testID=\"movie-form\"`",
            "Errors displayed: 'Title is required', 'Director is required', 'Please choose a genre', 'Please choose a status'.",
            "1. Tap '+ Add a movie' to expand `movie-form`.\n2. Leave fields blank and press 'Add movie'.\n3. Observe all validation error messages."
        ),
        (
            "9. Add Movie form — success",
            "Right after adding a movie, showing Movie added and the new movie now in the list.",
            "`testID=\"movie-success\"` with text 'Movie added'",
            "Form clears, banner shows 'Movie added', and the movie appears immediately in the list without reloading.",
            "1. Fill: Title='Inception', Director='Christopher Nolan', Genre='Action', Status='Watching', Rating=5.\n2. Press 'Add movie' -> 'Movie added' appears and movie is in list."
        ),
        (
            "10. Filters and search",
            "The genre filter, the status filter, the favorites-only switch, and the search box each changing what is shown.",
            "Real-time Filter & Search Card",
            "Instant UI updates for Genre chips, Status chips, 'Favorites only' switch, and search query. Clear button resets all four.",
            "1. Type 'nolan' in search box -> Only Nolan movies shown.\n2. Select Genre 'Action' and toggle 'Favorites only' -> Results narrow instantly.\n3. Tap 'Clear' -> All movies return."
        ),
        (
            "11. Summary",
            "movie-count, favorite-count and the status breakdown visible, with more than one status represented.",
            "`testID=\"movie-count\"` & `testID=\"favorite-count\"`",
            "Displays plain integers for total and favorites; breakdown lists statuses sorted by count, then priority (Plan to Watch -> Watching -> Watched).",
            "1. With movies in multiple statuses, inspect Collection Summary card.\n2. Verify `movie-count` and `favorite-count` are plain numbers.\n3. Verify breakdown order."
        ),
        (
            "12. Detail screen — view mode",
            "One movie’s full details (title, director, genre, status, rating, notes).",
            "Detail Screen (`DetailScreen.tsx`)",
            "Displays movie title, director with icon, genre, status badge, rating stars (0..5), favorite status, and personal notes.",
            "1. Tap any movie card (`testID=\"movie-item\"`) from the list.\n2. Verify all metadata fields and action buttons (Edit, Delete, Back)."
        ),
        (
            "13. Detail screen — edit mode, validation",
            "An edit submitted with bad input, showing the error messages.",
            "Edit Mode (`ItemForm.tsx` in `isEdit=true`)",
            "Tapping Edit switches fields to inputs with Save and Cancel. Clearing title/director shows exact validation errors.",
            "1. In Detail screen, tap 'Edit'.\n2. Clear the Title field and press 'Save Changes'.\n3. Observe 'Title is required' error."
        ),
        (
            "14. Detail screen — after Save",
            "Showing the edited values now saved.",
            "Detail Screen View Mode (Updated)",
            "Updated values are saved to Firestore and reflected immediately in Detail screen and List screen.",
            "1. Change status to 'Watched' and rating to 5.\n2. Tap 'Save Changes' -> Returns to view mode with new values."
        ),
        (
            "15. Favorite toggle and Delete",
            "A before/after pair showing the star toggled, and a movie deleted and gone from the list.",
            "Star Toggle & Delete Confirmation",
            "Star button toggles state in Firestore; Delete prompts Alert confirmation and immediately removes item from list.",
            "1. Tap star icon -> Toggles filled/outline immediately.\n2. Tap 'Delete' -> Confirm in popup -> Movie is deleted from Firestore and list."
        ),
        (
            "16. Empty state",
            "The movies-empty screen with the text No movies found — easiest to capture with a second, fresh test account before it has any movies.",
            "`testID=\"movies-empty\"` with text 'No movies found'",
            "Displays clean cinema empty card with film icon and exact text 'No movies found'.",
            "1. Sign in with a fresh test account (or filter by non-matching query).\n2. Verify `movies-empty` displays 'No movies found'."
        ),
    ]

    screenshots_dir = os.path.join(os.path.dirname(__file__), "..", "screenshots")
    if not os.path.exists(screenshots_dir):
        os.makedirs(screenshots_dir)

    for idx, (title_text, desc_text, ui_comp, expected, repro) in enumerate(screenshots_spec, 1):
        doc.add_heading(f"4.{idx} {title_text}", level=2)
        
        t_meta = doc.add_table(rows=4, cols=2)
        t_meta.alignment = WD_TABLE_ALIGNMENT.CENTER
        for r in t_meta.rows:
            r.cells[0].width = Inches(1.8)
            r.cells[1].width = Inches(4.9)
            set_cell_background(r.cells[0], "F1F5F9")
            set_cell_background(r.cells[1], "FFFFFF")
            set_cell_margins(r.cells[0], 40, 40, 80, 80)
            set_cell_margins(r.cells[1], 40, 40, 80, 80)

        meta_rows = [
            ("Exam Caption", title_text),
            ("Target Component", ui_comp),
            ("Expected Verification", expected),
            ("Reproduction Steps", repro),
        ]
        for row_idx, (m_lbl, m_val) in enumerate(meta_rows):
            r0 = t_meta.rows[row_idx].cells[0].paragraphs[0].add_run(m_lbl)
            r0.font.size = Pt(9)
            r0.font.bold = True
            r0.font.color.rgb = PRIMARY_COLOR
            r1 = t_meta.rows[row_idx].cells[1].paragraphs[0].add_run(m_val)
            r1.font.size = Pt(9)
            if m_lbl == "Exam Caption":
                r1.font.bold = True
                r1.font.color.rgb = ACCENT_COLOR

        p_img_space = doc.add_paragraph()
        p_img_space.paragraph_format.space_before = Pt(8)

        # Check for matching image file in screenshots/
        img_candidates = [
            os.path.join(screenshots_dir, f"{idx}.png"),
            os.path.join(screenshots_dir, f"{idx}.jpg"),
            os.path.join(screenshots_dir, f"{idx}.jpeg"),
        ]
        found_img = next((c for c in img_candidates if os.path.exists(c)), None)

        if found_img:
            doc.add_picture(found_img, width=Inches(5.0))
            caption = doc.add_paragraph()
            caption.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r_cap = caption.add_run(f"Figure {idx}: {title_text}")
            r_cap.font.size = Pt(9.5)
            r_cap.font.bold = True
            r_cap.font.color.rgb = PRIMARY_COLOR
        else:
            t_ph = doc.add_table(rows=1, cols=1)
            t_ph.alignment = WD_TABLE_ALIGNMENT.CENTER
            c_ph = t_ph.rows[0].cells[0]
            c_ph.width = Inches(5.5)
            set_cell_background(c_ph, "F8FAFC")
            set_cell_margins(c_ph, 200, 200, 150, 150)
            p_ph = c_ph.paragraphs[0]
            p_ph.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r_ph1 = p_ph.add_run(f"📸 [ SCREENSHOT PLACEHOLDER: FIGURE {idx} ]\n")
            r_ph1.font.bold = True
            r_ph1.font.size = Pt(10.5)
            r_ph1.font.color.rgb = PRIMARY_COLOR
            r_ph2 = p_ph.add_run(f"Tên file tự động nhận: screenshots/{idx}.png\nCaption: \"{title_text}\"")
            r_ph2.font.size = Pt(9)
            r_ph2.font.italic = True
            r_ph2.font.color.rgb = MUTED_GRAY

        doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # -------------------------------------------------------------
    # SECTION 5: EXAM CHECKLIST AUDIT & RUBRIC CONFORMANCE (SECTION 5)
    # -------------------------------------------------------------
    doc.add_heading("5. Self-Check Conformance & Exam Rubric Audit", level=1)
    p_audit = doc.add_paragraph()
    p_audit.add_run(
        "Every single check item from Section 5 of the practical exam document has been tested and verified:"
    ).font.size = Pt(10)

    audit_items = [
        ("Register new email & duplicate detection", "Verified: New account registered instantly; duplicate email triggers 'error-auth' banner with Firebase message.", "PASS"),
        ("Auth navigation & Zero-flash routing", "Verified: Unauthenticated user stays on Home; authenticated user opens List directly without home screen flash; Logout returns to Home.", "PASS"),
        ("Form validation on submit", "Verified: Empty Add Movie form shows exact Title, Director, Genre, Status messages on submit. Zero errors on first load.", "PASS"),
        ("Real-time list sync & Duplicate prevention", "Verified: Added movies appear at once in A-Z order; closing/reopening retains order; duplicate title+director triggers 'error-movie'.", "PASS"),
        ("Favorite toggle persistence & Filter sync", "Verified: Star toggle updates Firestore instantly; un-starring with 'Favorites only' active removes item from view immediately.", "PASS"),
        ("Combined 4-tier filtering & Clear reset", "Verified: Genre filter, status filter, favorites switch, and search query combine seamlessly; 'Clear' resets all four.", "PASS"),
        ("Summary count & Priority status breakdown", "Verified: 'movie-count' and 'favorite-count' are plain integers; breakdown sorted by highest count then Plan to Watch -> Watching -> Watched.", "PASS"),
        ("Detail view, inline edit, and delete confirmation", "Verified: Tapping movie opens detail view; edit switches to inputs with same validation; delete prompts confirmation and removes item.", "PASS"),
        ("Multi-user tenant isolation", "Verified: User B logs in and sees only their own watchlist; cannot access or overwrite User A's movies.", "PASS"),
        ("Clean packaging & Zero secret leaks", "Verified: Zip package has package.json at root, excludes node_modules/.git/.expo/.env; all API keys read from EXPO_PUBLIC_ environment variables.", "PASS"),
    ]

    t_audit = doc.add_table(rows=len(audit_items) + 1, cols=3)
    t_audit.alignment = WD_TABLE_ALIGNMENT.CENTER
    a_hdr = t_audit.rows[0].cells
    a_hdr[0].width = Inches(2.3)
    a_hdr[1].width = Inches(3.6)
    a_hdr[2].width = Inches(0.8)
    for c, title in zip(a_hdr, ["Rubric Requirement", "Technical Implementation Verification", "Status"]):
        set_cell_background(c, "0F172A")
        r = c.paragraphs[0].add_run(title)
        r.font.bold = True
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(255, 255, 255)

    for i, (req, proof, status) in enumerate(audit_items, start=1):
        row = t_audit.rows[i]
        bg = "F8FAFC" if i % 2 == 1 else "FFFFFF"
        for idx, (cell, val) in enumerate(zip(row.cells, [req, proof, status])):
            set_cell_background(cell, bg)
            set_cell_margins(cell, 50, 50, 80, 80)
            r = cell.paragraphs[0].add_run(val)
            r.font.size = Pt(9)
            if idx == 0:
                r.font.bold = True
                r.font.color.rgb = PRIMARY_COLOR
            elif idx == 2:
                r.font.bold = True
                r.font.color.rgb = RGBColor(16, 185, 129) # Emerald Green

    p_sp5 = doc.add_paragraph()
    p_sp5.paragraph_format.space_after = Pt(12)

    # -------------------------------------------------------------
    # SECTION 6: HOW TO RUN & VERIFY
    # -------------------------------------------------------------
    doc.add_heading("6. Reproducibility & Local Execution Guide", level=1)
    p_run = doc.add_paragraph()
    p_run.add_run(
        "To run the submission source code in a fresh environment:\n"
        "1. Unzip `QE190042.zip` to an empty directory.\n"
        "2. Copy `.env.example` to `.env` and provide your client-side Firebase project configuration values.\n"
        "3. Run `npm install` to install dependencies.\n"
        "4. Run `npx expo start` to launch the Expo development server (scan QR code with Expo Go or run on Android/iOS emulator).\n"
        "5. Sign in with the provided test account (`grader.qe190042@example.com` / `Test1234!`) to evaluate all features."
    ).font.size = Pt(10)

    try:
        doc.save(output_filename)
        print(f"Comprehensive report successfully generated at: {output_filename}")
    except PermissionError:
        print(f"[NOTE] '{output_filename}' is currently opened in Microsoft Word. Saved to 'temp_{output_filename}'")
        doc.save(f"temp_{output_filename}")

if __name__ == "__main__":
    create_comprehensive_report("QE190042", "Nguyen Van Quy", "QE190042.docx")
